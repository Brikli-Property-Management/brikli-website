"use client";

import { useLayoutEffect, useRef } from "react";
import { useAutoScrollToBottom } from "@/components/demo/hooks/useAutoScrollToBottom";
import gsap from "gsap";
import {
  activeChatTitle,
  askQuestions,
  getAskQuestionLabel,
  type AskQuestionId,
} from "@/data/productDemoData";
import { isStageAtLeast, type DemoStage } from "@/animation/timing";
import { AskBrikliHome } from "@/components/demo/ask/AskBrikliHome";
import { AgenticThinking } from "@/components/demo/ask/AgenticThinking";
import { AskResponse } from "@/components/demo/ask/AskResponse/AskResponse";
import { ReviewResults } from "@/components/demo/ask/ReviewResults";
import { MessageBubble } from "@/components/demo/chat/MessageBubble";
import { ThinkingState } from "@/components/demo/chat/ThinkingState";
import { rentIncreaseResponse } from "@/data/productDemoData";
import { cn } from "@/lib/utils";

type ConversationViewProps = {
  stage: DemoStage;
  homeInputText?: string;
  inputFocused?: boolean;
  chatInputText?: string;
  chatInputFocused?: boolean;
  agenticStep?: number;
  completedAskQuestions?: AskQuestionId[];
  showPreview?: boolean;
  selectedDocId?: string | null;
  hoveredDocId?: string | null;
  onSuggestionClick?: (id: string) => void;
  onDocumentClick?: (id: string) => void;
  homeInputRef?: React.RefObject<HTMLDivElement | null>;
  chatInputRef?: React.RefObject<HTMLDivElement | null>;
  suggestionRef?: React.RefObject<HTMLButtonElement | null>;
  documentRowRef?: React.RefObject<HTMLButtonElement | null>;
};

const ASK_STAGE_MAP: {
  questionId: AskQuestionId;
  submitted: DemoStage;
  thinking: DemoStage;
  results: DemoStage;
}[] = [
  {
    questionId: "leases-action",
    submitted: "ask-q1-submitted",
    thinking: "ask-q1-thinking",
    results: "ask-q1-results",
  },
  {
    questionId: "rent-leakage",
    submitted: "ask-q2-submitted",
    thinking: "ask-q2-thinking",
    results: "ask-q2-results",
  },
  {
    questionId: "below-market",
    submitted: "ask-q3-submitted",
    thinking: "ask-q3-thinking",
    results: "ask-q3-results",
  },
  {
    questionId: "rent-increase",
    submitted: "ask-q4-submitted",
    thinking: "ask-q4-thinking",
    results: "ask-q4-results",
  },
];

function isQuestionRevealed(questionIndex: number, stage: DemoStage): boolean {
  return ASK_STAGE_MAP.some(
    (mapping, index) => index > questionIndex && isStageAtLeast(stage, mapping.submitted),
  );
}

function ChatInput({
  showStop = false,
  chatInputText = "",
  chatInputFocused = false,
  chatInputRef,
}: {
  showStop?: boolean;
  chatInputText?: string;
  chatInputFocused?: boolean;
  chatInputRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const isTyping = chatInputText.length > 0;

  return (
    <div className="mx-auto w-full max-w-[560px] px-4 pb-5">
      <div
        ref={chatInputRef}
        className={cn(
          "chat-input flex h-11 items-center rounded-full border bg-white px-5 shadow-sm transition-colors",
          chatInputFocused ? "border-[#C4C4C4]" : "border-[#E0E0DE]",
        )}
      >
        {isTyping ? (
          <span className="min-w-0 flex-1 truncate whitespace-nowrap text-[13px] text-brikli-green">
            {chatInputText}
            {chatInputFocused && (
              <span className="ml-px inline-block h-3.5 w-px animate-pulse bg-brikli-green" />
            )}
          </span>
        ) : (
          <span className="min-w-0 flex-1 truncate whitespace-nowrap text-[13px] text-brikli-green/60">
            Ask anything, or type @ to scope it to a property, unit, tenant, or document
          </span>
        )}
        {showStop ? (
          <div className="flex h-6 w-6 items-center justify-center rounded bg-[#FEE2E2]">
            <div className="h-2.5 w-2.5 rounded-sm bg-[#EF4444]" />
          </div>
        ) : (
          <div
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full",
              isTyping ? "bg-[#1A1A1A] text-white" : "bg-[#EFEFED] text-[#9CA3AF]",
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
          </div>
        )}
      </div>
    </div>
  );
}

function ConversationHeader({ title }: { title: string }) {
  const headerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { opacity: 0, y: -6 },
      { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
    );
  }, []);

  return (
    <header
      ref={headerRef}
      className="flex shrink-0 items-center justify-between border-b border-[#E8E8E6] px-5 py-3"
    >
      <h2 className="max-w-[70%] truncate text-[14px] font-medium text-brikli-green">{title}</h2>
      <button
        type="button"
        className="rounded-md bg-[#1A1A1A] px-3 py-1.5 text-[12px] font-medium text-white"
      >
        + New chat
      </button>
    </header>
  );
}

