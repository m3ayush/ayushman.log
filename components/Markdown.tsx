import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";

/** Renders Markdown source into styled HTML using our prose theme. */
export function Markdown({ source }: { source: string }) {
  return (
    <div className="prose prose-lg max-w-none prose-headings:scroll-mt-24">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeHighlight]}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
