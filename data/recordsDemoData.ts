export const INGESTION_DOCUMENTS = [
  { id: "d1", filename: "82_King_Lease.pdf", origin: "left" as const, type: "Lease" },
  { id: "d2", filename: "Parking_Addendum.pdf", origin: "right" as const, type: "Amendment" },
  { id: "d3", filename: "Rent_Roll_August.xlsx", origin: "top" as const, type: "Rent roll" },
  { id: "d4", filename: "Renewal_Offer.pdf", origin: "bottom" as const, type: "Notice" },
  { id: "d5", filename: "Insurance_Certificate.pdf", origin: "left" as const, type: "Insurance" },
] as const;

export const INGESTION_MATCHES = [
  { doc: "82_King_Lease.pdf", property: "82 King Street · Unit 4", tenant: "Ava Chen" },
  { doc: "Parking_Addendum.pdf", property: "82 King Street · Unit 4", tenant: "Ava Chen" },
  { doc: "Rent_Roll_August.xlsx", property: "Portfolio · August", tenant: "31 tenancies" },
  { doc: "Renewal_Offer.pdf", property: "Harbourview · Unit 1208", tenant: "Maya Patel" },
  { doc: "Insurance_Certificate.pdf", property: "82 King Street", tenant: "Building record" },
] as const;

export const INGESTION_PIPELINE = [
  "CLASSIFYING",
  "EXTRACTING",
  "MATCHING",
  "VERIFIED",
] as const;

export const PROPERTY_TREE = [
  {
    property: "82 King Street",
    unit: "Unit 4",
    tenant: "Ava Chen",
    documents: ["Lease.pdf", "Parking Addendum.pdf"],
  },
  {
    property: "Harbourview Residences",
    unit: "Unit 1208",
    tenant: "Maya Patel",
    documents: ["Renewal.pdf"],
  },
] as const;

export const EXTRACTION_FIELDS = [
  { id: "tenant", label: "Tenant", value: "Ava Chen", source: "Lease p.1" },
  { id: "rent", label: "Rent", value: "$2,450", source: "Lease p.3" },
  { id: "end", label: "Lease end", value: "Aug 31, 2027", source: "Lease p.2" },
  { id: "parking", label: "Parking", value: "1 underground space", source: "Amendment p.1" },
] as const;

export const TENANCY_TIMELINE = [
  { year: "2024", event: "Original lease", superseded: false },
  { year: "2025", event: "Parking amendment", superseded: false },
  { year: "2026", event: "Rent increase", superseded: true },
  { year: "2027", event: "Renewal", superseded: false },
] as const;
