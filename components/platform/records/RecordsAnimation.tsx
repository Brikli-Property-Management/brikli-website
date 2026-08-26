"use client";

import { PillarAnimationShell } from "@/components/platform/PillarAnimationShell";
import { RecordIngestion } from "@/components/platform/records/scenes/RecordIngestion";
import { RecordTree } from "@/components/platform/records/scenes/RecordTree";
import { ExtractionGrounding } from "@/components/platform/records/scenes/ExtractionGrounding";
import { TenancyTimeline } from "@/components/platform/records/scenes/TenancyTimeline";
import type { PlatformAnimationProps } from "@/components/platform/types";

const RECORDS_SCENES = [
  RecordIngestion,
  RecordTree,
  ExtractionGrounding,
  TenancyTimeline,
] as const;

export function RecordsAnimation(props: PlatformAnimationProps) {
  return <PillarAnimationShell {...props} pillarId="records" scenes={[...RECORDS_SCENES]} />;
}
