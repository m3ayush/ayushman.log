import { SITE } from "./site";

/** Turn a title into a URL-safe slug: "My First Post!" -> "my-first-post". */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // drop punctuation
    .replace(/[\s_]+/g, "-") // spaces/underscores -> hyphen
    .replace(/-+/g, "-") // collapse repeats
    .replace(/^-|-$/g, ""); // trim hyphens
}

/** Rough reading time in whole minutes (~200 wpm), min 1. */
export function readingTime(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/**
 * A short plain-text preview from Markdown content — used as the feed excerpt
 * when a post has no explicit description. Strips code fences, headings, images,
 * link/emphasis syntax, then truncates to ~160 chars on a word boundary.
 */
export function excerpt(markdown: string, max = 160): string {
  const text = markdown
    .replace(/```[\s\S]*?```/g, " ") // fenced code blocks
    .replace(/`[^`]*`/g, " ") // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links -> link text
    .replace(/^#{1,6}\s+/gm, "") // ATX headings
    .replace(/^>\s?/gm, "") // blockquotes
    .replace(/^[-*+]\s+/gm, "") // list bullets
    .replace(/[*_~]/g, "") // emphasis markers
    .replace(/\s+/g, " ") // collapse whitespace
    .trim();
  if (text.length <= max) return text;
  const clipped = text.slice(0, max);
  const lastSpace = clipped.lastIndexOf(" ");
  return `${clipped.slice(0, lastSpace > 0 ? lastSpace : max).trimEnd()}…`;
}

/** Human date like "July 2, 2026". */
export function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(SITE.lang, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Machine ISO date (yyyy-mm-dd) for <time> elements. */
export function isoDate(iso: string | null): string {
  return iso ? new Date(iso).toISOString() : "";
}

/**
 * "Now", but the journal day doesn't roll over until 1am — publishing between
 * midnight and 1am still counts as the previous day, so a late-night entry
 * isn't stamped with tomorrow's date.
 */
export function effectivePublishDate(now = new Date()): Date {
  const eff = new Date(now);
  if (eff.getHours() < 1) eff.setDate(eff.getDate() - 1);
  return eff;
}
