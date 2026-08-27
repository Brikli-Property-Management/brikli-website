import gsap from "gsap";
import {
  DEMO_TIMING,
  ROW_STAGGER,
  type DemoStage,
} from "@/animation/timing";
import {
  addAskResponseReveal,
  addCursorClick,
  addCursorDrag,
  addCursorFadeIn,
  addCursorFadeOut,
  addCursorHoverPause,
  addCursorMoveAndClick,
  addDomReadyPause,
  addLayoutSettlePause,
  addPopIn,
  addStaggerPopIn,
  addTypeText,
  initCursor,
  msToSec,
} from "@/animation/helpers";
import {
  activeChatTitle,
  askQuestions,
  focusDocumentRowId,
  rentIncreaseResponse,
  reviewExplanation,
  reviewDocuments,
  type AskQuestionId,
} from "@/data/productDemoData";
import type { DemoRefs } from "@/animation/productDemoController";

export type DemoActions = {
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
  resetAll: () => void;
};

type BuildTimelineOptions = {
  refs: DemoRefs;
  actions: DemoActions;
  onComplete?: () => void;
};

const ASK_FLOW: {
  submitted: DemoStage;
  thinking: DemoStage;
  results: DemoStage;
  questionId: AskQuestionId;
}[] = [
  {
    submitted: "ask-q1-submitted",
    thinking: "ask-q1-thinking",
    results: "ask-q1-results",
    questionId: "leases-action",
  },
  {
    submitted: "ask-q2-submitted",
    thinking: "ask-q2-thinking",
    results: "ask-q2-results",
    questionId: "rent-leakage",
  },
  {
    submitted: "ask-q3-submitted",
    thinking: "ask-q3-thinking",
    results: "ask-q3-results",
    questionId: "below-market",
  },
  {
    submitted: "ask-q4-submitted",
    thinking: "ask-q4-thinking",
    results: "ask-q4-results",
    questionId: "rent-increase",
  },
];

const cursorActions = (actions: DemoActions) => ({
  setCursorPressed: actions.setCursorPressed,
});

function resolveHomeInput(refs: DemoRefs, demoRoot: HTMLElement): HTMLElement | null {
  return refs.homeInput.current ?? demoRoot.querySelector<HTMLElement>(".home-input");
}

function resolveChatInput(refs: DemoRefs, demoRoot: HTMLElement): HTMLElement | null {
  return refs.chatInput.current ?? demoRoot.querySelector<HTMLElement>(".chat-input");
}

function addReviewResultsReveal(
  tl: gsap.core.Timeline,
  demoRoot: HTMLElement,
  actions: DemoActions,
): void {
  tl.addLabel("review-results");
  tl.call(() => actions.setStage("review-results"));
  addDomReadyPause(tl, 150);

  addPopIn(tl, () => demoRoot.querySelector(".review-summary"), {
    origin: "left",
    y: 8,
    scale: 0.97,
    duration: 0.4,
  });
  tl.to({}, { duration: 0.1 });

  addStaggerPopIn(tl, () => demoRoot.querySelectorAll(".review-row"), ROW_STAGGER, {
    origin: "left",
    y: 8,
    scale: 0.97,
    duration: 0.34,
  });
  tl.to({}, {
    duration: msToSec(
      Math.max(0, (reviewDocuments.length - 1) * ROW_STAGGER + 340),
    ),
  });

  addPopIn(tl, () => demoRoot.querySelector(".review-show-all"), {
    origin: "left",
    y: 6,
    scale: 0.98,
    duration: 0.32,
  });
  tl.to({}, { duration: 0.08 });

  addPopIn(tl, () => demoRoot.querySelector(".review-explanation-intro"), {
    origin: "left",
    y: 8,
    scale: 0.98,
    duration: 0.36,
  });
  tl.to({}, { duration: 0.06 });

  addPopIn(tl, () => demoRoot.querySelector(".review-explanation-heading"), {
    origin: "left",
    y: 6,
    scale: 0.98,
    duration: 0.3,
  });
  tl.to({}, { duration: 0.06 });

  addStaggerPopIn(tl, () => demoRoot.querySelectorAll(".review-explanation-item"), 70, {
    origin: "left",
    y: 6,
    scale: 0.98,
    duration: 0.28,
  });
  tl.to({}, {
    duration: msToSec(
      Math.max(0, (reviewExplanation.topItems.length - 1) * 70 + 280),
    ),
  });

  addPopIn(tl, () => demoRoot.querySelector(".review-explanation-closing"), {
    origin: "left",
    y: 8,
    scale: 0.98,
    duration: 0.36,
  });
  tl.call(() => actions.setResultsRevealed(true));
  tl.to({}, { duration: msToSec(DEMO_TIMING.resultHold) });
}

