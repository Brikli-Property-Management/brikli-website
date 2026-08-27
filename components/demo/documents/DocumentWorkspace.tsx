"use client";

import { useRef } from "react";
import Image from "next/image";
import { useAutoScrollToBottom } from "@/components/demo/hooks/useAutoScrollToBottom";
import {
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { demoUser, documentScope, focusDocument, leaseDocumentImage, propertyTree, renewalQuestion } from "@/data/productDemoData";
import { BrikliMark } from "@/components/demo/BrikliMark";
import { ExtractedTermsCard } from "@/components/demo/chat/ExtractedTerms";
import { GroundedAnswer } from "@/components/demo/chat/GroundedAnswer";
import { MessageBubble } from "@/components/demo/chat/MessageBubble";
import { ThinkingState } from "@/components/demo/chat/ThinkingState";
import type { DemoStage } from "@/animation/timing";
import { cn } from "@/lib/utils";

type DocumentWorkspaceProps = {
  stage: DemoStage;
  typedText?: string;
  messageSent?: boolean;
  onSendQuestion?: () => void;
  askInputRef?: React.RefObject<HTMLDivElement | null>;
  sendButtonRef?: React.RefObject<HTMLButtonElement | null>;
  sentenceIndex?: number;
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
    <div className="flex w-[200px] shrink-0 flex-col border-r border-[#E8E8E6] bg-white">
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
                <span className="truncate">{child.label}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DocumentWorkspace({
  stage,
  typedText = "",
  messageSent = false,
  onSendQuestion,
  askInputRef,
  sendButtonRef,
  sentenceIndex = -1,
}: DocumentWorkspaceProps) {
  const showAskLanding = stage === "document-ask";
  const showUserBubble = messageSent;
  const showExtractedTerms = stage === "reading-terms" || stage === "grounded-answer";
  const showGroundedAnswer = stage === "grounded-answer";
  const showThinking =
    messageSent && (stage === "renewal-question" || stage === "reading-terms") && !showGroundedAnswer;

  const fullInput = typedText
    ? `${documentScope} ${typedText}`
    : documentScope;
  const hasTypedInput = typedText.length > 0;

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);

  useAutoScrollToBottom(
    scrollContainerRef,
    scrollContentRef,
    [stage, messageSent, sentenceIndex],
    { enabled: !showAskLanding },
  );

  return (
    <div className="document-workspace flex h-full min-w-0 flex-1">
      <IconRail />
      <PropertyTree />

      <div className="flex min-w-0 flex-1 flex-col bg-[#F5F5F3]">
        <header className="flex shrink-0 items-center justify-between border-b border-[#E8E8E6] bg-white px-4 py-2">
          <div className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4 text-brikli-green" />
            <span className="text-[12px] text-brikli-green">Overall property</span>
            <span className="text-[12px] font-medium text-brikli-green">
              {focusDocument.filename}
            </span>
          </div>
          <div className="flex gap-1">
            {(["Ask Brikli", "Fields", "Analytics"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                className={cn(
                  "rounded-md px-2.5 py-1 text-[11px] font-medium",
                  tab === "Ask Brikli"
                    ? "bg-[#E8F5EC] text-brikli-green"
                    : "text-brikli-green",
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </header>

        <div className="relative min-h-0 flex-1 overflow-hidden p-3">
          <div className="absolute right-4 top-3 z-10 flex items-center gap-1 rounded-lg border border-[#E8E8E6] bg-white px-1 py-0.5 shadow-sm">
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
          <div className="relative mx-auto h-full max-w-[520px] overflow-hidden rounded-md border border-[#E8E8E6] bg-white shadow-sm">
            <Image
              src={leaseDocumentImage}
              alt="Blank residential tenancy agreement"
              fill
              className="object-contain object-top p-2"
              sizes="520px"
            />
          </div>
        </div>
      </div>

      <div className="flex w-[340px] shrink-0 flex-col border-l border-[#E8E8E6] bg-white">
        <header className="flex shrink-0 items-center justify-end border-b border-[#E8E8E6] px-4 py-2.5">
          <button type="button" className="text-brikli-green">
            <X className="h-4 w-4" />
          </button>
        </header>

        <div
          ref={scrollContainerRef}
          className="flex min-h-0 flex-1 flex-col overflow-y-auto scroll-smooth px-4 py-4"
        >
          {showAskLanding && (
            <div className="ask-landing flex flex-1 flex-col items-center justify-center text-center">
              <BrikliMark size={48} />
              <h3 className="mt-4 text-[15px] font-semibold text-brikli-green">
                Ask Brikli about {focusDocument.filename}
              </h3>
              <p className="mt-1 max-w-[240px] text-[12px] leading-relaxed text-brikli-green">
                Ask questions and get answers grounded in your documents.
              </p>
            </div>
          )}

          {!showAskLanding && (
            <div ref={scrollContentRef} className="workspace-chat space-y-4">
              {showUserBubble && (
                <MessageBubble variant="user">
                  {documentScope} {renewalQuestion}
                </MessageBubble>
              )}

              {showThinking && (
                <ThinkingState
                  label="Reading extracted terms · 6 fields"
                  showCheck
                />
              )}

              {showExtractedTerms && !showGroundedAnswer && (
                <ExtractedTermsCard visible />
              )}

              {showGroundedAnswer && (
                <GroundedAnswer visible sentenceIndex={sentenceIndex} />
              )}
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-[#E8E8E6] p-4">
          <div
            ref={askInputRef}
            className="flex items-center rounded-full border border-[#E0E0DE] bg-white px-4 py-2.5"
          >
            <span className="flex-1 truncate text-[12px] text-brikli-green">
              {fullInput}
              {stage === "renewal-question" && typedText.length < renewalQuestion.length && (
                <span className="ml-px inline-block h-3.5 w-px animate-pulse bg-brikli-green" />
              )}
            </span>
            <button
              ref={sendButtonRef}
              type="button"
              onClick={onSendQuestion}
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                hasTypedInput ? "bg-[#1A1A1A] text-white" : "bg-[#E8F5EC] text-brikli-green",
              )}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M7 12V2M7 2L3 6M7 2l4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
