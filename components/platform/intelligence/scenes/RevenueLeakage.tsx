"use client";

import { useRef } from "react";
import gsap from "gsap";
import { PLATFORM_EASE, PLATFORM_INTERACTION } from "@/animation/platformTiming";
import { qa, q, sceneRootClass, useSceneAnimation } from "@/components/platform/hooks/useSceneAnimation";
import { platformTheme } from "@/components/platform/platformTheme";
import type { PlatformSceneProps } from "@/components/platform/types";
import { REVENUE_LEAKAGE } from "@/data/intelligenceDemoData";
import { cn } from "@/lib/utils";

function formatCurrency(n: number): string {
  return n >= 1000 ? `$${(n / 1000).toFixed(1)}K` : `$${n.toLocaleString()}`;
}

export function RevenueLeakage({ isActive, reducedMotion }: PlatformSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useSceneAnimation(isActive, reducedMotion, rootRef, (root) => {
    const tl = gsap.timeline();
    const monthlyEl = q(root, "[data-monthly-value]");
    const bars = qa(root, "[data-leak-bar]");
    const rows = qa(root, "[data-cause]");
    const affected = qa(root, "[data-affected]");
    const bottom = qa(root, "[data-bottom]");

    gsap.set(q(root, "[data-headline]"), { opacity: 0, y: 5 });
    gsap.set(q(root, "[data-annual]"), { opacity: 0 });
    gsap.set(bars, { width: "0%" });
    gsap.set(rows, { opacity: 0, y: 5 });
    gsap.set(affected, { opacity: 0, x: -6 });
    gsap.set(bottom, { opacity: 0, y: 4 });

    tl.to(q(root, "[data-headline]"), { opacity: 1, y: 0, duration: 0.28, ease: PLATFORM_EASE.out });

    if (monthlyEl) {
      const proxy = { value: 0 };
      tl.to(proxy, {
        value: REVENUE_LEAKAGE.monthly,
        duration: 0.65,
        ease: PLATFORM_EASE.out,
        onUpdate: () => {
          monthlyEl.textContent = `$${Math.round(proxy.value).toLocaleString()}`;
        },
      }, 0.15);
    }

    tl.to(q(root, "[data-annual]"), { opacity: 1, duration: 0.25 }, 0.45);

    const maxAmount = Math.max(...REVENUE_LEAKAGE.causes.map((c) => c.amount));
    rows.forEach((row, i) => {
      tl.to(row, { opacity: 1, y: 0, duration: PLATFORM_INTERACTION.rowReveal, ease: PLATFORM_EASE.out }, 0.7 + i * 0.16);
      const bar = bars[i];
      if (bar) {
        const pct = REVENUE_LEAKAGE.causes[i].amount / maxAmount;
        tl.to(bar, { width: `${pct * 100}%`, duration: 0.65, ease: PLATFORM_EASE.smooth }, 0.82 + i * 0.16);
      }
    });

    affected.forEach((row, i) => {
      tl.to(row, { opacity: 1, x: 0, duration: PLATFORM_INTERACTION.rowReveal, ease: PLATFORM_EASE.out }, 1.35 + i * 0.08);
    });

    bottom.forEach((el, i) => {
      tl.to(el, { opacity: 1, y: 0, duration: 0.24, ease: PLATFORM_EASE.out }, 1.7 + i * 0.08);
    });

    return tl;
  });

  return (
    <div
      ref={rootRef}
      data-scene={2}
      className={cn("absolute inset-0 flex flex-col rounded-lg bg-[#F4F1E8] p-3", sceneRootClass(isActive, reducedMotion))}
      aria-hidden={!isActive && !reducedMotion}
    >
      <p data-headline data-reveal className="shrink-0 text-[10px] font-medium uppercase tracking-wider" style={{ color: platformTheme.textSubtle }}>
        Confirmed revenue leakage
      </p>
      <div data-reveal className="mt-1 flex shrink-0 items-baseline gap-1">
        <span data-monthly-value className="text-xl font-semibold tabular-nums" style={{ color: platformTheme.text }}>
          {reducedMotion ? `$${REVENUE_LEAKAGE.monthly.toLocaleString()}` : "$0"}
        </span>
        <span className="text-[10px]" style={{ color: platformTheme.textMuted }}>/ month</span>
      </div>
      <p data-annual data-reveal className="shrink-0 text-[10px]" style={{ color: platformTheme.textMuted, opacity: reducedMotion ? 1 : 0 }}>
        ${REVENUE_LEAKAGE.annualized.toLocaleString()} annualized
      </p>
      <div className="mt-2 shrink-0 space-y-1.5">
        {REVENUE_LEAKAGE.causes.map((cause) => (
          <div key={cause.label} data-cause data-reveal>
            <div className="mb-0.5 flex justify-between text-[9px]">
              <span style={{ color: platformTheme.textMuted }}>{cause.label}</span>
              <span className="font-semibold tabular-nums" style={{ color: platformTheme.text }}>{formatCurrency(cause.amount)}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full" style={{ background: platformTheme.placeholderBg }}>
              <div
                data-leak-bar
                data-reveal
                className="h-full rounded-full"
                style={{ background: platformTheme.accentGreen, width: reducedMotion ? `${(cause.amount / Math.max(...REVENUE_LEAKAGE.causes.map((item) => item.amount))) * 100}%` : "0%" }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto min-h-0 w-full space-y-1 pt-2">
        <p className="text-[8px] font-medium uppercase tracking-wider" style={{ color: platformTheme.textSubtle }}>
          Top affected units
        </p>
        <div className="space-y-0.5 overflow-hidden">
          {REVENUE_LEAKAGE.affected.map((item) => (
            <div
              key={item.unit}
              data-affected
              data-reveal
              className="flex items-center justify-between gap-2 rounded border px-1.5 py-0.5"
              style={{ borderColor: platformTheme.border }}
            >
              <div className="min-w-0">
                <p className="truncate text-[8px] font-semibold" style={{ color: platformTheme.text }}>
                  {item.unit}
                </p>
                <p className="truncate text-[7px]" style={{ color: platformTheme.textMuted }}>
                  {item.issue}
                </p>
              </div>
              <span className="shrink-0 text-[8px] font-semibold tabular-nums" style={{ color: "#9A4D42" }}>
                {item.amount}
              </span>
            </div>
          ))}
        </div>
        <p
          data-bottom
          data-reveal
          className="text-[8px] font-medium"
          style={{ color: platformTheme.textMuted, opacity: reducedMotion ? 1 : 0 }}
        >
          {REVENUE_LEAKAGE.summary}
        </p>
        <p
          data-bottom
          data-reveal
          className="rounded px-2 py-1 text-center text-[8px] font-semibold"
          style={{ background: platformTheme.accentTint, color: platformTheme.accentGreen, opacity: reducedMotion ? 1 : 0 }}
        >
          {REVENUE_LEAKAGE.footer}
        </p>
      </div>
    </div>
  );
}
