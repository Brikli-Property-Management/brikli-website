import Image from "next/image";

type BrikliMarkProps = {
  size?: number;
  className?: string;
};

/** Brikli mosaic logo — uses the provided brand asset as-is. */
export function BrikliMark({ size = 32, className = "" }: BrikliMarkProps) {
  return (
    <Image
      src="/assets/brikli-logo.png"
      alt=""
      width={size}
      height={size}
      aria-hidden
      className={`shrink-0 ${className}`}
    />
  );
}
