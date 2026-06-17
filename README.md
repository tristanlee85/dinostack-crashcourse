# DinoStack Onboarding Crashcourse

A hands-on, low-stakes way to learn to drive the **dinostack** framework for AI-assisted
development. You fork this repo, install dinostack, and work through three graduated
exercises in a paired-programming session - you and your AI agent, side by side. There is
no autograder and no score. Success is observation-based: you (and whoever you are pairing
with) judge whether each outcome is acceptable on your own terms.

The crashcourse exists to teach one habit above all others: **spec-first planning**. The
single highest-leverage thing you can do before asking an agent to build something is to
write down what you actually want first. These exercises graduate how much of that spec is
handed to you, so by the advanced tier you are writing it yourself.

## The core lesson: spec-first planning

As code generation gets cheaper, the bottleneck moves upstream - from typing the code to
deciding what to build and how you will know it works. That is exactly why a vague request
produces a lot of confidently-wrong code fast.

Authoring the spec up front - the problem, the success criteria, the constraints, and how
you will verify the result - is the habit that most determines output quality. dinostack is
built around this idea: when you start a task with `/implement-ticket`, the framework opens a
planning dialogue first (it runs `/brief` for you when the work needs a plan), and the rest
of the workflow holds the implementation accountable to that spec.

The three tiers in this crashcourse graduate how much spec you are given:

- **intro** ships a complete Brief - you read it and run the workflow.
- **intermediate** ships a partial Brief - you fill the gaps.
- **advanced** ships only a problem statement - you author the whole Brief yourself.

By the end you should feel the difference between starting from a tight spec and starting
from a blank page, and understand why the spec is worth writing.

## What you will build

The sample app is the **DinoStack Reading Room** - a small personal reading-list tracker. It
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
- **Claude Code**, or another supported adapter tool (dinostack ships 9 adapters - see the docs).
- **git** - to fork, clone, and check out the tier branches.
- **python3** - the dinostack installer uses it for path resolution and config writes.

## Install dinostack

One-liner install (quickest):

```bash
curl -fsSL https://docs.dinostack.ai/install.sh | bash
```

This clones the repo, runs the installer, and records the install path in
`~/.agentic/agentic-engineering-config.json` so the updater can find it later. As a plain
alternative, you can clone over SSH and run the bootstrap yourself:

```bash
git clone git@github.com:Space-Dinosaurs/DinoStack.git && cd DinoStack && bash bootstrap.sh
```

**Custom install location:** set `AE_DEST_DIR` before running to install somewhere other
than the current directory (the default is `<current directory>/DinoStack`):

```bash
AE_DEST_DIR=~/tools/DinoStack curl -fsSL https://docs.dinostack.ai/install.sh | bash
```

