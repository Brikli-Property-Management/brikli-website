"use client";

import { useRef } from "react";
import gsap from "gsap";
import { PLATFORM_EASE, PLATFORM_INTERACTION } from "@/animation/platformTiming";
import { qa, q, sceneRootClass, useSceneAnimation } from "@/components/platform/hooks/useSceneAnimation";
import { platformTheme } from "@/components/platform/platformTheme";
import type { PlatformSceneProps } from "@/components/platform/types";
import { AUDIT_TRAIL } from "@/data/executionDemoData";
import { cn } from "@/lib/utils";

export function AuditTrail({ isActive, reducedMotion }: PlatformSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useSceneAnimation(isActive, reducedMotion, rootRef, (root) => {
    const tl = gsap.timeline();
    const entries = qa(root, "[data-audit]");

    gsap.set(entries, { opacity: 0, x: -8 });
    gsap.set(q(root, "[data-footer]"), { opacity: 0, y: 4 });

    entries.forEach((entry, i) => {
      tl.to(entry, { opacity: 1, x: 0, duration: PLATFORM_INTERACTION.rowReveal, ease: PLATFORM_EASE.out }, i * 0.22);
    });

    tl.to(q(root, "[data-footer]"), { opacity: 1, y: 0, duration: 0.3, ease: PLATFORM_EASE.out }, "-=0.1");
    return tl;
  });

  return (
    <div
      ref={rootRef}
      data-scene={3}
      className={cn("absolute inset-0 flex flex-col rounded-lg bg-[#F4F1E8] p-3", sceneRootClass(isActive, reducedMotion))}
      aria-hidden={!isActive && !reducedMotion}
    >
      <p className="mb-2 text-[10px] font-medium uppercase tracking-wider" style={{ color: platformTheme.textSubtle }}>
        Audit trail
      </p>
      <div className="flex-1 space-y-1">
        {AUDIT_TRAIL.map((entry) => (
          <div key={`${entry.time}-${entry.event}`} data-audit data-reveal className="flex gap-2.5 border-b pb-1" style={{ borderColor: platformTheme.border }}>
            <span className="w-8 shrink-0 text-[9px] font-mono tabular-nums" style={{ color: platformTheme.textSubtle }}>{entry.time}</span>
            <span className="text-[9px] leading-snug" style={{ color: platformTheme.text }}>{entry.event}</span>
          </div>
        ))}
      </div>
      <p
        data-footer
        data-reveal
        className="mt-2 text-center text-[10px] font-semibold"
        style={{ color: platformTheme.accentGreen, opacity: reducedMotion ? 1 : 0 }}
      >
        Every action accounted for
      </p>
    </div>
  );
}
