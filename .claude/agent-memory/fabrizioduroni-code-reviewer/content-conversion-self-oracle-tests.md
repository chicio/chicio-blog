---
name: content-conversion-self-oracle-tests
description: a mechanical MDX conversion (body images -> frontmatter list) is tested against the converted data itself, so the test cannot see loss; diff old vs new with gray-matter in the scratchpad
metadata:
  type: feedback
---

When a Work Unit mechanically moves content from an MDX body into frontmatter (e.g. Art's `![caption](src)` lines
into `metadata.gallery: [{ src, caption }]`), the new test usually reads the converted list back (`artGallery()`)
and asserts the generator emits every entry. That test uses the output as its own oracle: a dropped image, a
reordered pair or a mangled emoji caption would all stay green (a `length > 100` guard does not help either).

**Why:** the grader looks complete while proving nothing about the conversion's fidelity, which is the one thing
the plan asked for ("captions and emoji kept, order kept").

**How to apply:** `git show <base>:<file>` and `git show <head>:<file>` into the scratchpad (plain, separate
commands: the worktree sandbox refuses `cd <nested worktree> && git ...` and `$VAR` args to node), then a
`.cjs` script that requires the root `node_modules/gray-matter` and compares the regex-extracted old list with
`data.metadata.<list>` pairwise, and checks no non-image body prose was lost. Report the result; only raise a
blocking finding if the diff is actually lossy. Also check for sibling content-file churn: `.prettierignore`
excludes `apps/website/src/content/**`, so a large reformat diff in an MDX there (re-indented JSON code blocks,
padded tables) was forced by hand and changes what gets published. See [[fact-sheet-drift-intent-and-authorship]].
