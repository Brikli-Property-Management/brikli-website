"use client";

import { useRef } from "react";
import gsap from "gsap";
import { PLATFORM_EASE, PLATFORM_INTERACTION } from "@/animation/platformTiming";
import { qa, q, sceneRootClass, useSceneAnimation } from "@/components/platform/hooks/useSceneAnimation";
import { platformTheme } from "@/components/platform/platformTheme";
import type { PlatformSceneProps } from "@/components/platform/types";
import { RULE_UPDATES, RULE_VERSIONS, RULES_EVALUATED } from "@/data/rulesDemoData";
import { cn } from "@/lib/utils";

export function RuleVersion({ isActive, reducedMotion }: PlatformSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useSceneAnimation(isActive, reducedMotion, rootRef, (root) => {
    const tl = gsap.timeline();
    const versions = qa(root, "[data-version]");
    const updates = qa(root, "[data-update]");
    const progress = q(root, "[data-progress]");
    const evalLabel = q(root, "[data-eval]");
    const footer = q(root, "[data-footer]");

    gsap.set(versions, { opacity: 0, y: 5 });
    gsap.set(updates, { opacity: 0, x: -6 });
    gsap.set(evalLabel, { opacity: 0, y: 4 });
    gsap.set(footer, { opacity: 0, y: 4 });
    gsap.set(progress, { scaleX: 0, transformOrigin: "left center" });

    versions.forEach((v, i) => {
      tl.to(v, { opacity: 1, y: 0, duration: PLATFORM_INTERACTION.rowReveal, ease: PLATFORM_EASE.out }, 0.08 + i * 0.1);
    });

    updates.forEach((u, i) => {
      tl.to(u, { opacity: 1, x: 0, duration: PLATFORM_INTERACTION.rowReveal, ease: PLATFORM_EASE.out }, 0.45 + i * 0.1);
    });

    tl.to(evalLabel, { opacity: 1, y: 0, duration: 0.25, ease: PLATFORM_EASE.out }, 0.75);
    tl.to(progress, { scaleX: 1, duration: 1.0, ease: PLATFORM_EASE.smooth }, 0.8);
    tl.to(footer, { opacity: 1, y: 0, duration: 0.25, ease: PLATFORM_EASE.out }, "-=0.2");

    return tl;
  });

  return (
    <div
      ref={rootRef}
      data-scene={3}
      className={cn(
        "absolute inset-0 flex flex-col overflow-hidden rounded-lg bg-white p-3",
        sceneRootClass(isActive, reducedMotion),
      )}
      aria-hidden={!isActive && !reducedMotion}
    >
      <div className="shrink-0">
        <p className="text-[8px] font-medium uppercase tracking-wider" style={{ color: platformTheme.textSubtle }}>
          Rulesets
        </p>
        <div className="mt-1 space-y-0.5">
          {RULE_VERSIONS.map((rule) => (
            <div
              key={rule.jurisdiction}
              data-version
              data-reveal
              className="flex items-center justify-between gap-2 rounded border px-2 py-1"
              style={{ borderColor: platformTheme.border }}
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-[9px] font-semibold" style={{ color: platformTheme.text }}>
                  {rule.jurisdiction}
                </p>
                <p className="text-[7px]" style={{ color: platformTheme.textMuted }}>
                  {rule.version}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <span className="text-[7px] tabular-nums" style={{ color: platformTheme.textMuted }}>
                  {rule.tenancies}
                </span>
                <span
                  className="rounded px-1 py-0.5 text-[7px] font-bold uppercase"
                  style={{ background: platformTheme.accentTint, color: platformTheme.accentGreen }}
                >
                  Current
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 min-h-0 flex-1 overflow-hidden">
        <p className="text-[8px] font-medium uppercase tracking-wider" style={{ color: platformTheme.textSubtle }}>
          Recent updates
        </p>
        <div className="mt-0.5 space-y-0.5">
          {RULE_UPDATES.map((update) => (
            <div
              key={`${update.jurisdiction}-${update.change}`}
              data-update
              data-reveal
              className="rounded border px-1.5 py-1"
              style={{ borderColor: platformTheme.border, background: platformTheme.placeholderBg }}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-[8px] font-semibold" style={{ color: platformTheme.text }}>
                  {update.jurisdiction}
                </p>
                <span className="shrink-0 text-[7px]" style={{ color: platformTheme.textSubtle }}>
                  {update.date}
                </span>
              </div>
              <p className="text-[7px] leading-snug" style={{ color: platformTheme.textMuted }}>
                {update.change}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 shrink-0 border-t pt-2" style={{ borderColor: platformTheme.border }}>
        <p
          data-eval
          data-reveal
          className="text-[9px] font-medium"
          style={{ color: platformTheme.text, opacity: reducedMotion ? 1 : 0 }}
        >
          {RULES_EVALUATED} active tenancies evaluated
        </p>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full" style={{ background: platformTheme.placeholderBg }}>
          <div
            data-progress
            data-reveal
            className="h-full w-full rounded-full"
            style={{ background: platformTheme.accentGreen, transformOrigin: "left center" }}
          />
        </div>
        <p
          data-footer
          data-reveal
          className="mt-1 text-center text-[8px] font-medium"
          style={{ color: platformTheme.accentGreen, opacity: reducedMotion ? 1 : 0 }}
        >
          All rulesets current · Last synced 2h ago
        </p>
      </div>
    </div>
  );
}
