"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import {
  applyDocumentsStageState,
  buildDocumentsMasterTimeline,
  jumpDocumentsTimelineToStage,
  revealDocumentsDomState,
} from "@/animation/documentsMasterTimeline";
import {
  createDemoActions,
  resetDocumentsDemoState,
  useDocumentsDemo,
} from "@/animation/documentsDemoController";
import { prepareScenes, resetSceneStyles } from "@/animation/documentsTransitions";
import type { DemoStage } from "@/animation/documentsTiming";

const VIEWER_STAGES: DemoStage[] = ["viewer", "grounding", "finished"];

function markExportReady() {
  document.documentElement.dataset.exportReady = "true";
  window.__BRIKLI_DEMO_EXPORT__ = { ready: true, complete: false };
}

function markExportComplete() {
  document.documentElement.dataset.exportComplete = "true";
  window.__BRIKLI_DEMO_EXPORT__ = { ready: true, complete: true };
}

export function useDocumentsDemoPlayback(exportMode = false) {
  const demo = useDocumentsDemo();
  const startTimelineRef = useRef<() => void>(() => {});

  const buildActions = useCallback(() => createDemoActions(demo), [demo]);

  const getRefs = useCallback(
    () => ({
      container: demo.container,
      cursor: demo.cursor,
      uploadButton: demo.uploadButton,
      uploadAction: demo.uploadAction,
      dropZone: demo.dropZone,
      demoRoot: demo.demoRoot,
      modalOverlay: demo.modalOverlay,
    }),
    [
      demo.container,
      demo.cursor,
      demo.uploadButton,
      demo.uploadAction,
      demo.dropZone,
      demo.demoRoot,
      demo.modalOverlay,
    ],
  );

  const startTimeline = useCallback(() => {
    demo.masterTimeline.current?.kill();
    if (demo.cursor.current) {
      gsap.set(demo.cursor.current, { x: 520, y: 80, opacity: 0, scale: 1 });
    }
    resetSceneStyles(demo.demoRoot.current);
    prepareScenes(demo.demoRoot.current);

    const tl = buildDocumentsMasterTimeline({
      refs: getRefs(),
      actions: buildActions(),
      exportMode,
      onExportComplete: exportMode ? markExportComplete : undefined,
      onComplete: exportMode ? undefined : () => startTimelineRef.current(),
    });

    demo.masterTimeline.current = tl;
    tl.timeScale(demo.playbackSpeed);
    demo.setIsPaused(false);
    if (exportMode) markExportReady();
    tl.play(0);
  }, [demo, buildActions, getRefs, exportMode]);

  startTimelineRef.current = startTimeline;

  const handleRestart = useCallback(() => {
    demo.masterTimeline.current?.kill();
    resetDocumentsDemoState(demo);
    requestAnimationFrame(() => startTimelineRef.current());
  }, [demo]);

  const handleJumpToStage = useCallback(
    (stage: DemoStage) => {
      demo.masterTimeline.current?.kill();
      resetDocumentsDemoState(demo);
      applyDocumentsStageState(stage, buildActions());

      requestAnimationFrame(() => {
        revealDocumentsDomState(demo.demoRoot.current, stage);
        resetSceneStyles(demo.demoRoot.current);
        if (VIEWER_STAGES.includes(stage)) {
          const dashboard = demo.demoRoot.current?.querySelector(
            ".demo-scene-dashboard",
          );
          const viewer = demo.demoRoot.current?.querySelector(
            ".demo-scene-viewer",
          );
          if (dashboard) gsap.set(dashboard, { opacity: 0, pointerEvents: "none" });
          if (viewer) gsap.set(viewer, { opacity: 1, pointerEvents: "auto" });
        }

        const tl = buildDocumentsMasterTimeline({
          refs: getRefs(),
          actions: buildActions(),
          onComplete: () => startTimelineRef.current(),
        });
        demo.masterTimeline.current = tl;
        tl.timeScale(demo.playbackSpeed);
        jumpDocumentsTimelineToStage(tl, stage);
        tl.play();
        demo.setIsPaused(false);
      });
    },
    [demo, buildActions, getRefs],
  );

  const handlePause = useCallback(() => {
    demo.masterTimeline.current?.pause();
    demo.setIsPaused(true);
  }, [demo]);

  const handleResume = useCallback(() => {
    demo.masterTimeline.current?.resume();
    demo.setIsPaused(false);
  }, [demo]);

  useLayoutEffect(() => {
    prepareScenes(demo.demoRoot.current);
  }, [demo.demoRoot]);

  useEffect(() => {
    const start = () => {
      requestAnimationFrame(() => startTimelineRef.current());
    };

    if (exportMode) {
      void document.fonts.ready.then(start);
      return () => {
        demo.masterTimeline.current?.kill();
      };
    }

    const id = requestAnimationFrame(start);
    return () => {
      cancelAnimationFrame(id);
      demo.masterTimeline.current?.kill();
    };
  }, [demo.masterTimeline, exportMode]);

  return {
    demo,
    handleJumpToStage,
    devControls: {
      onRestart: handleRestart,
      onPause: handlePause,
      onResume: handleResume,
      onJumpToStage: handleJumpToStage,
      playbackSpeed: demo.playbackSpeed,
      onSpeedChange: demo.setPlaybackSpeed,
      isPaused: demo.isPaused,
    },
  };
}
