import Link from "next/link";
import { NAV_LINKS, SITE } from "@/lib/site";
import { ThemeToggle } from "./ThemeToggle";

/** Top navigation. `isAdmin` reveals the private Admin link + New Post button. */
export function Header({ isAdmin = false }: { isAdmin?: boolean }) {
  return (
    <header className="mx-auto w-full max-w-3xl px-4">
      <div className="flex items-center justify-between gap-4 py-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight hover:text-accent"
        >
          
          <span>{SITE.title}</span>
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-2 hover:text-accent"
            >
              {l.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className="rounded-md px-3 py-2 text-accent hover:underline"
            >
              Admin
            </Link>
          )}
          <ThemeToggle />
        </nav>
      </div>
      <hr className="border-border" />
    </header>
  );
}
