---
name: structure-patterns
description: Structural similarity groups between DSA topics — use to suggest matching layouts for new articles
type: project
---

## Structural Similarity Groups

Topics within the same group share a similar article layout and can be used as templates for each other.

### Group: Simple Sorting Algorithms
**Topics**: merge-sort, quicksort, bucket-sort
**Pattern**: Short intro, Algorithm section with TypeScript implementation, Time and Space Complexity (prose format explaining where costs come from, average vs worst case).
**Template**: quicksort or merge-sort

### Group: Data Structures with Operations Table
**Topics**: array, linked-list, hashtable, heap, queue, stack, string, binary-search-tree, tries, matrix
**Pattern**: Intro explaining the structure, multiple sections covering internal mechanics and operations, Time & Space Complexity as a **table** of operations. Longer articles with more depth.
**Template**: hashtable (comprehensive), queue (concise)

### Group: Base Structure + Specialized Variant
**Topics**: queue (+ monotonic queue), stack (+ monotonic stack)
**Pattern**: Start with the base data structure, then dedicate a section to the specialized variant (monotonic). Both merged in a single article.
**Why**: The specialized variant is closely related and the exercises mix both. Splitting would lose context.

### Group: Array Optimization Techniques
**Topics**: sliding-window, prefix-sum, kadane-algorithm, two-pointers
**Pattern**: Intro explaining the core idea, when to use it, comparison with related techniques, variant types/patterns, Time & Space Complexity. sliding-window and prefix-sum use tables, kadane and two-pointers use prose.
**Template**: sliding-window (most structured), prefix-sum

### Group: Recursive Paradigms
**Topics**: recursion, backtracking
**Pattern**: Core principles, implementation template, Time & Space Complexity (prose). Backtracking builds on recursion. Both have interactive visualizers.
**Template**: backtracking (cleaner structure)

### Group: Search Algorithms
**Topics**: binary-search
**Pattern**: Concise. Algorithm description, implementation, complexity (prose).
**Template**: binary-search

### Group: Tree-Based
**Topics**: tree-traversal-bfs-dfs, binary-search-tree
**Pattern**: Covers traversal/operation types as subsections, complexity table.
**Template**: tree-traversal-bfs-dfs

### Group: Merge/Sort Patterns
**Topics**: k-way-merge, intervals
**Pattern**: Core concept, then variations mapped to specific problem types. intervals uses a table, k-way-merge uses prose.
**Template**: intervals (more structured)

## Complexity Format Convention

- **Data structures** → use a **table** (operations vs time/space)
- **Algorithms** (sorting, searching, recursive paradigms) → use **prose** explaining where costs come from
- **Techniques** (sliding window, prefix sum, intervals) → use a **table** (patterns vs time/space)
