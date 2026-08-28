import gsap from "gsap";
import {
  PLATFORM_EASE,
  PLATFORM_TRANSITION,
} from "@/animation/platformTiming";

export function msToSec(ms: number): number {
  return ms / 1000;
}

export type ElementQuery =
  | Element
  | null
  | undefined
  | (() => Element | null | undefined);

function resolveElement(el: ElementQuery): Element | null | undefined {
  return typeof el === "function" ? el() : el;
}

/** Detect reduced-motion preference (client-side). */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function killPlatformTimelines(
  ...timelines: (gsap.core.Timeline | gsap.core.Tween | null | undefined)[]
): void {
  timelines.forEach((tl) => tl?.kill());
}

/** Wait for React to paint newly mounted DOM nodes before GSAP queries. */
export function addDomReadyPause(tl: gsap.core.Timeline, durationMs = 120): void {
  tl.call(() => {});
  tl.to({}, { duration: msToSec(durationMs) });
}

type SceneCrossfadeOptions = {
  duration?: number;
  exitY?: number;
  enterY?: number;
  ease?: string;
};

/**
 * Crossfade between two scene layers inside a pillar visualization viewport.
 * Pillar agents should use this for scene transitions.
 */
export function addSceneCrossfade(
  tl: gsap.core.Timeline,
  outgoing: ElementQuery,
  incoming: ElementQuery,
  options: SceneCrossfadeOptions = {},
): void {
  const {
    duration = PLATFORM_TRANSITION.durationSec,
    exitY = PLATFORM_TRANSITION.exitY,
    enterY = PLATFORM_TRANSITION.enterY,
    ease = PLATFORM_EASE.smooth,
  } = options;

  tl.add(() => {
    const outEl = resolveElement(outgoing);
    const inEl = resolveElement(incoming);
    if (!outEl || !inEl) return;

    gsap.set(inEl, { opacity: 0, y: enterY, pointerEvents: "none" });
    gsap.set(outEl, { opacity: 1, y: 0, pointerEvents: "auto" });

    const inner = gsap.timeline();
    inner.to(outEl, { opacity: 0, y: exitY, duration, ease }, 0);
    inner.to(inEl, { opacity: 1, y: 0, duration, ease });
    inner.call(() => {
      gsap.set(outEl, { pointerEvents: "none" });
      gsap.set(inEl, { pointerEvents: "auto" });
    });

    return inner;
  });
}

type RowRevealOptions = {
  y?: number;
  duration?: number;
  staggerMs?: number;
};

/** Staggered row reveal — opacity + subtle y translation. */
export function addRowReveal(
  tl: gsap.core.Timeline,
  rows: ElementQuery[] | (() => Element[]),
  options: RowRevealOptions = {},
): void {
  const { y = 6, duration = 0.28, staggerMs = 80 } = options;

  tl.add(() => {
    const items = typeof rows === "function" ? rows() : rows.map(resolveElement).filter(Boolean);
    if (items.length === 0) return;

    const inner = gsap.timeline();
    items.forEach((row, index) => {
      if (!row) return;
      gsap.set(row, { opacity: 0, y });
      inner.to(
        row,
        { opacity: 1, y: 0, duration, ease: PLATFORM_EASE.out },
        index * msToSec(staggerMs),
      );
    });
    return inner;
  });
}

type CountUpOptions = {
  duration?: number;
  prefix?: string;
  suffix?: string;
  formatter?: (n: number) => string;
};

/** Animate a number counting up inside an element. */
export function addCountUp(
  tl: gsap.core.Timeline,
  el: ElementQuery,
  target: number,
  options: CountUpOptions = {},
): void {
  const {
    duration = 0.6,
    prefix = "",
    suffix = "",
    formatter = (n) => Math.round(n).toLocaleString(),
  } = options;

  tl.add(() => {
    const resolved = resolveElement(el);
    if (!resolved) return;

    const proxy = { value: 0 };
    return gsap.to(proxy, {
      value: target,
      duration,
      ease: PLATFORM_EASE.out,
      onUpdate: () => {
        resolved.textContent = `${prefix}${formatter(proxy.value)}${suffix}`;
      },
    });
  });
}

type ProgressFillOptions = {
  duration?: number;
  ease?: string;
};

/** Animate a progress bar width from 0 to target percentage. */
export function addProgressFill(
  tl: gsap.core.Timeline,
  el: ElementQuery,
  targetPercent: number,
  options: ProgressFillOptions = {},
): void {
  const { duration = 0.5, ease = PLATFORM_EASE.smooth } = options;

  tl.add(() => {
    const resolved = resolveElement(el) as HTMLElement | null | undefined;
    if (!resolved) return;

    gsap.set(resolved, { width: "0%" });
    return gsap.to(resolved, {
      width: `${targetPercent}%`,
      duration,
      ease,
    });
  });
}

type PopInOptions = {
  y?: number;
  duration?: number;
};

/** Single element pop-in — restrained opacity + y. */
export function addPopIn(
  tl: gsap.core.Timeline,
  el: ElementQuery,
  options: PopInOptions = {},
): void {
  const { y = 6, duration = 0.32 } = options;

  tl.add(() => {
    const resolved = resolveElement(el);
    if (!resolved) return;

    gsap.set(resolved, { opacity: 0, y });
    return gsap.to(resolved, {
      opacity: 1,
      y: 0,
      duration,
      ease: PLATFORM_EASE.out,
    });
  });
}

export type SceneRotatorRefs = {
  scenes: HTMLElement[];
  activeIndex: { current: number };
};

/**
 * Build a repeating scene-rotation segment for a pillar timeline.
 * Pillar agents call this once per scene transition in their timeline builder.
 */
export function addSceneRotationStep(
  tl: gsap.core.Timeline,
  refs: SceneRotatorRefs,
  nextIndex: number,
  holdDurationSec: number,
): void {
  tl.to({}, { duration: holdDurationSec });
  tl.add(() => {
    const { scenes, activeIndex } = refs;
    const current = scenes[activeIndex.current];
    const next = scenes[nextIndex];
    if (!current || !next) return;

    const inner = gsap.timeline();
    inner.to(current, {
      opacity: 0,
      y: PLATFORM_TRANSITION.exitY,
      duration: PLATFORM_TRANSITION.durationSec * 0.55,
      ease: PLATFORM_EASE.smooth,
    });
    inner.fromTo(
      next,
      { opacity: 0, y: PLATFORM_TRANSITION.enterY },
      {
        opacity: 1,
        y: 0,
        duration: PLATFORM_TRANSITION.durationSec * 0.55,
        ease: PLATFORM_EASE.smooth,
      },
    );
    inner.call(() => {
      activeIndex.current = nextIndex;
    });
    return inner;
  });
}

/** Initialize GSAP defaults for platform animations. Call once on mount. */
export function initPlatformGsap(): void {
  gsap.config({ nullTargetWarn: false });
}
