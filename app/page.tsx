import Image from "next/image";
import { PostCard } from "@/components/PostCard";
import { getPublishedPosts } from "@/lib/posts";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SITE, SOCIAL_LINKS } from "@/lib/site";
import Link from "next/link";

export default async function HomePage() {
  const posts = await getPublishedPosts();

  return (
    <div>
      {/* Hero */}
      <section className="flex items-center gap-5 pb-8">
        <Image
          src={SITE.avatar}
          alt={SITE.author}
          width={80}
          height={80}
          priority
          className="h-20 w-20 shrink-0 rounded-full object-cover ring-1 ring-border"
        />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{SITE.title}</h1>
          <p className="mt-1 text-foreground/70">{SITE.description}</p>
          <div className="mt-2 flex gap-3 text-sm">
            {SOCIAL_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="text-accent hover:underline">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <hr className="border-border" />

      {/* Setup notice when the backend isn't wired up yet */}
      {!isSupabaseConfigured && (
        <div className="mt-8 rounded-lg border border-accent/40 bg-accent/10 p-4 text-sm">
          <p className="font-semibold text-accent">Almost there — connect Supabase</p>
          <p className="mt-1 text-foreground/80">
            Add your <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to <code>.env.local</code>, then run{" "}
            <code>supabase/schema.sql</code> in the Supabase SQL editor. See{" "}
            <code>README.md</code> for the 5-minute setup.
          </p>
        </div>
      )}

      {/* Feed */}
      <section className="mt-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground/50">
          Recent entries
        </h2>
        {posts.length === 0 ? (
          <p className="mt-6 text-foreground/60">
            No entries yet. {isSupabaseConfigured ? "Sign in and write your first one." : ""}
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {posts.map((post) => (
              <li key={post.id}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
