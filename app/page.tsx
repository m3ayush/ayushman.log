import Image from "next/image";
import Link from "next/link";
import { PostCard } from "@/components/PostCard";
import { Socials } from "@/components/Socials";
import { getPublishedPosts } from "@/lib/posts";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SITE } from "@/lib/site";

export default async function HomePage() {
  const posts = await getPublishedPosts();

  return (
    <div>
      {/* Hero */}
      <section className="flex flex-col items-start gap-5 pb-6 sm:flex-row">
        <Link href="/about" className="group mx-auto block shrink-0 sm:mx-0">
          <Image
            src={SITE.avatar}
            alt={SITE.author}
            width={160}
            height={160}
            priority
            className="h-36 w-36 rounded-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl sm:h-40 sm:w-40"
          />
        </Link>
        <div className="flex-1 text-center sm:text-left">
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">{SITE.title}</h1>
          <p className="mt-2 text-lg text-foreground/70">{SITE.description}</p>
          <div className="mt-3 flex justify-center sm:justify-start">
            <Socials className="-ml-2" />
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
          <ul>
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