function addAskQuestionSequence(
  tl: gsap.core.Timeline,
  index: number,
  refs: DemoRefs,
  actions: DemoActions,
  demoRoot: HTMLElement,
  cursor: HTMLElement,
  container: HTMLElement,
): void {
  const flow = ASK_FLOW[index];
  const question = askQuestions[index];
  const ca = cursorActions(actions);

  tl.addLabel(flow.submitted);

  if (index === 0) {
    tl.addLabel("cursor-to-chat");
    addDomReadyPause(tl, 120);
    addLayoutSettlePause(tl, 250);
    addCursorFadeIn(tl, cursor);
    addCursorDrag(
      tl,
      cursor,
      () => resolveChatInput(refs, demoRoot),
      container,
      DEMO_TIMING.cursorToChatInput,
    );
    addCursorHoverPause(tl, 300);
    addCursorClick(tl, cursor, ca);
  } else {
    addLayoutSettlePause(tl, 180);
    addCursorFadeIn(tl, cursor);
    addCursorMoveAndClick(
      tl,
      cursor,
      () => resolveChatInput(refs, demoRoot),
      container,
      DEMO_TIMING.cursorToChatInput * 0.8,
      DEMO_TIMING.chatInputClick,
      ca,
    );
  }

  addTypeText(tl, question.label, actions.setChatInputText, {
    cursor,
    setCursorVisible: actions.setCursorVisible,
    onFocus: () => actions.setChatInputFocused(true),
    onBlur: () => actions.setChatInputFocused(false),
  });

  addCursorHoverPause(tl, 200);
  addCursorClick(tl, cursor, ca);
  tl.call(() => {
    actions.setStage(flow.submitted);
    actions.setActiveAskQuestion(flow.questionId);
    actions.setChatInputText("");
    actions.setCompletedAskQuestions(ASK_FLOW.slice(0, index + 1).map((f) => f.questionId));
  });
  addCursorFadeOut(tl, cursor);
  tl.to({}, { duration: msToSec(DEMO_TIMING.messagePopHold) });

  tl.addLabel(flow.thinking);
  tl.call(() => {
    actions.setStage(flow.thinking);
    actions.setAgenticStep(-1);
  });
  tl.to({}, { duration: msToSec(DEMO_TIMING.askThinking * 0.35) });

  if (flow.questionId === "rent-increase") {
    rentIncreaseResponse.processingSteps.forEach((_, stepIndex) => {
      tl.call(() => actions.setAgenticStep(stepIndex));
      tl.to({}, { duration: msToSec(450) });
    });
    tl.call(() => actions.setAgenticStep(rentIncreaseResponse.processingSteps.length - 1));
  }

  tl.to({}, { duration: msToSec(DEMO_TIMING.askThinking * 0.65) });

  tl.addLabel(flow.results);
  tl.call(() => {
    actions.setStage(flow.results);
    actions.setAgenticStep(-1);
  });
  addDomReadyPause(tl, 120);
  addAskResponseReveal(tl, demoRoot, index);
  tl.to({}, { duration: msToSec(DEMO_TIMING.askResultHold) });
}

