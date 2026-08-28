"use client";

import { useRef } from "react";
import gsap from "gsap";
import { PLATFORM_EASE, PLATFORM_INTERACTION } from "@/animation/platformTiming";
import { qa, q, sceneRootClass, useSceneAnimation } from "@/components/platform/hooks/useSceneAnimation";
import { platformTheme } from "@/components/platform/platformTheme";
import type { PlatformSceneProps } from "@/components/platform/types";
import { INGESTION_DOCUMENTS, INGESTION_MATCHES, INGESTION_PIPELINE } from "@/data/recordsDemoData";
import { cn } from "@/lib/utils";

const ORIGIN_OFFSET: Record<string, { x: number; y: number }> = {
  left: { x: -36, y: 4 },
  right: { x: 36, y: 4 },
  top: { x: 0, y: -28 },
  bottom: { x: 0, y: 28 },
};

export function RecordIngestion({ isActive, reducedMotion }: PlatformSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useSceneAnimation(isActive, reducedMotion, rootRef, (root) => {
    const tl = gsap.timeline();
    const docs = qa(root, "[data-doc]");
    const matches = qa(root, "[data-match]");
    const steps = qa(root, "[data-step]");
    const connectors = qa(root, "[data-connector]");

    gsap.set(docs, { opacity: 0, scale: 0.94 });
    gsap.set(matches, { opacity: 0, x: -6 });
    gsap.set(steps, { opacity: 0.22, color: platformTheme.textSubtle });
    gsap.set(connectors, { scaleY: 0, transformOrigin: "top center" });
    gsap.set(q(root, "[data-status]"), { opacity: 0, y: 5 });

    docs.forEach((doc, i) => {
      const origin = doc.dataset.origin ?? "left";
      const offset = ORIGIN_OFFSET[origin] ?? ORIGIN_OFFSET.left;
      gsap.set(doc, { x: offset.x, y: offset.y });
      tl.to(
        doc,
        { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.32, ease: PLATFORM_EASE.out },
        i * 0.14,
      );
    });

    tl.to({}, { duration: 0.2 });

    steps.forEach((step, i) => {
      tl.to(steps, { opacity: 0.2, duration: 0.06 }, `pipe-${i}`);
      tl.to(step, { opacity: 1, duration: 0.12, ease: PLATFORM_EASE.out }, `pipe-${i}`);
      if (i < connectors.length) {
        tl.to(connectors[i], { scaleY: 1, duration: 0.18, ease: PLATFORM_EASE.out }, `pipe-${i}+=0.08`);
      }
      if (i === 2) {
        matches.forEach((match, j) => {
          tl.to(
            match,
            { opacity: 1, x: 0, duration: PLATFORM_INTERACTION.rowReveal, ease: PLATFORM_EASE.out },
            `pipe-${i}+=${0.1 + j * 0.07}`,
          );
        });
      }
      if (i < steps.length - 1) {
        tl.to({}, { duration: 0.22 }, `pipe-${i}+=0.1`);
      }
    });

    tl.to(q(root, "[data-status]"), { opacity: 1, y: 0, duration: 0.26, ease: PLATFORM_EASE.out }, "-=0.12");

    return tl;
  });

  return (
    <div
      ref={rootRef}
      data-scene={0}
      className={cn("absolute inset-0 flex flex-col rounded-lg bg-[#F4F1E8] p-3", sceneRootClass(isActive, reducedMotion))}
      aria-hidden={!isActive && !reducedMotion}
    >
      <p className="mb-1.5 shrink-0 text-[10px] font-medium uppercase tracking-wider" style={{ color: platformTheme.textSubtle }}>
        Document upload
      </p>
      <div
        className="mb-2 flex min-h-0 flex-1 flex-col border border-dashed p-2"
        style={{ borderColor: platformTheme.border, background: "#F4F1E8" }}
      >
        <div className="grid grid-cols-3 gap-1">
          {INGESTION_DOCUMENTS.map((doc) => (
            <div
              key={doc.id}
              data-doc
              data-origin={doc.origin}
              data-reveal
              className="rounded border bg-white px-1.5 py-1 shadow-sm"
              style={{ borderColor: platformTheme.border }}
            >
              <p className="truncate text-[8px] font-medium" style={{ color: platformTheme.text }}>
                {doc.filename}
              </p>
              <p className="text-[7px]" style={{ color: platformTheme.textMuted }}>
                {doc.type}
              </p>
            </div>
          ))}
        </div>
        <div className="relative -top-5 mt-2 grid min-h-0 flex-1 grid-rows-[auto_repeat(5,minmax(26px,1fr))] gap-1 overflow-hidden">
          <p className="relative top-5 text-[7px] font-medium uppercase tracking-wider" style={{ color: platformTheme.textSubtle }}>
            Property matches
          </p>
          {INGESTION_MATCHES.map((match) => (
            <div
              key={match.doc}
              data-match
              data-reveal
              className="flex min-h-0 items-center justify-between gap-1 border bg-white px-1.5 py-0.5"
              style={{ borderColor: platformTheme.border }}
            >
              <div className="min-w-0">
                <p className="truncate text-[7px] font-semibold" style={{ color: platformTheme.text }}>
                  {match.property}
                </p>
                <p className="truncate text-[7px]" style={{ color: platformTheme.textMuted }}>
                  {match.doc}
                </p>
              </div>
              <span className="shrink-0 text-[7px] font-medium" style={{ color: platformTheme.accentGreen }}>
                {match.tenant}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex shrink-0 items-start justify-between gap-0.5 px-1">
        {INGESTION_PIPELINE.map((step, i) => (
          <div key={step} className="flex flex-1 flex-col items-center">
            <span
              data-step={step}
              data-reveal
              className="text-[8px] font-semibold tracking-wide"
              style={{ color: platformTheme.textMuted }}
            >
              {step}
            </span>
            {i < INGESTION_PIPELINE.length - 1 && (
              <div
                data-connector
                data-reveal
                className="my-0.5 h-2 w-px"
                style={{ background: platformTheme.border }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex shrink-0 items-center justify-center gap-1.5">
        <p
          data-status
          data-reveal
          className="text-[10px] font-medium"
          style={{ color: platformTheme.accentGreen, opacity: reducedMotion ? 1 : 0 }}
        >
          5 documents verified
        </p>
      </div>
    </div>
  );
}
