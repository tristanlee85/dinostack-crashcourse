# Discover Screen - Design Specification

> This file is the **authoritative source of truth** for the advanced exercise.
> The exercise is completable from this text alone. The PNG mockups in this
> folder are visual references; where the images and this spec disagree, this
> spec wins. The optional Figma-MCP path (see `README.md`) is an enhancement,
> not a requirement.

## 1. Goal

Replace the bare `/discover` placeholder (`src/app/discover/page.tsx`) with a
polished "Browse / Discover Books" screen. The screen has two parts: a
hero/search header at the top, and a responsive grid of featured book cards
below it. Each card shows a cover swatch, title, author, and a row of
category/tag chips.

This screen extends the existing Iridium Reading Room visual language (the
slate-neutral palette and the rounded card style already used on the home page
and in `BookCard.tsx`). It is read-only browsing: there is no add-to-list wiring
required for this exercise. The search input is presentational (it filters the
visible featured set client-side at most; a non-functional input is acceptable
if the spec author chooses to keep scope tight).

## 2. Layout structure

```
+---------------------------------------------------------------+
|  HERO / SEARCH HEADER                                          |
|    Eyebrow:  DISCOVER                                          |
|    Title:    Browse Books                                      |
|    Subtitle: Find your next read from a curated shelf.        |
|    [  search input with leading icon ............... ]        |
|    [chip: All] [chip: Fiction] [chip: Sci-Fi] [chip: ...]     |
+---------------------------------------------------------------+
|  SECTION LABEL:  Featured                                     |
|                                                               |
|  +-----------+  +-----------+  +-----------+                  |
|  |  cover    |  |  cover    |  |  cover    |   <- card grid   |
|  |  title    |  |  title    |  |  title    |                  |
|  |  author   |  |  author   |  |  author   |                  |
|  |  chips    |  |  chips    |  |  chips    |                  |
|  +-----------+  +-----------+  +-----------+                  |
|  ... repeats ...                                             |
+---------------------------------------------------------------+
```

- The page content lives inside the existing app shell from `layout.tsx`
  (header "Iridium Reading Room" with nav, and a centered `main` container).
- The existing `main` wrapper is `max-w-4xl` (56rem / 896px). For this richer
  Discover screen, widen the content container to **`max-w-6xl` (72rem /
  1152px)** so the desktop grid has room for three columns. Achieve this by
  letting the Discover page render its own full-width section inside `main`, or
  by adjusting the container for this route. Do not alter the global shell for
  other routes.

## 3. Color palette (exact hex values)

The palette extends the existing slate-neutral base. Use these exact values.

| Token            | Hex       | Tailwind v4 nearest | Usage                                      |
|------------------|-----------|---------------------|--------------------------------------------|
| Page background  | `#f8fafc` | `slate-50`          | Body background (already set in `layout`)  |
| Surface          | `#ffffff` | `white`             | Cards, search input, header surface        |
| Border           | `#e2e8f0` | `slate-200`         | Card borders, dividers, input border       |
| Border hover     | `#cbd5e1` | `slate-300`         | Card border on hover                        |
| Text primary     | `#0f172a` | `slate-900`         | Titles, hero heading                        |
| Text secondary   | `#475569` | `slate-600`         | Author lines, subtitle, body               |
| Text muted       | `#94a3b8` | `slate-400`         | Eyebrow icon, placeholder, search icon      |
| Accent           | `#4f46e5` | `indigo-600`        | Active chip fill, focus ring, search icon   |
| Accent hover     | `#4338ca` | `indigo-700`        | Active chip hover                           |
| Accent soft bg   | `#eef2ff` | `indigo-50`         | Hero eyebrow background, soft accents       |
| Chip fiction     | `#e0f2fe` / `#0369a1` | `sky-100` / `sky-700`       | Fiction tag bg / text          |
| Chip sci-fi      | `#ede9fe` / `#6d28d9` | `violet-100` / `violet-700` | Sci-Fi tag bg / text           |
| Chip nonfiction  | `#dcfce7` / `#15803d` | `green-100` / `green-700`   | Non-Fiction tag bg / text      |
| Chip fantasy     | `#fef3c7` / `#b45309` | `amber-100` / `amber-700`   | Fantasy tag bg / text          |
| Chip classic     | `#fae8ff` / `#a21caf` | `fuchsia-100` / `fuchsia-700` | Classic tag bg / text        |

