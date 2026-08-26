"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { PLATFORM_EASE, PLATFORM_INTERACTION } from "@/animation/platformTiming";
import { qa, q, sceneRootClass, useSceneAnimation } from "@/components/platform/hooks/useSceneAnimation";
import { platformTheme } from "@/components/platform/platformTheme";
import type { PlatformSceneProps } from "@/components/platform/types";
import { FakeCursor } from "@/components/demo/FakeCursor";
import { APPROVAL_QUEUE } from "@/data/executionDemoData";
import { cn } from "@/lib/utils";

export function ApprovalQueue({ isActive, reducedMotion }: PlatformSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [pressed, setPressed] = useState(false);
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setPressed(false);
      setApproved(false);
    }
  }, [isActive]);

  useSceneAnimation(isActive, reducedMotion, rootRef, (root) => {
    const tl = gsap.timeline();
    const rows = qa(root, "[data-approval-row]");
    const cursor = cursorRef.current;
    const approveBtn = q(root, "[data-approve-btn]");
    const approvedSection = q(root, "[data-approved-section]");

    setApproved(false);
    setPressed(false);

    gsap.set(rows, { opacity: 0, y: 7 });
    gsap.set(cursor, { opacity: 0, x: 12, y: 12 });
    gsap.set(approvedSection, { opacity: 0, height: 0, overflow: "hidden" });

    rows.forEach((row, i) => {
      tl.to(row, { opacity: 1, y: 0, duration: PLATFORM_INTERACTION.rowReveal, ease: PLATFORM_EASE.out }, i * 0.12);
    });

    tl.to(rows[0], { backgroundColor: "rgba(29, 59, 35, 0.07)", duration: 0.22 }, 0.65);
    tl.to(cursor, { opacity: 1, duration: 0.18 }, 0.78);

    if (cursor && approveBtn) {
      const rootRect = root.getBoundingClientRect();
      const btnRect = approveBtn.getBoundingClientRect();
      tl.to(cursor, {
        x: btnRect.left - rootRect.left + 6,
        y: btnRect.top - rootRect.top + 4,
        duration: 0.5,
        ease: PLATFORM_EASE.smooth,
      }, 0.88);
    }

    tl.call(() => setPressed(true));
    tl.to({}, { duration: 0.08 });
    tl.call(() => setPressed(false));
    tl.call(() => setApproved(true));

    tl.to(rows[0], { opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0, marginBottom: 0, duration: 0.26, ease: PLATFORM_EASE.in }, 1.55);
    tl.to(cursor, { opacity: 0, duration: 0.15 }, 1.55);
    tl.to(approvedSection, { opacity: 1, height: "auto", duration: 0.28, ease: PLATFORM_EASE.out }, 1.62);

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
        Needs approval
      </p>
      <div className="space-y-1">
        {APPROVAL_QUEUE.map((item, i) => (
          <div
            key={item.name}
            data-approval-row
            data-reveal
            className="flex items-center justify-between overflow-hidden rounded border px-2 py-1"
            style={{ borderColor: platformTheme.border }}
          >
            <div>
              <p className="text-[10px] font-semibold" style={{ color: platformTheme.text }}>{item.name}</p>
              <p className="text-[9px]" style={{ color: platformTheme.textMuted }}>{item.action}</p>
            </div>
            {i === 0 && (
              <button
                type="button"
                data-approve-btn
                className="rounded px-2 py-0.5 text-[9px] font-semibold"
                style={{ background: platformTheme.accentGreen, color: "white" }}
              >
                Approve
              </button>
            )}
          </div>
        ))}
      </div>
      <div data-approved-section data-reveal className="mt-2 overflow-hidden" style={{ opacity: 0, height: 0 }}>
        <p className="text-[9px] font-medium uppercase tracking-wider" style={{ color: platformTheme.textSubtle }}>Approved</p>
        <div className="mt-1 rounded border px-2 py-1.5" style={{ borderColor: platformTheme.accentGreen, background: platformTheme.accentTint }}>
          <p className="text-[10px] font-semibold" style={{ color: platformTheme.text }}>{APPROVAL_QUEUE[0].name}</p>
          <p className="text-[9px]" style={{ color: platformTheme.textMuted }}>{APPROVAL_QUEUE[0].action}</p>
        </div>
      </div>
      {!reducedMotion && <FakeCursor ref={cursorRef} isPressed={pressed} />}
    </div>
  );
}
