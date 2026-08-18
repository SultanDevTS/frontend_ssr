'use client';

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Category } from "@/lib/api";
import { Menu, X, Search } from "lucide-react";

type Props = {
  categories: Category[];
};

export default function MobileNav({ categories }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = useCallback(() => setIsOpen(false), []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Hamburger button — only visible on mobile */}
      <button
        className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg
                   text-gray-600 hover:bg-gray-100 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Backdrop overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 top-16 bg-black/20 backdrop-blur-sm z-40"
          onClick={closeMenu}
        />
      )}

      {/* Mobile slide-down menu */}
      <div
        className={`lg:hidden fixed left-0 right-0 top-16 z-50 bg-white border-b border-gray-100
                    shadow-xl transition-all duration-300 ease-in-out
                    ${isOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"}`}
      >
        {/* Search bar */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2.5">
            <Search size={18} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Cari artikel..."
              className="bg-transparent text-sm text-gray-700 placeholder-gray-400
                         outline-none w-full"
            />
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex flex-col px-2 py-2 gap-0.5 max-h-[60vh] overflow-y-auto">
          <Link
            href="/"
            onClick={closeMenu}
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-800
                       font-semibold hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Beranda
          </Link>

          <div className="px-3 py-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Kategori
            </span>
          </div>

          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/kategori/${cat.slug}`}
              onClick={closeMenu}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600
                         hover:bg-blue-50 hover:text-blue-600 transition-colors text-sm font-medium"
            >
              <span className="w-2 h-2 rounded-full bg-gray-300" />
              {cat.name}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
