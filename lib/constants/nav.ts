// Mirrors TradingPost's src/constants/{nav-links,socials}.ts so the two sites
// present the same navigation. Keep in sync when the main site's nav changes.
type NavLink = {
  label: string;
  href: string;
  external?: boolean;
};

// These point at the main buildcanada.com app, which lives outside this
// basePath, so they are rendered as plain anchors rather than next/link.
export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Memos", href: "/memos" },
  { label: "Builders", href: "/builders" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Toronto", href: "/toronto" },
  { label: "Shop", href: "https://shop.buildcanada.com", external: true },
];

export const SOCIALS = [
  {
    label: "X",
    href: "https://x.com/buildcanada",
    iconFile: "platform-x-twitter",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/buildcanada",
    iconFile: "platform-linkedin",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@build_canada",
    iconFile: "platform-tiktok",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/build_canada/",
    iconFile: "platform-instagram",
  },
  {
    label: "Substack",
    href: "https://buildcanada.substack.com/",
    iconFile: "substack-icon",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@BuildCanada",
    iconFile: "platform-youtube",
  },
] as const;

export const SUBSCRIBE_URL = "https://buildcanada.substack.com/";
