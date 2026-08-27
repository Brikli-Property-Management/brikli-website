"use client";

import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  label: string;
  variant: "source" | "status" | "resolved";
  className?: string;
  badgeRef?: React.RefObject<HTMLSpanElement | null>;
};

export function StatusBadge({
  label,
  variant,
  className,
  badgeRef,
}: StatusBadgeProps) {
  return (
    <span
      ref={badgeRef}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium leading-none",
        variant === "source" &&
          "bg-[#FCE8E6] text-[#8B4A4A] border border-[#F5D5D2]",
        variant === "status" &&
          "bg-[#FFF3E0] text-[#9A6B3A] border border-[#FFE0B2]",
        variant === "resolved" &&
          "bg-[#E8F5E9] text-[#1A3A32] border border-[#C8E6C9]",
        className,
      )}
    >
      {label}
    </span>
  );
}
