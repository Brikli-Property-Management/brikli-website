/** Shared Brikli styling for the platform animation section. */
export const platformTheme = {
  sectionBg: "#EDECEA",
  cardBg: "#FAF9F6",
  vizBg: "#FFFFFF",
  border: "#EFEFED",
  borderHover: "#C8D5CC",
  borderActive: "#1D3B23",
  text: "#0F291E",
  textMuted: "rgba(15, 41, 30, 0.62)",
  textSubtle: "rgba(15, 41, 30, 0.42)",
  accent: "#0F291E",
  accentGreen: "#1D3B23",
  accentTint: "rgba(29, 59, 35, 0.06)",
  accentGradient: "linear-gradient(180deg, rgba(29, 59, 35, 0.04) 0%, rgba(29, 59, 35, 0) 100%)",
  divider: "#EFEFED",
  placeholderBg: "#F4F4F2",
  placeholderBorder: "#E8E8E6",
} as const;

/**
 * Fixed visualization viewport dimensions — all pillar scenes must fit within these bounds.
 * Uses aspect-ratio on desktop; min-height ensures consistency on mobile.
 */
export const PLATFORM_VIZ_VIEWPORT = {
  aspectRatio: "16 / 11",
  minHeightPx: 240,
  maxHeightPx: 320,
  paddingPx: 16,
} as const;
