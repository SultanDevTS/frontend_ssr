import Link from "next/link";
import { type Category } from "@/lib/api";
import { MAX_VISIBLE_CATEGORIES } from "@/lib/constants";
import NavMenu from "@/components/layout/NavMenu";
import SearchBar from "@/components/layout/SearchBar";
import MobileNav from "@/components/layout/MobileNav";

type Props = {
  categories: Category[];
};

export default function Header({ categories }: Props) {

  // Deduplicate categories by slug
  const uniqueCategories = categories.filter(
    (cat, index, self) => self.findIndex((c) => c.slug === cat.slug) === index,
  );

  const visibleCategories = uniqueCategories.slice(0, MAX_VISIBLE_CATEGORIES);
  const overflowCategories = uniqueCategories.slice(MAX_VISIBLE_CATEGORIES);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200/60">
      <div className="max-w-6xl mx-auto px-4">
        {/* Main navbar row */}
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 shrink-0">
            <span className="text-2xl font-extrabold tracking-tight text-blue-600">
              Portal
            </span>
            <span className="text-2xl font-extrabold tracking-tight text-gray-900">
              News
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              href="/"
              className="px-3 py-2 text-sm font-semibold text-gray-700 rounded-lg
                         hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
            >
              Beranda
            </Link>

            <span className="w-px h-5 bg-gray-200 mx-1" />

            <NavMenu categories={visibleCategories} />

            {overflowCategories.length > 0 && (
              <div className="relative group">
                <button
                  className="px-3 py-2 text-sm font-medium text-gray-500 rounded-lg
                             hover:bg-blue-50 hover:text-blue-600 transition-all duration-200
                             flex items-center gap-1"
                >
                  Lainnya
                  <svg
                    className="w-3.5 h-3.5 transition-transform group-hover:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown */}
                <div
                  className="absolute right-0 top-full pt-2 opacity-0 invisible
                              group-hover:opacity-100 group-hover:visible
                              transition-all duration-200"
                >
                  <div
                    className="bg-white rounded-xl shadow-lg border border-gray-100
                                py-2 min-w-[180px]"
                  >
                    {overflowCategories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/kategori/${cat.slug}`}
                        className="block px-4 py-2.5 text-sm text-gray-600
                                   hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </nav>

          {/* Right side: Search + Mobile toggle */}
          <div className="flex items-center gap-2">
            {/* Desktop search */}
            <div className="hidden lg:block">
              <SearchBar />
            </div>

            {/* Mobile menu — Client Component */}
            <MobileNav categories={uniqueCategories} />
          </div>
        </div>
      </div>
    </header>
  );
}
