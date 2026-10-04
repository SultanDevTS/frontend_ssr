import type { Comment } from "@/lib/types";
import { formatDate } from "@/utils/formatDate";

type Props = {
  initialComments: Comment[];
};

export default function CommentList({ initialComments }: Props) {
  if (initialComments.length === 0) {
    return (
      <p className="text-gray-400 text-sm text-center py-8">
        Belum ada komentar. Jadilah yang pertama berkomentar!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {initialComments.map((comment) => (
        <div
          key={comment.id}
          className="bg-white border border-gray-100 rounded-xl p-4 space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-800 text-sm">
              {comment.name}
            </span>
            <span className="text-xs text-gray-400">
              {formatDate(comment.createdAt)}
            </span>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed">
            {comment.content}
          </p>
        </div>
      ))}
    </div>
  );
}
