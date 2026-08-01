---
name: derived-anchor-ids-must-be-diffed-against-rendered-output
description: When lib code re-derives heading anchor ids (github-slugger) to match rehype-slug, never accept synthetic unit tests as proof — diff extracted ids against the built HTML for every content.mdx
metadata:
  type: feedback
---

Any code that re-derives an id/anchor that must match what a rehype/remark plugin emits (heading slugs,
autolink anchors, figure ids) must be verified by diffing the derived values against the **actually rendered
markup for every `src/content/**/content.mdx`**, not by synthetic unit tests.

**Why:** the reading-companion TOC PR passed 1484 green unit tests, lint, typecheck, dependency-cruiser, knip
and build while silently emitting dead anchors on 11 pages. `rehype-slug` calls
`slugger.slug(hastToString(node))` with **no trim**; the lib helper called `mdastToString(node).trim()` before
slugging. Headings authored as `## <ParagraphTitleWithIcon ...> Hardware specs</...>` (leading space inside the
JSX children) render `id="-hardware-specs"` but the helper produced `hardware-specs`. Synthetic tests never
contain that whitespace, so nothing caught it. Two further real-content-only divergence sources to check:
`mdast-util-to-string` includes image `alt` text where `hast-util-to-string` returns nothing, and rehype-slug
skips (and does NOT consume a dedupe slot for) a heading that already has an `id`.

**How to apply:** write a throwaway script in the scratchpad (symlink the worktree `node_modules` in so bare
specifiers resolve, import the lib helper by absolute path) that, for every `content.mdx`, compares the derived
ids to `/<h[23][^>]*id="..."/` scraped from `.next/server/app/<relative-content-path>.html` after `npm run
build`. Zero mismatches over all ~550 files is the only acceptable evidence. Pages with no prerendered HTML
(dev-only routes) can be checked by `curl`-ing a running server instead. The same script shape also proves the
positive claims (h1 consuming a dedupe slot, `-1` suffixes, in-fence heading-like lines excluded).

Related: [[real-content-degenerate-shapes-must-drive-hierarchy-tests]]
