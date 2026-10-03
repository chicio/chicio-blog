---
name: feedback-term-check-resend
description: The glossary-browser Term Check refuses Write/Edit on Post MDX for generic Website Avoid words; resend the same edit unchanged when the word is meant
metadata:
  type: feedback
---

Every Post lives in the Website context (`apps/website/`), so the glossary-browser mod's Term Check checks each
Write/Edit of a `content.mdx` against the Website glossary's Avoid words. Many of them are ordinary English words:
`title` (the frontmatter key itself trips it), `filter`, `problem`, `page`, `contributor`, `index`, `issue`,
`category`, `assistant`, `bot`, `book`, plus `article` (Post). Expect a refusal on almost every full-file Write.

**Why:** observed while writing the Claude Code mods Post (2026-10-03): the first Write was refused for Page, Article,
contributor, Problem, title, and filter, all meant in another sense; a later Edit was refused for "problem".

**How to apply:** if the flagged word means a canonical term (e.g. "article" for a Post), rewrite with the canonical
term. If it is meant in another sense (frontmatter key, a quotation, ordinary English), resend the SAME edit unchanged:
the mod lets an identical retry through. Report every refusal to the caller. Edits made through Bash bypass the check,
so don't use Bash to dodge it for prose that should use canonical terms. See [[editorial-insights]].
