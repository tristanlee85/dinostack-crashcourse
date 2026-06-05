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

      {/*
        U4 wires the reading list here:
          import { BookList } from "@/components/BookList";
          import { books } from "@/lib/books";
          ...
          <BookList books={books} />
      */}
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        The reading list will appear here.
      </div>
    </section>
  );
}
