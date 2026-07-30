"use client";

import * as React from "react";
import LottieDefault, { type LottieRefCurrentProps } from "lottie-react";
import bloomOutData from "./bloom-out.json";

const Lottie = ((LottieDefault as unknown as { default?: typeof LottieDefault }).default ??
  LottieDefault) as typeof LottieDefault;
const bloomOut = bloomOutData as Record<string, unknown>;

interface BloomMarkProps extends React.ComponentProps<"div"> {
  size?: number;
  speed?: number;
  loop?: boolean;
  color?: string;
}

type LottieItem = { ty?: string; c?: { k?: number[] }; it?: LottieItem[] };

function recolor(
  data: Record<string, unknown>,
  rgb: [number, number, number],
): Record<string, unknown> {
  const clone = structuredClone(data) as { layers?: { shapes?: LottieItem[] }[] };
  const paint = (items: LottieItem[]) => {
    for (const item of items) {
      if (item.ty === "fl" && item.c?.k) {
        item.c.k = [rgb[0], rgb[1], rgb[2], item.c.k[3] ?? 1];
      }
      if (item.it) paint(item.it);
    }
  };
  for (const layer of clone.layers ?? []) {
    if (layer.shapes) paint(layer.shapes);
  }
  return clone as Record<string, unknown>;
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return reduced;
}

function BloomMark({
  size = 96,
  speed = 1,
  loop = true,
  color,
  className,
  style,
  ...props
}: BloomMarkProps) {
  const lottieRef = React.useRef<LottieRefCurrentProps>(null);
  const boxRef = React.useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [rgb, setRgb] = React.useState<[number, number, number] | null>(null);

  React.useLayoutEffect(() => {
    if (!color || !boxRef.current) {
      setRgb(null);
      return;
    }

    const probe = document.createElement("span");
    probe.style.cssText = "position:absolute;width:0;height:0;visibility:hidden";
    probe.style.color = color;
    boxRef.current.appendChild(probe);
    const parts = getComputedStyle(probe).color.match(/[\d.]+/g);
    probe.remove();
    setRgb(
      parts
        ? [Number(parts[0]) / 255, Number(parts[1]) / 255, Number(parts[2]) / 255]
        : null,
    );
  }, [color]);

  const animationData = React.useMemo(
    () => (rgb ? recolor(bloomOut, rgb) : bloomOut),
    [rgb],
  );
  const lastFrame = Math.max(0, ((bloomOut.op as number | undefined) ?? 1) - 1);

  const syncAnimation = React.useCallback(() => {
    const instance = lottieRef.current;
    if (!instance) return;
    instance.setSpeed(speed);
    if (reducedMotion) instance.goToAndStop(lastFrame, true);
  }, [lastFrame, reducedMotion, speed]);

  React.useEffect(() => {
    syncAnimation();
  }, [animationData, syncAnimation]);

  return (
    <div
      ref={boxRef}
      role="img"
      aria-label="Brikli"
      className={className}
      style={{ width: size, height: size, ...style }}
      {...props}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        loop={loop && !reducedMotion}
        autoplay={!reducedMotion}
        onDOMLoaded={syncAnimation}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}

export { BloomMark };
export type { BloomMarkProps };
