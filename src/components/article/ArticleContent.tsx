// components/article/ArticleContent.tsx — Server Component

import { sanitizeContent } from "@/lib/api";

type Props = {
  content: string;
};

export default function ArticleContent({ content }: Props) {
  const safeContent = sanitizeContent(content);

  return (
    <div
      className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: safeContent }}
    />
  );
}
