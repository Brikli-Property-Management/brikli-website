"use client";

import type { ActionQueueRow } from "@/data/productDemoData";
import { askRevealClass } from "@/components/demo/ask/AskResponse/askRevealClass";
import { cn } from "@/lib/utils";

type ActionQueueProps = {
  rows: ActionQueueRow[];
  revealed?: boolean;
};

function StatusBadge({
  label,
  variant,
  daysLeft,
}: {
  label: string;
  variant: "warning" | "error" | "neutral";
  daysLeft?: number;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {daysLeft !== undefined && daysLeft <= 30 && (
        <span className="rounded bg-[#FEF3C7] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#92400E]">
          {daysLeft} days
        </span>
      )}
      <span
        className={cn(
          "rounded px-1.5 py-0.5 text-[10px] font-medium",
          variant === "error"
            ? "bg-[#FEE2E2] text-[#991B1B]"
            : variant === "warning"
              ? "bg-[#E8F5EC] text-brikli-green"
              : "bg-[#F3F4F6] text-[#6B7280]",
        )}
      >
        {label}
      </span>
    </div>
  );
}

export function ActionQueue({ rows, revealed = false }: ActionQueueProps) {
  return (
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
            <p className="text-[11px] text-brikli-green/70">
              {row.tenant} · {row.expiry}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <StatusBadge
              label={row.status}
              variant={row.statusVariant}
              daysLeft={row.daysLeft}
            />
            <span className="text-[10px] font-medium text-brikli-green/80">{row.action}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
