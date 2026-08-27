"use client";

import { extractedTerms } from "@/data/productDemoData";

type ExtractedTermsProps = {
  visible?: boolean;
};

export function ExtractedTermsCard({ visible = false }: ExtractedTermsProps) {
  return (
    <div
      className="extracted-terms rounded-xl border border-[#E8E8E6] bg-white opacity-0"
      style={{ opacity: visible ? 1 : undefined }}
    >
      <div className="border-b border-[#E8E8E6] px-4 py-3">
        <h3 className="text-[13px] font-semibold text-brikli-green">
          Extracted terms
        </h3>
      </div>
      <div className="divide-y divide-[#F0F0EE]">
        {extractedTerms.map((field, i) => (
          <div
            key={field.label}
            className="extracted-term-row flex items-center justify-between px-4 py-2.5 opacity-0"
            data-index={i}
          >
            <span className="text-[10px] font-semibold uppercase tracking-wider text-brikli-green">
              {field.label}
            </span>
            <span className="text-[13px] font-medium text-brikli-green">
              {field.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
