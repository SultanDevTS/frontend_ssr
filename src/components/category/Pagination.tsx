// components/category/Pagination.tsx — Server Component
// Uses <Link> with query strings — no client-side state needed

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string>;
};

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  searchParams = {},
}: Props) {
  if (totalPages <= 1) return null;

  function buildHref(page: number): string {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    return `${basePath}?${params.toString()}`;
  }

  // Hitung range halaman yang ditampilkan
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  const end = Math.min(totalPages, start + maxVisible - 1);
  start = Math.max(1, end - maxVisible + 1);

  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Navigasi halaman">
      {/* Prev */}
      {currentPage > 1 ? (
        <Link
          href={buildHref(currentPage - 1)}
          className="flex items-center justify-center w-9 h-9 rounded-lg text-gray-500
                     hover:bg-blue-50 hover:text-blue-600 transition-colors"
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft size={18} />
        </Link>
      ) : (
        <span className="flex items-center justify-center w-9 h-9 rounded-lg text-gray-300">
          <ChevronLeft size={18} />
        </span>
      )}

      {/* Page numbers */}
      {pages.map((page) => (
        <Link
          key={page}
          href={buildHref(page)}
          className={`flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium transition-colors
                      ${
                        page === currentPage
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                      }`}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </Link>
      ))}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={buildHref(currentPage + 1)}
          className="flex items-center justify-center w-9 h-9 rounded-lg text-gray-500
                     hover:bg-blue-50 hover:text-blue-600 transition-colors"
          aria-label="Halaman berikutnya"
        >
          <ChevronRight size={18} />
        </Link>
      ) : (
        <span className="flex items-center justify-center w-9 h-9 rounded-lg text-gray-300">
          <ChevronRight size={18} />
        </span>
      )}
    </nav>
  );
}
