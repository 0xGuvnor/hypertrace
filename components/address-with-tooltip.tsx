"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { truncateAddress } from "@/lib/address";

export function AddressWithTooltip({ address }: { address: string }) {
  return (
    <TooltipProvider delay={500}>
      <Tooltip>
        <TooltipTrigger
          className="cursor-default truncate font-mono text-base font-medium underline decoration-dotted decoration-muted-foreground underline-offset-4 sm:text-lg"
          render={<h1 />}
        >
          {truncateAddress(address, 6)}
        </TooltipTrigger>
        <TooltipContent className="max-w-none font-mono break-all">
          {address}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
