import { BookList } from "@/components/BookList";
import { books } from "@/lib/books";

export default function Home() {
  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">My Books</h1>
        <p className="text-sm text-slate-600">
          Track what you want to read, what you are reading, and what you have
          finished.
        </p>
      </div>

      <BookList books={books} />
    </section>
  );
}
