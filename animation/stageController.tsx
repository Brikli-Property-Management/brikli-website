"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import gsap from "gsap";
import {
  EASE,
  STAGE_DURATION,
  TRANSITION_DURATION,
  nextStage,
  type Stage,
} from "@/animation/constants";

interface DemoControllerValue {
  stage: Stage;
  progress: number;
  isTransitioning: boolean;
  goToStage: (stage: Stage) => void;
  contentRef: React.RefObject<HTMLDivElement | null>;
  registerStageTimeline: (tl: gsap.core.Timeline | null) => void;
  stageInstanceKey: number;
}

const DemoControllerContext = createContext<DemoControllerValue | null>(null);

export function useDemoController() {
  const ctx = useContext(DemoControllerContext);
  if (!ctx) {
    throw new Error("useDemoController must be used within DemoControllerProvider");
  }
  return ctx;
}

interface DemoControllerProviderProps {
  children: ReactNode;
}

export function DemoControllerProvider({ children }: DemoControllerProviderProps) {
  const [stage, setStage] = useState<Stage>("records");
  const [progress, setProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [stageInstanceKey, setStageInstanceKey] = useState(0);

  const contentRef = useRef<HTMLDivElement>(null);
  const progressTweenRef = useRef<gsap.core.Tween | null>(null);
  const transitionTweenRef = useRef<gsap.core.Tween | null>(null);
  const stageTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const progressProxyRef = useRef({ value: 0 });
  const stageRef = useRef<Stage>("records");
  const mountedRef = useRef(true);
  const goToStageRef = useRef<(target: Stage, fromManual: boolean) => void>(
    () => {},
  );

  const killProgress = useCallback(() => {
    progressTweenRef.current?.kill();
    progressTweenRef.current = null;
  }, []);

  const killStageTimeline = useCallback(() => {
    stageTimelineRef.current?.kill();
    stageTimelineRef.current = null;
  }, []);

  const registerStageTimeline = useCallback(
    (tl: gsap.core.Timeline | null) => {
      stageTimelineRef.current?.kill();
      stageTimelineRef.current = tl;
    },
    [],
  );

  const startProgress = useCallback(() => {
    killProgress();
    progressProxyRef.current.value = 0;
    setProgress(0);

    progressTweenRef.current = gsap.to(progressProxyRef.current, {
      value: 1,
      duration: STAGE_DURATION / 1000,
      ease: "none",
      onUpdate: () => {
        if (mountedRef.current) {
          setProgress(progressProxyRef.current.value);
        }
      },
      onComplete: () => {
        if (!mountedRef.current) return;
        goToStageRef.current(nextStage(stageRef.current), false);
      },
    });
  }, [killProgress]);

  const animateContentIn = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;

    transitionTweenRef.current?.kill();
    gsap.set(el, { opacity: 0, y: 8 });
    transitionTweenRef.current = gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: TRANSITION_DURATION / 1000,
      ease: EASE.smooth,
      onComplete: () => {
        if (mountedRef.current) setIsTransitioning(false);
      },
    });
  }, []);

  const goToStageInternal = useCallback(
    (target: Stage, fromManual: boolean) => {
      const isStageChange = target !== stageRef.current;

      if (isStageChange || fromManual) {
        killProgress();
        killStageTimeline();
        transitionTweenRef.current?.kill();
      }

      const beginStage = () => {
        stageRef.current = target;
        setStage(target);
        setStageInstanceKey((k) => k + 1);
        requestAnimationFrame(() => {
          animateContentIn();
          startProgress();
        });
      };

      const el = contentRef.current;

      if (isStageChange && el) {
        setIsTransitioning(true);
        gsap.to(el, {
          opacity: 0,
          y: -6,
          duration: TRANSITION_DURATION / 1000,
          ease: EASE.smooth,
          onComplete: beginStage,
        });
      } else if (fromManual) {
        beginStage();
      }
    },
    [animateContentIn, killProgress, killStageTimeline, startProgress],
  );

  goToStageRef.current = goToStageInternal;

  const goToStage = useCallback(
    (target: Stage) => {
      goToStageInternal(target, true);
    },
    [goToStageInternal],
  );

  useEffect(() => {
    mountedRef.current = true;
    stageRef.current = "records";
    animateContentIn();
    startProgress();

    return () => {
      mountedRef.current = false;
      killProgress();
      killStageTimeline();
      transitionTweenRef.current?.kill();
    };
  }, [animateContentIn, killProgress, killStageTimeline, startProgress]);

  return (
    <DemoControllerContext.Provider
      value={{
        stage,
        progress,
        isTransitioning,
        goToStage,
        contentRef,
        registerStageTimeline,
        stageInstanceKey,
      }}
    >
      {children}
    </DemoControllerContext.Provider>
  );
}
