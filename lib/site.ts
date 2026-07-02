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

export type SocialIcon =
  | "globe"
  | "github"
  | "linkedin"
  | "instagram"
  | "pinterest"
  | "mail"
  | "rss";

export const SOCIAL_LINKS: { href: string; label: string; icon: SocialIcon }[] = [
  { href: "https://ayushmanbhatnagar.vercel.app/", label: "Portfolio", icon: "globe" },
  { href: "https://github.com/m3ayush", label: "GitHub", icon: "github" },
  {
    href: "https://www.linkedin.com/in/ayushman-bhatnagar",
    label: "LinkedIn",
    icon: "linkedin",
  },
  {
    href: "https://www.instagram.com/_ayushmanbhatnagar_",
    label: "Instagram",
    icon: "instagram",
  },
  { href: "https://pin.it/2QdYSPpzs", label: "Pinterest", icon: "pinterest" },
  { href: "mailto:ayushman.bhatnagar@outlook.com", label: "Email", icon: "mail" },
];
