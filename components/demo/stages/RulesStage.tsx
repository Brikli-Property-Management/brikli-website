"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { RULES_CHOREOGRAPHY, stageSeconds } from "@/animation/constants";
import { useDemoController } from "@/animation/stageController";
import { actionDetermined, rulesRows } from "@/data/demoData";
import { VerificationBadge } from "@/components/demo/primitives/VerificationBadge";
import { cn } from "@/lib/utils";

export function RulesStage() {
  const { registerStageTimeline, stageInstanceKey } = useDemoController();
  const [checkedRows, setCheckedRows] = useState<Set<string>>(new Set());
  const [showAction, setShowAction] = useState(false);

  useEffect(() => {
    setCheckedRows(new Set());
    setShowAction(false);

    const tl = gsap.timeline();

    rulesRows.forEach((row, index) => {
      tl.call(
        () => setCheckedRows((prev) => new Set([...prev, row.id])),
        undefined,
        stageSeconds(
          RULES_CHOREOGRAPHY.rowStart +
            index * RULES_CHOREOGRAPHY.rowStagger,
        ),
      );
    });

    tl.call(
      () => setShowAction(true),
      undefined,
      stageSeconds(RULES_CHOREOGRAPHY.actionDetermined),
    );

    registerStageTimeline(tl);

    return () => {
      tl.kill();
    };
  }, [registerStageTimeline, stageInstanceKey]);

  return (
    <div className="flex h-full flex-col justify-center px-5 py-5 md:px-7 md:py-6">
      <div className="space-y-2">
        {rulesRows.map((row) => {
          const checked = checkedRows.has(row.id);
          return (
            <div
              key={row.id}
              className={cn(
                "flex items-center gap-4 rounded-lg border bg-white px-4 py-3 transition-all duration-300",
                checked ? "border-[#E0E0DE]" : "border-[#EFEFED]",
                checked ? "opacity-100" : "opacity-60",
              )}
            >
              <span className="w-24 shrink-0 font-mono text-[10px] text-[#9CA3AF]">
                {row.label}
              </span>
              <span className="min-w-0 flex-1 text-[13px] text-[#1A1A1A] md:text-[14px]">
                {row.value}
              </span>
              <VerificationBadge visible={checked} />
            </div>
          );
        })}

        <div
          className={cn(
            "mt-3 rounded-lg border border-[#E0E0DE] bg-[#FAFAF8] px-4 py-4 transition-all duration-500 md:px-5 md:py-5",
            showAction
              ? "translate-y-0 opacity-100"
              : "translate-y-2 opacity-0",
          )}
        >
          <p className="mb-2 font-mono text-[9px] tracking-[0.14em] text-[#9CA3AF] uppercase">
            Action determined
          </p>
          <p className="text-[18px] font-medium text-[#1A1A1A] md:text-[20px]">
            {actionDetermined.title}
          </p>
          <p className="mt-1.5 text-[11px] text-[#6B7280]">
            {actionDetermined.subtext}
          </p>
        </div>
      </div>
    </div>
  );
}
