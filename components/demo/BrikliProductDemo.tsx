"use client";

import { useEffect, useCallback, useRef } from "react";
import gsap from "gsap";
import { buildMasterTimeline, jumpTimelineToStage, applyStageState } from "@/animation/masterTimeline";
import { initCursor } from "@/animation/helpers";
import {
  ProductDemoProvider,
  resetDemoState,
  revealAnswerInDom,
  revealAskResponseInDom,
  revealExtractedTermsInDom,
  revealResultsInDom,
  revealReviewPanelInDom,
  useProductDemo,
} from "@/animation/productDemoController";
import { BrikliSidebar } from "@/components/demo/BrikliSidebar";
import { ConversationView } from "@/components/demo/ask/ConversationView";
import { DocumentPreview } from "@/components/demo/documents/DocumentPreview";
import { DocumentReview } from "@/components/demo/documents/DocumentReview";
import { DocumentWorkspace } from "@/components/demo/documents/DocumentWorkspace";
import { FakeCursor } from "@/components/demo/FakeCursor";
import type { AskQuestionId } from "@/data/productDemoData";
import type { DemoStage } from "@/animation/timing";
import { getAskQuestionIndex } from "@/animation/timing";

const WORKSPACE_STAGES: DemoStage[] = [
  "document-ask",
  "renewal-question",
  "reading-terms",
  "grounded-answer",
];

const REVIEW_STAGES: DemoStage[] = ["document-review", "approved"];

const ASK_RESULTS_STAGES: DemoStage[] = [
  "ask-q1-results",
  "ask-q2-results",
  "ask-q3-results",
  "ask-q4-results",
];

