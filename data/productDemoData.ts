/** Fictional demo personas — no need to match screenshot data exactly. */
export const demoUser = {
  firstName: "Alex",
  fullName: "Alex Morgan",
  initials: "AM",
  email: "alex@harbourview.test",
  org: "Harbourview Property Group",
};

/** Consistent fictional portfolio for Ask Brikli demos. */
export const fictionalPortfolio = {
  properties: [
    "82 King Street West",
    "Harbourview Residences",
    "Queen West Lofts",
    "Riverside Apartments",
    "1250 Pine Avenue",
  ] as const,
  tenants: [
    "Ava Chen",
    "Maya Patel",
    "Marcus Lee",
    "Sofia Reyes",
    "Daniel Kim",
  ] as const,
};

/** The lease document that drives legacy document-review dev jumps. */
export const focusDocument = {
  id: "oakwood-lease-3",
  filename: "Oakwood_Unit4_Lease.pdf",
  property: "142 Oakwood Ave, Montréal",
  propertyShort: "142 Oakwood Ave...",
  tenant: "Marc Leclerc",
  landlord: "Harbourview Properties Inc.",
  unit: "Unit 4",
  rent: "1,250.00",
  termStart: "2023-04-01",
  termEnd: "2024-03-31",
  duration: "12 months",
};

export const documentScope = `@Documents: ${focusDocument.filename}`;

/** Blank Ontario residential tenancy agreement — used in all document viewers. */
export const leaseDocumentImage = "/assets/lease-blank.png";

export const navItems = [
  { id: "home", label: "Home", icon: "home" as const },
  { id: "ask", label: "Ask Brikli", icon: "sparkles" as const },
  { id: "inbox", label: "Inbox", icon: "inbox" as const },
  { id: "review", label: "Review", icon: "clipboard" as const },
  { id: "documents", label: "Documents", icon: "file" as const },
  { id: "actions", label: "Actions", icon: "zap" as const },
  { id: "reports", label: "Reports", icon: "bar-chart" as const },
];

export const initialChatItems = [
  "Summarize Q1 portfolio performance",
  "New chat",
  "@Property: Riverside Towers avg. 2-bed rents",
  "Which tenants are up for renewal this quarter?",
];

export const activeChatTitle = "What's waiting for my review?";

export type AskQuestionId =
  | "leases-action"
  | "rent-leakage"
  | "below-market"
  | "rent-increase";

export const askQuestions: {
  id: AskQuestionId;
  label: string;
  icon: "calendar" | "trending" | "bar-chart" | "file-text";
}[] = [
  {
    id: "leases-action",
    label: "Which leases need action in the next 90 days?",
    icon: "calendar",
  },
  {
    id: "rent-leakage",
    label: "Where are we losing rent revenue?",
    icon: "trending",
  },
  {
    id: "below-market",
    label: "Which units are furthest below market?",
    icon: "bar-chart",
  },
  {
    id: "rent-increase",
    label: "Prepare rent-increase notices for eligible tenants.",
    icon: "file-text",
  },
];

/** @deprecated Use askQuestions for homepage prompts. */
export const suggestedQuestions = askQuestions;

export const reviewSummary = {
  waiting: 10,
  approved: 11,
};

export type ReviewDocumentTag = {
  label: string;
  variant: "warning" | "error";
};

export type ReviewDocument = {
  id: string;
  filename: string;
  tags: ReviewDocumentTag[];
};

export const reviewDocuments: ReviewDocument[] = [
  { id: "maple-1", filename: "Maple_Unit2_Lease.pdf", tags: [{ label: "Nothing to highlight", variant: "error" }] },
  { id: "maple-2", filename: "Maple_Unit2_Lease.pdf", tags: [{ label: "Nothing to highlight", variant: "error" }] },
  {
    id: "oakwood-1",
    filename: focusDocument.filename,
    tags: [
      { label: "Unsure of a value", variant: "warning" },
      { label: "Nothing to highlight", variant: "error" },
    ],
  },
  {
    id: "oakwood-2",
    filename: focusDocument.filename,
    tags: [
      { label: "Unsure of a value", variant: "warning" },
      { label: "Nothing to highlight", variant: "error" },
    ],
  },
  {
    id: "oakwood-3",
    filename: focusDocument.filename,
    tags: [
      { label: "Unsure of a value", variant: "warning" },
      { label: "Nothing to highlight", variant: "error" },
    ],
  },
  {
    id: "oakwood-4",
    filename: focusDocument.filename,
    tags: [
      { label: "Unsure of a value", variant: "warning" },
      { label: "Nothing to highlight", variant: "error" },
    ],
  },
  {
    id: "pine-1",
    filename: "Pine_Unit1_Lease.pdf",
    tags: [
      { label: "Unsure of a value", variant: "warning" },
      { label: "Nothing to highlight", variant: "error" },
    ],
  },
  {
    id: "pine-2",
    filename: "Pine_Unit1_Lease.pdf",
    tags: [
      { label: "Unsure of a value", variant: "warning" },
      { label: "Nothing to highlight", variant: "error" },
    ],
  },
];

