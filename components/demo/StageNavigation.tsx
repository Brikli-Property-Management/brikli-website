"use client";

import {
  STAGE_META,
  STAGES,
} from "@/animation/constants";
import { useDemoController } from "@/animation/stageController";
import { ProgressLine } from "@/components/demo/primitives/ProgressLine";
import { productTheme as t } from "@/components/demo/productTheme";
import { cn } from "@/lib/utils";

export function StageNavigation() {
  const { stage, progress, goToStage } = useDemoController();

  return (
    <nav
      className="flex w-[220px] shrink-0 flex-col gap-1 border-r px-4 py-6 md:w-[260px] md:px-6 md:py-8"
      style={{ backgroundColor: t.bgNav, borderColor: t.borderMuted }}
    >
      {STAGES.map((s) => {
        const meta = STAGE_META[s];
        const isActive = stage === s;

        return (
          <button
            key={s}
            type="button"
            onClick={() => goToStage(s)}
            aria-current={isActive ? "step" : undefined}
            className={cn(
              "group relative w-full cursor-pointer rounded-lg px-3 py-3 text-left transition-all duration-300 ease-in-out md:px-4 md:py-3.5",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0F291E]/20",
              isActive
                ? "bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
                : "bg-transparent hover:bg-white/50",
            )}
          >
            {isActive && (
              <span
                className="absolute top-2.5 bottom-2.5 left-0 w-[2px] rounded-full bg-[#0F291E]"
                aria-hidden
              />
            )}

            <div className="flex items-baseline gap-2">
              <span
                className={cn(
                  "font-mono text-[11px] transition-colors duration-300",
                  isActive ? "text-[#6B7280]" : "text-[#9CA3AF]",
                )}
              >
                {meta.number}
              </span>
              <span
                className={cn(
                  "text-[15px] font-medium transition-colors duration-300 md:text-[16px]",
                  isActive ? "text-[#1A1A1A]" : "text-[#6B7280]",
                )}
              >
                {meta.title}
              </span>
            </div>

            <p
              className={cn(
                "mt-0.5 pl-[26px] text-[11px] transition-colors duration-300 md:text-[12px]",
                isActive ? "text-[#6B7280]" : "text-[#9CA3AF]",
              )}
            >
              {meta.subtitle}
            </p>

            <div className="mt-2.5 pl-[26px]">
              <ProgressLine active={isActive} progress={isActive ? progress : 0} />
            </div>
          </button>
        );
      })}
    </nav>
  );
}
