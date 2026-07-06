import { notFound } from "next/navigation";
import { Editor } from "@/components/Editor";
import { getAllTagNames, getPostById } from "@/lib/posts";

type Params = { params: Promise<{ id: string }> };

export const metadata = { title: "Edit entry" };

export default async function EditPostPage({ params }: Params) {
  const { id } = await params;
  const [post, existingTags] = await Promise.all([getPostById(id), getAllTagNames()]);
  if (!post) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Edit entry</h1>
      <Editor post={post} existingTags={existingTags} />
    </div>
  );
}
