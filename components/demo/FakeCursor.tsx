"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type FakeCursorProps = {
  className?: string;
  isPressed?: boolean;
  variant?: "pointer" | "text";
  visible?: boolean;
};

export const FakeCursor = forwardRef<HTMLDivElement, FakeCursorProps>(
  function FakeCursor(
    { className, isPressed = false, variant = "pointer", visible = true },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cn(
          "fake-cursor pointer-events-none absolute left-0 top-0 z-50 will-change-transform",
          !visible && "invisible",
          className,
        )}
        aria-hidden
      >
        {variant === "text" ? (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className={cn("drop-shadow-md", isPressed && "scale-[0.92]")}
          >
            <path
              d="M11 4h2v6h3v2h-3v6h-2v-6H8v-2h3V4Z"
              fill="#1A1A1A"
              stroke="#FFFFFF"
              strokeWidth="1.25"
            />
          </svg>
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className={cn("drop-shadow-md", isPressed && "scale-[0.88]")}
          >
            <path
              d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.86a.5.5 0 0 0-.85.35Z"
              fill="#1A1A1A"
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
          </svg>
        )}
      </div>
    );
  },
);
