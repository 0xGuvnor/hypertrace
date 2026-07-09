export type PositionsOpenSummary = {
  longValue: number;
  shortValue: number;
  totalValue: number;
  fundingFee: number;
  unrealizedPnl: number;
};

type SummarizablePosition = {
  side: "long" | "short";
  value: string;
  fundingFee: string;
  unrealizedPnl: string;
};

function parseSumNumeric(value: string): number {
  const num = Number.parseFloat(value);
  return Number.isFinite(num) ? num : 0;
}

export function summarizeOpenPositions(
  positions: readonly SummarizablePosition[],
): PositionsOpenSummary {
  let longValue = 0;
  let shortValue = 0;
  let fundingFee = 0;
  let unrealizedPnl = 0;

  for (const position of positions) {
    const value = parseSumNumeric(position.value);
    if (position.side === "long") {
      longValue += value;
    } else {
      shortValue += value;
    }
    fundingFee += parseSumNumeric(position.fundingFee);
    unrealizedPnl += parseSumNumeric(position.unrealizedPnl);
  }

  return {
    longValue,
    shortValue,
    totalValue: longValue + shortValue,
    fundingFee,
    unrealizedPnl,
  };
}
