---
name: exercise-difficulty-metadata
description: Exercise MDX must include difficulty metadata; all exercise tables use unified 3-column ExerciseTable component
type: feedback
---

When generating exercise MDX files, always include `difficulty` in the metadata alongside `technique` and `leetcodeUrl`.

**Why:** The shared `ExerciseTable` component displays difficulty as a color-coded badge. The difficulty field is required for this to work.

**How to apply:** When creating exercise MDX files (Step 8 of the new topic flow), fetch the difficulty from LeetCode's GraphQL API and add it to the frontmatter:
```yaml
metadata:
  technique: "..."
  leetcodeUrl: "https://leetcode.com/problems/.../"
  difficulty: "Easy" | "Medium" | "Hard"
```
The `ExerciseMetadata` type enforces this: `difficulty: "Easy" | "Medium" | "Hard"`.

## Unified Exercise Table Format

There is a single shared `ExerciseTable` component (`exercise-table.tsx`) used everywhere exercises are listed. It renders a 3-column table:

| Exercise (w-2/5) | Difficulty | Description |
|---|---|---|
| Link to exercise page (bold title) | Color-coded badge | Markdown-rendered description from frontmatter |

This component is used by:
- **`TopicExercises`** — renders exercises at the end of each topic article (`<TopicExercises topic="..." />`)
- **`ExercisesList`** — renders all exercises grouped by topic on the global exercises page

Difficulty colors are defined in `difficulty-color.ts`:
- Easy → green (`text-green-500`)
- Medium → amber (`text-amber-500`)
- Hard → red (`text-red-500`)
