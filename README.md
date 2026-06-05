# Iridium Onboarding Crashcourse

A hands-on, low-stakes way to learn to drive the **iridium** framework for AI-assisted
development. You fork this repo, install iridium, and work through three graduated
exercises in a paired-programming session - you and your AI agent, side by side. There is
no autograder and no score. Success is observation-based: you (and whoever you are pairing
with) judge whether each outcome is acceptable on your own terms.

The crashcourse exists to teach one habit above all others: **spec-first planning**. The
single highest-leverage thing you can do before asking an agent to build something is to
write down what you actually want first. These exercises graduate how much of that spec is
handed to you, so by the advanced tier you are writing it yourself.

## The core lesson: spec-first planning

As code generation gets cheaper, the bottleneck moves upstream - from typing the code to
deciding what to build and how you will know it works. The agent can write a lot of code
fast; that is exactly why a vague request produces a lot of confidently-wrong code fast.

Authoring the spec up front - the problem, the success criteria, the constraints, and how
you will verify the result - is the habit that most determines output quality. iridium is
built around this idea: the `/brief` command opens a planning dialogue before any code is
written, and the rest of the workflow holds the implementation accountable to that spec.

The three tiers in this crashcourse graduate how much spec you are given:

- **intro** ships a complete Brief - you read it and run the workflow.
- **intermediate** ships a partial Brief - you fill the gaps.
- **advanced** ships only a problem statement - you author the whole Brief yourself.

By the end you should feel the difference between starting from a tight spec and starting
from a blank page, and understand why the spec is worth writing.

## What you will build

The sample app is the **Iridium Reading Room** - a small personal reading-list tracker. It
is mock-data-only: there is no backend and no database, just local seed data and React
state. The app exists only to host the exercises; it is not a product you are shipping.

The base app (on `main`) has a home page with a filterable book grid and per-status counts,
plus a placeholder `/discover` screen that the advanced exercise restyles. The seed library
holds 9 books split across three reading statuses (`to-read`, `reading`, `finished`).

## Prerequisites

- **Node 20.9+** - the current LTS line. `next@16` requires Node `>=20.9.0`, and Node 18
  has reached end-of-life. Do not run this on Node 18.
- **npm 10+** - bundled with Node 20+, so installing a current Node gives you a compatible
  npm automatically.
- **Claude Code**, or another supported adapter tool. iridium ships adapters for Cursor,
  Codex CLI, Gemini CLI, Kimi Code CLI, OpenCode, Pi, oh-my-pi, and Hermes. See the iridium
  framework README for the full adapter list and per-tool setup.
- **git** - to fork, clone, and check out the tier branches.
- **python3** - the iridium installer uses it for path resolution and config writes.

## Install iridium

> **Naming note:** the framework is being renamed to iridium, but the install still pulls
> from the `agentic-engineering` repository until the rename ships. The commands below use
> the current repository name on purpose - they are the real, working install steps.

One-liner install (quickest):

```bash
curl -fsSL https://raw.githubusercontent.com/Space-Dinosaurs/agentic-engineering/main/bootstrap.sh | bash
```

This clones the repo into `agentic-engineering/` inside your current directory, runs the
installer, and records the install path in `~/.agentic/agentic-engineering-config.json` so
the updater and the `/update-agentic-engineering` command know where to find it.

**The repository is currently private**, so the one-liner's HTTPS clone may fail. The
bootstrap script automatically falls back to SSH; if you prefer to run the SSH path
directly:

```bash
git clone git@github.com:Space-Dinosaurs/agentic-engineering.git && cd agentic-engineering && bash bootstrap.sh
```

**Custom install location:** set `AE_DEST_DIR` before running to install somewhere other
than the current directory (the default is `<current directory>/agentic-engineering`):

```bash
AE_DEST_DIR=~/tools/agentic-engineering curl -fsSL https://raw.githubusercontent.com/Space-Dinosaurs/agentic-engineering/main/bootstrap.sh | bash
```

