"use client";

import { PillarAnimationShell } from "@/components/platform/PillarAnimationShell";
import { EligibilityChecks } from "@/components/platform/rules/scenes/EligibilityChecks";
import { RulePath } from "@/components/platform/rules/scenes/RulePath";
import { PortfolioEligibility } from "@/components/platform/rules/scenes/PortfolioEligibility";
import { RuleVersion } from "@/components/platform/rules/scenes/RuleVersion";
import type { PlatformAnimationProps } from "@/components/platform/types";

const RULES_SCENES = [
  EligibilityChecks,
  RulePath,
  PortfolioEligibility,
  RuleVersion,
] as const;

export function RulesAnimation(props: PlatformAnimationProps) {
  return <PillarAnimationShell {...props} pillarId="rules" scenes={[...RULES_SCENES]} />;
}
