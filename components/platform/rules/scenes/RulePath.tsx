"use client";

import { useRef } from "react";
import gsap from "gsap";
import { PLATFORM_EASE, PLATFORM_INTERACTION } from "@/animation/platformTiming";
import { qa, q, sceneRootClass, useSceneAnimation } from "@/components/platform/hooks/useSceneAnimation";
import { platformTheme } from "@/components/platform/platformTheme";
import type { PlatformSceneProps } from "@/components/platform/types";
import { RULE_PATH, RULE_PATH_RESULT } from "@/data/rulesDemoData";
import { cn } from "@/lib/utils";

export function RulePath({ isActive, reducedMotion }: PlatformSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useSceneAnimation(isActive, reducedMotion, rootRef, (root) => {
    const tl = gsap.timeline();
    const nodes = qa(root, "[data-node]");
    const arrows = qa(root, "[data-arrow]");

    gsap.set(nodes, { opacity: 0.2, scale: 0.97, borderColor: platformTheme.border });
    gsap.set(arrows, { opacity: 0 });
    gsap.set(q(root, "[data-result]"), { opacity: 0, y: 6, scale: 0.96 });

    nodes.forEach((node, i) => {
      tl.to(node, {
        opacity: 1,
        scale: 1,
        borderColor: platformTheme.accentGreen,
        backgroundColor: platformTheme.accentTint,
        duration: PLATFORM_INTERACTION.rowReveal,
        ease: PLATFORM_EASE.out,
      }, i * 0.34);
      if (arrows[i]) {
        tl.to(arrows[i], { opacity: 1, duration: 0.12 }, i * 0.34 + 0.2);
      }
    });

    tl.to(q(root, "[data-result]"), { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: PLATFORM_EASE.out }, "-=0.12");
    return tl;
  });

  return (
    <div
      ref={rootRef}
      data-scene={1}
      className={cn("absolute inset-0 flex flex-col items-center rounded-lg bg-[#F4F1E8] p-3", sceneRootClass(isActive, reducedMotion))}
      aria-hidden={!isActive && !reducedMotion}
    >
      <p className="mb-2 self-start text-[10px] font-medium uppercase tracking-wider" style={{ color: platformTheme.textSubtle }}>
        Rule path
      </p>
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-1">
        {RULE_PATH.map((step, i) => (
          <div key={step} className="flex flex-col items-center">
            <div
              data-node
              data-reveal
              className="rounded border px-3 py-1 text-[10px] font-medium"
              style={{ borderColor: platformTheme.border, color: platformTheme.text }}
            >
              {step}
            </div>
            {i < RULE_PATH.length - 1 && (
              <span data-arrow data-reveal className="text-[10px] leading-none" style={{ color: platformTheme.textSubtle }}>↓</span>
            )}
          </div>
        ))}
      </div>
      <div
        data-result
        data-reveal
        className="relative -top-8 mb-2 mt-3 shrink-0 rounded-md border px-5 py-2 text-sm font-semibold"
        style={{ borderColor: platformTheme.accentGreen, background: platformTheme.accentTint, color: platformTheme.accentGreen, opacity: reducedMotion ? 1 : 0 }}
      >
        {RULE_PATH_RESULT}
      </div>
    </div>
  );
}