The installer requires `git` and `python3`; `node` is optional at install time (it is only
needed later for the updater's interactive UI).

## Activate iridium for this project

iridium has two global activation modes, chosen at install time and stored in
`~/.claude/agentic-engineering.json`:

- **opt-out (default)** - the methodology is active in every project unless that project's
  root `AGENTS.md` says otherwise.
- **opt-in** - the methodology is installed but dormant, and only runs in projects whose
  root `AGENTS.md` carries the opt-in marker.

Per-project activation is a single line in the project's root `AGENTS.md`:

```
agentic-engineering: opt-in
```

**This repo already carries that line** - its root `AGENTS.md` has the `opt-in` marker
under the `## Activation` section, so the framework activates here regardless of which
global mode you installed.

Confirm activation is working with:

```
/agentic-status
```

It reports the resolved mode, the project marker, and the active profile.

## Recommended permissions

Agents need uninterrupted access to Bash, Edit, and Write. Constant permission prompts
break the agent's flow, and - importantly for this crashcourse - they cause subagents to
stall, because a backgrounded worker cannot answer a prompt. The iridium installer offers
to configure `bypassPermissions` mode in `~/.claude/settings.json`, pairing an allow list
for routine tools with a deny list for destructive commands.

Accept that setup when prompted. For the exact allow list, deny list, and additional
directories, see the **Recommended permissions** section of the iridium framework README.

## The mental model: conductor, worker, skeptic

iridium runs as a small team of roles. Understanding these three is enough to follow what
your agent narrates as it works.

- **Conductor** - the main agent you talk to. It does not implement work directly. It
  decomposes the task, decides how risky each piece is, delegates the actual editing to
  workers, arranges review, and reports back. It stays available and focused on
  coordination.
- **Worker** - a focused subagent the conductor spawns to do one scoped piece of work (the
  most common worker is the **engineer**, which writes and edits code). A worker gets a
  narrow task and returns its result.
- **Skeptic** - an independent reviewer the conductor spawns to adversarially check a
  worker's output before it is accepted. The skeptic looks for correctness problems, missed
  edge cases, and shortcuts, and either signs off or sends findings back for a fix.

The loop you will see: the conductor classifies the task, spawns a worker to implement it,
spawns a skeptic to review the result, loops on any findings until the skeptic signs off,
and only then treats the work as done. On riskier changes you will also see a QA step that
verifies behavior in a browser.

## Risk classification, briefly

Before doing anything, the conductor assigns the task a risk level, which decides how much
review it gets:

| Level | What it means | What it triggers |
|---|---|---|
| Trivial | One-file, fully reversible change with no behavioral or shared-state impact (a typo, a label, a color). | Delegated to an isolated engineer; no skeptic. |
| Low | Reversible reads and exploration, or a single-file local change with no shared impact. | Direct action with a self-check; no skeptic. |
| Elevated | Anything with real blast radius: multi-file changes, new files, behavioral effects, security or shared state, architecture decisions. | A worker implements and a fresh skeptic reviews. |

When in doubt, the conductor classifies up, not down. Most of what you do in these
exercises is Elevated, so expect to see the worker-plus-skeptic loop.

## The command workflow

Three commands carry most of the workflow:

- **`/brief`** - opens a planning dialogue to author a spec (the Brief) before any code is
  written. Use it when you are starting from a blank page or an incomplete spec.
- **`/implement-ticket`** - runs the full implementation loop for a task: plan, delegate to
  a worker, review with a skeptic, run quality gates and QA, and open a pull request.
- **`/skeptic`** - runs an adversarial review on its own, when you want a second set of
  eyes on existing work without re-implementing it.

A worked micro-example of the routing you will see. Suppose you check out the intro branch
and run `/implement-ticket`:

```
Reading intro/TASK.md ...
Risk: Elevated - behavioral fix in shared filtering logic.
Spawning architect to produce a plan ...
Handing the plan to an engineer to implement the fix ...
Handing the engineer's diff to a skeptic for adversarial review ...
Skeptic: sign-off, no Critical or Major findings.
QA engineer verifying the filter counts in the browser ...
Opening a pull request ...
```

If a change is small and reversible, the conductor handles it directly without spawning
subagents - that is the protocol working correctly on a cheap task, not a sign that
something is off.

## How the exercises work

Each exercise lives on its own branch, forked independently from `main`:

| Branch | Flow | Spec you are given |
|---|---|---|
| `intro` | Fix broken code to a PR | Complete Brief (full spec) |
| `intermediate` | Feature / integration | Partial Brief (fill the gaps) |
| `advanced` | Design-to-code | Problem statement only (author your own Brief) |

Each branch carries exactly one `TASK.md` at the root describing its exercise. The branches
are independent - each forks off `main`, none depends on another - so you can attempt them
in any order. Switching to a fresh exercise is just a `git checkout`.

The graduated spec is the whole point. The intro Brief tells you exactly what to do; by the
advanced tier you have to decide what "done" even means and write that down yourself before
the agent builds anything.

## How to start each tier

### intro - fix a visible bug to a PR

```bash
git checkout intro
```

Read `intro/TASK.md` - it is a **complete Brief**: problem, success criteria, constraints,
and verification are all spelled out. Before fixing anything, run the app (`npm install`
then `npm run dev`) and observe the bug yourself: a filter badge shows a count that does not
match the number of books actually rendered under that tab. Seeing the broken behavior first
is part of the exercise.

Then run:

```
/implement-ticket
```

Watch the conductor plan the fix, delegate it to an engineer, review it with a skeptic, and
carry it through to a pull request. This tier is about seeing the end-to-end fix-to-PR flow
when the spec is handed to you complete.

### intermediate - feature / integration

```bash
git checkout intermediate
```

Read `intermediate/TASK.md` - it is a **partial Brief**. The problem and the core API
contract are filled in, but several decisions are deliberately left to you (state handling,
where the entry point lives, and so on), called out under a "you decide" heading. Fill those
gaps. You can do this in your head, or - better practice - use `/brief` to author the
missing parts of the spec first:

```
/brief
```

Once the spec is complete, run:

```
/implement-ticket
```

This tier is about practicing the judgment of completing an underspecified task before
handing it to the agent.

### advanced - design-to-code

```bash
git checkout advanced
```

Read `advanced/TASK.md` - it is a **problem statement only** - and study the design assets
under `advanced/design/` (a written spec plus screenshots that are the source of truth for
the target screen). There is no Brief; you author it. Use `/brief` to turn the problem
statement and design into a real spec:

```
/brief
```

Then implement against it:

```
/implement-ticket
```

The committed screenshots and spec are enough to complete this tier unaided. If you have
the Figma MCP configured, there is an optional enhanced path described in the task - point
it at any public reading-app or book-discovery Figma Community file of your choice - but it
is not required.

## Running the app

From the repo root, on any branch:

```bash
npm install        # install dependencies
npm run dev        # start the dev server at http://localhost:3000
```

The other scripts (use these exact names - they are what `package.json` defines):

```bash
npm run build      # production build
npm run lint       # ESLint flat-config check (runs eslint . --max-warnings 0)
npm run typecheck  # tsc --noEmit, no type errors allowed
```

Note that linting runs ESLint directly (`eslint .`), not a Next.js lint wrapper. Run these
gates before you consider an exercise finished.

## A note on "done"

There is no automated pass/fail grade in this crashcourse, by design. Success is
observation-based: you and your pair look at the result and decide whether the outcome is
acceptable. The intro tier has a clearly-correct end state (the counts match the rendered
books); the intermediate and advanced tiers are more open, and "good enough" is a judgment
call you make.

The point is not to satisfy a grader. It is to practice spec-first planning and to build a
feel for driving iridium end-to-end, so that the judgment of what "done" means becomes
yours.

## Fork and clone

Fork the canonical repository at https://github.com/tristanlee85/iridium-crashcourse to your
own account, then clone your fork:

```bash
git clone git@github.com:<your-username>/iridium-crashcourse.git
cd iridium-crashcourse
```

Forking (rather than cloning the upstream directly) gives you a personal copy you can push
exercise branches and PRs to. The `TASK.md` files ship inside the repo on each branch, so
they copy to your fork automatically.

## Where to learn more

- The **iridium framework README** (in the `agentic-engineering` repository you installed
  from) - the full command reference, the complete recommended-permissions setup, the
  adapter list, and the deeper protocol docs.
- `/agentic-help` - a zero-token, static reference listing every iridium slash command.
- `/agentic-status` - reports how iridium is currently activated in this project.
- This repo's own `glossary.md` - the domain terms used in the Reading Room app. The
  iridium role terms (conductor, worker, skeptic) are defined in the mental-model section
  above.
