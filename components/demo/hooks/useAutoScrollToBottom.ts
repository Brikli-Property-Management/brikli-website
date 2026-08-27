"use client";

import { useEffect, useRef, type RefObject } from "react";

type UseAutoScrollToBottomOptions = {
  enabled?: boolean;
};

export function useAutoScrollToBottom(
  containerRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>,
  deps: unknown[],
  { enabled = true }: UseAutoScrollToBottomOptions = {},
) {
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;

    const scroll = (behavior: ScrollBehavior) => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        container.scrollTo({ top: container.scrollHeight, behavior });
      });
    };

    scroll("smooth");

    const content = contentRef.current;
    if (!content) return;

    const observer = new ResizeObserver(() => scroll("auto"));
    observer.observe(content);

    return () => {
      observer.disconnect();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, enabled, containerRef, contentRef]);
}
