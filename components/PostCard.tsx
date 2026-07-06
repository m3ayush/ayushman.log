import Link from "next/link";
import type { Post } from "@/lib/types";
import { excerpt, formatDate, isoDate, readingTime } from "@/lib/utils";

/** A single entry in the journal feed. */
export function PostCard({ post }: { post: Post }) {
  return (
    <article className="py-6">
      <h2 className="text-xl font-bold">
        <Link href={`/posts/${post.slug}`} className="text-accent hover:underline">
          {post.title}
        </Link>
      </h2>

      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-foreground/60">
        <time dateTime={isoDate(post.pub_datetime)}>{formatDate(post.pub_datetime)}</time>
        <span aria-hidden>·</span>
        <span>{readingTime(post.content)} min read</span>
        {post.status === "draft" && (
          <span className="rounded bg-accent/15 px-1.5 py-0.5 text-xs font-semibold text-accent">
            DRAFT
          </span>
        )}
      </div>

      {(() => {
        const preview = post.description?.trim() || excerpt(post.content);
        return preview ? (
          <p className="mt-2 line-clamp-2 text-foreground/90">{preview}</p>
        ) : null;
      })()}

      {post.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <Link
              key={t}
              href={`/tags/${encodeURIComponent(t)}`}
              className="text-xs text-accent hover:underline"
            >
              #{t}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}
