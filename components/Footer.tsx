"use client";

import { useEffect, useRef, useState } from "react";
import { SOCIALS, SUBSCRIBE_URL } from "@/lib/constants/nav";

const DONATE_URL = "https://buy.stripe.com/3cI5kCdi8a2K2xY2bgdZ600";

// The maple-leaf outline that draws itself in when the footer scrolls into
// view — same path and animation as the main site.
const MAPLE_LEAF_PATH =
  "m1063.1 460.22-131.06 1.7812h0.046875c-5.6719 0.1875-10.688-3.6562-12-9.1406l-20.062-80.859-139.92 97.922c-3.8438 2.6719-8.8594 2.9062-12.891 0.5625-4.0781-2.3438-6.375-6.8438-5.9531-11.484l22.547-255-75.234 29.531c-5.25 2.0625-11.25 0.23438-14.391-4.4531l-74.156-109.08-74.156 109.22c-3.1406 4.6875-9.1406 6.5156-14.391 4.4062l-75.234-29.625 22.547 254.86c0.42188 4.6875-1.875 9.1406-5.9531 11.484-4.0312 2.3438-9.0469 2.1562-12.891-0.5625l-139.92-97.781-20.156 80.625c-1.3594 5.4844-6.375 9.2812-12 9.1406l-131.06-1.7812 62.766 130.78c2.3906 4.875 1.2188 10.688-2.8594 14.297l-57.375 50.766 269.9 126.56c5.1094 2.3906 7.8281 8.0625 6.5625 13.547l-25.781 116.06 160.92-49.219h5.2969c0.60938-0.09375 1.2656-0.09375 1.9219 0 0.70312 0.09375 1.3594 0.28125 2.0156 0.60938l2.0625 1.3125 1.6875 1.3125 1.3125 1.9219 1.0781 2.0625c0.046875 0.79688 0.046875 1.5938 0 2.3906 0.046875 0.5625 0.046875 1.125 0 1.6875l-17.906 205.92h103.22l-19.078-204.94c-0.046875-0.51562-0.046875-0.98438 0-1.4531 0.046875-0.98438 0.28125-1.9688 0.60938-2.9062 0.1875-0.46875 0.42188-0.98438 0.70312-1.4062 0.42188-0.89062 1.0312-1.6875 1.6875-2.4375 0.375-0.42188 0.79688-0.75 1.3125-1.0781 0.65625-0.60938 1.4531-1.125 2.2969-1.5469 0.5625-0.28125 1.2188-0.51562 1.9219-0.60938 0.65625-0.09375 1.3594-0.09375 2.0156 0h5.9062l161.16 48.375-25.922-116.3c-1.2656-5.4844 1.4531-11.156 6.5625-13.547l269.76-126.1-57.328-50.766c-4.0781-3.5625-5.25-9.4219-2.9062-14.297z";

const hairline = { backgroundColor: "#f6ece3", opacity: 0.2 } as const;

const buttonBase =
  "group/btn type-label inline-flex items-center gap-2 px-5 py-3 transition-colors";

