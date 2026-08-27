import { cn } from "@/lib/utils";
import { productTheme as t } from "@/components/demo/productTheme";

interface WindowChromeProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function WindowChrome({ title, children, className }: WindowChromeProps) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]",
        className,
      )}
      style={{ borderColor: t.border }}
    >
      <div
        className="flex shrink-0 items-center border-b px-4 py-3"
        style={{ borderColor: t.borderMuted }}
      >
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        </div>
        <p
          className="flex-1 text-center font-mono text-[11px] tracking-wide"
          style={{ color: t.textSubtle }}
        >
          {title}
        </p>
        <div className="w-[52px]" aria-hidden />
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
