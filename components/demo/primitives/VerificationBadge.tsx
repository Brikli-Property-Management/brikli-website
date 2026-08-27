import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { productTheme as t } from "@/components/demo/productTheme";

interface VerificationBadgeProps {
  visible?: boolean;
  className?: string;
}

export function VerificationBadge({
  visible = true,
  className,
}: VerificationBadgeProps) {
  return (
    <div
      className={cn(
        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-opacity duration-300",
        visible ? "opacity-100" : "opacity-0",
        className,
      )}
      style={{ borderColor: t.verifiedText }}
      aria-hidden
    >
      <Check className="h-3 w-3" strokeWidth={2.5} style={{ color: t.verifiedText }} />
    </div>
  );
}

interface StatusBadgeProps {
  label: string;
  variant?: "verified" | "controls" | "stale" | "base" | "ready";
  visible?: boolean;
  className?: string;
}

export function StatusBadge({
  label,
  variant = "verified",
  visible = true,
  className,
}: StatusBadgeProps) {
  const styles =
    variant === "verified"
      ? "border border-[#E0E0DE] bg-white px-2 py-0.5 text-[#2D5A3D]"
      : variant === "controls"
        ? "rounded-sm border border-[#E8D5C4] bg-[#F5EDE4] px-1.5 py-0.5 text-[#9B6B42]"
        : variant === "stale"
          ? "rounded-sm border border-[#E8D0CA] bg-[#F5EBE8] px-1.5 py-0.5 text-[#9B5A4A]"
          : variant === "ready"
            ? "rounded-sm border border-[#E0E0DE] bg-white px-1.5 py-0.5 text-[#6B7280]"
            : "rounded-sm border border-[#E0E0DE] bg-white px-1.5 py-0.5 text-[#6B7280]";

  return (
    <span
      className={cn(
        "font-mono text-[10px] tracking-wide uppercase transition-opacity duration-300",
        styles,
        visible ? "opacity-100" : "opacity-0",
        className,
      )}
    >
      {label}
    </span>
  );
}
