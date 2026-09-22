import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { getArticles, getCategories } from "@/lib/api";
import type { Article, Category } from "@/lib/api";
import ArticleCard from "@/components/article/ArticleCard";
import AdBillboard from "@/components/ads/AdBillboard";
import AdMediumRect from "@/components/ads/AdMediumRect";
import AdInFeed from "@/components/ads/AdInFeed";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { formatDate } from "@/utils/formatDate";

/**
 * Menyisipkan slot iklan setiap `every` artikel.
 * AdSense menentukan konten iklan otomatis — tidak perlu variant manual.
 */
function buildFeedItems(articles: Article[], every: number = 3) {
  const items: Array<
    | { kind: "article"; data: Article }
    | { kind: "ad" }
  > = [];

  articles.forEach((article, index) => {
    items.push({ kind: "article", data: article });
    // Sisipkan slot iklan setiap N artikel (tidak setelah artikel terakhir)
    if ((index + 1) % every === 0 && index + 1 < articles.length) {
      items.push({ kind: "ad" });
    }
  });

  return items;
}

type Props = {
  articlesRes: Awaited<ReturnType<typeof getArticles>>;
  categories: Category[];
  search: string | null;
  category: string | null;
};

export default function HomePage({
  articlesRes,
  categories,
  search,
  category,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const articles = articlesRes.data;

  // Nama kategori aktif (untuk heading grid)
  const activeCategory = category
    ? categories.find((c) => c.slug === category) ?? null
    : null;

  // Saat mode pencarian aktif: semua hasil masuk grid (tidak ada hero)
  // Saat mode normal: artikel pertama jadi hero, sisanya (index 1-6) masuk grid
  const featuredArticle = search ? null : articles[0];
  const gridArticles = search ? articles : articles.slice(1, 7);

  const feedItems = buildFeedItems(gridArticles, 3);

  return (
    <>
      <Head>
        <title>Beranda | PortalNews</title>
        <meta name="description" content="Baca berita terkini dari berbagai kategori" />
      </Head>

      <Header categories={categories} />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* ── HERO SECTION ───────────────────────────── */}
        {featuredArticle && (
          <section>
            <Link href={`/berita/${featuredArticle.slug}`}>
              <div className="relative w-full h-[420px] rounded-2xl overflow-hidden group">
                {featuredArticle.thumbnail ? (
                  <Image
                    src={featuredArticle.thumbnail}
                    alt={featuredArticle.title}
                    fill
                    priority
                    sizes="(max-width: 1152px) 100vw, 1152px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-lg">
                    No Image
                  </div>
                )}
                {/* Overlay gelap di bawah agar teks terbaca */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Teks di atas gambar */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <span
                    className="inline-block bg-blue-600 text-xs font-semibold 
                                   px-3 py-1 rounded-full mb-3"
                  >
                    {featuredArticle.category.name}
                  </span>
                  <h1
                    className="text-2xl md:text-3xl font-bold leading-tight 
                               line-clamp-2 mb-2"
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

        {/* ── BILLBOARD AD (di bawah hero, sebelum filter) ── */}
        {!search && <AdBillboard />}

        {/* ── FILTER KATEGORI ────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-500 mr-2">
              Kategori:
            </span>

            {/* Pill "Semua" — reset filter */}
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

            {categories.map((cat) => {
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

        {/* ── MAIN CONTENT + SIDEBAR (2 kolom) ────────── */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ── LEFT: Artikel Grid ───────────────────── */}
          <section className="flex-1 min-w-0 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {search ? (
                  <>
                    Hasil pencarian untuk{" "}
                    <span className="text-blue-600">&ldquo;{search}&rdquo;</span>
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

            {feedItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {feedItems.map((item, index) =>
                  item.kind === "article" ? (
                    <ArticleCard key={item.data.id} article={item.data} />
                  ) : (
                    <AdInFeed key={`ad-infeed-${index}`} />
                  )
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

          {/* ── RIGHT: Sidebar ───────────────────────── */}
          {!search && (
            <aside className="w-full lg:w-[300px] shrink-0 space-y-6">
              {/* Medium Rectangle Ad #1 */}
              <AdMediumRect />

              {/* Medium Rectangle Ad #2 (slot yang sama, AdSense rotate otomatis) */}
              <AdMediumRect />
            </aside>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  const search = query.search as string | undefined;
  const category = query.category as string | undefined;

  // Fetch 2 data sekaligus secara paralel
  const [articlesRes, categories] = await Promise.all([
    getArticles({ search, category }),
    getCategories(),
  ]);

  return {
    props: {
      articlesRes,
      categories,
      search: search ?? null,
      category: category ?? null,
    },
  };
};
