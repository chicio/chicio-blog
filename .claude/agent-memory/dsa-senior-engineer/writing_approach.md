---
name: writing-approach
description: Established writing conventions and style preferences for DSA articles
type: feedback
---

## Language and Punctuation

Articles are written in English but use Italian-style punctuation: periods and commas only. Avoid dashes (em-dashes, en-dashes) as much as possible. Use commas or restructure the sentence instead.

**Why:** The author is Italian and prefers this punctuation style for readability.
**How to apply:** Every article, every section. Never use "—" or "–".

## Prose Over Lists

Avoid bullet lists unless they are truly needed to show a list of options, algorithm steps, or an enumerated set. Prefer flowing prose with clear paragraph structure.

**Why:** Bullet lists break the reading flow and feel mechanical. The course aims for a didactic, narrative tone.
**How to apply:** Before writing a bullet list, ask: could this be a paragraph? If yes, write it as prose.

## Depth and Audience

Topics must be treated with deep, potentially academic depth. The target audience is a senior engineer preparing for a FAANG interview. The course teaches understanding and intuition, not mechanical pattern matching.

**Why:** The course exists to replace superficial "LeetCode grinding" with genuine understanding. The reader is already experienced and expects substance.
**How to apply:** Include the "why" behind each technique, not just the "how". Explain trade-offs, edge cases, and connections to related topics.

## No Explicit Interview Framing

Interview relevance should emerge as a natural consequence of didactic clarity. Never write things like "this is often asked in interviews" or "a common interview question".

**Why:** The author wants the course to stand on its own as educational material. Interview utility is a side effect of good teaching, not the framing.
**How to apply:** If tempted to mention interviews, remove the sentence and let the content speak for itself.

## Section-by-Section Development with Outline First

The workflow is: propose the full outline first, get approval, then write the full article. After the first version, iterate with the user to refine.

**Why:** Avoids wasted work from misaligned structure. The user wants to validate the approach before seeing the full content.
**How to apply:** Never start writing without an approved outline.

## Sections Derived from Exercise List

The 1..n topic-specific sections are defined based on the list of exercises present in Algomaster for that topic. The exercises reveal which sub-patterns and techniques the article needs to cover.

**Why:** The course is structured around Algomaster's pattern list. Each article must prepare the reader for the exercises that follow.
**How to apply:** When proposing sections, analyze the exercise list to identify technique clusters, then create a section for each cluster.

## Code Examples in TypeScript

All code examples use TypeScript. Code should be clean, well-structured, and idiomatic. This includes algorithm implementations, data structure implementations, templates, and utility functions.

**Why:** The Algomaster-Solutions repo uses TypeScript. Consistency across course and exercises.
**How to apply:** Every code block uses `ts` as the language tag.
