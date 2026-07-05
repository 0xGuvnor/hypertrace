import WebSocket from "ws";

type SubscriptionType = "clearinghouseState" | "openOrders" | "userFills";

type Subscription = {
  type: SubscriptionType;
  user: string;
  dex?: string;
};

type HyperliquidSocketOptions = {
  wsUrl: string;
  onUserEvent: (address: string) => void;
  onReady: () => void;
  onDisconnect: () => void;
};

function subscriptionKey(subscription: Subscription): string {
  return `${subscription.type}:${subscription.user}`;
}

export class HyperliquidSocket {
  private readonly wsUrl: string;
  private readonly onUserEvent: (address: string) => void;
  private readonly onReady: () => void;
  private readonly onDisconnect: () => void;
  private socket: WebSocket | null = null;
  private readonly active = new Set<string>();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private shouldRun = true;

  constructor(options: HyperliquidSocketOptions) {
    this.wsUrl = options.wsUrl;
    this.onUserEvent = options.onUserEvent;
    this.onReady = options.onReady;
    this.onDisconnect = options.onDisconnect;
  }

  start() {
    this.shouldRun = true;
    this.connect();
  }

  stop() {
    this.shouldRun = false;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.socket?.close();
    this.socket = null;
  }

  syncAddresses(addresses: string[]) {
    const next = new Set(addresses);
    const currentUsers = new Set(
      [...this.active].map((key) => key.split(":")[1]).filter(Boolean),
    );

    for (const user of currentUsers) {
      if (!next.has(user)) {
        this.unsubscribeUser(user);
      }
    }

    for (const user of next) {
      if (!currentUsers.has(user)) {
        this.subscribeUser(user);
      }
    }
  }

  private connect() {
    const socket = new WebSocket(this.wsUrl);
    this.socket = socket;

    socket.on("open", () => {
      console.log("[hl] connected");
      for (const user of this.usersFromActive()) {
        this.sendSubscribe(user);
      }
      this.onReady();
    });

    socket.on("message", (data) => {
      this.handleMessage(data.toString());
    });

    socket.on("close", () => {
      console.warn("[hl] disconnected");
      this.socket = null;
      this.onDisconnect();
      this.scheduleReconnect();
    });

    socket.on("error", (error) => {
      console.error("[hl] socket error", error);
    });
  }

  private scheduleReconnect() {
    if (!this.shouldRun || this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      if (this.shouldRun) {
        console.log("[hl] reconnecting");
        this.connect();
      }
    }, 2_000);
  }

  private usersFromActive(): string[] {
    const users = new Set<string>();
    for (const key of this.active) {
      const user = key.split(":")[1];
      if (user) users.add(user);
    }
    return [...users];
  }

  private subscribeUser(user: string) {
    const subscriptions: Subscription[] = [
      { type: "clearinghouseState", user, dex: "" },
      { type: "openOrders", user },
      { type: "userFills", user },
    ];

    for (const subscription of subscriptions) {
      this.active.add(subscriptionKey(subscription));
      this.send({ method: "subscribe", subscription });
    }
  }

  private unsubscribeUser(user: string) {
    const subscriptions: Subscription[] = [
      { type: "clearinghouseState", user, dex: "" },
      { type: "openOrders", user },
      { type: "userFills", user },
    ];

    for (const subscription of subscriptions) {
      this.active.delete(subscriptionKey(subscription));
      this.send({ method: "unsubscribe", subscription });
    }
  }

  private sendSubscribe(user: string) {
    this.subscribeUser(user);
  }

  private send(payload: unknown) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;
    this.socket.send(JSON.stringify(payload));
  }

  private handleMessage(raw: string) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return;
    }

    if (typeof parsed !== "object" || parsed === null) return;

    const channel = "channel" in parsed ? parsed.channel : null;
    const data = "data" in parsed ? parsed.data : null;
    if (typeof channel !== "string" || typeof data !== "object" || data === null) {
      return;
    }

    if (
      channel !== "clearinghouseState" &&
      channel !== "openOrders" &&
      channel !== "userFills"
    ) {
      return;
    }

    const user =
      "user" in data && typeof data.user === "string" ? data.user.toLowerCase() : null;
    if (!user) return;

    this.onUserEvent(user);
  }
}
