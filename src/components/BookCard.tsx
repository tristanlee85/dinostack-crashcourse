import type { Book, ReadingStatus } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/labels";

interface BookCardProps {
  book: Book;
}

const STATUS_BADGE_CLASSES: Record<ReadingStatus, string> = {
  "to-read": "bg-sky-100 text-sky-700",
  reading: "bg-amber-100 text-amber-700",
  finished: "bg-emerald-100 text-emerald-700",
};

export function BookCard({ book }: BookCardProps) {
  return (
    <article className="flex gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div
        className="h-20 w-14 flex-none rounded-md"
        style={{ backgroundColor: book.coverColor }}
        aria-hidden="true"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h3 className="truncate text-sm font-semibold text-slate-900">
          {book.title}
        </h3>
        <p className="truncate text-sm text-slate-600">{book.author}</p>
        {book.publishedYear != null ? (
          <p className="text-xs text-slate-500">{book.publishedYear}</p>
        ) : null}
        <span
          className={`mt-auto inline-flex w-fit rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE_CLASSES[book.status]}`}
        >
          {STATUS_LABELS[book.status]}
        </span>
      </div>
    </article>
  );
}
