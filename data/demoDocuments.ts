export type DocumentType = "PDF" | "XLSX" | "DOCX" | "PNG" | "JPG";

export type DashboardDocument = {
  id: string;
  name: string;
  category: string;
  unit: string;
  added: string;
  status: "review" | "approved" | "flagged";
};

export type UploadFile = {
  id: string;
  fileName: string;
  displayName: string;
  type: DocumentType;
  size: string;
  /** Internal slug used during drag animation */
  slug: string;
};

export type ProcessingStatus =
  | "pending"
  | "uploading"
  | "classifying"
  | "extracting"
  | "matching"
  | "ready";

export type ProcessingFile = UploadFile & {
  status: ProcessingStatus;
  progress: number;
  badges: string[];
};

export type GroundingField = {
  id: string;
  label: string;
  value: string;
  page: number;
  confidence: number;
  needsReview?: boolean;
};

/** Existing documents shown on the dashboard at start */
export const DASHBOARD_DOCUMENTS: DashboardDocument[] = [
  {
    id: "d1",
    name: "Harbourview Lease Renewal.pdf",
    category: "LEASE — ONTARIO",
    unit: "Unit 1208",
    added: "12d",
    status: "review",
  },
  {
    id: "d2",
    name: "82 King Street Lease.pdf",
    category: "LEASE — NEW YORK",
    unit: "—",
    added: "19d",
    status: "review",
  },
  {
    id: "d3",
    name: "Mayfair Tenant Amendment.pdf",
    category: "AMENDMENT",
    unit: "Unit 302",
    added: "8d",
    status: "review",
  },
  {
    id: "d4",
    name: "Riverside Rent Roll.xlsx",
    category: "RENT ROLL",
    unit: "—",
    added: "5d",
    status: "approved",
  },
  {
    id: "d5",
    name: "Westmount Notice.pdf",
    category: "NOTICE",
    unit: "Unit 12B",
    added: "3d",
    status: "approved",
  },
  {
    id: "d6",
    name: "Cedar Lane Insurance Certificate.pdf",
    category: "INSURANCE",
    unit: "—",
    added: "14d",
    status: "approved",
  },
  {
    id: "d7",
    name: "Northgate Parking Agreement.pdf",
    category: "LEASE — CALIFORNIA",
    unit: "Unit P-04",
    added: "11d",
    status: "review",
  },
  {
    id: "d8",
    name: "Oakwood Sublease.pdf",
    category: "SUBLEASE",
    unit: "Unit 210",
    added: "9d",
    status: "approved",
  },
  {
    id: "d9",
    name: "Summit Tower Lease Abstract.pdf",
    category: "LEASE — USA",
    unit: "Unit 1801",
    added: "7d",
    status: "review",
  },
  {
    id: "d10",
    name: "Parkview Estoppel Certificate.pdf",
    category: "ESTOPPEL",
    unit: "Unit 405",
    added: "6d",
    status: "approved",
  },
  {
    id: "d11",
    name: "Lakeside SNDA.pdf",
    category: "SNDA",
    unit: "—",
    added: "4d",
    status: "review",
  },
  {
    id: "d12",
    name: "Brookfield Operating Statement.xlsx",
    category: "FINANCIAL",
    unit: "—",
    added: "2d",
    status: "approved",
  },
  {
    id: "d13",
    name: "Granville Notice to Vacate.pdf",
    category: "NOTICE",
    unit: "Unit 7A",
    added: "1d",
    status: "review",
  },
  {
    id: "d14",
    name: "Bayview Tenant Ledger.pdf",
    category: "LEDGER",
    unit: "Unit 512",
    added: "1d",
    status: "approved",
  },
  {
    id: "d15",
    name: "Highland Centre Amendment.pdf",
    category: "AMENDMENT",
    unit: "Unit 903",
    added: "18h",
    status: "review",
  },
  {
    id: "d16",
    name: "Maple Court Lease Agreement.pdf",
    category: "LEASE — ONTARIO",
    unit: "Unit 14",
    added: "6h",
    status: "approved",
  },
  {
    id: "d17",
    name: "Riverside Property Tax Bill.pdf",
    category: "TAX",
    unit: "—",
    added: "3h",
    status: "review",
  },
  {
    id: "d18",
    name: "West End Rent Roll Q3.xlsx",
    category: "RENT ROLL",
    unit: "—",
    added: "1h",
    status: "approved",
  },
];

