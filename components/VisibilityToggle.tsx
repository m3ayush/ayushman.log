import { toggleVisibility } from "@/app/admin/actions";

/**
 * Eye-icon button that flips a published entry between public and private.
 * Open eye = public (on the site); slashed eye = private (admin-only).
 */
export function VisibilityToggle({ id, isPublic }: { id: string; isPublic: boolean }) {
  return (
    <form action={toggleVisibility}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        title={isPublic ? "Public — click to make private" : "Private — click to make public"}
        aria-label={isPublic ? "Make private" : "Make public"}
        className={`inline-flex rounded-md p-1.5 transition-colors hover:bg-muted ${
          isPublic ? "text-green-500" : "text-foreground/40"
        }`}
      >
        {isPublic ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10-8-10-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 8 10 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        )}
      </button>
    </form>
  );
}
