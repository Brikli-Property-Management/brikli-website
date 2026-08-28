"use client";

import { useRef } from "react";
import gsap from "gsap";
import { PLATFORM_EASE, PLATFORM_INTERACTION } from "@/animation/platformTiming";
import { qa, q, sceneRootClass, useSceneAnimation } from "@/components/platform/hooks/useSceneAnimation";
import { platformTheme } from "@/components/platform/platformTheme";
import type { PlatformSceneProps } from "@/components/platform/types";
import { EVIDENCE_RESOLUTION } from "@/data/intelligenceDemoData";
import { cn } from "@/lib/utils";

export function EvidenceResolution({ isActive, reducedMotion }: PlatformSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useSceneAnimation(isActive, reducedMotion, rootRef, (root) => {
    const tl = gsap.timeline();
    const sources = qa(root, "[data-source]");
    const lines = qa(root, "[data-line]");
    const fact = q(root, "[data-fact]");
    const bottom = qa(root, "[data-bottom]");

    gsap.set(sources, { opacity: 0, y: 7 });
    gsap.set(lines, { strokeDashoffset: 24, opacity: 0 });
    gsap.set(fact, { opacity: 0, scale: 0.96 });
    gsap.set(qa(root, "[data-citation]"), { opacity: 0, y: 4 });
    gsap.set(bottom, { opacity: 0, y: 6 });

    sources.forEach((src, i) => {
      tl.to(src, { opacity: 1, y: 0, duration: PLATFORM_INTERACTION.rowReveal, ease: PLATFORM_EASE.out }, i * 0.14);
    });

    lines.forEach((line, i) => {
      tl.to(line, { strokeDashoffset: 0, opacity: 1, duration: 0.35, ease: PLATFORM_EASE.out }, 0.55 + i * 0.06);
    });

    tl.to(fact, { opacity: 1, scale: 1, duration: 0.34, ease: PLATFORM_EASE.out }, "-=0.08");
    tl.to(qa(root, "[data-citation]"), { opacity: 1, y: 0, duration: 0.22, stagger: 0.08 }, "-=0.12");
    bottom.forEach((el, i) => {
      tl.to(el, { opacity: 1, y: 0, duration: PLATFORM_INTERACTION.rowReveal, ease: PLATFORM_EASE.out }, 0.95 + i * 0.08);
    });
    return tl;
  });

  return (
    <div
      ref={rootRef}
      data-scene={3}
      className={cn("absolute inset-0 flex flex-col rounded-lg bg-[#F4F1E8] p-3", sceneRootClass(isActive, reducedMotion))}
      aria-hidden={!isActive && !reducedMotion}
    >
      <div className="grid w-full grid-cols-4 gap-1">
        {EVIDENCE_RESOLUTION.sources.map((src) => (
          <div
            key={src}
            data-source
            data-reveal
            className="rounded border px-1 py-1 text-center text-[8px] font-semibold tracking-wide"
            style={{ borderColor: platformTheme.border, color: platformTheme.textMuted }}
          >
            {src}
          </div>
        ))}
      </div>
      <svg className="my-1 h-8 w-full shrink-0" viewBox="0 0 200 32" fill="none" aria-hidden>
        {[25, 75, 125, 175].map((x, i) => (
          <line
            key={i}
            data-line
            data-reveal
            x1={x}
            y1="0"
            x2="100"
            y2="28"
            stroke={platformTheme.accentGreen}
            strokeWidth="1"
            strokeDasharray="24"
            strokeDashoffset="24"
            opacity="0"
          />
        ))}
      </svg>
      <p className="text-center text-[8px] font-semibold uppercase tracking-wider" style={{ color: platformTheme.textSubtle }}>
        Supported operating fact
      </p>
      <div
        data-fact
        data-reveal
        className="mt-1 rounded border px-4 py-2 text-center"
        style={{ borderColor: platformTheme.accentGreen, background: platformTheme.accentTint, opacity: reducedMotion ? 1 : 0 }}
      >
        <p className="text-sm font-semibold" style={{ color: platformTheme.text }}>{EVIDENCE_RESOLUTION.fact}</p>
        <p className="text-[9px]" style={{ color: platformTheme.textMuted }}>{EVIDENCE_RESOLUTION.effective}</p>
      </div>
      <div className="mt-1.5 flex justify-center gap-2">
        {EVIDENCE_RESOLUTION.citations.map((c) => (
          <span key={c} data-citation data-reveal className="text-[8px]" style={{ color: platformTheme.accentGreen, opacity: reducedMotion ? 1 : 0 }}>
            {c}
          </span>
        ))}
      </div>

      <div className="mt-auto w-full space-y-1.5 pt-2">
        <div
          data-bottom
          data-reveal
          className="flex items-center justify-between rounded border px-2 py-1"
          style={{ borderColor: platformTheme.border }}
        >
          <span className="text-[8px] font-semibold" style={{ color: platformTheme.text }}>
            {EVIDENCE_RESOLUTION.context.property}
          </span>
          <span className="text-[8px]" style={{ color: platformTheme.textMuted }}>
            {EVIDENCE_RESOLUTION.context.tenant}
          </span>
        </div>
        <div data-bottom data-reveal className="grid grid-cols-2 gap-1">
          {EVIDENCE_RESOLUTION.breakdown.map((item) => (
            <div
              key={item.label}
              className="rounded px-2 py-1"
              style={{ background: platformTheme.placeholderBg }}
            >
              <p className="text-[7px]" style={{ color: platformTheme.textMuted }}>{item.label}</p>
              <p className="text-[9px] font-semibold" style={{ color: platformTheme.text }}>{item.value}</p>
            </div>
          ))}
        </div>
        <p
          data-bottom
          data-reveal
          className="rounded px-2 py-1.5 text-center text-[8px] font-semibold"
          style={{ background: platformTheme.accentTint, color: platformTheme.accentGreen, opacity: reducedMotion ? 1 : 0 }}
        >
          {EVIDENCE_RESOLUTION.footer}
        </p>
      </div>
    </div>
  );
}
