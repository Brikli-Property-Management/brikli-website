export type Stage = "records" | "intelligence" | "rules" | "execution";

export const STAGES: Stage[] = [
  "records",
  "intelligence",
  "rules",
  "execution",
];

/** Total time each stage remains active before advancing (ms). */
export const STAGE_DURATION = 6000;

/** Base duration choreography was authored against (seconds). */
export const BASE_STAGE_DURATION_SEC = 6;

/** Content panel crossfade duration (ms). */
export const TRANSITION_DURATION = 450;

export const EASE = {
  smooth: "power2.inOut",
  out: "power2.out",
  in: "power2.in",
} as const;

/** Scale authored second-based timings when STAGE_DURATION changes. */
export function stageSeconds(seconds: number): number {
  const scale = STAGE_DURATION / 1000 / BASE_STAGE_DURATION_SEC;
  return seconds * scale;
}

export const STAGE_META: Record<
  Stage,
  { number: string; title: string; subtitle: string; windowTitle: string }
> = {
  records: {
    number: "01",
    title: "Records",
    subtitle: "Ingest the complete tenancy",
    windowTitle: "brikli · records",
  },
  intelligence: {
    number: "02",
    title: "Intelligence",
    subtitle: "Determine what is true",
    windowTitle: "brikli · intelligence",
  },
  rules: {
    number: "03",
    title: "Rules",
    subtitle: "Determine what can happen",
    windowTitle: "brikli · rules",
  },
  execution: {
    number: "04",
    title: "Execution",
    subtitle: "Move the work forward",
    windowTitle: "brikli · execution",
  },
};

/** Records stage internal choreography (seconds at BASE_STAGE_DURATION_SEC). */
export const RECORDS_CHOREOGRAPHY = {
  pipelineStart: 0.5,
  docVerify: [0.8, 1.2, 1.6, 2.0] as const,
  metricsStart: 2.5,
  metricsDuration: 1.0,
  stableAt: 3.5,
} as const;

/** Intelligence stage internal choreography (seconds). */
export const INTELLIGENCE_CHOREOGRAPHY = {
  cardsAppear: 0.3,
  cardStagger: 0.35,
  amendmentControls: 1.8,
  pmsStale: 2.3,
  verifiedFact: 3.0,
} as const;

/** Rules stage internal choreography (seconds). */
export const RULES_CHOREOGRAPHY = {
  rowStagger: 0.45,
  rowStart: 0.5,
  actionDetermined: 3.2,
} as const;

/** Execution stage internal choreography (seconds). */
export const EXECUTION_CHOREOGRAPHY = {
  headerReveal: 0.4,
  fieldsStagger: 0.55,
  fieldsStart: 0.7,
  buttonsReveal: 2.0,
  activityStagger: 0.4,
  activityStart: 2.6,
} as const;

export function nextStage(stage: Stage): Stage {
  const index = STAGES.indexOf(stage);
  return STAGES[(index + 1) % STAGES.length];
}

export function prevStage(stage: Stage): Stage {
  const index = STAGES.indexOf(stage);
  return STAGES[(index - 1 + STAGES.length) % STAGES.length];
}
