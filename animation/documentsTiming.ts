/** Documents demo timing — single source of truth (milliseconds). */
export const DEMO_TIMING = {
  initialHold: 1000,
  cursorToUpload: 700,
  modalOpen: 500,
  filesDrop: 400,
  filesHold: 600,
  uploadClick: 500,
  uploadProcessing: 1600,
  extraction: 3200,
  hierarchyIntegration: 2600,
  completeHold: 1000,
  viewerTransition: 900,
  viewerSettle: 700,
  groundingSequence: 3600,
  finalHold: 2500,
  loopFade: 600,
} as const;

export const FILE_ROW_STAGGER = 55;
export const FLOATING_CARD_STAGGER = 90;
export const GROUNDING_FIELD_STAGGER = 480;
export const INTEGRATION_STAGGER = 520;
export const INTEGRATION_QUICK_STAGGER = 140;
export const PROCESSING_FILE_STAGGER = 180;

export type DemoStage =
  | "documents"
  | "upload-modal"
  | "files-dropped"
  | "uploading"
  | "extracting"
  | "integrating"
  | "complete"
  | "viewer"
  | "grounding"
  | "finished";

export const DEMO_STAGES: DemoStage[] = [
  "documents",
  "upload-modal",
  "files-dropped",
  "uploading",
  "extracting",
  "integrating",
  "complete",
  "viewer",
  "grounding",
  "finished",
];

export const STAGE_LABELS: Record<DemoStage, string> = {
  documents: "1 · Documents dashboard",
  "upload-modal": "2 · Upload modal",
  "files-dropped": "3 · Files dropped",
  uploading: "4 · Uploading",
  extracting: "5 · Extracting",
  integrating: "6 · Hierarchy integration",
  complete: "7 · Processing complete",
  viewer: "8 · Document viewer",
  grounding: "9 · Field grounding",
  finished: "10 · Final hold",
};

export type ModalStep = 1 | 2 | 3 | 4;

export const MODAL_STEP_LABELS: Record<ModalStep, string> = {
  1: "Select files",
  2: "Uploading",
  3: "Extracting",
  4: "Complete",
};

export function getTotalDemoDuration(): number {
  const t = DEMO_TIMING;
  return (
    t.initialHold +
    t.cursorToUpload +
    t.modalOpen +
    t.filesDrop +
    t.filesHold +
    t.uploadClick +
    t.uploadProcessing +
    t.extraction +
    t.hierarchyIntegration +
    t.completeHold +
    t.viewerTransition +
    t.viewerSettle +
    t.groundingSequence +
    t.finalHold +
    t.loopFade
  );
}

/** Duration of one full demo pass for video export (no loop crossfade). */
export function getExportDuration(): number {
  const t = DEMO_TIMING;
  return (
    t.initialHold +
    t.cursorToUpload +
    t.modalOpen +
    t.filesDrop +
    t.filesHold +
    t.uploadClick +
    t.uploadProcessing +
    t.extraction +
    t.hierarchyIntegration +
    t.completeHold +
    t.viewerTransition +
    t.viewerSettle +
    t.groundingSequence +
    t.finalHold
  );
}

export const EXPORT_VIEWPORT = { width: 1440, height: 900 } as const;
