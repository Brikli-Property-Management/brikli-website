"use client";

import { useRef } from "react";
import gsap from "gsap";
import { PLATFORM_EASE } from "@/animation/platformTiming";
import { qa, sceneRootClass, useSceneAnimation } from "@/components/platform/hooks/useSceneAnimation";
import { platformTheme } from "@/components/platform/platformTheme";
import type { PlatformSceneProps } from "@/components/platform/types";
import { WORKFLOW_COLUMNS, WORKFLOW_ROWS } from "@/data/executionDemoData";
import { cn } from "@/lib/utils";

const LEG_DURATION = 0.34;

function getRowSlots(root: HTMLElement, rowIndex: number): HTMLElement[] {
  return WORKFLOW_COLUMNS.map((col) =>
    root.querySelector<HTMLElement>(`[data-drop-slot][data-row="${rowIndex}"][data-col="${col}"]`),
  ).filter((el): el is HTMLElement => el !== null);
}

export function WorkflowMovement({ isActive, reducedMotion }: PlatformSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useSceneAnimation(isActive, reducedMotion, rootRef, (root) => {
    const tl = gsap.timeline();
    const movingCards = qa(root, "[data-workflow-card]");
    const cols = qa(root, "[data-col]");

    if (movingCards.length === 0 || cols.length === 0) return tl;

    gsap.set(cols, { opacity: 0, y: 5 });
    gsap.set(movingCards, { opacity: 0, scale: 0.98 });

    tl.to(cols, { opacity: 1, y: 0, duration: 0.24, stagger: 0.07, ease: PLATFORM_EASE.out });

    const rootRect = root.getBoundingClientRect();
    const journeyDuration = LEG_DURATION * (WORKFLOW_COLUMNS.length - 1) + 0.22;

    movingCards.forEach((card, rowIndex) => {
      const rowSlots = getRowSlots(root, rowIndex);
      if (rowSlots.length === 0) return;

      const slotMetrics = rowSlots.map((slot) => {
        const rect = slot.getBoundingClientRect();
        return {
          x: rect.left - rootRect.left,
          y: rect.top - rootRect.top,
          width: rect.width,
          height: rect.height,
        };
      });

      const subtitle = card.querySelector<HTMLElement>("[data-subtitle]");
      const stages = WORKFLOW_ROWS[rowIndex]?.stages ?? [];
      const start = 0.18 + rowIndex * journeyDuration;
      const first = slotMetrics[0];

      gsap.set(card, {
        x: first.x - 8,
        y: first.y,
        width: first.width,
        height: first.height,
        opacity: 0,
      });

      tl.to(card, { x: first.x, opacity: 1, scale: 1, duration: 0.2, ease: PLATFORM_EASE.out }, start);
      if (subtitle && stages[0]) {
        tl.call(() => {
          subtitle.textContent = stages[0];
        }, undefined, start);
      }

      for (let col = 1; col < slotMetrics.length; col++) {
        const moveAt = start + col * LEG_DURATION;
        const target = slotMetrics[col];

        tl.to(
          card,
          {
            x: target.x,
            y: target.y,
            width: target.width,
            height: target.height,
            duration: LEG_DURATION,
            ease: PLATFORM_EASE.smooth,
          },
          moveAt,
        );
        if (subtitle && stages[col]) {
          tl.call(() => {
            subtitle.textContent = stages[col];
          }, undefined, moveAt);
        }
      }
    });

    return tl;
  });

  return (
    <div
      ref={rootRef}
      data-scene={2}
      className={cn("absolute inset-0 overflow-hidden rounded-lg bg-[#F4F1E8] p-3", sceneRootClass(isActive, reducedMotion))}
      aria-hidden={!isActive && !reducedMotion}
    >
      <div className="grid h-full grid-cols-3 gap-2 overflow-hidden">
        {WORKFLOW_COLUMNS.map((col) => (
          <div
            key={col}
            data-col
            data-reveal
            className="flex min-w-0 flex-col overflow-hidden rounded border p-1.5"
            style={{ borderColor: platformTheme.border, background: platformTheme.placeholderBg }}
          >
            <p className="mb-1.5 shrink-0 px-0.5 text-[8px] font-bold uppercase tracking-wider" style={{ color: platformTheme.textSubtle }}>
              {col}
            </p>
            <div data-col-body className="flex min-h-0 flex-1 flex-col gap-1 overflow-hidden">
              {WORKFLOW_ROWS.map((row, rowIndex) => (
                <div key={row.id} className="relative h-[30px] shrink-0">
                  <div
                    data-drop-slot
                    data-row={rowIndex}
                    data-col={col}
                    className="absolute inset-0 overflow-hidden rounded-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {!reducedMotion &&
        WORKFLOW_ROWS.map((row, rowIndex) => (
          <div
            key={row.id}
            data-workflow-card
            data-row={rowIndex}
            className="absolute left-0 top-0 box-border rounded border bg-white px-2 py-1"
            style={{
              borderColor: platformTheme.border,
              boxShadow: "0 1px 3px rgba(15,41,30,0.04)",
            }}
          >
            <p className="truncate text-[8px] font-semibold leading-tight" style={{ color: platformTheme.text }}>
              {row.title}
            </p>
            <p data-subtitle className="truncate text-[7px] leading-tight" style={{ color: platformTheme.textMuted }}>
              {row.stages[0]}
            </p>
          </div>
        ))}
    </div>
  );
}
