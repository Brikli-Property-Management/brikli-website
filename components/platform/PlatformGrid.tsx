"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { PLATFORM_PILLAR_OFFSETS } from "@/animation/platformTiming";
import {
  initPlatformGsap,
  killPlatformTimelines,
  prefersReducedMotion,
} from "@/animation/animationHelpers";
import { PlatformCard } from "@/components/platform/PlatformCard";
import { RecordsAnimation } from "@/components/platform/records/RecordsAnimation";
import { IntelligenceAnimation } from "@/components/platform/intelligence/IntelligenceAnimation";
import { RulesAnimation } from "@/components/platform/rules/RulesAnimation";
import { ExecutionAnimation } from "@/components/platform/execution/ExecutionAnimation";
import { platformTheme } from "@/components/platform/platformTheme";
import type { PlatformPillarId, PlatformPillarMeta } from "@/components/platform/types";
import { PLATFORM_PILLARS } from "@/data/platformDemoData";

const PILLAR_ORDER: PlatformPillarId[] = [
  "records",
  "intelligence",
  "rules",
  "execution",
];

const PILLAR_ANIMATIONS = {
  records: RecordsAnimation,
  intelligence: IntelligenceAnimation,
  rules: RulesAnimation,
  execution: ExecutionAnimation,
} as const;

function buildPillarMeta(id: PlatformPillarId): PlatformPillarMeta {
  const data = PLATFORM_PILLARS[id];
  return {
    id,
    number: data.number,
    title: data.title,
    subtitle: data.subtitle,
    description: data.description,
  };
}

export function PlatformGrid() {
  const [hoveredPillar, setHoveredPillar] = useState<PlatformPillarId | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timelinesRef = useRef<Map<PlatformPillarId, gsap.core.Timeline>>(new Map());

  useEffect(() => {
    initPlatformGsap();
    setReducedMotion(prefersReducedMotion());

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const handleTimelineReady = useCallback(
    (pillarId: PlatformPillarId, timeline: gsap.core.Timeline) => {
      timelinesRef.current.set(pillarId, timeline);
      timeline.play(PLATFORM_PILLAR_OFFSETS[pillarId]);
    },
    [],
  );

  useEffect(() => {
    return () => {
      killPlatformTimelines(...timelinesRef.current.values());
      timelinesRef.current.clear();
    };
  }, []);

  const handleHoverChange = useCallback((id: PlatformPillarId, hovered: boolean) => {
    setHoveredPillar(hovered ? id : null);
  }, []);

  return (
    <section
      className="w-full max-w-6xl px-4 md:px-8"
      style={{ color: platformTheme.text }}
      aria-label="Brikli platform pillars"
    >
      <header className="mb-10 md:mb-12">
        <p
          className="mb-2 text-xs font-medium uppercase tracking-[0.2em]"
          style={{ color: platformTheme.textSubtle }}
        >
          Platform
        </p>
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          A living operating system for property
        </h2>
      </header>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
        {PILLAR_ORDER.map((id) => {
          const Animation = PILLAR_ANIMATIONS[id];
          return (
            <PlatformCard
              key={id}
              pillar={buildPillarMeta(id)}
              isHovered={hoveredPillar === id}
              onHoverChange={(hovered) => handleHoverChange(id, hovered)}
            >
              <Animation
                pillarId={id}
                isHovered={hoveredPillar === id}
                reducedMotion={reducedMotion}
                onTimelineReady={(tl) => handleTimelineReady(id, tl)}
              />
            </PlatformCard>
          );
        })}
      </div>
    </section>
  );
}
