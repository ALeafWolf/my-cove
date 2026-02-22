import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export default async function MarkdownContent({
  content,
  className = "",
}: MarkdownContentProps) {
  const processed = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeHighlight, { detect: true })
    .use(rehypeStringify)
    .process(content);

  return (
    <div
      className={`markdown-content overflow-x-auto ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: processed.toString() }}
    />
  );
}
