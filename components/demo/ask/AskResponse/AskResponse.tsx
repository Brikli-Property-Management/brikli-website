"use client";

import type { AskQuestionId } from "@/data/productDemoData";
import {
  belowMarketResponse,
  leasesActionResponse,
  rentIncreaseResponse,
  rentLeakageResponse,
} from "@/data/productDemoData";
import { ActionQueue } from "@/components/demo/ask/AskResponse/ActionQueue";
import { askRevealClass } from "@/components/demo/ask/AskResponse/askRevealClass";
import { CTA } from "@/components/demo/ask/AskResponse/CTA";
import { DraftRows } from "@/components/demo/ask/AskResponse/DraftRows";
import { EvidenceChips } from "@/components/demo/ask/AskResponse/EvidenceChips";
import { KPISummary } from "@/components/demo/ask/AskResponse/KPISummary";
import { LeakageBreakdown } from "@/components/demo/ask/AskResponse/LeakageBreakdown";
import { MarketGapRows } from "@/components/demo/ask/AskResponse/MarketGapRows";
import { RecommendedAction } from "@/components/demo/ask/AskResponse/RecommendedAction";
import { ResponseHeader } from "@/components/demo/ask/AskResponse/ResponseHeader";
import { cn } from "@/lib/utils";

type AskResponseProps = {
  questionId: AskQuestionId;
  revealed?: boolean;
};

function LeasesActionResponse({ revealed }: { revealed: boolean }) {
  const data = leasesActionResponse;
  return (
    <div
      className={cn("ask-response space-y-3", revealed && "ask-response-revealed")}
      data-question="leases-action"
    >
      <ResponseHeader revealed={revealed} />
      <KPISummary
        revealed={revealed}
        headline={data.headline}
        secondary={data.secondary}
      />
      <ActionQueue rows={data.rows} revealed={revealed} />
      <p className={cn("ask-summary text-[12px] font-medium text-brikli-green", askRevealClass(revealed))}>
        {data.summary}
      </p>
      <EvidenceChips sources={data.sources} revealed={revealed} />
      <RecommendedAction revealed={revealed}>{data.recommendation}</RecommendedAction>
      <CTA actions={data.ctas} revealed={revealed} />
    </div>
  );
}

function RentLeakageResponse({ revealed }: { revealed: boolean }) {
  const data = rentLeakageResponse;
  return (
    <div
      className={cn("ask-response space-y-3", revealed && "ask-response-revealed")}
      data-question="rent-leakage"
    >
      <ResponseHeader revealed={revealed} />
      <KPISummary
        revealed={revealed}
        headline={data.headline}
        kpiValue={data.kpiMonthly}
        kpiPrefix="$"
        kpiSuffix="/mo"
        kpiSubtext={`$${data.kpiAnnual.toLocaleString()} annualized · ${data.kpiSubtext}`}
      />
      <LeakageBreakdown bars={data.bars} rows={data.rows} revealed={revealed} />
      <RecommendedAction revealed={revealed}>
        <p>{data.recommendation.correctable}</p>
        <p className="mt-1 text-brikli-green/70">{data.recommendation.requiresReview}</p>
      </RecommendedAction>
      <CTA actions={data.ctas} revealed={revealed} />
    </div>
  );
}

function BelowMarketResponse({ revealed }: { revealed: boolean }) {
  const data = belowMarketResponse;
  return (
    <div
      className={cn("ask-response space-y-3", revealed && "ask-response-revealed")}
      data-question="below-market"
    >
      <ResponseHeader revealed={revealed} />
      <KPISummary
        revealed={revealed}
        headline={data.headline}
        kpiValue={data.kpiGap}
        kpiPrefix="$"
        kpiSuffix=""
        kpiSubtext={`${data.kpiGapLabel} · ${data.context}`}
      />
      <MarketGapRows
        rows={data.rows}
        comparables={data.comparables}
        caveat={data.caveat}
        actionable={data.actionable}
        revealed={revealed}
      />
      <CTA actions={data.ctas} revealed={revealed} />
    </div>
  );
}

function RentIncreaseResponse({ revealed }: { revealed: boolean }) {
  const data = rentIncreaseResponse;
  return (
    <div
      className={cn("ask-response space-y-3", revealed && "ask-response-revealed")}
      data-question="rent-increase"
    >
      <ResponseHeader revealed={revealed} />
      <KPISummary
        revealed={revealed}
        headline={data.headline}
        kpiValue={data.kpiReady}
        kpiSubtext={data.summary}
      />
      <DraftRows drafts={data.drafts} forms={data.forms} stats={data.stats} revealed={revealed} />
      <CTA actions={data.ctas} revealed={revealed} />
    </div>
  );
}

export function AskResponse({ questionId, revealed = false }: AskResponseProps) {
  switch (questionId) {
    case "leases-action":
      return <LeasesActionResponse revealed={revealed} />;
    case "rent-leakage":
      return <RentLeakageResponse revealed={revealed} />;
    case "below-market":
      return <BelowMarketResponse revealed={revealed} />;
    case "rent-increase":
      return <RentIncreaseResponse revealed={revealed} />;
  }
}
