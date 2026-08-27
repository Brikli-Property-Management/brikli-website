"use client";

import { Check, Loader2 } from "lucide-react";
import type { ProcessingFile } from "@/data/demoDocuments";
import { cn } from "@/lib/utils";

const STATUS_LABELS: Record<ProcessingFile["status"], string> = {
  pending: "Pending",
  uploading: "Uploading…",
  classifying: "Classifying…",
  extracting: "Extracting…",
  matching: "Matching property…",
  ready: "Ready",
};

export function ProcessingFileRow({ file }: { file: ProcessingFile }) {
  const isReady = file.status === "ready";

  return (
    <div className="rounded-lg border border-[#EFEFED] bg-[#FAFAF8] px-3 py-2.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium text-[#1A1A1A]">
            {file.displayName}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <StatusBadge status={file.status} />
            {!isReady && (
              <span className="text-[10px] text-[#9CA3AF]">
                {file.progress}%
              </span>
            )}
          </div>
        </div>
        {isReady ? (
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#0F291E]" />
        ) : (
          <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-[#9CA3AF]" />
        )}
      </div>

      {!isReady && file.progress > 0 && (
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-[#EFEFED]">
          <div
            className="h-full rounded-full bg-[#1A1A1A] transition-all duration-300"
            style={{ width: `${file.progress}%` }}
          />
        </div>
      )}

      {isReady && file.badges.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1">
          {file.badges.map((badge) => (
            <span
              key={badge}
              className="inline-flex max-w-full items-center gap-1 rounded bg-[#E8F5EC] px-1.5 py-0.5 text-[10px] leading-tight text-[#2D5A3D]"
            >
              <Check className="h-2.5 w-2.5 shrink-0" />
              <span className="truncate">{badge}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: ProcessingFile["status"] }) {
  const styles: Record<ProcessingFile["status"], string> = {
    pending: "bg-[#EFEFED] text-[#9CA3AF]",
    uploading: "bg-[#F5F5F3] text-[#6B7280]",
    classifying: "bg-[#FEF3C7] text-[#92400E]",
    extracting: "bg-[#DBEAFE] text-[#1E40AF]",
    matching: "bg-[#F3E8FF] text-[#6B21A8]",
    ready: "bg-[#DCFCE7] text-[#166534]",
  };

  return (
    <span
      className={cn(
        "rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide",
        styles[status],
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
