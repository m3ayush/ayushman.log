import { Editor } from "@/components/Editor";

export const metadata = { title: "New entry" };

export default function NewPostPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">New entry</h1>
      <Editor />
    </div>
  );
}
