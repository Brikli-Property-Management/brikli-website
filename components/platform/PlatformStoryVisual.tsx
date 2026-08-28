"use client";

import { useEffect, useState } from "react";
import { initPlatformGsap } from "@/animation/animationHelpers";
import { ExecutionAnimation } from "@/components/platform/execution/ExecutionAnimation";
import { IntelligenceAnimation } from "@/components/platform/intelligence/IntelligenceAnimation";
import { RecordsAnimation } from "@/components/platform/records/RecordsAnimation";
import { RulesAnimation } from "@/components/platform/rules/RulesAnimation";
import type { PlatformPillarId } from "@/components/platform/types";

const PILLAR_ANIMATIONS = {
  records: RecordsAnimation,
  intelligence: IntelligenceAnimation,
  rules: RulesAnimation,
  execution: ExecutionAnimation,
} as const;

export function PlatformStoryVisual({
  pillarId,
  isActive,
}: {
  pillarId: PlatformPillarId;
  isActive: boolean;
}) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const Animation = PILLAR_ANIMATIONS[pillarId];

  useEffect(() => {
    initPlatformGsap();

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReducedMotion(mediaQuery.matches);

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);

    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  return (
    <div className="workflow-story-visual" aria-label={`${pillarId} platform animation`}>
      <Animation
        pillarId={pillarId}
        isHovered={isActive}
        reducedMotion={reducedMotion}
      />
    </div>
  );
}
