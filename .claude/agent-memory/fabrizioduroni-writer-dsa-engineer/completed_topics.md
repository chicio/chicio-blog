---
name: completed-topics
description: List of all DSA course topics completed so far, with their section structure and key characteristics
type: project
---

## Completed Topics (as of 2026-09-11)

All 39 topics below have been published, which is the WHOLE roadmap: the course is complete against the AlgoMaster am_300 list and the "topics still not available" table is gone. Some may be reviewed later for consistency.

### Greedy / Optimization

| Topic | Sections (H2) | Complexity Format | Interactive Components |
|-------|---------------|-------------------|----------------------|
| greedy | Greedy-Choice Property and Optimal Substructure, Single-Pass Greedy (Running Surplus, Balance Tracking, Range Expansion), Multi-Pass Greedy, Greedy with Heaps: Deferred Decisions (Deferred Selection, Ratio Sorting, Scheduling), When Greedy Fails, Time and Space Complexity | Prose | None |

### Data Structures

| Topic | Sections (H2) | Complexity Format | Interactive Components |
|-------|---------------|-------------------|----------------------|
| array | What is an Array?, Memory Representation, Operations and Time Complexity, Classification of Arrays, Static vs Dynamic Arrays, Cache Locality and Performance, Arrays as Building Blocks, Techniques | Table | DynamicArrayVisualizer |
| linked-list | Operations, Reversal Techniques, Detecting Cycles (Floyd's), Time & Space Complexity | Table | CourseNavigation |
| stack | Patterns (Matching & Balancing, Parsing & Evaluating, Backtracking/Undo), Monotonic Stack, Common Tools and Techniques, Time & Space Complexity | Table | StackVisualizer |
| queue | Monotonic Queue, Time & Space Complexity | Table | None |
| hashtable | Hash Functions, Collision Resolution (Chaining, Open Addressing), Load Factor & Resizing, Time & Space Complexity, Implementing a HashMap | Table | None |
| heap | Binary Heap Structure, Bubble Up/Down, Operations, Implementation, Two Heaps Pattern, Top K Elements Pattern, Time & Space Complexity | Table | None |
| binary-search-tree | BST, Ordered Set, Time & Space Complexity (two tables: unbalanced + balanced) | Table | None |
| tries | Time and Space Complexity | Table | None |
| string | What is a string?, Immutability vs Mutability, Internal representation, Operations and Time Complexity, Techniques (Frequency Counting, Pattern Matching) | Table | StringVisualization, FrequencyMapChart |
| matrix | Traversal Patterns (Row-wise, Column-wise, Directional, Spiral, Simulation-Based), Time & Space Complexity | Table | None |

### Algorithms / Techniques

| Topic | Sections (H2) | Complexity Format | Interactive Components |
|-------|---------------|-------------------|----------------------|
| binary-search | The algorithm, Time and Space Complexity | Prose | None |
| two-pointers | Two Main Variants (Opposite-direction, Same-direction), Classic Patterns, Fast & Slow Pointers | Prose (inline) | None |
| sliding-window | Sliding Window vs Two Pointers, Types (Fixed-Size, Dynamic-Size), Time & Space Complexity | Table | None |
| prefix-sum | What is a Prefix Sum?, Patterns (Standard, Target sum k, Divisible by k, Balance Tracking), Time & Space Complexity | Table | None |
| kadane-algorithm | The Algorithm, Time & Space Complexity | Prose | KadaneVisualizer |
| merge-sort | Algorithm, Time and Space Complexity | Prose | None |
| quicksort | Algorithm, Time and Space Complexity | Prose | None |
| bucket-sort | Algorithm, Time and Space Complexity | Prose | None |
| recursion | Anatomy of Recursive Function, Call Stack, Recursive Reasoning, Structural Recursion, Divide & Conquer, Recursive Descent, Mental Models, Recursion vs Iteration, Tail Recursion, When Not to Use | Prose (no dedicated section) | RecursiveCallStackVisualizer, DivideAndConquerTreeVisualizer |
| backtracking | Core Principles, Implementation, Time and Space Complexity | Prose | BacktrackingVisualizer |
| bit-manipulation | What is a Bit?, Binary Representation, Two's Complement, Core Bitwise Operators, Fundamental Bit Tricks, Reimplementing Arithmetic Using Bits | Table (operators) | BitwiseVisualizer |
| intervals | Overlap Detection/Merge, Sorting Strategy, Merging, Inserting, Greedy Scheduling, Event Scheduling with Min-Heap, Time & Space Complexity | Table | None |
| k-way-merge | From Two-Way to K-Way, Heap-Based Merge, Implementation, Variations and Problem Mapping | Prose (no dedicated section) | None |
| tree-traversal-bfs-dfs | BFS, DFS (Pre-Order, In-Order, Post-Order), Time and Space Complexity | Table | None |

### Graph Traversal

| Topic | Sections (H2) | Complexity Format | Interactive Components |
|-------|---------------|-------------------|----------------------|
| graph-traversal-dfs-bfs | What is a Graph?, Types of Graphs, Graph Representations, DFS on Graphs (Connected Components/Flood Fill, Graph Cloning, Cycle Detection/Bipartiteness, DFS on Implicit Graphs/Grids, DFS with Value Propagation), BFS on Graphs (Single-source/Multi-source BFS, BFS on Implicit/State-Space Graphs, BFS with Constraints/Extended State), Choosing Between DFS and BFS, Time and Space Complexity | Table | None |
| topological-sort | What is a Topological Ordering?, DFS-Based Topological Sort (Three-state coloring, Why reverse post-order works), BFS-Based Topological Sort / Kahn's Algorithm (Why it works, Level structure), Choosing Between DFS and BFS, Applications and Variations (Safe state detection, Topological peeling on undirected structures, Multi-level topological sort), Time and Space Complexity | Table | None |
| minimum-spanning-tree | The Minimum Spanning Tree Problem, The Cut Property, Kruskal's Algorithm (Why it works, Implementation), Prim's Algorithm (Why it works, Implementation), Choosing Between Kruskal's and Prim's, Time and Space Complexity | Table | None |
| shortest-path | The Single-Source Shortest Path Problem (Relaxation, Negative Weights and Negative Cycles), Dijkstra's Algorithm (Why it works, Implementation, Dijkstra on grids), Bellman-Ford Algorithm (Why it works, Implementation), Choosing Between Dijkstra and Bellman-Ford, Time and Space Complexity | Table | None |
| eulerian-circuit | Eulerian Circuits and Eulerian Paths (Undirected Graphs, Directed Graphs), Hierholzer's Algorithm (Why Post-Order Works, Implementation, Correctness), De Bruijn Sequences and De Bruijn Graphs (Constructing the De Bruijn Graph, Why an Eulerian Circuit Produces the De Bruijn Sequence, Application: Cracking the Safe), Time and Space Complexity | Table | None |

### Union Find / Connectivity

| Topic | Sections (H2) | Complexity Format | Interactive Components |
|-------|---------------|-------------------|----------------------|
| union-find | The Disjoint Set Abstraction (parent-pointer forest), Path Compression, Union by Rank, The Inverse Ackermann Bound, Implementation, Application Patterns (Connected Components, Cycle Detection, Equivalence Class Merging, Component Analysis), Time and Space Complexity | Table | None |

### Meta / Design

| Topic | Sections (H2) | Complexity Format | Interactive Components |
|-------|---------------|-------------------|----------------------|
| data-structure-design | The LRU Cache, HashMap + Auxiliary Structure (HashMap + Dynamic Array, HashMap + Sorted History), Versioned Storage, Frequency Tracking, Stack-Based Navigation, Multi-Entity Aggregation with Heaps, A Thinking Framework for Design Problems, Time and Space Complexity | Table (patterns vs time/space) | None |

### Foundational

| Topic | Sections (H2) | Complexity Format | Interactive Components |
|-------|---------------|-------------------|----------------------|
| time-and-space-complexity | Algorithm Analysis, Big O/Omega/Theta, Complexity Classes, Space Complexity, Amortized Analysis, Recurrences/Master Theorem, Tail Recursion, Practical Examples | Multiple tables | Many (PerformanceComparisonChart, ComplexityGrowthVisualizer, SpaceComplexityVisualizer, AmortizedAnalysis, RecurrenceTree, StackFrameComparisonChart) |

### Dynamic Programming

| Topic | Sections (H2) | Complexity Format | Interactive Components |
|-------|---------------|-------------------|----------------------|
| dp-foundations-1d-dp | The Two Pillars of Dynamic Programming (Optimal substructure, Overlapping subproblems), The DP Problem-Solving Framework (State, Recurrence, Base cases, Computation order, Answer), Memoization vs Tabulation, State Definition and Recurrence Patterns in 1D DP (Counting paths, Cost minimization, Adjacency constraints, Circular constraints), Space Optimization (Rolling variables), A Complete Walkthrough, Dynamic Programming vs Greedy vs Divide-and-Conquer, Time and Space Complexity | Prose | None |
| knapsack-dp | The Knapsack Abstraction, Space Optimization: From 2D to 1D, Variant Objectives: Boolean Counting and Minimization, The Subset Sum Transformation, The Unbounded Knapsack, Unbounded Knapsack Variants, The Inner Loop Direction: A Unified View, Time and Space Complexity | Prose | None |

### Course Completion Batch (2026-09-04 to 2026-09-11)

The eight topics below closed the roadmap. They were written in one session, one agent per topic, all landing in a
single pull request rather than the usual one PR per topic.

| Topic | Date | Sections (H2) | Complexity Format | Interactive Components |
|-------|------|---------------|-------------------|----------------------|
| string-dp | 2026-09-04 | The Two-Index State, Aligning Two Sequences, Palindromic Substructure, Segmentation and Decoding of a Single String, Wildcard and Pattern Matching, Space Optimization, Time and Space Complexity | Prose | None |
| state-machine-dp | 2026-09-05 | When the State Is a Mode Not a Position, The Anatomy of a State Machine DP, The Stock Automaton: Two Modes, The Cooldown Edge: A Third Mode, At Most k Transactions: A Chain of 2k Modes, Collapsing the Table into Rolling Scalars, The Layered Graph View, Designing an Automaton for a New Problem, Time and Space Complexity | Prose | None (ASCII automata) |
| tree-graph-dp | 2026-09-06 | The Tree Is Its Own Subproblem Graph, The State Is a Node Plus a Mode, A Mode That Encodes an Obligation, Dynamic Programming That Builds Structures, Rerooting: One Traversal for Every Root, Dynamic Programming Over a Graph, Time and Space Complexity | Prose | None |
| advanced-dp-techniques | 2026-09-07 | Bitmask DP: When the State Is a Set, Digit DP: When the State Is a Position in a Numeral, Probability DP: When the State Is Not Deterministic, Time and Space Complexity | Prose | None |
| string-matching | 2026-09-08 | The cost of forgetting, Borders and the prefix function, Searching without ever backing up, Rabin-Karp and the polynomial rolling hash, Binary search on the answer with a rolling hash, Choosing between the algorithms, Time and Space Complexity | Prose | None (ASCII failure-function trace) |
| binary-indexed-tree-segment-tree | 2026-09-09 | The Segment Tree, The Recursive Implementation, The Iterative Bottom-Up Segment Tree, Beyond Sums: Monoids and Lazy Propagation, The Fenwick Tree, Counting Inversions and Smaller Elements to the Right, Time and Space Complexity | Table (one per structure) | None |
| maths-geometry | 2026-09-10 | Digit Manipulation Without Strings, Number Theory, Computational Geometry on Integer Coordinates, Numerical Robustness, Time and Space Complexity | Prose | None |
| line-sweep | 2026-09-11 | The Anatomy of a Sweep, Building the Event List, Tie-Breaking at Equal Coordinates, The Counter Sweep, Lazy Deletion, The Offline Query Sweep, The Status Structure Sweep, Time and Space Complexity | Prose | None (ASCII sweep diagram) |

Notes worth keeping:

- `string-dp` replaces the old `longest-common-subsequence-DP` naming. The solutions folder was renamed to `string-DP`
  to match the current AlgoMaster group name, and the two pre-existing LCS solutions moved into it.
- `advanced-dp-techniques` merges three AlgoMaster groups (Bitmask, Digit, Probability DP) into one article, but the
  solutions repo keeps them as three separate folders, because folder names follow AlgoMaster groups while ARTICLES
  follow the agreed grouping.
- `binary-indexed-tree-segment-tree` deliberately solves one exercise with a segment tree and the other with a Fenwick
  tree, so the article has one worked application per structure.
- `line-sweep` is the last topic of the roadmap and closes with an understated paragraph tying the technique back to
  the course.
