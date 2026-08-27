"use client";

import { forwardRef } from "react";
import { StatusBadge } from "@/components/demo/StatusBadge";
import { cn } from "@/lib/utils";
import type { ReviewItem } from "@/data/portfolioData";

export type ReviewRowState = "idle" | "highlighted" | "processing" | "resolved";

type ReviewRowProps = {
  item: ReviewItem;
  state?: ReviewRowState;
  resolvedLabel?: string;
  isLast?: boolean;
  statusBadgeRef?: React.RefObject<HTMLSpanElement | null>;
};

export const ReviewRow = forwardRef<HTMLDivElement, ReviewRowProps>(
  function ReviewRow(
    {
      item,
      state = "idle",
      resolvedLabel = "Resolved",
      isLast = false,
      statusBadgeRef,
    },
    ref,
  ) {
    const showResolved = state === "resolved";

    return (
      <div
        ref={ref}
        data-row-id={item.id}
        className={cn(
          "review-row relative px-5 py-4",
          !isLast && "border-b border-[#EFEFED]",
          (state === "highlighted" || state === "processing") && "bg-[#FFF9E6]",
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <h3 className="text-[15px] font-semibold text-[#1A1A1A]">
                {item.title}
              </h3>
              <span className="text-[13px] text-[#9CA3AF]">{item.property}</span>
            </div>
            <p className="mt-1 text-[13px] leading-relaxed text-[#6B7280]">
              {item.description}
            </p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {showResolved ? (
                <StatusBadge label={resolvedLabel} variant="resolved" />
              ) : (
                item.tags.map((tag, index) => (
                  <StatusBadge
                    key={`${item.id}-${tag.label}`}
                    label={tag.label}
                    variant={tag.variant}
                    badgeRef={
                      tag.variant === "status" && index === 0
                        ? statusBadgeRef
                        : undefined
                    }
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
);
