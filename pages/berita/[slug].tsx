import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import {
  getArticleBySlug,
  getCategories,
  getComments,
  getRelatedArticles,
} from "@/lib/api";

import ArticleHeader from "@/components/article/ArticleHeader";
import ArticleContent from "@/components/article/ArticleContent";
import ShareButton from "@/components/article/ShareButton";
import LikeButton from "@/components/article/LikeButton";
import RelatedArticles from "@/components/article/RelatedArticle";
import CommentSection from "@/components/comment/CommentSection";
import JsonLd from "@/components/ui/JsonLd";

import { SITE_NAME, SITE_URL } from "@/lib/constants";

import AdArticleMid from "@/components/ads/AdArticleMid";
import AdStickyFooter from "@/components/ads/AdStickyFooter";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const slug = context.params?.slug;

  if (typeof slug !== "string") {
    return {
      notFound: true,
    };
  }

  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      notFound: true,
    };
  }

  const [relatedArticles, comments, categories] = await Promise.all([
    getRelatedArticles(article.category.slug, article.slug),
    getComments(article.id),
    getCategories(),
  ]);

  return {
    props: {
      article,
      slug,
      relatedArticles,
      comments,
      categories,
    },
  };
};

export default function BeritaDetailPage({
  article,
  slug,
  relatedArticles,
  comments,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const plainText =
    article.content?.replace(/<[^>]*>/g, "").slice(0, 160) ?? "";

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",

    headline: article.title,

    author: {
      "@type": "Person",
      name: article.author,
    },

    datePublished: article.publishedAt,

    // API belum menyediakan updatedAt
    // pada response article detail.
    dateModified: article.publishedAt,

    ...(article.thumbnail && {
      image: [article.thumbnail],
    }),

    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/berita/${slug}`,
    },

    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },

    articleSection: article.category.name,
  };

  return (
    <>
      <Head>
        <title>{article.title}</title>

        <meta name="description" content={plainText} />

        <link rel="canonical" href={`/berita/${slug}`} />

        {/* Open Graph */}
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={plainText} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`/berita/${slug}`} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:locale" content="id_ID" />
        <meta property="article:published_time" content={article.publishedAt} />
        <meta property="article:author" content={article.author} />
        <meta property="article:section" content={article.category.name} />

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

      {/* JSON-LD */}
      <JsonLd data={jsonLdData} />

      {/* Sticky Footer Ad */}
      <AdStickyFooter />

      <article className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        {/* Article Header */}
        <ArticleHeader article={article} />

        {/* Article Thumbnail */}
        {article.thumbnail && (
          <div className="relative w-full h-[400px] rounded-2xl overflow-hidden">
            <Image
              src={article.thumbnail}
              alt={article.title}
              fill
              loading="eager"
              fetchPriority="high"
              sizes="(max-width: 896px) 100vw, 896px"
              className="object-cover"
            />
          </div>
        )}

        {/* Mid Article Advertisement */}
        <AdArticleMid />

        {/* Article Content */}
        {article.content && <ArticleContent content={article.content} />}

        {/* Interactive Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
          <LikeButton
            articleId={article.id}
            initialLikes={article.likes ?? 0}
          />

          <ShareButton title={article.title} slug={article.slug} />
        </div>

        {/* Related Articles */}
        <RelatedArticles articles={relatedArticles} />

        {/* Comments */}
        <CommentSection articleId={article.id} comments={comments} />

        {/* Back Link */}
        <div className="pt-6 border-t border-gray-200">
          <Link
            href="/"
            className="
              text-blue-600
              hover:text-blue-700
              text-sm
              font-medium
              transition-colors
            "
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </article>
    </>
  );
}
