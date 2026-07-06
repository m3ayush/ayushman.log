import { Editor } from "@/components/Editor";
import { getAllTagNames } from "@/lib/posts";

export const metadata = { title: "New entry" };

export default async function NewPostPage() {
  const existingTags = await getAllTagNames();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">New entry</h1>
      <Editor existingTags={existingTags} />
    </div>
  );
}
