import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";

import { getCategoryBySlug, getArticles, getCategories } from "@/lib/api";
import type { Article, Category } from "@/lib/types";
import { SITE_NAME } from "@/lib/constants";

import ArticleCard from "@/components/article/ArticleCard";
import CategoryHeader from "@/components/kategori/CategoryHeader";
import FilterBar from "@/components/kategori/FilterBar";
import Pagination from "@/components/kategori/Pagination";

import AdBillboard from "@/components/ads/AdBillboard";
import AdMediumRect from "@/components/ads/AdMediumRect";
import AdInFeed from "@/components/ads/AdInFeed";

type CategoryPageProps = {
  categories: Category[];
  category: Category;
  articlesRes: Awaited<ReturnType<typeof getArticles>>;
  currentPage: number;
  currentSort: "newest" | "oldest";
  slug: string;
  paginationParams: Record<string, string>;
};

function buildFeedItems(articles: Article[], every: number = 3) {
  const items: Array<
    | {
        kind: "article";
        data: Article;
      }
    | {
        kind: "ad";
      }
  > = [];

  articles.forEach((article, index) => {
    items.push({
      kind: "article",
      data: article,
    });

    if ((index + 1) % every === 0 && index + 1 < articles.length) {
      items.push({
        kind: "ad",
      });
    }
  });

  return items;
}

export const getServerSideProps: GetServerSideProps<CategoryPageProps> = async (
  context,
) => {
  const slug = context.params?.slug;

  if (typeof slug !== "string") {
    return {
      notFound: true,
    };
  }

  const page =
    typeof context.query.page === "string" ? context.query.page : undefined;

  const sort =
    typeof context.query.sort === "string" ? context.query.sort : undefined;

  const currentPage = Math.max(1, Number(page) || 1);

  const currentSort: "newest" | "oldest" =
    sort === "oldest" ? "oldest" : "newest";

  const [category, articlesRes, categories] = await Promise.all([
    getCategoryBySlug(slug),

    getArticles({
      category: slug,
      page: currentPage,
      sort: currentSort,
    }),

    getCategories(),
  ]);

  if (!category) {
    return {
      notFound: true,
    };
  }

  const paginationParams: Record<string, string> = {};

  if (sort === "oldest") {
    paginationParams.sort = "oldest";
  }

  return {
    props: {
      categories,
      category,
      articlesRes,
      currentPage,
      currentSort,
      slug,
      paginationParams,
    },
  };
};

export default function KategoriPage({
  category,
  articlesRes,
  currentPage,
  slug,
  paginationParams,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const articles = articlesRes.data;
  const feedItems = buildFeedItems(articles, 6);

  const path = `/kategori/${slug}`;
  const canonical = currentPage > 1 ? `${path}?page=${currentPage}` : path;

  const description = `Baca berita terbaru dalam kategori ${category.name}`;

  return (
    <>
      <Head>
        <title>
          {currentPage > 1
            ? `Kategori: ${category.name} - Halaman ${currentPage}`
            : `Kategori: ${category.name}`}
        </title>

        <meta name="description" content={description} />

        <link rel="canonical" href={canonical} />

        {/* Open Graph */}
        <meta
          property="og:title"
          content={`Kategori: ${category.name} | ${SITE_NAME}`}
        />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:locale" content="id_ID" />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        <CategoryHeader
          category={category}
          totalArticles={articlesRes.meta.total}
        />

        <AdBillboard />

        <FilterBar />

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 min-w-0 space-y-6">
            {feedItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {feedItems.map((item, index) =>
                  item.kind === "article" ? (
                    <ArticleCard key={item.data.id} article={item.data} />
                  ) : (
                    <div key={`ad-infeed-${index}`} className="col-span-full">
                      <AdInFeed />
                    </div>
                  ),
                )}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-16">
                Belum ada artikel dalam kategori ini.
              </p>
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={articlesRes.meta.totalPages}
              basePath={`/kategori/${slug}`}
              searchParams={paginationParams}
            />
          </div>

          <aside className="w-full lg:w-[300px] shrink-0 space-y-6">
            <AdMediumRect />
            <AdMediumRect />
          </aside>
        </div>
      </div>
    </>
  );
}
