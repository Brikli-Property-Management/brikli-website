"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  RECORDS_CHOREOGRAPHY,
  stageSeconds,
} from "@/animation/constants";
import { useDemoController } from "@/animation/stageController";
import { pipelineSteps, recordsMetrics, sourceRecords } from "@/data/demoData";
import { StatusBadge } from "@/components/demo/primitives/VerificationBadge";
import { cn } from "@/lib/utils";

const fileTypeStyles = {
  PDF: "border-[#E8D5C4] bg-[#F5EDE4] text-[#9B6B42]",
  MSG: "border-[#DDE2E8] bg-[#EEF1F4] text-[#6B7280]",
  XLS: "border-[#D4E8DA] bg-[#EDF5EF] text-[#2D5A3D]",
} as const;

function useCountUp(
  target: number,
  active: boolean,
  duration: number,
  delay: number,
) {
  const [value, setValue] = useState(0);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const proxyRef = useRef({ val: 0 });

  useEffect(() => {
    tweenRef.current?.kill();
    proxyRef.current.val = 0;
    setValue(0);

    if (!active) return;

    tweenRef.current = gsap.to(proxyRef.current, {
      val: target,
      duration,
      delay,
      ease: "power2.out",
      onUpdate: () => setValue(Math.round(proxyRef.current.val)),
    });

    return () => {
      tweenRef.current?.kill();
    };
  }, [active, target, duration, delay]);

  return value;
}

function MetricCounter({
  target,
  label,
  active,
  delay,
  duration,
}: {
  target: number;
  label: string;
  active: boolean;
  delay: number;
  duration: number;
}) {
  const value = useCountUp(target, active, duration, delay);

  return (
    <div className="text-center">
      <p className="text-[28px] font-medium tracking-tight text-[#1A1A1A] tabular-nums md:text-[32px]">
        {value.toLocaleString()}
      </p>
      <p className="mt-1 font-mono text-[9px] tracking-[0.12em] text-[#9CA3AF] uppercase">
        {label}
      </p>
    </div>
  );
}

export function RecordsStage() {
  const { registerStageTimeline, stageInstanceKey } = useDemoController();
  const rootRef = useRef<HTMLDivElement>(null);

  const [pipelineStep, setPipelineStep] = useState(-1);
  const [verifiedDocs, setVerifiedDocs] = useState<Set<string>>(new Set());
  const [metricsVisible, setMetricsVisible] = useState(false);

  useEffect(() => {
    setPipelineStep(-1);
    setVerifiedDocs(new Set());
    setMetricsVisible(false);

    const tl = gsap.timeline();

    tl.call(() => setPipelineStep(0), undefined, stageSeconds(RECORDS_CHOREOGRAPHY.pipelineStart));
    tl.call(() => setPipelineStep(1), undefined, stageSeconds(RECORDS_CHOREOGRAPHY.pipelineStart + 0.25));
    tl.call(() => setPipelineStep(2), undefined, stageSeconds(RECORDS_CHOREOGRAPHY.pipelineStart + 0.5));
    tl.call(() => setPipelineStep(3), undefined, stageSeconds(RECORDS_CHOREOGRAPHY.pipelineStart + 0.75));

    RECORDS_CHOREOGRAPHY.docVerify.forEach((time, index) => {
      const docId = sourceRecords[index]?.id;
      if (!docId) return;
      tl.call(
        () => setVerifiedDocs((prev) => new Set([...prev, docId])),
        undefined,
        stageSeconds(time),
      );
    });

    tl.call(
      () => setMetricsVisible(true),
      undefined,
      stageSeconds(RECORDS_CHOREOGRAPHY.metricsStart),
    );

    registerStageTimeline(tl);

    return () => {
      tl.kill();
    };
  }, [registerStageTimeline, stageInstanceKey]);

  return (
    <div ref={rootRef} className="flex h-full flex-col px-5 py-5 md:px-7 md:py-6">
      <div className="mb-6 flex items-center justify-center gap-2">
        {pipelineSteps.map((step, index) => (
          <div key={step} className="flex items-center gap-2">
            <span
              className={cn(
                "rounded border px-2 py-1 font-mono text-[9px] tracking-wide transition-colors duration-300",
                index <= pipelineStep
                  ? "border-[#E0E0DE] bg-white text-[#1A1A1A]"
                  : "border-[#EFEFED] text-[#9CA3AF]",
              )}
            >
              {step}
            </span>
            {index < pipelineSteps.length - 1 && (
              <span className="text-[10px] text-[#C4C4C0]">→</span>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-1 flex-col justify-center gap-2.5">
        {sourceRecords.map((record) => {
          const isVerified = verifiedDocs.has(record.id);
          return (
            <div
              key={record.id}
              className={cn(
                "flex items-center gap-3 rounded-lg border bg-white px-3 py-2.5 transition-colors duration-300 md:px-4 md:py-3",
                isVerified ? "border-[#E0E0DE]" : "border-[#EFEFED]",
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded border font-mono text-[8px] font-medium",
                  fileTypeStyles[record.type],
                )}
              >
                {record.type}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-[#1A1A1A] md:text-[14px]">
                  {record.name}
                </p>
                <p className="text-[11px] text-[#9CA3AF]">{record.description}</p>
              </div>
              <StatusBadge label="VERIFIED" variant="verified" visible={isVerified} />
            </div>
          );
        })}
      </div>

      <div
        className={cn(
          "mt-6 grid grid-cols-3 gap-4 border-t border-[#EFEFED] pt-5 transition-opacity duration-500",
          metricsVisible ? "opacity-100" : "opacity-0",
        )}
      >
        {recordsMetrics.map((metric, index) => (
          <MetricCounter
            key={metric.label}
            target={metric.value}
            label={metric.label}
            active={metricsVisible}
            delay={index * 0.08}
            duration={stageSeconds(RECORDS_CHOREOGRAPHY.metricsDuration)}
          />
        ))}
      </div>
    </div>
  );
}
