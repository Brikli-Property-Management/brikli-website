"use client";

import { BrikliMark } from "@/components/demo/BrikliMark";
import { askRevealClass } from "@/components/demo/ask/AskResponse/askRevealClass";
import { cn } from "@/lib/utils";

type ResponseHeaderProps = {
  className?: string;
  revealed?: boolean;
};

export function ResponseHeader({ className = "", revealed = false }: ResponseHeaderProps) {
  return (
    <div
      className={cn("ask-response-header flex items-center gap-2", askRevealClass(revealed), className)}
    >
      <BrikliMark size={20} />
      <span className="text-[13px] font-medium text-brikli-green">Brikli</span>
    </div>
  );
}
