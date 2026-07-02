import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/posts";

/** Gate: only the owner reaches anything under /admin. */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/login?next=/admin");

  return (
    <div>
      <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="font-bold hover:text-accent">
            Dashboard
          </Link>
          <Link href="/admin/new" className="text-sm text-accent hover:underline">
            + New entry
          </Link>
        </div>
        <div className="flex items-center gap-4 text-sm text-foreground/60">
          <span className="hidden sm:inline">{admin.email}</span>
          <form action="/auth/signout" method="post">
            <button className="hover:text-accent">Sign out</button>
          </form>
        </div>
      </div>
      {children}
    </div>
  );
}
