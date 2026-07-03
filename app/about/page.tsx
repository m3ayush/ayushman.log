import type { Metadata } from "next";
import Image from "next/image";
import { SITE } from "@/lib/site";
import { Socials } from "@/components/Socials";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">About</h1>

      <div className="mt-6 flex flex-col items-start gap-6 sm:flex-row">
        <Image
          src={SITE.avatar}
          alt={SITE.author}
          width={160}
          height={160}
          className="w-40 rounded-lg border border-border object-cover"
        />
        <div className="prose max-w-none">
          <p>
            Hi, I&apos;m <strong>{SITE.author}</strong>. This is my public journal and
            work log — a running record of what I&apos;m building, learning, and shipping,
            day by day.
          </p>
          <p>
            Everything here is written by me. You&apos;re welcome to read along; posts
            update as I go.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <Socials className="-ml-1" />
      </div>
    </div>
  );
}
