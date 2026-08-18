// ── Site Info ──────────────────────────────────────────────
export const SITE_NAME = "PortalNews";
export const SITE_DESCRIPTION =
  "Portal berita terkini dan terpercaya dari berbagai kategori";

// ── Pagination ─────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_VISIBLE_CATEGORIES = 6;

// ── Revalidation (ISR) ────────────────────────────────────
export const REVALIDATE_ARTICLES = 60; // detik
export const REVALIDATE_CATEGORIES = 3600; // detik

// ── API URL untuk Client Components ───────────────────────
export const CLIENT_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3008/api";
