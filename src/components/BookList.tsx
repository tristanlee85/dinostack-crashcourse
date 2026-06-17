"use client";

/**
 * Purpose: Client-side reading list. Owns the active status filter and renders
 *          the FilterTabs control above a responsive grid of BookCards for the
 *          books matching the current filter.
 *
 * Public API: BookList(props: { books: Book[] }): JSX.Element
 *
 * Upstream deps: ./BookCard, ./FilterTabs, @/lib/filtering
 *   (countByStatus, filterBooks), @/lib/types (Book, FilterValue), react
 *   (useState).
 *
 * Downstream consumers: src/components/ReadingListPage.tsx (client shell that
 *   passes the combined seed + added books array), previously also
 *   src/app/page.tsx before the Add-a-book flow.
 *
 * Failure modes: pure client component; no I/O and no throwing on the typed
 *   input. Badge counts come straight from countByStatus(books) - they are not
 *   recomputed locally - so the displayed badge for a status always equals what
 *   countByStatus reports for that status.
 *
 * Performance: recomputes counts and the filtered slice on each render via two
 *   linear passes over `books`; trivial for the seed-sized list.
 */

import { useState } from "react";
import type { Book, FilterValue } from "@/lib/types";
import { countByStatus, filterBooks } from "@/lib/filtering";
import { BookCard } from "./BookCard";
import { FilterTabs } from "./FilterTabs";

interface BookListProps {
  books: Book[];
}

export function BookList({ books }: BookListProps) {
  const [active, setActive] = useState<FilterValue>("all");

  const counts = countByStatus(books);
  const filtered = filterBooks(books, active);

  return (
    <div className="space-y-6">
      <FilterTabs active={active} counts={counts} onChange={setActive} />

      {filtered.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          No books in this list yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filtered.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
