"use client";

import { useCallback, useId, useState } from "react";
import type { Book } from "@/lib/types";
import {
  searchOpenLibrary,
  type OpenLibraryDoc,
} from "@/lib/openlibrary";

const COVER_PALETTE = [
  "#5b8def",
  "#8e6fd6",
  "#d68f5b",
  "#4fb0a5",
  "#c0556a",
  "#3f7d4f",
  "#b8893a",
  "#6f8fb0",
  "#9c6b8e",
] as const;

function coverColorFor(title: string, author: string): string {
  const s = `${title}|${author}`;
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return COVER_PALETTE[h % COVER_PALETTE.length];
}

function docToBook(doc: OpenLibraryDoc): Book {
  const author =
    doc.author_name && doc.author_name.length > 0
      ? doc.author_name.join(", ")
      : "Unknown author";
  const addedAt = new Date().toISOString().slice(0, 10);
  return {
    id: crypto.randomUUID(),
    title: doc.title,
    author,
    status: "to-read",
    coverColor: coverColorFor(doc.title, author),
    addedAt,
    publishedYear: doc.first_publish_year,
  };
}

interface AddBookPanelProps {
  onBookAdded: (book: Book) => void;
}

export function AddBookPanel({ onBookAdded }: AddBookPanelProps) {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<OpenLibraryDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /** Trimmed query from the last successful completed search (for empty-state copy). */
  const [searchedQuery, setSearchedQuery] = useState<string | null>(null);

  const runSearch = useCallback(async () => {
    setError(null);
    setResults([]);
    setSearchedQuery(null);
    const q = query.trim();
    if (!q) {
      return;
    }
    setLoading(true);
    try {
      const docs = await searchOpenLibrary(q);
      setResults(docs);
      setSearchedQuery(q);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Search failed.");
      setSearchedQuery(null);
    } finally {
      setLoading(false);
    }
  }, [query]);

  const handlePick = (doc: OpenLibraryDoc) => {
    onBookAdded(docToBook(doc));
    setResults([]);
    setQuery("");
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-slate-900 hover:bg-slate-50"
      >
        <span>Add a book</span>
        <span className="text-slate-500" aria-hidden="true">
          {open ? "−" : "+"}
        </span>
      </button>
      {open ? (
        <div id={panelId} className="space-y-3 border-t border-slate-200 px-4 pb-4 pt-3">
          <form
            className="flex flex-col gap-2 sm:flex-row sm:items-end"
            onSubmit={(e) => {
              e.preventDefault();
              void runSearch();
            }}
          >
            <label className="block min-w-0 flex-1 text-xs font-medium text-slate-600">
              Search by title
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Dune"
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                disabled={loading}
                autoComplete="off"
              />
            </label>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Search
            </button>
          </form>
          {loading ? (
            <p className="text-sm text-slate-600">Searching...</p>
          ) : null}
          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}
          {!loading &&
          !error &&
          results.length === 0 &&
          searchedQuery != null &&
          searchedQuery === query.trim() ? (
            <p className="text-sm text-slate-600">
              No matches found. Try a different title.
            </p>
          ) : null}
          {results.length > 0 ? (
            <ul className="max-h-60 space-y-1 overflow-y-auto rounded-md border border-slate-100 bg-slate-50 p-2">
              {results.map((doc, i) => {
                const author =
                  doc.author_name?.join(", ") ?? "Unknown author";
                const year =
                  doc.first_publish_year != null
                    ? ` (${doc.first_publish_year})`
                    : "";
                return (
                  <li key={`${doc.title}-${i}`}>
                    <button
                      type="button"
                      onClick={() => handlePick(doc)}
                      className="w-full rounded-md px-2 py-2 text-left text-sm hover:bg-white"
                    >
                      <span className="font-medium text-slate-900">
                        {doc.title}
                      </span>
                      <span className="block text-slate-600">
                        {author}
                        {year}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
