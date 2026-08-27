export const pipelineSteps = [
  "INGESTING",
  "MATCHING",
  "RECONCILING",
  "VERIFYING",
] as const;

export type FileType = "PDF" | "MSG" | "XLS";

export interface SourceRecord {
  id: string;
  type: FileType;
  name: string;
  description: string;
}

export const sourceRecords: SourceRecord[] = [
  {
    id: "lease",
    type: "PDF",
    name: "Lease_1250Pine_U412.pdf",
    description: "Residential lease · 12 pages",
  },
  {
    id: "amendment",
    type: "MSG",
    name: "RE: parking amendment",
    description: "Email attachment · Nov 2024",
  },
  {
    id: "rentroll",
    type: "XLS",
    name: "Portfolio_RentRoll_Q3.xlsx",
    description: "1,520 tenancies · PMS export",
  },
  {
    id: "n4",
    type: "PDF",
    name: "N4_Notice_History_U3F.pdf",
    description: "Prior notice · served Mar 2025",
  },
];

export const recordsMetrics = [
  { value: 1438, label: "MATCHED AUTOMATICALLY" },
  { value: 62, label: "REQUIRE REVIEW" },
  { value: 20, label: "MISSING CONTROLLING DOCUMENT" },
] as const;

export const intelligenceCards = [
  {
    id: "lease",
    label: "LEASE · MAR 2023",
    value: "$1,850 / mo",
    subtext: "Signed instrument · page 3",
    badge: "BASE" as const,
    border: "default" as const,
  },
  {
    id: "amendment",
    label: "AMENDMENT · NOV 2024",
    value: "+$75 parking",
    subtext: "Later signed document supersedes original",
    badge: "CONTROLS" as const,
    border: "copper" as const,
  },
  {
    id: "pms",
    label: "PMS RECORD",
    value: "$1,790 / mo",
    subtext: "Never updated after 2023 move-in",
    badge: "STALE" as const,
    border: "stale" as const,
  },
  {
    id: "jurisdiction",
    label: "JURISDICTION · ONTARIO",
    value: "N1 eligible",
    subtext: "Notice window and current form resolved",
    badge: null,
    border: "default" as const,
  },
] as const;

export const verifiedOperatingFact = {
  value: "$1,925 / month",
  subtext:
    "Lease p.3 + Amendment p.1 · PMS correction prepared · $135/mo uncaptured",
};

export const rulesRows = [
  {
    id: "tenancy",
    label: "Tenancy",
    value: "Unit 412 · 1250 Pine Ave · Ontario",
  },
  {
    id: "rent",
    label: "Verified rent",
    value: "$1,925 / month · 2 source documents",
  },
  {
    id: "jurisdiction",
    label: "Jurisdiction",
    value: "Ontario RTA · current guideline · N1 required",
  },
  {
    id: "notice",
    label: "Notice window",
    value: "90 days before Sep 1 · prepared Jun 3",
  },
  {
    id: "previous",
    label: "Previous increase",
    value: "12 months ago · no open dispute",
  },
] as const;

export const actionDetermined = {
  title: "N1 notice · $1,973.13 effective Sep 1",
  subtext: "All eligibility conditions met · reasoning available for review",
};

export const executionFields = [
  { label: "Tenant", value: "M. Chen" },
  { label: "Address", value: "Unit 412, 1250 Pine Ave" },
  { label: "Current rent", value: "$1,925.00 / month" },
  { label: "New rent", value: "$1,973.13 / month" },
  { label: "Effective", value: "September 1" },
  { label: "Evidence", value: "Lease p.3 · Amendment p.1" },
] as const;

export const activityLog = [
  {
    time: "09:02",
    text: "Verified rent $1,925 from lease + amendment",
    highlights: ["$1,925"],
  },
  {
    time: "09:02",
    text: "N1 drafted · current Ontario guideline applied to verified base",
    highlights: ["N1"],
  },
  {
    time: "09:04",
    text: "Awaiting approval · B. Nowak notified",
    highlights: ["B. Nowak"],
  },
] as const;
