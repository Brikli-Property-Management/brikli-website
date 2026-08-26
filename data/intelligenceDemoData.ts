export const RENT_EVIDENCE = [
  { id: "lease", label: "LEASE", value: "$1,850 / month", stale: false },
  { id: "amendment", label: "AMENDMENT", value: "+$75 parking", stale: false },
  { id: "pms", label: "PMS", value: "$1,790 / month", stale: true },
  { id: "rent-roll", label: "RENT ROLL", value: "$1,925 / month", stale: false },
] as const;

export const VERIFIED_RENT = {
  label: "VERIFIED CURRENT RENT",
  value: "$1,925 / month",
  formula: ["Lease", "+", "Amendment", "→", "$1,925"],
} as const;

export const LEASE_EXPIRY = {
  title: "Leases expiring",
  period: "Next 90 days",
  total: 24,
  needAction: 9,
  exposed: "$22.8K/mo exposed",
  months: [
    { month: "Sep", count: 4 },
    { month: "Oct", count: 11 },
    { month: "Nov", count: 9 },
  ],
} as const;

export const REVENUE_LEAKAGE = {
  monthly: 14820,
  annualized: 177840,
  causes: [
    { label: "Signed increases missing", amount: 6200 },
    { label: "Expired concessions", amount: 3400 },
    { label: "Missing charges", amount: 2200 },
  ],
  affected: [
    { unit: "Unit 4 · 82 King Street", amount: "$620/mo", issue: "Increase not applied" },
    { unit: "Unit 1208 · Harbourview", amount: "$340/mo", issue: "Concession expired" },
    { unit: "Unit 412 · Queen West", amount: "$220/mo", issue: "Parking charge missing" },
    { unit: "Unit 201 · Riverside", amount: "$180/mo", issue: "Utility passthrough" },
  ],
  summary: "14 units affected · 4 properties",
  footer: "Recoverable with verified rent alignment",
} as const;

export const EVIDENCE_RESOLUTION = {
  sources: ["LEASE", "PMS", "AMENDMENT", "RENT ROLL"],
  fact: "$2,450 / month",
  effective: "effective Sep 1",
  citations: ["Lease p.3", "Amendment p.1"],
  context: {
    property: "82 King Street · Unit 4",
    tenant: "Ava Chen",
  },
  breakdown: [
    { label: "Lease base", value: "$2,375" },
    { label: "Amendment", value: "+$75 parking" },
  ],
  footer: "4 sources reconciled · Ready for rules",
} as const;
