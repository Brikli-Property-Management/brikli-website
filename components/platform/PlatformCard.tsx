"use client";

import { type ReactNode } from "react";
import type { PlatformPillarMeta } from "@/components/platform/types";
import { platformTheme, PLATFORM_VIZ_VIEWPORT } from "@/components/platform/platformTheme";
import { cn } from "@/lib/utils";

const PLATFORM_HOVER_GRADIENT =
  "linear-gradient(145deg, rgba(255, 255, 255, 0.32) 18%, rgba(21, 68, 46, 0.16) 100%)";

export type PlatformCardProps = {
  pillar: PlatformPillarMeta;
  isHovered: boolean;
  onHoverChange: (hovered: boolean) => void;
  /** Product visualization slot — pillar animations render here. */
  children: ReactNode;
};

export function PlatformCard({
  pillar,
  isHovered,
  onHoverChange,
  children,
}: PlatformCardProps) {
  return (
    <article
      className={cn(
        "relative flex flex-col overflow-hidden rounded-2xl border transition-[border-color,box-shadow,background] duration-300",
        isHovered
          ? "border-[#C8D5CC] shadow-[0_0_0_1px_rgba(29,59,35,0.08)]"
          : "border-[#EFEFED] shadow-none",
      )}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      data-pillar={pillar.id}
    >
      <div
        className="relative flex flex-col overflow-hidden transition-[background] duration-300"
        style={{
          background: isHovered ? PLATFORM_HOVER_GRADIENT : platformTheme.cardBg,
        }}
      >
      {/* PRODUCT VISUAL — fixed viewport; only this region animates */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: PLATFORM_VIZ_VIEWPORT.aspectRatio,
          minHeight: PLATFORM_VIZ_VIEWPORT.minHeightPx,
          maxHeight: PLATFORM_VIZ_VIEWPORT.maxHeightPx,
          background: "transparent",
        }}
        data-platform-viz
      >
        {isHovered && (
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{ background: platformTheme.borderActive, opacity: 0.35 }}
          />
        )}
        <div
          className="absolute inset-0"
          style={{ padding: PLATFORM_VIZ_VIEWPORT.paddingPx }}
        >
          {children}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full" style={{ background: platformTheme.divider }} />

      {/* TITLE / DESCRIPTION — stable, does not animate */}
      <div className="flex flex-col gap-2 px-5 py-4 md:px-6 md:py-5">
        <div className="flex items-baseline gap-3">
          <span
            className="text-xs font-medium tracking-widest"
            style={{ color: platformTheme.textSubtle }}
          >
            {pillar.number}
          </span>
          <h3
            className="text-lg font-semibold tracking-tight md:text-xl"
            style={{ color: platformTheme.text }}
          >
            {pillar.title}
          </h3>
        </div>
        <p
          className="text-sm font-medium"
          style={{ color: platformTheme.accentGreen }}
        >
          {pillar.subtitle}
        </p>
      </div>
      </div>
    </article>
  );
}
