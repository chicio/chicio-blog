# design-sync notes — chicio-blog

Repo-specific gotchas for future syncs. Read this before re-running the converter.

## Shape and entry

- This repo is a **private Next.js app**, not a published library: `package.json` has no
  `main`/`module`/`exports`, and `npm run build` is `next build`, so there is no `dist/`. The converter
  therefore runs in **synth-entry mode**, stitching an entry from the `src/components/design-system`
  tree. Consequence: `.d.ts` prop contracts are extracted from source rather than shipped types, so
  they are weaker than a real library's would be.
- **`--entry` is required even though there is no dist.** `PKG_DIR` defaults to
  `<node_modules>/<pkg>`, which never exists for a package in its own repo — the build dies with
  `ENOENT … node_modules/chicio-blog/package.json`. Passing a **non-existent** entry path inside the
  DS tree makes `PKG_DIR` walk up to the repo root (the nearest named `package.json`) while
  `resolveDistEntry`'s soft mode returns `null`, which is exactly the synth path we want. The
  `[NO_DIST] --entry … doesn't exist` line is expected, not an error:

  ```sh
  node .ds-sync/package-build.mjs --config .design-sync/config.json \
    --node-modules ./node_modules \
    --entry ./src/components/design-system/index.ts \
    --out ./ds-bundle
  ```

## NEVER put a `"//"` comment key in `tsconfig.sync.json`

`lib/bundle.mjs`'s `tsconfigPathsPlugin` strips `//` line comments before `JSON.parse`, and its regex
(`/(^|[^:])\/\/.*$/gm`) also eats a `"//"` **key**, corrupting the JSON. The parse failure is swallowed
by a bare `catch { return null }`, so the plugin silently disables **every** path mapping with no
diagnostic — the `next/*` shims stop applying and the real Next packages get bundled instead.

Symptom: `_ds_bundle.js` balloons (~5 MB) and contains `next/dist/client/link`,
`app-router-context`, etc. Verify after any tsconfig edit:

```sh
grep -c "app-router-context" ds-bundle/_ds_bundle.js   # must be 0
```

Real `/* … */` block comments are stripped correctly and are safe.

## Next.js framework shims

The design system imports four Next modules that cannot resolve outside a Next runtime. They are
substituted via `paths` in `.design-sync/tsconfig.sync.json` → `.design-sync/shims/`:

| Module | Used by | Shim behaviour |
|---|---|---|
| `next/link` | `menu-item`, `internal-link`, `call-to-action-internal-with-tracking` | renders `<a href>` |
| `next/image` | `image-glow`, `image-carousel`, `fullscreen-modal`, `image-shimmer-placeholder` | renders `<img>`; reproduces `fill` (absolute inset) and `placeholder`+`blurDataURL` (background image) because `ImageGlow`/`ImageCarousel` layout depends on them |
| `next/navigation` | `use-command-palette-store` (`useRouter`), `use-menu-store` (`usePathname`) | inert router; `usePathname()` → `"/"` |
| `next/dist/shared/lib/get-img-props` | `image-shimmer-placeholder` | `PlaceholderValue` type only |

These mirror what the repo's own tests already substitute (`src/test-utils/next-module-mocks.tsx`,
and the `vi.mock("next/navigation")` blocks). Next-only props are destructured away rather than spread
onto DOM elements — spreading them makes React warn about unknown attributes, which surfaces as
`[RENDER_ERRORS]` during validate.

## Prop contracts need a generated `.d.ts` tree — do NOT skip this

Synth-entry mode has no shipped types, so the first build extracted props from a single stray `.d.ts`
and emitted `[key: string]: unknown` for **all 93** components. That is the artifact the design agent
codes against, so it knew every component's name and none of its API.

Fix: `cfg.buildCmd` now emits declarations before the converter runs
(`npx tsc -p .design-sync/tsconfig.dts.json` → `dist/types/`, 243 files). `findTypesRoot` probes
`build/ts`, `dist/types`, `types`, `lib`, `dist` under the package root, so landing them in
`dist/types/` is picked up **without** editing `package.json`. Result: **66/93** components now carry
real prop interfaces.

`dist/` is gitignored — it is generated, and `buildCmd` recreates it. Verify after any re-sync:

```sh
grep -rl "\[key: string\]: unknown" ds-bundle/components | wc -l   # expect ~27, not 93
```

The ~27 that remain are genuinely children-only or propless (`Cursor`, `BluePill`, `ErrorText`, the
icons). The three page templates were NOT in that category — their props come from cross-module types
ts-morph could not flatten, so they are hand-written in `cfg.dtsPropsFor`. **If a template's real props
change in source, that config entry goes stale silently** — nothing cross-checks it.

## Styling: Tailwind v4 has no standalone stylesheet

