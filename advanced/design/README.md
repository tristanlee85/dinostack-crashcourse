# Discover - Design Assets

This folder holds the committed design for the advanced exercise: turning the
bare `/discover` placeholder into a polished "Browse / Discover Books" screen.

## What is in here

| File                  | Role                                                          |
|-----------------------|--------------------------------------------------------------|
| `spec.md`             | **Authoritative.** The full written design spec - palette, spacing, typography, grid, component inventory, copy. Implement from this alone. |
| `discover-desktop.png`| Visual reference at 1440px-wide desktop. Wireframe placeholder. |
| `discover-mobile.png` | Visual reference at 375px-wide mobile. Wireframe placeholder.   |
| `_gen_mockups.py`     | One-off generator that produced the two PNGs (Python + Pillow). Reproducible; not imported by the app. Run `python3 _gen_mockups.py` to regenerate. |

## How to read these assets

1. **Start with `spec.md`.** It is the source of truth and is detailed enough to
   build the screen from text alone, without any image tooling or Figma. Every
   color is a concrete hex value, every breakpoint has a column count, and the
   copy strings are written verbatim.
2. **Use the PNGs as layout references.** They are labeled wireframe-style
   placeholders that show the overall structure (hero/search header on top, a
   responsive card grid below) at desktop and mobile widths. They are not
   pixel-perfect art - if a PNG and `spec.md` ever disagree, `spec.md` wins.
   These placeholders exist so the exercise has a visual anchor; replace them
   with real mockups if and when those are produced.

## Optional enhanced path: Figma MCP

If you have the Figma MCP server configured in your tool, you can pull design
tokens (colors, spacing, type styles) straight from a real Figma file instead
of transcribing them by hand. This is entirely optional - the exercise is fully
completable from `spec.md` with no Figma access.

To use it:

1. Open the Figma Community search and look for a reading-app or
   book-discovery UI kit. Good search terms:
   - `reading app UI kit`
   - `book discovery app`
   - `bookstore app UI`
   - `library app design`
   Figma Community search: https://www.figma.com/community/search?resource_type=mixed&query=reading%20app
2. Pick **any public Community file you like** the look of and duplicate it to
   your own drafts (Community files open read-only; duplicating gives you an
   editable copy the MCP can read).
3. Point the Figma MCP at your duplicated file and extract the palette, spacing
   scale, and text styles. Adapt them to the component inventory in `spec.md`.

No specific Figma file is named here on purpose: Community URLs rot over time,
and the goal is the skill of pulling tokens from a design source, not a single
fixed file. Treat whatever file you pick as a token source, and keep `spec.md`
as the structural contract for what the screen must contain.

## Scope reminder

The committed `/discover` route ships as an unstyled placeholder. Implementing
this design **is** the exercise - see `../TASK.md` for the problem statement and
how to start.
