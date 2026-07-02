import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-2 text-foreground/70">This page doesn&apos;t exist.</p>
      <Link href="/" className="mt-6 inline-block text-accent hover:underline">
        ← Back to journal
      </Link>
    </div>
  );
}
