"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { truncateAddress } from "@/lib/address";

export function AddressWithTooltip({ address }: { address: string }) {
  return (
    <Tooltip>
      <TooltipTrigger
        className="cursor-default font-mono text-lg font-medium"
        render={<h1 />}
      >
        {truncateAddress(address, 6)}
      </TooltipTrigger>
      <TooltipContent className="max-w-none font-mono break-all">
        {address}
      </TooltipContent>
    </Tooltip>
  );
}
