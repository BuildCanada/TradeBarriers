import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SimpleAnalytics } from "@/components/SimpleAnalytics";
import AutoHideScrollbar from "@/components/AutoHideScrollbar";

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
      <body className="bg-background text-foreground font-mono">
        <div className="min-h-screen">
          <main className="bg-background">
            <div className="min-h-screen">
              <div>{children}</div>
            </div>
          </main>

          <footer className="border-t border-border bg-background px-4 py-6">
            <div className="text-center">
              <p className="text-foreground text-sm font-mono uppercase tracking-wider">
                🏗️🇨🇦 A{" "}
                <a href="/" className="text-bloomberg-blue hover:underline">
                  BUILD CANADA
                </a>{" "}
                PROJECT
              </p>
            </div>
          </footer>
        </div>
        <Toaster />
        <SimpleAnalytics />
        <AutoHideScrollbar />
      </body>
    </html>
  );
}