Next compiles the CSS through `@tailwindcss/postcss`, so nothing on disk is shippable. The compile is
reproduced outside Next by `cfg.buildCmd`, which runs the Tailwind CLI over
`.design-sync/tailwind-entry.css` (that entry only `@import`s the repo's real
`src/app/css/globals.css`, which imports `src/components/design-system/styles/`, and scopes `@source` to the design system — it redefines nothing). Output
lands in the gitignored `.design-sync/.cache/design-system.css`, which `cfg.cssEntry` points at, so a
fresh clone regenerates it via `buildCmd` before the converter runs.

`@tailwindcss/cli` is installed into `.ds-sync/node_modules`, deliberately **not** into the repo's
lockfile.

## Fonts: extracted from the repo's own build output

`src/app/layout.tsx` loads Open Sans and Courier Prime via `next/font/google`, which self-hosts them at
build time and emits no stylesheet the converter can ship. `.design-sync/fonts/` holds 14 `.woff2`
files (Open Sans ×10, Courier Prime ×4) plus a `fonts.css` of `@font-face` rules, all extracted
verbatim from `.next/static/chunks/*.css` + `.next/static/media/` — the exact bytes the site serves,
with `unicode-range` subsetting preserved. `cfg.extraFonts` points at that stylesheet.

**Regenerate after any font change in `src/app/layout.tsx`**: run `npm run build`, then re-extract the
`@font-face` rules for those two families from the built chunk CSS, rewriting each `src:url()` to the
local filename and copying the referenced woff2 out of `.next/static/media/`.

## Authoring preview cards — traps that cost real time

- **Tailwind only compiles classes it can see.** `@source` covers `src/components/design-system/**`
  *and* `.design-sync/previews/**` (the second line was added after preview-only utilities like
  `h-40`, `space-y-2`, `translate-y-*` silently produced no rule and no error). `preview-rebuild.mjs`
  does **not** recompile CSS, so a class added to a preview only exists after `cfg.buildCmd` runs
  again. Symptom is an unstyled card with nothing in any log.
- **Arbitrary values are the same trap**: `w-[420px]`, `max-w-3xl`, `aspect-[4/3]` produce no rule
  unless something already in scope uses them. Prefer scale classes (`w-80`, `max-w-2xl`).
- **`md:` and up are inert inside a card.** The capture viewport is 900px wide and this repo's `md`
  starts at **992px** (see the overridden scale). Write the desktop layout unprefixed.
- **Animated content screenshots blank.** `package-capture` shoots after `networkidle` with no
  animation control, so anything mid-cycle is captured in whatever frame it is in. `Cursor`'s blink
  (opacity 1 for 0–50%, 0 for 51–100%) captured as *nothing*. Freeze it in the preview — an animation
  created paused sits at its 0% keyframe:

  ```tsx
  <style>{`.ds-blink-still, .ds-blink-still * { animation-play-state: paused !important; }`}</style>
  <div className="ds-blink-still">{/* component */}</div>
  ```

  Affects everything embedding `Cursor`: terminal components, `Footer`, `BrandHeader`, `LoadingBar`,
  the page templates. A canvas that paints synchronously on mount (`Matrix2DCanvas`) is fine.
- **Cards serve only `ds-bundle/`**, so `/media/...` sources 404. `SelfHostedVideo` still renders its
  full player and figure styling — only the video pixels are missing.
- **Single instances stretch to full card width** and read as bars. Wrap in `<div className="flex">`.
- The three page templates render fully at the default 900×700 card — **no `cfg.overrides` needed**.
  Caveat: `big={true}` paints a 350–500px rain band at `-z-10` and `.glow-container` has no
  background, so transparent content over it reads as broken. The real site avoids this by making the
  first child a solid `bg-general-background-light` card; mirror that.

## Config entries that exist because previews needed them

- **`extraEntries: ["cmdk"]`.** Five components render cmdk's `Command.Item`
  (`TerminalItem`, `ToggleMotionItem`, `SearchResultItem`, `EasterEggHuntItem`,
  `CustomizeMatrixRainItem`, plus `CommandPalette`). The cmdk compiled into `_ds_bundle.js` owns the
  React contexts those items read, but a preview importing `cmdk` resolves a **second** copy from
  `node_modules`, so the `Command` root the preview provides is invisible to its own items —
  `TypeError: Cannot read properties of undefined (reading 'subscribe')` and a blank cell. Merging
  cmdk into the bundle's global gives everyone one instance.
- **`overrides.NavigationButtons` / `overrides.Menu` → `viewport: "1200x700"`.** Both gate their UI
  behind `hidden md:*`, and this theme's `md` is **992px** — above the 900px default capture width, so
  they screenshot completely empty. Those are the only two in the design system today
  (`grep -rlE 'hidden (md|lg|xl):' src/components/design-system`); re-run that grep after adding
  components.

## framer-motion: `animation-play-state` does NOT cover it

The CSS freeze above only governs CSS keyframes. framer-motion drives WAAPI, and mount animations get
photographed mid-flight — one width animation captured at 68.9% of its 72% target, and
`initial={{opacity:0}} animate={{opacity:1}}` captured at computed `opacity: 0`.

