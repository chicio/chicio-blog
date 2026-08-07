---
name: fact-sheet-drift-intent-and-authorship
description: When a plan bounds content prose with a fact sheet, drift shows up as intent framing and widened authorship, not as invented names
metadata:
  type: feedback
---

On content PRs whose plan carries a "these are the ONLY facts you may use" sheet, the implementer reliably obeys
the loud prohibitions (no invented composer, no invented date) and reliably drifts in two quieter ways:

- **Widened authorship**: a source says team X made the *sound*; the prose says team X made "the chime and
  startup screen", silently claiming the visual too.
- **Manufactured intent**: an undocumented "a deliberate contrast to...", "a deliberate move away from..."
  glued onto a documented description, asserting designer intent the sheet never established.

Also expect **disclaimer padding** where the sheet says "creation not documented": instead of the short honest
description the plan asked for, you get a fourth-wall sentence ("so this page won't guess at a composer").

**Why:** the fabrication check is the one thing no gate can run, and these forms survive a casual read because
the sentence around them is fully sourced. The project's writer rule is specifically about not reattributing
work, so widened authorship is the highest-severity form.

**How to apply:** diff each new sentence against the sheet clause by clause, not sentence by sentence. Grep the
added prose for `deliberate|intentional|meant to|designed to|in order to` and for compound subjects joined by
`and` in an authorship sentence. Treat widened authorship as blocking (it is a factual claim about a person),
manufactured intent as blocking-or-non-blocking depending on how load-bearing it is, and disclaimer padding as
non-blocking style. Group them into one finding so the fix is a single cheap round.
