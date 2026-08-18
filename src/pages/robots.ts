// pages/robots.ts — Pages Router
// Konversi dari app/robots.ts (App Router)
// Logic identik: rules, sitemap URL

import type { GetServerSideProps } from "next";

export default function Robots() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const robotsTxt = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/
Disallow: /admin/

Sitemap: ${siteUrl}/sitemap.xml`;

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=59");
  res.write(robotsTxt);
  res.end();

  return { props: {} };
};
