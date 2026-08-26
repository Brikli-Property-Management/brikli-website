"use client";

import { useRef } from "react";
import gsap from "gsap";
import { PLATFORM_EASE, PLATFORM_INTERACTION } from "@/animation/platformTiming";
import { qa, q, sceneRootClass, useSceneAnimation } from "@/components/platform/hooks/useSceneAnimation";
import { platformTheme } from "@/components/platform/platformTheme";
import type { PlatformSceneProps } from "@/components/platform/types";
import { EXTRACTION_FIELDS } from "@/data/recordsDemoData";
import { cn } from "@/lib/utils";

export function ExtractionGrounding({ isActive, reducedMotion }: PlatformSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useSceneAnimation(isActive, reducedMotion, rootRef, (root) => {
    const tl = gsap.timeline();
    const boxes = qa(root, "[data-box]");
    const fields = qa(root, "[data-field]");

    gsap.set(boxes, { opacity: 0, scaleX: 0, transformOrigin: "left center" });
    gsap.set(fields, { opacity: 0, x: 10 });

    boxes.forEach((box, i) => {
      tl.to(box, { opacity: 1, scaleX: 1, duration: 0.32, ease: PLATFORM_EASE.out }, i * 0.32);
      if (fields[i]) {
        tl.to(fields[i], { opacity: 1, x: 0, duration: PLATFORM_INTERACTION.rowReveal, ease: PLATFORM_EASE.out }, i * 0.32 + 0.1);
      }
    });

    tl.to(q(root, "[data-source-note]"), { opacity: 1, y: 0, duration: 0.24, ease: PLATFORM_EASE.out }, "-=0.15");
    return tl;
  });

  return (
    <div
      ref={rootRef}
      data-scene={2}
      className={cn("absolute inset-0 flex gap-2 rounded-lg bg-white p-3", sceneRootClass(isActive, reducedMotion))}
      aria-hidden={!isActive && !reducedMotion}
    >
      <div className="flex-1 rounded border p-2 text-[9px]" style={{ borderColor: platformTheme.border, background: platformTheme.placeholderBg }}>
        <p className="mb-2 font-medium" style={{ color: platformTheme.textSubtle }}>Lease preview</p>
        {EXTRACTION_FIELDS.map((field) => (
          <div key={field.id} className="relative mb-2 last:mb-0">
            <div
              data-box
              data-reveal
              className="absolute -inset-x-0.5 -inset-y-0.5 rounded border"
              style={{ borderColor: platformTheme.accentGreen, background: "rgba(29,59,35,0.04)" }}
            />
            <p style={{ color: platformTheme.textSubtle }}>{field.label}</p>
            <p className="font-medium" style={{ color: platformTheme.text }}>{field.value}</p>
          </div>
        ))}
      </div>
      <div className="flex w-[42%] flex-col justify-center gap-1.5">
        {EXTRACTION_FIELDS.map((field) => (
          <div key={field.id} data-field data-reveal className="rounded border px-2 py-1" style={{ borderColor: platformTheme.border }}>
            <p className="text-[8px] uppercase tracking-wide" style={{ color: platformTheme.textSubtle }}>{field.label}</p>
            <p className="text-[10px] font-semibold" style={{ color: platformTheme.text }}>{field.value}</p>
            <p className="text-[8px]" style={{ color: platformTheme.accentGreen }}>{field.source}</p>
          </div>
        ))}
        <p
          data-source-note
          data-reveal
          className="text-[9px] font-medium"
          style={{ color: platformTheme.accentGreen, opacity: reducedMotion ? 1 : 0, transform: "translateY(4px)" }}
        >
          Every fact has a source
        </p>
      </div>
    </div>
  );
}
