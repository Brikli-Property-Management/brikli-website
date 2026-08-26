import type { PlatformPillarId } from "@/components/platform/types";

/** Shared fictional Brikli universe — keep consistent across all pillars. */
export const PLATFORM_PROPERTIES = [
  "82 King Street",
  "Harbourview Residences",
  "Queen West Lofts",
  "1250 Pine Avenue",
  "Riverside Apartments",
] as const;

export const PLATFORM_TENANTS = [
  "Ava Chen",
  "Maya Patel",
  "Marcus Lee",
  "Daniel Kim",
  "Sofia Reyes",
] as const;

export type PlatformProperty = (typeof PLATFORM_PROPERTIES)[number];
export type PlatformTenant = (typeof PLATFORM_TENANTS)[number];

export const PLATFORM_DOCUMENTS = [
  { id: "doc-lease", filename: "82_King_Lease.pdf", type: "lease" as const },
  { id: "doc-parking", filename: "Parking_Addendum.pdf", type: "amendment" as const },
  { id: "doc-rent-roll", filename: "Rent_Roll_August.xlsx", type: "rent_roll" as const },
  { id: "doc-renewal", filename: "Renewal_Offer.pdf", type: "notice" as const },
  { id: "doc-insurance", filename: "Insurance_Certificate.pdf", type: "insurance" as const },
] as const;

export const PLATFORM_PILLARS: Record<
  PlatformPillarId,
  {
    number: string;
    title: string;
    subtitle: string;
    description: string;
    sceneLabels: [string, string, string, string];
  }
> = {
  records: {
    number: "01",
    title: "Records",
    subtitle: "Ingest the complete tenancy",
    description:
      "Brikli unifies leases, amendments, notices, rent rolls, emails, invoices, insurance documents, and property records into a verified property and tenancy history.",
    sceneLabels: [
      "Document ingestion",
      "Property integration",
      "Extraction grounding",
      "Tenancy history",
    ],
  },
  intelligence: {
    number: "02",
    title: "Intelligence",
    subtitle: "Determine what is true",
    description:
      "Brikli reconciles evidence from leases, amendments, rent rolls, and PMS systems to determine verified operating facts for your portfolio.",
    sceneLabels: [
      "Rent reconciliation",
      "Lease expiry intelligence",
      "Revenue leakage",
      "Evidence resolution",
    ],
  },
  rules: {
    number: "03",
    title: "Rules",
    subtitle: "Determine what can happen",
    description:
      "Brikli combines verified portfolio facts with jurisdiction, timing, and eligibility to determine what actions are supported.",
    sceneLabels: [
      "Eligibility engine",
      "Rule path",
      "Portfolio eligibility",
      "Rules updated",
    ],
  },
  execution: {
    number: "04",
    title: "Execution",
    subtitle: "Move the work forward",
    description:
      "Brikli turns intelligence into workflow — generating notices, routing approvals, and maintaining a complete audit trail.",
    sceneLabels: [
      "Notice generation",
      "Approval queue",
      "Workflow movement",
      "Audit trail",
    ],
  },
};

export const PLATFORM_EXTRACTION_FIELDS = [
  { label: "Tenant", value: "Ava Chen", source: "Lease p.1" },
  { label: "Rent", value: "$2,450", source: "Lease p.3" },
  { label: "Lease end", value: "Aug 31, 2027", source: "Lease p.2" },
  { label: "Parking", value: "1 underground space", source: "Amendment p.1" },
] as const;

export const PLATFORM_EVIDENCE_SOURCES = [
  { id: "lease", label: "LEASE", value: "$1,850 / month" },
  { id: "amendment", label: "AMENDMENT", value: "+$75 parking" },
  { id: "pms", label: "PMS", value: "$1,790 / month", stale: true },
  { id: "rent-roll", label: "RENT ROLL", value: "$1,925 / month" },
] as const;

export const PLATFORM_TENANCY_TIMELINE = [
  { year: "2024", event: "Original lease" },
  { year: "2025", event: "Parking amendment" },
  { year: "2026", event: "Rent increase" },
  { year: "2027", event: "Renewal" },
] as const;
