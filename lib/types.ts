export type PostStatus = "draft" | "published";

/** A journal entry. Mirrors the `posts` table in Supabase (see supabase/schema.sql). */
export interface Post {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string; // Markdown source
  tags: string[];
  hero_image: string | null;
  status: PostStatus;
  pub_datetime: string | null; // ISO string; set when first published
  created_at: string;
  updated_at: string;
}

/** Shape used by the editor form when creating/updating a post. */
export interface PostInput {
  title: string;
  slug: string;
  description: string;
  content: string;
  tags: string[];
  hero_image: string | null;
  status: PostStatus;
}
