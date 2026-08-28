"use client";

import { useRef } from "react";
import gsap from "gsap";
import { PLATFORM_EASE, PLATFORM_INTERACTION } from "@/animation/platformTiming";
import { qa, q, sceneRootClass, useSceneAnimation } from "@/components/platform/hooks/useSceneAnimation";
import { platformTheme } from "@/components/platform/platformTheme";
import type { PlatformSceneProps } from "@/components/platform/types";
import { LEASE_EXPIRY } from "@/data/intelligenceDemoData";
import { cn } from "@/lib/utils";

export function LeaseExpiry({ isActive, reducedMotion }: PlatformSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useSceneAnimation(isActive, reducedMotion, rootRef, (root) => {
    const tl = gsap.timeline();
    const bars = qa(root, "[data-bar-fill]");
    const stats = qa(root, "[data-stat]");

    gsap.set(stats, { opacity: 0, y: 6 });
    gsap.set(bars, { scaleY: 0, transformOrigin: "bottom center" });
    gsap.set(q(root, "[data-exposed]"), { opacity: 0, y: 4 });

    stats.forEach((stat, i) => {
      tl.to(stat, { opacity: 1, y: 0, duration: 0.25, ease: PLATFORM_EASE.out }, i * 0.15);
    });

    bars.forEach((bar, i) => {
      const h = Number(bar.dataset.height ?? 50);
      tl.to(bar, { scaleY: h / 100, duration: 0.45, ease: PLATFORM_EASE.out }, 0.5 + i * 0.15);
    });

    tl.to(q(root, "[data-exposed]"), { opacity: 1, y: 0, duration: 0.3, ease: PLATFORM_EASE.out }, "-=0.1");
    return tl;
  });

  const maxCount = Math.max(...LEASE_EXPIRY.months.map((m) => m.count));

  return (
    <div
      ref={rootRef}
      data-scene={1}
      className={cn("absolute inset-0 flex flex-col rounded-lg bg-[#F4F1E8] p-3", sceneRootClass(isActive, reducedMotion))}
      aria-hidden={!isActive && !reducedMotion}
    >
      <div data-stat data-reveal>
        <p className="text-[10px] font-semibold" style={{ color: platformTheme.text }}>{LEASE_EXPIRY.title}</p>
        <p className="text-[9px]" style={{ color: platformTheme.textMuted }}>{LEASE_EXPIRY.period}</p>
      </div>
      <div className="mt-2 flex gap-3">
        <div data-stat data-reveal>
          <p className="text-lg font-semibold tabular-nums" style={{ color: platformTheme.text }}>{LEASE_EXPIRY.total}</p>
          <p className="text-[9px]" style={{ color: platformTheme.textMuted }}>total</p>
        </div>
        <div data-stat data-reveal>
          <p className="text-lg font-semibold tabular-nums" style={{ color: platformTheme.accentGreen }}>{LEASE_EXPIRY.needAction}</p>
          <p className="text-[9px]" style={{ color: platformTheme.textMuted }}>need action</p>
        </div>
      </div>
      <div className="mt-3 flex flex-1 items-end justify-around gap-2 border-t pt-3" style={{ borderColor: platformTheme.border }}>
        {LEASE_EXPIRY.months.map((m) => (
          <div key={m.month} className="flex flex-col items-center gap-1">
            <div className="flex h-16 w-8 items-end justify-center rounded-sm" style={{ background: platformTheme.placeholderBg }}>
              <div
                data-bar-fill
                data-height={(m.count / maxCount) * 100}
                data-reveal
                className="w-full rounded-sm"
                style={{ background: platformTheme.accentGreen, height: "100%" }}
              />
            </div>
            <span className="text-[9px] font-medium" style={{ color: platformTheme.textMuted }}>{m.month}</span>
            <span className="text-[10px] font-semibold tabular-nums" style={{ color: platformTheme.text }}>{m.count}</span>
          </div>
        ))}
      </div>
      <p
        data-exposed
        data-reveal
        className="mt-2 text-center text-[10px] font-semibold"
        style={{ color: platformTheme.accentGreen, opacity: reducedMotion ? 1 : 0 }}
      >
        {LEASE_EXPIRY.exposed}
      </p>
    </div>
  );
}
