"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

type PopInOrigin = "left" | "right" | "center";

type UsePopInOptions = {
  origin?: PopInOrigin;
  y?: number;
  scale?: number;
  delay?: number;
  duration?: number;
  disabled?: boolean;
};

const ORIGIN_MAP: Record<PopInOrigin, string> = {
  left: "left bottom",
  right: "right bottom",
  center: "center bottom",
};

export function usePopIn<T extends HTMLElement>({
  origin = "center",
  y = 12,
  scale = 0.94,
  delay = 0,
  duration = 0.42,
  disabled = false,
}: UsePopInOptions = {}) {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;

    gsap.set(el, { transformOrigin: ORIGIN_MAP[origin] });
    gsap.fromTo(
      el,
      { opacity: 0, y, scale },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration,
        delay,
        ease: "power2.out",
      },
    );
  }, [origin, y, scale, delay, duration, disabled]);

  return ref;
}

/** Imperative pop-in for timeline-driven reveals. */
export function popInElement(
  el: Element | null | undefined,
  options: Omit<UsePopInOptions, "disabled"> = {},
): gsap.core.Tween | null {
  if (!el) return null;
  const {
    origin = "center",
    y = 12,
    scale = 0.94,
    delay = 0,
    duration = 0.42,
  } = options;

  gsap.set(el, { transformOrigin: ORIGIN_MAP[origin] });
  return gsap.fromTo(
    el,
    { opacity: 0, y, scale },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration,
      delay,
      ease: "power2.out",
    },
  );
}
