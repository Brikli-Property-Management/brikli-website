import gsap from "gsap";
import {
  DEMO_TIMING,
  GROUNDING_FIELD_STAGGER,
  INTEGRATION_QUICK_STAGGER,
  INTEGRATION_STAGGER,
  type DemoStage,
} from "@/animation/documentsTiming";
import {
  afterDomUpdate,
  crossfade,
  FADE,
  fadeInCursor,
  fadeInElLazy,
  fadeModalCloseLazy,
  fadeModalOpenLazy,
  fadeOutCursor,
  fadeOutElLazy,
  sceneEl,
  swapModalStepLazy,
} from "@/animation/documentsTransitions";
import { getElementCenter, msToSec } from "@/animation/helpers";
import type { DocumentsDemoActions } from "@/animation/documentsDemoController";
import type { DocumentsDemoRefs } from "@/animation/documentsDemoController";
import {
  FOCUS_DOCUMENT_ID,
  GROUNDING_FIELDS,
  PROCESSING_SEQUENCE,
  UPLOAD_FILES,
} from "@/data/demoDocuments";
import { INTEGRATION_EVENTS, INITIAL_PROPERTIES } from "@/data/demoProperties";

type BuildTimelineOptions = {
  refs: DocumentsDemoRefs;
  actions: DocumentsDemoActions;
  onComplete?: () => void;
  exportMode?: boolean;
  onExportComplete?: () => void;
};

function cursorTarget(
  el: HTMLElement | null | undefined,
  container: HTMLElement,
): { x: number; y: number } {
  if (!el) return { x: 400, y: 300 };
  return getElementCenter(el, container);
}

const PROCESSING_STATUSES = [
  "uploading",
  "classifying",
  "extracting",
  "matching",
  "ready",
] as const;

