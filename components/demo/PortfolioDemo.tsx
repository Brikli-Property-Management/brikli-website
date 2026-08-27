"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import gsap from "gsap";
import { ArrowRight, Plus } from "lucide-react";
import { EASE, TIMELINE, getTimelineMarkers } from "@/animation/timeline";
import { FakeCursor } from "@/components/demo/FakeCursor";
import { ReviewRow, type ReviewRowState } from "@/components/demo/ReviewRow";
import { Sidebar } from "@/components/demo/Sidebar";
import {
  INITIAL_NEEDS_REVIEW_COUNT,
  initialReviewItems,
  kpiMetrics,
  upcomingEvents,
  type ReviewItem,
} from "@/data/portfolioData";
import { cn } from "@/lib/utils";

type RowStates = Record<string, ReviewRowState>;

function buildInitialRowStates(items: ReviewItem[]): RowStates {
  return Object.fromEntries(items.map((item) => [item.id, "idle" as const]));
}

function getRelativePoint(
  container: HTMLElement,
  target: HTMLElement,
  offsetX = 8,
  offsetY = 8,
) {
  const containerRect = container.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  return {
    x: targetRect.left - containerRect.left + offsetX,
    y: targetRect.top - containerRect.top + offsetY,
  };
}

function collapseRow(
  tl: gsap.core.Timeline,
  getRow: () => HTMLDivElement | null,
  at: number,
  duration: number,
  onDone: () => void,
) {
  tl.call(() => {
    const rowEl = getRow();
    if (!rowEl) {
      onDone();
      return;
    }

    const height = rowEl.offsetHeight;
    gsap.set(rowEl, { height, overflow: "hidden" });
    gsap.to(rowEl, {
      height: 0,
      paddingTop: 0,
      paddingBottom: 0,
      opacity: 0,
      duration,
      ease: EASE.inOut,
      onComplete: onDone,
    });
  }, undefined, at);
}

