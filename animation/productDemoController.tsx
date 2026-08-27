"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import gsap from "gsap";
import type { DemoStage } from "@/animation/timing";
import type { AskQuestionId } from "@/data/productDemoData";

export type DemoRefs = {
  container: RefObject<HTMLDivElement | null>;
  cursor: RefObject<HTMLDivElement | null>;
  homeInput: RefObject<HTMLDivElement | null>;
  suggestion: RefObject<HTMLButtonElement | null>;
  documentRow: RefObject<HTMLButtonElement | null>;
  openFullView: RefObject<HTMLButtonElement | null>;
  approve: RefObject<HTMLButtonElement | null>;
  askInput: RefObject<HTMLDivElement | null>;
  chatInput: RefObject<HTMLDivElement | null>;
  sendButton: RefObject<HTMLButtonElement | null>;
  demoRoot: RefObject<HTMLDivElement | null>;
};

export type DemoState = {
  stage: DemoStage;
  activeChat: string | null;
  selectedDocId: string | null;
  hoveredDocId: string | null;
  showPreview: boolean;
  approved: boolean;
  showFieldReveal: boolean;
  resultsRevealed: boolean;
  messageSent: boolean;
  homeInputText: string;
  inputFocused: boolean;
  typedText: string;
  sentenceIndex: number;
  cursorPressed: boolean;
  cursorVariant: "pointer" | "text";
  cursorVisible: boolean;
  isTransitioning: boolean;
  chatInputText: string;
  chatInputFocused: boolean;
  activeAskQuestion: AskQuestionId | null;
  agenticStep: number;
  completedAskQuestions: AskQuestionId[];
};

type DemoControllerValue = DemoState &
  DemoRefs & {
    setStage: (stage: DemoStage) => void;
    setActiveChat: (chat: string | null) => void;
    setSelectedDocId: (id: string | null) => void;
    setHoveredDocId: (id: string | null) => void;
    setShowPreview: (show: boolean) => void;
    setApproved: (approved: boolean) => void;
    setShowFieldReveal: (show: boolean) => void;
    setResultsRevealed: (revealed: boolean) => void;
    setMessageSent: (sent: boolean) => void;
    setHomeInputText: (text: string) => void;
    setInputFocused: (focused: boolean) => void;
    setTypedText: (text: string) => void;
    setSentenceIndex: (index: number) => void;
    setCursorPressed: (pressed: boolean) => void;
    setCursorVariant: (variant: "pointer" | "text") => void;
    setCursorVisible: (visible: boolean) => void;
    setIsTransitioning: (transitioning: boolean) => void;
    setChatInputText: (text: string) => void;
    setChatInputFocused: (focused: boolean) => void;
    setActiveAskQuestion: (id: AskQuestionId | null) => void;
    setAgenticStep: (step: number) => void;
    setCompletedAskQuestions: (ids: AskQuestionId[]) => void;
    masterTimeline: RefObject<gsap.core.Timeline | null>;
    playbackSpeed: number;
    setPlaybackSpeed: (speed: number) => void;
    isPaused: boolean;
    setIsPaused: (paused: boolean) => void;
    restartRef: RefObject<(() => void) | null>;
    jumpRef: RefObject<((stage: DemoStage) => void) | null>;
  };

const DemoControllerContext = createContext<DemoControllerValue | null>(null);

export function useProductDemo() {
  const ctx = useContext(DemoControllerContext);
  if (!ctx) {
    throw new Error("useProductDemo must be used within ProductDemoProvider");
  }
  return ctx;
}

const INITIAL_STATE: DemoState = {
  stage: "ask-home",
  activeChat: null,
  selectedDocId: null,
  hoveredDocId: null,
  showPreview: false,
  approved: false,
  showFieldReveal: false,
  resultsRevealed: false,
  messageSent: false,
  homeInputText: "",
  inputFocused: false,
  typedText: "",
  sentenceIndex: -1,
  cursorPressed: false,
  cursorVariant: "pointer",
  cursorVisible: true,
  isTransitioning: false,
  chatInputText: "",
  chatInputFocused: false,
  activeAskQuestion: null,
  agenticStep: -1,
  completedAskQuestions: [],
};

