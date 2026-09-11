---
name: dp-article-grouping
description: Agreed plan for compressing 11 AlgoMaster DP sub-topics into 8 DSA course articles, with exercise folders and publication order
type: project
---

## DP Article Grouping Plan (agreed 2026-05-15)

The 11 AlgoMaster DP sub-topics are compressed into 8 DSA course articles.
The roadmap file was updated on 2026-05-15 to reflect this grouping.

| # | Article Title | AlgoMaster sub-topics merged | Exercise folders | Status |
|---|---------------|------------------------------|-----------------|--------|
| 1 | DP Foundations & 1D DP | Core DP theory + 1D DP | `1D-DP` (4 exercises: Climbing Stairs, Min Cost Climbing Stairs, House Robber, House Robber II) | **Published** (2026-05-15, PR #334) |
| 2 | Knapsack DP | 0/1 Knapsack + Unbounded Knapsack | `knapsack-DP` + `unbounded-knapsack-DP` (6 exercises) | **Published** (2026-05-16, PR #335) |
| 3 | Longest Increasing Subsequence DP | LIS DP | `longest-increasing-subsequence-DP` (3 exercises) | **Published** (2026-06-01) |
| 4 | 2D Grid DP | 2D Grid DP | `2D-grid-DP` (9 exercises) | **Published** (2026-07-12) |
| 5 | String DP | String DP | `string-DP` (9 exercises) | **Published** (2026-09-04) |
| 6 | State Machine DP | State Machine DP | `state-machine-DP` (2 exercises) | **Published** (2026-09-05) |
| 7 | Tree & Graph DP | Tree/Graph DP | `tree-graph-DP` (5 exercises) | **Published** (2026-09-06) |
| 8 | Advanced DP Techniques | Bitmask DP + Digit DP + Probability DP | `bitmask-DP` + `digit-DP` + `probability-DP` (9 exercises, flat under `advanced-dp-techniques`) | **Published** (2026-09-07) |

## Key Merge Decisions

- **0/1 Knapsack + Unbounded Knapsack**: Same pattern, one parameter change (inner loop direction). Merged into a single article.
- **Bitmask + Digit + Probability DP**: Each too thin alone (~3-5 exercises), unified by "advanced state modeling". Merged into a single article.
- **Everything else standalone**: Each remaining sub-topic has enough depth and distinct exercises to warrant its own article.

## Publication Order

Article 1 is prerequisite for all others. The numbering above defines the publication order.

## Folder Names (expected)

Based on the pattern of existing topics, the expected folder names under `src/content/data-structures-and-algorithms/topic/` are:
- `dp-foundations-1d-dp` (Article 1)
- `knapsack-dp` (Article 2)
- `longest-increasing-subsequence-dp` (Article 3)
- `2d-grid-dp` (Article 4)
- `string-dp` (Article 5)
- `state-machine-dp` (Article 6)
- `tree-graph-dp` (Article 7)
- `advanced-dp-techniques` (Article 8)

These are tentative and will be confirmed when each article is created.

## Status: COMPLETE (2026-09-11)

All 8 DP articles are published. The DP arc of the course is finished, and so is the course as a whole.

The `string-DP` folder name: the solutions repo folder was renamed from `longest-common-subsequence-DP` to
`string-DP`, because folder names follow the CURRENT AlgoMaster group names. The rule agreed with the user is that
solutions-repo folders mirror AlgoMaster pattern groups one to one, while ARTICLES follow the grouping in the table
above, so Bitmask, Digit and Probability DP stay three folders but become one article.

2D Grid DP gained a ninth exercise (329, Longest Increasing Path in a Matrix) during the completion session: it was
the only am_300 problem left unsolved anywhere in the course.
