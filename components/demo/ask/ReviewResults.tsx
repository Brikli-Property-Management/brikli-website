"use client";

import {
  focusDocument,
  reviewDocuments,
  reviewExplanation,
  reviewSummary,
} from "@/data/productDemoData";
import { cn } from "@/lib/utils";
import { BrikliMark } from "@/components/demo/BrikliMark";

type ReviewResultsProps = {
  showSummary?: boolean;
  showRows?: boolean;
  showExplanation?: boolean;
  selectedDocId?: string | null;
  hoveredDocId?: string | null;
  onDocumentClick?: (id: string) => void;
  documentRowRef?: React.RefObject<HTMLButtonElement | null>;
};

function DocumentTag({
  label,
  variant,
}: {
  label: string;
  variant: "warning" | "error";
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded px-1.5 py-0.5 text-[10px] font-medium",
        variant === "warning"
          ? "bg-[#E8F5EC] text-brikli-green"
          : "bg-[#E8F5EC] text-brikli-green",
      )}
    >
      {label}
    </span>
  );
}

export function ReviewResults({
  showSummary = true,
  showRows = true,
  showExplanation = false,
  selectedDocId = null,
  hoveredDocId = null,
  onDocumentClick,
  documentRowRef,
}: ReviewResultsProps) {
  return (
    <div className="review-results mx-auto w-full max-w-[560px]">
      {showSummary && (
        <div className="review-summary mb-4 flex items-center gap-2 opacity-0">
          <BrikliMark size={20} />
          <span className="text-[13px] font-medium text-brikli-green">
            {reviewSummary.waiting} waiting for review · {reviewSummary.approved}{" "}
            approved
          </span>
        </div>
      )}

      {showRows && (
        <div className="review-rows space-y-1.5">
          {reviewDocuments.map((doc, i) => {
            const isFocusDoc = doc.filename === focusDocument.filename;
            const isSelected = selectedDocId === doc.id;
            const isHovered = hoveredDocId === doc.id;
            return (
              <button
                key={doc.id}
                ref={isFocusDoc && i === 2 ? documentRowRef : undefined}
                type="button"
                data-doc-id={doc.id}
                onClick={() => onDocumentClick?.(doc.id)}
                className={cn(
                  "review-row doc-row flex w-full items-center justify-between rounded-lg border px-3.5 py-2.5 text-left opacity-0 transition-colors",
                  isSelected || isHovered
                    ? "border-[#D1D5DB] bg-[#F5F5F3]"
                    : "border-[#E8E8E6] bg-white hover:border-[#D1D5DB] hover:bg-[#FAFAF8]",
                )}
              >
                <span className="text-[13px] font-medium text-brikli-green">
                  {doc.filename}
                </span>
                <div className="flex shrink-0 gap-1">
                  {doc.tags.map((tag) => (
                    <DocumentTag
                      key={tag.label}
                      label={tag.label}
                      variant={tag.variant}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {showRows && (
        <button
          type="button"
          className="review-show-all mt-2 flex items-center gap-1 text-[12px] font-medium text-brikli-green opacity-0"
        >
          Show all 10
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M3 4.5l3 3 3-3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}

      {showExplanation && (
        <div className="review-explanation mt-5 space-y-3">
          <p className="review-explanation-intro text-[13px] leading-relaxed text-brikli-green opacity-0">
            {reviewExplanation.paragraph}
          </p>
          <div>
            <p className="review-explanation-heading mb-1.5 text-[13px] font-medium text-brikli-green opacity-0">
              Top items waiting:
            </p>
            <ul className="space-y-0.5">
              {reviewExplanation.topItems.map((item) => (
                <li
                  key={item}
                  className="review-explanation-item text-[13px] leading-relaxed text-brikli-green opacity-0"
                >
                  – {item}
                </li>
              ))}
            </ul>
          </div>
          <p className="review-explanation-closing text-[13px] leading-relaxed text-brikli-green opacity-0">
            {reviewExplanation.closing}
          </p>
        </div>
      )}
    </div>
  );
}
