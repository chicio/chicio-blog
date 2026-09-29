---
name: paired-variant-swap-mutant
description: Presentational components that map two slots onto two visual variants (previous→blue pill, next→red pill) are usually tested by link name/href only, so swapping the variants passes every test — mutate the mapping
metadata:
  type: feedback
---

Rule: when a new presentational component's only real decision is which variant each slot gets
(previous → `BluePillLink`, next → `RedPillLink`; primary → filled, secondary → outline), check
that a test pins the mapping, not just the presence. Tests written as "renders both pills with their
titles and urls" and "renders only the previous pill when there is no next" (count + name) all pass
when the two variants are swapped.

**Why:** seen on PreviousNextNavigation (2026-09-28): the swap mutant passed all five tests. The
mapping is the component's specified behaviour (the plan says "blue/red pills"), and coverage is
100% either way because both branches execute.

**How to apply:** for every slot→variant pair, look for an assertion on the variant's own marker
(the pill atoms emit `pill-blue` / `pill-red` classes) scoped to that slot's link. None = blocking
(missing test for changed behaviour). Prove it with one swap mutant in a shadow tree
([[verify-mutation-claims-in-a-shadow-src-tree]]).

An accepted fix: a helper that runs `link.querySelector(".pill-blue"/".pill-red")` on each slot's link
(the pill `div` sits inside the `<a>`, so descendant lookup works), plus a check on
`getAllByRole("link")` order. Run a second **order mutant** (render next before previous) as well. Note that
`toEqual([a, b])` on DOM nodes compares them structurally (`isEqualNode`), not by identity, so an order
assertion only means something when the two slots render different text.

Related: [[deleted-prop-and-collapsing-enum-tests]].
