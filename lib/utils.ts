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
