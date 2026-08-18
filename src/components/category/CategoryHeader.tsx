// components/category/CategoryHeader.tsx — Server Component

import Link from "next/link";
import { Category } from "@/lib/api";

type Props = {
  category: Category;
  totalArticles: number;
};

export default function CategoryHeader({ category, totalArticles }: Props) {
  return (
    <div className="space-y-2">
      <Link
        href="/"
        className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
      >
        ← Kembali ke Beranda
      </Link>
      <h1 className="text-3xl font-bold text-gray-900">
        Kategori: {category.name}
      </h1>
      <p className="text-gray-500 text-sm">
        {totalArticles} artikel ditemukan
      </p>
    </div>
  );
}
