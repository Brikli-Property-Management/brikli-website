import gsap from "gsap";
import { DEMO_EASE, TYPING_PATTERN, TYPING_SPEED } from "@/animation/timing";

export function msToSec(ms: number): number {
  return ms / 1000;
}

export function staggerDelay(index: number, baseMs: number): number {
  return msToSec(index * baseMs);
}

/** Deterministic per-character typing delay. */
export function charDelay(index: number): number {
  const pattern = TYPING_PATTERN[index % TYPING_PATTERN.length];
  return msToSec(TYPING_SPEED * pattern);
}

export type ElementQuery =
  | Element
  | null
  | undefined
  | (() => Element | null | undefined);

function resolveElement(el: ElementQuery): Element | null | undefined {
  return typeof el === "function" ? el() : el;
}

export function getElementCenter(
  el: ElementQuery,
  container: HTMLElement,
): { x: number; y: number } {
  const resolved = resolveElement(el) as HTMLElement | null | undefined;
  if (!resolved) return { x: container.clientWidth / 2, y: container.clientHeight / 2 };
  const elRect = resolved.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  return {
    x: elRect.left - containerRect.left + elRect.width / 2 - 4,
    y: elRect.top - containerRect.top + elRect.height / 2 - 2,
  };
}

type CursorActions = {
  setCursorPressed: (pressed: boolean) => void;
};

/** Smooth move — never teleports; always animates from current position. */
export function addCursorMove(
  tl: gsap.core.Timeline,
  cursor: HTMLElement,
  el: ElementQuery,
  container: HTMLElement,
  durationMs: number,
  ease: string = DEMO_EASE.cursor,
): void {
  // Resolve target position when this segment plays — timeline is built before chat input mounts.
  tl.add(() => {
    const center = getElementCenter(el, container);
    return gsap.to(cursor, {
      x: center.x,
      y: center.y,
      duration: msToSec(durationMs),
      ease,
      overwrite: "auto",
    });
  });
}

/** Slower, deliberate drag motion for chat-bar targeting. */
export function addCursorDrag(
  tl: gsap.core.Timeline,
  cursor: HTMLElement,
  el: ElementQuery,
  container: HTMLElement,
  durationMs: number,
): void {
  addCursorMove(tl, cursor, el, container, durationMs, "power1.inOut");
}

export function addCursorFadeIn(
  tl: gsap.core.Timeline,
  cursor: HTMLElement,
  durationMs = 250,
): void {
  tl.to(cursor, { opacity: 1, duration: msToSec(durationMs), ease: "power2.out" });
}

export function addCursorFadeOut(
  tl: gsap.core.Timeline,
  cursor: HTMLElement,
  durationMs = 250,
): void {
  tl.to(cursor, { opacity: 0, duration: msToSec(durationMs), ease: "power2.in" });
}

export function addCursorHoverPause(tl: gsap.core.Timeline, durationMs: number): void {
  tl.to({}, { duration: msToSec(durationMs) });
}

export function addCursorClick(
  tl: gsap.core.Timeline,
  cursor: HTMLElement,
  actions: CursorActions,
): void {
  tl.call(() => actions.setCursorPressed(true));
  tl.to(cursor, { scale: 0.88, duration: 0.08, ease: "power2.in" });
  tl.to(cursor, { scale: 1, duration: 0.12, ease: "power2.out" });
  tl.call(() => actions.setCursorPressed(false));
}

/** Move to target, brief pause, then click. */
export function addCursorMoveAndClick(
  tl: gsap.core.Timeline,
  cursor: HTMLElement,
  el: ElementQuery,
  container: HTMLElement,
  moveDurationMs: number,
  hoverPauseMs: number,
  actions: CursorActions,
): void {
  addCursorMove(tl, cursor, el, container, moveDurationMs);
  addCursorHoverPause(tl, hoverPauseMs);
  addCursorClick(tl, cursor, actions);
}

/** Let auto-scroll and layout settle before targeting a moved element. */
export function addLayoutSettlePause(tl: gsap.core.Timeline, durationMs = 220): void {
  tl.call(() => {});
  tl.to({}, { duration: msToSec(durationMs) });
}

export function addTypingSequence(
  tl: gsap.core.Timeline,
  text: string,
  onChar: (slice: string) => void,
): void {
  for (let i = 0; i < text.length; i++) {
    const slice = text.slice(0, i + 1);
    tl.call(() => onChar(slice));
    tl.to({}, { duration: charDelay(i) });
  }
}

type TypeTextOptions = {
  cursor?: HTMLElement;
  /** Restore pointer cursor visibility after typing (default: true when cursor is set). */
  restoreCursor?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  setCursorVisible?: (visible: boolean) => void;
};

