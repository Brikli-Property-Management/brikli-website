export type TreeDocument = {
  id: string;
  name: string;
};

export type TreeTenant = {
  id: string;
  name: string;
  documents: TreeDocument[];
};

export type TreeUnit = {
  id: string;
  label: string;
  tenant?: TreeTenant;
  folders?: { id: string; label: string; documents: TreeDocument[] }[];
};

export type TreeProperty = {
  id: string;
  name: string;
  units: TreeUnit[];
  buildingDocuments?: TreeDocument[];
};

/** Properties visible at demo start — uploaded docs are NOT here yet */
export const INITIAL_PROPERTIES: TreeProperty[] = [
  {
    id: "cedar-lane",
    name: "Cedar Lane Townhomes",
    units: [],
    buildingDocuments: [
      { id: "bd1", name: "Insurance Policy 2025.pdf" },
      { id: "bd2", name: "Annual Inspection Report.pdf" },
    ],
  },
  {
    id: "maple-court",
    name: "Maple Court",
    units: [
      {
        id: "mc-u2",
        label: "Unit 2",
        tenant: {
          id: "mc-t1",
          name: "Jordan Ellis",
          documents: [{ id: "mc-d1", name: "Move-in Checklist.pdf" }],
        },
      },
    ],
  },
  {
    id: "west-end",
    name: "West End Commons",
    units: [
      {
        id: "we-u5",
        label: "Unit 5",
        tenant: {
          id: "we-t1",
          name: "Priya Sharma",
          documents: [{ id: "we-d1", name: "Pet Addendum.pdf" }],
        },
      },
    ],
  },
];

/** Nodes integrated during upload processing — order matters for animation */
export type IntegrationEvent = {
  id: string;
  propertyId: string;
  propertyName: string;
  unitId: string;
  unitLabel: string;
  tenantId: string;
  tenantName: string;
  documentId: string;
  documentName: string;
  /** Full animated sequence (expand property → unit → tenant → doc) */
  animated: boolean;
};

export const INTEGRATION_EVENTS: IntegrationEvent[] = [
  {
    id: "int1",
    propertyId: "82-king",
    propertyName: "82 King Street",
    unitId: "82k-u4",
    unitLabel: "Unit 4",
    tenantId: "82k-t1",
    tenantName: "Ava Chen",
    documentId: "uf1",
    documentName: "82 King Street Lease.pdf",
    animated: true,
  },
  {
    id: "int2",
    propertyId: "82-king",
    propertyName: "82 King Street",
    unitId: "82k-u4",
    unitLabel: "Unit 4",
    tenantId: "82k-t1",
    tenantName: "Ava Chen",
    documentId: "uf7",
    documentName: "Parking Addendum.pdf",
    animated: true,
  },
  {
    id: "int3",
    propertyId: "harbourview",
    propertyName: "Harbourview Residences",
    unitId: "hv-u1208",
    unitLabel: "Unit 1208",
    tenantId: "hv-t1",
    tenantName: "Maya Patel",
    documentId: "uf2",
    documentName: "Harbourview Renewal.pdf",
    animated: true,
  },
  {
    id: "int4",
    propertyId: "riverside",
    propertyName: "Riverside Apartments",
    unitId: "rs-building",
    unitLabel: "Building documents",
    tenantId: "rs-bldg",
    tenantName: "",
    documentId: "uf4",
    documentName: "Riverside Rent Roll.xlsx",
    animated: true,
  },
  {
    id: "int5",
    propertyId: "queen-west",
    propertyName: "Queen West Lofts",
    unitId: "qw-u305",
    unitLabel: "Unit 305",
    tenantId: "qw-t1",
    tenantName: "Marcus Lee",
    documentId: "uf5",
    documentName: "Queen West N1 Notice.pdf",
    animated: false,
  },
  {
    id: "int6",
    propertyId: "cedar-lane",
    propertyName: "Cedar Lane Townhomes",
    unitId: "cl-building",
    unitLabel: "Building documents",
    tenantId: "cl-bldg",
    tenantName: "",
    documentId: "uf6",
    documentName: "Maintenance Agreement.pdf",
    animated: false,
  },
  {
    id: "int7",
    propertyId: "82-king",
    propertyName: "82 King Street",
    unitId: "82k-u4",
    unitLabel: "Unit 4",
    tenantId: "82k-t1",
    tenantName: "Ava Chen",
    documentId: "uf3",
    documentName: "Tenant Amendment — Ava Chen.pdf",
    animated: false,
  },
];

/** Document IDs added during upload integration — used to hide only new docs until animated */
export const INTEGRATION_DOCUMENT_IDS = new Set(
  INTEGRATION_EVENTS.map((e) => e.documentId),
);

export function buildPropertyTree(
  initial: TreeProperty[],
  integratedIds: Set<string>,
): TreeProperty[] {
  const tree = structuredClone(initial) as TreeProperty[];

  for (const event of INTEGRATION_EVENTS) {
    if (!integratedIds.has(event.id)) continue;

    let property = tree.find((p) => p.id === event.propertyId);
    if (!property) {
      property = {
        id: event.propertyId,
        name: event.propertyName,
        units: [],
      };
      tree.unshift(property);
    }

    if (event.unitLabel === "Building documents") {
      property.buildingDocuments = property.buildingDocuments ?? [];
      if (!property.buildingDocuments.some((d) => d.id === event.documentId)) {
        property.buildingDocuments.push({
          id: event.documentId,
          name: event.documentName,
        });
      }
      continue;
    }

    let unit = property.units.find((u) => u.id === event.unitId);
    if (!unit) {
      unit = { id: event.unitId, label: event.unitLabel };
      property.units.push(unit);
    }

    if (!unit.tenant) {
      unit.tenant = {
        id: event.tenantId,
        name: event.tenantName,
        documents: [],
      };
    }

    if (!unit.tenant.documents.some((d) => d.id === event.documentId)) {
      unit.tenant.documents.push({
        id: event.documentId,
        name: event.documentName,
      });
    }
  }

  return tree;
}