export function ProductDemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(INITIAL_STATE);
  const [playbackSpeed, setPlaybackSpeedState] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const homeInputRef = useRef<HTMLDivElement>(null);
  const suggestionRef = useRef<HTMLButtonElement>(null);
  const documentRowRef = useRef<HTMLButtonElement>(null);
  const openFullViewRef = useRef<HTMLButtonElement>(null);
  const approveRef = useRef<HTMLButtonElement>(null);
  const askInputRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLDivElement>(null);
  const sendButtonRef = useRef<HTMLButtonElement>(null);
  const demoRootRef = useRef<HTMLDivElement>(null);
  const masterTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const restartRef = useRef<(() => void) | null>(null);
  const jumpRef = useRef<((stage: DemoStage) => void) | null>(null);

  const setStage = useCallback((stage: DemoStage) => {
    setState((s) => ({ ...s, stage }));
  }, []);

  const setActiveChat = useCallback((activeChat: string | null) => {
    setState((s) => ({ ...s, activeChat }));
  }, []);

  const setSelectedDocId = useCallback((selectedDocId: string | null) => {
    setState((s) => ({ ...s, selectedDocId }));
  }, []);

  const setHoveredDocId = useCallback((hoveredDocId: string | null) => {
    setState((s) => ({ ...s, hoveredDocId }));
  }, []);

  const setShowPreview = useCallback((showPreview: boolean) => {
    setState((s) => ({ ...s, showPreview }));
  }, []);

  const setApproved = useCallback((approved: boolean) => {
    setState((s) => ({ ...s, approved }));
  }, []);

  const setShowFieldReveal = useCallback((showFieldReveal: boolean) => {
    setState((s) => ({ ...s, showFieldReveal }));
  }, []);

  const setResultsRevealed = useCallback((resultsRevealed: boolean) => {
    setState((s) => ({ ...s, resultsRevealed }));
  }, []);

  const setMessageSent = useCallback((messageSent: boolean) => {
    setState((s) => ({ ...s, messageSent }));
  }, []);

  const setHomeInputText = useCallback((homeInputText: string) => {
    setState((s) => ({ ...s, homeInputText }));
  }, []);

  const setInputFocused = useCallback((inputFocused: boolean) => {
    setState((s) => ({ ...s, inputFocused }));
  }, []);

  const setTypedText = useCallback((typedText: string) => {
    setState((s) => ({ ...s, typedText }));
  }, []);

  const setSentenceIndex = useCallback((sentenceIndex: number) => {
    setState((s) => ({ ...s, sentenceIndex }));
  }, []);

  const setCursorPressed = useCallback((cursorPressed: boolean) => {
    setState((s) => ({ ...s, cursorPressed }));
  }, []);

  const setCursorVariant = useCallback((cursorVariant: "pointer" | "text") => {
    // Chat/home typing hides the cursor instead of switching to the I-beam variant.
    setState((s) => ({
      ...s,
      cursorVariant: cursorVariant === "text" ? "pointer" : cursorVariant,
    }));
  }, []);

  const setCursorVisible = useCallback((cursorVisible: boolean) => {
    setState((s) => ({ ...s, cursorVisible }));
  }, []);

  const setIsTransitioning = useCallback((isTransitioning: boolean) => {
    setState((s) => ({ ...s, isTransitioning }));
  }, []);

  const setChatInputText = useCallback((chatInputText: string) => {
    setState((s) => ({ ...s, chatInputText }));
  }, []);

  const setChatInputFocused = useCallback((chatInputFocused: boolean) => {
    setState((s) => ({ ...s, chatInputFocused }));
  }, []);

  const setActiveAskQuestion = useCallback((activeAskQuestion: AskQuestionId | null) => {
    setState((s) => ({ ...s, activeAskQuestion }));
  }, []);

  const setAgenticStep = useCallback((agenticStep: number) => {
    setState((s) => ({ ...s, agenticStep }));
  }, []);

  const setCompletedAskQuestions = useCallback((completedAskQuestions: AskQuestionId[]) => {
    setState((s) => ({ ...s, completedAskQuestions }));
  }, []);

  const setPlaybackSpeed = useCallback((speed: number) => {
    setPlaybackSpeedState(speed);
    masterTimelineRef.current?.timeScale(speed);
  }, []);

  return (
    <DemoControllerContext.Provider
      value={{
        ...state,
        container: containerRef,
        cursor: cursorRef,
        homeInput: homeInputRef,
        suggestion: suggestionRef,
        documentRow: documentRowRef,
        openFullView: openFullViewRef,
        approve: approveRef,
        askInput: askInputRef,
        chatInput: chatInputRef,
        sendButton: sendButtonRef,
        demoRoot: demoRootRef,
        setStage,
        setActiveChat,
        setSelectedDocId,
        setHoveredDocId,
        setShowPreview,
        setApproved,
        setShowFieldReveal,
        setResultsRevealed,
        setMessageSent,
        setHomeInputText,
        setInputFocused,
        setTypedText,
        setSentenceIndex,
        setCursorPressed,
        setCursorVariant,
        setCursorVisible,
        setIsTransitioning,
        setChatInputText,
        setChatInputFocused,
        setActiveAskQuestion,
        setAgenticStep,
        setCompletedAskQuestions,
        masterTimeline: masterTimelineRef,
        playbackSpeed,
        setPlaybackSpeed,
        isPaused,
        setIsPaused,
        restartRef,
        jumpRef,
      }}
    >
      {children}
    </DemoControllerContext.Provider>
  );
}

