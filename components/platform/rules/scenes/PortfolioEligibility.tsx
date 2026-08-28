"use client";

import { useRef } from "react";
import gsap from "gsap";
import { PLATFORM_EASE, PLATFORM_INTERACTION } from "@/animation/platformTiming";
import { qa, q, sceneRootClass, useSceneAnimation } from "@/components/platform/hooks/useSceneAnimation";
import { platformTheme } from "@/components/platform/platformTheme";
import type { PlatformSceneProps } from "@/components/platform/types";
import { PORTFOLIO_ELIGIBILITY } from "@/data/rulesDemoData";
import { cn } from "@/lib/utils";

export function PortfolioEligibility({ isActive, reducedMotion }: PlatformSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useSceneAnimation(isActive, reducedMotion, rootRef, (root) => {
    const tl = gsap.timeline();
    const segments = qa(root, "[data-segment]");
    const stats = qa(root, "[data-stat]");
    const blockerBars = qa(root, "[data-blocker-bar]");
    const blockers = qa(root, "[data-blocker]");
    const rows = qa(root, "[data-tenancy-row]");
    const footer = q(root, "[data-footer]");

    gsap.set(q(root, "[data-checked]"), { opacity: 0, y: 4 });
    gsap.set(segments, { scaleX: 0, transformOrigin: "left center" });
    gsap.set(stats, { opacity: 0, y: 5 });
    gsap.set(blockerBars, { scaleX: 0, transformOrigin: "left center" });
    gsap.set(blockers, { opacity: 0, x: -6 });
    gsap.set(rows, { opacity: 0, y: 5 });
    gsap.set(footer, { opacity: 0, y: 4 });

    tl.to(q(root, "[data-checked]"), { opacity: 1, y: 0, duration: 0.28, ease: PLATFORM_EASE.out });

    segments.forEach((seg, i) => {
      tl.to(seg, { scaleX: 1, duration: 0.38, ease: PLATFORM_EASE.out }, 0.3 + i * 0.1);
    });

    stats.forEach((stat, i) => {
      tl.to(stat, { opacity: 1, y: 0, duration: PLATFORM_INTERACTION.rowReveal, ease: PLATFORM_EASE.out }, 0.45 + i * 0.08);
    });

    blockers.forEach((b, i) => {
      tl.to(b, { opacity: 1, x: 0, duration: PLATFORM_INTERACTION.rowReveal, ease: PLATFORM_EASE.out }, 0.75 + i * 0.1);
      tl.to(blockerBars[i], { scaleX: 1, duration: 0.35, ease: PLATFORM_EASE.out }, 0.8 + i * 0.1);
    });

    rows.forEach((row, i) => {
      tl.to(row, { opacity: 1, y: 0, duration: PLATFORM_INTERACTION.rowReveal, ease: PLATFORM_EASE.out }, 1.15 + i * 0.09);
    });

    tl.to(footer, { opacity: 1, y: 0, duration: 0.28, ease: PLATFORM_EASE.out }, "-=0.05");
    return tl;
  });

  const total = PORTFOLIO_ELIGIBILITY.eligible + PORTFOLIO_ELIGIBILITY.blocked + PORTFOLIO_ELIGIBILITY.notDue;
  const segments = [
    { count: PORTFOLIO_ELIGIBILITY.eligible, color: platformTheme.accentGreen, label: "eligible" },
    { count: PORTFOLIO_ELIGIBILITY.blocked, color: "#C4847A", label: "blocked" },
    { count: PORTFOLIO_ELIGIBILITY.notDue, color: platformTheme.border, label: "not due" },
  ];

  return (
    <div
      ref={rootRef}
      data-scene={2}
      className={cn("absolute inset-0 flex flex-col rounded-lg bg-[#F4F1E8] p-3", sceneRootClass(isActive, reducedMotion))}
      aria-hidden={!isActive && !reducedMotion}
    >
      <p data-checked data-reveal className="text-[10px] font-semibold" style={{ color: platformTheme.text }}>
        {PORTFOLIO_ELIGIBILITY.checked} tenancies checked
      </p>

      <div className="mt-2 flex h-2.5 overflow-hidden rounded-full" style={{ background: platformTheme.placeholderBg }}>
        {segments.map((seg) => (
          <div
            key={seg.label}
            data-segment
            data-reveal
            className="h-full"
            style={{
              width: `${(seg.count / total) * 100}%`,
              background: seg.color,
              transformOrigin: "left center",
            }}
          />
        ))}
      </div>

      <div className="mt-2 grid grid-cols-3 gap-1.5">
        {segments.map((seg) => (
          <div
            key={seg.label}
            data-stat
            data-reveal
            className="rounded border px-1.5 py-1 text-center"
            style={{ borderColor: platformTheme.border, background: seg.color === platformTheme.border ? platformTheme.placeholderBg : `${seg.color}14` }}
          >
            <p className="text-sm font-semibold tabular-nums leading-none" style={{ color: seg.color === platformTheme.border ? platformTheme.text : seg.color }}>
              {seg.count}
            </p>
            <p className="text-[7px] font-medium uppercase tracking-wide" style={{ color: platformTheme.textMuted }}>
              {seg.label}
            </p>
          </div>
        ))}
      </div>

      <div className="portfolio-blockers mt-2">
        <p className="text-[8px] font-medium uppercase tracking-wider" style={{ color: platformTheme.textSubtle }}>
          Blockers
        </p>
        {PORTFOLIO_ELIGIBILITY.blockers.map((b) => (
          <div key={b.label} data-blocker data-reveal className="portfolio-blocker-row">
            <div className="flex items-center justify-between text-[9px]">
              <span style={{ color: platformTheme.textMuted }}>{b.label}</span>
              <span className="font-semibold tabular-nums" style={{ color: platformTheme.text }}>{b.count}</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full" style={{ background: platformTheme.placeholderBg }}>
              <div
                data-blocker-bar
                data-reveal
                className="h-full rounded-full"
                style={{
                  width: `${(b.count / b.max) * 100}%`,
                  background: "#C4847A",
                  transformOrigin: "left center",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="portfolio-tenancies mt-3 grid min-h-0 flex-1 grid-rows-[auto_repeat(5,minmax(28px,1fr))] gap-1 overflow-hidden">
        <p className="text-[8px] font-medium uppercase tracking-wider" style={{ color: platformTheme.textSubtle }}>
          Blocked tenancies
        </p>
        {PORTFOLIO_ELIGIBILITY.blockedTenancies.map((t) => (
          <div
            key={t.unit}
            data-tenancy-row
            data-reveal
            className="flex min-h-[28px] items-center justify-between gap-2 overflow-hidden border px-1.5 py-0.5"
            style={{ borderColor: platformTheme.border }}
          >
            <div className="min-w-0">
              <p className="truncate text-[8px] font-semibold" style={{ color: platformTheme.text }}>
                {t.unit} · {t.property}
              </p>
            </div>
            <span className="shrink-0 text-[7px] font-medium" style={{ color: "#9A4D42" }}>
              {t.reason}
            </span>
          </div>
        ))}
      </div>

      <p
        data-footer
        data-reveal
        className="mt-1.5 text-center text-[9px] font-semibold"
        style={{ color: platformTheme.accentGreen, opacity: reducedMotion ? 1 : 0 }}
      >
        {PORTFOLIO_ELIGIBILITY.readyToAction} actions ready to queue
      </p>
    </div>
  );
}
