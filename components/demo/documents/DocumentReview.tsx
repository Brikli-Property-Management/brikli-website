"use client";

import Image from "next/image";
import {
  AlertTriangle,
  Building2,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Flag,
  RotateCw,
  Sparkles,
  Trash2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  demoUser,
  extractedOverviewFields,
  focusDocument,
  leaseDocumentImage,
  leaseSummaryText,
  propertyTree,
  worthChecking,
} from "@/data/productDemoData";
import { BrikliMark } from "@/components/demo/BrikliMark";
import { cn } from "@/lib/utils";

type DocumentReviewProps = {
  approved?: boolean;
  onApprove?: () => void;
  approveRef?: React.RefObject<HTMLButtonElement | null>;
  showFieldReveal?: boolean;
};

function IconRail() {
  return (
    <div className="flex w-[52px] shrink-0 flex-col items-center border-r border-[#E8E8E6] bg-[#FAFAF8] py-3">
      <BrikliMark size={28} />
    </div>
  );
}

function PropertyTree() {
  return (
    <div className="flex w-[220px] shrink-0 flex-col border-r border-[#E8E8E6] bg-white">
      <div className="border-b border-[#E8E8E6] px-3 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[12px] font-semibold text-brikli-green">All properties</p>
            <p className="text-[10px] text-brikli-green">{demoUser.org}</p>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-brikli-green" />
        </div>
        <div className="mt-2 flex gap-1">
          <button
            type="button"
            className="rounded-md bg-[#E8F5EC] px-2 py-0.5 text-[10px] font-medium text-brikli-green"
          >
            By unit
          </button>
          <button
            type="button"
            className="rounded-md px-2 py-0.5 text-[10px] font-medium text-brikli-green"
          >
            By type
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2">
        {propertyTree.map((item) => (
          <div key={item.id}>
            <div
              className={cn(
                "flex items-center gap-1 rounded-md px-2 py-1.5 text-[11px]",
                item.expanded ? "font-medium text-brikli-green" : "text-brikli-green",
              )}
            >
              {item.expanded ? (
                <ChevronDown className="h-3 w-3 shrink-0 text-brikli-green" />
              ) : (
                <ChevronRight className="h-3 w-3 shrink-0 text-brikli-green" />
              )}
              <Building2 className="h-3 w-3 shrink-0 text-brikli-green" />
              <span className="truncate">{item.label}</span>
              {item.hasDot && (
                <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-[#D97706]" />
              )}
            </div>
            {item.children?.map((child) => (
              <div
                key={child.id}
                className={cn(
                  "ml-5 flex items-center gap-1 rounded-md px-2 py-1 text-[11px]",
                  child.selected
                    ? "bg-[#EFEFED] font-medium text-brikli-green"
                    : "text-brikli-green",
                )}
              >
                {child.isDocument ? (
                  <span className="mr-1 text-brikli-green">📄</span>
                ) : null}
                <span className="truncate">{child.label}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentViewer() {
  return (
    <div className="flex min-w-0 flex-1 flex-col bg-[#F5F5F3]">
      <header className="flex shrink-0 items-center justify-between border-b border-[#E8E8E6] bg-white px-4 py-2.5">
        <div className="flex items-center gap-2">
          <ChevronLeft className="h-4 w-4 text-brikli-green" />
          <span className="text-[12px] font-medium text-brikli-green">Review</span>
          <span className="text-[12px] text-brikli-green">{focusDocument.filename}</span>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-[#E8E8E6] bg-white px-1 py-0.5">
          <button type="button" className="p-1 text-brikli-green">
            <RotateCw className="h-3 w-3" />
          </button>
          <button type="button" className="p-1 text-brikli-green">
            <ZoomOut className="h-3 w-3" />
          </button>
          <span className="px-1 text-[10px] text-brikli-green">100%</span>
          <button type="button" className="p-1 text-brikli-green">
            <ZoomIn className="h-3 w-3" />
          </button>
        </div>
      </header>

      <div className="relative min-h-0 flex-1 overflow-hidden p-4">
        <div className="relative mx-auto h-full max-w-[480px] overflow-hidden rounded-md border border-[#E8E8E6] bg-white shadow-sm">
          <Image
            src={leaseDocumentImage}
            alt={`Blank residential tenancy agreement — ${focusDocument.filename}`}
            fill
            className="object-contain object-top p-2"
            sizes="480px"
            priority
          />
        </div>
      </div>
    </div>
  );
}

function ReviewPanel({
  approved,
  onApprove,
  approveRef,
  showFieldReveal,
}: {
  approved?: boolean;
  onApprove?: () => void;
  approveRef?: React.RefObject<HTMLButtonElement | null>;
  showFieldReveal?: boolean;
}) {
  return (
    <div className="flex w-[320px] shrink-0 flex-col border-l border-[#E8E8E6] bg-white">
      <header className="flex shrink-0 items-center justify-between border-b border-[#E8E8E6] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-[#F0F0EE] px-2 py-0.5 text-[10px] font-medium text-brikli-green">
            Lease
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button type="button" className="p-1 text-brikli-green">
            <Flag className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="rounded-md border border-[#E8E8E6] px-2 py-0.5 text-[10px] font-medium text-brikli-green"
          >
            Assign ▾
          </button>
          <button
            type="button"
            className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium text-brikli-green"
          >
            <Trash2 className="h-3 w-3" />
            Delete
          </button>
        </div>
      </header>

      <div className="review-panel-content flex-1 overflow-y-auto px-4 py-3">
        <div className="review-warning mb-3 rounded-lg bg-[#FEF2F2] px-3 py-2 opacity-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-brikli-green">
            Worth knowing first
          </p>
          <p className="mt-0.5 text-[12px] text-brikli-green">
            low confidence landlord name
          </p>
        </div>

        <div className="mb-3 flex gap-3 border-b border-[#E8E8E6] pb-2">
          <button
            type="button"
            className="flex items-center gap-1 border-b-2 border-brikli-green pb-1 text-[11px] font-medium text-brikli-green"
          >
            <Sparkles className="h-3 w-3" />
            Overview
          </button>
          <button
            type="button"
            className="pb-1 text-[11px] font-medium text-brikli-green"
          >
            Fields
            <span className="ml-1 rounded bg-[#F0F0EE] px-1 py-0.5 text-[9px]">
              1
            </span>
          </button>
        </div>

        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-brikli-green">
          What it is
        </p>
        <div className="mb-4 grid grid-cols-2 gap-2">
          {extractedOverviewFields.map((field, i) => (
            <div
              key={field.label}
              className="review-field rounded-lg border border-[#E8E8E6] p-2.5 opacity-0"
              data-index={i}
              style={{ opacity: showFieldReveal ? 1 : undefined }}
            >
              <p className="text-[9px] font-semibold uppercase tracking-wider text-brikli-green">
                {field.label}
              </p>
              <p className="mt-0.5 text-[12px] font-medium text-brikli-green">
                {field.value}
              </p>
              <p className="mt-0.5 text-[9px] text-brikli-green">{field.page}</p>
            </div>
          ))}
        </div>

        <div className="review-worth-checking mb-4 rounded-lg bg-[#FFFBEB] px-3 py-2.5 opacity-0">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="h-3 w-3 text-[#D97706]" />
            <p className="text-[10px] font-semibold uppercase tracking-wider text-brikli-green">
              Worth checking (2)
            </p>
          </div>
          <ul className="mt-1.5 space-y-0.5">
            {worthChecking.map((item) => (
              <li key={item} className="text-[11px] text-brikli-green">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="review-classification mb-4 space-y-2 opacity-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-brikli-green">Province</span>
            <span className="text-[12px] font-medium text-brikli-green">Quebec</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-brikli-green">Classification</span>
            <div className="text-right">
              <span className="text-[12px] font-medium text-brikli-green">Lease</span>
              <p className="text-[9px] text-brikli-green">100% confidence</p>
            </div>
          </div>
        </div>

        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-brikli-green">
          Confirm where this belongs
        </p>
        <div className="mb-4 space-y-2">
          {[
            { label: "Property", value: `Auto-detected · ${focusDocument.property}` },
            { label: "Unit", value: focusDocument.unit },
            { label: "Tenant", value: focusDocument.tenant },
          ].map((field) => (
            <div key={field.label}>
              <p className="text-[10px] text-brikli-green">{field.label}</p>
              <div className="mt-0.5 rounded-md border border-[#E8E8E6] px-2.5 py-1.5 text-[11px] text-brikli-green">
                {field.value}
              </div>
            </div>
          ))}
          <div className="flex items-start gap-2 rounded-lg bg-[#F5F5F3] px-2.5 py-2">
            <Building2 className="mt-0.5 h-3 w-3 shrink-0 text-brikli-green" />
            <p className="text-[10px] leading-relaxed text-brikli-green">
              {focusDocument.property}. A property you already have.
            </p>
          </div>
        </div>

        <div className="mb-4">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-brikli-green">
            It writes
          </p>
          <p className="text-[11px] leading-relaxed text-brikli-green">
            {leaseSummaryText}
          </p>
        </div>
      </div>

      <div className="shrink-0 border-t border-[#E8E8E6] p-4">
        <button
          ref={approveRef}
          type="button"
          onClick={onApprove}
          className={cn(
            "approve-btn flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-[13px] font-medium transition-colors",
            approved
              ? "bg-[#E8F5EC] text-brikli-green"
              : "bg-[#E8F5EC] text-brikli-green hover:bg-[#D4E8DA]",
          )}
        >
          <Check className="h-4 w-4" />
          {approved ? "Approved & filed" : "Approve & file"}
        </button>
      </div>
    </div>
  );
}

export function DocumentReview({
  approved = false,
  onApprove,
  approveRef,
  showFieldReveal = false,
}: DocumentReviewProps) {
  return (
    <div className="document-review flex h-full min-w-0 flex-1">
      <IconRail />
      <PropertyTree />
      <DocumentViewer />
      <ReviewPanel
        approved={approved}
        onApprove={onApprove}
        approveRef={approveRef}
        showFieldReveal={showFieldReveal}
      />
    </div>
  );
}
