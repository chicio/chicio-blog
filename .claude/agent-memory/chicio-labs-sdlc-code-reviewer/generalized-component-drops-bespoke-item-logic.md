---
name: generalized-component-drops-bespoke-item-logic
description: when a hardcoded list component (Menu, Footer, …) is rewritten to take injected data, diff the OLD per-item logic (prefix selection, special-cased hrefs) against the new generic rule — one-off behaviour silently disappears
metadata:
  type: feedback
---

When a component that hardcoded its items is generalised into an injected-data API, the generic rule
(e.g. "selected when `to === currentPath`") replaces every per-item expression. Read the OLD source item by item
(`git show main:<file>`) and list any item whose logic differed from the pattern: the old Menu selected "Authors"
on `pathname === blogAuthors || pathname.startsWith(blogAuthor + "/")`, a prefix match the exact-match API cannot express.

**Why:** tests are rewritten against the new API, so nothing fails; the loss only shows up when the consumer adopts it
(often a later PR), as a menu entry no longer highlighted on sub-pages.

**How to apply:** if the plan fixed the generic rule, report the lost case as non-blocking and flag it for the
adopting PR (it needs an extra field such as an `activePaths`/match predicate, or it accepts the regression). If the
plan did not fix the rule, it is a behaviour mismatch and blocks.
