import { DocumentsDemoShell } from "@/components/demo/DocumentsDemo";
import { PortfolioDemo } from "@/components/demo/PortfolioDemo";
import { ProductDemo } from "@/components/demo/ProductDemo";
import { PlatformSection } from "@/components/platform/PlatformSection";

function DocumentsSection() {
  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-center gap-6 bg-[#EDECEA] px-4 py-12 md:px-8">
      <DocumentsDemoShell />
    </section>
  );
}

function ProductSection() {
  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-center gap-6 bg-[#EDECEA] px-4 py-12 md:px-8">
      <ProductDemo />
    </section>
  );
}

export function DemoModeHome({ mode }: { mode: string }) {
  if (mode === "ask") {
    return (
      <main className="min-h-screen bg-[#EDECEA]">
        <ProductSection />
      </main>
    );
  }

  if (mode === "portfolio") {
    return (
      <main className="min-h-screen bg-[#FAF9F6]">
        <section className="flex min-h-screen w-full flex-col items-center justify-center px-4 py-12">
          <PortfolioDemo />
        </section>
      </main>
    );
  }

  if (mode === "platform") {
    return (
      <main className="min-h-screen">
        <PlatformSection />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-[#EDECEA] py-12 md:py-16">
      <DocumentsSection />
    </main>
  );
}
