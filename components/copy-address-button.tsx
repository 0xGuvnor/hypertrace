"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ICON_TRANSITION =
  "absolute inset-0 size-4 transition-[opacity,transform,filter] duration-200 ease-[cubic-bezier(0.2,0,0,1)]";

export function CopyAddressButton({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={handleCopy}
      aria-label={copied ? "Address copied" : "Copy address"}
      title={copied ? "Copied" : "Copy address"}
      className={cn(
        "relative",
        "after:absolute after:top-1/2 after:left-1/2 after:size-10",
        "after:-translate-x-1/2 after:-translate-y-1/2 after:content-['']",
      )}
    >
      <span className="relative size-4 shrink-0">
        <Check
          aria-hidden
          className={cn(
            ICON_TRANSITION,
            copied
              ? "scale-100 opacity-100 blur-0"
              : "scale-[0.25] opacity-0 blur-[4px]",
          )}
        />
        <Copy
          aria-hidden
          className={cn(
            ICON_TRANSITION,
            copied
              ? "scale-[0.25] opacity-0 blur-[4px]"
              : "scale-100 opacity-100 blur-0",
          )}
        />
      </span>
    </Button>
  );
}
