import type { NextConfig } from "next";

const demoMode = process.env.DEMO_MODE;

const distDirs: Record<string, string> = {
  ask: ".next-ask",
  documents: ".next-documents",
  portfolio: ".next-portfolio",
  platform: ".next-platform",
};

const nextConfig: NextConfig = {
  poweredByHeader: false,
  ...(demoMode && distDirs[demoMode]
    ? { distDir: distDirs[demoMode] }
    : {}),
};

export default nextConfig;
