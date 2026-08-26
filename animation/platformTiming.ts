import type { PlatformPillarId } from "@/components/platform/types";

/** Mini-scene dwell time (seconds). */
export const PLATFORM_SCENE_DURATION = {
  min: 2.5,
  max: 4,
  default: 3.2,
} as const;

/** Within-scene interaction timing (seconds). */
export const PLATFORM_INTERACTION = {
  min: 0.15,
  max: 0.7,
  stagger: 0.12,
  rowReveal: 0.28,
  countUp: 0.6,
  progressFill: 0.5,
  checkReveal: 0.22,
} as const;

/** Full pillar loop duration (seconds). */
export const PLATFORM_LOOP_DURATION = {
  min: 12,
  max: 18,
  default: 15,
} as const;

/** Scene-to-scene crossfade. */
export const PLATFORM_TRANSITION = {
  durationMs: 400,
  durationSec: 0.4,
  ease: "power2.inOut",
  exitY: -5,
  enterY: 7,
} as const;

/** Deterministic stagger offsets when starting pillar timelines (seconds). */
export const PLATFORM_PILLAR_OFFSETS: Record<PlatformPillarId, number> = {
  records: 0,
  intelligence: 0.7,
  rules: 1.4,
  execution: 2.1,
};

export const PLATFORM_SCENE_COUNT = 4;

/** Per-pillar scene durations — sum ≈ PLATFORM_LOOP_DURATION.default */
export const PLATFORM_PILLAR_SCENE_DURATIONS: Record<PlatformPillarId, readonly number[]> = {
  records: [3.2, 3.4, 3.0, 3.4],
  intelligence: [3.4, 3.2, 3.6, 3.0],
  rules: [3.0, 3.4, 3.2, 3.6],
  execution: [3.6, 3.0, 3.4, 3.2],
};

export const PLATFORM_EASE = {
  smooth: "power2.inOut",
  out: "power2.out",
  in: "power2.in",
} as const;

/** Hover border transition (ms). */
export const PLATFORM_HOVER = {
  borderDurationMs: 200,
} as const;
