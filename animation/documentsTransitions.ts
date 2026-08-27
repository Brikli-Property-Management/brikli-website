import gsap from "gsap";

export const FADE = {
  fast: 0.28,
  normal: 0.42,
  slow: 0.58,
  ease: "power2.inOut",
  easeOut: "power2.out",
  easeIn: "power2.in",
} as const;

export type FadeDuration = (typeof FADE)[keyof Pick<typeof FADE, "fast" | "normal" | "slow">];

export function sceneEl(
  root: HTMLElement | null,
  selector: string,
): HTMLElement | null {
  if (!root) return null;
  return root.querySelector(selector);
}

export function afterDomUpdate(
  tl: gsap.core.Timeline,
  duration = 0.06,
  position?: gsap.Position,
): void {
  tl.to({}, { duration, ease: "none" }, position);
}

export function fadeInCursor(
  tl: gsap.core.Timeline,
  cursor: Element | null | undefined,
  duration: number = FADE.normal,
  position?: gsap.Position,
): void {
  if (!cursor) return;
  tl.fromTo(
    cursor,
    { opacity: 0, scale: 1 },
    { opacity: 1, scale: 1, duration, ease: FADE.easeOut },
    position,
  );
}

export function fadeOutCursor(
  tl: gsap.core.Timeline,
  cursor: Element | null | undefined,
  duration: number = FADE.normal,
  position?: gsap.Position,
): void {
  if (!cursor) return;
  tl.to(
    cursor,
    { opacity: 0, scale: 1, duration, ease: FADE.easeIn },
    position,
  );
}

export function fadeInElLazy(
  tl: gsap.core.Timeline,
  getEl: () => Element | null,
  duration: number = FADE.normal,
  position?: gsap.Position,
  from: { opacity?: number; x?: number; y?: number; scale?: number } = {
    opacity: 0,
    y: 0,
  },
): void {
  tl.add(() => {
    const el = getEl();
    if (!el) return undefined;
    return gsap.fromTo(
      el,
      from,
      { opacity: 1, x: 0, y: 0, scale: 1, duration, ease: FADE.easeOut },
    );
  }, position);
}

export function fadeOutElLazy(
  tl: gsap.core.Timeline,
  getEl: () => Element | null,
  duration: number = FADE.normal,
  position?: gsap.Position,
  to: { opacity?: number; x?: number; y?: number; scale?: number } = {
    opacity: 0,
    y: 0,
  },
): void {
  tl.add(() => {
    const el = getEl();
    if (!el) return undefined;
    return gsap.to(el, { ...to, duration, ease: FADE.easeIn });
  }, position);
}

export function fadeModalOpenLazy(
  tl: gsap.core.Timeline,
  getOverlay: () => HTMLElement | null,
  getCard: () => HTMLElement | null,
  duration: number = FADE.normal,
  position?: gsap.Position,
): void {
  tl.add(() => {
    const overlay = getOverlay();
    const card = getCard();
    if (!overlay && !card) return undefined;

    const inner = gsap.timeline();
    if (overlay) {
      inner.fromTo(
        overlay,
        { opacity: 0 },
        { opacity: 1, duration, ease: FADE.easeOut },
        0,
      );
    }
    if (card) {
      inner.fromTo(
        card,
        { opacity: 0, y: 12, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration, ease: FADE.easeOut },
        0,
      );
    }
    return inner;
  }, position);
}

export function fadeModalCloseLazy(
  tl: gsap.core.Timeline,
  getOverlay: () => HTMLElement | null,
  getCard: () => HTMLElement | null,
  duration: number = FADE.fast,
  position?: gsap.Position,
): void {
  tl.add(() => {
    const overlay = getOverlay();
    const card = getCard();
    if (!overlay && !card) return undefined;

    const inner = gsap.timeline();
    if (card) {
      inner.to(
        card,
        {
          opacity: 0,
          y: 8,
          scale: 0.98,
          duration: duration * 0.7,
          ease: FADE.easeIn,
        },
        0,
      );
    }
    if (overlay) {
      inner.to(
        overlay,
        { opacity: 0, duration, ease: FADE.easeIn },
        card ? 0.1 : 0,
      );
    }
    return inner;
  }, position);
}

export function fadeModalStepLazy(
  tl: gsap.core.Timeline,
  getBody: () => HTMLElement | null,
  position?: gsap.Position,
): void {
  tl.add(() => {
    const body = getBody();
    if (!body) return undefined;
    return gsap.fromTo(
      body,
      { opacity: 0, y: 5 },
      { opacity: 1, y: 0, duration: FADE.fast, ease: FADE.easeOut },
    );
  }, position);
}

export function fadeInEl(
  tl: gsap.core.Timeline,
  el: Element | null | undefined,
  duration: number = FADE.normal,
  position?: gsap.Position,
  y = 0,
): void {
  if (!el) return;
  tl.fromTo(
    el,
    { opacity: 0, y },
    { opacity: 1, y: 0, duration, ease: FADE.easeOut },
    position,
  );
}

