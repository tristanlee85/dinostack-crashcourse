"use client";

/**
 * Purpose: Client container that owns the runtime reading list. It is seeded
 *          from the static seed handed down by the server page and renders the
 *          add-book search panel above the filterable book list, so a picked
 *          book appears instantly with no shared store or cross-route state.
 *
 * Public API: ReadingRoom(props: { seed: Book[] }): JSX.Element
 *
 * Upstream deps: ./AddBookPanel, ./BookList, @/lib/types (Book), react
 *   (useState). No I/O of its own - the network call lives in AddBookPanel.
 *
 * Downstream consumers: src/app/page.tsx (the home route renders
 *   <ReadingRoom seed={books} />).
 *
 * Failure modes: pure client component; no I/O and never throws on the typed
 *   input. handleAdd guarantees a unique id against the authoritative previous
 *   array (which includes the seed ids) via a loop-until-unique suffix rule, so
 *   repeat adds and slug-vs-seed collisions never produce duplicate React keys.
 *
 * Performance: a single setState updater per add; the uniqueness loop is linear
 *   in the current list size, trivial for the seed-sized list.
 */

import { useState } from "react";
import type { Book } from "@/lib/types";
import { AddBookPanel } from "./AddBookPanel";
import { BookList } from "./BookList";

interface ReadingRoomProps {
  seed: Book[];
}

export function ReadingRoom({ seed }: ReadingRoomProps) {
  const [books, setBooks] = useState<Book[]>(seed);

  function handleAdd(candidate: Book) {
    setBooks((prev) => {
      const base = candidate.id;
      let id = base;
      let n = 2;
      while (prev.some((b) => b.id === id)) {
        id = `${base}-${n}`;
        n++;
      }
      return [{ ...candidate, id }, ...prev];
    });
  }

  return (
    <div className="space-y-6">
      <AddBookPanel onAdd={handleAdd} />
      <BookList books={books} />
    </div>
  );
}
