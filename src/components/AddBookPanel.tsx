"use client";

/**
 * Purpose: Search panel for the add-book flow. Lets the reader query Open
 *          Library by title on explicit submit, lists up to 5 results, and
 *          surfaces a picked result upward as a fully-formed to-read Book.
 *
 * Public API: AddBookPanel(props: { onAdd: (book: Book) => void }): JSX.Element
 *
 * Upstream deps: @/lib/openlibrary (searchOpenLibrary, OpenLibraryDoc),
 *   @/lib/types (Book), react (useState). The network call is delegated to
 *   searchOpenLibrary; this component owns only the query/result/status UI state.
 *
 * Downstream consumers: src/components/ReadingRoom.tsx (passes onAdd, which
 *   enforces final id uniqueness against the runtime list).
 *
 * Failure modes: never throws to its parent. A failed search is caught and
 *   surfaced as an inline "Search failed - try again" message with the query
 *   retained for retry; the results list renders only in the "done" status, so
 *   an error never shows a false empty-results message. A double-submit while a
 *   request is in flight is ignored. docToBook always emits a non-empty
 *   candidate id (falls back to "book" when the title slug is empty).
 *
 * Performance: one search request per submit (no debounce, no timer); render
 *   work is bounded by the 5-result cap.
 */

import { useState } from "react";
import type { Book } from "@/lib/types";
import { searchOpenLibrary, type OpenLibraryDoc } from "@/lib/openlibrary";

interface AddBookPanelProps {
  onAdd: (book: Book) => void;
}

type SearchStatus = "idle" | "loading" | "done" | "error";

function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "book";
}

function formatAuthors(doc: OpenLibraryDoc): string {
  return doc.author_name && doc.author_name.length > 0
    ? doc.author_name.join(", ")
    : "Unknown author";
}

function docToBook(doc: OpenLibraryDoc): Book {
  const displayTitle =
    doc.first_publish_year !== undefined
      ? `${doc.title} (${doc.first_publish_year})`
      : doc.title;

  const author = formatAuthors(doc);

  let h = 0;
  for (const ch of doc.title) {
    h = (h * 31 + ch.charCodeAt(0)) | 0;
  }
  const coverColor = `#${(Math.abs(h) & 0xffffff).toString(16).padStart(6, "0")}`;

  return {
    id: slugify(displayTitle),
    title: displayTitle,
    author,
    status: "to-read",
    coverColor,
    addedAt: new Date().toISOString().slice(0, 10),
  };
}

export function AddBookPanel({ onAdd }: AddBookPanelProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<OpenLibraryDoc[]>([]);
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [lastQuery, setLastQuery] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") {
      return;
    }
    const trimmed = query.trim();
    if (trimmed === "") {
      return;
    }
    setStatus("loading");
    try {
      const r = await searchOpenLibrary(trimmed);
      setResults(r);
      setLastQuery(trimmed);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Open Library by title"
          aria-label="Search Open Library by title"
          className="min-w-0 flex-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="flex-none rounded-md bg-slate-900 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Search
        </button>
      </form>

      {status === "loading" && (
        <p className="text-sm text-slate-500">Searching...</p>
      )}

      {status === "error" && (
        <p className="text-sm text-red-600">Search failed - try again</p>
      )}

      {status === "done" && results.length === 0 && (
        <p className="text-sm text-slate-500">
          No books found for &quot;{lastQuery}&quot;.
        </p>
      )}

      {status === "done" && results.length > 0 && (
        <ul className="divide-y divide-slate-100">
          {results.map((doc, index) => (
            <li
              key={`${doc.title}-${index}`}
              className="flex items-center justify-between gap-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-900">
                  {doc.title}
                  {doc.first_publish_year !== undefined && (
                    <span className="ml-1 font-normal text-slate-500">
                      ({doc.first_publish_year})
                    </span>
                  )}
                </p>
                <p className="truncate text-sm text-slate-600">
                  {formatAuthors(doc)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onAdd(docToBook(doc))}
                className="flex-none rounded-md border border-slate-300 px-3 py-1 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-100"
              >
                Add
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
