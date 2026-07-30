import type { Metadata } from "next";
import { DM_Sans, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Brikli — The lease intelligence layer",
  description:
    "Brikli reads every lease, tracks every deadline, and runs every workflow for Canadian multifamily portfolios.",
  metadataBase: new URL("https://brikli.com"),
  openGraph: {
    title: "Brikli — Capture the revenue your portfolio is missing",
    description:
      "Renewals, notices, and rent increases handled before gaps become lost revenue.",
    images: ["/brikli-hero.png"],
  },
  icons: {
    icon: "/brikli.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${display.variable}`}>{children}</body>
    </html>
  );
}
