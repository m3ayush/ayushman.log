import { SITE } from "@/lib/site";
import { Socials } from "./Socials";

export function Footer() {
  return (
    <footer className="mx-auto mt-16 w-full max-w-3xl px-4">
      <hr className="border-border" />
      <div className="flex flex-col items-center justify-between gap-4 py-6 text-sm text-foreground/70 sm:flex-row">
        <p>
          © {new Date().getFullYear()} {SITE.author}
        </p>
        <Socials />
      </div>
    </footer>
  );
}
