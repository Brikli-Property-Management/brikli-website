"use client";

import { ChevronRight, FileText } from "lucide-react";
import { UPLOAD_FILES } from "@/data/demoDocuments";

type ProcessingToastProps = {
  visible?: boolean;
};

export function ProcessingToast(_props: ProcessingToastProps) {
  const readyCount = Math.min(4, UPLOAD_FILES.length);

  return (
    <div className="processing-toast pointer-events-none absolute bottom-6 right-6 z-30 w-[340px] rounded-xl border border-[#E8E8E6] bg-white p-5 opacity-0 shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
      <p className="text-[14px] font-semibold text-[#1A1A1A]">
        {readyCount} documents finished
      </p>
      <div className="mt-3 space-y-2">
        {UPLOAD_FILES.slice(0, readyCount).map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between gap-3 rounded-lg bg-[#FAFAF8] px-3 py-2.5"
          >
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
              <FileText className="h-4 w-4 shrink-0 text-[#6B7280]" />
              <span className="truncate text-[12px] font-medium text-[#374151]">
                {file.displayName}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-1 text-[11px] font-medium text-[#2D5A3D]">
              Ready to review
              <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
