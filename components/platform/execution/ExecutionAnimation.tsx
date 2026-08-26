"use client";

import { PillarAnimationShell } from "@/components/platform/PillarAnimationShell";
import { NoticeGeneration } from "@/components/platform/execution/scenes/NoticeGeneration";
import { ApprovalQueue } from "@/components/platform/execution/scenes/ApprovalQueue";
import { WorkflowMovement } from "@/components/platform/execution/scenes/WorkflowMovement";
import { AuditTrail } from "@/components/platform/execution/scenes/AuditTrail";
import type { PlatformAnimationProps } from "@/components/platform/types";

const EXECUTION_SCENES = [
  NoticeGeneration,
  ApprovalQueue,
  WorkflowMovement,
  AuditTrail,
] as const;

export function ExecutionAnimation(props: PlatformAnimationProps) {
  return (
    <PillarAnimationShell {...props} pillarId="execution" scenes={[...EXECUTION_SCENES]} />
  );
}
