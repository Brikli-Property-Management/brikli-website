"use client";

import type { GroundingField } from "@/data/demoDocuments";
import { cn } from "@/lib/utils";

type GroundingBoxProps = {
  field: GroundingField;
  active: boolean;
  visible: boolean;
};

/** Inline overlay — wraps a field value and draws the grounding highlight on top */
export function GroundingBox({ field, active, visible }: GroundingBoxProps) {
  const isUncertain = field.needsReview;

  return (
    <div
      data-grounding-box={field.id}
      className={cn(
        "grounding-box pointer-events-none absolute -inset-x-1 -inset-y-0.5 rounded-[3px] border transition-all duration-300",
        isUncertain
          ? "border-[#D97706]/70 bg-[#FEF3C7]/25"
          : active
            ? "border-[#0F291E] bg-[#0F291E]/[0.06]"
            : "border-[#374151]/55 bg-[#374151]/[0.04]",
        !visible && "scale-[0.98] opacity-0",
        visible && "scale-100 opacity-100",
      )}
    />
  );
}
