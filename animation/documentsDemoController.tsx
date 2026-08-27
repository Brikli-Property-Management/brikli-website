"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import gsap from "gsap";
import type { DemoStage, ModalStep } from "@/animation/documentsTiming";
import {
  createInitialProcessingFiles,
  UPLOAD_FILES,
  type ProcessingFile,
  type ProcessingStatus,
} from "@/data/demoDocuments";
import {
  buildPropertyTree,
  INITIAL_PROPERTIES,
  type TreeProperty,
} from "@/data/demoProperties";

export type DocumentsDemoRefs = {
  container: RefObject<HTMLDivElement | null>;
  cursor: RefObject<HTMLDivElement | null>;
  uploadButton: RefObject<HTMLButtonElement | null>;
  uploadAction: RefObject<HTMLButtonElement | null>;
  dropZone: RefObject<HTMLDivElement | null>;
  demoRoot: RefObject<HTMLDivElement | null>;
  modalOverlay: RefObject<HTMLDivElement | null>;
};

export type DocumentsDemoState = {
  stage: DemoStage;
  showModal: boolean;
  modalStep: ModalStep;
  modalClosing: boolean;
  dropZoneActive: boolean;
  floatingFileIds: string[];
  selectedFileIds: string[];
  processingFiles: ProcessingFile[];
  integratedEventIds: string[];
  revealedIntegrationDocIds: string[];
  highlightedEventId: string | null;
  showPropertyPanel: boolean;
  selectedDocumentId: string | null;
  revealedFieldIds: string[];
  activeGroundingFieldId: string | null;
  uploadButtonHovered: boolean;
  cursorPressed: boolean;
  processingComplete: boolean;
};

type DocumentsDemoControllerValue = DocumentsDemoState &
  DocumentsDemoRefs & {
    propertyTree: TreeProperty[];
    setStage: (stage: DemoStage) => void;
    setShowModal: (show: boolean) => void;
    setModalStep: (step: ModalStep) => void;
    setModalClosing: (closing: boolean) => void;
    setDropZoneActive: (active: boolean) => void;
    setFloatingFileIds: (ids: string[]) => void;
    addSelectedFile: (id: string) => void;
    setSelectedFileIds: (ids: string[]) => void;
    setProcessingFiles: (files: ProcessingFile[]) => void;
    updateProcessingFile: (
      id: string,
      patch: Partial<ProcessingFile>,
    ) => void;
    addIntegratedEvent: (id: string) => void;
    revealIntegrationDoc: (documentId: string) => void;
    setRevealedIntegrationDocIds: (ids: string[]) => void;
    setIntegratedEventIds: (ids: string[]) => void;
    setHighlightedEventId: (id: string | null) => void;
    setShowPropertyPanel: (show: boolean) => void;
    setSelectedDocumentId: (id: string | null) => void;
    revealField: (id: string) => void;
    setRevealedFieldIds: (ids: string[]) => void;
    setActiveGroundingFieldId: (id: string | null) => void;
    setUploadButtonHovered: (hovered: boolean) => void;
    setCursorPressed: (pressed: boolean) => void;
    setProcessingComplete: (complete: boolean) => void;
    masterTimeline: RefObject<gsap.core.Timeline | null>;
    playbackSpeed: number;
    setPlaybackSpeed: (speed: number) => void;
    isPaused: boolean;
    setIsPaused: (paused: boolean) => void;
  };

const DocumentsDemoContext = createContext<DocumentsDemoControllerValue | null>(
  null,
);

export function useDocumentsDemo() {
  const ctx = useContext(DocumentsDemoContext);
  if (!ctx) {
    throw new Error(
      "useDocumentsDemo must be used within DocumentsDemoProvider",
    );
  }
  return ctx;
}

const INITIAL_STATE: DocumentsDemoState = {
  stage: "documents",
  showModal: false,
  modalStep: 1,
  modalClosing: false,
  dropZoneActive: false,
  floatingFileIds: [],
  selectedFileIds: [],
  processingFiles: createInitialProcessingFiles(),
  integratedEventIds: [],
  revealedIntegrationDocIds: [],
  highlightedEventId: null,
  showPropertyPanel: false,
  selectedDocumentId: null,
  revealedFieldIds: [],
  activeGroundingFieldId: null,
  uploadButtonHovered: false,
  cursorPressed: false,
  processingComplete: false,
};

