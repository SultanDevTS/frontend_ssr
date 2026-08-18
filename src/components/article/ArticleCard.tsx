// components/article/ArticleCard.tsx — Server Component

import Link from "next/link";
import Image from "next/image";
import { Article } from "@/lib/api";
import CategoryBadge from "@/components/article/CategoryBadge";
import { formatDate } from "@/utils/formatDate";

type Props = {
  article: Article;
};

export default function ArticleCard({ article }: Props) {
  return (
    <article
      className="bg-white rounded-xl overflow-hidden shadow-sm 
                        border border-gray-100 hover:shadow-md transition-shadow"
    >
      {/* Thumbnail */}
      <Link href={`/berita/${article.slug}`}>
        <div className="relative w-full h-48">
          {article.thumbnail ? (
            <Image
              src={article.thumbnail}
              alt={article.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
              No Image
            </div>
          )}
        </div>
      </Link>

      <div className="p-4 space-y-2">
        {/* CategoryBadge menerima { name, slug } — sesuai ArticleCategory */}
        <CategoryBadge category={article.category} />

        <Link href={`/berita/${article.slug}`}>
          <h2
            className="font-bold text-gray-900 text-base leading-snug
                         hover:text-blue-600 transition-colors line-clamp-2"
          >
            {article.title}
          </h2>
        </Link>

        {/* Author + Tanggal */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-gray-500 text-xs font-medium">
            {article.author}
          </span>
          <span className="text-gray-400 text-xs">
            {formatDate(article.publishedAt)}
          </span>
        </div>
      </div>
    </article>
  );
}
