"use client";

import { Copy, ThumbsDown, ThumbsUp } from "lucide-react";
import { groundedAnswer } from "@/data/productDemoData";
import { BrikliMark } from "@/components/demo/BrikliMark";
import { usePopIn } from "@/components/demo/hooks/usePopIn";

type GroundedAnswerProps = {
  visible?: boolean;
  sentenceIndex?: number;
};

export function GroundedAnswer({
  visible = false,
  sentenceIndex = -1,
}: GroundedAnswerProps) {
  const popRef = usePopIn<HTMLDivElement>({
    origin: "left",
    y: 12,
    scale: 0.96,
    duration: 0.42,
    disabled: !visible,
  });

  if (!visible) return null;

  return (
    <div ref={popRef} className="grounded-answer space-y-3">
      <div className="flex items-start gap-2">
        <BrikliMark size={20} className="mt-0.5" />
        <div className="space-y-2">
          {groundedAnswer.sentences.map((sentence, i) => (
            <p
              key={sentence}
              className="answer-sentence text-[13px] leading-relaxed text-brikli-green"
              style={{ opacity: sentenceIndex >= i ? 1 : 0 }}
            >
              {sentence}
            </p>
          ))}

          <span
            className="answer-source inline-flex rounded-md bg-[#E8F5EC] px-2 py-0.5 text-[11px] font-medium text-brikli-green"
            style={{ opacity: sentenceIndex >= 1 ? 1 : 0 }}
          >
            {groundedAnswer.source}
          </span>

          <div
            className="answer-actions flex items-center gap-3"
            style={{ opacity: sentenceIndex >= 1 ? 1 : 0 }}
          >
            <button type="button" className="text-brikli-green hover:text-brikli-green/70">
              <Copy className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
            <button type="button" className="text-brikli-green hover:text-brikli-green/70">
              <ThumbsUp className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
            <button type="button" className="text-brikli-green hover:text-brikli-green/70">
              <ThumbsDown className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
