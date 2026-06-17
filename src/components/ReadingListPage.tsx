"use client";

import { useState } from "react";
import type { Book } from "@/lib/types";
import { books as seedBooks } from "@/lib/books";
import { AddBookPanel } from "./AddBookPanel";
import { BookList } from "./BookList";

export function ReadingListPage() {
  const [books, setBooks] = useState<Book[]>(() => [...seedBooks]);

  return (
    <div className="space-y-6">
      <AddBookPanel onBookAdded={(b) => setBooks((prev) => [...prev, b])} />
      <BookList books={books} />
    </div>
  );
}