export function buildDocumentsMasterTimeline({
  refs,
  actions,
  onComplete,
  exportMode = false,
  onExportComplete,
}: BuildTimelineOptions): gsap.core.Timeline {
  const tl = gsap.timeline({
    paused: true,
    onComplete: exportMode ? onExportComplete : onComplete,
  });

  const container = refs.container.current;
  const cursor = refs.cursor.current;
  const demoRoot = refs.demoRoot.current;

  if (!container || !cursor || !demoRoot) return tl;

  gsap.set(cursor, { x: 520, y: 80, opacity: 0, scale: 1 });

  const press = () => {
    tl.call(() => actions.setCursorPressed(true));
    tl.to(cursor, { scale: 0.88, duration: 0.08, ease: "power2.in" });
    tl.to(cursor, { scale: 1, duration: 0.12, ease: "power2.out" });
    tl.call(() => actions.setCursorPressed(false));
  };

  const dashboard = sceneEl(demoRoot, ".demo-scene-dashboard");
  const viewer = sceneEl(demoRoot, ".demo-scene-viewer");
  const getModalOverlay = () => refs.modalOverlay.current;
  const getModalCard = () =>
    refs.modalOverlay.current?.querySelector(".upload-modal-card") as
      | HTMLElement
      | null;
  const getModalBody = () =>
    refs.modalOverlay.current?.querySelector(".upload-modal-body") as
      | HTMLElement
      | null;
  const getPropertyPanel = () =>
    demoRoot.querySelector(".property-tree-panel");
  const getProcessingToast = () =>
    demoRoot.querySelector(".processing-toast");
  const getDocumentEl = (documentId: string) =>
    demoRoot.querySelector(`[data-document-id="${documentId}"]`);

  // Scene 1: Documents dashboard — visible immediately, no intro fade
  tl.addLabel("documents");
  tl.call(() => actions.setStage("documents"));
  tl.call(() => {
    if (dashboard) gsap.set(dashboard, { opacity: 1, y: 0, pointerEvents: "auto" });
    if (viewer) gsap.set(viewer, { opacity: 0, pointerEvents: "none" });
  });
  tl.to({}, { duration: msToSec(DEMO_TIMING.initialHold) });

  // Scene 2: Cursor fades in, clicks Upload → modal fades in
  tl.addLabel("upload-modal");
  fadeInCursor(tl, cursor, FADE.normal);
  tl.to(cursor, {
    x: () => cursorTarget(refs.uploadButton.current, container).x,
    y: () => cursorTarget(refs.uploadButton.current, container).y,
    duration: msToSec(DEMO_TIMING.cursorToUpload),
    ease: "power3.inOut",
  });
  tl.call(() => actions.setUploadButtonHovered(true));
  tl.to({}, { duration: 0.15 });
  press();
  fadeOutCursor(tl, cursor, FADE.fast);
  tl.call(() => {
    actions.setUploadButtonHovered(false);
    actions.setShowModal(true);
    actions.setStage("upload-modal");
  });
  afterDomUpdate(tl);
  fadeModalOpenLazy(tl, getModalOverlay, getModalCard, FADE.normal);
  tl.call(() => {
    const modalOverlay = getModalOverlay();
    if (modalOverlay) gsap.set(modalOverlay, { pointerEvents: "auto" });
  });
  tl.to({}, { duration: FADE.normal });

  // Scene 4: Files populate
  tl.addLabel("files-dropped");
  tl.call(() => {
    actions.setStage("files-dropped");
    actions.setDropZoneActive(true);
  });
  tl.to({}, { duration: 0.15 });
  tl.call(() => {
    actions.setSelectedFileIds(UPLOAD_FILES.map((f) => f.id));
    actions.setDropZoneActive(false);
  });
  afterDomUpdate(tl);
  tl.call(() => {
    demoRoot.querySelectorAll(".upload-file-row").forEach((row, i) => {
      gsap.set(row, { opacity: 0, y: 4 });
      gsap.to(row, {
        opacity: 1,
        y: 0,
        duration: 0.28,
        ease: "power2.out",
        delay: i * 0.03,
      });
    });
  });
  tl.to({}, { duration: msToSec(DEMO_TIMING.filesHold) });

  // Scene 5: Cursor fades back in, upload begins
  tl.addLabel("uploading");
  fadeInCursor(tl, cursor, FADE.normal);
  tl.to(cursor, {
    x: () => cursorTarget(refs.uploadAction.current, container).x,
    y: () => cursorTarget(refs.uploadAction.current, container).y,
    duration: 0.4,
    ease: "power3.inOut",
  });
  press();
  fadeOutCursor(tl, cursor, FADE.fast);
  swapModalStepLazy(tl, getModalBody, () => {
    actions.setStage("uploading");
    actions.setModalStep(2);
  });
  tl.to({}, { duration: msToSec(DEMO_TIMING.uploadProcessing * 0.45) });

  swapModalStepLazy(tl, getModalBody, () => {
    actions.setModalStep(3);
    actions.setStage("extracting");
  });
  tl.to({}, { duration: msToSec(DEMO_TIMING.uploadProcessing * 0.55) });

  // Scene 6: Extraction
  tl.addLabel("extracting");
  const phaseDuration = DEMO_TIMING.extraction / PROCESSING_STATUSES.length;

  PROCESSING_STATUSES.forEach((status, statusIndex) => {
    tl.call(() => {
      UPLOAD_FILES.forEach((file, fileIndex) => {
        const seq = PROCESSING_SEQUENCE[file.id];
        const lag = fileIndex % 3;
        const effectiveIndex = Math.max(0, statusIndex - lag);
        const effectiveStatus =
          PROCESSING_STATUSES[
            Math.min(effectiveIndex, PROCESSING_STATUSES.length - 1)
          ];
        actions.updateProcessingFile(file.id, {
          status: effectiveStatus,
          progress:
            seq?.progressSteps[
              Math.min(effectiveIndex, seq.progressSteps.length - 1)
            ] ?? (effectiveIndex + 1) * 20,
          badges:
            effectiveStatus === "ready" ? (seq?.badges ?? []) : [],
        });
      });
    });
    tl.to({}, { duration: msToSec(phaseDuration) });
  });

  // Scene 8: Processing complete
  tl.addLabel("complete");
  swapModalStepLazy(tl, getModalBody, () => {
    actions.setStage("complete");
    actions.setModalStep(4);
    actions.setProcessingComplete(true);
  });
  tl.to({}, { duration: msToSec(DEMO_TIMING.completeHold * 0.45) });

  tl.call(() => actions.setModalClosing(true));
  fadeModalCloseLazy(tl, getModalOverlay, getModalCard, FADE.normal);
  tl.call(() => {
    actions.setShowModal(false);
    actions.setModalClosing(false);
    const modalOverlay = getModalOverlay();
    const modalCard = getModalCard();
    if (modalOverlay) gsap.set(modalOverlay, { opacity: 0, pointerEvents: "none" });
    if (modalCard) gsap.set(modalCard, { opacity: 0, y: 12, scale: 0.98 });
  });
  tl.to({}, { duration: 0.15 });

  // Scene 7: Hierarchy integration
  tl.addLabel("integrating");
  tl.call(() => {
    actions.setStage("integrating");
    actions.setShowPropertyPanel(true);
    actions.setHighlightedEventId(null);
  });
  afterDomUpdate(tl);

  tl.call(() => {
    const panel = getPropertyPanel();
    const toast = getProcessingToast();
    if (panel) gsap.set(panel, { opacity: 0, x: -14, pointerEvents: "auto" });
    if (toast) gsap.set(toast, { opacity: 0, y: 10, pointerEvents: "none" });
  });

  fadeInElLazy(
    tl,
    getPropertyPanel,
    FADE.normal,
    undefined,
    { opacity: 0, x: -14, y: 0 },
  );
  fadeInElLazy(
    tl,
    getProcessingToast,
    FADE.normal,
    "<0.12",
    { opacity: 0, y: 10, x: 0 },
  );
  tl.call(() => {
    const toast = getProcessingToast();
    if (toast) gsap.set(toast, { pointerEvents: "auto" });
  }, undefined, ">");

  const animateDocIn = (documentId: string) => {
    afterDomUpdate(tl);
    tl.call(() => {
      const docEl = getDocumentEl(documentId);
      if (docEl) gsap.set(docEl, { opacity: 0, x: -8, y: 0 });
    });
    fadeInElLazy(
      tl,
      () => getDocumentEl(documentId),
      0.45,
      undefined,
      { opacity: 0, x: -8, y: 0 },
    );
    tl.call(() => {
      const docEl = getDocumentEl(documentId);
      if (docEl) gsap.set(docEl, { clearProps: "opacity,transform" });
    });
  };

  const animatePropertyIn = (propertyId: string) => {
    afterDomUpdate(tl);
    tl.call(() => {
      const propEl = demoRoot.querySelector(
        `[data-property-id="${propertyId}"]`,
      );
      if (propEl) gsap.set(propEl, { opacity: 0, x: -10, y: 0 });
    });
    fadeInElLazy(
      tl,
      () => demoRoot.querySelector(`[data-property-id="${propertyId}"]`),
      FADE.normal,
      undefined,
      { opacity: 0, x: -10, y: 0 },
    );
  };

  const knownPropertyIds = new Set(INITIAL_PROPERTIES.map((p) => p.id));

  INTEGRATION_EVENTS.forEach((event, index) => {
    const isAnimated = event.animated;
    const stagger = isAnimated ? INTEGRATION_STAGGER : INTEGRATION_QUICK_STAGGER;
    const isNewProperty = !knownPropertyIds.has(event.propertyId);

    tl.call(() => {
      actions.addIntegratedEvent(event.id);
      actions.revealIntegrationDoc(event.documentId);
      if (isAnimated) actions.setHighlightedEventId(event.id);
    }, undefined, index === 0 ? undefined : `+=${msToSec(stagger)}`);

    afterDomUpdate(tl);

    if (isNewProperty) {
      knownPropertyIds.add(event.propertyId);
      animatePropertyIn(event.propertyId);
    }

    animateDocIn(event.documentId);

    if (isAnimated) {
      tl.to({}, { duration: 0.2 });
      tl.call(() => actions.setHighlightedEventId(null));
    }
  });

  tl.call(() => actions.setHighlightedEventId(null));
  fadeOutElLazy(
    tl,
    getProcessingToast,
    FADE.normal,
    undefined,
    { opacity: 0, y: 8 },
  );
  tl.call(() => {
    const toast = getProcessingToast();
    if (toast) gsap.set(toast, { pointerEvents: "none" });
  }, undefined, "<");
  tl.to({}, {
    duration: msToSec(
      Math.max(
        0,
        DEMO_TIMING.hierarchyIntegration -
          INTEGRATION_EVENTS.filter((e) => e.animated).length *
            INTEGRATION_STAGGER,
      ),
    ),
  });

  // Scene 9: Crossfade to document viewer
  tl.addLabel("viewer");
  fadeOutCursor(tl, cursor, FADE.normal);
  crossfade(
    tl,
    dashboard,
    viewer,
    () => {
      actions.setHighlightedEventId(null);
      actions.setStage("viewer");
      actions.setSelectedDocumentId(FOCUS_DOCUMENT_ID);
    },
    FADE.slow,
  );
  tl.to({}, { duration: msToSec(DEMO_TIMING.viewerSettle) });

  // Scene 11: Grounding sequence
  tl.addLabel("grounding");
  tl.call(() => actions.setStage("grounding"));

  GROUNDING_FIELDS.forEach((field, index) => {
    tl.call(() => {
      actions.setActiveGroundingFieldId(field.id);
      actions.revealField(field.id);
      const box = demoRoot.querySelector(`[data-grounding-box="${field.id}"]`);
      const card = demoRoot.querySelector(`[data-extraction-field="${field.id}"]`);
      if (box) {
        gsap.fromTo(
          box,
          { opacity: 0, scale: 0.98 },
          { opacity: 1, scale: 1, duration: 0.45, ease: "power2.out" },
        );
      }
      if (card) {
        gsap.fromTo(
          card,
          { opacity: 0, x: 8 },
          { opacity: 1, x: 0, duration: 0.4, ease: "power2.out", delay: 0.1 },
        );
      }
    }, undefined, index === 0 ? undefined : `+=${msToSec(GROUNDING_FIELD_STAGGER)}`);
  });

  tl.to({}, {
    duration: msToSec(
      Math.max(
        0,
        DEMO_TIMING.groundingSequence -
          GROUNDING_FIELDS.length * GROUNDING_FIELD_STAGGER,
      ),
    ),
  });

  // Final hold
  tl.addLabel("finished");
  tl.call(() => actions.setStage("finished"));
  tl.to({}, { duration: msToSec(DEMO_TIMING.finalHold) });

  if (exportMode) {
    return tl;
  }

  // Loop — crossfade viewer back to dashboard (no blank flash)
  crossfade(
    tl,
    viewer,
    dashboard,
    () => {
      actions.resetAll();
      actions.setStage("documents");
    },
    FADE.normal,
  );
  tl.to({}, { duration: msToSec(DEMO_TIMING.initialHold * 0.5) });

  return tl;
}

