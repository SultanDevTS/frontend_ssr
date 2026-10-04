import type { Comment } from "@/lib/types";
import CommentList from "@/components/comment/CommentList";
import CommentForm from "@/components/comment/CommentForm";

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
      <CommentList initialComments={comments} />
    </section>
  );
}
