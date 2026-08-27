"use client";

import { DEMO_STAGES, STAGE_LABELS, type DemoStage } from "@/animation/timing";

type DevControlsProps = {
  onRestart: () => void;
  onPause: () => void;
  onResume: () => void;
  onJumpToStage: (stage: DemoStage) => void;
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
  isPaused: boolean;
};

const SPEEDS = [0.5, 1, 1.5, 2] as const;

export function DevControls({
  onRestart,
  onPause,
  onResume,
  onJumpToStage,
  playbackSpeed,
  onSpeedChange,
  isPaused,
}: DevControlsProps) {
  return (
    <div className="absolute bottom-3 right-3 z-[100] flex flex-col gap-2 rounded-lg border border-[#E8E8E6] bg-white/95 p-3 shadow-lg backdrop-blur-sm">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
        Dev controls
      </p>

      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={onRestart}
          className="rounded-md bg-[#1A1A1A] px-2.5 py-1 text-[11px] font-medium text-white"
        >
          Restart
        </button>
        <button
          type="button"
          onClick={isPaused ? onResume : onPause}
          className="rounded-md border border-[#E8E8E6] px-2.5 py-1 text-[11px] font-medium text-[#374151]"
        >
          {isPaused ? "Resume" : "Pause"}
        </button>
      </div>

      <div className="flex gap-1">
        {SPEEDS.map((speed) => (
          <button
            key={speed}
            type="button"
            onClick={() => onSpeedChange(speed)}
            className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${
              playbackSpeed === speed
                ? "bg-[#0F291E] text-white"
                : "bg-[#F0F0EE] text-[#6B7280]"
            }`}
          >
            {speed}x
          </button>
        ))}
      </div>

      <select
        className="rounded-md border border-[#E8E8E6] bg-white px-2 py-1 text-[10px] text-[#374151]"
        defaultValue=""
        onChange={(e) => {
          const stage = e.target.value as DemoStage;
          if (stage) onJumpToStage(stage);
          e.target.value = "";
        }}
      >
        <option value="" disabled>
          Jump to scene…
        </option>
        {DEMO_STAGES.map((stage) => (
          <option key={stage} value={stage}>
            {STAGE_LABELS[stage]}
          </option>
        ))}
      </select>
    </div>
  );
}