export function ConversationView({
  stage,
  homeInputText = "",
  inputFocused = false,
  chatInputText = "",
  chatInputFocused = false,
  agenticStep = -1,
  completedAskQuestions = [],
  showPreview = false,
  selectedDocId,
  hoveredDocId,
  onSuggestionClick,
  onDocumentClick,
  homeInputRef,
  chatInputRef,
  suggestionRef,
  documentRowRef,
}: ConversationViewProps) {
  const isHome = stage === "ask-home";
  const showConversation =
    stage !== "ask-home" &&
    !["document-review", "approved", "document-ask", "renewal-question", "reading-terms", "grounded-answer"].includes(stage);
  const showReviewThinking = stage === "thinking";
  const showReviewResults = isStageAtLeast(stage, "review-results") && !showPreview;
  const showUserBubble = stage !== "ask-home";

  const isAnyAskThinking = ASK_STAGE_MAP.some((m) => stage === m.thinking);
  const headerTitle =
    completedAskQuestions.length > 0
      ? getAskQuestionLabel(completedAskQuestions[completedAskQuestions.length - 1])
      : activeChatTitle;

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);

  useAutoScrollToBottom(
    scrollContainerRef,
    scrollContentRef,
    [stage, agenticStep, completedAskQuestions.length],
    { enabled: showConversation },
  );

  return (
    <div className="conversation-view flex h-full min-w-0 flex-1 flex-col bg-[#FAF9F6]">
      {!isHome && showConversation && <ConversationHeader title={headerTitle} />}

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {isHome && (
          <AskBrikliHome
            homeInputText={homeInputText}
            inputFocused={inputFocused}
            onSuggestionClick={onSuggestionClick}
            homeInputRef={homeInputRef}
            suggestionRef={suggestionRef}
          />
        )}

        {showConversation && (
          <div
            ref={scrollContainerRef}
            className="min-h-0 flex-1 overflow-y-auto scroll-smooth px-5 py-4"
          >
            <div
              ref={scrollContentRef}
              className="mx-auto flex w-full max-w-[560px] flex-col gap-5"
            >
              {showUserBubble && (
                <MessageBubble variant="user">{activeChatTitle}</MessageBubble>
              )}

              {showReviewThinking && <ThinkingState />}

              {showReviewResults && (
                <ReviewResults
                  showSummary
                  showRows
                  showExplanation
                  selectedDocId={selectedDocId}
                  hoveredDocId={hoveredDocId}
                  onDocumentClick={onDocumentClick}
                  documentRowRef={documentRowRef}
                />
              )}

              {ASK_STAGE_MAP.map((mapping, questionIndex) => {
                const label = askQuestions.find((q) => q.id === mapping.questionId)?.label ?? "";
                const showQuestion = isStageAtLeast(stage, mapping.submitted);
                const showThinking = stage === mapping.thinking;
                const showResults = isStageAtLeast(stage, mapping.results);
                const isCurrentlyRevealing = stage === mapping.results;
                const revealed =
                  isQuestionRevealed(questionIndex, stage) ||
                  (completedAskQuestions.includes(mapping.questionId) && !isCurrentlyRevealing);

                if (!showQuestion) return null;

                return (
                  <div key={mapping.questionId} className="flex flex-col gap-3">
                    <MessageBubble variant="user">{label}</MessageBubble>
                    {showThinking &&
                      (mapping.questionId === "rent-increase" ? (
                        <AgenticThinking
                          steps={rentIncreaseResponse.processingSteps}
                          activeStep={agenticStep}
                        />
                      ) : (
                        <ThinkingState />
                      ))}
                    {showResults && (
                      <AskResponse questionId={mapping.questionId} revealed={revealed} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!isHome && showConversation && (
          <ChatInput
            showStop={showReviewThinking || isAnyAskThinking}
            chatInputText={chatInputText}
            chatInputFocused={chatInputFocused}
            chatInputRef={chatInputRef}
          />
        )}
      </div>
    </div>
  );
}
