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

### Group: Meta / Design Topics
**Topics**: data-structure-design
**Pattern**: Intro explaining the meta-topic, a deep-dive into the canonical problem (LRU cache), then sections organized by compositional pattern (HashMap + X, Versioned Storage, Frequency Tracking, etc.), a thinking framework section, and a complexity table mapping patterns to costs.
**Template**: data-structure-design
**Why**: This is a unique article type that doesn't fit the "single data structure" or "single algorithm" pattern. It's about composing multiple primitives. Future topics like "system design" could follow a similar pattern-based organization.

### Group: Greedy / Optimization Paradigms
**Topics**: greedy, intervals (partial overlap)
**Pattern**: Intro explaining the paradigm, theoretical foundation section (properties, proofs, DP contrast), multiple technique sections organized by structural pattern (not by exercise), counterexamples/failure modes section, Time & Space Complexity (prose format), Exercises.
**Template**: greedy
**Why**: Greedy is a broad paradigm. The article is organized around structural patterns (single-pass, multi-pass, heap-based) with generic illustrative examples, not tightly coupled to specific exercises. The intervals article overlaps because it covers greedy scheduling, but intervals is more narrowly focused on interval-specific operations.

### Group: Graph Algorithms
**Topics**: graph-traversal-dfs-bfs, topological-sort, minimum-spanning-tree, shortest-path, eulerian-circuit
**Pattern**: Intro connecting to tree traversal, formal definitions section, graph representations section, then separate DFS and BFS sections organized by sub-patterns (flood fill, state-space search, etc.), choosing between approaches section, complexity table, exercises.
**Template**: graph-traversal-dfs-bfs
**Why**: Graph topics build on each other and share the same foundational definitions. Future graph topics (topological sort, shortest path, MST) can reference this article for graph basics and extend DFS/BFS patterns.

### Group: Union Find / Connectivity
**Topics**: union-find
**Pattern**: Intro with the dynamic connectivity motivation, abstract data type section (operations + forest representation), two optimization sections (path compression, union by rank), theoretical analysis section (inverse Ackermann), implementation section, application patterns section organized by problem type (connected components, cycle detection, equivalence class merging, component analysis), complexity table, exercises.
**Template**: union-find
**Why**: Union Find is a unique data structure that bridges pure data structure topics and graph algorithm topics. Its article structure follows the data structure pattern (operations table for complexity) but its application patterns connect to graph problems. Future connectivity-related topics could reference this article.

## Complexity Format Convention

- **Data structures** → use a **table** (operations vs time/space)
- **Algorithms** (sorting, searching, recursive paradigms) → use **prose** explaining where costs come from
- **Techniques** (sliding window, prefix sum, intervals) → use a **table** (patterns vs time/space)
