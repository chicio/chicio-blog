---
name: exercise-difficulty-metadata
description: Exercise MDX files must include difficulty (Easy/Medium/Hard) in frontmatter metadata
type: feedback
---

When generating exercise MDX files, always include `difficulty` in the metadata alongside `technique` and `leetcodeUrl`.

**Why:** The `TopicExercises` component renders a 2-column table (Exercise name linking to the exercise page, Difficulty with color-coded badge). The difficulty field is required for this to work.

**How to apply:** When creating exercise MDX files (Step 8 of the new topic flow), fetch the difficulty from LeetCode's GraphQL API and add it to the frontmatter:
```yaml
metadata:
  technique: "..."
  leetcodeUrl: "https://leetcode.com/problems/.../"
  difficulty: "Easy" | "Medium" | "Hard"
```
The `ExerciseMetadata` type enforces this: `difficulty: "Easy" | "Medium" | "Hard"`.
