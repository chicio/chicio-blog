---
name: content-conversion-self-oracle-tests
description: a mechanical MDX conversion (body <-> frontmatter list) is tested against the converted data itself, so the test cannot see loss; diff old vs new with gray-matter in the scratchpad, then check the page order in the gate-runner's prerendered HTML
metadata:
  type: feedback
---

When a Work Unit mechanically moves content between an MDX body and its frontmatter (Art's `![caption](src)` lines
into `metadata.gallery: [{ src, caption }]`, or the reverse: Game/Console `metadata.gallery` into a literal body
`<ImageCarousel images={[…]} />` plus a facts slot), the new test usually reads the converted data back and asserts
the generator emits it. That test uses the output as its own oracle: a dropped image, a reordered pair or a mangled
emoji caption would all stay green (a `length > 100` guard does not help either).

**Why:** the grader looks complete while proving nothing about the conversion's fidelity, which is the one thing
the plan asked for ("same paths, same order, rest of the body byte-identical").

**How to apply:**
- `git archive <base> apps/website/src/content/<section> | tar -x -C <scratch>/base` (and the same for HEAD) gives
  both trees in one call each. Then a `.cjs` script requiring the root `node_modules/gray-matter` compares, per
  file: the old list (or its code fallback, e.g. `gallery || [image]`) with the new one pairwise, the parsed
  frontmatter minus the moved key, the raw frontmatter text (only the moved lines may differ), and the body once the
  inserted block and any added import are removed. Also count imports (exactly one) and slots (exactly one).
- Known false positive: an item whose base body was empty ends up with a single leftover `\n` after you strip the
  inserted block. That is not loss.
- Page order (carousel before pills, etc.) needs no browser: the gate-runner leaves a build in
  `apps/website/.next/server/app/<route>.html`; confirm `.next/BUILD_ID` is newer than the HEAD commit, then compare
  string offsets of the first image (`encodeURIComponent` form, `/_next/image?url=`) and the pill label for every
  item. Read-only, covers all items, not just the one e2e samples.
- Report the result; only raise a blocking finding if the diff is actually lossy. Also check for sibling
  content-file churn: `.prettierignore` excludes `apps/website/src/content/**`, so a large reformat diff in an MDX
  there (re-indented JSON code blocks, padded tables) was forced by hand and changes what gets published.

See [[fact-sheet-drift-intent-and-authorship]], [[test-fixture-on-a-flagged-content-bug]].
