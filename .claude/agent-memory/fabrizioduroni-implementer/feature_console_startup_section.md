---
name: feature_console_startup_section
description: Startup section on videogame console pages; Youtube molecule title fix; mdx-to-markdown already handles Youtube+ParagraphTitleWithIcon
metadata:
  type: project
---

**mdx-to-markdown sanitizer already had first-class handlers for both components used by this section** (see
`src/lib/mdx/mdx-to-markdown.ts`): `transformYoutube` turns `<Youtube videoId="..." />` into a
`[Watch on YouTube](https://youtu.be/<id>)` link, and `transformParagraphTitleWithIcon` turns the heading
JSX into a plain `## <heading text>`. No markdown-negotiation code changes are needed when adding a new
`ParagraphTitleWithIcon` + `Youtube` section to a console page; verify by reading the generated
`.next/server/app/markdown/videogames/console/<slug>.body` files after a real prod build rather than assuming.

**Search index is unaffected by body-content changes on principle, not just for this PR**: `createSearchIndex`
(`src/lib/content/search-index-factory.ts`) only indexes `title`, `description`, `tags`, `authors` from
frontmatter, never the MDX body. Any future PR that only touches prose inside a `content.mdx` body needs no
search-index verification at all.

**MDX prose line-length discipline**: the project's "under 300 chars" rule for MDX prose is not enforced by
any linter or CI gate. The established pattern for staying under the limit without breaking a paragraph into
a separate block is *lazy continuation*: start a new physical line without a blank line before it and without
list-item indentation; CommonMark still joins it into the same paragraph/list item.

**No-dashes-in-prose rule scope**: only forbids em/en dashes and spaced hyphen incises (e.g. "word - word" as
a sentence break). Word-internal compound hyphens (Joy-Con, family-facing, tower-free, photosensitive-seizure)
are unaffected and fine to keep; don't over-apply the rule to legitimate compound adjectives or proper nouns.

**Review-round finding worth generalizing: don't pad fact-backed content with meta-disclaimers.** When a fact
sheet explicitly says a detail is undocumented, the instruction is "write the description only", not "write
the description and then announce the absence of a source". Sentences like "so this page won't guess at a
composer" break the fourth wall and add no fact; delete them rather than trim them.

See [[feature_videogames]], [[feature_mdx_to_markdown_sanitizer]], [[feedback_worktree_git_stash_hazard]].