/** Row the cursor clicks during legacy document-preview dev jumps. */
export const focusDocumentRowId = "oakwood-3";

export const reviewExplanation = {
  paragraph:
    "You have 15 documents pending review. The queue is mostly extraction issues: ungrounded and low-confidence lease files, plus two items missing required data.",
  topItems: [
    "Maple_Unit2_Lease.pdf — 2 documents, ungrounded",
    `${focusDocument.filename} — 4 documents, low-confidence and ungrounded`,
    "Pine_Unit1_Lease.pdf — 2 documents, low-confidence and ungrounded",
    "Riverside_Tax_Assessment_2026.pdf — missing required",
    "Renewal_Tracker_Q2.xlsx — ungrounded and missing required",
  ],
  closing:
    "I can break the queue down by building or show the full pending list if you want.",
};

export const propertyTree = [
  { id: "118-maple", label: "118 Maple St, Montréal...", hasDot: true },
  { id: "220-pine", label: "220 Pine Ave, Montréal...", hasDot: true },
  { id: "305-river", label: "305 River Rd, Montréal...", hasDot: true },
  { id: "88-lake", label: "88 Lakeview Blvd, Montréal...", hasDot: true },
  {
    id: "142-oakwood",
    label: focusDocument.propertyShort,
    hasDot: true,
    expanded: true,
    children: [
      { id: "oakwood-unit", label: focusDocument.tenant, selected: true },
      { id: "oakwood-doc", label: focusDocument.filename, selected: true, isDocument: true },
      { id: "oakwood-building", label: "Building documents" },
    ],
  },
  { id: "450-sherbrooke", label: "450 Sherbrooke W, Montréal...", hasDot: false },
  { id: "210-11th", label: "210 11th Ave, New York...", hasDot: false },
];

export const extractedOverviewFields = [
  { label: "TENANT NAME", value: focusDocument.tenant, page: "p. 1" },
  { label: "PROPERTY STREET ADDRESS", value: focusDocument.property, page: "p. 1" },
  { label: "MONTHLY RENT (CAD $)", value: focusDocument.rent, page: "p. 2" },
  { label: "TERM START", value: focusDocument.termStart, page: "p. 1" },
];

export const worthChecking = [
  "low confidence landlord name",
  "ungrounded landlord name",
];

export const extractedTerms = [
  { label: "LEASE END", value: focusDocument.termEnd },
  { label: "LEASE START", value: focusDocument.termStart },
  { label: "LEASE DURATION", value: focusDocument.duration },
  { label: "MONTHLY RENT", value: focusDocument.rent },
  { label: "TENANT NAME", value: focusDocument.tenant },
  { label: "LANDLORD NAME", value: focusDocument.landlord },
];

export const groundedAnswer = {
  sentences: [
    `This lease ends on ${focusDocument.termEnd}, and the document does not show any later renewal date.`,
    `It was a ${focusDocument.duration} term starting ${focusDocument.termStart}, so on the record it expired long ago.`,
  ],
  source: focusDocument.filename,
};

export const renewalQuestion = "what is the next renewal date";

export const leaseSummaryText = `a lease for ${focusDocument.tenant}, ${focusDocument.termStart} to ${focusDocument.termEnd}, at $${focusDocument.rent} a month.`;

// ─── Ask Brikli response datasets ───────────────────────────────────────────

export type ActionQueueRow = {
  id: string;
  property: string;
  unit: string;
  tenant: string;
  expiry: string;
  daysLeft: number;
  status: string;
  statusVariant: "warning" | "error" | "neutral";
  action: string;
};

