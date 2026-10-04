import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/router";
import { Heart } from "lucide-react";

function subscribeStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

type Props = {
  articleId: number;
  initialLikes: number;
};

export default function LikeButton({ articleId, initialLikes }: Props) {
  const router = useRouter();

  const [likes, setLikes] = useState(initialLikes);
  const [loading, setLoading] = useState(false);
  const [likedNow, setLikedNow] = useState(false);

  const storageKey = `liked_article_${articleId}`;

  // Baca status liked dari localStorage (browser-only API).
  // Server snapshot = false, sehingga HTML server dan hydration konsisten.
  const storedLiked = useSyncExternalStore(
    subscribeStorage,
    () => localStorage.getItem(storageKey) === "true",
    () => false,
  );

  const liked = storedLiked || likedNow;

  async function handleLike() {
    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/articles/${articleId}/like`,
        {
          method: "POST",
        },
      );

      if (res.ok) {
        const data = await res.json();

        setLikes(data.likes ?? likes + 1);
        setLikedNow(true);

        // Simpan ke localStorage agar persisten setelah refresh
        localStorage.setItem(storageKey, "true");

        // Re-fetch halaman menggunakan Pages Router
        router.replace(router.asPath);
      }
    } catch (error) {
      console.error("Gagal menyukai artikel:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={loading || liked}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${
                    liked
                      ? "bg-red-50 text-red-600 border border-red-200"
                      : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 border border-gray-200"
                  }
                  disabled:opacity-60 disabled:cursor-not-allowed`}
      aria-label={`${likes} Suka`}
    >
      <Heart size={16} className={liked ? "fill-current" : ""} />

      <span>{likes} Suka</span>
    </button>
  );
}
