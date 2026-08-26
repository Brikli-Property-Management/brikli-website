"use client";

import { useRef } from "react";
import gsap from "gsap";
import { PLATFORM_EASE, PLATFORM_INTERACTION } from "@/animation/platformTiming";
import { qa, q, sceneRootClass, useSceneAnimation } from "@/components/platform/hooks/useSceneAnimation";
import { platformTheme } from "@/components/platform/platformTheme";
import type { PlatformSceneProps } from "@/components/platform/types";
import { NOTICE_DRAFTS, NOTICE_TOTAL } from "@/data/executionDemoData";
import { cn } from "@/lib/utils";

export function NoticeGeneration({ isActive, reducedMotion }: PlatformSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useSceneAnimation(isActive, reducedMotion, rootRef, (root) => {
    const tl = gsap.timeline();
    const cards = qa(root, "[data-draft]");
    const counter = q(root, "[data-counter]");

    gsap.set(cards, { opacity: 0, y: 8, scale: 0.96 });
    gsap.set(q(root, "[data-header]"), { opacity: 0 });
    gsap.set(q(root, "[data-done]"), { opacity: 0, y: 4 });

    tl.to(q(root, "[data-header]"), { opacity: 1, duration: 0.25 });
    cards.forEach((card, i) => {
      tl.to(card, { opacity: 1, y: 0, scale: 1, duration: PLATFORM_INTERACTION.rowReveal, ease: PLATFORM_EASE.out }, 0.25 + i * 0.1);
    });

    if (counter) {
      const proxy = { value: 0 };
      tl.to(proxy, {
        value: NOTICE_TOTAL,
        duration: 0.7,
        ease: PLATFORM_EASE.out,
        onUpdate: () => {
          counter.textContent = String(Math.round(proxy.value));
        },
      }, 0.9);
    }

    tl.to(q(root, "[data-done]"), { opacity: 1, y: 0, duration: 0.28, ease: PLATFORM_EASE.out }, "-=0.15");
    return tl;
  });

  return (
    <div
      ref={rootRef}
      data-scene={0}
      className={cn("absolute inset-0 flex flex-col rounded-lg bg-white p-3", sceneRootClass(isActive, reducedMotion))}
      aria-hidden={!isActive && !reducedMotion}
    >
      <p data-header data-reveal className="text-[10px] font-medium" style={{ color: platformTheme.textMuted }}>
        Preparing rent-increase notices
      </p>
      <div className="mt-2 grid flex-1 grid-cols-3 gap-1.5 content-start">
        {NOTICE_DRAFTS.map((draft) => (
          <div
            key={draft.unit}
            data-draft
            data-reveal
            className="rounded border px-1.5 py-1"
            style={{ borderColor: platformTheme.border }}
          >
            <p className="text-[8px] font-semibold" style={{ color: platformTheme.text }}>{draft.unit}</p>
            <div className="flex items-center gap-1">
              <span className="text-[7px] font-medium" style={{ color: platformTheme.textMuted }}>{draft.form}</span>
              <span className="text-[7px] font-bold uppercase" style={{ color: platformTheme.accentGreen }}>{draft.status}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-auto flex items-end justify-between">
        <div>
          <span data-counter data-reveal className="text-2xl font-semibold tabular-nums" style={{ color: platformTheme.text }}>
            {reducedMotion ? NOTICE_TOTAL : 0}
          </span>
          <span className="text-[10px]" style={{ color: platformTheme.textMuted }}> / {NOTICE_TOTAL}</span>
        </div>
        <p data-done data-reveal className="text-[10px] font-semibold" style={{ color: platformTheme.accentGreen, opacity: reducedMotion ? 1 : 0 }}>
          {NOTICE_TOTAL} drafts prepared
        </p>
      </div>
    </div>
  );
}