Measured root cause: on the capture's **reused** page the animation's `currentTime` is negative and
grows more negative with each navigation (−204ms → −805ms → −1411ms), so it is stuck permanently
before its start time. A fresh page's first navigation settles fine — which is why an isolated repro
looks healthy and the real run is not.

Two fixes, depending on who owns the `motion.*` element:

- **Preview owns it** → pass `initial={false}` so it mounts at its final state.
- **The DS component owns it internally** (e.g. `Overlay` hardcodes `initial={{opacity:0}}`; its props
  are only `delay`/`onClick`/`children`/`className`) → the prop route is closed. Use an `!important`
  author rule through `className`, which outranks both the animations origin and framer's inline
  `style="opacity:0"`:

  ```tsx
  const freeze = `.ds-overlay-still { opacity: 1 !important; }
  .ds-overlay-still * { animation-play-state: paused !important; }`;
  <Overlay delay={0} className="ds-overlay-still">…</Overlay>
  ```

## Other capture-harness behaviour worth knowing

- **`package-capture` reporting `0 with errors` does NOT mean the cells rendered.** React 19 crashes
  asynchronously, so the preview html's `try/catch` never fires. The real trace is in `pageErrs` inside
  `.design-sync/.cache/review/<Name>.json` — read that whenever a cell is blank.
- **Fixed-position overlays collapse.** `.ds-single { transform: translateZ(0) }` makes the story root
  the containing block for `position: fixed`, and it is zero-height (a modal measured 852×32).
  `cardMode: "single"` does not help — capture always renders into `.ds-single`. Stage the cell inside
  `<div className="h-[520px] w-full">`.
- **The preview host serves only `ds-bundle/`**, so `/media/**` 404s. Use data-URI SVGs for image
  components.
- **`story-imports.mjs` rule 2 is a fidelity footgun in this repo.** Its redirect-to-global check
  matches the resolved path's file/parent-dir name against the **PascalCase** export set; this repo is
  kebab-case on disk, so a *relative source* import (`.../command-palette/terminal-item`) never
  matches and is bundled **from source** into the preview. That silently bypasses the shipped bundle —
  the card would show source-compiled code rather than what the design agent gets. Always import from
  `"chicio-blog"`, never by relative path.

- **cmdk auto-selects its first item**, so a `Default` story with no controlled value photographs the
  *selected* state — two components had byte-identical `Default`/`Selected` PNGs. Drive the `Command`
  root with a **non-empty** sentinel value matching no item. It must be non-empty: cmdk's
  select-first-item is guarded by `r.current.value || …`, so `""` re-arms it.
- **Checking whether an arbitrary utility compiled: use `grep -F`.** The CSS carries literal
  backslashes (`.h-\[350px\]`), so `grep 'h-\[350px\]'` is a false negative.

## Two upstream bugs found while authoring (in the app, not the sync)

- **`text-matrix-green` is a dead class.** Used in `atoms/typography/label/label.tsx:13` and
  `molecules/menu/dropdown-menu/dropdown-menu.tsx:59`, but `--color-matrix-green` is defined nowhere
  (0 occurrences in the compiled CSS). Both silently inherit near-white `--color-primary-text`
  instead of green — **on the live site too**, not just in preview cards.
- **`rehype-highlight` ships no theme in this bundle** (`grep -c hljs` → 0), so fenced code blocks
  inside `Markdown` render as unstyled monospace. Inline `code` is only tinted under
  `#reading-content-container`.

## Re-sync risks

- **Fonts go stale silently.** They are a snapshot of a past `next build`. Change the font config or
  the Next version and the shipped woff2 no longer match what the site serves; nothing detects it.
- **The compiled CSS is gitignored.** A fresh clone must run `cfg.buildCmd` before the converter, or
  `cssEntry` points at a missing file.
- **Shims can drift from the real Next behaviour.** They were written against Next 16's `next/image`
  prop surface. A Next major upgrade that changes `fill` or `placeholder` semantics would make previews
  diverge from production without any error.
- **Component discovery is source-derived**, so a renamed or newly-exported PascalCase symbol changes
  the component set without any explicit config change.
- The `.next/` directory must exist to re-extract fonts; it is gitignored and wiped by `rm -rf .next`.

## Known render warns (expected — a warn NOT on this list is new)

- **`CommandPalette`** logs one page error, `SyntaxError: Failed to execute 'json' on 'Response'`.
  The palette fetches the site's search index, and the card host serves only `ds-bundle/`, so it 404s.
  The component renders correctly regardless (full palette, five quick actions, keyboard hints).
- **`SelfHostedVideo`** renders a player frame with no video pixels, same `/media/**` 404 cause. Its own
  figure and caption styling are what the card demonstrates.
- The fixed `Menu` floating over the top of the brand header in the page-template cards is **real
  design-system behaviour at scroll 0**, not a preview artifact. Confirmed across templates.
