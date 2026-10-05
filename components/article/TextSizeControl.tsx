import { useEffect, useState } from "react";
import { Type } from "lucide-react";

type TextSize = "sm" | "md" | "lg";

const SIZES: Array<{
  key: TextSize;
  label: string;
  cssValue: string;
  ariaLabel: string;
}> = [
  { key: "sm", label: "A-", cssValue: "0.9375rem", ariaLabel: "Ukuran teks kecil" },
  { key: "md", label: "A", cssValue: "1.0625rem", ariaLabel: "Ukuran teks normal" },
  { key: "lg", label: "A+", cssValue: "1.25rem", ariaLabel: "Ukuran teks besar" },
];

const STORAGE_KEY = "article_text_size_preference";

export default function TextSizeControl() {
  const [activeSize, setActiveSize] = useState<TextSize>("md");

  // Pulihkan preferensi ukuran font dari localStorage saat komponen mount di browser
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as TextSize | null;
      if (saved && (saved === "sm" || saved === "md" || saved === "lg")) {
        setActiveSize(saved);
        const match = SIZES.find((s) => s.key === saved);
        if (match) {
          document.documentElement.style.setProperty("--article-font-size", match.cssValue);
        }
      }
    } catch {
      // Abaikan jika localStorage dibatasi browser
    }
  }, []);

  function handleSizeChange(size: TextSize) {
    setActiveSize(size);
    const selected = SIZES.find((s) => s.key === size);
    if (selected) {
      document.documentElement.style.setProperty("--article-font-size", selected.cssValue);
      try {
        localStorage.setItem(STORAGE_KEY, size);
      } catch {
        // Abaikan jika storage error
      }
    }
  }

  return (
    <div
      className="inline-flex items-center gap-2"
      role="group"
      aria-label="Pengaturan ukuran teks artikel"
    >
      <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
        <Type size={14} className="text-gray-400" aria-hidden="true" />
        <span className="hidden sm:inline">Ukuran Teks:</span>
      </div>

      <div className="inline-flex p-0.5 rounded-lg bg-gray-100 border border-gray-200">
        {SIZES.map(({ key, label, ariaLabel }) => {
          const isActive = activeSize === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => handleSizeChange(key)}
              aria-pressed={isActive}
              aria-label={ariaLabel}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all duration-150 ${
                isActive
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/60"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

