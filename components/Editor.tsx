"use client";

import { useState } from "react";
import Link from "next/link";
import { Markdown } from "./Markdown";
import { savePost } from "@/app/admin/actions";
import { slugify } from "@/lib/utils";
import type { Post } from "@/lib/types";

/** Create/edit form with a Markdown editor + live preview. */
export function Editor({ post, existingTags = [] }: { post?: Post; existingTags?: string[] }) {
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(!!post);
  const [description, setDescription] = useState(post?.description ?? "");
  const [tags, setTags] = useState(post?.tags.join(", ") ?? "");
  const [heroImage, setHeroImage] = useState(post?.hero_image ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [isPublic, setIsPublic] = useState(post?.is_public ?? false);
  const [tab, setTab] = useState<"write" | "preview">("write");

  function onTitleChange(v: string) {
    setTitle(v);
    if (!slugEdited) setSlug(slugify(v));
  }

  // Tags typed so far, normalised for comparison against the suggestion chips.
  const selectedTags = tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const hasTag = (t: string) => selectedTags.some((s) => s.toLowerCase() === t.toLowerCase());

  function toggleTag(t: string) {
    const next = hasTag(t)
      ? selectedTags.filter((s) => s.toLowerCase() !== t.toLowerCase())
      : [...selectedTags, t];
    setTags(next.join(", "));
  }

  const inputClass =
    "w-full rounded-md border border-border bg-card px-3 py-2 outline-none focus:border-accent";

  return (
    <form action={savePost} className="space-y-4">
      {post && <input type="hidden" name="id" value={post.id} />}

      <div>
        <label className="mb-1 block text-sm font-medium">Title</label>
        <input
          name="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          required
          placeholder="What did you work on today?"
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Slug <span className="text-foreground/50">(URL)</span>
          </label>
          <input
            name="slug"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugEdited(true);
            }}
            placeholder="my-first-entry"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">
            Tags <span className="text-foreground/50">(comma separated)</span>
          </label>
          <input
            name="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="work, learning, ai"
            className={inputClass}
          />
          {existingTags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {existingTags.map((t) => {
                const on = hasTag(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTag(t)}
                    aria-pressed={on}
                    className={`rounded-full border px-2.5 py-0.5 text-xs transition-colors ${
                      on
                        ? "border-accent bg-accent text-background"
                        : "border-border text-foreground/70 hover:border-accent hover:text-accent"
                    }`}
                  >
                    {on ? "✓ " : "#"}
                    {t}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Description <span className="text-foreground/50">(shown in the feed)</span>
        </label>
        <input
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="One-line summary"
          className={inputClass}
        />
      </div>

      {/* Public / Private visibility toggle */}
      <div>
        <label className="mb-1 block text-sm font-medium">Visibility</label>
        <input type="hidden" name="is_public" value={isPublic ? "public" : "private"} />
        <div className="inline-flex rounded-md border border-border p-0.5 text-sm">
          <button
            type="button"
            onClick={() => setIsPublic(false)}
            className={`rounded px-3 py-1.5 ${!isPublic ? "bg-accent text-background" : ""}`}
          >
            🔒 Private
          </button>
          <button
            type="button"
            onClick={() => setIsPublic(true)}
            className={`rounded px-3 py-1.5 ${isPublic ? "bg-accent text-background" : ""}`}
          >
            👁 Public
          </button>
        </div>
        <p className="mt-1 text-xs text-foreground/50">
          {isPublic
            ? "Visible to everyone on the site once you publish."
            : "Kept in your admin only — flip the eye later to make it public."}
        </p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Hero image URL <span className="text-foreground/50">(optional)</span>
        </label>
        <input
          name="hero_image"
          value={heroImage}
          onChange={(e) => setHeroImage(e.target.value)}
          placeholder="https://…"
          className={inputClass}
        />
      </div>

      {/* Markdown editor with Write / Preview tabs */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <label className="text-sm font-medium">Content (Markdown)</label>
          <div className="ml-auto flex rounded-md border border-border p-0.5 text-sm">
            <button
              type="button"
              onClick={() => setTab("write")}
              className={`rounded px-3 py-1 ${tab === "write" ? "bg-accent text-background" : ""}`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setTab("preview")}
              className={`rounded px-3 py-1 ${tab === "preview" ? "bg-accent text-background" : ""}`}
            >
              Preview
            </button>
          </div>
        </div>

        {/* Keep the textarea mounted (so its value posts) but hidden in preview. */}
        <textarea
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={18}
          placeholder="# Today&#10;&#10;Write your entry in Markdown…"
          className={`${inputClass} font-mono text-sm ${tab === "preview" ? "hidden" : ""}`}
        />
        {tab === "preview" && (
          <div className="min-h-[24rem] rounded-md border border-border bg-card p-4">
            {content.trim() ? (
              <Markdown source={content} />
            ) : (
              <p className="text-foreground/50">Nothing to preview yet.</p>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="submit"
          name="intent"
          value="publish"
          className="rounded-md bg-accent px-4 py-2 font-semibold text-background"
        >
          {post?.status === "published" ? "Update & keep published" : "Publish"}
        </button>
        <button
          type="submit"
          name="intent"
          value="draft"
          className="rounded-md border border-border px-4 py-2 font-medium hover:border-accent"
        >
          Save as draft
        </button>
        <Link href="/admin" className="ml-auto text-sm text-foreground/60 hover:text-accent">
          Cancel
        </Link>
      </div>
    </form>
  );
}
