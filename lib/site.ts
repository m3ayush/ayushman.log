/**
 * Global site configuration. Edit these to make the site yours — they feed the
 * header, footer, metadata, RSS feed, and the About page.
 */
export const SITE = {
  title: "Ayushman Bhatnagar",
  author: "Ayushman Bhatnagar",
  // One-line tagline shown under your name on the home page.
  description:
    "Daily journal & work log — notes on what I'm building, learning, and shipping.",
  // Public base URL. Set NEXT_PUBLIC_SITE_URL in prod (e.g. https://yourdomain.com).
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  avatar: "/avatar.jpg",
  postsPerPage: 20,
  lang: "en",
} as const;

export const NAV_LINKS: { href: string; label: string }[] = [
  { href: "/", label: "Journal" },
  { href: "/tags", label: "Tags" },
  { href: "/about", label: "About" },
];

export const SOCIAL_LINKS: { href: string; label: string }[] = [
  { href: "https://github.com/m3ayush", label: "GitHub" },
  { href: "/rss.xml", label: "RSS" },
];