export function jumpDocumentsTimelineToStage(
  tl: gsap.core.Timeline,
  stage: DemoStage,
): void {
  if (tl.labels[stage] !== undefined) {
    tl.seek(stage);
  }
}

export function applyDocumentsStageState(
  stage: DemoStage,
  actions: DocumentsDemoActions,
): void {
  actions.resetAll();

  switch (stage) {
    case "documents":
      break;
    case "upload-modal":
      actions.setShowModal(true);
      actions.setStage("upload-modal");
      break;
    case "files-dropped":
      actions.setShowModal(true);
      actions.setStage("files-dropped");
      actions.setSelectedFileIds(UPLOAD_FILES.map((f) => f.id));
      break;
    case "uploading":
      actions.setShowModal(true);
      actions.setStage("uploading");
      actions.setModalStep(2);
      actions.setSelectedFileIds(UPLOAD_FILES.map((f) => f.id));
      break;
    case "extracting":
      actions.setShowModal(true);
      actions.setStage("extracting");
      actions.setModalStep(3);
      actions.setSelectedFileIds(UPLOAD_FILES.map((f) => f.id));
      UPLOAD_FILES.forEach((f) => {
        actions.updateProcessingFile(f.id, {
          status: "extracting",
          progress: 60,
          badges: [],
        });
      });
      break;
    case "integrating":
    case "complete":
      actions.setShowModal(stage === "complete");
      actions.setStage(stage);
      actions.setModalStep(stage === "complete" ? 4 : 3);
      actions.setSelectedFileIds(UPLOAD_FILES.map((f) => f.id));
      actions.setShowPropertyPanel(true);
      actions.setProcessingComplete(stage === "complete");
      INTEGRATION_EVENTS.forEach((e) => actions.addIntegratedEvent(e.id));
      INTEGRATION_EVENTS.forEach((e) => actions.revealIntegrationDoc(e.documentId));
      actions.setHighlightedEventId(null);
      UPLOAD_FILES.forEach((f) => {
        actions.updateProcessingFile(f.id, {
          status: "ready",
          progress: 100,
          badges: PROCESSING_SEQUENCE[f.id]?.badges ?? [],
        });
      });
      break;
    case "viewer":
    case "grounding":
    case "finished":
      actions.setShowPropertyPanel(true);
      actions.setSelectedDocumentId(FOCUS_DOCUMENT_ID);
      actions.setStage(stage);
      INTEGRATION_EVENTS.forEach((e) => actions.addIntegratedEvent(e.id));
      INTEGRATION_EVENTS.forEach((e) => actions.revealIntegrationDoc(e.documentId));
      actions.setHighlightedEventId(null);
      if (stage === "grounding" || stage === "finished") {
        GROUNDING_FIELDS.forEach((f) => actions.revealField(f.id));
        actions.setActiveGroundingFieldId(
          stage === "finished"
            ? GROUNDING_FIELDS[GROUNDING_FIELDS.length - 1]?.id ?? null
            : GROUNDING_FIELDS[0]?.id ?? null,
        );
      }
      break;
  }
}

