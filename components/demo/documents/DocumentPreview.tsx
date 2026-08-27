"use client";

import Image from "next/image";
import { focusDocument, leaseDocumentImage } from "@/data/productDemoData";
import { ExternalLink, X } from "lucide-react";

type DocumentPreviewProps = {
  visible?: boolean;
  onOpenFullView?: () => void;
  openFullViewRef?: React.RefObject<HTMLButtonElement | null>;
};

export function DocumentPreview({
  visible = false,
  onOpenFullView,
  openFullViewRef,
}: DocumentPreviewProps) {
  return (
    <div
      className="document-preview flex h-full w-[340px] shrink-0 flex-col border-l border-[#E8E8E6] bg-white"
      style={{ opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(30px)" }}
    >
      <header className="flex shrink-0 items-center justify-between border-b border-[#E8E8E6] px-4 py-3">
        <span className="text-[13px] font-medium text-brikli-green">
          {focusDocument.filename}
        </span>
        <div className="flex items-center gap-2">
          <button
            ref={openFullViewRef}
            type="button"
            onClick={onOpenFullView}
            className="open-full-view flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-brikli-green transition-colors hover:bg-[#E8F5EC]"
          >
            <ExternalLink className="h-3 w-3" strokeWidth={2} />
            Open full view
          </button>
          <button type="button" className="text-brikli-green">
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-hidden bg-[#F5F5F3] p-3">
        <div className="relative h-full w-full overflow-hidden rounded-md border border-[#E8E8E6] bg-white shadow-sm">
          <Image
            src={leaseDocumentImage}
            alt={`${focusDocument.filename} — blank residential tenancy agreement`}
            fill
            className="object-contain object-top p-1"
            sizes="340px"
            priority
          />
        </div>
      </div>
    </div>
  );
}
