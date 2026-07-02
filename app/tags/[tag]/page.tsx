import type { Metadata } from "next";
import Link from "next/link";
import { PostCard } from "@/components/PostCard";
import { getPostsByTag } from "@/lib/posts";

type Params = { params: Promise<{ tag: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { tag } = await params;
  return { title: `#${decodeURIComponent(tag)}` };
}

export default async function TagPage({ params }: Params) {
  const { tag: raw } = await params;
  const tag = decodeURIComponent(raw);
  const posts = await getPostsByTag(tag);

  return (
    <div>
      <Link href="/tags" className="text-sm text-accent hover:underline">
        ← All tags
      </Link>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">#{tag}</h1>
      <p className="mt-1 text-foreground/70">
        {posts.length} {posts.length === 1 ? "entry" : "entries"}
      </p>

      <ul className="mt-4">
        {posts.map((post) => (
          <li key={post.id}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>
    </div>
  );
}
