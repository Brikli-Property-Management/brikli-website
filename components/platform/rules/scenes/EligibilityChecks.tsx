"use client";

import { useRef } from "react";
import gsap from "gsap";
import { PLATFORM_EASE, PLATFORM_INTERACTION } from "@/animation/platformTiming";
import { qa, q, sceneRootClass, useSceneAnimation } from "@/components/platform/hooks/useSceneAnimation";
import { platformTheme } from "@/components/platform/platformTheme";
import type { PlatformSceneProps } from "@/components/platform/types";
import { ELIGIBILITY_ROWS } from "@/data/rulesDemoData";
import { cn } from "@/lib/utils";

export function EligibilityChecks({ isActive, reducedMotion }: PlatformSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useSceneAnimation(isActive, reducedMotion, rootRef, (root) => {
    const tl = gsap.timeline();
    const rows = qa(root, "[data-row]");
    const checks = qa(root, "[data-check]");
    const action = q(root, "[data-action]");

    gsap.set(rows, { opacity: 0, x: -10 });
    gsap.set(checks, { opacity: 0, scale: 0.4, rotation: -45 });
    gsap.set(action, { opacity: 0, y: 8, scale: 0.98 });

    rows.forEach((row, i) => {
      tl.to(row, { opacity: 1, x: 0, duration: PLATFORM_INTERACTION.rowReveal, ease: PLATFORM_EASE.out }, i * 0.32);
      tl.to(row, { borderColor: platformTheme.accentGreen, duration: 0.15 }, i * 0.32 + 0.12);
      if (checks[i]) {
        tl.to(checks[i], { opacity: 1, scale: 1, rotation: 0, duration: PLATFORM_INTERACTION.checkReveal, ease: "back.out(1.6)" }, i * 0.32 + 0.18);
      }
    });

    tl.to(action, { opacity: 1, y: 0, scale: 1, duration: 0.32, ease: PLATFORM_EASE.out }, "-=0.08");
    return tl;
  });

  return (
    <div
      ref={rootRef}
      data-scene={0}
      className={cn("absolute inset-0 flex flex-col rounded-lg bg-white p-3", sceneRootClass(isActive, reducedMotion))}
      aria-hidden={!isActive && !reducedMotion}
    >
      <p className="mb-2 text-[10px] font-medium uppercase tracking-wider" style={{ color: platformTheme.textSubtle }}>
        Eligibility engine
      </p>
      <div className="flex-1 space-y-1.5">
        {ELIGIBILITY_ROWS.map((row) => (
          <div
            key={row.label}
            data-row
            data-reveal
            className="flex items-center justify-between rounded border px-2 py-1.5 transition-colors"
            style={{ borderColor: platformTheme.border }}
          >
            <div>
              <p className="text-[9px]" style={{ color: platformTheme.textMuted }}>{row.label}</p>
              <p className="text-[10px] font-semibold" style={{ color: platformTheme.text }}>{row.value}</p>
            </div>
            <span data-check data-reveal className="text-sm font-bold" style={{ color: platformTheme.accentGreen }}>✓</span>
          </div>
        ))}
      </div>
      <div
        data-action
        data-reveal
        className="mt-2 rounded px-3 py-2 text-center text-[10px] font-bold uppercase tracking-wider"
        style={{ background: platformTheme.accentGreen, color: "white", opacity: reducedMotion ? 1 : 0 }}
      >
        Action supported
      </div>
    </div>
  );
}
