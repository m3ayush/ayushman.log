import "server-only";
import { createClient } from "./supabase/server";
import { ADMIN_EMAIL, isSupabaseConfigured } from "./supabase/config";
import type { Post } from "./types";

const COLUMNS =
  "id, title, slug, description, content, tags, hero_image, status, is_public, pub_datetime, created_at, updated_at";

/**
 * The signed-in admin user, or null. Authorisation is by email match — only
 * ADMIN_EMAIL counts as the owner even if someone else has a valid session.
 */
export async function getCurrentAdmin() {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email || user.email.toLowerCase() !== ADMIN_EMAIL) return null;
  return user;
}

/**
 * Lightweight admin check for UI display only (e.g. showing the "Admin" nav
 * link). Reads the session from the cookie WITHOUT a network round-trip, so it
 * doesn't slow down every navigation. Real security is enforced by the proxy,
 * the admin-route gate, and Postgres RLS — never by this.
 */
export async function isAdminNav(): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const email = session?.user?.email?.toLowerCase();
  return !!email && email === ADMIN_EMAIL;
}

/** All published posts, newest first — the public journal feed. */
export async function getPublishedPosts(): Promise<Post[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(COLUMNS)
    .eq("status", "published")
    .eq("is_public", true)
    .order("pub_datetime", { ascending: false });
  if (error) {
    console.error("getPublishedPosts:", error.message);
    return [];
  }
  return (data ?? []) as Post[];
}

/**
 * A single post by slug. RLS returns published posts to everyone; the admin
 * additionally sees their own drafts (for previewing before publishing).
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const { data } = await supabase.from("posts").select(COLUMNS).eq("slug", slug).maybeSingle();
  return (data as Post) ?? null;
}

/** Every post including drafts — admin dashboard only (guarded by RLS + route). */
export async function getAllPostsForAdmin(): Promise<Post[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(COLUMNS)
    .order("updated_at", { ascending: false });
  if (error) {
    console.error("getAllPostsForAdmin:", error.message);
    return [];
  }
  return (data ?? []) as Post[];
}

/** A single post by id — admin editing. */
export async function getPostById(id: string): Promise<Post | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const { data } = await supabase.from("posts").select(COLUMNS).eq("id", id).maybeSingle();
  return (data as Post) ?? null;
}

/** Distinct tags across published posts, with counts, alphabetical. */
export async function getAllTags(): Promise<{ tag: string; count: number }[]> {
  const posts = await getPublishedPosts();
  const counts = new Map<string, number>();
  for (const p of posts) {
    for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => a.tag.localeCompare(b.tag));
}

/** Published posts carrying a given tag. */
export async function getPostsByTag(tag: string): Promise<Post[]> {
  const posts = await getPublishedPosts();
  return posts.filter((p) => p.tags.includes(tag));
}
