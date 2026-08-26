import type { ComponentType, RefObject } from "react";
import type gsap from "gsap";

export type PlatformPillarId = "records" | "intelligence" | "rules" | "execution";

export const PLATFORM_PILLAR_IDS: PlatformPillarId[] = [
  "records",
  "intelligence",
  "rules",
  "execution",
];

/** Metadata for a platform pillar card — stable text region. */
export type PlatformPillarMeta = {
  id: PlatformPillarId;
  number: string;
  title: string;
  subtitle: string;
  description: string;
};

/** Props passed to every mini-scene component inside a pillar. */
export type PlatformSceneProps = {
  /** Whether this scene is currently visible in the rotation. */
  isActive: boolean;
  /** When true, show a strong static state — no motion. */
  reducedMotion: boolean;
  /** Ref to the scene root for GSAP targeting. */
  sceneRef?: RefObject<HTMLDivElement | null>;
};

/** Props passed to each pillar's top-level animation component. */
export type PlatformAnimationProps = {
  pillarId: PlatformPillarId;
  isHovered: boolean;
  reducedMotion: boolean;
  /** Called when the pillar registers its GSAP timeline with the controller. */
  onTimelineReady?: (timeline: gsap.core.Timeline) => void;
};

/** Ref bundle pillar agents use when building timelines. */
export type PlatformPillarRefs = {
  viewport: RefObject<HTMLDivElement | null>;
  scenes: RefObject<(HTMLDivElement | null)[]>;
};

/** Contract for pillar timeline factory functions. */
export type CreatePillarTimeline = (
  refs: PlatformPillarRefs,
  options: { reducedMotion: boolean },
) => gsap.core.Timeline;

/** Scene component contract — pillar agents implement four of these per pillar. */
export type PlatformSceneComponent = ComponentType<PlatformSceneProps>;
