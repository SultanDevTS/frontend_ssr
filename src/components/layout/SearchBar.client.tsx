import { useState } from "react";
import { useRouter } from "next/router";
import { Search } from "lucide-react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/?search=${encodeURIComponent(trimmed)}`);
      setQuery("");
      setIsExpanded(false);
    }
  }

  return (
    <>
      {isExpanded ? (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari artikel..."
            autoFocus
            className="w-44 px-3 py-2 text-sm border border-gray-200 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       bg-white text-gray-700 placeholder-gray-400"
          />
          <button
            type="button"
            onClick={() => {
              setIsExpanded(false);
              setQuery("");
            }}
            className="text-gray-400 hover:text-gray-600 text-sm"
            aria-label="Tutup pencarian"
          >
            ✕
          </button>
        </form>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center justify-center w-10 h-10 rounded-full
                     text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
          aria-label="Buka pencarian"
        >
          <Search size={20} />
        </button>
      )}
    </>
  );
}
