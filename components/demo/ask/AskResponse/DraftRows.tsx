"use client";

import type { DraftRow } from "@/data/productDemoData";
import { askRevealClass } from "@/components/demo/ask/AskResponse/askRevealClass";
import { cn } from "@/lib/utils";

function formatCurrency(n: number): string {
  return n > 0 ? `$${n.toLocaleString()}` : "—";
}

type DraftRowsProps = {
  drafts: DraftRow[];
  forms?: { region: string; form: string; count: number }[];
  stats?: { label: string; value: number }[];
  revealed?: boolean;
};

export function DraftRows({ drafts, forms, stats, revealed = false }: DraftRowsProps) {
  return (
    <div className="space-y-3">
      {stats && stats.length > 0 && (
        <div className={cn("ask-kpi-secondary flex flex-wrap gap-2", askRevealClass(revealed))}>
          {stats.map((s) => (
            <span
              key={s.label}
              className="rounded-md border border-[#E8E8E6] bg-white px-2.5 py-1 text-[11px] text-brikli-green"
            >
              <span className="font-semibold">{s.value}</span> {s.label}
            </span>
          ))}
        </div>
      )}

      {forms && forms.length > 0 && (
        <div className={cn("ask-forms flex flex-wrap gap-2", askRevealClass(revealed))}>
          {forms.map((f) => (
            <span
              key={f.region}
              className={cn(
                "rounded-md border border-[#E8E8E6] bg-[#FAFAF8] px-2.5 py-1 text-[11px] text-brikli-green",
                askRevealClass(revealed),
              )}
            >
              {f.region} · {f.form}
            </span>
          ))}
        </div>
      )}

      <div className="ask-rows grid grid-cols-2 gap-2 sm:grid-cols-4">
        {drafts.map((draft) => (
          <div
            key={draft.id}
            className={cn(
              "ask-row ask-draft-card rounded-lg border bg-white p-2.5",
              askRevealClass(revealed),
              draft.blocked ? "border-[#FECACA] bg-[#FFFBFB]" : "border-[#E8E8E6]",
            )}
          >
            <div
              className={cn(
                "ask-doc-thumb mb-2 flex h-16 items-center justify-center rounded border",
                askRevealClass(revealed),
                draft.blocked ? "border-[#FECACA] bg-[#FEF2F2]" : "border-[#E8E8E6] bg-[#FAFAF8]",
              )}
            >
              <svg width="20" height="24" viewBox="0 0 20 24" fill="none" aria-hidden>
                <rect x="2" y="1" width="16" height="22" rx="1" stroke="#C4C4C4" strokeWidth="1" />
                <path d="M5 7h10M5 11h10M5 15h6" stroke="#D1D5DB" strokeWidth="1" />
              </svg>
            </div>
            <p className="truncate text-[11px] font-medium text-brikli-green">
              {draft.property}
            </p>
            <p className="text-[10px] text-brikli-green/70">
              {draft.unit} · {draft.tenant}
            </p>
            {draft.blocked ? (
              <p className="mt-1 text-[10px] font-medium text-[#991B1B]">{draft.blockReason}</p>
            ) : (
              <p className="mt-1 text-[10px] text-brikli-green">
                {formatCurrency(draft.currentRent)} →{" "}
                <span className="font-semibold">{formatCurrency(draft.proposedRent)}</span>
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
