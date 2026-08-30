# design-sync notes — matrix-design-system

Repo-specific gotchas for future syncs. Read this before re-running the converter.

## Shape: storybook, not package

The design system is a published npm package (`matrix-design-system`) with real `exports`, a real
`dist/`, and declarations emitted by tsdown. Everything the previous setup worked around is gone:

- **No synth-entry mode.** `--entry` points at the actual built entry. The old trick of passing a
  deliberately non-existent path to force `PKG_DIR` up to the repo root is no longer needed.
- **No Next shims.** The package imports nothing from `next` — a dependency-cruiser rule fails the
  build if that changes — so `tsconfig.sync.json` and its `paths` mapping are deleted.
- **No generated `.d.ts` tree.** tsdown ships `.d.mts` beside every module, so `tsconfig.dts.json`
  is deleted. Prop coverage went from 66/93 components to **37/37**.
- **No hand-authored previews.** `.design-sync/previews/` is deleted. Previews are generated from
  the Storybook stories in `packages/matrix-design-system/src/**/*.stories.tsx`, which is the single
  source of truth — the same files Storybook renders. Authored previews would win over generated
  ones, so do not reintroduce them: fix the story instead.
- **No Tailwind CLI compile.** The converter takes the compiled stylesheet out of the storybook
  reference, so `cssEntry` and `tailwind-entry.css` are gone.

## Running it

```sh
npx turbo run build --filter=matrix-design-system

# The reference the compare loop diffs against. Repo-root -o: the converter resolves .design-sync/
# from the cwd it is run in, and it is always run from the repo root.
cd apps/matrix-design-system-showcase
npx storybook build -c .storybook -o "$(git rev-parse --show-toplevel)/.design-sync/sb-reference" --quiet
cd -

node .ds-sync/package-build.mjs --config .design-sync/config.json \
  --node-modules ./node_modules \
  --entry ./packages/matrix-design-system/dist/index.mjs \
  --out ./ds-bundle
node .ds-sync/package-validate.mjs ./ds-bundle
```

## `extraEntries` must list the subpath entries, package-relative

The root barrel deliberately does not export charts, markdown or the command palette — they live
behind `matrix-design-system/chart`, `/markdown` and `/command-palette` so the root resolves with no
optional peers installed. A bundle built from `dist/index.mjs` alone therefore misses them, and their
stories report `[TITLE_UNMAPPED]`.

`extraEntries` paths are **package-relative, not repo-relative**: `./dist/markdown.mjs`, not
`./packages/matrix-design-system/dist/markdown.mjs`. The repo-relative form silently logs
`not found — skipped` and the components stay missing.

## `titleMap` exists because story titles come from folders

Story titles are derived from the component's directory, which is not always an export name — a
folder can hold several components (`terminal-blocks`) or name them differently
(`reading-content-progress-bar` exports `ContentProgressBar`). Each mismatch is one `titleMap` entry.
`[TITLE_UNMAPPED]` names them explicitly; there is no silent failure here.

## Fonts ride in through the storybook reference

The package's `theme.css` declares Open Sans and Courier Prime but ships no `@font-face` — a consumer
supplies them. `apps/matrix-design-system-showcase/.storybook/preview-head.html` inlines the latin and
latin-ext subsets as base64 data URIs, which does two jobs: Storybook renders in the right typeface,
and the converter harvests those rules out of the built `iframe.html`
(`[FONTS_FROM_PREVIEW_HEAD] harvested 6`). It skips file URLs, so the data-URI form is required.

`cfg.extraFonts` is gone — it is bounded to `PKG_DIR`, and `PKG_DIR` is now the package rather than
the repo root, so a `.design-sync/fonts/` path is out of bounds and reports as "not found".
`.design-sync/fonts/` is kept only as the source for regenerating that inline block.

## `overrides`: fixed and portal components need single cards

Components that position content outside their grid cell (`fixed`/portal) cannot be shown as a grid
of variants — the validator flags `[GRID_OVERFLOW]` and names the fix. Nine components carry
`cardMode: "single"` or `"column"` for that reason. Pick a `primaryStory` that actually renders
something: an "open dropdown" or "mid-progress" variant can capture at 0px height, where the default
variant shows the component.

## Re-sync risks — check these first

- **`cfg.overrides.<X>.primaryStory` goes stale silently** when a story is renamed. The
  `CommandPalette` override pointed at `QuickActions` for a while after the stories were rewritten.
- **`libOverrides` must declare `.design-sync/overrides/source-kit.mjs`.** The fork is still loaded
  under the storybook shape (`resolvePackage`), and dropping the declaration logs
  `[OVERRIDE_UNDECLARED]`.
- **`ContentProgressBar` reports `[RENDER_BLANK]`** (PNG ~4.5 KB against a 5 KB heuristic). It is a
  hairline fixed strip; the card is genuinely mostly empty. Non-blocking, and not worth an authored
  preview — that would reintroduce a second source of truth.
