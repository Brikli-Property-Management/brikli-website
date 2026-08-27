export type ReviewTag = {
  label: string;
  variant: "source" | "status";
};

export type ReviewItem = {
  id: string;
  title: string;
  property: string;
  description: string;
  tags: ReviewTag[];
};

export type KpiMetric = {
  id: string;
  label: string;
  value: string;
  animated?: boolean;
};

export type UpcomingEvent = {
  id: string;
  date: string;
  title: string;
  subtitle: string;
};

export const INITIAL_NEEDS_REVIEW_COUNT = 13;

export const kpiMetrics: KpiMetric[] = [
  { id: "recoverable", label: "Portfolio · Recoverable Increase", value: "$804" },
  { id: "revenue", label: "Portfolio · Revenue at Risk", value: "$125K" },
  {
    id: "needs-review",
    label: "Portfolio · Needs Review",
    value: "13",
    animated: true,
  },
  { id: "properties", label: "Portfolio · Properties", value: "5" },
];

export const initialReviewItems: ReviewItem[] = [
  {
    id: "rent-mismatch",
    title: "Unit 2 rent mismatch",
    property: "244 Notre-Dame-des-Anges · Unit 2",
    description: "Lease says $700/mo; rent roll says $725/mo.",
    tags: [
      { label: "Lease p.3", variant: "source" },
      { label: "Rent Roll row 2", variant: "source" },
    ],
  },
  {
    id: "numbering-conflict",
    title: "Unit 4/5 numbering conflict",
    property: "244 Notre-Dame-des-Anges · Unit 4",
    description: "Two signed leases point to Apt 4.",
    tags: [
      { label: "Lahey p.1", variant: "source" },
      { label: "Vautour p.1", variant: "source" },
    ],
  },
  {
    id: "missing-lease",
    title: "Missing signed lease",
    property: "244 Notre-Dame-des-Anges · Unit 5",
    description: "Unsigned copy detected; request the executed lease.",
    tags: [{ label: "Extraction gate", variant: "status" }],
  },
  {
    id: "shared-phone",
    title: "Shared tenant phone",
    property: "244 Notre-Dame-des-Anges · Unit 1",
    description: "Same phone number appears on two tenant records.",
    tags: [
      { label: "Perron p.1", variant: "source" },
      { label: "Harel p.1", variant: "source" },
    ],
  },
];

export const upcomingEvents: UpcomingEvent[] = [
  {
    id: "rent-roll",
    date: "Jul 3",
    title: "Rent-roll reconciliation",
    subtitle: "244 NDA · Unit 2",
  },
  {
    id: "renewal",
    date: "Jul 8",
    title: "Renewal notices",
    subtitle: "3 drafts ready",
  },
  {
    id: "insurance",
    date: "Jul 14",
    title: "Insurance certificate due",
    subtitle: "248 NDA",
  },
];

export const chatItems = [
  "@Property: 750-754 St-Joseph Est...",
  "what are comparable 1-bedroom rents...",
  "Copy of 244-4.pdf",
];

export const navItems = [
  { id: "home", label: "Home", icon: "home" as const, active: true },
  { id: "ask", label: "Ask Brikli", icon: "sparkles" as const },
  { id: "inbox", label: "Inbox", icon: "inbox" as const },
  { id: "review", label: "Review", icon: "clipboard" as const },
  { id: "documents", label: "Documents", icon: "file" as const },
  { id: "actions", label: "Actions", icon: "zap" as const },
  { id: "reports", label: "Reports", icon: "bar-chart" as const },
];
