export const TIMELINE = {
  totalDuration: 9.2,
  initialHold: 0.6,
  highlightRow: 0.35,
  statusPulseDuration: 1.4,
  holdAfterResolve: 0.4,
  rowResolve: 0.55,
  counterUpdate: 0.25,
  cursorEnter: 0.2,
  cursorMove: 1.1,
  cursorHover: 0.35,
  cursorClick: 0.45,
  secondRowHighlight: 0.3,
  secondRowResolve: 0.55,
  secondCounterUpdate: 0.25,
  finalHold: 1.2,
  loopReset: 0.1,
} as const;

export const EASE = {
  smooth: "power2.inOut",
  out: "power2.out",
  inOut: "power3.inOut",
  cursor: "power1.inOut",
} as const;

export function getTimelineMarkers() {
  let t = TIMELINE.initialHold;

  const highlightStart = t;
  t += TIMELINE.highlightRow;

  const pulseStart = t;
  t += TIMELINE.statusPulseDuration;

  const resolveStart = t;
  t += TIMELINE.holdAfterResolve + TIMELINE.rowResolve;

  const counter1Start = t;
  t += TIMELINE.counterUpdate;

  const cursorEnterStart = t;
  t += TIMELINE.cursorEnter + TIMELINE.cursorMove;

  const cursorHoverStart = t;
  t += TIMELINE.cursorHover;

  const clickStart = t;
  t += TIMELINE.cursorClick;

  const secondHighlightStart = t;
  t += TIMELINE.secondRowHighlight + TIMELINE.secondRowResolve;

  const counter2Start = t;
  t += TIMELINE.secondCounterUpdate;

  const finalHoldStart = t;
  t += TIMELINE.finalHold;

  return {
    highlightStart,
    pulseStart,
    resolveStart,
    counter1Start,
    cursorEnterStart,
    cursorHoverStart,
    clickStart,
    secondHighlightStart,
    counter2Start,
    finalHoldStart,
    loopEnd: finalHoldStart + TIMELINE.finalHold,
  };
}
