import { cn } from "@/lib/utils";

type AppShellProps = {
  children: React.ReactNode;
  width?: "narrow" | "wide";
  className?: string;
};

export function AppShell({
  children,
  width = "wide",
  className,
}: AppShellProps) {
  return (
    <div
      className={cn(
        "mx-auto flex min-h-svh w-full flex-col px-4 py-6 sm:px-6 sm:py-8",
        width === "narrow" ? "max-w-xl" : "max-w-4xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
