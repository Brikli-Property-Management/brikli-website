"use client";

import { PillarAnimationShell } from "@/components/platform/PillarAnimationShell";
import { RentReconciliation } from "@/components/platform/intelligence/scenes/RentReconciliation";
import { LeaseExpiry } from "@/components/platform/intelligence/scenes/LeaseExpiry";
import { RevenueLeakage } from "@/components/platform/intelligence/scenes/RevenueLeakage";
import { EvidenceResolution } from "@/components/platform/intelligence/scenes/EvidenceResolution";
import type { PlatformAnimationProps } from "@/components/platform/types";

const INTELLIGENCE_SCENES = [
  RentReconciliation,
  LeaseExpiry,
  RevenueLeakage,
  EvidenceResolution,
] as const;

export function IntelligenceAnimation(props: PlatformAnimationProps) {
  return (
    <PillarAnimationShell {...props} pillarId="intelligence" scenes={[...INTELLIGENCE_SCENES]} />
  );
}
