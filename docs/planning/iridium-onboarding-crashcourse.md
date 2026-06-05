# Brief: iridium Onboarding Crashcourse

**Problem:** Engineers new to AI-assisted development skip the up-front spec/planning step that most determines output quality, and have no low-stakes, hands-on way to learn to drive the iridium framework. There is no guided environment where they can practice spec-first planning and run iridium end-to-end against realistic tasks of escalating difficulty.

**Success criteria:**
- A forkable repo whose root README is a self-contained guide - orients the engineer, walks iridium install/setup, and teaches the spec-first workflow (`/brief` -> `/implement-ticket`, conductor/worker/skeptic, risk classification) well enough to start unaided.
- Three tier branches (`intro`, `intermediate`, `advanced`), each a runnable Next.js + TS app carrying one `TASK.md` that exercises a distinct iridium flow: fix-broken-code-to-PR, feature/integration, and Figma design-to-code.
- Spec scaffolding graduates across tiers: intro ships a complete Brief, intermediate a partial Brief to finish, advanced a problem statement only (engineer authors the spec).
- A new engineer can fork, clone, follow the README, and work all three exercises in a paired-programming session, judging each outcome acceptable on their own terms.

**Non-goals:**
- No automated pass/fail grading or test-gate scoring of the engineer's work; success is observation-based and facilitator/self-judged.
- Not a rewrite or fork of the iridium framework itself - the crashcourse consumes iridium, it does not modify it.
- Not a production app; the sample app exists only to host the exercises.

**Constraints:**
- iridium brand in prose; reference real current command names (`/brief`, `/implement-ticket`, `/skeptic`, etc.); README notes install is via agentic-engineering until the rename ships.
- Tasks delivered as in-repo `TASK.md` per branch (forks-safe; not GitHub Issues, which do not copy to forks).
- Advanced Figma task must be completable from committed screenshots/specs alone, with an optional enhanced path via a public Figma link + Figma MCP when the engineer has it configured.
- Next.js + TypeScript; the intro "broken" state must be observably broken in the running app (not a hidden test-only failure).
- No em dashes in any generated text; repo intent-layer conventions apply.

**Verification:**
- `npm install && npm run build && npm run dev` succeeds on each of the three tier branches and the app loads.
- `intro` branch: the app exhibits the documented visible bug before the fix; intermediate/advanced branches build and run as a clean starting point.
- Each tier branch carries a `TASK.md` at the correct graduated spec level (full / partial / none); the root README renders as a complete standalone guide covering install + workflow.
- Manual smoke: a reviewer with no prior context forks, clones, and follows the README from zero, confirming each exercise is startable unaided. Acceptance is the reviewer's judgment that the onboarding path is followable - no autograder.

**QA criteria:**
```yaml
qa_skip: null
viewport: [desktop]
scenarios:
  - id: 1
    description: On each tier branch the sample Next.js app builds and loads in the browser without errors.
    method: browser
    evidence: Screenshot of the running app on intro, intermediate, and advanced branches.
  - id: 2
    description: On the intro branch the documented visible bug is reproducible before any fix.
    method: browser
    evidence: Screenshot showing the broken UI/behavior described in intro/TASK.md.
manual_smoke: >
  A reviewer with no prior context forks the repo, clones it, follows the root README
  from zero (including iridium install), and confirms they can start each of the three
  exercises unaided. Outcome acceptance is the reviewer's judgment that the onboarding
  path is followable; there is no automated grade.
```

**Linked artifacts:** architect-plan: pending; orchestration: pending

---

## Resolved decisions (from /brief dialogue, 2026-06-04)

- **Structure:** 3 branches, one task each. Archetype -> tier: bug-fix = `intro`, feature/integration = `intermediate`, Figma design-to-code = `advanced`.
- **Stack:** Next.js + TypeScript web app (supports all three archetypes + browser QA).
- **Spec model:** graduated - full Brief (intro) -> partial Brief (intermediate) -> problem statement only / author-your-own (advanced).
- **Branding:** "iridium" brand in prose; real current command names; install via agentic-engineering until the rename ships.
- **Success model:** observation-based, no autograder. Paired-programming session; engineers experiment with prompt setup and spec-first planning and judge outcomes on their own terms.
- **Task delivery:** in-repo `TASK.md` per branch (forks-safe).
- **README:** comprehensive, self-contained methodology guide.
- **Figma tier:** committed screenshots/specs as the baseline path; optional enhanced path via a public Figma link + Figma MCP when configured.

## Open / operator-owned (not blocking design)

- **Hosting:** repo has no git remote yet. "Fork this repo" needs a GitHub home (org/account) before the README can name a real URL. Operator to provide.
