"use client";

import { askRevealClass } from "@/components/demo/ask/AskResponse/askRevealClass";
import { cn } from "@/lib/utils";

type CTAProps = {
  actions: string[];
  revealed?: boolean;
};

export function CTA({ actions, revealed = false }: CTAProps) {
  return (
    <div className={cn("ask-cta flex flex-wrap gap-2", askRevealClass(revealed))}>
      {actions.map((action, i) => (
        <button
          key={action}
          type="button"
          className={cn(
            "ask-cta-btn rounded-md px-3 py-1.5 text-[12px] font-medium outline-none",
            askRevealClass(revealed),
            i === 0
              ? "border-0 bg-[#0F291E] text-white"
              : "border border-[#E0E0DE] bg-white text-brikli-green",
          )}
        >
          {action}
        </button>
      ))}
    </div>
  );
}