export function resetDemoState(
  demo: Pick<
    DemoControllerValue,
    | "setStage"
    | "setActiveChat"
    | "setSelectedDocId"
    | "setHoveredDocId"
    | "setShowPreview"
    | "setApproved"
    | "setShowFieldReveal"
    | "setResultsRevealed"
    | "setMessageSent"
    | "setHomeInputText"
    | "setInputFocused"
    | "setTypedText"
    | "setSentenceIndex"
    | "setCursorPressed"
    | "setCursorVariant"
    | "setCursorVisible"
    | "setIsTransitioning"
    | "setChatInputText"
    | "setChatInputFocused"
    | "setActiveAskQuestion"
    | "setAgenticStep"
    | "setCompletedAskQuestions"
  >,
): void {
  demo.setStage("ask-home");
  demo.setActiveChat(null);
  demo.setSelectedDocId(null);
  demo.setHoveredDocId(null);
  demo.setShowPreview(false);
  demo.setApproved(false);
  demo.setShowFieldReveal(false);
  demo.setResultsRevealed(false);
  demo.setMessageSent(false);
  demo.setHomeInputText("");
  demo.setInputFocused(false);
  demo.setTypedText("");
  demo.setSentenceIndex(-1);
  demo.setCursorPressed(false);
  demo.setCursorVariant("pointer");
  demo.setCursorVisible(true);
  demo.setIsTransitioning(false);
  demo.setChatInputText("");
  demo.setChatInputFocused(false);
  demo.setActiveAskQuestion(null);
  demo.setAgenticStep(-1);
  demo.setCompletedAskQuestions([]);
}

export function revealResultsInDom(root: HTMLElement | null): void {
  if (!root) return;
  const selectors = [
    ".review-summary",
    ".review-row",
    ".review-show-all",
    ".review-explanation-intro",
    ".review-explanation-heading",
    ".review-explanation-item",
    ".review-explanation-closing",
  ];
  selectors.forEach((sel) => {
    root.querySelectorAll(sel).forEach((el) => {
      gsap.set(el, { opacity: 1, y: 0, scale: 1 });
    });
  });
}

export function revealReviewPanelInDom(root: HTMLElement | null): void {
  if (!root) return;
  const selectors = [
    ".review-field",
    ".review-warning",
    ".review-worth-checking",
    ".review-classification",
  ];
  selectors.forEach((sel) => {
    root.querySelectorAll(sel).forEach((el) => {
      gsap.set(el, { opacity: 1, y: 0 });
    });
  });
}

export function revealExtractedTermsInDom(root: HTMLElement | null): void {
  if (!root) return;
  gsap.set(root.querySelector(".extracted-terms"), { opacity: 1, y: 0 });
  root.querySelectorAll(".extracted-term-row").forEach((el) => {
    gsap.set(el, { opacity: 1, y: 0 });
  });
}

export function revealAskResponseInDom(root: HTMLElement | null, questionIndex = 0): void {
  if (!root) return;
  const questionIds = ["leases-action", "rent-leakage", "below-market", "rent-increase"];
  const questionId = questionIds[questionIndex];
  const container = root.querySelector(`[data-question="${questionId}"]`) ?? root;
  const selectors = [
    ".ask-response-header",
    ".ask-kpi-headline",
    ".ask-kpi-value",
    ".ask-kpi-subtext",
    ".ask-kpi-secondary",
    ".ask-row",
    ".ask-summary",
    ".ask-mini-viz",
    ".ask-bar-row",
    ".ask-comparables",
    ".ask-comp-chip",
    ".ask-caveat",
    ".ask-forms",
    ".ask-doc-thumb",
    ".ask-evidence",
    ".ask-evidence-chip",
    ".ask-recommendation",
    ".ask-cta",
    ".ask-cta-btn",
  ];
  selectors.forEach((sel) => {
    container.querySelectorAll(sel).forEach((el) => {
      gsap.set(el, { opacity: 1, y: 0, scale: 1 });
      el.classList.remove("opacity-0");
    });
  });
}

export function revealAnswerInDom(root: HTMLElement | null): void {
  if (!root) return;
  gsap.set(root.querySelector(".grounded-answer"), { opacity: 1 });
  root.querySelectorAll(".answer-sentence, .answer-source, .answer-actions").forEach((el) => {
    gsap.set(el, { opacity: 1 });
  });
}