> The `indigo-600` accent is the one new brand color this screen introduces
> beyond the home page. It is the "Discover" identity color. Cover swatches
> reuse the per-book `coverColor` values from `src/lib/books.ts` where a card
> maps to a seeded book; for featured-only books not in the seed, pick a
> swatch hex from the same family (see the component inventory in section 7).

## 4. Spacing scale

Use a 4px base scale (matches Tailwind v4 defaults).

| Name | px   | rem    | Tailwind | Usage                                            |
|------|------|--------|----------|--------------------------------------------------|
| xs   | 4    | 0.25   | `1`      | Chip vertical padding, gap inside title block    |
| sm   | 8    | 0.5    | `2`      | Gap between chips, gap title-to-author            |
| md   | 16   | 1.0    | `4`      | Card inner padding, gap between hero rows         |
| lg   | 24   | 1.5    | `6`      | Container horizontal padding, grid gap            |
| xl   | 32   | 2.0    | `8`      | Vertical rhythm between hero and grid section     |
| 2xl  | 48   | 3.0    | `12`     | Top padding of the page section                   |

- Card inner padding: `md` (16px) on mobile, `lg` (24px) on desktop.
- Grid gap: `lg` (24px) at all breakpoints.
- Search input height: 48px; horizontal padding 16px; leading icon inset 16px.
- Chip padding: `4px` vertical, `12px` horizontal; pill radius (`9999px`).

## 5. Typography

System font stack (Next.js default / the app already relies on the platform
sans). Sizes use the Tailwind v4 scale.

| Element          | Size / line-height          | Weight | Tailwind          | Color         |
|------------------|-----------------------------|--------|-------------------|---------------|
| Hero eyebrow     | 12px / 16px, +0.08em tracking, uppercase | 600 | `text-xs font-semibold uppercase tracking-wider` | Accent `#4f46e5` |
| Hero title       | 36px / 40px (desktop), 28px / 34px (mobile) | 700 | `text-4xl` / `text-3xl` | Primary `#0f172a` |
| Hero subtitle    | 16px / 24px                 | 400    | `text-base`       | Secondary `#475569` |
| Search input text| 16px / 24px                 | 400    | `text-base`       | Primary `#0f172a` |
| Section label    | 14px / 20px, +0.02em        | 600    | `text-sm font-semibold` | Primary `#0f172a` |
| Card title       | 16px / 22px                 | 600    | `text-base font-semibold` | Primary `#0f172a` |
| Card author      | 14px / 20px                 | 400    | `text-sm`         | Secondary `#475569` |
| Chip text        | 12px / 16px                 | 500    | `text-xs font-medium` | per chip color |

- Card titles clamp to 2 lines (`line-clamp-2`); authors clamp to 1 line
  (`truncate`).

## 6. Responsive grid (columns per breakpoint)

| Breakpoint | Min width | Container       | Card columns | Grid utility                         |
|------------|-----------|-----------------|--------------|--------------------------------------|
| Mobile     | 0         | full, `px-6`    | 1            | `grid-cols-1`                        |
| Tablet     | 768px (`md`) | full, `px-6` | 2            | `md:grid-cols-2`                     |
| Desktop    | 1024px (`lg`) | `max-w-6xl`, `px-6` | 3      | `lg:grid-cols-3`                     |

Full grid utility: `grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3`.

Hero search row:
- Mobile: search input full width; chip row wraps below it.
- Tablet and up: search input on its own row at a comfortable max width
  (`max-w-xl`), chip row directly below; both left-aligned.

## 7. Component inventory

Build these as components (suggested names; the spec author may rename). Match
the existing `src/components/` style (named exports, typed props, Tailwind v4).

1. **`DiscoverHero`** - eyebrow, title, subtitle, `SearchInput`, `CategoryChipRow`.
   - Props: optional `query`, `onQueryChange`, `activeCategory`, `onCategoryChange`.
2. **`SearchInput`** - 48px-tall rounded input (`rounded-lg`) with a leading
   magnifier icon (muted `#94a3b8`), placeholder "Search by title or author",
   border `#e2e8f0`, focus ring in accent `#4f46e5`.
3. **`CategoryChipRow`** - horizontal wrapping row of filter chips. One chip per
   category plus an "All" chip. Active chip uses the accent fill
   (`bg-indigo-600 text-white`); inactive chips use the soft surface
   (`bg-white border-slate-200 text-slate-700`).