export const leasesActionResponse = {
  headline: "9 leases need action in the next 90 days",
  secondary: [
    { label: "Expire", value: 24 },
    { label: "Need action", value: 9 },
    { label: "In progress", value: 11 },
    { label: "No action", value: 4 },
  ],
  rows: [
    {
      id: "la-1",
      property: "82 King Street West",
      unit: "Unit 4",
      tenant: "Ava Chen",
      expiry: "Sep 18",
      daysLeft: 26,
      status: "Renewal workflow not started",
      statusVariant: "warning" as const,
      action: "Start renewal",
    },
    {
      id: "la-2",
      property: "Harbourview Residences",
      unit: "1208",
      tenant: "Maya Patel",
      expiry: "Oct 2",
      daysLeft: 40,
      status: "Renewal workflow not started",
      statusVariant: "warning" as const,
      action: "Start renewal",
    },
    {
      id: "la-3",
      property: "Queen West Lofts",
      unit: "305",
      tenant: "Marcus Lee",
      expiry: "Sep 30",
      daysLeft: 38,
      status: "BLOCKED",
      statusVariant: "error" as const,
      action: "Review blockers",
    },
    {
      id: "la-4",
      property: "Riverside Apartments",
      unit: "702",
      tenant: "Sofia Reyes",
      expiry: "Oct 14",
      daysLeft: 52,
      status: "Renewal workflow not started",
      statusVariant: "warning" as const,
      action: "Start renewal",
    },
    {
      id: "la-5",
      property: "1250 Pine Avenue",
      unit: "412",
      tenant: "Daniel Kim",
      expiry: "Nov 1",
      daysLeft: 70,
      status: "Renewal workflow not started",
      statusVariant: "warning" as const,
      action: "Start renewal",
    },
  ] satisfies ActionQueueRow[],
  summary: "$22,840/mo of rent reaches expiry within the next 90 days",
  sources: ["42 lease documents", "8 amendments", "Latest rent roll"],
  recommendation: "Prioritize the 9 leases without an active renewal workflow — 3 expire within 30 days.",
  ctas: ["Review 9 leases", "Prepare renewal workflows"],
};

export type LeakageBar = { label: string; amount: number; max: number };

export type LeakageRow = {
  id: string;
  property: string;
  unit: string;
  tenant: string;
  amount: number;
  sources: string[];
};

export const rentLeakageResponse = {
  headline: "Confirmed rent leakage",
  kpiMonthly: 14820,
  kpiAnnual: 177840,
  kpiSubtext: "across 12 units",
  bars: [
    { label: "Signed increases not reflected", amount: 6250, max: 6250 },
    { label: "Expired concessions", amount: 3420, max: 6250 },
    { label: "Parking / storage", amount: 2180, max: 6250 },
    { label: "Rent roll mismatches", amount: 1970, max: 6250 },
    { label: "Other", amount: 1000, max: 6250 },
  ] satisfies LeakageBar[],
  rows: [
    {
      id: "rl-1",
      property: "82 King Street West",
      unit: "Unit 4",
      tenant: "Ava Chen",
      amount: 3200,
      sources: ["Lease p.3", "Aug rent roll"],
    },
    {
      id: "rl-2",
      property: "Harbourview Residences",
      unit: "1208",
      tenant: "Maya Patel",
      amount: 2850,
      sources: ["Amendment p.1", "Aug rent roll"],
    },
    {
      id: "rl-3",
      property: "Queen West Lofts",
      unit: "305",
      tenant: "Marcus Lee",
      amount: 2100,
      sources: ["Lease p.3"],
    },
    {
      id: "rl-4",
      property: "Riverside Apartments",
      unit: "702",
      tenant: "Sofia Reyes",
      amount: 1870,
      sources: ["Aug rent roll"],
    },
  ] satisfies LeakageRow[],
  recommendation: {
    correctable: "$11,460/mo correctable without resident action",
    requiresReview: "$3,360/mo requires review",
  },
  ctas: ["Review top discrepancies", "Create correction workflows"],
};

export type MarketGapRow = {
  id: string;
  property: string;
  unit: string;
  tenant: string;
  currentRent: number;
  marketRent: number;
  gapPct: number;
  expanded?: boolean;
};

