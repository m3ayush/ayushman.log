import Link from "next/link";
import { getAllPostsForAdmin } from "@/lib/posts";
import { deletePost } from "./actions";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

export default async function AdminDashboard() {
  const posts = await getAllPostsForAdmin();

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Your entries</h1>
      <p className="mt-1 text-sm text-foreground/60">
        {posts.length} total · click a title to edit
      </p>

      {posts.length === 0 ? (
        <p className="mt-8 text-foreground/60">
          Nothing yet.{" "}
          <Link href="/admin/new" className="text-accent hover:underline">
            Write your first entry →
          </Link>
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-border">
          {posts.map((post) => (
            <li key={post.id} className="flex items-center gap-3 py-3">
              <span
                className={`w-16 shrink-0 text-xs font-semibold uppercase ${
                  post.status === "published" ? "text-green-500" : "text-foreground/40"
                }`}
              >
                {post.status === "published" ? "Live" : "Draft"}
              </span>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/admin/edit/${post.id}`}
                  className="block truncate font-medium hover:text-accent"
                >
                  {post.title || "(untitled)"}
                </Link>
                <span className="text-xs text-foreground/50">
                  {post.status === "published"
                    ? formatDate(post.pub_datetime)
                    : `edited ${formatDate(post.updated_at)}`}
                </span>
              </div>
              {post.status === "published" && (
                <Link
                  href={`/posts/${post.slug}`}
                  className="text-sm text-foreground/60 hover:text-accent"
                >
                  View
                </Link>
              )}
              <form action={deletePost}>
                <input type="hidden" name="id" value={post.id} />
                <button className="text-sm text-red-500/80 hover:text-red-500">Delete</button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
