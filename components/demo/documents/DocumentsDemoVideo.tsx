type DocumentsDemoVideoProps = {
  className?: string;
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
};

/** Website embed for the exported documents demo recording. */
export function DocumentsDemoVideo({
  className = "w-full max-w-[1440px] rounded-xl border border-[#E8E8E6] shadow-[0_8px_40px_rgba(0,0,0,0.06)]",
  poster,
  autoPlay = true,
  loop = true,
  muted = true,
  controls = false,
}: DocumentsDemoVideoProps) {
  return (
    <video
      className={className}
      src="/videos/documents-demo.mp4"
      poster={poster}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      controls={controls}
      playsInline
      preload="metadata"
      aria-label="Brikli documents ingestion demo"
    />
  );
}
