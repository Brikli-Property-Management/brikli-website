"use client";

import type { MarketGapRow } from "@/data/productDemoData";
import { askRevealClass } from "@/components/demo/ask/AskResponse/askRevealClass";
import { cn } from "@/lib/utils";

function formatCurrency(n: number): string {
  return `$${n.toLocaleString()}`;
}

type MarketGapRowsProps = {
  rows: MarketGapRow[];
  comparables?: {
    count: number;
    median: number;
    range: string;
    chips: string[];
  };
  caveat?: string;
  actionable?: string;
  revealed?: boolean;
};

function RentBar({ current, market }: { current: number; market: number }) {
  const pct = Math.round((current / market) * 100);
  return (
    <div className="mt-1.5 space-y-1">
      <div className="flex items-center gap-2">
        <span className="w-14 text-[10px] text-brikli-green/70">Current</span>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#E8E8E6]">
          <div
            className="ask-bar-fill h-full rounded-full bg-[#0F291E]/60"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="w-12 text-right text-[10px] font-medium text-brikli-green">
          {formatCurrency(current)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-14 text-[10px] text-brikli-green/70">Market</span>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#E8E8E6]">
          <div className="ask-bar-fill h-full w-full rounded-full bg-[#0F291E]" />
        </div>
        <span className="w-12 text-right text-[10px] font-medium text-brikli-green">
          {formatCurrency(market)}
        </span>
      </div>
    </div>
  );
}

export function MarketGapRows({
  rows,
  comparables,
  caveat,
  actionable,
  revealed = false,
}: MarketGapRowsProps) {
  return (
    <div className="space-y-2">
      <div className="ask-rows space-y-1.5">
        {rows.map((row) => (
          <div
            key={row.id}
            className={cn(
              "ask-row rounded-lg border border-[#E8E8E6] bg-white px-3 py-2.5",
              askRevealClass(revealed),
              row.expanded && "ask-row-expanded",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-medium text-brikli-green">
                  {row.property} · {row.unit}
                </p>
                <p className="text-[11px] text-brikli-green/70">{row.tenant}</p>
              </div>
              <span className="shrink-0 rounded bg-[#FEF3C7] px-1.5 py-0.5 text-[10px] font-semibold text-[#92400E]">
                −{row.gapPct}%
              </span>
            </div>
            <RentBar current={row.currentRent} market={row.marketRent} />

            {row.expanded && comparables && (
              <div className={cn("ask-comparables mt-3 border-t border-[#EFEFED] pt-3", askRevealClass(revealed))}>
                <p className="text-[11px] font-medium text-brikli-green">
                  {comparables.count} comparables · median {formatCurrency(comparables.median)} ·{" "}
                  {comparables.range}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {comparables.chips.map((chip) => (
                    <span
                      key={chip}
                      className={cn(
                        "ask-comp-chip rounded-full border border-[#E8E8E6] bg-[#FAFAF8] px-2 py-0.5 text-[10px] text-brikli-green",
                        askRevealClass(revealed),
                      )}
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {(caveat || actionable) && (
        <p className={cn("ask-caveat text-[12px] leading-relaxed text-brikli-green/80", askRevealClass(revealed))}>
          {caveat}
          {caveat && actionable && " · "}
          {actionable && <span className="font-semibold text-brikli-green">{actionable}</span>}
        </p>
      )}
    </div>
  );
}
