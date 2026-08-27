import { cn } from "@/lib/utils";
import { productTheme as t } from "@/components/demo/productTheme";

interface ProgressLineProps {
  active: boolean;
  progress: number;
  className?: string;
}

export function ProgressLine({ active, progress, className }: ProgressLineProps) {
  return (
    <div
      className={cn("relative h-px w-full overflow-hidden rounded-full", className)}
      style={{ backgroundColor: t.progressTrack }}
      aria-hidden
    >
      {active && (
        <div
          className="absolute inset-y-0 left-0 transition-none"
          style={{
            width: `${Math.min(100, Math.max(0, progress * 100))}%`,
            backgroundColor: t.progressFill,
          }}
        />
      )}
    </div>
  );
}
