import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { getCategoryBySlug, getArticles, getCategories } from "@/lib/api";
import type { Article, Category } from "@/lib/api";
import ArticleCard from "@/components/article/ArticleCard";
import CategoryHeader from "@/components/category/CategoryHeader";
import FilterBar from "@/components/category/FilterBar";
import Pagination from "@/components/category/Pagination";
import AdBillboard from "@/components/ads/AdBillboard";
import AdMediumRect from "@/components/ads/AdMediumRect";
import AdInFeed from "@/components/ads/AdInFeed";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

function buildFeedItems(articles: Article[], every: number = 3) {
  const items: Array<
    | { kind: "article"; data: Article }
    | { kind: "ad" }
  > = [];

  articles.forEach((article, index) => {
    items.push({ kind: "article", data: article });
    if ((index + 1) % every === 0 && index + 1 < articles.length) {
      items.push({ kind: "ad" });
    }
  });

  return items;
}

type Props = {
  category: Awaited<ReturnType<typeof getCategoryBySlug>>;
  articlesRes: Awaited<ReturnType<typeof getArticles>>;
  categories: Category[];
  currentPage: number;
  sort: string | null;
};

export default function KategoriPage({
  category,
  articlesRes,
  categories,
  currentPage,
  sort,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const articles = articlesRes.data;
  const feedItems = buildFeedItems(articles, 6);

  // Preserve search params for pagination links (tanpa page)
  const paginationParams: Record<string, string> = {};
  if (sort) paginationParams.sort = sort;

  return (
    <>
      <Head>
        <title>Kategori: {category!.name} | PortalNews</title>
        <meta
          name="description"
          content={`Baca berita terbaru dalam kategori ${category!.name}`}
        />
        <meta
          property="og:title"
          content={`Kategori: ${category!.name} | PortalNews`}
        />
        <meta
          property="og:description"
          content={`Baca berita terbaru dalam kategori ${category!.name}`}
        />
      </Head>

      <Header categories={categories} />

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        {/* Header — Server Component */}
        <CategoryHeader
          category={category!}
          totalArticles={articlesRes.meta.total}
        />

        {/* Billboard Ad — di bawah header kategori */}
        <AdBillboard />

        {/* Filter — Client Component (tanpa Suspense: tidak diperlukan di Pages Router) */}
        <FilterBar />

        {/* ── MAIN CONTENT + SIDEBAR (2 kolom) ─────── */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* LEFT: Article Grid with in-feed ads */}
          <div className="flex-1 min-w-0 space-y-6">
            {feedItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {feedItems.map((item, index) =>
                  item.kind === "article" ? (
                    <ArticleCard key={item.data.id} article={item.data} priority={index === 0}/>
                  ) : (
                    <div key={`ad-infeed-${index}`} className="col-span-full">
                      <AdInFeed />
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-16">
                Belum ada artikel dalam kategori ini.
              </p>
            )}

            {/* Pagination — Server Component (Link-based) */}
            <Pagination
              currentPage={currentPage}
              totalPages={articlesRes.meta.totalPages}
              basePath={`/kategori/${category!.slug}`}
              searchParams={paginationParams}
            />
          </div>

          <aside className="w-full lg:w-[300px] shrink-0 space-y-6">
            <AdMediumRect />
            <AdMediumRect />
          </aside>
        </div>
      </div>

      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ params, query }) => {
  const slug = params?.slug as string;
  const { page, sort } = query as { page?: string; sort?: string };

  const currentPage = Math.max(1, Number(page) || 1);

  // Fetch semua data sekaligus secara paralel
  const [category, articlesRes, categories] = await Promise.all([
    getCategoryBySlug(slug),
    getArticles({
      category: slug,
      page: currentPage,
      sort: sort || "newest",
    }),
    getCategories(),
  ]);

  if (!category) return { notFound: true };

  return {
    props: {
      category,
      articlesRes,
      categories,
      currentPage,
      sort: sort ?? null,
    },
  };
};
