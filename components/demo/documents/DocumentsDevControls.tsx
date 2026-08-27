"use client";

import {
  DEMO_STAGES,
  STAGE_LABELS,
  type DemoStage,
} from "@/animation/documentsTiming";

type DocumentsDevControlsProps = {
  onRestart: () => void;
  onPause: () => void;
  onResume: () => void;
  onJumpToStage: (stage: DemoStage) => void;
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
  isPaused: boolean;
};

const SPEEDS = [0.5, 1, 1.5, 2] as const;

export function DocumentsDevControls({
  onRestart,
  onPause,
  onResume,
  onJumpToStage,
  playbackSpeed,
  onSpeedChange,
  isPaused,
}: DocumentsDevControlsProps) {
  return (
    <div className="w-full max-w-[720px] rounded-lg border border-[#E8E8E6] bg-white p-4 shadow-sm">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
        Dev controls
      </p>

      <div className="flex flex-wrap items-center gap-3">
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

      <div className="mt-3 flex flex-wrap items-center gap-3">
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
          className="min-w-[180px] rounded-md border border-[#E8E8E6] bg-white px-2 py-1 text-[10px] text-[#374151]"
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
    </div>
  );
}
