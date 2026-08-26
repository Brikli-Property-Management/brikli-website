export const NOTICE_DRAFTS = [
  { unit: "Unit 4", form: "N1", status: "READY" },
  { unit: "Unit 8", form: "N1", status: "READY" },
  { unit: "Unit 412", form: "N1", status: "READY" },
  { unit: "Unit 1208", form: "N1", status: "READY" },
  { unit: "Unit 201", form: "N1", status: "READY" },
  { unit: "Unit 305", form: "N2", status: "READY" },
] as const;

export const NOTICE_TOTAL = 22;

export const APPROVAL_QUEUE = [
  { name: "Ava Chen", action: "Renewal offer" },
  { name: "Maya Patel", action: "Rent increase" },
  { name: "Marcus Lee", action: "Lease amendment" },
  { name: "Daniel Kim", action: "Notice delivery" },
  { name: "Sofia Reyes", action: "Rent increase" },
] as const;

export const WORKFLOW_COLUMNS = ["READY", "APPROVAL", "COMPLETE"] as const;

export type WorkflowColumnId = (typeof WORKFLOW_COLUMNS)[number];

export const WORKFLOW_ROWS = [
  {
    id: "row-0",
    title: "Renewal · Unit 4",
    stages: ["Queued", "Awaiting sign-off", "Filed"],
  },
  {
    id: "row-1",
    title: "N1 · Unit 412",
    stages: ["Draft ready", "In review", "Delivered"],
  },
  {
    id: "row-2",
    title: "Renewal · Unit 1208",
    stages: ["Queued", "Review pending", "Filed"],
  },
] as const;

export const AUDIT_TRAIL = [
  { time: "09:02", event: "Verified rent" },
  { time: "09:03", event: "Notice generated" },
  { time: "09:03", event: "Batch queued · 22 notices" },
  { time: "09:04", event: "Approved by B. Nowak" },
  { time: "09:04", event: "Signed · Unit 4 renewal" },
  { time: "09:05", event: "Delivery scheduled" },
  { time: "09:05", event: "Portal updated" },
] as const;
