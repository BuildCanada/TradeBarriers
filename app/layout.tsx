import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SimpleAnalytics } from "@/components/SimpleAnalytics";
import NavButton from "@/components/NavButton";

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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-background">
      <body className={`text-neutral-800 bg-background`}>
        <div className="border-2 border-black m-5">
          <main className="container mx-auto bg-background site-main-content">
            <div className="min-h-screen">
              <div className="col-span-3">{children}</div>
            </div>
          </main>

          <footer
            className="mt-16 px-4 py-8 text-neutral-300"
            style={{ backgroundColor: "#272727" }}
          >
            <div className="container mx-auto">
              <div className="mb-8">
                <p className="text-white">
                  🏗️🇨🇦 A{" "}
                  {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                  <a href="/" className="underline decoration-white">
                    Build Canada
                  </a>{" "}
                  project.
                </p>
              </div>
            </div>
          </footer>
        </div>
        <Toaster />
        <SimpleAnalytics />
      </body>
    </html>
  );
}
