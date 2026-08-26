import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SimpleAnalytics } from "@/components/SimpleAnalytics";
import AutoHideScrollbar from "@/components/AutoHideScrollbar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// SVG for the emoji favicon: 🏗️🇨🇦 using separate text elements, further reduced font
// and Unicode escape for the Canadian flag emoji.
const canadianFlagEmoji = "\u{1F1E8}\u{1F1E6}"; // 🇨🇦
const emojiFaviconSvg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
    <text x='5' y='65' font-size='45'>🏗️</text>
    <text x='50' y='65' font-size='45'>${canadianFlagEmoji}</text>
  </svg>`;

const faviconDataUrl = `data:image/svg+xml,${encodeURIComponent(emojiFaviconSvg)}`;
const title = `Interprovincial Trade Barriers Tracker - Build Canada 🏗️${canadianFlagEmoji}`;
const description = "Track the progress of Canada's government initiatives";
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://buildcanada.com",
  ),
  title,
  description,
  icons: {
    icon: faviconDataUrl,
    // You could also specify other icon types if needed, e.g.:
    // apple: faviconDataUrl, // For Apple touch icon
    // shortcut: faviconDataUrl, // For older browsers
  },
  openGraph: {
    title,
    description,
    images: [
      {
        url: "/trade-barriers/seo_image.png",
        width: 1200,
        height: 630,
        alt: "Build Canada",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/trade-barriers/seo_image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[var(--bc-frame)] text-foreground">
        {/* Keeps the top gutter the page colour so the sticky nav slides
            under linen rather than the grey frame. Mirrors the main site. */}
        <div className="fixed top-0 left-0 right-0 h-[10px] bg-background z-40" />

        {/* The gutter lives here, not on <body> — the overlay-scrollbar rules
            below force `body { padding-right: 0 }`, which ate the right edge. */}
        <div className="p-[10px]">
          <div className="bg-background border-x-2 border-b-2 border-[var(--bc-charcoal)] min-h-[calc(100vh_-_20px)]">
            <Navbar />

            <main className="bg-background">
              {/* Inset content panel with a hairline rule — the main site
                  applies this to each page's own root wrapper. */}
              <div className="mx-[10px] my-[10px] border border-[var(--bc-border-light)] bg-background overflow-x-clip">
                {children}
              </div>
            </main>

            <Footer />
          </div>
        </div>
        <Toaster />
        <SimpleAnalytics />
        <AutoHideScrollbar />
      </body>
    </html>
  );
}
