// components/article/CategoryBadge.tsx — Server Component

import Link from "next/link";
import { ArticleCategory } from "@/lib/api";

type Props = {
  category: ArticleCategory;
};

export default function CategoryBadge({ category }: Props) {
  return (
    <Link
      href={`/kategori/${category.slug}`}
      className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
    >
      {category.name}
    </Link>
  );
}