export function PortfolioDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const openQueueRef = useRef<HTMLButtonElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const needsReviewRef = useRef<HTMLSpanElement>(null);
  const statusBadgeRef = useRef<HTMLSpanElement>(null);
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [reviewItems, setReviewItems] = useState(initialReviewItems);
  const [needsReviewCount, setNeedsReviewCount] =
    useState(INITIAL_NEEDS_REVIEW_COUNT);
  const [rowStates, setRowStates] = useState<RowStates>(() =>
    buildInitialRowStates(initialReviewItems),
  );
  const [cursorPressed, setCursorPressed] = useState(false);
  const [openQueueHovered, setOpenQueueHovered] = useState(false);
  const [openQueueClicked, setOpenQueueClicked] = useState(false);

  const resetDemo = useCallback(() => {
    setReviewItems(initialReviewItems);
    setNeedsReviewCount(INITIAL_NEEDS_REVIEW_COUNT);
    setRowStates(buildInitialRowStates(initialReviewItems));
    setCursorPressed(false);
    setOpenQueueHovered(false);
    setOpenQueueClicked(false);

    gsap.set(cursorRef.current, { opacity: 0, x: 0, y: 0, clearProps: "transform" });
    gsap.set(openQueueRef.current, { scale: 1, clearProps: "transform" });
    gsap.set(needsReviewRef.current, { y: 0, opacity: 1, clearProps: "transform" });

    Object.values(rowRefs.current).forEach((row) => {
      if (row) gsap.set(row, { clearProps: "all", height: "auto", opacity: 1 });
    });
  }, []);

  useEffect(() => {
    const main = mainRef.current;
    const cursor = cursorRef.current;
    if (!main || !cursor) return;

    const markers = getTimelineMarkers();
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        repeat: -1,
        repeatDelay: TIMELINE.loopReset,
        onRepeat: () => flushSync(() => resetDemo()),
      });

      const startCursor = { x: 620, y: 100 };

      // 1. Dashboard visible — initial hold
      tl.to({}, { duration: TIMELINE.initialHold });

      // 2. Highlight missing lease row
      tl.call(
        () => setRowStates((p) => ({ ...p, "missing-lease": "highlighted" })),
        undefined,
        markers.highlightStart,
      );
      tl.to({}, { duration: TIMELINE.highlightRow }, markers.highlightStart);

      // 3. Extraction gate pulse
      tl.call(
        () => setRowStates((p) => ({ ...p, "missing-lease": "processing" })),
        undefined,
        markers.pulseStart,
      );

      if (statusBadgeRef.current) {
        tl.to(
          statusBadgeRef.current,
          {
            keyframes: [
              { opacity: 1, scale: 1 },
              { opacity: 0.72, scale: 1.02 },
              { opacity: 1, scale: 1 },
              { opacity: 0.72, scale: 1.02 },
              { opacity: 1, scale: 1 },
            ],
            duration: TIMELINE.statusPulseDuration,
            ease: "sine.inOut",
          },
          markers.pulseStart,
        );
      } else {
        tl.to({}, { duration: TIMELINE.statusPulseDuration }, markers.pulseStart);
      }

      // 4. Resolve + collapse row
      tl.call(
        () => setRowStates((p) => ({ ...p, "missing-lease": "resolved" })),
        undefined,
        markers.resolveStart,
      );
      tl.to({}, { duration: TIMELINE.holdAfterResolve }, markers.resolveStart);

      collapseRow(
        tl,
        () => rowRefs.current["missing-lease"],
        markers.resolveStart + TIMELINE.holdAfterResolve,
        TIMELINE.rowResolve,
        () =>
          setReviewItems((items) =>
            items.filter((item) => item.id !== "missing-lease"),
          ),
      );

      // 5. Counter 13 → 12
      tl.call(() => setNeedsReviewCount(12), undefined, markers.counter1Start);
      if (needsReviewRef.current) {
        tl.fromTo(
          needsReviewRef.current,
          { y: 8, opacity: 0 },
          { y: 0, opacity: 1, duration: TIMELINE.counterUpdate, ease: EASE.out },
          markers.counter1Start,
        );
      }

      // 6. Cursor enter + curved move to Open queue
      const cursorMoveStart = markers.cursorEnterStart + TIMELINE.cursorEnter;

      tl.set(cursor, { opacity: 0, x: startCursor.x, y: startCursor.y }, markers.cursorEnterStart);
      tl.to(cursor, { opacity: 1, duration: TIMELINE.cursorEnter, ease: EASE.out }, markers.cursorEnterStart);

      tl.to(cursor, {
        duration: TIMELINE.cursorMove,
        ease: EASE.cursor,
        onUpdate: function () {
          const progress = this.progress();
          const target = openQueueRef.current
            ? getRelativePoint(main, openQueueRef.current, 36, 8)
            : { x: 420, y: 248 };
          const midX = (startCursor.x + target.x) / 2 + 40;
          const midY = (startCursor.y + target.y) / 2 - 30;
          const t = progress;
          const inv = 1 - t;
          const x = inv * inv * startCursor.x + 2 * inv * t * midX + t * t * target.x;
          const y = inv * inv * startCursor.y + 2 * inv * t * midY + t * t * target.y;
          gsap.set(cursor, { x, y });
        },
      }, cursorMoveStart);

      // 7. Hover
      tl.call(() => setOpenQueueHovered(true), undefined, markers.cursorHoverStart);
      tl.to({}, { duration: TIMELINE.cursorHover }, markers.cursorHoverStart);

      // 8. Click
      tl.call(() => {
        setCursorPressed(true);
        setOpenQueueClicked(true);
      }, undefined, markers.clickStart);

      tl.to(
        openQueueRef.current,
        { scale: 0.97, duration: 0.1, ease: EASE.out, yoyo: true, repeat: 1 },
        markers.clickStart,
      );

      tl.call(() => {
        setCursorPressed(false);
        setOpenQueueClicked(false);
        setOpenQueueHovered(false);
      }, undefined, markers.clickStart + 0.22);

      // 9. Second row resolves
      tl.call(
        () => setRowStates((p) => ({ ...p, "rent-mismatch": "highlighted" })),
        undefined,
        markers.secondHighlightStart,
      );
      tl.to({}, { duration: TIMELINE.secondRowHighlight }, markers.secondHighlightStart);

      tl.call(
        () => setRowStates((p) => ({ ...p, "rent-mismatch": "resolved" })),
        undefined,
        markers.secondHighlightStart + TIMELINE.secondRowHighlight,
      );

      collapseRow(
        tl,
        () => rowRefs.current["rent-mismatch"],
        markers.secondHighlightStart + TIMELINE.secondRowHighlight,
        TIMELINE.secondRowResolve,
        () =>
          setReviewItems((items) =>
            items.filter((item) => item.id !== "rent-mismatch"),
          ),
      );

      // Counter 12 → 11
      tl.call(() => setNeedsReviewCount(11), undefined, markers.counter2Start);
      if (needsReviewRef.current) {
        tl.fromTo(
          needsReviewRef.current,
          { y: 8, opacity: 0 },
          { y: 0, opacity: 1, duration: TIMELINE.secondCounterUpdate, ease: EASE.out },
          markers.counter2Start,
        );
      }

      // 10. Hide cursor + hold
      tl.to(cursor, { opacity: 0, duration: 0.3, ease: EASE.out }, markers.finalHoldStart);
      tl.to({}, { duration: TIMELINE.finalHold }, markers.finalHoldStart);
    }, containerRef);

    return () => ctx.revert();
  }, [resetDemo]);

  return (
    <div
      ref={containerRef}
      className="relative flex h-[720px] w-full max-w-[1100px] overflow-hidden rounded-2xl border border-[#E8E8E6] bg-[#FAF9F6] shadow-[0_8px_40px_rgba(0,0,0,0.06)]"
    >
      <Sidebar />

      <div ref={mainRef} className="relative min-w-0 flex-1 overflow-hidden">
        <div className="flex h-full flex-col overflow-y-auto px-8 py-6">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-[26px] font-bold tracking-tight text-[#1A1A1A]">
                Portfolio home
              </h1>
              <p className="mt-0.5 text-[14px] text-[#9CA3AF]">
                Welcome back, Demo
              </p>
            </div>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-full bg-[#0F291E] px-4 py-2 text-[13px] font-medium text-white shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
              Upload files
            </button>
          </div>

          <div className="flex flex-1 gap-6">
            <div className="min-w-0 flex-1">
              <div className="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
                {kpiMetrics.map((metric) => (
                  <div
                    key={metric.id}
                    className="rounded-2xl border border-[#EFEFED] bg-white px-4 py-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
                      {metric.label}
                    </p>
                    <p className="mt-1 text-[22px] font-bold tracking-tight text-[#1A1A1A]">
                      {metric.id === "needs-review" ? (
                        <span ref={needsReviewRef}>{needsReviewCount}</span>
                      ) : (
                        metric.value
                      )}
                    </p>
                  </div>
                ))}
              </div>

              <div className="overflow-hidden rounded-2xl border border-[#EFEFED] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="flex items-center justify-between border-b border-[#EFEFED] px-5 py-3.5">
                  <h2 className="text-[15px] font-semibold text-[#1A1A1A]">
                    Needs your review
                  </h2>
                  <button
                    ref={openQueueRef}
                    type="button"
                    className={cn(
                      "flex items-center gap-1 text-[13px] font-medium transition-colors duration-150",
                      openQueueHovered || openQueueClicked
                        ? "text-[#0F291E]"
                        : "text-[#6B7280]",
                    )}
                  >
                    Open queue
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                  </button>
                </div>

                <div>
                  {reviewItems.map((item, index) => (
                    <ReviewRow
                      key={item.id}
                      ref={(el) => {
                        rowRefs.current[item.id] = el;
                      }}
                      item={item}
                      state={rowStates[item.id] ?? "idle"}
                      resolvedLabel="Ready to file"
                      isLast={index === reviewItems.length - 1}
                      statusBadgeRef={
                        item.id === "missing-lease" ? statusBadgeRef : undefined
                      }
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="hidden w-[240px] shrink-0 space-y-4 lg:block">
              <div className="rounded-2xl border border-[#EFEFED] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="mb-3 flex items-baseline justify-between">
                  <h2 className="text-[14px] font-semibold text-[#1A1A1A]">
                    Upcoming
                  </h2>
                  <span className="text-[11px] text-[#9CA3AF]">next 14 days</span>
                </div>
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex gap-3">
                      <span className="w-9 shrink-0 text-[12px] font-semibold text-[#9B2C4D]">
                        {event.date}
                      </span>
                      <div>
                        <p className="text-[12px] font-medium text-[#1A1A1A]">
                          {event.title}
                        </p>
                        <p className="text-[11px] text-[#9CA3AF]">
                          {event.subtitle}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[#EFEFED] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
                  Jump back in
                </p>
                <p className="text-[12px] font-medium text-[#1A1A1A]">
                  Ask Brikli
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-[#6B7280]">
                  what are comparable 1-bedroom rents near 244 Notre-Dame...
                </p>
                <p className="mt-2 text-[10px] text-[#9CA3AF]">12:24 PM</p>
              </div>
            </div>
          </div>
        </div>

        <FakeCursor ref={cursorRef} isPressed={cursorPressed} />
      </div>
    </div>
  );
}
