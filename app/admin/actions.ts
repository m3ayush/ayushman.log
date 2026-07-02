"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/posts";
import { slugify } from "@/lib/utils";
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
        ? (existing?.pub_datetime ?? new Date().toISOString())
        : (existing?.pub_datetime ?? null);

    const { error } = await supabase
      .from("posts")
      .update({ title, slug, description, content, hero_image, tags, status, pub_datetime })
      .eq("id", id);
    if (error) redirect(`/admin/edit/${id}?error=${encodeURIComponent(error.message)}`);
  } else {
    const pub_datetime = status === "published" ? new Date().toISOString() : null;
    const { error } = await supabase
      .from("posts")
      .insert({ title, slug, description, content, hero_image, tags, status, pub_datetime });
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