/** Files dragged into the upload modal — edit this array to change file count */
export const UPLOAD_FILES: UploadFile[] = [
  {
    id: "uf1",
    slug: "82_King_Lease.pdf",
    fileName: "82 King Street Lease.pdf",
    displayName: "82 King Street Lease.pdf",
    type: "PDF",
    size: "2.8 MB",
  },
  {
    id: "uf2",
    slug: "Harbourview_Renewal.pdf",
    fileName: "Harbourview Renewal.pdf",
    displayName: "Harbourview Renewal.pdf",
    type: "PDF",
    size: "1.6 MB",
  },
  {
    id: "uf3",
    slug: "Tenant_Amendment_Ava_Chen.pdf",
    fileName: "Tenant Amendment — Ava Chen.pdf",
    displayName: "Tenant Amendment — Ava Chen.pdf",
    type: "PDF",
    size: "940 KB",
  },
  {
    id: "uf4",
    slug: "Riverside_Rent_Roll.xlsx",
    fileName: "Riverside Rent Roll.xlsx",
    displayName: "Riverside Rent Roll.xlsx",
    type: "XLSX",
    size: "1.4 MB",
  },
  {
    id: "uf5",
    slug: "Queen_West_N1_Notice.pdf",
    fileName: "Queen West N1 Notice.pdf",
    displayName: "Queen West N1 Notice.pdf",
    type: "PDF",
    size: "620 KB",
  },
  {
    id: "uf6",
    slug: "Maintenance_Agreement.pdf",
    fileName: "Maintenance Agreement.pdf",
    displayName: "Maintenance Agreement.pdf",
    type: "PDF",
    size: "1.1 MB",
  },
  {
    id: "uf7",
    slug: "Parking_Addendum.pdf",
    fileName: "Parking Addendum.pdf",
    displayName: "Parking Addendum.pdf",
    type: "PDF",
    size: "820 KB",
  },
];

export const PROCESSING_SEQUENCE: Record<
  string,
  { badges: string[]; progressSteps: number[] }
> = {
  uf1: {
    badges: ["Lease detected", "18 fields extracted", "Matched to 82 King Street"],
    progressSteps: [20, 45, 72, 100],
  },
  uf2: {
    badges: ["Renewal detected", "12 fields extracted", "Matched to Harbourview Residences"],
    progressSteps: [15, 38, 65, 100],
  },
  uf3: {
    badges: ["Amendment detected", "Related lease found", "Tenant matched"],
    progressSteps: [25, 50, 78, 100],
  },
  uf4: {
    badges: ["Rent roll detected", "46 units parsed", "Portfolio updated"],
    progressSteps: [18, 42, 70, 100],
  },
  uf5: {
    badges: ["Notice detected", "Tenant matched", "Matched to Queen West Lofts"],
    progressSteps: [22, 48, 75, 100],
  },
  uf6: {
    badges: ["Agreement detected", "Vendor matched", "Property linked"],
    progressSteps: [20, 44, 68, 100],
  },
  uf7: {
    badges: ["Addendum detected", "Related lease found", "Tenant matched"],
    progressSteps: [24, 52, 80, 100],
  },
};

export function createInitialProcessingFiles(): ProcessingFile[] {
  return UPLOAD_FILES.map((file) => ({
    ...file,
    status: "pending" as ProcessingStatus,
    progress: 0,
    badges: [],
  }));
}

/** Document opened in the review viewer after processing */
export const FOCUS_DOCUMENT_ID = "uf1";
export const FOCUS_DOCUMENT_NAME = "82 King Street Lease.pdf";

/** Grounding sequence — edit order and fields here */
export const GROUNDING_FIELDS: GroundingField[] = [
  {
    id: "tenant",
    label: "TENANT NAME",
    value: "Ava Chen",
    page: 1,
    confidence: 98,
  },
  {
    id: "address",
    label: "PROPERTY ADDRESS",
    value: "82 King Street West, Unit 4",
    page: 1,
    confidence: 97,
  },
  {
    id: "landlord",
    label: "LANDLORD",
    value: "Northstar Property Management Inc.",
    page: 1,
    confidence: 96,
  },
  {
    id: "rent",
    label: "MONTHLY RENT",
    value: "$2,450.00",
    page: 2,
    confidence: 99,
  },
  {
    id: "start",
    label: "LEASE START",
    value: "September 1, 2026",
    page: 1,
    confidence: 95,
  },
  {
    id: "end",
    label: "LEASE END",
    value: "August 31, 2027",
    page: 1,
    confidence: 94,
  },
  {
    id: "parking",
    label: "PARKING",
    value: "1 underground space",
    page: 2,
    confidence: 87,
    needsReview: true,
  },
];

export const STATUS_COUNTS = {
  review: 12,
  flagged: 0,
  approved: 24,
} as const;

export const PROCESSING_SUMMARY = {
  total: UPLOAD_FILES.length,
  ready: UPLOAD_FILES.length - 1,
  needsReview: 1,
} as const;
