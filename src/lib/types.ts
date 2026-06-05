export type ReadingStatus = "to-read" | "reading" | "finished";

export interface Book {
  id: string;
  title: string;
  author: string;
  status: ReadingStatus;
  coverColor: string; // deterministic placeholder swatch (a hex like "#5b8def")
  addedAt: string; // ISO date string
}

export type FilterValue = ReadingStatus | "all";