export function buildMasterTimeline({
  refs,
  actions,
  onComplete,
}: BuildTimelineOptions): gsap.core.Timeline {
  const tl = gsap.timeline({ paused: true, onComplete });

  const container = refs.container.current;
  const cursor = refs.cursor.current;
  const demoRoot = refs.demoRoot.current;

  if (!container || !cursor || !demoRoot) return tl;

  initCursor(cursor, container);
  const ca = cursorActions(actions);

  // Scene 1: Ask Brikli home
  tl.addLabel("ask-home");
  tl.call(() => actions.setStage("ask-home"));
  tl.to({}, { duration: msToSec(DEMO_TIMING.introHold) });

  // Scene 2: Move to input → click → type → Enter
  tl.addLabel("question-submitted");
  addCursorFadeIn(tl, cursor);
  addCursorMoveAndClick(
    tl,
    cursor,
    () => resolveHomeInput(refs, demoRoot),
    container,
    DEMO_TIMING.cursorToHomeInput,
    DEMO_TIMING.homeInputClick,
    ca,
  );
  addTypeText(tl, activeChatTitle, actions.setHomeInputText, {
    cursor,
    setCursorVisible: actions.setCursorVisible,
    onFocus: () => actions.setInputFocused(true),
    onBlur: () => actions.setInputFocused(false),
  });

  addCursorHoverPause(tl, 200);
  addCursorClick(tl, cursor, ca);
  tl.call(() => {
    actions.setStage("question-submitted");
    actions.setActiveChat(activeChatTitle);
    actions.setHomeInputText("");
  });
  addCursorFadeOut(tl, cursor);
  tl.to({}, { duration: msToSec(DEMO_TIMING.messagePopHold) });
  tl.to({}, { duration: msToSec(DEMO_TIMING.questionTransition) });

  // Scene 3: Thinking
  tl.addLabel("thinking");
  tl.call(() => actions.setStage("thinking"));
  tl.to({}, { duration: msToSec(DEMO_TIMING.thinking) });

  // Scene 4: Review results
  addReviewResultsReveal(tl, demoRoot, actions);

  // Scenes 5–8: Four Ask Brikli marketing conversations
  ASK_FLOW.forEach((_, index) => {
    addAskQuestionSequence(tl, index, refs, actions, demoRoot, cursor, container);
  });

  // Loop
  tl.to(demoRoot, { opacity: 0, duration: msToSec(DEMO_TIMING.loopFade * 0.5) });
  tl.call(() => actions.resetAll());
  tl.set(demoRoot, { opacity: 1 });

  return tl;
}

export function jumpTimelineToStage(tl: gsap.core.Timeline, stage: DemoStage): void {
  if (tl.labels[stage] !== undefined) {
    tl.seek(stage);
  }
}

export function applyStageState(stage: DemoStage, actions: DemoActions): void {
  actions.resetAll();

  const askIndex = ASK_FLOW.findIndex(
    (f) => f.submitted === stage || f.thinking === stage || f.results === stage,
  );
  if (askIndex >= 0) {
    actions.setActiveChat(activeChatTitle);
    actions.setResultsRevealed(true);
    const flow = ASK_FLOW[askIndex];
    actions.setStage(stage);
    actions.setActiveAskQuestion(flow.questionId);
    actions.setCompletedAskQuestions(
      ASK_FLOW.slice(0, askIndex + (stage === flow.results ? 1 : 0)).map((f) => f.questionId),
    );
    if (stage === flow.thinking && flow.questionId === "rent-increase") {
      actions.setAgenticStep(rentIncreaseResponse.processingSteps.length - 1);
    }
    if (stage === flow.results) {
      actions.setAgenticStep(-1);
    }
    return;
  }

  switch (stage) {
    case "ask-home":
      break;
    case "question-submitted":
      actions.setStage("question-submitted");
      actions.setActiveChat(activeChatTitle);
      break;
    case "thinking":
      actions.setStage("thinking");
      actions.setActiveChat(activeChatTitle);
      break;
    case "review-results":
      actions.setStage("review-results");
      actions.setActiveChat(activeChatTitle);
      actions.setResultsRevealed(true);
      break;
    case "cursor-to-chat":
      actions.setStage("review-results");
      actions.setActiveChat(activeChatTitle);
      actions.setResultsRevealed(true);
      break;
    case "document-preview":
      actions.setStage("document-preview");
      actions.setActiveChat(activeChatTitle);
      actions.setSelectedDocId(focusDocumentRowId);
      actions.setShowPreview(true);
      actions.setResultsRevealed(true);
      break;
    case "document-review":
      actions.setStage("document-review");
      actions.setShowFieldReveal(true);
      break;
    case "approved":
      actions.setStage("approved");
      actions.setShowFieldReveal(true);
      actions.setApproved(true);
      break;
    case "document-ask":
      actions.setStage("document-ask");
      break;
    case "renewal-question":
      actions.setStage("renewal-question");
      break;
    case "reading-terms":
      actions.setStage("reading-terms");
      break;
    case "grounded-answer":
      actions.setStage("grounded-answer");
      actions.setSentenceIndex(1);
      break;
  }
}
