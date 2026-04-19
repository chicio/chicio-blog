---
name: exercise-import-convention
description: In exercise MDX files, inline core algorithm implementations but keep utility data structure imports (like Heap)
type: feedback
---

In exercise solution code blocks: inline the core algorithm (dijkstra, bellman-ford, dijkstraMatrix, etc.) and its types (Edge, HeapNode, etc.) so readers can see the full solution logic. Keep utility data structure imports (like `import { Heap } from "../heap"`) since they are not the exercise focus.

**Why:** If we leave the algorithm as an import, the exercise solution is not clear — the reader cannot see the actual logic being applied.

**How to apply:** When generating exercise MDX files, check what the original code imports. If it imports a core algorithm function, inline that function and its types. If it imports a utility class (Heap, UnionFind, etc.), keep the import as-is.
