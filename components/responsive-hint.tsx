"use client";

import type { ElementType, ReactNode } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const defaultTriggerClassName =
  "cursor-default underline decoration-dotted decoration-muted-foreground underline-offset-4";

export function ResponsiveHint({
  label,
  content,
  triggerClassName,
  contentClassName,
  as: As = "span",
}: {
  label: ReactNode;
  content: ReactNode;
  triggerClassName?: string;
  contentClassName?: string;
  as?: ElementType;
}) {
  const triggerClasses = cn(defaultTriggerClassName, triggerClassName);

  return (
    <>
      <TooltipProvider delay={500}>
        <Tooltip>
          <TooltipTrigger
            className={cn("hidden md:inline-flex", triggerClasses)}
            render={<As />}
          >
            {label}
          </TooltipTrigger>
          <TooltipContent className={cn("max-w-xs text-left", contentClassName)}>
            {content}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Popover>
        <PopoverTrigger
          nativeButton={false}
          className={cn("inline-flex md:hidden", triggerClasses)}
          render={<As />}
        >
          {label}
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className={cn(
            "w-auto max-w-[min(20rem,calc(100vw-2rem))] p-3 text-xs",
            contentClassName,
          )}
        >
          {content}
        </PopoverContent>
      </Popover>
    </>
  );
}
