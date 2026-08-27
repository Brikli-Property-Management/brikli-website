"use client";

import { askRevealClass } from "@/components/demo/ask/AskResponse/askRevealClass";

type SecondaryKPI = { label: string; value: number | string };

type KPISummaryProps = {
  headline: string;
  headlineClassName?: string;
  kpiValue?: number | string;
  kpiPrefix?: string;
  kpiSuffix?: string;
  kpiSubtext?: string;
  secondary?: SecondaryKPI[];
  formatValue?: (n: number) => string;
  revealed?: boolean;
};

export function KPISummary({
  headline,
  headlineClassName = "",
  kpiValue,
  kpiPrefix = "",
  kpiSuffix = "",
  kpiSubtext,
  secondary,
  formatValue = (n) => n.toLocaleString(),
  revealed = false,
}: KPISummaryProps) {
  const revealClass = askRevealClass(revealed);

  return (
    <div className="ask-kpi-block space-y-2">
      <p
        className={`ask-kpi-headline text-[15px] font-semibold text-brikli-green ${revealClass} ${headlineClassName}`}
      >
        {headline}
      </p>
      {kpiValue !== undefined && (
        <p className={`ask-kpi-value text-[22px] font-semibold tracking-tight text-brikli-green ${revealClass}`}>
          {kpiPrefix}
          <span data-kpi-target={typeof kpiValue === "number" ? kpiValue : undefined}>
            {typeof kpiValue === "number" ? formatValue(kpiValue) : kpiValue}
          </span>
          {kpiSuffix}
        </p>
      )}
      {kpiSubtext && (
        <p className={`ask-kpi-subtext text-[12px] text-brikli-green/70 ${revealClass}`}>{kpiSubtext}</p>
      )}
      {secondary && secondary.length > 0 && (
        <div className={`ask-kpi-secondary flex flex-wrap gap-2 ${revealClass}`}>
          {secondary.map((item) => (
            <span
              key={item.label}
              className="rounded-md border border-[#E8E8E6] bg-white px-2.5 py-1 text-[11px] text-brikli-green"
            >
              <span className="font-semibold">{item.value}</span> {item.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
