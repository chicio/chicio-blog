---
name: feature_mdx_to_markdown_sanitizer
description: Pure mdxToMarkdown() lib sanitizer (src/lib/mdx/mdx-to-markdown.ts) that strips/transforms JSX from raw MDX before it's injected into /markdown routes and the terminal overlay; AST-shape gotchas discovered while building it
type: project
---

## Overview

`src/lib/mdx/mdx-to-markdown.ts` exports `mdxToMarkdown(mdx: string): string`, a pure lib/ leaf (no React/component
imports) that parses raw MDX body content (the `content` field from `Content<T>`, i.e. gray-matter output with
frontmatter already stripped) into an mdast AST, strips/transforms MDX-only nodes, and stringifies back to plain
markdown. Wired 2026-07-23 into the 7 `/markdown` generators that inject raw content (`blogPostMarkdown`,
`aboutMeMarkdown`, `dsaRoadmapMarkdown`, `dsaTopicMarkdown`, `dsaExerciseMarkdown`, `consoleMarkdown`,
`gameMarkdown`) — NOT the pure frontmatter-listing generators (`homepageMarkdown`, `blogListingMarkdown`,
`dsaMarkdown`, `dsaExercisesListMarkdown`, `videogamesMarkdown`, `easterEggHuntMarkdown`), which never inject raw
content. This single fix cleans BOTH the AI-facing `/markdown/<path>` content-negotiation endpoint (see
[[feature_markdown_negotiation]]) and the terminal overlay's in-shell rendering (see
[[feature_terminal_navigation]]), since the terminal fetches that same endpoint directly.

## Pipeline

`unified().use(remarkParse).use(remarkMath).use(remarkMdx).use(remarkStringify, { bullet: "-", fences: true })`.
Manual recursive tree transform between parse and stringify (NOT `unist-util-visit` — a hand-rolled
`transformList`/`transformOne` flatMap was simpler here because several transforms need to REPLACE a node with zero,
one, or many sibling nodes, which `visit`'s in-place mutation API doesn't do cleanly). `unist-util-visit` was
therefore in the approved plan's "deps as needed" list but ended up unused — do not add it back without a real need
(knip would flag it).

**Critical ordering gotcha**: `remarkMath` MUST be registered before `remarkMdx`. Real blog content uses `$$...$$`
LaTeX blocks containing literal curly braces (e.g. `{\hat {R}} \cdot {\hat {N}}`). Without remark-math's micromark
extension registered first, remark-mdx's expression tokenizer tries to parse those braces as a JS expression and
throws `Could not parse expression with acorn` — this is NOT a test-only issue, it broke `next build` itself (static
generation of `/markdown/blog/post/2017/08/25/how-to-calculate-reflection-vector` failed the whole build). Mirrors
`next.config.ts`'s real remark plugin order (`remark-gfm, remark-emoji, remark-math, remark-frontmatter`) — only
`remark-math` was needed for parsing-safety; gfm/emoji/frontmatter don't touch brace-ambiguity and were deliberately
left out to avoid unrelated scope creep (emoji shortcodes like `:sunglasses:` stay literal in `/markdown` output,
unchanged pre-existing behavior).

## MDX AST shapes discovered (via a throwaway inspection script, not guessed)

- `remark-mdx`'s parser bundles a default acorn instance — `mdxJsxAttributeValueExpression` nodes get a real
  `data.estree` (an ESTree `Program`) for free, no extra acorn wiring needed. Walk
  `attr.value.data.estree.body[0].expression` to resolve string-literal / array-of-string-literal props
  (`ArrayExpression` of `Literal`) without any regex parsing of the raw JSX source text.
- Plain string JSX attributes (`alt="..."`, `caption="..."`) have `attr.value` as a raw JS string directly — no
  estree involved. Only expression-valued attributes (`images={[...]}`) need the estree walk.
- **Flow vs text JSX classification is content-shape-driven, not line-count-driven**: a *self-closing* component
  (`<Foo />`) is ALWAYS `mdxJsxFlowElement` when it starts its own line, regardless of whether its attributes span
  one line or many (confirmed: single-line `<Youtube videoId="x" />` and multi-line `<ImageCarousel images={[...]}
  .../>` both parse as flow). A component *with text children* on the same line as its tags
  (`<Foo>text</Foo>`) is classified as `mdxJsxTextElement` and gets wrapped in an ambient `paragraph` node by the
  block parser — this happens EVEN if it's the only thing on its own line with blank lines around it. This is why
  `ParagraphTitleWithIcon` (always used as `<ParagraphTitleWithIcon icon={...}>Text</ParagraphTitleWithIcon>`, never
  self-closing) is `mdxJsxTextElement` in 100% of the 147 real usages across the content tree, always nested as the
  sole child of an actual `##`/`###` markdown heading (the JSX never creates the heading; the surrounding `##`
  markdown syntax does). The sanitizer's `transformParagraphTitleWithIcon` just replaces the element with a plain
  `Text` node containing its flattened children (via `mdast-util-to-string`, which naturally ignores JSX attributes
  since they aren't part of `.children`) when `node.type === "mdxJsxTextElement"`, and synthesizes a depth-2 heading
  in the (currently unreachable via real content, kept for type-completeness/future-proofing) flow-element branch.
- `InteractiveBlock` (the DSA visualizer wrapper) needed NO special-casing at all: it's simply an "unknown component
  with children" to the generic fallback rule, and its sole child (a self-closing visualizer like
  `DynamicArrayVisualizer`) is itself on the explicit placeholder list — unwrap-then-recurse naturally produces the
  right output (drop `InteractiveBlock`, keep the placeholder for its child) with zero bespoke logic.
- TS typing pain point: mdast's `Parent` subtypes (`Heading.children: PhrasingContent[]`,
  `MdxJsxFlowElement.children: Array<BlockContent | DefinitionContent>`, etc.) each narrow `children` to their own
  union — there is no single settable type across all of them. The recursive transform works around this with one
  local `AnyContent = RootContent | PhrasingContent` union and two narrow, explicitly-commented `as` casts at the
  single `hasChildren`/re-assignment boundary, rather than threading generics through every helper.

## Deps added (all were already present transitively via `@mdx-js/mdx`/`react-markdown`, just promoted to direct)

`unified` (11.0.5), `remark-parse` (11.0.0), `remark-mdx` (3.1.1), `remark-stringify` (11.0.0),
`mdast-util-mdx-jsx` (3.2.0), `mdast-util-to-string` (4.0.0) → `dependencies` (build-time only: the `/markdown`
route is `force-static`, never in the client bundle). `@types/mdast`, `@types/estree-jsx` → `devDependencies` (type
-only imports). `remark-math` was ALREADY a direct dependency (used by the real MDX pipeline) — just imported into
the sanitizer too, no package.json change needed for it.

## Verification pattern used

Wrote small throwaway `.ts`/`.mjs` scripts run via `npx tsx` directly in the repo root (deleted immediately after)
to inspect the actual mdast AST shape and smoke-test against REAL content fixtures (Batman game, DSA array/
linked-list topics, MCP page, a blog post with `<Youtube>`) before committing to the transform design — this beat
guessing at remark-mdx's flow/text classification rules or its estree attribute representation from documentation
alone. The task's own acceptance check (`videogames/console/gameboy/game/batman` markdown must contain the Gameplay
heading + image links, no leaked JSX) was verified directly against the `.next/server/app/markdown/...body` file
after a real `next build`, not just via unit tests.
