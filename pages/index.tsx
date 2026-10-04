import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { getArticles, getCategories } from "@/lib/api";
import type { Article, Category } from "@/lib/types";

import ArticleCard from "@/components/article/ArticleCard";
import AdBillboard from "@/components/ads/AdBillboard";
import AdMediumRect from "@/components/ads/AdMediumRect";
import AdInFeed from "@/components/ads/AdInFeed";

import { formatDate } from "@/utils/formatDate";

type HomePageProps = {
  articlesRes: Awaited<ReturnType<typeof getArticles>>;
  categories: Category[];
  search: string | null;
  category: string | null;
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

    // Sisipkan iklan setiap N artikel,
    // tetapi jangan setelah artikel terakhir.
    if ((index + 1) % every === 0 && index + 1 < articles.length) {
      items.push({
        kind: "ad",
      });
    }
  });

  return items;
}

export const getServerSideProps: GetServerSideProps<HomePageProps> = async (
  context,
) => {
  const search =
    typeof context.query.search === "string" ? context.query.search : null;

  const category =
    typeof context.query.category === "string" ? context.query.category : null;

  /**
   * Fetch artikel dan kategori secara paralel.
   */
  const [articlesRes, categories] = await Promise.all([
    getArticles({
      search: search ?? undefined,
      category: category ?? undefined,
    }),
    getCategories(),
  ]);

  // Props harus JSON-serializable: gunakan null, bukan undefined.
  return {
    props: {
      articlesRes,
      categories,
      search,
      category,
    },
  };
};

const HomePage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ articlesRes, categories, search, category }) => {
  /**
   * Menentukan kategori yang sedang aktif.
   */
  const activeCategory = category
    ? (categories.find((item: Category) => item.slug === category) ?? null)
    : null;

  const articles = articlesRes.data;

  /**
   * Jika sedang melakukan pencarian,
   * tidak menggunakan artikel pertama sebagai hero.
   */
  const featuredArticle = search ? null : articles[0];

  /**
   * Artikel yang ditampilkan pada grid.
   */
  const gridArticles = search ? articles : articles.slice(1, 7);

  /**
   * Gabungkan artikel dengan slot iklan.
   */
  const feedItems = buildFeedItems(gridArticles, 3);

  return (
    <>
      <Head>
        {search ? (
          <>
            <title>Hasil pencarian: {search}</title>
            <link rel="canonical" href="/" />
            <meta name="robots" content="noindex, follow" />
          </>
        ) : category ? (
          <>
            <title>Beranda</title>
            <link rel="canonical" href={`/kategori/${category}`} />
            <meta name="robots" content="noindex, follow" />
          </>
        ) : (
          <>
            <title>Beranda</title>
            <meta
              name="description"
              content="Baca berita terkini dari berbagai kategori"
            />
            <link rel="canonical" href="/" />
          </>
        )}
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* ─────────────────────────────────────────
            HERO SECTION
        ───────────────────────────────────────── */}
        {featuredArticle && (
          <section>
            <Link href={`/berita/${featuredArticle.slug}`}>
              <div className="relative w-full h-[420px] rounded-2xl overflow-hidden group">
                {featuredArticle.thumbnail ? (
                  <Image
                    src={featuredArticle.thumbnail}
                    alt={featuredArticle.title}
                    fill
                    loading="eager"
                    fetchPriority="high"
                    sizes="(max-width: 1152px) 100vw, 1152px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-lg">
                    No Image
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Hero Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <span
                    className="
                      inline-block
                      bg-blue-600
                      text-xs
                      font-semibold
                      px-3
                      py-1
                      rounded-full
                      mb-3
                    "
                  >
                    {featuredArticle.category?.name}
                  </span>

                  <h1
                    className="
                      text-2xl
                      md:text-3xl
                      font-bold
                      leading-tight
                      line-clamp-2
                      mb-2
                    "
                  >
                    {featuredArticle.title}
                  </h1>

                  <div className="flex items-center gap-3 text-white/70 text-sm">
                    <span>{featuredArticle.author}</span>

                    <span>•</span>

                    <span>{formatDate(featuredArticle.publishedAt)}</span>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* ─────────────────────────────────────────
            BILLBOARD AD
        ───────────────────────────────────────── */}
        {!search && <AdBillboard />}

        {/* ─────────────────────────────────────────
            CATEGORY FILTER
        ───────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-500 mr-2">
              Kategori:
            </span>

            {/* Semua */}
            <Link
              href="/"
              className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-all ${
                !category
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-200 text-gray-600 hover:bg-blue-600 hover:text-white hover:border-blue-600"
              }`}
            >
              Semua
            </Link>

            {/* Categories */}
            {categories.map((cat: Category) => {
              const isActive = cat.slug === category;

              return (
                <Link
                  key={cat.id}
                  href={`/?category=${cat.slug}`}
                  className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-all ${
                    isActive
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-200 text-gray-600 hover:bg-blue-600 hover:text-white hover:border-blue-600"
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>
        </section>

        {/* ─────────────────────────────────────────
            MAIN CONTENT + SIDEBAR
        ───────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* LEFT: ARTICLE GRID */}
          <section className="flex-1 min-w-0 space-y-4">
            {/* Section Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {search ? (
                  <>
                    Hasil pencarian untuk{" "}
                    <span className="text-blue-600">
                      &ldquo;{search}&rdquo;
                    </span>
                  </>
                ) : activeCategory ? (
                  <>
                    Kategori:{" "}
                    <span className="text-blue-600">{activeCategory.name}</span>
                  </>
                ) : (
                  "Artikel Terbaru"
                )}
              </h2>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">
                  {articlesRes.meta.total} artikel tersedia
                </span>

                {(search || category) && (
                  <Link
                    href="/"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    ✕ Hapus filter
                  </Link>
                )}
              </div>
            </div>

            {/* Articles */}
            {feedItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {feedItems.map((item, index) =>
                  item.kind === "article" ? (
                    <ArticleCard
                      key={item.data.id}
                      article={item.data}
                      priority={!featuredArticle && index === 0}
                    />
                  ) : (
                    <div key={`ad-infeed-${index}`} className="col-span-full">
                      <AdInFeed />
                    </div>
                  ),
                )}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-12">
                {search
                  ? `Tidak ada artikel yang cocok dengan "${search}".`
                  : "Belum ada artikel tersedia."}
              </p>
            )}
          </section>

          {/* RIGHT: SIDEBAR */}
          {!search && (
            <aside className="w-full lg:w-[300px] shrink-0 space-y-6">
              {/* Medium Rectangle Ad #1 */}
              <AdMediumRect />

              {/* Medium Rectangle Ad #2 */}
              <AdMediumRect />
            </aside>
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;
