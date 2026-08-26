"use client";

import { PlatformGrid } from "@/components/platform/PlatformGrid";
import { platformTheme } from "@/components/platform/platformTheme";

export function PlatformSection() {
  return (
    <section
      className="flex min-h-screen w-full flex-col items-center justify-center py-12 md:py-16"
      style={{ background: platformTheme.sectionBg }}
    >
      <PlatformGrid />
    </section>
  );
}
