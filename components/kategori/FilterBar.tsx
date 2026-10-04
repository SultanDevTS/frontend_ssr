import { useState } from "react";
import { useRouter } from "next/router";
import { SlidersHorizontal } from "lucide-react";

export default function FilterBar() {
  const router = useRouter();

  const initialSort = router.query.sort === "oldest" ? "oldest" : "newest";

  const [sort, setSort] = useState(initialSort);

  function handleSortChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newSort = e.target.value === "oldest" ? "oldest" : "newest";

    setSort(newSort);

    const query: Record<string, string> = {
      slug: String(router.query.slug),
    };

    if (router.query.page) {
      query.page = String(router.query.page);
    }

    query.sort = newSort;

    router.push({ pathname: router.pathname, query });
  }

  return (
    <div className="flex items-center gap-3">
      <SlidersHorizontal size={16} className="text-gray-400" />

      <label htmlFor="sort-select" className="text-sm text-gray-500">
        Urutkan:
      </label>

      <select
        id="sort-select"
        value={sort}
        onChange={handleSortChange}
        className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white
                   text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500
                   focus:border-transparent cursor-pointer"
      >
        <option value="newest">Terbaru</option>
        <option value="oldest">Terlama</option>
      </select>
    </div>
  );
}
