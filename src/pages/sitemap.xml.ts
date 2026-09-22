// pages/sitemap.ts — Pages Router
// Konversi dari app/sitemap.ts (App Router)
// Mapping: app/sitemap.js → pages/sitemap.xml (via getServerSideProps + res.write)
// Fetch logic identik dengan sumber

import type { GetServerSideProps } from "next";
import { getArticles, getCategories } from "@/lib/api";
import type { Article } from "@/lib/api";

/**
 * Mengambil SELURUH artikel dari API dengan pagination loop.
 * Aman untuk artikel berapapun — tidak tergantung pada limit hardcode.
 */
async function fetchAllArticles(): Promise<Article[]> {
  const PAGE_SIZE = 100;
  const allArticles: Article[] = [];
  let currentPage = 1;

  while (true) {
    const res = await getArticles({ page: currentPage, limit: PAGE_SIZE });

    allArticles.push(...res.data);

    if (currentPage >= res.meta.totalPages) break;

    currentPage++;
  }

  return allArticles;
}

export default function Sitemap() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Fetch semua data untuk sitemap secara paralel
  const [allArticles, categories] = await Promise.all([
    fetchAllArticles(),
    getCategories(),
  ]);

  // Halaman statis
  const staticPages = [
    {
      url: siteUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];

  // Halaman kategori
  const categoryPages = categories.map((cat) => ({
    url: `${siteUrl}/kategori/${cat.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  // Halaman artikel — sekarang mencakup SEMUA artikel, bukan hanya 1000 pertama
  const articlePages = allArticles.map((article) => ({
    url: `${siteUrl}/berita/${article.slug}`,
    lastModified: new Date(article.publishedAt).toISOString(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const allPages = [...staticPages, ...categoryPages, ...articlePages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  res.setHeader("Content-Type", "text/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=59");
  res.write(xml);
  res.end();

  return { props: {} };
};
