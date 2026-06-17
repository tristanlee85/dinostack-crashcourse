export type ReadingStatus = "to-read" | "reading" | "finished";

export interface Book {
  id: string;
  title: string;
  author: string;
  status: ReadingStatus;
  coverColor: string; // deterministic placeholder swatch (a hex like "#5b8def")
  addedAt: string; // ISO date string
  /** First publish year when sourced from Open Library (optional). */
  publishedYear?: number;
}

export type FilterValue = ReadingStatus | "all";
