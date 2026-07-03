"use client";

import { useState } from "react";
import { deletePost } from "@/app/admin/actions";

/** Delete control that asks for confirmation in a modal before deleting. */
export function DeleteButton({ id, title }: { id: string; title: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm text-red-500/80 hover:text-red-500"
      >
        Delete
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-lg border border-border bg-card p-5 shadow-xl"
          >
            <h3 className="text-lg font-bold">Delete this entry?</h3>
            <p className="mt-2 text-sm text-foreground/70">
              <span className="font-medium text-foreground">
                “{title || "Untitled"}”
              </span>{" "}
              will be permanently deleted. This can’t be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md border border-border px-3 py-1.5 text-sm hover:border-accent"
              >
                Cancel
              </button>
              <form action={deletePost}>
                <input type="hidden" name="id" value={id} />
                <button
                  type="submit"
                  className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
