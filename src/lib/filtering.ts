/**
 * Purpose: Pure helpers for the reading-list UI - filter a book array by
 *          reading status and tally per-status counts for the filter badges.
 *
 * Public API:
 *   filterBooks(books: Book[], filter: FilterValue): Book[]
 *   countByStatus(books: Book[]): Record<FilterValue, number>
 *
 * Upstream deps: @/lib/types (Book, ReadingStatus, FilterValue). No runtime
 *   imports, no I/O.
 *
 * Downstream consumers: src/components/BookList.tsx (built in U4).
 *
 * Failure modes: pure functions with no side effects; never throw on the
 *   typed inputs. Both are safe to call repeatedly. An unknown filter value
 *   that is not "all" simply matches no books and yields an empty array.
 *   countByStatus.all is the SUM of the three per-status buckets, not the
 *   array length, so it stays consistent with the displayed buckets.
 *
 * Performance: single linear pass over the input array; standard.
 */
import type { Book, FilterValue } from "@/lib/types";

export function filterBooks(books: Book[], filter: FilterValue): Book[] {
  if (filter === "all") {
    return books;
  }
  return books.filter((book) => book.status === filter);
}

export function countByStatus(books: Book[]): Record<FilterValue, number> {
  const counts: Record<FilterValue, number> = {
    "to-read": 0,
    reading: 0,
    finished: 0,
    all: 0,
  };

  for (const book of books) {
    counts[book.status] += 1;
  }

  // BINDING CONTRACT: "all" is the sum of the three per-status buckets, NOT
  // books.length. This keeps "all" correct even if a per-status bucket is
  // miscounted, which is load-bearing for the intro-tier teaching bug.
  counts.all = counts["to-read"] + counts.reading + counts.finished;

  return counts;
}