export function fadeOutEl(
  tl: gsap.core.Timeline,
  el: Element | null | undefined,
  duration: number = FADE.normal,
  position?: gsap.Position,
  y = 0,
): void {
  if (!el) return;
  tl.to(el, { opacity: 0, y, duration, ease: FADE.easeIn }, position);
}

export function crossfade(
  tl: gsap.core.Timeline,
  outEl: Element | null | undefined,
  inEl: Element | null | undefined,
  onSwap: () => void,
  duration: number = FADE.normal,
  position?: gsap.Position,
): void {
  const outDuration = duration * 0.42;
  const inDuration = duration * 0.58;

  if (outEl) {
    tl.to(
      outEl,
      { opacity: 0, duration: outDuration, ease: FADE.easeIn },
      position,
    );
  }

  tl.call(onSwap);
  tl.call(() => {
    if (outEl) {
      gsap.set(outEl, { pointerEvents: "none" });
    }
    if (inEl) {
      gsap.set(inEl, { opacity: 0, pointerEvents: "auto" });
    }
  });

  if (inEl) {
    tl.to(inEl, { opacity: 1, duration: inDuration, ease: FADE.easeOut });
  }
}

export function fadeModalOpen(
  tl: gsap.core.Timeline,
  overlay: HTMLElement | null,
  card: HTMLElement | null,
  duration: number = FADE.normal,
  position?: gsap.Position,
): void {
  if (overlay) {
    tl.fromTo(
      overlay,
      { opacity: 0 },
      { opacity: 1, duration, ease: FADE.easeOut },
      position,
    );
  }
  if (card) {
    tl.fromTo(
      card,
      { opacity: 0, y: 12, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration, ease: FADE.easeOut },
      position ?? "<",
    );
  }
}

export function fadeModalClose(
  tl: gsap.core.Timeline,
  overlay: HTMLElement | null,
  card: HTMLElement | null,
  duration: number = FADE.fast,
  position?: gsap.Position,
): void {
  if (card) {
    tl.to(
      card,
      { opacity: 0, y: 8, scale: 0.98, duration: duration * 0.7, ease: FADE.easeIn },
      position,
    );
  }
  if (overlay) {
    tl.to(
      overlay,
      { opacity: 0, duration, ease: FADE.easeIn },
      card ? "<0.1" : position,
    );
  }
}

export function fadeModalStep(
  tl: gsap.core.Timeline,
  body: HTMLElement | null,
  position?: gsap.Position,
): void {
  if (!body) return;
  tl.fromTo(
    body,
    { opacity: 0, y: 5 },
    { opacity: 1, y: 0, duration: FADE.fast, ease: FADE.easeOut },
    position,
  );
}

export function prepareScenes(root: HTMLElement | null): void {
  if (!root) return;
  gsap.set(root, { opacity: 1 });
  const dashboard = sceneEl(root, ".demo-scene-dashboard");
  const viewer = sceneEl(root, ".demo-scene-viewer");
  if (dashboard) {
    gsap.set(dashboard, { opacity: 1, y: 0, pointerEvents: "auto" });
  }
  if (viewer) {
    gsap.set(viewer, { opacity: 0, y: 0, pointerEvents: "none" });
  }
}

export function resetSceneStyles(root: HTMLElement | null): void {
  if (!root) return;
  gsap.set(root, { opacity: 1 });
  prepareScenes(root);
  root.querySelectorAll(".property-tree-panel, .processing-toast").forEach((el) => {
    gsap.set(el, { opacity: 0, x: 0, y: 0, pointerEvents: "none" });
  });
  root.querySelectorAll(".upload-modal-overlay").forEach((el) => {
    gsap.set(el, { opacity: 0, pointerEvents: "none" });
  });
  root.querySelectorAll(".upload-modal-card").forEach((el) => {
    gsap.set(el, { opacity: 0, y: 12, scale: 0.98, clearProps: "transform" });
  });
  root.querySelectorAll(".upload-modal-body").forEach((el) => {
    gsap.set(el, { opacity: 1, y: 0 });
  });
}

/** Hide modal body, swap React content, then fade body back in — avoids step-change flash */
export function swapModalStepLazy(
  tl: gsap.core.Timeline,
  getBody: () => HTMLElement | null,
  onSwap: () => void,
  position?: gsap.Position,
): void {
  tl.call(() => {
    const body = getBody();
    if (body) gsap.set(body, { opacity: 0, y: 4 });
  }, undefined, position);
  tl.call(onSwap);
  afterDomUpdate(tl);
  tl.add(() => {
    const body = getBody();
    if (!body) return undefined;
    return gsap.to(body, {
      opacity: 1,
      y: 0,
      duration: FADE.fast,
      ease: FADE.easeOut,
    });
  });
}
