import Link from "next/link";
import { getAllPostsForAdmin } from "@/lib/posts";
import { DeleteButton } from "@/components/DeleteButton";
import { VisibilityToggle } from "@/components/VisibilityToggle";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

export default async function AdminDashboard() {
  const posts = await getAllPostsForAdmin();

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Your entries</h1>
      <p className="mt-1 text-sm text-foreground/60">
        {posts.length} total · click a title to edit · use the eye to hide/show
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
          {posts.map((post) => {
            const label =
              post.status === "draft"
                ? `Draft · edited ${formatDate(post.updated_at)}`
                : post.is_public
                  ? `Public · ${formatDate(post.pub_datetime)}`
                  : `Private · ${formatDate(post.pub_datetime)}`;

            return (
              <li key={post.id} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/edit/${post.id}`}
                    className="block truncate font-medium hover:text-accent"
                  >
                    {post.title || "(untitled)"}
                  </Link>
                  <span className="text-xs text-foreground/50">{label}</span>
                </div>

                {/* Actions: View · eye (public/private) · Delete */}
                <div className="flex shrink-0 items-center gap-2">
                  {post.status === "published" && (
                    <>
                      <Link
                        href={`/posts/${post.slug}`}
                        className="text-sm text-foreground/60 hover:text-accent"
                      >
                        View
                      </Link>
                      <VisibilityToggle id={post.id} isPublic={post.is_public} />
                    </>
                  )}
                  <DeleteButton id={post.id} title={post.title} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
