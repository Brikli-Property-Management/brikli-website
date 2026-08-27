"use client";

import { DocumentsDemoProvider, useDocumentsDemo } from "@/animation/documentsDemoController";
import { useDocumentsDemoPlayback } from "@/animation/useDocumentsDemoPlayback";
import type { DemoStage } from "@/animation/documentsTiming";
import { FakeCursor } from "@/components/demo/FakeCursor";
import { DocumentsDevControls } from "@/components/demo/documents/DocumentsDevControls";
import { CompactNav } from "@/components/demo/documents/CompactNav";
import { DocumentsDashboard } from "@/components/demo/documents/DocumentsDashboard";
import { DocumentViewer } from "@/components/demo/documents/DocumentViewer";
import { ExtractedFieldsPanel } from "@/components/demo/documents/ExtractionField";
import { PropertyTree } from "@/components/demo/documents/PropertyTree";
import { ProcessingToast } from "@/components/demo/documents/ProcessingToast";
import { UploadModal } from "@/components/demo/documents/UploadModal";
import { GROUNDING_FIELDS } from "@/data/demoDocuments";

const VIEWER_STAGES: DemoStage[] = ["viewer", "grounding", "finished"];

function DocumentsDemoViewport({
  handleJumpToStage,
}: {
  handleJumpToStage: (stage: DemoStage) => void;
}) {
  const demo = useDocumentsDemo();
  const isViewer = VIEWER_STAGES.includes(demo.stage);
  const showHierarchy = demo.showPropertyPanel || isViewer;

  return (
    <div
      ref={demo.container}
      className="relative flex h-full w-full overflow-hidden bg-[#FAFAF8]"
    >
      <div ref={demo.demoRoot} className="flex h-full w-full">
        <CompactNav />

        {showHierarchy && (
          <PropertyTree
            properties={demo.propertyTree}
            integratedEventIds={demo.integratedEventIds}
            highlightedEventId={demo.highlightedEventId}
            isIntegrating={demo.stage === "integrating"}
            revealedIntegrationDocIds={demo.revealedIntegrationDocIds}
            selectedDocumentId={demo.selectedDocumentId}
          />
        )}

        <div className="relative h-full min-h-0 flex-1 overflow-hidden">
          <div className="demo-scene-dashboard absolute inset-0 flex min-w-0 bg-[#FAFAF8]">
            <DocumentsDashboard
              ref={demo.uploadButton}
              uploadButtonHovered={demo.uploadButtonHovered}
              onUploadClick={() => handleJumpToStage("upload-modal")}
            />
            <ProcessingToast />
          </div>

          <div
            className="demo-scene-viewer absolute inset-0 flex min-w-0"
            style={{ opacity: 0, pointerEvents: "none" }}
          >
            <DocumentViewer
              revealedFieldIds={demo.revealedFieldIds}
              activeGroundingFieldId={demo.activeGroundingFieldId}
            />
            <ExtractedFieldsPanel
              fields={GROUNDING_FIELDS}
              revealedFieldIds={demo.revealedFieldIds}
              activeFieldId={demo.activeGroundingFieldId}
            />
          </div>
        </div>
      </div>

      <UploadModal
        ref={demo.modalOverlay}
        visible={demo.showModal}
        closing={demo.modalClosing}
        step={demo.modalStep}
        dropZoneActive={demo.dropZoneActive}
        selectedFileIds={demo.selectedFileIds}
        processingFiles={demo.processingFiles}
        processingComplete={demo.processingComplete}
        onUploadClick={() => handleJumpToStage("uploading")}
        dropZoneRef={demo.dropZone}
        uploadActionRef={demo.uploadAction}
      />

      <FakeCursor ref={demo.cursor} isPressed={demo.cursorPressed} />
    </div>
  );
}

function DocumentsDemoLayout({ exportMode = false }: { exportMode?: boolean }) {
  const { handleJumpToStage, devControls } = useDocumentsDemoPlayback(exportMode);
  const showDevControls =
    process.env.NODE_ENV === "development" && !exportMode;

  return (
    <>
      <DocumentsDemoViewport handleJumpToStage={handleJumpToStage} />
      {showDevControls && (
        <div className="mt-4 flex justify-center">
          <DocumentsDevControls {...devControls} />
        </div>
      )}
    </>
  );
}

function DocumentsDemoShellLayout({ exportMode = false }: { exportMode?: boolean }) {
  const { handleJumpToStage, devControls } = useDocumentsDemoPlayback(exportMode);
  const showDevControls =
    process.env.NODE_ENV === "development" && !exportMode;

  return (
    <div className="mx-auto w-full max-w-[1440px]">
      <div
        className="relative aspect-[1440/900] overflow-hidden rounded-xl border border-[#E8E8E6] bg-[#FAFAF8] shadow-[0_8px_40px_rgba(0,0,0,0.06)]"
        data-demo-shell
      >
        <DocumentsDemoViewport handleJumpToStage={handleJumpToStage} />
      </div>
      {showDevControls && (
        <div className="mt-4 flex justify-center">
          <DocumentsDevControls {...devControls} />
        </div>
      )}
    </div>
  );
}

export function DocumentsDemo({ exportMode = false }: { exportMode?: boolean }) {
  return (
    <DocumentsDemoProvider>
      <DocumentsDemoLayout exportMode={exportMode} />
    </DocumentsDemoProvider>
  );
}

export function DocumentsDemoShell({ exportMode = false }: { exportMode?: boolean }) {
  return (
    <DocumentsDemoProvider>
      <DocumentsDemoShellLayout exportMode={exportMode} />
    </DocumentsDemoProvider>
  );
}

export function DocumentsExportFrame() {
  return (
    <DocumentsDemoProvider>
      <div
        className="relative h-full w-full overflow-hidden rounded-xl border border-[#E8E8E6] bg-[#FAFAF8] shadow-[0_8px_40px_rgba(0,0,0,0.06)]"
        data-demo-shell
      >
        <DocumentsDemoExportInner />
      </div>
    </DocumentsDemoProvider>
  );
}

function DocumentsDemoExportInner() {
  const { handleJumpToStage } = useDocumentsDemoPlayback(true);
  return <DocumentsDemoViewport handleJumpToStage={handleJumpToStage} />;
}
