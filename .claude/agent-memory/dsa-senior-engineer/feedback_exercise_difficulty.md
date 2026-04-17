---
name: exercise-difficulty-metadata
description: Exercise MDX must include difficulty metadata; exercise tables use 2-column format (Exercise + Difficulty)
type: feedback
---

When generating exercise MDX files, always include `difficulty` in the metadata alongside `technique` and `leetcodeUrl`.

**Why:** Both the `TopicExercises` component (end of each topic article) and the `ExercisesList` component (global exercises page) display difficulty as a color-coded badge. The difficulty field is required for this to work.

**How to apply:** When creating exercise MDX files (Step 8 of the new topic flow), fetch the difficulty from LeetCode's GraphQL API and add it to the frontmatter:
```yaml
metadata:
  technique: "..."
  leetcodeUrl: "https://leetcode.com/problems/.../"
  difficulty: "Easy" | "Medium" | "Hard"
```
The `ExerciseMetadata` type enforces this: `difficulty: "Easy" | "Medium" | "Hard"`.

## Exercise Table Format

Both tables follow a consistent format with color-coded difficulty badges:
- **TopicExercises** (topic article footer): 2 columns — Exercise (links to exercise page), Difficulty (color badge)
- **ExercisesList** (global exercises page): 3 columns — Exercise (links to exercise page), Difficulty (color badge), Description

Difficulty colors are defined in `difficulty-color.ts`:
- Easy → green (`text-green-500`)
- Medium → amber (`text-amber-500`)
- Hard → red (`text-red-500`)
