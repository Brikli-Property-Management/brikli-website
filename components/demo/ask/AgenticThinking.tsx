"use client";

import { BrikliMark } from "@/components/demo/BrikliMark";
import { ThinkingState } from "@/components/demo/chat/ThinkingState";

type AgenticThinkingProps = {
  steps: string[];
  activeStep: number;
};

export function AgenticThinking({ steps, activeStep }: AgenticThinkingProps) {
  if (activeStep < 0) {
    return <ThinkingState />;
  }

  return (
    <div className="agentic-thinking flex items-start gap-2">
      <BrikliMark size={20} />
      <div className="space-y-1.5">
        {steps.slice(0, activeStep + 1).map((step, i) => (
          <ThinkingState
            key={step}
            label={step}
            showCheck={i < activeStep}
            showMark={false}
            animate={i === activeStep}
          />
        ))}
      </div>
    </div>
  );
}
