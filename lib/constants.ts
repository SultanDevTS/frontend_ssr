// ── Site Info ──────────────────────────────────────────────
export const SITE_NAME = "BeritaUpToDate";
export const SITE_DESCRIPTION = "Portal berita terkini dan terupdate";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// ── Pagination ─────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_VISIBLE_CATEGORIES = 6;

// ── API URL untuk Client Components ───────────────────────
export const CLIENT_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3008/api";