/** Hide cursor, type character-by-character, then optionally restore pointer cursor. */
export function addTypeText(
  tl: gsap.core.Timeline,
  text: string,
  onChar: (slice: string) => void,
  options: TypeTextOptions = {},
): void {
  const { cursor, restoreCursor = !!cursor, onFocus, onBlur, setCursorVisible } = options;

  if (cursor) {
    tl.call(() => {
      setCursorVisible?.(false);
      gsap.set(cursor, { opacity: 0 });
    });
  }

  tl.call(() => onFocus?.());
  addTypingSequence(tl, text, onChar);
  tl.call(() => onBlur?.());

  if (cursor && restoreCursor) {
    tl.call(() => setCursorVisible?.(true));
    addCursorFadeIn(tl, cursor, 150);
  }
}

type PopInOrigin = "left" | "right" | "center";

type PopInOptions = {
  origin?: PopInOrigin;
  y?: number;
  scale?: number;
  duration?: number;
};

const POP_IN_ORIGINS: Record<PopInOrigin, string> = {
  left: "left bottom",
  right: "right bottom",
  center: "center bottom",
};

type ElementsQuery =
  | Element[]
  | NodeListOf<Element>
  | (() => Element[] | NodeListOf<Element>);

function resolveElements(els: ElementsQuery): Element[] {
  const resolved = typeof els === "function" ? els() : els;
  return Array.from(resolved);
}

function markRevealed(el: Element): void {
  el.classList.remove("opacity-0");
}

export function addPopIn(
  tl: gsap.core.Timeline,
  el: ElementQuery,
  options: PopInOptions = {},
): void {
  tl.add(() => {
    const resolved = resolveElement(el);
    if (!resolved) return;

    const { origin = "left", y = 10, scale = 0.96, duration = 0.38 } = options;
    gsap.set(resolved, { transformOrigin: POP_IN_ORIGINS[origin] });
    return gsap.fromTo(
      resolved,
      { opacity: 0, y, scale },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration,
        ease: "power2.out",
        onComplete: () => markRevealed(resolved),
      },
    );
  });
}

export function addStaggerPopIn(
  tl: gsap.core.Timeline,
  els: ElementsQuery,
  staggerMs: number,
  options: PopInOptions = {},
): void {
  tl.add(() => {
    const items = resolveElements(els);
    if (items.length === 0) return;

    const { origin = "left", y = 10, scale = 0.96, duration = 0.36 } = options;
    const innerTl = gsap.timeline();

    items.forEach((item, index) => {
      gsap.set(item, { transformOrigin: POP_IN_ORIGINS[origin] });
      innerTl.fromTo(
        item,
        { opacity: 0, y, scale },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration,
          ease: "power2.out",
          onComplete: () => markRevealed(item),
        },
        index * msToSec(staggerMs),
      );
    });

    return innerTl;
  });
}

export function initCursor(
  cursor: HTMLElement,
  container: HTMLElement,
): void {
  gsap.set(cursor, {
    x: container.clientWidth * 0.55,
    y: container.clientHeight * 0.45,
    opacity: 0,
    scale: 1,
    force3D: true,
  });
}

export function killAllTimelines(
  ...timelines: (gsap.core.Timeline | gsap.core.Tween | null | undefined)[]
): void {
  timelines.forEach((tl) => tl?.kill());
}

/** Wait for React to paint newly mounted DOM nodes before GSAP queries. */
export function addDomReadyPause(tl: gsap.core.Timeline, durationMs = 120): void {
  tl.call(() => {});
  tl.to({}, { duration: msToSec(durationMs) });
}

type CountUpOptions = {
  duration?: number;
  prefix?: string;
  suffix?: string;
  formatter?: (n: number) => string;
};

export function addCountUp(
  tl: gsap.core.Timeline,
  el: ElementQuery,
  target: number,
  options: CountUpOptions = {},
): void {
  const {
    duration = 0.6,
    prefix = "",
    suffix = "",
    formatter = (n) => Math.round(n).toLocaleString(),
  } = options;

  tl.add(() => {
    const resolved = resolveElement(el);
    if (!resolved) return;

    const proxy = { value: 0 };
    return gsap.to(proxy, {
      value: target,
      duration,
      ease: "power2.out",
      onUpdate: () => {
        resolved.textContent = `${prefix}${formatter(proxy.value)}${suffix}`;
      },
    });
  });
}

