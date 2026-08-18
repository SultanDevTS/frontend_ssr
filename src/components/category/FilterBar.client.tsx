import { useState } from "react";
import { useRouter } from "next/router";
import { SlidersHorizontal } from "lucide-react";

export default function FilterBar() {
  const router = useRouter();
  const [sort, setSort] = useState((router.query.sort as string | undefined) || "newest");

  function handleSortChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newSort = e.target.value;
    setSort(newSort);

    const params = new URLSearchParams(router.query as Record<string, string>);
    params.set("sort", newSort);
    params.delete("page"); // Reset page saat sort berubah
    router.push(`?${params.toString()}`);
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
