import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import {
  getArticleBySlug,
  getComments,
  getRelatedArticles,
  getCategories,
} from "@/lib/api";
import type { Article, Category, Comment } from "@/lib/api";
import ArticleHeader from "@/components/article/ArticleHeader";
import ArticleContent from "@/components/article/ArticleContent";
import ShareButton from "@/components/article/ShareButton.client";
import LikeButton from "@/components/article/LikeButton.client";
import RelatedArticles from "@/components/article/RelatedArticles";
import CommentSection from "@/components/comment/CommentSection";
import JsonLd from "@/components/ui/JsonLd";
import AdArticleMid from "@/components/ads/AdArticleMid.client";
import AdStickyFooter from "@/components/ads/AdStickyFooter.client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

type Props = {
  article: Article;
  plainText: string;
  jsonLdData: Record<string, unknown>;
  relatedArticles: Article[];
  comments: Comment[];
  categories: Category[];
  slug: string;
};

export default function BeritaDetailPage({
  article,
  plainText,
  jsonLdData,
  relatedArticles,
  comments,
  categories,
  slug,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>{article.title} | PortalNews</title>
        <meta name="description" content={plainText} />
        <link rel="canonical" href={`/berita/${slug}`} />

        {/* OpenGraph */}
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={plainText} />
        <meta property="og:type" content="article" />
        <meta property="og:article:published_time" content={article.publishedAt} />
        <meta property="og:article:author" content={article.author} />
        <meta property="og:article:section" content={article.category.name} />
        {article.thumbnail && (
          <meta property="og:image" content={article.thumbnail} />
        )}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={plainText} />
        {article.thumbnail && (
          <meta name="twitter:image" content={article.thumbnail} />
        )}
      </Head>

      <Header categories={categories} />

      {/* JSON-LD Structured Data — Server Component */}
      <JsonLd data={jsonLdData} />

      {/* Sticky Footer Ad — Client Component (mobile only, delayed 2s) */}
      <AdStickyFooter />

      <article className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        {/* Article Header — Server Component */}
        <ArticleHeader article={article} />

        {/* Thumbnail */}
        {article.thumbnail && (
          <div className="relative w-full h-[400px] rounded-2xl overflow-hidden">
            <Image
              src={article.thumbnail}
              alt={article.title}
              fill
              priority
              sizes="(max-width: 896px) 100vw, 896px"
              className="object-cover"
            />
          </div>
        )}

        {/* ── MID-ARTICLE AD (antara thumbnail dan konten) ── */}
        <AdArticleMid />

        {/* Article Content — Server Component */}
        {article.content && <ArticleContent content={article.content} />}

        {/* Interactive buttons — Client Components (pushed to leaves) */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
          <LikeButton
            articleId={article.id}
            initialLikes={article.likes ?? 0}
          />
          <ShareButton title={article.title} slug={article.slug} />
        </div>

        {/* Related Articles */}
        <RelatedArticles articles={relatedArticles} />

        {/* Comment Section */}
        <CommentSection articleId={article.id} comments={comments} />

        {/* Back link */}
        <div className="pt-6 border-t border-gray-200">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </article>

      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
  const slug = params?.slug as string;

  // Fetch artikel terlebih dahulu (notFound jika tidak ditemukan)
  const article = await getArticleBySlug(slug);
  if (!article) return { notFound: true };

  const plainText =
    article.content?.replace(/<[^>]*>/g, "").slice(0, 160) ?? "";

  // JSON-LD Structured Data — identik dengan sumber
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    author: {
      "@type": "Person",
      name: article.author,
    },
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    ...(article.thumbnail && {
      image: [article.thumbnail],
    }),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/berita/${slug}`,
    },
    publisher: {
      "@type": "Organization",
      name: "PortalNews",
    },
    articleSection: article.category.name,
  };

  // Fetch paralel: categories (BARU — untuk Header), comments (dipindahkan dari CommentSection),
  // relatedArticles (dipindahkan dari RelatedArticles)
  const [categories, comments, relatedArticles] = await Promise.all([
    getCategories(),
    getComments(article.id),
    getRelatedArticles(article.category.slug, article.slug, 3),
  ]);

  return {
    props: {
      article,
      plainText,
      jsonLdData,
      relatedArticles,
      comments,
      categories,
      slug,
    },
  };
};
