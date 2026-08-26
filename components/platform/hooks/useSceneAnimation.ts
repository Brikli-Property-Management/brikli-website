"use client";

import { useLayoutEffect, useRef, type DependencyList, type RefObject } from "react";
import gsap from "gsap";
import { killPlatformTimelines } from "@/animation/animationHelpers";

type BuildTimeline = (root: HTMLElement) => gsap.core.Timeline | void;

/** Run a GSAP timeline while a platform scene is active; clean up on exit. */
export function useSceneAnimation(
  isActive: boolean,
  reducedMotion: boolean,
  rootRef: RefObject<HTMLElement | null>,
  buildTimeline: BuildTimeline,
  deps: DependencyList = [],
): void {
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    killPlatformTimelines(tlRef.current);
    tlRef.current = null;

    const root = rootRef.current;
    if (!root || !isActive) return;

    if (reducedMotion) {
      root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.set(el, { opacity: 1, y: 0, x: 0, scale: 1, scaleX: 1, scaleY: 1, clearProps: "transform" });
      });
      root.querySelectorAll<HTMLElement>("[data-final-opacity]").forEach((el) => {
        gsap.set(el, { opacity: Number(el.dataset.finalOpacity ?? 1) });
      });
      return;
    }

    // Reset animated elements before each loop
    root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      gsap.killTweensOf(el);
    });

    const tl = buildTimeline(root);
    if (tl) {
      tlRef.current = tl;
    }

    return () => {
      killPlatformTimelines(tlRef.current);
      tlRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, reducedMotion, rootRef, ...deps]);
}

export function sceneRootClass(active: boolean, reducedMotion: boolean): string {
  return !active && !reducedMotion ? "pointer-events-none" : "";
}

export function q(root: HTMLElement, selector: string): HTMLElement | null {
  return root.querySelector<HTMLElement>(selector);
}

export function qa(root: HTMLElement, selector: string): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(selector));
}
