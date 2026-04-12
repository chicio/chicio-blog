---
name: DSA Section Technical Architecture
description: Data Structures & Algorithms section — routes, components, visualizers, content loading, and design system integration
type: project
---

Technical architecture of the DSA section. Content authoring is managed by the DSA agent — this memory covers the engineering/development side.

## Routes (src/app/data-structures-and-algorithms/)

| Route | Type |
|-------|------|
| `/data-structures-and-algorithms/roadmap` | Static, renders `<Roadmap />` |
| `/data-structures-and-algorithms/topic/[topic]` | Dynamic SSG, prev/next navigation, renders `<Topic />` |
| `/data-structures-and-algorithms/exercises` | Static, renders `<Exercises />` |
| `/data-structures-and-algorithms/topic/[topic]/exercise/[exercise]` | Dynamic SSG, dual params, renders `<Exercise />` |

All route pages are async Server Components with `generateStaticParams()` and `generateMetadata()`.

## Content Loading (src/lib/content/data-structures-and-algorithms.ts)
- `getAllDataStructuresAndAlgorithmsTopics()` — all topics sorted by date
- `getDataStructuresAndAlgorithmsTopicWithNavigation(params)` — single topic with prev/next
- `getDataStructuresAndAlgorithmsRoadmap()` — roadmap page
- `getAllExercises()` / `getExercise(params)` — exercises with ExerciseMetadata (technique, leetcodeUrl)
- `getAllExercisesForTopic(topic)` — filtered by topic slug
- `getExercisesContent()` — exercises index page

## Types (src/types/content/data-structures-and-algorithms.ts)
- `ExerciseMetadata`: `{ technique: string; leetcodeUrl: string }`

## Container Components (src/components/sections/data-structures-and-algorithms/components/)
All are async Server Components that dynamically import MDX via `@/content/${contentFileRelativePath}/content.mdx`.

- **Topic** — wraps MDX in `ReadingContentPageTemplate`, adds breadcrumbs + `CourseNavigation` (blue pill/red pill prev/next) + JsonLd
- **Exercise** — multi-level breadcrumbs (Roadmap > Topic > Exercise), `ReadingContentPageTemplate`
- **Exercises** — index page with `<ExercisesList />` table grouped by topic
- **Roadmap** — landing page with `<Topics />` table

## Navigation Components
- **CourseNavigation** — blue pill (prev) / red pill (next) links with tracking
- **Topics** — server-side table of all topics, used in roadmap MDX
- **TopicExercises** — 3-column table (Exercise | Technique | Solution), used in topic MDX
- **ExercisesList** — all exercises grouped by topic, used in exercises index MDX

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

All visualizers use design-system atoms: `BluePillButton`/`RedPillButton`, `glow-container` CSS, `InteractiveBlock` wrapper.

## Design System Dependencies
- `ReadingContentPageTemplate` (with ContentProgressBar, Breadcrumb)
- `BluePillLink` / `RedPillLink` (prev/next navigation)
- `BluePillButton` / `RedPillButton` (visualizer controls)
- `JsonLd` (BlogPosting structured data)
- `Markdown` atom for rendered content

## Tracking
- Category: `data_structures_and_algorithms`
- Actions: `open_dsa_roadmap`, `open_dsa_topic`, `blue_pill`, `red_pill`

## Styling
- Syntax highlighting: `highlight.js/styles/tokyo-night-dark.css` (imported in route pages)
- Math: `katex/dist/katex.min.css` (imported in route pages)
- Recharts for all chart visualizations

## Content Structure
30+ topics in `src/content/data-structures-and-algorithms/topic/`, each with optional `exercise/` subdirectory. ~224 MDX files total. MDX files directly import visualizer components — they are NOT registered globally in `mdx-components.tsx`.