const MODAL_VISIBLE_STAGES: DemoStage[] = [
  "upload-modal",
  "files-dropped",
  "uploading",
  "extracting",
  "complete",
];

export function revealDocumentsDomState(
  root: HTMLElement | null,
  stage: DemoStage,
): void {
  if (!root) return;

  if (MODAL_VISIBLE_STAGES.includes(stage)) {
    const overlay = root.querySelector(".upload-modal-overlay");
    const card = root.querySelector(".upload-modal-card");
    if (overlay) gsap.set(overlay, { opacity: 1, pointerEvents: "auto" });
    if (card) gsap.set(card, { opacity: 1, y: 0, scale: 1 });
  }

  if (
    stage === "files-dropped" ||
    stage === "uploading" ||
    stage === "extracting"
  ) {
    root.querySelectorAll(".upload-file-row").forEach((el) => {
      gsap.set(el, { opacity: 1, y: 0 });
    });
  }

  if (stage === "grounding" || stage === "finished") {
    GROUNDING_FIELDS.forEach((field) => {
      const box = root.querySelector(`[data-grounding-box="${field.id}"]`);
      const card = root.querySelector(`[data-extraction-field="${field.id}"]`);
      if (box) gsap.set(box, { opacity: 1, scale: 1 });
      if (card) gsap.set(card, { opacity: 1, x: 0 });
    });
  }

  if (
    stage === "integrating" ||
    stage === "complete" ||
    stage === "viewer" ||
    stage === "grounding" ||
    stage === "finished"
  ) {
    root.querySelectorAll(".integration-doc").forEach((el) => {
      gsap.set(el, { opacity: 1, x: 0, y: 0, clearProps: "opacity,transform" });
    });
    const toast = root.querySelector(".processing-toast");
    const panel = root.querySelector(".property-tree-panel");
    if (toast) gsap.set(toast, { opacity: 1, y: 0, pointerEvents: "auto" });
    if (panel) gsap.set(panel, { opacity: 1, x: 0, pointerEvents: "auto" });
  }
}
