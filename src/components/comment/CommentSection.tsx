// components/comment/CommentSection.tsx — Komponen biasa (Pages Router)
// Sebelumnya async Server Component; di Pages Router data diterima via props
// dari getServerSideProps di berita/[slug].tsx

import type { Comment } from "@/lib/api";
import CommentList from "@/components/comment/CommentList";
import CommentForm from "@/components/comment/CommentForm.client";

type Props = {
  articleId: number;
  comments: Comment[];
};

export default function CommentSection({ articleId, comments }: Props) {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">
        Komentar ({comments.length})
      </h2>

      <CommentForm articleId={articleId} />
      <CommentList comments={comments} />
    </section>
  );
}
