---
name: real-content-degenerate-shapes-must-drive-hierarchy-tests
description: Code that builds a hierarchy from flat MDX headings must be replayed over the real archive — the blog has h3-only and h4-only posts that break naive "nest under the previous group" logic
metadata:
  type: feedback
---

When a diff adds logic that turns a flat list of extracted headings into a tree (grouping h3 under h2,
numbering sections, building breadcrumbs), replay it over the real `src/content` archive before accepting the
tests. The blog's heading levels are inconsistent by history, so the degenerate shapes are not hypothetical.

**Why:** the reading-companion TOC's `groupHeadings` used `if (level === 3 && groups.length > 0) push as child
of last group`. Its unit test only covered `[h2, h3, h2]`. Three real posts
(`2018/01/16/ide-refactoring-...`, `2018/08/02/design-thinking-...`,
`2018/11/01/react-native-typescript-conference-voxxed-2018`) contain **only h3 headings**, so the first h3
became a collapsible group that swallowed every sibling h3 as its child — 3 of the 10 TOC-eligible posts
rendered a wrong hierarchy, and the code comment asserted the opposite ("becomes its own top-level, childless
group"). Measured archive shape worth remembering: 96 blog posts — 9 start at h2, 3 at h3, 40 at h4, 44 have no
headings; 37 DSA topics average 5.8 h2 + 5.4 h3; 248 DSA exercises have exactly 3 h2 and 0 h3.

**How to apply:** copy the grouping/tree function into a scratchpad script and run it over every
`content.mdx`, printing per-section counts (how many groups, how many childless, how many owned by an h3). Then
check the outlier pages by hand in the running app. Also check the inverse question the same run answers: how
many top-level entries end up non-interactive because they own children.

Related: [[derived-anchor-ids-must-be-diffed-against-rendered-output]]
