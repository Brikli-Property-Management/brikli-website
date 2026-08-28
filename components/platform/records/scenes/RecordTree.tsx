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
      const check = q(block, "[data-check]");

      gsap.set(block, { opacity: 0, y: 8 });
      gsap.set(levels, { opacity: 0, x: -6 });
      gsap.set(check, { opacity: 0, scale: 0.4 });

      const start = bi * 0.85;

      tl.to(block, { opacity: 1, y: 0, duration: 0.28, ease: PLATFORM_EASE.out }, start);

      levels.forEach((level, li) => {
        tl.to(level, { opacity: 1, x: 0, duration: PLATFORM_INTERACTION.rowReveal, ease: PLATFORM_EASE.out }, start + 0.15 + li * 0.14);
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
      className={cn("absolute inset-0 flex flex-col overflow-hidden rounded-lg bg-[#F4F1E8] p-3", sceneRootClass(isActive, reducedMotion))}
      aria-hidden={!isActive && !reducedMotion}
    >
      <p className="mb-2 text-[10px] font-medium uppercase tracking-wider" style={{ color: platformTheme.textSubtle }}>
        Property hierarchy
      </p>
      <div className="record-tree-list text-[10px]" style={{ color: platformTheme.text }}>
        {PROPERTY_TREE.map((item) => (
          <div
            key={item.property}
            data-tree-block
            data-reveal
            className="record-tree-block"
            style={{ borderColor: platformTheme.border, background: platformTheme.accentTint }}
          >
            <div className="record-tree-property font-medium">
              <span data-tree-level data-reveal>{item.property}</span>
              <span data-check data-reveal className="text-[9px]" style={{ color: platformTheme.accentGreen }}>✓</span>
            </div>
            <div className="record-tree-details">
              <div data-tree-level data-reveal className="record-tree-row">
                <span style={{ color: platformTheme.textSubtle }}>Unit</span>
                <strong style={{ color: platformTheme.textMuted }}>{item.unit.replace(/^Unit\s*/, "")}</strong>
              </div>
              <div data-tree-level data-reveal className="record-tree-row">
                <span style={{ color: platformTheme.textSubtle }}>Tenant</span>
                <strong style={{ color: platformTheme.textMuted }}>{item.tenant}</strong>
              </div>
              <div className="record-tree-documents">
                <span style={{ color: platformTheme.textSubtle }}>Documents</span>
                <div>
                  {item.documents.map((doc) => (
                    <div
                      key={doc}
                      className="record-tree-document"
                      style={{ color: platformTheme.textMuted }}
                    >
                      <span style={{ color: platformTheme.accentGreen }}>—</span>
                      <span className="truncate">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p
        data-matched
        data-reveal
        className="mt-2 shrink-0 text-[10px] font-medium"
        style={{ color: platformTheme.accentGreen, opacity: reducedMotion ? 1 : 0, transform: "translateY(4px)" }}
      >
        Documents matched to tenancy
      </p>
    </div>
  );
}
