// Shared Types
// Tidak memiliki runtime import.

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
  thumbnail: string | null;
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
