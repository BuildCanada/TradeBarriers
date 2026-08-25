"use client";

import { useEffect, useRef, useState } from "react";
import { NAV_LINKS, SOCIALS, SUBSCRIBE_URL } from "@/lib/constants/nav";

const linkClasses =
  "flex items-center px-5 border-l border-nav-border type-label text-nav-dark hover:bg-nav-dark hover:text-nav-bg transition-colors";

const mobileLinkClasses =
  "px-5 py-5 border-b border-nav-border-light type-label text-nav-dark hover:bg-nav-dark hover:text-nav-bg transition-colors";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const hasScrolled = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!hasScrolled.current && window.scrollY > 0) {
        hasScrolled.current = true;
        setShowEmoji(true);
        setTimeout(() => setShowEmoji(false), 4000);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="border-y-2 border-nav-border flex items-stretch sticky top-[10px] z-50 bg-background">
      {/* Logo — links back to the main site, which is outside this basePath */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a
        href="/"
        className="bg-nav-accent flex items-center px-4 py-3 shrink-0 relative"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/trade-barriers/assets/logos/logo-standard.svg"
          alt="Build Canada"
          width={86}
          height={40}
          className="h-[36px] w-auto transition-opacity duration-500"
          style={{ opacity: showEmoji ? 0 : 1 }}
        />
        <span
          className="absolute inset-0 flex items-center justify-center text-2xl transition-opacity duration-500 pointer-events-none"
          style={{ opacity: showEmoji ? 1 : 0 }}
          aria-hidden="true"
        >
          🏗️🇨🇦
        </span>
      </a>

      {/* Desktop links */}
      <div className="hidden md:flex items-stretch">
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className={linkClasses}
            {...(link.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Desktop right: social icons + subscribe */}
      <div className="hidden md:flex items-center ml-auto">
        <div className="hidden lg:flex items-center gap-1.5 px-4">
          {SOCIALS.map(({ href, label, iconFile }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 flex items-center justify-center hover:opacity-80 transition-opacity group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/trade-barriers/assets/icons/${iconFile}.svg`}
                alt={label}
                width={14}
                height={14}
                className="brightness-0 opacity-40 group-hover:opacity-80 transition-opacity"
              />
            </a>
          ))}
        </div>
        <a
          href={SUBSCRIBE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center self-stretch px-5 border-l border-nav-border bg-nav-dark type-label text-nav-bg hover:bg-nav-accent transition-colors"
        >
          Subscribe
        </a>
      </div>

      {/* Mobile hamburger */}
      <button
        className="md:hidden ml-auto flex flex-col gap-1.5 justify-center px-5 border-l border-nav-border hover:bg-nav-dark transition-colors group"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        <span className="w-5 h-[2px] bg-nav-dark group-hover:bg-nav-bg transition-colors block" />
        <span className="w-5 h-[2px] bg-nav-dark group-hover:bg-nav-bg transition-colors block" />
        <span className="w-5 h-[2px] bg-nav-dark group-hover:bg-nav-bg transition-colors block" />
      </button>

      {/* Mobile menu */}
      <div
        className={`absolute top-full left-0 right-0 md:hidden z-50 grid transition-[grid-template-rows] duration-200 ease-out ${
          menuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col bg-background border-b border-nav-border">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={mobileLinkClasses}
                onClick={() => setMenuOpen(false)}
                {...(link.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {link.label}
              </a>
            ))}
            <a
              href={SUBSCRIBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-5 bg-nav-dark type-label text-nav-bg text-left"
              onClick={() => setMenuOpen(false)}
            >
              Subscribe
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
