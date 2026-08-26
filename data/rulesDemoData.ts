export const ELIGIBILITY_ROWS = [
  { label: "Verified rent", value: "$1,925" },
  { label: "Jurisdiction", value: "Ontario" },
  { label: "Notice window", value: "Open" },
  { label: "Previous increase", value: "12 months ago" },
] as const;

export const RULE_PATH = [
  "Ontario",
  "Rent regulated",
  "N1 eligible",
  "90-day notice",
  "Earliest effective date",
] as const;

export const RULE_PATH_RESULT = "Sep 1";

export const PORTFOLIO_ELIGIBILITY = {
  checked: 31,
  eligible: 22,
  blocked: 5,
  notDue: 4,
  blockers: [
    { label: "Missing evidence", count: 2, max: 5 },
    { label: "Current rent conflict", count: 2, max: 5 },
    { label: "Timing", count: 1, max: 5 },
  ],
  blockedTenancies: [
    { unit: "Unit 412", property: "82 King Street", reason: "Missing evidence" },
    { unit: "Unit 8", property: "Harbourview Residences", reason: "Rent conflict" },
    { unit: "Unit 201", property: "Queen West Lofts", reason: "Timing" },
    { unit: "Unit 305", property: "1250 Pine Avenue", reason: "Missing evidence" },
    { unit: "Unit 102", property: "Riverside Apartments", reason: "Rent conflict" },
  ],
  readyToAction: 18,
} as const;

export const RULE_VERSIONS = [
  { jurisdiction: "Ontario RTA", version: "2026 ruleset", tenancies: 89, current: true },
  { jurisdiction: "Québec TAL", version: "2026 ruleset", tenancies: 34, current: true },
  { jurisdiction: "BC RTA", version: "2026 ruleset", tenancies: 12, current: true },
] as const;

export const RULE_UPDATES = [
  { jurisdiction: "Ontario RTA", change: "Notice period clarified", date: "Jan 2026" },
  { jurisdiction: "Québec TAL", change: "Rent cap threshold updated", date: "Jan 2026" },
] as const;

export const RULES_EVALUATED = 143;
