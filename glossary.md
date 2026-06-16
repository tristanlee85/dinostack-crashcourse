# Glossary

The Ubiquitous Language for this project - the domain terms the team and any LLM agents working in this repo use to describe the system. Keep this list current as the domain evolves; agents prefer existing terms over inventing synonyms.

<!-- Format: each entry is a term followed by a one-to-two sentence definition. -->
<!-- Group related terms under H2 headings as the glossary grows. -->

## Domain terms

- **Book** - the single domain entity in the Reading Room: a record with a title, author, and reading status.
- **ReadingStatus** - a Book's state; one of `to-read`, `reading`, or `finished`.
- **Reading Room** - the sample app itself ("DinoStack Reading Room"), a personal reading-list tracker built on `main`.
- **Tier** - a difficulty level and exercise branch: one of `intro`, `intermediate`, or `advanced`.
- **TASK.md** - the per-branch exercise spec a learner works from, shipped at a graduated level of detail on each Tier branch.

DinoStack role terms (Conductor / Worker / Skeptic) are defined in the README mental-model section.
