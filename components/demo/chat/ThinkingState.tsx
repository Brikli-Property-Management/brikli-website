"use client";

import { usePopIn } from "@/components/demo/hooks/usePopIn";
import { BrikliMark } from "@/components/demo/BrikliMark";

type ThinkingStateProps = {
  label?: string;
  showCheck?: boolean;
  showMark?: boolean;
  className?: string;
  animate?: boolean;
};

export function ThinkingState({
  label = "Brikling...",
  showCheck = false,
  showMark = true,
  className = "",
  animate = true,
}: ThinkingStateProps) {
  const popRef = usePopIn<HTMLDivElement>({
    origin: "left",
    y: 10,
    scale: 0.96,
    duration: 0.38,
    disabled: !animate,
  });

  return (
    <div ref={popRef} className={`thinking-state flex items-center gap-2 ${className}`}>
      {showMark && <BrikliMark size={20} />}
      {showCheck ? (
        <span className="flex items-center gap-1.5 text-[13px] text-brikli-green">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M3 7l3 3 5-5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {label}
        </span>
      ) : (
        <span className="thinking-label text-[13px] italic text-brikli-green">
          {label}
        </span>
      )}
    </div>
  );
}
