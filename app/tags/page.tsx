import type { Metadata } from "next";
import Link from "next/link";
import { getAllTags } from "@/lib/posts";

export const metadata: Metadata = { title: "Tags" };

export default async function TagsPage() {
  const tags = await getAllTags();

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Tags</h1>
      <p className="mt-1 text-foreground/70">Browse entries by topic.</p>

      {tags.length === 0 ? (
        <p className="mt-8 text-foreground/60">No tags yet.</p>
      ) : (
        <ul className="mt-6 flex flex-wrap gap-3">
          {tags.map(({ tag, count }) => (
            <li key={tag}>
              <Link
                href={`/tags/${encodeURIComponent(tag)}`}
                className="rounded-full border border-border px-3 py-1.5 text-sm hover:border-accent hover:text-accent"
              >
                #{tag} <span className="text-foreground/50">({count})</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