function DiagonalArrow() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      className="shrink-0 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
      aria-hidden="true"
    >
      <path
        d="M4 12l8-8M6 4h6v6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const [leafVisible, setLeafVisible] = useState(false);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLeafVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="bg-[var(--bc-charcoal)] px-5 py-16 min-[956px]:py-24 min-[1166px]:pb-10 flex flex-col items-center text-center relative overflow-hidden min-[1166px]:min-h-[600px]"
    >
      {/* Maple leaf background decoration */}
      <svg
        className="absolute pointer-events-none w-[350px] h-[350px] right-[0%] min-[426px]:w-[500px] min-[426px]:h-[500px] min-[426px]:right-[-8%]"
        style={{ bottom: "-15%", transform: "rotate(-25deg)", opacity: 0.2 }}
        viewBox="0 0 1200 1200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d={MAPLE_LEAF_PATH}
          stroke="#f6ece3"
          strokeWidth="1"
          fill="none"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={leafVisible ? undefined : "1"}
          style={
            leafVisible
              ? { animation: "drawLeaf 3s ease-out forwards" }
              : { strokeDashoffset: 1 }
          }
        />
      </svg>

      {/* Left vertical line — sticks to the 1080px content edge */}
      <div
        className="absolute top-0 bottom-0 left-5 min-[1166px]:left-[calc(50%-540px)] w-px pointer-events-none"
        style={hairline}
      />

      {/* Wordmark with decorative rules */}
      <div className="w-full max-w-[1080px] mx-auto relative mb-16 min-[956px]:mb-20 min-[1166px]:mb-10">
        {/* Right vertical line — footer top down to the bottom of the wordmark */}
        <div
          className="absolute bottom-0 right-0 w-px pointer-events-none top-[-4rem] min-[956px]:top-[-6rem]"
          style={hairline}
        />
        <div className="flex justify-center">
          <div className="relative inline-block">
            <h2
              className="text-[var(--bc-linen)] text-[clamp(36px,10vw,120px)]"
              style={{
                fontFamily: '"Soehne", sans-serif',
                fontWeight: 500,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                textTransform: "none",
              }}
            >
              Build Canada
            </h2>

            {/* Horizontal rules, flush with the top and bottom of the text */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[200vw] h-px pointer-events-none"
              style={hairline}
            />
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200vw] h-px pointer-events-none"
              style={hairline}
            />
          </div>
        </div>
      </div>

      {/* Bottom content — stacked on mobile, side by side on lg */}
      <div className="w-full max-w-[1080px] mx-auto flex flex-col min-[1166px]:flex-row min-[1166px]:gap-12 min-[1166px]:flex-1 min-[1166px]:items-end">
        {/* CTAs + quote — first on mobile, right-aligned on lg */}
        <div className="max-w-[600px] text-center min-[1166px]:text-left mb-16 min-[1166px]:mb-0 mx-auto min-[1166px]:mx-0 min-[1166px]:order-2 min-[1166px]:ml-auto">
          <div className="flex items-center justify-center min-[1166px]:justify-start gap-4 mb-5">
            <a
              href={SUBSCRIBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${buttonBase} bg-[var(--bc-linen)] text-[var(--bc-charcoal)] border border-[var(--bc-linen)] hover:bg-white hover:border-white`}
            >
              Subscribe
              <DiagonalArrow />
            </a>
            <a
              href={DONATE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${buttonBase} bg-transparent text-[var(--bc-linen)] border border-transparent hover:text-white`}
            >
              Donate
              <DiagonalArrow />
            </a>
          </div>

          <p className="font-financier text-[var(--bc-linen)] text-base leading-[1.4] max-w-[65ch] mb-3 italic">
            Whatever our errors are otherwise, we shall not err for want of
            boldness... Canada shall be the star towards which all men who love
            progress and freedom shall come.
          </p>
          <span className="type-label text-[var(--bc-linen)] font-bold">
            &mdash; Sir Wilfred Laurier
          </span>
        </div>

        {/* Socials + credits — second on mobile, left on lg */}
        <div className="flex flex-col items-center min-[1166px]:items-start gap-2 min-[1166px]:order-1 min-[1166px]:pl-[5px]">
          <div className="flex items-center gap-1.5">
            {SOCIALS.map(({ href, label, iconFile }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-7 h-7 flex items-center justify-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/trade-barriers/assets/icons/${iconFile}.svg`}
                  alt=""
                  width={18}
                  height={18}
                  className="opacity-50 hover:opacity-90 transition-opacity brightness-0 invert"
                />
              </a>
            ))}
          </div>
          <p className="type-label text-[var(--bc-muted)]">
            🏗️🇨🇦 Copyright Build Canada 2026
          </p>
          {/* Tracker-specific credit, carried over from the old footer. */}
          <p className="type-label text-[var(--bc-muted)]">
            Built by{" "}
            <a
              href="https://www.linkedin.com/in/ryan-manucha-a914a7a1/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[var(--bc-linen)] transition-colors"
            >
              Ryan
            </a>{" "}
            and{" "}
            <a
              href="https://github.com/0xsnafu"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[var(--bc-linen)] transition-colors"
            >
              Marty
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
