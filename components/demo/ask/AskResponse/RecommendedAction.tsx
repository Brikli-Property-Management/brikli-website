"use client";

import { askRevealClass } from "@/components/demo/ask/AskResponse/askRevealClass";
import { cn } from "@/lib/utils";

type RecommendedActionProps = {
  children: React.ReactNode;
  revealed?: boolean;
};

export function RecommendedAction({ children, revealed = false }: RecommendedActionProps) {
  return (
    <div
      className={cn(
        "ask-recommendation rounded-lg border border-[#E8E8E6] bg-white px-3.5 py-2.5",
        askRevealClass(revealed),
      )}
    >
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-brikli-green/60">
        Recommended
      </p>
      <div className="text-[13px] leading-relaxed text-brikli-green">{children}</div>
    </div>
  );
}
