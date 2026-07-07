type HlRequestQueueOptions = {
  maxConcurrency: number;
  minIntervalMs: number;
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class HlRequestQueue {
  private readonly maxConcurrency: number;
  private readonly minIntervalMs: number;
  private pauseUntil = 0;
  private active = 0;
  private lastStartAt = 0;
  private readonly waiting: Array<() => void> = [];

  constructor(options: HlRequestQueueOptions) {
    this.maxConcurrency = options.maxConcurrency;
    this.minIntervalMs = options.minIntervalMs;
  }

  notifyRateLimited(backoffMs: number): void {
    this.pauseUntil = Math.max(this.pauseUntil, Date.now() + backoffMs);
  }

  run<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const start = async () => {
        try {
          await this.waitForTurn();
          resolve(await fn());
        } catch (error) {
          reject(error);
        } finally {
          this.active -= 1;
          this.pump();
        }
      };

      this.waiting.push(() => {
        void start();
      });
      this.pump();
    });
  }

  private pump(): void {
    while (this.active < this.maxConcurrency && this.waiting.length > 0) {
      const next = this.waiting.shift();
      if (!next) {
        return;
      }
      this.active += 1;
      next();
    }
  }

  private async waitForTurn(): Promise<void> {
    const now = Date.now();
    if (now < this.pauseUntil) {
      await sleep(this.pauseUntil - now);
    }

    const gap = Date.now() - this.lastStartAt;
    if (gap < this.minIntervalMs) {
      await sleep(this.minIntervalMs - gap);
    }

    this.lastStartAt = Date.now();
  }
}
