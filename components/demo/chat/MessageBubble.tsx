"use client";

import { usePopIn } from "@/components/demo/hooks/usePopIn";

type MessageBubbleProps = {
  children: React.ReactNode;
  variant?: "user" | "assistant";
  className?: string;
  animate?: boolean;
};

export function MessageBubble({
  children,
  variant = "user",
  className = "",
  animate = true,
}: MessageBubbleProps) {
  const popRef = usePopIn<HTMLDivElement>({
    origin: variant === "user" ? "right" : "left",
    y: 14,
    scale: 0.92,
    duration: 0.44,
    disabled: !animate,
  });

  if (variant === "user") {
    return (
      <div ref={popRef} className={`user-message flex justify-end ${className}`}>
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-[#0B2519] px-4 py-2.5 text-[13px] leading-relaxed text-white">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div ref={popRef} className={`assistant-message flex justify-start ${className}`}>
      <div className="max-w-[90%] text-[13px] leading-relaxed text-brikli-green">
        {children}
      </div>
    </div>
  );
}
