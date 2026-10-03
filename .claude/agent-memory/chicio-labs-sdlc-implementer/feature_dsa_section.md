---
name: DSA Section Technical Architecture
description: Data Structures & Algorithms section — routes, components, visualizers, content loading, and design system integration
type: project
---

Technical architecture of the DSA section. Content authoring is managed by the DSA agent — this memory covers the engineering/development side.

## Routes (apps/website/src/app/data-structures-and-algorithms/)

| Route | Type |
|-------|------|
| `/data-structures-and-algorithms/roadmap` | Static, renders `<Roadmap />` |
| `/data-structures-and-algorithms/topic/[topic]` | Dynamic SSG, prev/next navigation, renders `<Topic />` |
| `/data-structures-and-algorithms/exercises` | Static, renders `<Exercises />` |
| `/data-structures-and-algorithms/topic/[topic]/exercise/[exercise]` | Dynamic SSG, dual params, renders `<Exercise />` |

All route pages are async Server Components with `generateStaticParams()` and `generateMetadata()`.

## Content Loading (apps/website/src/lib/content/data-structures-and-algorithms/data-structures-and-algorithms.ts)
Verified 2026-09-27: the old `getAll…`/`get…` accessors are deleted (see [[arch_content_section_factory]]). Exports are
`createSection` objects plus one helper:
- `topics` — every Topic (`list()` / `single(params)`); prev/next now comes from `siblingsOf` in
  `apps/website/src/lib/content/siblings.ts`
- `dsaRoadmap` — the Roadmap Standalone Page
- `exercises` — every Exercise, with ExerciseMetadata (technique, leetcodeUrl)
- `dsaExercisesList` — the exercises index Standalone Page
- `getAllExercisesForTopic(topic)` — Exercises filtered by Topic slug
- Markdown Representation generators live beside it in `data-structures-and-algorithms-markdown.ts`

## Types (apps/website/src/types/content/data-structures-and-algorithms.ts)
- `ExerciseMetadata`: `{ technique: string; leetcodeUrl: string }`

## Container Components (apps/website/src/components/content/data-structures-and-algorithms/)
All are async Server Components that dynamically import MDX via `@/content/${contentFileRelativePath}/content.mdx`.

- **Topic** — wraps MDX in `ReadingContentPage` (a Reading Page), adds breadcrumbs + `CourseNavigation` (blue pill/red pill prev/next) + JsonLd
- **Exercise** — multi-level breadcrumbs (Roadmap > Topic > Exercise), `ReadingContentPage`
- **Exercises** — index page with `<ExercisesList />` table grouped by topic
- **Roadmap** — landing page with `<Topics />` table

## Navigation Components
- **CourseNavigation** — blue pill (prev) / red pill (next) links with tracking
- **Topics** — server-side table of all Topics, used in the Roadmap MDX
- **TopicExercises** — 3-column table (Exercise | Technique | Solution), used in topic MDX
- **ExercisesList** — all Exercises grouped by Topic, used in the exercises index MDX

## Interactive Visualizers (all "use client", self-contained)
29 components total, 19 stateful. Key ones:
- **StackVisualizer** — LIFO push/pop/reset
- **DynamicArrayVisualizer** — capacity doubling on overflow
- **RecursiveCallStackVisualizer** — animated call stack frames
- **BacktrackingVisualizer** — generator-based exploration tree (500ms steps)
- **TreeTypesVisualizer** (~300 LOC) — Full, Complete, BST examples with SVG
- **GraphPropertiesVisualizer** (~316 LOC) — directed/undirected/weighted with node selection
- **ComplexityGrowthVisualizer** — Recharts O(1) to O(n!) comparison
- **PerformanceComparisonChart** — Recharts Bubble/Merge/Quick sort
- **KadaneVisualizer** — max subarray walkthrough
- **BitwiseVisualizer** — bitwise operations with binary output
- Various chart components (AmortizedAnalysis, SpaceComplexity, TimeSpaceTradeoff, etc.)

All visualizers use design-system atoms: `BluePillButton`/`RedPillButton` (the Pill motif), `glow-container` CSS, and the
`InteractiveBlock` container (itself in `components/content/data-structures-and-algorithms/interactive-block/`).

## Design System Dependencies
- `ReadingContentPage` → `ReadingContentPageTemplate` (Website Templates in `features/content/`, with ContentProgressBar,
  Breadcrumb via its Binding in `features/design-system-next/breadcrumb`)
- `BluePillLink` / `RedPillLink` (prev/next navigation)
- `BluePillButton` / `RedPillButton` (visualizer controls)
- `JsonLd` (BlogPosting structured data)
- `Markdown` atom for rendered content

## Tracking
- Category: `data_structures_and_algorithms`
- Actions: `open_dsa_roadmap`, `open_dsa_topic`, `blue_pill`, `red_pill`

## Styling
- Syntax highlighting: `highlight.js/styles/tokyo-night-dark.css` (imported in route pages and `topic.tsx`)
- Math: `katex/dist/katex.min.css` (imported in route pages)
- Recharts for all chart visualizations

## Content Structure
45 Topics in `apps/website/src/content/data-structures-and-algorithms/topic/` (course complete), each with optional `exercise/` subdirectory. ~224 MDX files total. MDX files directly import visualizer components — they are NOT registered globally in `mdx-components.tsx`.
