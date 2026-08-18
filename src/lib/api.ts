import sanitize from "sanitize-html";

// Server-side only env var — tidak terekspos ke client bundle
const BASE_URL = process.env.API_URL || "http://localhost:3008/api";

// ── Types ──────────────────────────────────────────────────

export type Category = {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
};

export type ArticleCategory = {
  name: string;
  slug: string;
};

export type Article = {
  id: number;
  title: string;
  author: string;
  slug: string;
  content?: string;
  thumbnail: string;
  category: ArticleCategory;
  publishedAt: string;
  likes?: number;
};

export type Comment = {
  id: number;
  articleId: number;
  name: string;
  content: string;
  createdAt: string;
};

export type PaginatedResponse<T> = {
  success: boolean;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

// ── Sanitize HTML (mencegah XSS) ──────────────────────────

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
    img: ["src", "alt", "title", "width", "height", "loading"],
    iframe: ["src", "width", "height", "frameborder", "allowfullscreen"],
  },
  allowedIframeHostnames: ["www.youtube.com", "player.vimeo.com"],
};

export function sanitizeContent(html: string): string {
  return sanitize(html, SANITIZE_OPTIONS);
}

// ── API Functions (Server Component only) ─────────────────

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${BASE_URL}/categories`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("Gagal mengambil kategori");
    const json: ApiResponse<Category[]> = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("[API Error] getCategories failed:", error);
    return [];
  }
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  try {
    const res = await fetch(`${BASE_URL}/categories/${slug}`, {
      next: { revalidate: 3600 },
    });

    if (res.status === 404 || !res.ok) return null;
    const json: ApiResponse<Category> = await res.json();
    return json.data;
  } catch (error) {
    console.error(`[API Error] getCategoryBySlug(${slug}) failed:`, error);
    return null;
  }
}

// Article
type ArticleParams = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: string;
};

export async function getArticles(
  params: ArticleParams = {},
): Promise<PaginatedResponse<Article>> {
  const emptyResponse: PaginatedResponse<Article> = {
    success: false,
    data: [],
    meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
  };

  try {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.search) query.set("search", String(params.search));
    if (params.category) query.set("category", String(params.category));
    if (params.sort) query.set("sort", String(params.sort));

    const queryString = query.toString();
    const url = `${BASE_URL}/articles${queryString ? `?${queryString}` : ""}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return emptyResponse;
    return await res.json();
  } catch (error) {
    console.error("[API Error] getArticles failed:", error);
    return emptyResponse;
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const res = await fetch(`${BASE_URL}/articles/${slug}`, {
      next: { revalidate: 60 },
    });
    if (res.status === 404 || !res.ok) return null;
    const json: ApiResponse<Article> = await res.json();
    return json.data;
  } catch (error) {
    console.error(`[API Error] getArticleBySlug(${slug}) failed:`, error);
    return null;
  }
}

// Comments (fetch di Server Component)
export async function getComments(articleId: number): Promise<Comment[]> {
  try {
    const res = await fetch(`${BASE_URL}/comments/${articleId}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    const json: ApiResponse<Comment[]> = await res.json();
    return json.data || [];
  } catch (error) {
    console.error(
      `[API Error] getComments(${articleId}) failed:`,
      error,
    );
    return [];
  }
}

// Related articles (fetch di Server Component)
export async function getRelatedArticles(
  categorySlug: string,
  excludeSlug: string,
  limit: number = 3,
): Promise<Article[]> {
  try {
    const res = await getArticles({
      category: categorySlug,
      limit: limit + 1, // fetch extra in case current article is included
    });
    return res.data
      .filter((article) => article.slug !== excludeSlug)
      .slice(0, limit);
  } catch (error) {
    console.error("[API Error] getRelatedArticles failed:", error);
    return [];
  }
}
