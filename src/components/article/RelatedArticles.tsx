// components/article/RelatedArticles.tsx — Komponen biasa (Pages Router)
// Sebelumnya async Server Component; di Pages Router data diterima via props
// dari getServerSideProps di berita/[slug].tsx

import type { Article } from "@/lib/api";
import ArticleCard from "@/components/article/ArticleCard";

type Props = {
  articles: Article[];
};

export default function RelatedArticles({ articles }: Props) {
  if (articles.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Artikel Terkait</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
