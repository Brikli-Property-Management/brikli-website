"use client";

import type { GroundingField } from "@/data/demoDocuments";
import { cn } from "@/lib/utils";

type ExtractionFieldProps = {
  field: GroundingField;
  active: boolean;
  visible: boolean;
};

export function ExtractionField({
  field,
  active,
  visible,
}: ExtractionFieldProps) {
  return (
    <div
      data-extraction-field={field.id}
      className={cn(
        "extraction-field rounded-lg border bg-white p-3 transition-all duration-300",
        active
          ? "border-[#0F291E]/30 shadow-[0_0_0_1px_rgba(15,41,30,0.08)]"
          : "border-[#EFEFED]",
        field.needsReview && active && "border-[#D97706]/40",
        !visible && "opacity-0",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
          {field.label}
        </p>
        {field.needsReview && (
          <span className="rounded bg-[#FEF3C7] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#92400E]">
            Review
          </span>
        )}
      </div>
      <p className="mt-1 text-[14px] font-medium text-[#1A1A1A]">{field.value}</p>
      <div className="mt-2 flex items-center justify-between">
        <p className="text-[10px] text-[#9CA3AF]">Source · page {field.page}</p>
        <p
          className={cn(
            "text-[10px] font-medium",
            field.needsReview ? "text-[#D97706]" : "text-[#2D5A3D]",
          )}
        >
          {field.confidence}% confidence
        </p>
      </div>
    </div>
  );
}

type ExtractedFieldsPanelProps = {
  fields: GroundingField[];
  revealedFieldIds: string[];
  activeFieldId: string | null;
};

export function ExtractedFieldsPanel({
  fields,
  revealedFieldIds,
  activeFieldId,
}: ExtractedFieldsPanelProps) {
  return (
    <aside className="flex h-full w-[280px] shrink-0 flex-col border-l border-[#E8E8E6] bg-[#FAFAF8]">
      <div className="border-b border-[#E8E8E6] px-5 py-4">
        <h2 className="text-[15px] font-semibold text-[#1A1A1A]">
          Extracted fields
        </h2>
        <p className="mt-0.5 text-[11px] text-[#9CA3AF]">
          Grounded to source document
        </p>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto p-4">
        {fields.map((field) => (
          <ExtractionField
            key={field.id}
            field={field}
            active={activeFieldId === field.id}
            visible={revealedFieldIds.includes(field.id)}
          />
        ))}
      </div>
    </aside>
  );
}
