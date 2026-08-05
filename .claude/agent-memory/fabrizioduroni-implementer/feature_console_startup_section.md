---
name: feature_console_startup_section
description: Startup section on videogame console pages; Youtube molecule title fix; mdx-to-markdown already handles Youtube+ParagraphTitleWithIcon
type: project
---

Shipped: a `Startup` section (`FiPower` icon, `ParagraphTitleWithIcon` heading, placed after Hardware specs
and before Trivia & Fun Facts) on 10 of 11 videogame console content.mdx files
(`src/content/videogames/console/<slug>/content.mdx`). NES excluded on purpose (no boot intro to describe).
Embeds a real YouTube clip of the console's boot sequence via the existing `Youtube` design-system molecule
(`src/components/design-system/molecules/video/youtube/`), no new component.

**Youtube molecule bug fixed as part of this PR**: `title` was hardcoded to `"React Native multiple debugger"`
on every embed site-wide (20+ blog MDX call sites). Added an optional `title?: string` prop defaulting to
`"YouTube video"`, kept it a pure pass-through (no store, per the no-pass-through-store convention), and passed
the original accurate title explicitly on the two call sites in the post it actually belonged to
(`src/content/blog/post/2017/12/08/react-native-multiple-instance-rctrootview/content.mdx`) so that post
doesn't regress.

**mdx-to-markdown sanitizer already had first-class handlers for both components used here** (see
`src/lib/mdx/mdx-to-markdown.ts`): `transformYoutube` turns `<Youtube videoId="..." />` into a
`[Watch on YouTube](https://youtu.be/<id>)` link, and `transformParagraphTitleWithIcon` turns the heading
JSX into a plain `## <heading text>`. No markdown-negotiation code changes were needed; verified by reading
the generated `.next/server/app/markdown/videogames/console/<slug>.body` files after a real prod build.

**Search index is unaffected by body-content changes on principle, not just for this PR**: `createSearchIndex`
(`src/lib/content/search-index-factory.ts`) only indexes `title`, `description`, `tags`, `authors` from
frontmatter, never the MDX body. Any future PR that only touches prose inside a `content.mdx` body needs no
search-index verification at all; this is worth remembering before spending time re-checking it.

**Duplicate-fact reconciliation is a "keep going" instinct, not something to wait for explicit plan sign-off
on**: the plan explicitly called out reconciling the PS1 Trivia bullet (the Fujisawa startup-sound fact was
already stated there) into the new Startup section rather than leaving it stated twice. The same situation
existed, unflagged by the plan, on PS2 (the memory-card "towers" boot-screen fact was already a Trivia bullet)
and I applied the identical treatment: moved/expanded the fact into Startup, deleted the Trivia duplicate.
Worth flagging explicitly in the handoff as a deviation-that-matches-precedent rather than silently doing it.

**MDX prose line-length discipline**: the project's "under 300 chars" rule for MDX prose is not enforced by
any linter or CI gate; several pre-existing Trivia bullets in these same console files already violate it.
It only applies going forward to newly authored prose. The established pattern in this codebase for staying
under the limit without breaking a paragraph into a separate block is *lazy continuation*: just start a new
physical line without a blank line before it and without list-item indentation; CommonMark still joins it
into the same paragraph/list item. The pre-existing PS1 "Born from Revenge" Trivia bullet already uses this
trick across 3 physical lines — followed it exactly for all new Startup prose.

**No-dashes-in-prose rule scope**: only forbids em/en dashes and spaced hyphen incises (e.g. "word - word" as
a sentence break). Word-internal compound hyphens (Joy-Con, family-facing, tower-free, photosensitive-seizure)
are unaffected and fine to keep; don't over-apply the rule to legitimate compound adjectives or proper nouns.

See [[feature_videogames]], [[feature_mdx_to_markdown_sanitizer]], [[feedback_worktree_git_stash_hazard]].
