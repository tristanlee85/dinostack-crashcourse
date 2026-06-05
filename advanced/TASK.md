# Advanced Exercise - Design-to-Code

## Problem

The Discover screen (`/discover`, at `src/app/discover/page.tsx`) is an unstyled
placeholder. Turn it into a polished book-discovery screen matching the
committed design in `advanced/design/`. Authoring the full spec yourself - the
success criteria, the constraints, the breakdown into work - is the exercise:
read the design, then write the Brief that turns it into a plan.

## How to start

1. Check out this branch:
   ```bash
   git checkout advanced
   ```
2. Read the design assets, starting with the authoritative spec:
   - `advanced/design/spec.md` (the source of truth - palette, spacing,
     typography, responsive grid, component inventory, copy)
   - `advanced/design/discover-desktop.png` and
     `advanced/design/discover-mobile.png` (visual references)
   - `advanced/design/README.md` (how to read the assets, plus the **optional**
     Figma-MCP enhanced path if you have that server configured)
3. Run the app to see the current placeholder you are replacing:
   ```bash
   npm install
   npm run dev
   ```
   then open `/discover`.
4. Author your own Brief from this problem statement:
   ```
   /brief
   ```
   Decide the success criteria, non-goals, constraints, and how you will verify
   the screen matches the design. The design spec gives you everything you need
   to write a precise Brief.
5. Implement against your Brief:
   ```
   /implement-ticket
   ```

### Optional: Figma MCP

If you have the Figma MCP server configured, you may pull design tokens from a
real public reading-app or book-discovery Figma Community file of your choice
instead of transcribing the palette by hand. See `advanced/design/README.md`
for search-term guidance. This path is optional - `advanced/design/spec.md` is
fully self-contained.
