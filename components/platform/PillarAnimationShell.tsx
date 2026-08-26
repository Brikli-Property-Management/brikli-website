"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  addSceneRotationStep,
  killPlatformTimelines,
  prefersReducedMotion,
} from "@/animation/animationHelpers";
import {
  PLATFORM_PILLAR_SCENE_DURATIONS,
  PLATFORM_SCENE_COUNT,
} from "@/animation/platformTiming";
import type {
  PlatformAnimationProps,
  PlatformSceneComponent,
} from "@/components/platform/types";

type PillarAnimationShellProps = PlatformAnimationProps & {
  scenes: PlatformSceneComponent[];
};

/**
 * Shared viewport + scene rotation shell.
 * Pillar agents supply four scene components; this handles layout and GSAP cycling.
 */
export function PillarAnimationShell({
  pillarId,
  reducedMotion: reducedMotionProp,
  onTimelineReady,
  scenes,
}: PillarAnimationShellProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [activeScene, setActiveScene] = useState(0);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const reducedMotion = reducedMotionProp || prefersReducedMotion();
    killPlatformTimelines(timelineRef.current);
    timelineRef.current = null;

    const sceneElements = Array.from(
      viewport.querySelectorAll<HTMLElement>("[data-scene]"),
    ).slice(0, PLATFORM_SCENE_COUNT);

    if (reducedMotion) {
      setActiveScene(0);
      sceneElements.forEach((el, index) => {
        gsap.set(el, { opacity: index === 0 ? 1 : 0, y: 0, pointerEvents: index === 0 ? "auto" : "none" });
      });
      const tl = gsap.timeline({ repeat: -1 });
      tl.to({}, { duration: PLATFORM_PILLAR_SCENE_DURATIONS[pillarId].reduce((a, b) => a + b, 0) });
      timelineRef.current = tl;
      onTimelineReady?.(tl);
      return () => killPlatformTimelines(tl);
    }

    if (sceneElements.length === 0) return;

    sceneElements.forEach((el, index) => {
      gsap.set(el, {
        opacity: index === 0 ? 1 : 0,
        y: index === 0 ? 0 : 7,
        pointerEvents: index === 0 ? "auto" : "none",
      });
    });

    const durations = PLATFORM_PILLAR_SCENE_DURATIONS[pillarId];
    const tl = gsap.timeline({ repeat: -1 });
    const rotator = {
      scenes: sceneElements,
      activeIndex: { current: 0 },
    };

    durations.forEach((holdDuration, index) => {
      const nextIndex = (index + 1) % PLATFORM_SCENE_COUNT;
      addSceneRotationStep(tl, rotator, nextIndex, holdDuration);
      tl.call(() => setActiveScene(nextIndex));
    });

    timelineRef.current = tl;
    onTimelineReady?.(tl);

    return () => killPlatformTimelines(tl);
  }, [pillarId, reducedMotionProp, onTimelineReady, scenes]);

  return (
    <div ref={viewportRef} className="relative h-full w-full" data-pillar-viewport={pillarId}>
      {scenes.map((Scene, index) => (
        <Scene
          key={index}
          isActive={activeScene === index}
          reducedMotion={reducedMotionProp}
        />
      ))}
    </div>
  );
}
