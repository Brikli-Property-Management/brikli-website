"use client";

import { STAGE_META, type Stage } from "@/animation/constants";
import { useDemoController } from "@/animation/stageController";
import { WindowChrome } from "@/components/demo/primitives/WindowChrome";
import { ExecutionStage } from "@/components/demo/stages/ExecutionStage";
import { IntelligenceStage } from "@/components/demo/stages/IntelligenceStage";
import { RecordsStage } from "@/components/demo/stages/RecordsStage";
import { RulesStage } from "@/components/demo/stages/RulesStage";

const stageComponents: Record<Stage, React.ComponentType> = {
  records: RecordsStage,
  intelligence: IntelligenceStage,
  rules: RulesStage,
  execution: ExecutionStage,
};

export function DemoWindow() {
  const { stage, contentRef, stageInstanceKey } = useDemoController();
  const StageComponent = stageComponents[stage];
  const windowTitle = STAGE_META[stage].windowTitle;

  return (
    <div className="flex min-w-0 flex-1 flex-col p-3 md:p-4">
      <WindowChrome title={windowTitle}>
        <div ref={contentRef} className="h-full min-h-0">
          <StageComponent key={`${stage}-${stageInstanceKey}`} />
        </div>
      </WindowChrome>
    </div>
  );
}
