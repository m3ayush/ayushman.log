import Link from "next/link";
import { SITE, SOCIAL_LINKS } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mx-auto mt-16 w-full max-w-3xl px-4">
      <hr className="border-border" />
      <div className="flex flex-col items-center justify-between gap-3 py-6 text-sm text-foreground/70 sm:flex-row">
        <p>
          © {new Date().getFullYear()} {SITE.author}
        </p>
        <div className="flex gap-4">
          {SOCIAL_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-accent">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
