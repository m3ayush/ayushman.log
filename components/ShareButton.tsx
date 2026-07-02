"use client";

import { useState } from "react";

/** Copies the current post URL (or uses the native share sheet on mobile). */
export function ShareButton({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // user cancelled — fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  }

  return (
    <button
      onClick={share}
      className="rounded-md border border-border px-3 py-1.5 text-sm hover:border-accent hover:text-accent"
    >
      {copied ? "Link copied ✓" : "Share"}
    </button>
  );
}