4. **`DiscoverBookCard`** - a richer card than the home `BookCard`. Vertical
   layout: cover block on top (full card width, aspect ratio ~3:4, `coverColor`
   background, `rounded-md`), then title, author, then a `TagChipRow`.
   - Props: `{ book: FeaturedBook }`.
5. **`TagChipRow`** - the per-card category/tag chips (colored pills from the
   chip palette in section 3). 1 to 3 chips per card.
6. **`DiscoverGrid`** - the responsive grid wrapper mapping over the featured
   list and rendering `DiscoverBookCard`.

A `FeaturedBook` shape (the spec author defines the real type):

```ts
interface FeaturedBook {
  id: string;
  title: string;
  author: string;
  coverColor: string;   // hex swatch
  tags: string[];       // e.g. ["Sci-Fi", "Fiction"]
}
```

### Featured book list (concrete reference data, 9 books)

Use these so the screen has real content. Tags map to the chip palette.

| # | Title                                  | Author                | coverColor | Tags                       |
|---|----------------------------------------|-----------------------|------------|----------------------------|
| 1 | The Three-Body Problem                 | Liu Cixin             | `#c0556a`  | Sci-Fi, Fiction            |
| 2 | Project Hail Mary                      | Andy Weir             | `#6f8fb0`  | Sci-Fi                     |
| 3 | The Name of the Wind                   | Patrick Rothfuss      | `#8e6fd6`  | Fantasy, Fiction           |
| 4 | Circe                                  | Madeline Miller       | `#b8893a`  | Fantasy, Classic           |
| 5 | Sapiens                                | Yuval Noah Harari     | `#d68f5b`  | Non-Fiction                |
| 6 | Educated                               | Tara Westover         | `#9c6b8e`  | Non-Fiction                |
| 7 | Klara and the Sun                      | Kazuo Ishiguro        | `#4fb0a5`  | Sci-Fi, Fiction            |
| 8 | The Pragmatic Programmer               | Hunt and Thomas       | `#5b8def`  | Non-Fiction                |
| 9 | Designing Data-Intensive Applications  | Martin Kleppmann      | `#3f7d4f`  | Non-Fiction                |

Categories for the chip row (in order): **All, Fiction, Sci-Fi, Fantasy,
Non-Fiction, Classic**.

## 8. Copy strings (verbatim)

- Eyebrow: `DISCOVER`
- Hero title: `Browse Books`
- Hero subtitle: `Find your next read from a curated shelf of recommendations.`
- Search placeholder: `Search by title or author`
- Section label: `Featured`
- Empty state (if search yields nothing): `No books match your search.`

## 9. States and interaction

- **Card hover:** border shifts `#e2e8f0` -> `#cbd5e1`, add a subtle shadow
  lift (`shadow-sm` -> `shadow-md`), 150ms transition. Wrap the transition in a
  `prefers-reduced-motion: reduce` guard so it is suppressed when the user
  requests reduced motion.
- **Chip active vs inactive:** active = accent fill; inactive = soft surface.
  Clicking a category chip filters the featured list to books whose `tags`
  include that category ("All" shows everything). This filter may be wired or
  left presentational; if wired, it is pure client state.
- **Focus:** all interactive elements (search input, chips) have a visible
  focus ring in the accent color (`focus-visible:ring-2 ring-indigo-500`).
- **Keyboard:** chips are real `<button>` elements; the search field is a real
  `<input type="search">`. No custom key handling required beyond native.

## 10. Accessibility notes

- Use semantic elements: `<section>` for hero and grid, `<input type="search">`
  for search, `<button>` for chips, `<article>` for each card.
- Cover swatches are decorative (`aria-hidden="true"`), matching the existing
  `BookCard`.
- Chip row is a set of toggle buttons; mark the active one with
  `aria-pressed="true"`.
- Maintain a visible focus indicator on every interactive element.

## 11. Out of scope (for the exercise)

- No real data fetching (the existing app is mock-data only; this screen uses a
  local featured list).
- No persistence, no add-to-reading-list wiring.
- No backend, no Open Library call (that is the intermediate exercise).

The spec author is free to extend within the visual language above, but the
hero plus responsive featured card grid with cover, title, author, and category
chips is the minimum the finished screen must deliver.
