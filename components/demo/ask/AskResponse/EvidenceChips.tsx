"use client";

import { askRevealClass } from "@/components/demo/ask/AskResponse/askRevealClass";
import { cn } from "@/lib/utils";

type EvidenceChipsProps = {
  sources: string[];
  revealed?: boolean;
};

export function EvidenceChips({ sources, revealed = false }: EvidenceChipsProps) {
  return (
    <div className={cn("ask-evidence flex flex-wrap gap-1.5", askRevealClass(revealed))}>
      {sources.map((source) => (
        <span
          key={source}
          className={cn(
            "ask-evidence-chip inline-flex items-center gap-1 rounded-full border border-[#E8E8E6] bg-[#FAFAF8] px-2.5 py-1 text-[10px] font-medium text-brikli-green",
            askRevealClass(revealed),
          )}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
            <path
              d="M2 2.5h6v5H2V2.5Z"
              stroke="currentColor"
              strokeWidth="0.8"
            />
          </svg>
          {source}
        </span>
      ))}
    </div>
  );
}
