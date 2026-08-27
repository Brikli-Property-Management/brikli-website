/** All demo timing values in milliseconds — single source of truth. */
export const DEMO_TIMING = {
  introHold: 1200,
  cursorToHomeInput: 900,
  homeInputClick: 300,
  homeTyping: 1800,
  enterSubmit: 400,
  messagePopHold: 500,
  questionTransition: 300,
  thinking: 1400,
  resultsReveal: 1600,
  resultHold: 1200,
  cursorToChatInput: 1100,
  chatInputClick: 300,
  chatTyping: 1400,
  chatSubmit: 400,
  askThinking: 900,
  askResultHold: 1800,
  cursorToDocument: 900,
  documentHover: 350,
  documentClick: 400,
  documentOpen: 900,
  previewHold: 800,
  cursorToOpenFullView: 800,
  openFullViewHover: 300,
  openFullViewClick: 400,
  reviewTransition: 1100,
  reviewReveal: 1200,
  cursorToApprove: 900,
  approvalHover: 450,
  approvalClick: 500,
  approvalHold: 900,
  askDocumentTransition: 1000,
  cursorToAskInput: 800,
  askInputHover: 300,
  renewalTyping: 1600,
  renewalSend: 400,
  extractionThinking: 1400,
  termsReveal: 1200,
  answerReveal: 1700,
  finalHold: 2500,
  loopFade: 600,
} as const;

/** GSAP reveal timing for Ask responses (seconds). */
export const ASK_REVEAL = {
  processingStart: 0.3,
  processingComplete: 1.2,
  headline: 1.4,
  kpiCount: 1.7,
  rowsStart: 2.1,
  rowStagger: 0.08,
  viz: 2.5,
  recommendation: 3.3,
  cta: 3.8,
} as const;

export const DEMO_EASE = {
  smooth: "power2.inOut",
  out: "power2.out",
  inOut: "power3.inOut",
  cursor: "power2.inOut",
} as const;

/** Row stagger for review results (ms). */
export const ROW_STAGGER = 60;

/** Ask response row stagger (ms). */
export const ASK_ROW_STAGGER = 80;

/** Typing speed per character (ms) — deterministic. */
export const TYPING_SPEED = 45;

/** Typing speed variation pattern (deterministic, not random). */
export const TYPING_PATTERN = [1, 1, 1.2, 0.9, 1, 1.1, 0.95, 1] as const;

export type DemoStage =
  | "ask-home"
  | "question-submitted"
  | "thinking"
  | "review-results"
  | "cursor-to-chat"
  | "ask-q1-submitted"
  | "ask-q1-thinking"
  | "ask-q1-results"
  | "ask-q2-submitted"
  | "ask-q2-thinking"
  | "ask-q2-results"
  | "ask-q3-submitted"
  | "ask-q3-thinking"
  | "ask-q3-results"
  | "ask-q4-submitted"
  | "ask-q4-thinking"
  | "ask-q4-results"
  | "document-preview"
  | "document-review"
  | "approved"
  | "document-ask"
  | "renewal-question"
  | "reading-terms"
  | "grounded-answer";

export const ASK_QUESTION_STAGES = [
  "ask-q1-submitted",
  "ask-q1-thinking",
  "ask-q1-results",
  "ask-q2-submitted",
  "ask-q2-thinking",
  "ask-q2-results",
  "ask-q3-submitted",
  "ask-q3-thinking",
  "ask-q3-results",
  "ask-q4-submitted",
  "ask-q4-thinking",
  "ask-q4-results",
] as const;

export const DEMO_STAGES: DemoStage[] = [
  "ask-home",
  "question-submitted",
  "thinking",
  "review-results",
  "cursor-to-chat",
  ...ASK_QUESTION_STAGES,
  "document-preview",
  "document-review",
  "approved",
  "document-ask",
  "renewal-question",
  "reading-terms",
  "grounded-answer",
];

export const STAGE_LABELS: Record<DemoStage, string> = {
  "ask-home": "1 · Ask Brikli home",
  "question-submitted": "2 · Review question submitted",
  thinking: "3 · Brikling",
  "review-results": "4 · Review results",
  "cursor-to-chat": "5 · Cursor to chat input",
  "ask-q1-submitted": "6 · Leases question",
  "ask-q1-thinking": "7 · Leases thinking",
  "ask-q1-results": "8 · Leases results",
  "ask-q2-submitted": "9 · Leakage question",
  "ask-q2-thinking": "10 · Leakage thinking",
  "ask-q2-results": "11 · Leakage results",
  "ask-q3-submitted": "12 · Below market question",
  "ask-q3-thinking": "13 · Below market thinking",
  "ask-q3-results": "14 · Below market results",
  "ask-q4-submitted": "15 · Rent increase question",
  "ask-q4-thinking": "16 · Rent increase thinking",
  "ask-q4-results": "17 · Rent increase results",
  "document-preview": "Legacy · Document preview",
  "document-review": "Legacy · Document review",
  approved: "Legacy · Approved",
  "document-ask": "Legacy · Ask about document",
  "renewal-question": "Legacy · Renewal question",
  "reading-terms": "Legacy · Reading terms",
  "grounded-answer": "Legacy · Grounded answer",
};

const STAGE_ORDER = DEMO_STAGES;

export function isStageAtLeast(current: DemoStage, target: DemoStage): boolean {
  return STAGE_ORDER.indexOf(current) >= STAGE_ORDER.indexOf(target);
}

export function getAskQuestionIndex(stage: DemoStage): number | null {
  const match = stage.match(/^ask-q(\d)-/);
  return match ? Number(match[1]) - 1 : null;
}