export function addAskResponseReveal(
  tl: gsap.core.Timeline,
  root: HTMLElement,
  questionIndex: number,
): void {
  const questionIds = ["leases-action", "rent-leakage", "below-market", "rent-increase"];
  const questionId = questionIds[questionIndex];
  // Resolve at playback time — timeline is built before AskResponse nodes mount.
  const getContainer = (): ParentNode =>
    root.querySelector(`[data-question="${questionId}"]`) ?? root;

  addPopIn(tl, () => getContainer().querySelector(".ask-response-header"), {
    origin: "left",
    y: 8,
    scale: 0.97,
    duration: 0.36,
  });
  tl.to({}, { duration: 0.1 });

  addPopIn(tl, () => getContainer().querySelector(".ask-kpi-headline"), {
    origin: "left",
    y: 8,
    scale: 0.98,
    duration: 0.34,
  });
  tl.to({}, { duration: 0.08 });

  tl.add(() => {
    const kpiEl = getContainer().querySelector(".ask-kpi-value [data-kpi-target]");
    const kpiTarget = kpiEl?.getAttribute("data-kpi-target");
    if (kpiEl && kpiTarget) {
      const proxy = { value: 0 };
      return gsap.to(proxy, {
        value: Number(kpiTarget),
        duration: 0.6,
        ease: "power2.out",
        onUpdate: () => {
          kpiEl.textContent = Math.round(proxy.value).toLocaleString();
        },
      });
    }

    const valueEl = getContainer().querySelector(".ask-kpi-value");
    if (!valueEl) return;

    gsap.set(valueEl, { transformOrigin: POP_IN_ORIGINS.left });
    return gsap.fromTo(
      valueEl,
      { opacity: 0, y: 6, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.32,
        ease: "power2.out",
        onComplete: () => markRevealed(valueEl),
      },
    );
  });
  tl.to({}, { duration: 0.06 });

  addPopIn(tl, () => getContainer().querySelector(".ask-kpi-subtext"), {
    origin: "left",
    y: 6,
    scale: 0.98,
    duration: 0.28,
  });
  addPopIn(tl, () => getContainer().querySelector(".ask-kpi-secondary"), {
    origin: "left",
    y: 6,
    scale: 0.98,
    duration: 0.28,
  });
  tl.to({}, { duration: 0.06 });

  addStaggerPopIn(tl, () => getContainer().querySelectorAll(".ask-row"), 80, {
    origin: "left",
    y: 8,
    scale: 0.97,
    duration: 0.32,
  });
  tl.to({}, { duration: 0.12 });

  addPopIn(tl, () => getContainer().querySelector(".ask-summary"), {
    origin: "left",
    y: 6,
    scale: 0.98,
    duration: 0.28,
  });
  addPopIn(tl, () => getContainer().querySelector(".ask-mini-viz"), {
    origin: "left",
    y: 8,
    scale: 0.98,
    duration: 0.34,
  });
  addStaggerPopIn(tl, () => getContainer().querySelectorAll(".ask-bar-row"), 60, {
    origin: "left",
    y: 4,
    scale: 0.99,
    duration: 0.26,
  });
  addPopIn(tl, () => getContainer().querySelector(".ask-comparables"), {
    origin: "left",
    y: 6,
    scale: 0.98,
    duration: 0.3,
  });
  addStaggerPopIn(tl, () => getContainer().querySelectorAll(".ask-comp-chip"), 50, {
    origin: "left",
    y: 4,
    scale: 0.99,
    duration: 0.24,
  });
  addPopIn(tl, () => getContainer().querySelector(".ask-caveat"), {
    origin: "left",
    y: 6,
    scale: 0.98,
    duration: 0.28,
  });
  addPopIn(tl, () => getContainer().querySelector(".ask-forms"), {
    origin: "left",
    y: 6,
    scale: 0.98,
    duration: 0.28,
  });
  addStaggerPopIn(tl, () => getContainer().querySelectorAll(".ask-doc-thumb"), 70, {
    origin: "center",
    y: 6,
    scale: 0.95,
    duration: 0.3,
  });
  tl.to({}, { duration: 0.08 });

  addPopIn(tl, () => getContainer().querySelector(".ask-evidence"), {
    origin: "left",
    y: 6,
    scale: 0.98,
    duration: 0.28,
  });
  addStaggerPopIn(tl, () => getContainer().querySelectorAll(".ask-evidence-chip"), 50, {
    origin: "left",
    y: 4,
    scale: 0.99,
    duration: 0.22,
  });
  tl.to({}, { duration: 0.06 });

  addPopIn(tl, () => getContainer().querySelector(".ask-recommendation"), {
    origin: "left",
    y: 8,
    scale: 0.98,
    duration: 0.34,
  });
  tl.to({}, { duration: 0.08 });

  addPopIn(tl, () => getContainer().querySelector(".ask-cta"), {
    origin: "left",
    y: 6,
    scale: 0.98,
    duration: 0.3,
  });
  addStaggerPopIn(tl, () => getContainer().querySelectorAll(".ask-cta-btn"), 60, {
    origin: "left",
    y: 4,
    scale: 0.98,
    duration: 0.26,
  });
}
