'use client';

import { useState } from "react";
import { Send } from "lucide-react";

type Props = {
  articleId: number;
};

export default function CommentForm({ articleId }: Props) {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            articleId,
            name: name.trim(),
            content: content.trim(),
          }),
        },
      );

      if (!res.ok) throw new Error("Gagal mengirim komentar");

      setName("");
      setContent("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Gagal mengirim komentar. Silakan coba lagi.");
      console.error("Comment submit error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nama Anda"
        required
        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   bg-white text-gray-700 placeholder-gray-400"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Tulis komentar..."
        required
        rows={3}
        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   bg-white text-gray-700 placeholder-gray-400 resize-none"
      />

      {error && (
        <p className="text-red-500 text-xs">{error}</p>
      )}
      {success && (
        <p className="text-green-600 text-xs">
          Komentar berhasil dikirim! Refresh halaman untuk melihat.
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !name.trim() || !content.trim()}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white
                   text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors
                   disabled:opacity-50 disabled:cursor-not-allowed
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <Send size={14} />
        {loading ? "Mengirim..." : "Kirim Komentar"}
      </button>
    </form>
  );
}
