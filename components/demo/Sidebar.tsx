"use client";

import {
  BarChart3,
  ClipboardList,
  FileText,
  Home,
  Inbox,
  Sparkles,
  Zap,
} from "lucide-react";
import { navItems } from "@/data/portfolioData";
import { BrikliMark } from "@/components/demo/BrikliMark";
import { cn } from "@/lib/utils";

const iconMap = {
  home: Home,
  sparkles: Sparkles,
  inbox: Inbox,
  clipboard: ClipboardList,
  file: FileText,
  zap: Zap,
  "bar-chart": BarChart3,
} as const;

export function Sidebar({ activeNavId = "home" }: { activeNavId?: string }) {
  return (
    <aside className="flex h-full w-[220px] shrink-0 flex-col border-r border-[#EBEBEB] bg-[#F4F4F4]">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <BrikliMark size={28} />
        <span className="text-[17px] font-semibold tracking-tight text-[#1A1A1A]">
          Brikli
        </span>
      </div>

      <nav className="flex-1 space-y-0.5 px-3">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = item.id === activeNavId;
          return (
            <div
              key={item.id}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium",
                isActive
                  ? "bg-white text-[#1A1A1A] shadow-sm"
                  : "text-[#6B7280]",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
              {item.label}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
