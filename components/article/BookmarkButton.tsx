import { useSyncExternalStore } from "react";
import { Bookmark } from "lucide-react";

function subscribeStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

type Props = {
  articleId: number;
  title?: string;
  slug?: string;
  showText?: boolean;
};

export default function BookmarkButton({
  articleId,
  title,
  slug,
  showText = true,
}: Props) {
  const storageKey = `bookmarked_article_${articleId}`;

  // Baca status bookmark dari localStorage dengan useSyncExternalStore
  // Snapshot server bernilai false agar tidak menimbulkan hydration mismatch
  const isBookmarked = useSyncExternalStore(
    subscribeStorage,
    () => {
      try {
        return localStorage.getItem(storageKey) === "true";
      } catch {
        return false;
      }
    },
    () => false,
  );

  function handleToggleBookmark() {
    try {
      const nextStatus = !isBookmarked;
      if (nextStatus) {
        localStorage.setItem(storageKey, "true");
        // Simpan juga metadata ringkas ke daftar bookmark jika dibutuhkan
        const bookmarksListRaw = localStorage.getItem("user_bookmarks");
        const list: Array<{ id: number; title: string; slug: string }> =
          bookmarksListRaw ? JSON.parse(bookmarksListRaw) : [];
        if (!list.some((item) => item.id === articleId)) {
          list.push({
            id: articleId,
            title: title || "",
            slug: slug || "",
          });
          localStorage.setItem("user_bookmarks", JSON.stringify(list));
        }
      } else {
        localStorage.removeItem(storageKey);
        const bookmarksListRaw = localStorage.getItem("user_bookmarks");
        if (bookmarksListRaw) {
          const list: Array<{ id: number; title: string; slug: string }> =
            JSON.parse(bookmarksListRaw);
          const filtered = list.filter((item) => item.id !== articleId);
          localStorage.setItem("user_bookmarks", JSON.stringify(filtered));
        }
      }
      // Picu storage event agar UI lain tersinkronisasi
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error("Gagal memperbarui bookmark:", error);
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggleBookmark}
      aria-label={
        isBookmarked ? "Hapus dari bookmark" : "Simpan artikel ke bookmark"
      }
      aria-pressed={isBookmarked}
      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium
                  transition-all duration-200 border
                  ${
                    isBookmarked
                      ? "bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100"
                      : "bg-gray-100 text-gray-600 hover:bg-amber-50 hover:text-amber-700 border-gray-200"
                  }`}
    >
      <Bookmark
        size={16}
        className={
          isBookmarked ? "fill-amber-600 text-amber-600" : "text-gray-500"
        }
        aria-hidden="true"
      />
      {showText && <span>{isBookmarked ? "Tersimpan" : "Simpan"}</span>}
    </button>
  );
}
