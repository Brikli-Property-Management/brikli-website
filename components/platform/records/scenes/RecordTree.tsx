"use client";

import { useRef } from "react";
import gsap from "gsap";
import { PLATFORM_EASE, PLATFORM_INTERACTION } from "@/animation/platformTiming";
import { qa, q, sceneRootClass, useSceneAnimation } from "@/components/platform/hooks/useSceneAnimation";
import { platformTheme } from "@/components/platform/platformTheme";
import type { PlatformSceneProps } from "@/components/platform/types";
import { PROPERTY_TREE } from "@/data/recordsDemoData";
import { cn } from "@/lib/utils";

export function RecordTree({ isActive, reducedMotion }: PlatformSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useSceneAnimation(isActive, reducedMotion, rootRef, (root) => {
    const tl = gsap.timeline();
    const blocks = qa(root, "[data-tree-block]");

    blocks.forEach((block, bi) => {
      const levels = qa(block, "[data-tree-level]");
      const docs = qa(block, "[data-tree-doc]");
      const check = q(block, "[data-check]");

      gsap.set(block, { opacity: 0, y: 8 });
      gsap.set(levels, { opacity: 0, x: -6 });
      gsap.set(docs, { opacity: 0, x: -10 });
      gsap.set(check, { opacity: 0, scale: 0.4 });

      const start = bi * 0.85;

      tl.to(block, { opacity: 1, y: 0, duration: 0.28, ease: PLATFORM_EASE.out }, start);

      levels.forEach((level, li) => {
        tl.to(level, { opacity: 1, x: 0, duration: PLATFORM_INTERACTION.rowReveal, ease: PLATFORM_EASE.out }, start + 0.15 + li * 0.14);
      });

      docs.forEach((doc, di) => {
        tl.to(doc, { opacity: 1, x: 0, duration: 0.24, ease: PLATFORM_EASE.out }, start + 0.35 + di * 0.12);
      });

      if (check) {
        tl.to(check, { opacity: 1, scale: 1, duration: 0.22, ease: "back.out(1.6)" }, start + 0.55);
      }
    });

    tl.to(q(root, "[data-matched]"), { opacity: 1, y: 0, duration: 0.25, ease: PLATFORM_EASE.out }, "-=0.15");
    return tl;
  });

  return (
    <div
      ref={rootRef}
      data-scene={1}
      className={cn("absolute inset-0 overflow-hidden rounded-lg bg-white p-3", sceneRootClass(isActive, reducedMotion))}
      aria-hidden={!isActive && !reducedMotion}
    >
      <p className="mb-2 text-[10px] font-medium uppercase tracking-wider" style={{ color: platformTheme.textSubtle }}>
        Property hierarchy
      </p>
      <div className="space-y-2 text-[10px]" style={{ color: platformTheme.text }}>
        {PROPERTY_TREE.map((item) => (
          <div
            key={item.property}
            data-tree-block
            data-reveal
            className="rounded border px-2 py-1.5"
            style={{ borderColor: platformTheme.border }}
          >
            <div className="flex items-center justify-between font-medium">
              <span data-tree-level data-reveal>{item.property}</span>
              <span data-check data-reveal className="text-[9px]" style={{ color: platformTheme.accentGreen }}>✓</span>
            </div>
            <div data-tree-level data-reveal className="ml-3 mt-0.5" style={{ color: platformTheme.textMuted }}>
              └ {item.unit}
            </div>
            <div data-tree-level data-reveal className="ml-6 mt-0.5" style={{ color: platformTheme.textMuted }}>
              └ {item.tenant}
            </div>
            {item.documents.map((doc) => (
              <div
                key={doc}
                data-tree-doc
                data-reveal
                className="ml-9 mt-0.5 flex items-center gap-1"
                style={{ color: platformTheme.textMuted }}
              >
                <span style={{ color: platformTheme.accentGreen }}>├</span>
                <span>{doc}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <p
        data-matched
        data-reveal
        className="mt-2 text-[10px] font-medium"
        style={{ color: platformTheme.accentGreen, opacity: reducedMotion ? 1 : 0, transform: "translateY(4px)" }}
      >
        Documents matched to tenancy
      </p>
    </div>
  );
}
