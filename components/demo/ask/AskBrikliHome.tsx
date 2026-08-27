"use client";

import { BarChart3, CalendarClock, FileText, TrendingDown } from "lucide-react";
import { askQuestions } from "@/data/productDemoData";
import { BrikliMark } from "@/components/demo/BrikliMark";
import { cn } from "@/lib/utils";

const iconMap = {
  calendar: CalendarClock,
  trending: TrendingDown,
  "bar-chart": BarChart3,
  "file-text": FileText,
} as const;

type AskBrikliHomeProps = {
  homeInputText?: string;
  inputFocused?: boolean;
  onSuggestionClick?: (id: string) => void;
  homeInputRef?: React.RefObject<HTMLDivElement | null>;
  suggestionRef?: React.RefObject<HTMLButtonElement | null>;
};

export function AskBrikliHome({
  homeInputText = "",
  inputFocused = false,
  onSuggestionClick,
  homeInputRef,
  suggestionRef,
}: AskBrikliHomeProps) {
  const isTyping = homeInputText.length > 0;

  return (
    <div className="flex h-full flex-col items-center justify-center bg-[#FAF9F6] px-8">
      <BrikliMark size={56} />

      <h1 className="mt-7 text-[26px] font-semibold tracking-[-0.02em] text-brikli-green">
        Hey Justin. Ready to dive in?
      </h1>

      <div className="mt-10 w-full max-w-[560px]">
        <div
          ref={homeInputRef}
          className={cn(
            "home-input flex h-[52px] items-center gap-3 rounded-full border bg-white px-5 transition-colors",
            inputFocused ? "border-[#C4C4C4]" : "border-[#E3E3E0]",
          )}
        >
          {isTyping ? (
            <span className="min-w-0 flex-1 truncate whitespace-nowrap text-[14px] text-brikli-green">
              {homeInputText}
              {inputFocused && (
                <span className="ml-px inline-block h-4 w-px animate-pulse bg-brikli-green" />
              )}
            </span>
          ) : (
            <span className="min-w-0 flex-1 truncate whitespace-nowrap text-[14px] text-brikli-green">
              Ask anything, or type @ to scope it to a property, unit, tenant, or document
            </span>
          )}
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
              isTyping
                ? "bg-[#1A1A1A] text-white"
                : "border border-[#E8E8E6] bg-white text-[#B0B0AD]",
            )}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path
                d="M7 11V3M7 3L4 6M7 3l3 3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="mt-6 w-full max-w-[560px]">
        {askQuestions.map((q, i) => {
          const Icon = iconMap[q.icon];
          const isFirst = i === 0;
          return (
            <button
              key={q.id}
              ref={isFirst ? suggestionRef : undefined}
              type="button"
              onClick={() => onSuggestionClick?.(q.id)}
              className="suggestion-btn flex w-full items-center gap-3 rounded-lg px-1 py-2.5 text-left transition-colors hover:bg-[#F0EFEC]/60"
            >
              <Icon className="h-[18px] w-[18px] shrink-0 text-brikli-green" strokeWidth={1.5} />
              <span className="text-[15px] text-brikli-green">{q.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
