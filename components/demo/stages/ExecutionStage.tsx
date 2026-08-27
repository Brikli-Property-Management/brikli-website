"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { EXECUTION_CHOREOGRAPHY, stageSeconds } from "@/animation/constants";
import { useDemoController } from "@/animation/stageController";
import { activityLog, executionFields } from "@/data/demoData";
import { StatusBadge } from "@/components/demo/primitives/VerificationBadge";
import { cn } from "@/lib/utils";

function highlightText(text: string, highlights: readonly string[]) {
  if (highlights.length === 0) return text;

  const parts: React.ReactNode[] = [];
  let remaining = text;

  highlights.forEach((highlight) => {
    const index = remaining.indexOf(highlight);
    if (index === -1) return;
    if (index > 0) parts.push(remaining.slice(0, index));
    parts.push(
      <span key={highlight} className="font-medium text-[#1A1A1A]">
        {highlight}
      </span>,
    );
    remaining = remaining.slice(index + highlight.length);
  });

  if (remaining) parts.push(remaining);
  return parts;
}

export function ExecutionStage() {
  const { registerStageTimeline, stageInstanceKey } = useDemoController();
  const [headerVisible, setHeaderVisible] = useState(false);
  const [visibleFields, setVisibleFields] = useState<Set<number>>(new Set());
  const [buttonsVisible, setButtonsVisible] = useState(false);
  const [visibleActivities, setVisibleActivities] = useState<Set<number>>(
    new Set(),
  );

  useEffect(() => {
    setHeaderVisible(false);
    setVisibleFields(new Set());
    setButtonsVisible(false);
    setVisibleActivities(new Set());

    const tl = gsap.timeline();

    tl.call(
      () => setHeaderVisible(true),
      undefined,
      stageSeconds(EXECUTION_CHOREOGRAPHY.headerReveal),
    );

    executionFields.forEach((_, index) => {
      tl.call(
        () => setVisibleFields((prev) => new Set([...prev, index])),
        undefined,
        stageSeconds(
          EXECUTION_CHOREOGRAPHY.fieldsStart +
            index * EXECUTION_CHOREOGRAPHY.fieldsStagger * 0.3,
        ),
      );
    });

    tl.call(
      () => setButtonsVisible(true),
      undefined,
      stageSeconds(EXECUTION_CHOREOGRAPHY.buttonsReveal),
    );

    activityLog.forEach((_, index) => {
      tl.call(
        () => setVisibleActivities((prev) => new Set([...prev, index])),
        undefined,
        stageSeconds(
          EXECUTION_CHOREOGRAPHY.activityStart +
            index * EXECUTION_CHOREOGRAPHY.activityStagger,
        ),
      );
    });

    registerStageTimeline(tl);

    return () => {
      tl.kill();
    };
  }, [registerStageTimeline, stageInstanceKey]);

  return (
    <div className="flex h-full flex-col px-5 py-5 md:px-7 md:py-6">
      <div
        className={cn(
          "mb-5 flex items-start justify-between gap-3 transition-all duration-500",
          headerVisible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
        )}
      >
        <p className="font-mono text-[10px] tracking-wide text-[#6B7280] uppercase md:text-[11px]">
          N1 — NOTICE OF RENT INCREASE · UNIT 412
        </p>
        <StatusBadge label="Ready for approval" variant="ready" visible={headerVisible} />
      </div>

      <div className="mb-5 grid grid-cols-2 gap-x-6 gap-y-4">
        {executionFields.map((field, index) => (
          <div
            key={field.label}
            className={cn(
              "transition-all duration-300",
              visibleFields.has(index)
                ? "translate-y-0 opacity-100"
                : "translate-y-1 opacity-0",
            )}
          >
            <p className="mb-0.5 font-mono text-[9px] tracking-wide text-[#9CA3AF] uppercase">
              {field.label}
            </p>
            <p className="text-[13px] text-[#1A1A1A] md:text-[14px]">{field.value}</p>
          </div>
        ))}
      </div>

      <div
        className={cn(
          "mb-6 flex gap-2 transition-all duration-500",
          buttonsVisible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
        )}
      >
        <button
          type="button"
          className="flex-1 rounded-lg bg-[#0F291E] px-4 py-2.5 text-[13px] font-medium text-white transition-colors duration-150 hover:bg-[#1A3D2A]"
        >
          Approve and deliver
        </button>
        <button
          type="button"
          className="rounded-lg border border-[#E0E0DE] bg-white px-5 py-2.5 text-[13px] text-[#6B7280] transition-colors duration-150 hover:border-[#C4C4C0] hover:text-[#1A1A1A]"
        >
          Edit
        </button>
      </div>

      <div className="mt-auto space-y-2 border-t border-[#EFEFED] pt-4">
        {activityLog.map((entry, index) => (
          <div
            key={entry.time + entry.text}
            className={cn(
              "flex gap-4 font-mono text-[10px] transition-all duration-300 md:text-[11px]",
              visibleActivities.has(index)
                ? "translate-y-0 opacity-100"
                : "translate-y-1 opacity-0",
            )}
          >
            <span className="w-10 shrink-0 text-[#9CA3AF]">{entry.time}</span>
            <span className="text-[#6B7280]">
              {highlightText(entry.text, entry.highlights)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
