"use client";

import type { LeakageBar, LeakageRow } from "@/data/productDemoData";
import { askRevealClass } from "@/components/demo/ask/AskResponse/askRevealClass";
import { cn } from "@/lib/utils";

function formatCurrency(n: number): string {
  return `$${n.toLocaleString()}`;
}

type LeakageBreakdownProps = {
  bars: LeakageBar[];
  rows: LeakageRow[];
  revealed?: boolean;
};

export function LeakageBreakdown({ bars, rows, revealed = false }: LeakageBreakdownProps) {
  return (
    <div className="space-y-3">
      <div className={cn("ask-mini-viz space-y-2", askRevealClass(revealed))}>
        {bars.map((bar) => (
          <div key={bar.label} className={cn("ask-bar-row", askRevealClass(revealed))}>
            <div className="mb-1 flex justify-between text-[11px] text-brikli-green">
              <span>{bar.label}</span>
              <span className="font-medium">{formatCurrency(bar.amount)}/mo</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[#E8E8E6]">
              <div
                className={cn("ask-bar-fill h-full rounded-full bg-[#0F291E]", askRevealClass(revealed))}
                style={{ width: `${(bar.amount / bar.max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="ask-rows space-y-1.5">
        {rows.map((row) => (
          <div
            key={row.id}
            className={cn(
              "ask-row flex items-center justify-between gap-3 rounded-lg border border-[#E8E8E6] bg-white px-3 py-2.5",
              askRevealClass(revealed),
            )}
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-medium text-brikli-green">
                {row.property} · {row.unit}
              </p>
              <p className="text-[11px] text-brikli-green/70">{row.tenant}</p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <span className="rounded bg-[#E8F5EC] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-brikli-green">
                Confirmed
              </span>
              <span className="text-[12px] font-semibold text-brikli-green">
                {formatCurrency(row.amount)}/mo
              </span>
              <div className="flex flex-wrap justify-end gap-1">
                {row.sources.map((s) => (
                  <span
                    key={s}
                    className={cn(
                      "ask-evidence-chip rounded-full border border-[#E8E8E6] bg-[#FAFAF8] px-1.5 py-0.5 text-[9px] text-brikli-green",
                      askRevealClass(revealed),
                    )}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
