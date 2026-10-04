import Image from "next/image";
import Link from "next/link";

import type { Article } from "@/lib/types";

import { formatDate } from "@/utils/formatDate";

type ArticleCardProps = {
  article: Article;
  priority?: boolean;
};

export default function ArticleCard({
  article,
  priority = false,
}: ArticleCardProps) {
  return (
    <article className="group">
      <Link href={`/berita/${article.slug}`}>
        <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-gray-100">
          {article.thumbnail ? (
            <Image
              src={article.thumbnail}
              alt={article.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority={priority}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>

        <div className="mt-3">
          <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
            <span className="font-medium text-blue-600">
              {article.category?.name}
            </span>

            <span>•</span>

            <span>{formatDate(article.publishedAt)}</span>
          </div>

          <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-gray-900 transition-colors group-hover:text-blue-600">
            {article.title}
          </h3>

          <div className="mt-2 text-sm text-gray-500">{article.author}</div>
        </div>
      </Link>
    </article>
  );
}