The installer requires `git` and `python3`; `node` is optional at install time (it is only
needed later for the updater's interactive UI).

## Activate dinostack for this project

dinostack has two global activation modes, chosen at install time and stored in
`~/.claude/agentic-engineering.json`. In **opt-out (default)** the methodology is active in
every project unless its root `AGENTS.md` says otherwise; in **opt-in** it is dormant and
only runs in projects whose root `AGENTS.md` carries the opt-in marker:

```
agentic-engineering: opt-in
```

**This repo already carries that line**, so the framework activates here regardless of which
global mode you installed. Confirm activation with `/agentic-status` - it reports the
resolved mode, project marker, and active profile. For depth, see
https://docs.dinostack.ai#config .

## Recommended permissions

Agents need uninterrupted access to Bash, Edit, and Write. Constant permission prompts
break the agent's flow, and - importantly for this crashcourse - they cause subagents to
stall, because a backgrounded worker cannot answer a prompt. The dinostack installer offers
to configure `bypassPermissions` mode in `~/.claude/settings.json`, pairing an allow list
for routine tools with a deny list for destructive commands. Accept the installer's
bypassPermissions setup when prompted. For the exact allow list, deny list, and additional
directories, see https://docs.dinostack.ai#permissions .

## The mental model: conductor, worker, skeptic

Three roles are enough to follow what your agent narrates as it works.

- **Conductor** - the main agent you talk to; it decomposes the task and delegates the
  editing rather than implementing directly.
- **Worker (engineer)** - a focused subagent spawned to make one scoped change.
- **Skeptic** - an independent reviewer that adversarially checks the worker's output and
  either signs off or returns findings.

The loop: classify, spawn a worker, spawn a skeptic, iterate until sign-off, with a browser
QA step on riskier changes. For how these roles compose, see https://docs.dinostack.ai#agents.

## Risk classification, briefly

The conductor assigns each task a risk level that decides how much review it gets. **Trivial**
changes (a typo, a label, a color) go to an isolated engineer with no skeptic; **Low** changes
(reversible reads, a single-file local edit) are direct action with a self-check; **Elevated**
changes (multi-file or new files, behavioral effects, security, shared state, architecture) get
a worker plus a fresh skeptic. When in doubt, the conductor classifies up; most exercise work is
Elevated. See https://docs.dinostack.ai#risk for the full model.

## The command workflow

dinostack splits its commands into two groups: the few you type, and the ones the
framework runs for you based on how risky your task is.

**Commands you type**

- **`/implement-ticket`** - the workhorse you drive the exercises with. Point it at a
  task and it runs the full loop: plan, delegate to a worker, review with a skeptic,
  run quality gates and QA, and open a pull request.
- **`/init-project`** - scaffolds a new project (you will not need it here; this repo
  is already set up).
- **`/wrap`** - summarizes a session and updates the project's memory when you finish.

Occasionally useful: `/agentic-status`, `/agentic-help`, and `/pull-and-install`.

**Commands the framework runs for you**

- **`/brief`** - opens a planning dialogue to author a spec (a Brief) before any code
  is written. The conductor invokes it automatically when your task needs a plan, so
  you normally will not type it. You *can* run `/brief [topic]` to drive the spec
  yourself - the advanced tier is a good place to try that.
- **`/skeptic`** - adversarially reviews a worker's output. The conductor spawns it for
  you inside `/implement-ticket`'s review loop on almost every change.

So you mostly type `/implement-ticket`, and the framework runs `/brief` and `/skeptic`
on your behalf based on risk. You can still invoke them by hand, but rarely need to.

A worked micro-example: check out the intro branch and run `/implement-ticket`.

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
subagents - that is the protocol working correctly on a cheap task.

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
gaps. You can do this in your head, or let the conductor open a planning dialogue for you
when you run `/implement-ticket`. If you want to drive the spec explicitly first, you can run
`/brief`, but you do not have to.

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
the target screen). There is no Brief; you author it. When you run `/implement-ticket`, the
conductor opens a planning dialogue and walks you through authoring that Brief. If you would
rather drive the spec dialogue explicitly first, you can run `/brief` - but you do not have
to.

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
books); the intermediate and advanced tiers are more open, and "good enough" is your call.

The point is not to satisfy a grader. It is to practice spec-first planning and build a feel
for driving dinostack end-to-end, so the judgment of what "done" means becomes yours.

## Fork and clone

Fork the canonical repository at https://github.com/tristanlee85/dinostack-crashcourse to your
own account, then clone your fork:

```bash
git clone git@github.com:<your-username>/dinostack-crashcourse.git
cd dinostack-crashcourse
```

Forking (rather than cloning the upstream directly) gives you a personal copy you can push
exercise branches and PRs to. The `TASK.md` files ship inside the repo on each branch, so
they copy to your fork automatically.

## Where to learn more

- The [**DinoStack documentation**](https://docs.dinostack.ai) - a single anchored page
  covering permissions, risk, git, config, agents, and flows (`#permissions`, `#risk`,
  `#git`, `#config`, `#agents`, `#flows`).
- The [**getting-started slide deck**](https://docs.dinostack.ai/slides/getting-started-slides.html) -
  a walkthrough of the framework's core ideas.
- `/agentic-help` - the in-terminal command reference; the canonical source for every
  dinostack slash command.
- The **DinoStack framework README** (in the `DinoStack` repository you installed from) -
  reference material alongside the source.
- This repo's own `glossary.md` - the domain terms used in the Reading Room app. The
  dinostack role terms (conductor, worker, skeptic) are defined in the mental-model section
  above.
