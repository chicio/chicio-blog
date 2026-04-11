---
name: component-patterns
description: Which topic types benefit from interactive components and what patterns have been established
type: feedback
---

## When to Create Interactive Components

Interactive visualizers have been added to 9 out of 25 topics. The pattern:

**Good candidates for visualizers:**
- Data structures where state changes step-by-step (array push/resize, stack push/pop, backtracking tree exploration)
- Algorithms with visual decision trees (recursion call stack, divide-and-conquer tree, Kadane's running state)
- Bit-level operations (bitwise visualizer showing binary representations)
- Foundational concepts that benefit from charts (complexity growth curves, amortized analysis)

**Not needed when:**
- The algorithm is best understood through code + prose (binary search, merge sort, quicksort)
- The topic is mostly about recognizing patterns rather than step-by-step mechanics (two-pointers, intervals, k-way-merge)
- A table already communicates the key information clearly (tries, matrix traversals)

## Established Component Style

- All components are `"use client"`
- Wrap in `<InteractiveBlock title="...">` for consistent styling
- Use `RedPillButton` / `BluePillButton` for action buttons (Matrix-themed design system)
- Use Tailwind classes: `bg-primary-dark`, `text-white`, `bg-gray-200`, `text-accent`, `glow-container`
- Use `recharts` for charts with `ResponsiveContainer` wrapper
- Place files in `src/components/sections/data-structures-and-algorithms/components/`