function BrikliProductDemoInner() {
  const demo = useProductDemo();
  const startTimelineRef = useRef<() => void>(() => {});

  const buildActions = useCallback(
    () => ({
      setStage: demo.setStage,
      setActiveChat: demo.setActiveChat,
      setSelectedDocId: demo.setSelectedDocId,
      setHoveredDocId: demo.setHoveredDocId,
      setShowPreview: demo.setShowPreview,
      setApproved: demo.setApproved,
      setShowFieldReveal: demo.setShowFieldReveal,
      setResultsRevealed: demo.setResultsRevealed,
      setMessageSent: demo.setMessageSent,
      setHomeInputText: demo.setHomeInputText,
      setInputFocused: demo.setInputFocused,
      setTypedText: demo.setTypedText,
      setSentenceIndex: demo.setSentenceIndex,
      setCursorPressed: demo.setCursorPressed,
      setCursorVariant: demo.setCursorVariant,
      setCursorVisible: demo.setCursorVisible,
      setIsTransitioning: demo.setIsTransitioning,
      setChatInputText: demo.setChatInputText,
      setChatInputFocused: demo.setChatInputFocused,
      setActiveAskQuestion: demo.setActiveAskQuestion,
      setAgenticStep: demo.setAgenticStep,
      setCompletedAskQuestions: demo.setCompletedAskQuestions,
      resetAll: () => resetDemoState(demo),
    }),
    [demo],
  );

  const getRefs = useCallback(
    () => ({
      container: demo.container,
      cursor: demo.cursor,
      homeInput: demo.homeInput,
      suggestion: demo.suggestion,
      documentRow: demo.documentRow,
      openFullView: demo.openFullView,
      approve: demo.approve,
      askInput: demo.askInput,
      chatInput: demo.chatInput,
      sendButton: demo.sendButton,
      demoRoot: demo.demoRoot,
    }),
    [
      demo.container,
      demo.cursor,
      demo.homeInput,
      demo.suggestion,
      demo.documentRow,
      demo.openFullView,
      demo.approve,
      demo.askInput,
      demo.chatInput,
      demo.sendButton,
      demo.demoRoot,
    ],
  );

  const startTimeline = useCallback(() => {
    const timelineRef = demo.masterTimeline;
    timelineRef.current?.kill();
    if (demo.cursor.current && demo.container.current) {
      initCursor(demo.cursor.current, demo.container.current);
    }

    const tl = buildMasterTimeline({
      refs: getRefs(),
      actions: buildActions(),
      onComplete: () => startTimelineRef.current(),
    });

    timelineRef.current = tl;
    tl.timeScale(demo.playbackSpeed);
    demo.setIsPaused(false);
    tl.play(0);
  }, [demo.masterTimeline, demo.cursor, demo.playbackSpeed, demo.setIsPaused, buildActions, getRefs]);

  startTimelineRef.current = startTimeline;

  const handleRestart = useCallback(() => {
    demo.masterTimeline.current?.kill();
    resetDemoState(demo);
    requestAnimationFrame(() => startTimelineRef.current());
  }, [demo]);

  const handleJumpToStage = useCallback(
    (stage: DemoStage) => {
      demo.masterTimeline.current?.kill();
      resetDemoState(demo);
      applyStageState(stage, buildActions());

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (stage === "review-results" || stage === "document-preview" || stage === "cursor-to-chat") {
            revealResultsInDom(demo.demoRoot.current);
          }
          if (stage === "document-review" || stage === "approved") {
            revealReviewPanelInDom(demo.demoRoot.current);
          }
          if (stage === "reading-terms") {
            revealExtractedTermsInDom(demo.demoRoot.current);
          }
          if (stage === "grounded-answer") {
            revealAnswerInDom(demo.demoRoot.current);
          }
          if (ASK_RESULTS_STAGES.includes(stage)) {
            const qIndex = getAskQuestionIndex(stage);
            if (qIndex !== null) {
              for (let i = 0; i <= qIndex; i++) {
                revealAskResponseInDom(demo.demoRoot.current, i);
              }
            }
          }

          const tl = buildMasterTimeline({
            refs: getRefs(),
            actions: buildActions(),
            onComplete: () => startTimelineRef.current(),
          });
          demo.masterTimeline.current = tl;
          tl.timeScale(demo.playbackSpeed);
          jumpTimelineToStage(tl, stage);
          tl.play();
          demo.setIsPaused(false);
        });
      });
    },
    [demo, buildActions, getRefs],
  );

  const handlePause = useCallback(() => {
    demo.masterTimeline.current?.pause();
    demo.setIsPaused(true);
  }, [demo]);

  const handleResume = useCallback(() => {
    demo.masterTimeline.current?.resume();
    demo.setIsPaused(false);
  }, [demo]);

  const advanceFromManual = useCallback(
    (stage: DemoStage) => {
      handleJumpToStage(stage);
    },
    [handleJumpToStage],
  );

  const handleSuggestionClick = useCallback(
    (id: string) => {
      const questionId = id as AskQuestionId;
      const stageMap: Record<AskQuestionId, DemoStage> = {
        "leases-action": "ask-q1-submitted",
        "rent-leakage": "ask-q2-submitted",
        "below-market": "ask-q3-submitted",
        "rent-increase": "ask-q4-submitted",
      };
      demo.setActiveAskQuestion(questionId);
      advanceFromManual(stageMap[questionId] ?? "question-submitted");
    },
    [demo, advanceFromManual],
  );

  useEffect(() => {
    demo.restartRef.current = handleRestart;
    demo.jumpRef.current = handleJumpToStage;
  }, [demo.restartRef, demo.jumpRef, handleRestart, handleJumpToStage]);

  useEffect(() => {
    const id = requestAnimationFrame(() => startTimelineRef.current());
    return () => {
      cancelAnimationFrame(id);
      demo.masterTimeline.current?.kill();
    };
  }, [demo.masterTimeline]);

  const isWorkspace = WORKSPACE_STAGES.includes(demo.stage);
  const isReview = REVIEW_STAGES.includes(demo.stage);
  const showConversation = !isWorkspace && !isReview;
  const showPreviewPanel =
    demo.showPreview &&
    (demo.stage === "document-preview" || demo.selectedDocId !== null);

  return (
    <div
      ref={demo.container}
      className="relative flex h-full w-full overflow-hidden"
    >
      <div ref={demo.demoRoot} className="flex h-full w-full">
        {showConversation ? (
          <>
            <BrikliSidebar activeNavId="ask" />
            <div className="flex min-w-0 flex-1">
              <ConversationView
                stage={demo.stage}
                homeInputText={demo.homeInputText}
                inputFocused={demo.inputFocused}
                chatInputText={demo.chatInputText}
                chatInputFocused={demo.chatInputFocused}
                agenticStep={demo.agenticStep}
                completedAskQuestions={demo.completedAskQuestions}
                showPreview={showPreviewPanel}
                selectedDocId={demo.selectedDocId}
                hoveredDocId={demo.hoveredDocId}
                onSuggestionClick={handleSuggestionClick}
                onDocumentClick={() => advanceFromManual("document-preview")}
                homeInputRef={demo.homeInput}
                chatInputRef={demo.chatInput}
                suggestionRef={demo.suggestion}
                documentRowRef={demo.documentRow}
              />
              {showPreviewPanel && (
                <DocumentPreview
                  visible={demo.showPreview}
                  onOpenFullView={() => advanceFromManual("document-review")}
                  openFullViewRef={demo.openFullView}
                />
              )}
            </div>
          </>
        ) : isReview ? (
          <DocumentReview
            approved={demo.approved}
            onApprove={() => advanceFromManual("approved")}
            approveRef={demo.approve}
            showFieldReveal={demo.showFieldReveal}
          />
        ) : (
          <DocumentWorkspace
            stage={demo.stage}
            typedText={demo.typedText}
            messageSent={demo.messageSent}
            onSendQuestion={() => advanceFromManual("reading-terms")}
            askInputRef={demo.askInput}
            sendButtonRef={demo.sendButton}
            sentenceIndex={demo.sentenceIndex}
          />
        )}
      </div>

      <FakeCursor
        ref={demo.cursor}
        isPressed={demo.cursorPressed}
        variant={demo.cursorVariant}
        visible={demo.cursorVisible}
      />
    </div>
  );
}

export function BrikliProductDemo() {
  return (
    <ProductDemoProvider>
      <BrikliProductDemoInner />
    </ProductDemoProvider>
  );
}

export function ProductDemoShell() {
  return (
    <div className="relative mx-auto aspect-[1440/900] w-full max-w-[1440px] overflow-hidden rounded-xl border border-[#E8E8E6] bg-[#FAFAF8] shadow-[0_8px_40px_rgba(0,0,0,0.06)]">
      <BrikliProductDemo />
    </div>
  );
}
