import { cn } from "@/lib/utils";

export const SHELL_WIDTH_NARROW =
  "max-w-xl xl:max-w-2xl 2xl:max-w-3xl 3xl:max-w-4xl 4xl:max-w-5xl";

export const SHELL_WIDTH_WIDE =
  "max-w-4xl xl:max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl 4xl:max-w-screen-2xl";

export const SHELL_PADDING =
  "px-4 py-6 sm:px-6 sm:py-8 3xl:px-8 4xl:px-10";

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
        "mx-auto flex min-h-svh w-full flex-col",
        SHELL_PADDING,
        width === "narrow" ? SHELL_WIDTH_NARROW : SHELL_WIDTH_WIDE,
        className,
      )}
    >
      {children}
    </div>
  );
}