export const belowMarketResponse = {
  headline: "18 units >10% below market",
  kpiUnits: 18,
  kpiGap: 248000,
  kpiGapLabel: "Estimated market gap",
  context: "54 comparable listings · Toronto 1–2 bedroom · past 30 days",
  rows: [
    {
      id: "bm-1",
      property: "82 King Street West",
      unit: "Unit 4",
      tenant: "Ava Chen",
      currentRent: 2450,
      marketRent: 2950,
      gapPct: 17,
      expanded: true,
    },
    {
      id: "bm-2",
      property: "Harbourview Residences",
      unit: "1208",
      tenant: "Maya Patel",
      currentRent: 2100,
      marketRent: 2550,
      gapPct: 18,
    },
    {
      id: "bm-3",
      property: "Queen West Lofts",
      unit: "305",
      tenant: "Marcus Lee",
      currentRent: 1980,
      marketRent: 2400,
      gapPct: 18,
    },
    {
      id: "bm-4",
      property: "Riverside Apartments",
      unit: "702",
      tenant: "Sofia Reyes",
      currentRent: 1850,
      marketRent: 2200,
      gapPct: 16,
    },
    {
      id: "bm-5",
      property: "1250 Pine Avenue",
      unit: "412",
      tenant: "Daniel Kim",
      currentRent: 1720,
      marketRent: 2050,
      gapPct: 16,
    },
  ] satisfies MarketGapRow[],
  comparables: {
    count: 12,
    median: 2950,
    range: "$2,750 – $3,180",
    chips: ["80 King St W", "88 King St W", "101 King St W"],
  },
  caveat: "Market gap ≠ immediately executable increase",
  actionable: "$94K actionable",
  ctas: ["Open market analysis", "Model rent strategy"],
};

export type DraftRow = {
  id: string;
  property: string;
  unit: string;
  tenant: string;
  form: string;
  currentRent: number;
  proposedRent: number;
  blocked?: boolean;
  blockReason?: string;
};

export const rentIncreaseResponse = {
  processingSteps: [
    "Checking tenancies",
    "Resolving current rents",
    "Checking eligibility",
    "Preparing drafts",
  ],
  headline: "22 rent-increase notices ready",
  kpiReady: 22,
  stats: [
    { label: "Checked", value: 31 },
    { label: "Eligible", value: 22 },
    { label: "Blocked", value: 5 },
    { label: "Not due", value: 4 },
  ],
  forms: [
    { region: "Ontario", form: "14 N1 notices", count: 14 },
    { region: "Québec", form: "8 TAL-806A notices", count: 8 },
  ],
  drafts: [
    {
      id: "ri-1",
      property: "82 King Street West",
      unit: "Unit 4",
      tenant: "Ava Chen",
      form: "Ontario N1",
      currentRent: 2450,
      proposedRent: 2590,
    },
    {
      id: "ri-2",
      property: "Harbourview Residences",
      unit: "1208",
      tenant: "Maya Patel",
      form: "Ontario N1",
      currentRent: 2100,
      proposedRent: 2210,
    },
    {
      id: "ri-3",
      property: "1250 Pine Avenue",
      unit: "412",
      tenant: "Daniel Kim",
      form: "Ontario N1",
      currentRent: 1720,
      proposedRent: 1810,
    },
    {
      id: "ri-4",
      property: "Queen West Lofts",
      unit: "305",
      tenant: "Marcus Lee",
      form: "Ontario N1",
      currentRent: 1980,
      proposedRent: 0,
      blocked: true,
      blockReason: "Increase within 12 months of last notice",
    },
  ] satisfies DraftRow[],
  summary: "22 drafts prepared · 5 require review · no notices delivered",
  ctas: ["Review 22 drafts", "Open blocked tenancies"],
};

export function getAskQuestionLabel(id: AskQuestionId): string {
  return askQuestions.find((q) => q.id === id)?.label ?? "";
}

export function getAskResponseData(id: AskQuestionId) {
  switch (id) {
    case "leases-action":
      return leasesActionResponse;
    case "rent-leakage":
      return rentLeakageResponse;
    case "below-market":
      return belowMarketResponse;
    case "rent-increase":
      return rentIncreaseResponse;
  }
}
