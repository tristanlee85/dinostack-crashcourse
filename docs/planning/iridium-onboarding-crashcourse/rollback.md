# Rollback: iridium Onboarding Crashcourse

Greenfield repo with no production surface, no database, no external writes. Rollback is cheap and total at every level. Nothing here is irreversible.

## Per-unit rollback
Each unit is implemented on an isolated worktree branch and merged to the conductor branch only after Skeptic (and QA, where applicable) sign-off. To roll back an un-merged unit: discard the worktree branch (`git worktree remove` + `git branch -D`); nothing reaches the conductor branch. No downstream unit consumes an un-merged unit's output, so discarding one never corrupts another.

## Per-wave rollback
- **W1-W3 (main-shipping units):** if a wave is bad, `git reset --hard <pre-wave-SHA>` on the conductor branch returns to the prior wave boundary. The conductor records the SHA at each wave boundary in-context. No published artifact yet (no PR merged to `main` until the conductor explicitly lands it), so reset is safe.
- **Finalize-`main` barrier:** the single highest-leverage rollback point. If a defect is found after `main` is finalized but before W4 forks, fix on `main`, re-finalize, and re-record the SHA. W4 has not started, so no tier branch is contaminated.
- **W4 (tier branches):** each tier branch is standalone and never merged into `main` or a sibling. A bad tier branch is deleted and re-forked from the recorded finalized-`main` SHA. Because the three are independent, re-forking one does not touch the others.
- **W5 (U11):** README-only corrections on `main`. Pure doc edit; revert with a single commit.

## Dominant failure mode and its recovery
**R1 - fork from the wrong base.** Recovery: delete the mis-forked tier branch (`git branch -D <tier>` + remove its worktree) and re-fork from the recorded finalized-`main` SHA. Detected early because the integration QA on each tier branch runs the app, and a mis-forked branch would be missing U4/U7 output.

## Repo-level rollback
Nothing is pushed to a remote until the operator provides one (hosting is pending). Until then, the entire build lives in local branches and can be discarded wholesale (`git reset`, `git branch -D`) with zero external impact. After a remote exists, standard branch-deletion/PR-revert applies; there is no migration or stateful resource to unwind.
