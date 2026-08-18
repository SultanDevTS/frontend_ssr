// components/article/ArticleHeader.tsx — Server Component

import CategoryBadge from "@/components/article/CategoryBadge";
import { Article } from "@/lib/api";
import { formatDate } from "@/utils/formatDate";

type Props = {
  article: Article;
};

export default function ArticleHeader({ article }: Props) {
  return (
    <header className="space-y-4">
      <div className="flex items-center gap-3">
        <CategoryBadge category={article.category} />
        <span className="text-sm text-gray-400">
          {formatDate(article.publishedAt)}
        </span>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
        {article.title}
      </h1>

      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>Oleh</span>
        <span className="font-semibold text-gray-700">{article.author}</span>
      </div>
    </header>
  );
}
