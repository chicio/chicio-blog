---
name: fabrizioduroni-dsa-validate
description: "Validate DSA content integrity — frontmatter, exercise metadata, imports, and structural consistency"
user_invocable: true
---

# DSA Content Validation

Check all DSA content for structural correctness and consistency.

## Steps

### 1. Validate Topic Articles

For each topic in `src/content/data-structures-and-algorithms/topic/*/content.mdx`:

- **Frontmatter**: Verify `title`, `description`, `date`, `image`, `tags`, `authors` are present
- **TopicExercises import**: Verify the file imports `TopicExercises` from `@/components/sections/data-structures-and-algorithms/components/topic-exercises`
- **TopicExercises usage**: Verify the file contains `<TopicExercises topic="<topic-name>" />` where `<topic-name>` matches the directory name
- **Exercises section**: Verify the article ends with an `## Exercises` section

Report any topic articles with missing or incorrect elements.

### 2. Validate Exercise Articles

For each exercise in `src/content/data-structures-and-algorithms/topic/*/exercise/*/content.mdx`:

- **Frontmatter**: Verify `title`, `description`, `date`, `image`, `tags`, `authors` are present
- **Exercise metadata**: Verify `metadata.technique` is present and non-empty
- **LeetCode URL**: Verify `metadata.leetcodeUrl` is present and starts with `https://leetcode.com/problems/`
- **Required sections**: Verify the file contains `## Problem Summary`, `## Techniques`, and `## Solution`
- **Solution code block**: Verify there is a TypeScript code block (` ```ts `)

Report any exercises with missing or incorrect elements.

### 3. Cross-Reference Check

- Verify every topic directory that has exercises also has a `content.mdx` topic article
- Verify no orphaned exercise directories exist (exercises without a parent topic article)

### 4. Report

Present results as:
- **Topics checked**: X (Y passed, Z with issues)
- **Exercises checked**: X (Y passed, Z with issues)
- **Issues found**: list each issue with file path and what's wrong
