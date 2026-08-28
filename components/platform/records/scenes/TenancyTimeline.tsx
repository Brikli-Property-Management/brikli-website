"use client";

import { useRef } from "react";
import gsap from "gsap";
import { PLATFORM_EASE, PLATFORM_INTERACTION } from "@/animation/platformTiming";
import { qa, q, sceneRootClass, useSceneAnimation } from "@/components/platform/hooks/useSceneAnimation";
import { platformTheme } from "@/components/platform/platformTheme";
import type { PlatformSceneProps } from "@/components/platform/types";
import { TENANCY_TIMELINE } from "@/data/recordsDemoData";
import { cn } from "@/lib/utils";

export function TenancyTimeline({ isActive, reducedMotion }: PlatformSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useSceneAnimation(isActive, reducedMotion, rootRef, (root) => {
    const tl = gsap.timeline();
    const items = qa(root, "[data-timeline-item]");
    const details = qa(root, "[data-tenancy-detail]");

    gsap.set(items, { opacity: 0, x: -8 });
    gsap.set(details, { opacity: 0, y: 6 });
    gsap.set(q(root, "[data-timeline-progress]"), { scaleY: 0, transformOrigin: "top center" });
    gsap.set(q(root, "[data-summary]"), { opacity: 0, y: 8 });

    tl.to(
      q(root, "[data-timeline-progress]"),
      { scaleY: 1, duration: 1.2, ease: PLATFORM_EASE.smooth },
      0.08,
    );

    items.forEach((item, i) => {
      tl.to(item, { opacity: 1, x: 0, duration: PLATFORM_INTERACTION.rowReveal, ease: PLATFORM_EASE.out }, i * 0.26);
      if (item.dataset.superseded === "true") {
        const strike = item.querySelector("[data-strike]");
        const renewal = item.querySelector("[data-renewal-badge]");
        if (strike) {
          tl.to(strike, { opacity: 0.35, textDecoration: "line-through", duration: 0.35 }, i * 0.26 + 0.22);
        }
        if (renewal) {
          tl.to(renewal, { opacity: 1, scale: 1, duration: 0.22, ease: "back.out(1.5)" }, i * 0.26 + 0.35);
        }
      }
    });

    tl.to(
      details,
      { opacity: 1, y: 0, duration: 0.28, stagger: 0.1, ease: PLATFORM_EASE.out },
      0.42,
    );
    tl.to(q(root, "[data-summary]"), { opacity: 1, y: 0, duration: 0.3, ease: PLATFORM_EASE.out }, "-=0.12");
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
        Tenancy history
      </p>
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_minmax(180px,0.9fr)]">
        <div className="relative flex min-h-0 flex-col justify-between py-1 pl-3">
          <div className="absolute bottom-2 left-[5px] top-2 w-px" style={{ background: platformTheme.border }} />
          <div
            data-timeline-progress
            data-reveal
            className="absolute bottom-2 left-[5px] top-2 w-px"
            style={{ background: platformTheme.accentGreen }}
          />
          {TENANCY_TIMELINE.map((entry) => (
            <div
              key={entry.year}
              data-timeline-item
              data-superseded={entry.superseded}
              data-reveal
              className="relative pl-4"
            >
              <div className="absolute left-0 top-1.5 h-2 w-2 rounded-full border-2 bg-[#F4F1E8]" style={{ borderColor: platformTheme.accentGreen }} />
              <p className="text-[10px] font-semibold" style={{ color: platformTheme.text }}>{entry.year}</p>
              <div className="flex items-center gap-1.5">
                <p data-strike className="text-[10px]" style={{ color: platformTheme.textMuted }}>{entry.event}</p>
                {entry.superseded && (
                  <span
                    data-renewal-badge
                    data-reveal
                    className="rounded px-1 text-[7px] font-semibold uppercase"
                    style={{ background: platformTheme.accentTint, color: platformTheme.accentGreen, opacity: reducedMotion ? 1 : 0, transform: "scale(0.8)" }}
                  >
                    Superseded
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex min-h-0 flex-col rounded border p-3" style={{ borderColor: platformTheme.border, background: platformTheme.accentTint }}>
          <p data-tenancy-detail data-reveal className="text-[8px] font-semibold uppercase tracking-wider" style={{ color: platformTheme.textSubtle }}>
            Current tenancy
          </p>
          <div className="mt-3 grid gap-3">
            <div data-tenancy-detail data-reveal>
              <p className="text-[8px] uppercase tracking-wide" style={{ color: platformTheme.textSubtle }}>Tenant</p>
              <p className="text-[11px] font-semibold" style={{ color: platformTheme.text }}>Ava Chen</p>
            </div>
            <div data-tenancy-detail data-reveal>
              <p className="text-[8px] uppercase tracking-wide" style={{ color: platformTheme.textSubtle }}>Current rent</p>
              <p className="text-[11px] font-semibold" style={{ color: platformTheme.text }}>$2,450 / month</p>
            </div>
            <div data-tenancy-detail data-reveal>
              <p className="text-[8px] uppercase tracking-wide" style={{ color: platformTheme.textSubtle }}>Next action</p>
              <p className="text-[11px] font-semibold" style={{ color: platformTheme.text }}>Renewal review</p>
              <p className="text-[9px]" style={{ color: platformTheme.textMuted }}>Due Aug 31, 2027</p>
            </div>
          </div>
          <p data-tenancy-detail data-reveal className="mt-auto text-[9px] font-medium" style={{ color: platformTheme.accentGreen }}>
            All source documents reconciled
          </p>
        </div>
      </div>
      <div
        data-summary
        data-reveal
        className="mt-auto rounded border px-3 py-2 text-center"
        style={{ borderColor: platformTheme.border, background: platformTheme.accentTint, opacity: reducedMotion ? 1 : 0 }}
      >
        <p className="text-[10px] font-semibold" style={{ color: platformTheme.text }}>4 documents</p>
        <p className="text-[10px]" style={{ color: platformTheme.accentGreen }}>1 verified tenancy history</p>
      </div>
    </div>
  );
}
