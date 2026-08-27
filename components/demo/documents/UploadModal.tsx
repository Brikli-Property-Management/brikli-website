"use client";

import {
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
  Loader2,
  X,
} from "lucide-react";
import { forwardRef, type RefObject } from "react";
import type { ProcessingFile, UploadFile } from "@/data/demoDocuments";
import { UPLOAD_FILES } from "@/data/demoDocuments";
import { MODAL_STEP_LABELS, type ModalStep } from "@/animation/documentsTiming";
import { cn } from "@/lib/utils";
import { ProcessingFileRow } from "./ProcessingFileRow";

type UploadModalProps = {
  visible: boolean;
  closing?: boolean;
  step: ModalStep;
  dropZoneActive: boolean;
  selectedFileIds: string[];
  processingFiles: ProcessingFile[];
  processingComplete: boolean;
  onUploadClick?: () => void;
  dropZoneRef?: RefObject<HTMLDivElement | null>;
  uploadActionRef?: RefObject<HTMLButtonElement | null>;
};

function fileIcon(type: UploadFile["type"]) {
  switch (type) {
    case "XLSX":
      return FileSpreadsheet;
    case "PNG":
    case "JPG":
      return ImageIcon;
    default:
      return FileText;
  }
}

export const UploadModal = forwardRef<HTMLDivElement, UploadModalProps>(
  function UploadModal(
    {
      visible,
      closing,
      step,
      dropZoneActive,
      selectedFileIds,
      processingFiles,
      processingComplete,
      onUploadClick,
      dropZoneRef,
      uploadActionRef,
    },
    overlayRef,
  ) {
    const isProcessing = step >= 2 && step < 4;
    const selectedFiles = UPLOAD_FILES.filter((f) =>
      selectedFileIds.includes(f.id),
    );
    const canUpload = selectedFileIds.length > 0 && step === 1;
    const isHidden = !visible && !closing;
    const hasSelectedFiles = selectedFiles.length > 0;

    return (
      <div
        ref={overlayRef}
        aria-hidden={isHidden}
        className={cn(
          "upload-modal-overlay pointer-events-none absolute inset-0 z-40 flex items-center justify-center bg-black/20 opacity-0 backdrop-blur-[1px]",
        )}
      >
        <div className="upload-modal-card relative flex max-h-[min(780px,90%)] w-[560px] flex-col rounded-2xl border border-[#E8E8E6] bg-white opacity-0 shadow-[0_24px_80px_rgba(0,0,0,0.12)]">
          <div className="flex shrink-0 items-center justify-between border-b border-[#EFEFED] px-6 py-4">
            <h2 className="text-[18px] font-semibold text-[#1A1A1A]">
              Upload documents
            </h2>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9CA3AF] hover:bg-[#F5F5F3]"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="shrink-0 px-6 pt-5">
            <Stepper step={step} />
            <p className="mt-3 text-[12px] text-[#9CA3AF]">
              Step {step} of 4 · {MODAL_STEP_LABELS[step]}
            </p>
          </div>

          <div className="upload-modal-body min-h-0 flex-1 overflow-y-auto px-6 py-4">
            {step === 4 ? (
              <CompleteSummary />
            ) : isProcessing ? (
              <div className="space-y-2">
                {processingFiles.map((file) => (
                  <ProcessingFileRow key={file.id} file={file} />
                ))}
              </div>
            ) : (
              <>
                <div
                  ref={dropZoneRef}
                  className={cn(
                    "drop-zone relative rounded-xl border-2 border-dashed text-center transition-all duration-300",
                    hasSelectedFiles ? "px-4 py-4" : "px-6 py-8",
                    dropZoneActive
                      ? "border-[#0F291E] bg-[#F0F7F2]"
                      : "border-[#E0E0DE] bg-[#FAFAF8]",
                  )}
                >
                  <div
                    className={cn(
                      "mx-auto flex items-center justify-center rounded-full bg-[#EFEFED]",
                      hasSelectedFiles ? "mb-2 h-8 w-8" : "mb-3 h-10 w-10",
                    )}
                  >
                    <svg
                      className={cn(
                        "text-[#6B7280]",
                        hasSelectedFiles ? "h-4 w-4" : "h-5 w-5",
                      )}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.75}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
                      />
                    </svg>
                  </div>
                  <p
                    className={cn(
                      "font-medium text-[#1A1A1A]",
                      hasSelectedFiles ? "text-[13px]" : "text-[14px]",
                    )}
                  >
                    {hasSelectedFiles ? (
                      <>
                        Add more files or{" "}
                        <span className="underline decoration-[#C4C4C4] underline-offset-2">
                          browse
                        </span>
                      </>
                    ) : (
                      <>
                        Drop files here or{" "}
                        <span className="underline decoration-[#C4C4C4] underline-offset-2">
                          browse
                        </span>
                      </>
                    )}
                  </p>
                  {!hasSelectedFiles && (
                    <p className="mt-1 text-[12px] text-[#9CA3AF]">
                      PDF, images, Excel and Word files
                    </p>
                  )}
                </div>

                {hasSelectedFiles && (
                  <div className="mt-4">
                    <p className="mb-2 text-[12px] font-medium text-[#374151]">
                      {selectedFiles.length} files selected
                    </p>
                    <div className="max-h-[220px] space-y-1 overflow-y-auto">
                      {selectedFiles.map((file) => {
                        const Icon = fileIcon(file.type);
                        return (
                          <div
                            key={file.id}
                            className="upload-file-row flex items-center gap-3 rounded-lg border border-[#EFEFED] bg-[#FAFAF8] px-3 py-2"
                          >
                            <Icon className="h-4 w-4 shrink-0 text-[#6B7280]" />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[13px] font-medium text-[#1A1A1A]">
                                {file.displayName}
                              </p>
                              <p className="text-[11px] text-[#9CA3AF]">
                                {file.type} · {file.size}
                              </p>
                            </div>
                            <X className="h-3.5 w-3.5 text-[#C4C4C4]" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {step < 4 && (
            <div className="shrink-0 border-t border-[#EFEFED] px-6 py-4 text-center">
              <button
                ref={uploadActionRef}
                type="button"
                disabled={!canUpload && step === 1}
                onClick={onUploadClick}
                className={cn(
                  "w-full rounded-lg py-2.5 text-[13px] font-medium transition-all duration-150",
                  !canUpload && step === 1
                    ? "cursor-not-allowed bg-[#EFEFED] text-[#9CA3AF]"
                    : "bg-[#1A1A1A] text-white hover:bg-[#333333] active:scale-[0.98]",
                )}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing…
                  </span>
                ) : (
                  `Upload ${selectedFileIds.length} file${selectedFileIds.length === 1 ? "" : "s"}`
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  },
);

function Stepper({ step }: { step: ModalStep }) {
  return (
    <div className="flex items-center gap-0">
      {[1, 2, 3, 4].map((n) => (
        <div key={n} className="flex items-center">
          <div
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold transition-colors",
              n === step
                ? "border-2 border-[#1A1A1A] bg-white text-[#1A1A1A]"
                : n < step
                  ? "bg-[#0F291E] text-white"
                  : "bg-[#EFEFED] text-[#9CA3AF]",
            )}
          >
            {n < step ? <CheckCircle2 className="h-3.5 w-3.5" /> : n}
          </div>
          {n < 4 && (
            <div
              className={cn(
                "h-px w-10",
                n < step ? "bg-[#0F291E]" : "bg-[#E8E8E6]",
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function CompleteSummary() {
  return (
    <div className="py-6 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F5EC]">
        <CheckCircle2 className="h-6 w-6 text-[#0F291E]" />
      </div>
      <p className="text-[20px] font-semibold text-[#1A1A1A]">
        {UPLOAD_FILES.length} documents processed
      </p>
      <p className="mt-2 text-[13px] text-[#6B7280]">
        6 extracted automatically · 1 needs review
      </p>
    </div>
  );
}
