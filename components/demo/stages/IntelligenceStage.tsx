"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import {
  INTELLIGENCE_CHOREOGRAPHY,
  stageSeconds,
} from "@/animation/constants";
import { useDemoController } from "@/animation/stageController";
import {
  intelligenceCards,
  verifiedOperatingFact,
} from "@/data/demoData";
import { StatusBadge } from "@/components/demo/primitives/VerificationBadge";
import { cn } from "@/lib/utils";

export function IntelligenceStage() {
  const { registerStageTimeline, stageInstanceKey } = useDemoController();
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());
  const [showAmendmentBadge, setShowAmendmentBadge] = useState(false);
  const [showPmsBadge, setShowPmsBadge] = useState(false);
  const [showVerifiedFact, setShowVerifiedFact] = useState(false);

  useEffect(() => {
    setVisibleCards(new Set());
    setShowAmendmentBadge(false);
    setShowPmsBadge(false);
    setShowVerifiedFact(false);

    const tl = gsap.timeline();

    intelligenceCards.forEach((card, index) => {
      tl.call(
        () => setVisibleCards((prev) => new Set([...prev, card.id])),
        undefined,
        stageSeconds(
          INTELLIGENCE_CHOREOGRAPHY.cardsAppear +
            index * INTELLIGENCE_CHOREOGRAPHY.cardStagger,
        ),
      );
    });

    tl.call(
      () => setShowAmendmentBadge(true),
      undefined,
      stageSeconds(INTELLIGENCE_CHOREOGRAPHY.amendmentControls),
    );

    tl.call(
      () => setShowPmsBadge(true),
      undefined,
      stageSeconds(INTELLIGENCE_CHOREOGRAPHY.pmsStale),
    );

    tl.call(
      () => setShowVerifiedFact(true),
      undefined,
      stageSeconds(INTELLIGENCE_CHOREOGRAPHY.verifiedFact),
    );

    registerStageTimeline(tl);

    return () => {
      tl.kill();
    };
  }, [registerStageTimeline, stageInstanceKey]);

  const borderClass = (border: string) => {
    switch (border) {
      case "copper":
        return "border-[#E8D5C4] bg-[#FFFBF7]";
      case "stale":
        return "border-[#E8D0CA] bg-[#FFFBFA]";
      default:
        return "border-[#EFEFED] bg-white";
    }
  };

  const badgeVisible = (card: (typeof intelligenceCards)[number]) => {
    if (!card.badge) return false;
    if (card.id === "amendment") return showAmendmentBadge;
    if (card.id === "pms") return showPmsBadge;
    return visibleCards.has(card.id);
  };

  const badgeVariant = (badge: string) => {
    switch (badge) {
      case "CONTROLS":
        return "controls" as const;
      case "STALE":
        return "stale" as const;
      default:
        return "base" as const;
    }
  };

  return (
    <div className="flex h-full flex-col px-5 py-5 md:px-7 md:py-6">
      <div className="grid flex-1 grid-cols-2 gap-3 content-start">
        {intelligenceCards.map((card) => {
          const visible = visibleCards.has(card.id);
          return (
            <div
              key={card.id}
              className={cn(
                "rounded-lg border p-4 transition-all duration-500",
                borderClass(card.border),
                visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
              )}
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <span className="font-mono text-[9px] tracking-wide text-[#9CA3AF] uppercase">
                  {card.label}
                </span>
                {card.badge && (
                  <StatusBadge
                    label={card.badge}
                    variant={badgeVariant(card.badge)}
                    visible={badgeVisible(card)}
                  />
                )}
              </div>
              <p className="text-[18px] font-medium text-[#1A1A1A] md:text-[20px]">
                {card.value}
              </p>
              <p className="mt-1 text-[11px] text-[#9CA3AF]">{card.subtext}</p>
            </div>
          );
        })}

        <div
          className={cn(
            "col-span-2 rounded-lg border border-[#D4E8DA] bg-[#F0F7F2] p-4 transition-all duration-500 md:p-5",
            showVerifiedFact
              ? "translate-y-0 opacity-100"
              : "translate-y-3 opacity-0",
          )}
        >
          <p className="mb-2 font-mono text-[10px] tracking-wide text-[#2D5A3D]">
            ✓ VERIFIED OPERATING FACT
          </p>
          <p className="text-[24px] font-medium text-[#1A1A1A] md:text-[28px]">
            {verifiedOperatingFact.value}
          </p>
          <p className="mt-2 text-[11px] leading-relaxed text-[#6B7280]">
            {verifiedOperatingFact.subtext}
          </p>
        </div>
      </div>
    </div>
  );
}
