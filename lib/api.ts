import sanitize from "sanitize-html";
import type {
  Article,
  Category,
  Comment,
  PaginatedResponse,
} from "@/lib/types";

const BASE_URL = process.env.API_URL || "http://localhost:5000/api";

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

// ─────────────────────────────────────────────
// Sanitize HTML
// ─────────────────────────────────────────────

const SANITIZE_OPTIONS: sanitize.IOptions = {
  allowedTags: sanitize.defaults.allowedTags.concat([
    "img",
    "h1",
    "h2",
    "h3",
    "figure",
    "figcaption",
    "iframe",
  ]),

  allowedAttributes: {
    ...sanitize.defaults.allowedAttributes,

    img: ["src", "alt", "title", "width", "height", "loading", "decoding"],

    iframe: ["src", "width", "height", "frameborder", "allowfullscreen"],
  },

  transformTags: {
    img: sanitize.simpleTransform("img", {
      loading: "lazy",
      decoding: "async",
    }),
  },

  allowedIframeHostnames: ["www.youtube.com", "player.vimeo.com"],
};

export function sanitizeContent(html: string): string {
  return sanitize(html, SANITIZE_OPTIONS);
}

// ─────────────────────────────────────────────
// Categories
// ─────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE_URL}/categories`);

  if (!res.ok) {
    throw new Error(`[API] getCategories failed: HTTP ${res.status}`);
  }

  const json: ApiResponse<Category[]> = await res.json();

  return json.data || [];
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  const res = await fetch(`${BASE_URL}/categories/${slug}`);

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(
      `[API] getCategoryBySlug(${slug}) failed: HTTP ${res.status}`,
    );
  }

  const json: ApiResponse<Category> = await res.json();

  return json.data;
}

// ─────────────────────────────────────────────
// Articles
// ─────────────────────────────────────────────

type ArticleParams = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: "newest" | "oldest";
};

export async function getArticles(
  params: ArticleParams = {},
): Promise<PaginatedResponse<Article>> {
  const query = new URLSearchParams();

  if (params.page) {
    query.set("page", String(params.page));
  }

  if (params.limit) {
    query.set("limit", String(params.limit));
  }

  if (params.search) {
    query.set("search", params.search);
  }

  if (params.category) {
    query.set("category", params.category);
  }

  if (params.sort) {
    query.set("sort", params.sort);
  }

  const queryString = query.toString();

  const url = `${BASE_URL}/articles` + (queryString ? `?${queryString}` : "");

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`[API] getArticles failed: HTTP ${res.status}`);
  }

  return res.json();
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const res = await fetch(`${BASE_URL}/articles/${slug}`);

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(
      `[API] getArticleBySlug(${slug}) failed: HTTP ${res.status}`,
    );
  }

  const json: ApiResponse<Article> = await res.json();

  return json.data;
}

// ─────────────────────────────────────────────
// Comments
// ─────────────────────────────────────────────

export async function getComments(articleId: number): Promise<Comment[]> {
  const res = await fetch(`${BASE_URL}/comments/${articleId}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(
      `[API] getComments(${articleId}) failed: HTTP ${res.status}`,
    );
  }

  const json: ApiResponse<Comment[]> = await res.json();

  return json.data || [];
}

// ─────────────────────────────────────────────
// Related Articles
// ─────────────────────────────────────────────

export async function getRelatedArticles(
  categorySlug: string,
  excludeSlug: string,
  limit: number = 3,
): Promise<Article[]> {
  const res = await getArticles({
    category: categorySlug,
    limit: limit + 1,
  });

  return res.data
    .filter((article) => article.slug !== excludeSlug)
    .slice(0, limit);
}
