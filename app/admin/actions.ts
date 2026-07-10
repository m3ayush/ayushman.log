"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/posts";
import { slugify, effectivePublishDate } from "@/lib/utils";
import type { PostStatus } from "@/lib/types";

function parseTags(raw: string): string[] {
  return raw
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Create or update a post. Called from the editor form. The `intent` submit
 * button decides draft vs publish. Authorisation is enforced here AND by RLS.
 */
export async function savePost(formData: FormData) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/login");

  const id = (formData.get("id") as string) || null;
  const intent = (formData.get("intent") as string) || "draft";
  const status: PostStatus = intent === "publish" ? "published" : "draft";

  const title = ((formData.get("title") as string) || "").trim();
  const slug = slugify(((formData.get("slug") as string) || title).trim());
  const description = ((formData.get("description") as string) || "").trim();
  const content = (formData.get("content") as string) || "";
  const heroRaw = ((formData.get("hero_image") as string) || "").trim();
  const hero_image = heroRaw.length > 0 ? heroRaw : null;
  const tags = parseTags((formData.get("tags") as string) || "");
  // Public/private choice from the editor toggle (defaults to private).
  const is_public = (formData.get("is_public") as string) === "public";

  if (!title) redirect(`/admin/${id ? `edit/${id}` : "new"}?error=title`);

  const supabase = await createClient();

  if (id) {
    // Preserve the original publish date; only set it the first time we publish.
    const { data: existing } = await supabase
      .from("posts")
      .select("pub_datetime, status")
      .eq("id", id)
      .maybeSingle();

    const pub_datetime =
      status === "published"
        ? (existing?.pub_datetime ?? effectivePublishDate().toISOString())
        : (existing?.pub_datetime ?? null);

    const { error } = await supabase
      .from("posts")
      .update({ title, slug, description, content, hero_image, tags, status, is_public, pub_datetime })
      .eq("id", id);
    if (error) redirect(`/admin/edit/${id}?error=${encodeURIComponent(error.message)}`);
  } else {
    const pub_datetime = status === "published" ? effectivePublishDate().toISOString() : null;
    const { error } = await supabase
      .from("posts")
      .insert({ title, slug, description, content, hero_image, tags, status, is_public, pub_datetime });
    if (error) redirect(`/admin/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/");
  revalidatePath("/tags");
  if (slug) revalidatePath(`/posts/${slug}`);
  redirect("/admin");
}

/** Permanently delete a post. */
export async function deletePost(formData: FormData) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/login");

  const id = formData.get("id") as string;
  if (id) {
    const supabase = await createClient();
    await supabase.from("posts").delete().eq("id", id);
    revalidatePath("/");
    revalidatePath("/tags");
  }
  redirect("/admin");
}

/**
 * Toggle a published entry between public and private (the eye button in the
 * dashboard). Does NOT touch draft/published status, and keeps the original
 * publish date, so a re-shown entry appears under the date it was published.
 */
export async function toggleVisibility(formData: FormData) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/login");

  const id = formData.get("id") as string;
  if (!id) redirect("/admin");

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("posts")
    .select("is_public, slug")
    .eq("id", id)
    .maybeSingle();
  if (!existing) redirect("/admin");

  await supabase.from("posts").update({ is_public: !existing.is_public }).eq("id", id);

  revalidatePath("/");
  revalidatePath("/tags");
  if (existing.slug) revalidatePath(`/posts/${existing.slug}`);
  redirect("/admin");
}
