"use client";

import type { PlatformSceneProps } from "@/components/platform/types";
import { platformTheme } from "@/components/platform/platformTheme";
import { cn } from "@/lib/utils";

type ScenePlaceholderProps = PlatformSceneProps & {
  pillarLabel: string;
  sceneLabel: string;
  sceneIndex: number;
};

/** Shared placeholder shell for unimplemented scenes — pillar agents replace these. */
export function ScenePlaceholder({
  pillarLabel,
  sceneLabel,
  sceneIndex,
  isActive,
  reducedMotion,
}: ScenePlaceholderProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 flex flex-col items-center justify-center rounded-xl border border-dashed",
        !isActive && !reducedMotion && "pointer-events-none",
      )}
      style={{
        background: platformTheme.placeholderBg,
        borderColor: platformTheme.placeholderBorder,
      }}
      data-scene={sceneIndex}
      aria-hidden={!isActive && !reducedMotion}
    >
      <span
        className="mb-1 text-[10px] font-medium uppercase tracking-[0.18em]"
        style={{ color: platformTheme.textSubtle }}
      >
        {pillarLabel}
      </span>
      <span
        className="text-sm font-medium"
        style={{ color: platformTheme.textMuted }}
      >
        Scene {String.fromCharCode(65 + sceneIndex)} — {sceneLabel}
      </span>
      <span
        className="mt-2 text-xs"
        style={{ color: platformTheme.textSubtle }}
      >
        Placeholder
      </span>
    </div>
  );
}
