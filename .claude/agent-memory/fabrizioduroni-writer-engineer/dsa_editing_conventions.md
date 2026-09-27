---
name: dsa-editing-conventions
description: How to edit the finished DSA course (Topics, Exercises) consistently; inherited from the retired DSA writer agent
type: reference
---

The DSA course is complete (2026-09-11) and its dedicated writer agent was retired. This agent now owns corrections and
edits to existing Topics and Exercises. New Topics are not expected; if one is ever wanted, model it on the closest
existing Topic below.

**Where things live:** Topics at `apps/website/src/content/data-structures-and-algorithms/topic/<slug>/content.mdx`,
each Topic's Exercises at `.../topic/<slug>/exercise/<exercise-slug>/content.mdx`, the Exercises list at
`.../exercises/` and the Roadmap at `.../roadmap/`. Visualizers and charts live in
`apps/website/src/components/content/data-structures-and-algorithms/` (one folder each, component-store model).

**Layout templates, by kind of Topic:**
- Data structures (array, hashtable, heap, queue, stack, tries, BST, matrix...): internal mechanics, operations, and
  complexity as a **table** of operations. Template: hashtable (full), queue (concise). A specialised variant
  (monotonic stack/queue) stays in the base Topic.
- Algorithms (sorting, binary search, recursion, backtracking): implementation plus complexity in **prose** explaining
  where the costs come from. Templates: quicksort, binary-search, backtracking.
- Techniques (sliding window, prefix sum, intervals, two pointers, k-way merge): core idea, when to use it, variants,
  complexity as a **table** of patterns (kadane and two-pointers use prose). Template: sliding-window.
- Paradigms (greedy, DP): theory, then sections by structural pattern, not by Exercise. DP is 8 Topics covering 11
  AlgoMaster sub-topics, with `dp-foundations-1d-dp` as the prerequisite and template.
- Graphs (traversal, topological sort, MST, shortest path, eulerian circuit): build on `graph-traversal-dfs-bfs` for
  definitions and representations. union-find and data-structure-design are one-off layouts; reuse them as they are.

**Visualizers:** only where state changes step by step (push/pop, call stacks, backtracking trees, bits, growth
curves); never for Topics best read as code and prose. Always `"use client"`, wrapped in `<InteractiveBlock>`, action
buttons are the design system's Pills, charts use recharts inside `ResponsiveContainer`.

**Exercise code:** inline the core algorithm and its types so the reader sees the whole solution; keep imports only for
utility structures that are not the Exercise's focus (e.g. `Heap`, `UnionFind`).

**Images:** Topics and Exercises reuse the course's featured image from the Post that launched it:
`image: /media/content/blog/post/2025/11/01/data-structures-algorithms/data-structures-and-algorithms-featured.png`.

Validate an edit with the `fabrizioduroni-content-preview` skill (build, frontmatter, search index) and check the page
renders.
