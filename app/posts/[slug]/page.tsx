import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/Markdown";
import { ShareButton } from "@/components/ShareButton";
import { getPostBySlug } from "@/lib/posts";
import { SITE } from "@/lib/site";
import { formatDate, isoDate, readingTime } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Not found" };
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.pub_datetime ?? undefined,
      images: post.hero_image ? [post.hero_image] : undefined,
    },
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const url = `${SITE.url}/posts/${post.slug}`;

  return (
    <article>
      <Link href="/" className="text-sm text-accent hover:underline">
        ← Back to journal
      </Link>

      {(post.status === "draft" || !post.is_public) && (
        <p className="mt-4 rounded-md bg-accent/15 px-3 py-2 text-sm font-semibold text-accent">
          {post.status === "draft"
            ? "This is a draft — only you can see it."
            : "This entry is private — only you can see it."}
        </p>
      )}

      <header className="mt-4">
        <h1 className="text-3xl font-bold tracking-tight text-accent">{post.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-foreground/60">
          <time dateTime={isoDate(post.pub_datetime)}>{formatDate(post.pub_datetime)}</time>
          <span aria-hidden>·</span>
          <span>{readingTime(post.content)} min read</span>
        </div>
      </header>

      {post.hero_image && (
        <Image
          src={post.hero_image}
          alt={post.title}
          width={1200}
          height={630}
          className="mt-6 w-full rounded-lg border border-border object-cover"
        />
      )}

      <div className="mt-8">
        <Markdown source={post.content} />
      </div>

      {post.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <Link
              key={t}
              href={`/tags/${encodeURIComponent(t)}`}
              className="text-sm text-accent hover:underline"
            >
              #{t}
            </Link>
          ))}
        </div>
      )}

      <hr className="my-8 border-border" />
      <div className="flex items-center justify-between">
        <Link href="/" className="text-sm text-accent hover:underline">
          ← All entries
        </Link>
        <ShareButton url={url} title={post.title} />
      </div>
    </article>
  );
}