export function DocumentsDemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DocumentsDemoState>(INITIAL_STATE);
  const [playbackSpeed, setPlaybackSpeedState] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const uploadButtonRef = useRef<HTMLButtonElement>(null);
  const uploadActionRef = useRef<HTMLButtonElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const demoRootRef = useRef<HTMLDivElement>(null);
  const modalOverlayRef = useRef<HTMLDivElement>(null);
  const masterTimelineRef = useRef<gsap.core.Timeline | null>(null);

  const setStage = useCallback((stage: DemoStage) => {
    setState((s) => ({ ...s, stage }));
  }, []);

  const setShowModal = useCallback((showModal: boolean) => {
    setState((s) => ({ ...s, showModal }));
  }, []);

  const setModalStep = useCallback((modalStep: ModalStep) => {
    setState((s) => ({ ...s, modalStep }));
  }, []);

  const setModalClosing = useCallback((modalClosing: boolean) => {
    setState((s) => ({ ...s, modalClosing }));
  }, []);

  const setDropZoneActive = useCallback((dropZoneActive: boolean) => {
    setState((s) => ({ ...s, dropZoneActive }));
  }, []);

  const setFloatingFileIds = useCallback((floatingFileIds: string[]) => {
    setState((s) => ({ ...s, floatingFileIds }));
  }, []);

  const addSelectedFile = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      selectedFileIds: s.selectedFileIds.includes(id)
        ? s.selectedFileIds
        : [...s.selectedFileIds, id],
    }));
  }, []);

  const setSelectedFileIds = useCallback((selectedFileIds: string[]) => {
    setState((s) => ({ ...s, selectedFileIds }));
  }, []);

  const setProcessingFiles = useCallback((processingFiles: ProcessingFile[]) => {
    setState((s) => ({ ...s, processingFiles }));
  }, []);

  const updateProcessingFile = useCallback(
    (id: string, patch: Partial<ProcessingFile>) => {
      setState((s) => ({
        ...s,
        processingFiles: s.processingFiles.map((f) =>
          f.id === id ? { ...f, ...patch } : f,
        ),
      }));
    },
    [],
  );

  const addIntegratedEvent = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      integratedEventIds: s.integratedEventIds.includes(id)
        ? s.integratedEventIds
        : [...s.integratedEventIds, id],
    }));
  }, []);

  const revealIntegrationDoc = useCallback((documentId: string) => {
    setState((s) => ({
      ...s,
      revealedIntegrationDocIds: s.revealedIntegrationDocIds.includes(documentId)
        ? s.revealedIntegrationDocIds
        : [...s.revealedIntegrationDocIds, documentId],
    }));
  }, []);

  const setRevealedIntegrationDocIds = useCallback(
    (revealedIntegrationDocIds: string[]) => {
      setState((s) => ({ ...s, revealedIntegrationDocIds }));
    },
    [],
  );

  const setIntegratedEventIds = useCallback((integratedEventIds: string[]) => {
    setState((s) => ({ ...s, integratedEventIds }));
  }, []);

  const setHighlightedEventId = useCallback((highlightedEventId: string | null) => {
    setState((s) => ({ ...s, highlightedEventId }));
  }, []);

  const setShowPropertyPanel = useCallback((showPropertyPanel: boolean) => {
    setState((s) => ({ ...s, showPropertyPanel }));
  }, []);

  const setSelectedDocumentId = useCallback((selectedDocumentId: string | null) => {
    setState((s) => ({ ...s, selectedDocumentId }));
  }, []);

  const revealField = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      revealedFieldIds: s.revealedFieldIds.includes(id)
        ? s.revealedFieldIds
        : [...s.revealedFieldIds, id],
    }));
  }, []);

  const setRevealedFieldIds = useCallback((revealedFieldIds: string[]) => {
    setState((s) => ({ ...s, revealedFieldIds }));
  }, []);

  const setActiveGroundingFieldId = useCallback(
    (activeGroundingFieldId: string | null) => {
      setState((s) => ({ ...s, activeGroundingFieldId }));
    },
    [],
  );

  const setUploadButtonHovered = useCallback((uploadButtonHovered: boolean) => {
    setState((s) => ({ ...s, uploadButtonHovered }));
  }, []);

  const setCursorPressed = useCallback((cursorPressed: boolean) => {
    setState((s) => ({ ...s, cursorPressed }));
  }, []);

  const setProcessingComplete = useCallback((processingComplete: boolean) => {
    setState((s) => ({ ...s, processingComplete }));
  }, []);

  const setPlaybackSpeed = useCallback((speed: number) => {
    setPlaybackSpeedState(speed);
    masterTimelineRef.current?.timeScale(speed);
  }, []);

  const propertyTree = useMemo(
    () =>
      buildPropertyTree(
        INITIAL_PROPERTIES,
        new Set(state.integratedEventIds),
      ),
    [state.integratedEventIds],
  );

  return (
    <DocumentsDemoContext.Provider
      value={{
        ...state,
        propertyTree,
        container: containerRef,
        cursor: cursorRef,
        uploadButton: uploadButtonRef,
        uploadAction: uploadActionRef,
        dropZone: dropZoneRef,
        demoRoot: demoRootRef,
        modalOverlay: modalOverlayRef,
        setStage,
        setShowModal,
        setModalStep,
        setModalClosing,
        setDropZoneActive,
        setFloatingFileIds,
        addSelectedFile,
        setSelectedFileIds,
        setProcessingFiles,
        updateProcessingFile,
        addIntegratedEvent,
        revealIntegrationDoc,
        setRevealedIntegrationDocIds,
        setIntegratedEventIds,
        setHighlightedEventId,
        setShowPropertyPanel,
        setSelectedDocumentId,
        revealField,
        setRevealedFieldIds,
        setActiveGroundingFieldId,
        setUploadButtonHovered,
        setCursorPressed,
        setProcessingComplete,
        masterTimeline: masterTimelineRef,
        playbackSpeed,
        setPlaybackSpeed,
        isPaused,
        setIsPaused,
      }}
    >
      {children}
    </DocumentsDemoContext.Provider>
  );
}

