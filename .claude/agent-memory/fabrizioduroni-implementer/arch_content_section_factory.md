---
name: arch_content_section_factory
description: createSection() generic content ingestion factory (src/lib/content/section.ts); gray-matter metadataAdapter gotcha discovered while building it
type: project
---

`src/lib/content/section.ts` exports `createSection<TMeta>({ slug, sort? })` returning `{ list(), single(params?) }`,
wrapping `getAllContentFor`/`getSingleContentBy` from `src/lib/content/content.ts`. Landed as Tier 1 of a
multi-PR content-ingestion refactor (2026-07-24, branch `feat/content-section-factory`).

`posts.ts` exports `posts = createSection({ slug: slugs.blog.blogPost, sort: byDateDesc })`. `videogames.ts` exports
`consoles`/`games`. `data-structures-and-algorithms.ts` exports `topics`/`exercises`/`dsaRoadmap`/`dsaExercisesList`.
The old per-section accessor functions (`getPosts`, `getPostBy`, `getAllConsoles`, `getConsole`, `getAllGames`,
`getGame`, `getAllDataStructuresAndAlgorithmsTopics`, `getDataStructuresAndAlgorithmsTopic`, `getAllExercises`,
`getExercise`, `getDataStructuresAndAlgorithmsRoadmap`, `getExercisesContent`) are DELETED — always verify with grep
before assuming they still exist, since a future PR may have renamed sections again.

**Critical gotcha found mid-implementation**: `grayMatterContent()` in `src/lib/content/gray-matter.ts` used to set
`frontmatter.metadata = metadataAdapter ? metadataAdapter(raw) : undefined` — i.e. `frontmatter.metadata` was ALWAYS
undefined unless an adapter was passed. The 3 metadata adapters (`consoleMetadataAdapter`, `gamesMetadataAdapter`,
`exerciseMetadataAdapter`) looked like pure `as`-casts with "zero runtime validation" (the assumption an approved
plan made when authorizing their deletion), but they were secretly load-bearing: deleting them without also fixing
gray-matter.ts silently broke every console/game/exercise page (`frontmatter.metadata` becomes `undefined`,
`.metadata!.xxx` throws or renders blank). Fixed by changing the fallback to
`fileParsed.data?.metadata as TMeta | undefined` — pass raw parsed metadata through when no adapter is given. This
class of bug (an approved plan's premise being subtly wrong) is exactly the "genuinely unworkable plan" case — since
the fix was small, mechanical, and needed to satisfy the plan's own "no public behavior change" invariant, I applied
it and called it out explicitly in the handoff rather than stopping the whole pipeline; a larger/riskier premise
failure would warrant stopping instead.

**Test mock pattern for section objects**: `vi.mock("path/to/module", () => ({ sectionName: { list: mockFn, single:
mockFn2 } }))` — mock the object shape, not flat function exports. Any test file with a local variable/param also
named `posts`/`topics`/`exercises`/`consoles`/`games` needs that local renamed (e.g. `allPosts`) to avoid a
`const posts = posts.list()` TDZ collision with the imported section object of the same name — this hit ~15 call
sites across app pages, lib modules, and MCP tools during the mechanical migration.

Full migration touched ~45 files (app pages, content components, markdown generators, MCP tools, blog-stats/
analytics, filesystem-manifest-factory, indexable-content, chat-knowledge-upload) plus their tests. `npm run test:e2e`
under full parallel load has a pre-existing flake in `e2e/terminal.spec.ts` (dialog visibility race, ~1-2 tests per
run) unrelated to content changes — confirmed by rerunning with `--workers=1`, all 13 terminal tests pass every time.
