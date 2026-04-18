---
name: fabrizioduroni-dsa-status
description: "Show DSA course progress — completed topics, remaining topics, exercise counts"
user_invocable: true
---

# DSA Course Status

Show a comprehensive overview of the DSA course progress.

## Steps

### 1. Count Completed Topics

List all topic directories that have a `content.mdx` file:

```bash
ls -d src/content/data-structures-and-algorithms/topic/*/content.mdx 2>/dev/null | wc -l
```

List the topic names:

```bash
ls -d src/content/data-structures-and-algorithms/topic/*/ | xargs -I{} basename {}
```

### 2. Count Exercises Per Topic

For each topic, count the exercise subdirectories:

```bash
for topic in src/content/data-structures-and-algorithms/topic/*/; do
  name=$(basename "$topic")
  count=$(ls -d "$topic"exercise/*/content.mdx 2>/dev/null | wc -l)
  echo "$name: $count exercises"
done
```

### 3. Check Remaining Topics

Read `src/content/data-structures-and-algorithms/roadmap/content.mdx` and extract the "topics still not available" table at the bottom. List each remaining topic.

### 4. Report

Present a summary table:

| Metric | Count |
|--------|-------|
| Completed topics | X |
| Total exercises | Y |
| Remaining topics | Z |

Then list:
- **Completed**: topic names sorted alphabetically with exercise count
- **Remaining**: topics from the roadmap "not available" table
