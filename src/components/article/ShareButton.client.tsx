'use client';

import { useState } from "react";
import { Share2, Check, Link as LinkIcon } from "lucide-react";

type Props = {
  title: string;
  slug: string;
};

export default function ShareButton({ title, slug }: Props) {
  const [copied, setCopied] = useState(false);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const articleUrl = `${siteUrl}/berita/${slug}`;

  async function handleShare() {
    // Try native share API first (mobile)
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          url: articleUrl,
        });
        return;
      } catch {
        // User cancelled or share failed — fall through to clipboard
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(articleUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Gagal menyalin link:", error);
    }
  }

  return (
    <button
      onClick={handleShare}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                  transition-all duration-200 border
                  ${
                    copied
                      ? "bg-green-50 text-green-600 border-green-200"
                      : "bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600 border-gray-200"
                  }`}
      aria-label="Bagikan artikel"
    >
      {copied ? (
        <>
          <Check size={16} />
          <span>Link Disalin!</span>
        </>
      ) : (
        <>
          <Share2 size={16} />
          <span>Bagikan</span>
        </>
      )}
    </button>
  );
}
