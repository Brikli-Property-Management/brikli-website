"use client";

import { useRef } from "react";
import gsap from "gsap";
import { PLATFORM_EASE, PLATFORM_INTERACTION } from "@/animation/platformTiming";
import { qa, q, sceneRootClass, useSceneAnimation } from "@/components/platform/hooks/useSceneAnimation";
import { platformTheme } from "@/components/platform/platformTheme";
import type { PlatformSceneProps } from "@/components/platform/types";
import { RENT_EVIDENCE, VERIFIED_RENT } from "@/data/intelligenceDemoData";
import { cn } from "@/lib/utils";

export function RentReconciliation({ isActive, reducedMotion }: PlatformSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useSceneAnimation(isActive, reducedMotion, rootRef, (root) => {
    const tl = gsap.timeline();
    const cards = qa(root, "[data-evidence]");
    const formula = qa(root, "[data-formula-part]");
    const verified = q(root, "[data-verified]");

    gsap.set(cards, { opacity: 0, y: 8 });
    gsap.set(formula, { opacity: 0, y: 4 });
    gsap.set(verified, { opacity: 0, scale: 0.97 });

    cards.forEach((card, i) => {
      tl.to(card, { opacity: 1, y: 0, duration: PLATFORM_INTERACTION.rowReveal, ease: PLATFORM_EASE.out }, i * 0.22);
    });

    tl.to({}, { duration: 0.25 });
    formula.forEach((part, i) => {
      tl.to(part, { opacity: 1, y: 0, duration: 0.2, ease: PLATFORM_EASE.out }, `formula+=${i * 0.12}`);
    });

    tl.to(verified, { opacity: 1, scale: 1, duration: 0.35, ease: PLATFORM_EASE.out }, "-=0.05");
    return tl;
  });

  return (
    <div
      ref={rootRef}
      data-scene={0}
      className={cn("absolute inset-0 flex flex-col rounded-lg bg-white p-3", sceneRootClass(isActive, reducedMotion))}
      aria-hidden={!isActive && !reducedMotion}
    >
      <div className="grid grid-cols-2 gap-1.5">
        {RENT_EVIDENCE.map((ev) => (
          <div
            key={ev.id}
            data-evidence
            data-reveal
            className={cn(
              "rounded border px-2 py-1.5",
              ev.stale && "opacity-80",
            )}
            style={{
              borderColor: ev.stale ? "#E8D0CA" : platformTheme.border,
              background: ev.stale ? "#F5EBE8" : "white",
            }}
          >
            <p className="text-[8px] font-semibold tracking-wider" style={{ color: platformTheme.textSubtle }}>{ev.label}</p>
            <p className="text-[10px] font-medium" style={{ color: platformTheme.text }}>{ev.value}</p>
            {ev.stale && (
              <span className="text-[8px] font-semibold uppercase" style={{ color: "#9A4D42" }}>Stale</span>
            )}
          </div>
        ))}
      </div>
      <div className="my-2 flex items-center justify-center gap-1.5">
        {VERIFIED_RENT.formula.map((part, i) => (
          <span
            key={i}
            data-formula-part
            data-reveal
            className="text-[9px] font-medium"
            style={{ color: part === "→" || part === "+" ? platformTheme.textSubtle : platformTheme.text }}
          >
            {part}
          </span>
        ))}
      </div>
      <div
        data-verified
        data-reveal
        className="mt-auto rounded border px-3 py-2 text-center"
        style={{ borderColor: platformTheme.accentGreen, background: platformTheme.accentTint, opacity: reducedMotion ? 1 : 0 }}
      >
        <p className="text-[8px] font-semibold uppercase tracking-wider" style={{ color: platformTheme.accentGreen }}>{VERIFIED_RENT.label}</p>
        <p className="text-sm font-semibold" style={{ color: platformTheme.text }}>{VERIFIED_RENT.value}</p>
      </div>
    </div>
  );
}