export function resetDocumentsDemoState(
  demo: Pick<
    DocumentsDemoControllerValue,
    | "setStage"
    | "setShowModal"
    | "setModalStep"
    | "setModalClosing"
    | "setDropZoneActive"
    | "setFloatingFileIds"
    | "setSelectedFileIds"
    | "setProcessingFiles"
    | "setIntegratedEventIds"
    | "setRevealedIntegrationDocIds"
    | "setHighlightedEventId"
    | "setShowPropertyPanel"
    | "setSelectedDocumentId"
    | "setRevealedFieldIds"
    | "setActiveGroundingFieldId"
    | "setUploadButtonHovered"
    | "setCursorPressed"
    | "setProcessingComplete"
  >,
): void {
  demo.setStage("documents");
  demo.setShowModal(false);
  demo.setModalStep(1);
  demo.setModalClosing(false);
  demo.setDropZoneActive(false);
  demo.setFloatingFileIds([]);
  demo.setSelectedFileIds([]);
  demo.setProcessingFiles(createInitialProcessingFiles());
  demo.setIntegratedEventIds([]);
  demo.setRevealedIntegrationDocIds([]);
  demo.setHighlightedEventId(null);
  demo.setShowPropertyPanel(false);
  demo.setSelectedDocumentId(null);
  demo.setRevealedFieldIds([]);
  demo.setActiveGroundingFieldId(null);
  demo.setUploadButtonHovered(false);
  demo.setCursorPressed(false);
  demo.setProcessingComplete(false);
}

export type DocumentsDemoActions = {
  setStage: (stage: DemoStage) => void;
  setShowModal: (show: boolean) => void;
  setModalStep: (step: ModalStep) => void;
  setModalClosing: (closing: boolean) => void;
  setDropZoneActive: (active: boolean) => void;
  setFloatingFileIds: (ids: string[]) => void;
  addSelectedFile: (id: string) => void;
  setSelectedFileIds: (ids: string[]) => void;
  updateProcessingFile: (
    id: string,
    patch: Partial<ProcessingFile>,
  ) => void;
  addIntegratedEvent: (id: string) => void;
  revealIntegrationDoc: (documentId: string) => void;
  setHighlightedEventId: (id: string | null) => void;
  setShowPropertyPanel: (show: boolean) => void;
  setSelectedDocumentId: (id: string | null) => void;
  revealField: (id: string) => void;
  setActiveGroundingFieldId: (id: string | null) => void;
  setUploadButtonHovered: (hovered: boolean) => void;
  setCursorPressed: (pressed: boolean) => void;
  setProcessingComplete: (complete: boolean) => void;
  resetAll: () => void;
};

export function createDemoActions(
  demo: DocumentsDemoControllerValue,
): DocumentsDemoActions {
  return {
    setStage: demo.setStage,
    setShowModal: demo.setShowModal,
    setModalStep: demo.setModalStep,
    setModalClosing: demo.setModalClosing,
    setDropZoneActive: demo.setDropZoneActive,
    setFloatingFileIds: demo.setFloatingFileIds,
    addSelectedFile: demo.addSelectedFile,
    setSelectedFileIds: demo.setSelectedFileIds,
    updateProcessingFile: demo.updateProcessingFile,
    addIntegratedEvent: demo.addIntegratedEvent,
    revealIntegrationDoc: demo.revealIntegrationDoc,
    setHighlightedEventId: demo.setHighlightedEventId,
    setShowPropertyPanel: demo.setShowPropertyPanel,
    setSelectedDocumentId: demo.setSelectedDocumentId,
    revealField: demo.revealField,
    setActiveGroundingFieldId: demo.setActiveGroundingFieldId,
    setUploadButtonHovered: demo.setUploadButtonHovered,
    setCursorPressed: demo.setCursorPressed,
    setProcessingComplete: demo.setProcessingComplete,
    resetAll: () => resetDocumentsDemoState(demo),
  };
}

export { UPLOAD_FILES };
export type { ProcessingStatus };
