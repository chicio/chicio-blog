---
name: dedup-helper-falsy-vs-nullish
description: when a fix deletes a private helper in favour of a shared one ("use serializationLabel instead of the local serialization()"), diff the fallback operator; `x ? a : b` treats "" as missing, `x ?? b` does not
metadata:
  type: feedback
---

Rule: a de-duplication fix that swaps one surface's private formatter for the shared helper can change behaviour for
edge-case input, even when both outputs match for every seed entry. The usual culprit is the fallback: the deleted
helper wrote `end ? \`${start}–${end}\` : \`${start}–present\``, the shared one writes `${end ?? "present"}`. An empty
string is falsy but not nullish, so `serializationEndYear: ""` goes from "2003–present" to "2003 – ".

**Why:** the seed data never has the edge case (both Manga are Completed), so every test and the e2e stay green.
Whether it matters depends on what the content producer writes. For the Manga this was safe: the
website-content:write-new-manga skill leaves `serializationEndYear` out for an ongoing series (SKILL.md) rather than writing
`""`. Seen at the Manga Integration Review round 2 (2026-09-29).

**How to apply:** on any "use the shared helper" fix, read the deleted helper's conditions next to the survivor's and
ask what the content producer (skill, frontmatter template, CMS) emits for the missing case. Block only if a real
producer emits the value that now renders differently; otherwise note it.

Related: [[metadata-adapter-to-passthrough-divergence]], [[generalized-component-drops-bespoke-item-logic]].
