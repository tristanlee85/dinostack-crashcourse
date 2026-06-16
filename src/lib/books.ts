import type { Book } from "@/lib/types";

/**
 * Seed library for the DinoStack Reading Room.
 *
 * Distribution is a binding contract: exactly 9 books split
 * 4 "to-read" / 3 "reading" / 2 "finished". This split is load-bearing -
 * the intro-tier teaching bug is only visible when the seed holds both
 * "to-read" and "reading" books, so it is fixed, not discretionary.
 */
export const books: Book[] = [
  // 4 "to-read"
  {
    id: "the-pragmatic-programmer",
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt and David Thomas",
    status: "to-read",
    coverColor: "#5b8def",
    addedAt: "2026-05-02",
  },
  {
    id: "the-name-of-the-wind",
    title: "The Name of the Wind",
    author: "Patrick Rothfuss",
    status: "to-read",
    coverColor: "#8e6fd6",
    addedAt: "2026-05-09",
  },
  {
    id: "sapiens",
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    status: "to-read",
    coverColor: "#d68f5b",
    addedAt: "2026-05-14",
  },
  {
    id: "klara-and-the-sun",
    title: "Klara and the Sun",
    author: "Kazuo Ishiguro",
    status: "to-read",
    coverColor: "#4fb0a5",
    addedAt: "2026-05-21",
  },
  // 3 "reading"
  {
    id: "the-three-body-problem",
    title: "The Three-Body Problem",
    author: "Liu Cixin",
    status: "reading",
    coverColor: "#c0556a",
    addedAt: "2026-04-11",
  },
  {
    id: "designing-data-intensive-applications",
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    status: "reading",
    coverColor: "#3f7d4f",
    addedAt: "2026-04-18",
  },
  {
    id: "circe",
    title: "Circe",
    author: "Madeline Miller",
    status: "reading",
    coverColor: "#b8893a",
    addedAt: "2026-04-27",
  },
  // 2 "finished"
  {
    id: "project-hail-mary",
    title: "Project Hail Mary",
    author: "Andy Weir",
    status: "finished",
    coverColor: "#6f8fb0",
    addedAt: "2026-03-08",
  },
  {
    id: "educated",
    title: "Educated",
    author: "Tara Westover",
    status: "finished",
    coverColor: "#9c6b8e",
    addedAt: "2026-03-19",
  },
];
