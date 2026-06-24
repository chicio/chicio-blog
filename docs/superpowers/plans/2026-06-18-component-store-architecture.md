# Component-Store Architecture Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **VERIFICATION MODEL — READ FIRST:** This repo has **no automated test suite** and forbids adding one (`.claude/rules/testing.md`). Do NOT write `*.test.ts`/`*.spec.ts` or add test frameworks. Every "verify" step means one or more of: `npm run lint` (zero errors — includes the custom `chicio/*` ESLint rules), `npm run build` (success), `npm run validate-architecture` (= `depcruise`, the dependency-cruiser check added in PR0), and a manual browser check for UI. Replace the TDD red/green loop with: implement → run lint+build+depcruise → manual check → commit.

**Goal:** Refactor every UI component so component files are pure rendering (one hook call — their own `use<Name>Store()` — returning a typed `{ state, effects }`), each component lives in its own encapsulated folder, placement follows consumer-count, and the pattern is enforced automatically in the pipeline.

**Architecture:** A two-tool enforcement layer defines and guards the pattern: a small **in-repo custom ESLint plugin** for the bespoke file/folder rules (`prefer-component-store`, `store-return-shape`, `index-only-component`, `folder-composition`) plus stock `react/jsx-no-bind`, and **dependency-cruiser** for all import/dependency/architecture boundaries. No `ts-morph`, no separate prebuild AST validator. The migration is phased: tooling first in non-blocking mode (ESLint `"warn"` + dependency-cruiser `"info"`/`"warn"`), a pilot section to prove the pattern, then per-section PRs that each raise their scope to ERROR, ending with a final PR that flips everything to global ERROR. Execution of each PR is delegated to the `fabrizioduroni-senior-engineer` agent, which owns its branch + commit + MR.

**Tech Stack:** Next.js 16 (App Router, RSC), React 19, TypeScript 5 (strict), TailwindCSS v4, Framer Motion v12, ESLint 9 flat config (`eslint.config.mjs`) + a local plugin under `tools/eslint/`, `dependency-cruiser` (new devDep), existing prebuild pipeline (`src/lib/build/prebuild.ts`).

---

## Glossary / Decided Conventions (authoritative)

These were decided during brainstorming and are the contract every task below must honor.

- **Component file** = the `.tsx` file that exports the component. May call **exactly one hook**: its own `use<ComponentName>Store()`. Nothing else hook-shaped. **TEMPORARY exemption (PR1 #371):** `useGlassmorphism` is allowlisted in `prefer-component-store` so it may be called directly in component files while we decide its permanent home (store vs. component). This allowlist MUST be removed and the rule re-strengthened to "only the store hook" before/at the final enforcement PR.
- **Banned in component files:** `useState`, `useEffect`, `useMemo`, `useCallback`, `useReducer`, `useRef`, `useContext`, `useSyncExternalStore`, framer-motion hooks (`useScroll`, `useTransform`, `useSpring`, `useMotionValue`, `useAnimate`, `useInView`, …), and calls to any shared hook (`useMotionStore`, `useTypewriter`, …). Allowed in JSX: framer `motion.*` **elements**, `<Ctx.Provider>` and any **component**. Banned in JSX: any function/arrow expression in an attribute (`react/jsx-no-bind`).
- **Curried effects:** parameterized handlers are curried in the hook. `onClick={effects.select(item.id)}` where `effects.select = (id) => () => store.select(id)`. Zero-arg: `onClick={effects.submit}`.
- **Store hook return type (REVISED on PR9 #380 — supersedes the original "both keys always present" rule):** a store returns ONLY the halves it actually has, using a named type from `@/types/component-store`:
  - neither state nor effects (pure side-effect, e.g. only runs `useLockBodyScroll`/`useEffect`) → `(): void`
  - state only → `(): StateStore<S>` where `StateStore<S> = { state: S }`
  - effects only → `(): EffectsStore<E>` where `EffectsStore<E> = { effects: E }`
  - both → `(): ComponentStore<S, E>` where `ComponentStore<S, E> = { state: S; effects: E }`
  Do NOT pad an unused half with `Record<string, never>` / `{}`. ALWAYS use the named type (never an inline `{ state: …; effects: … }` literal). The component destructures only the half present (`const { state } = useLoaderStore()`). The `store-return-shape` ESLint rule enforces: the returned object's keys are a NON-EMPTY SUBSET of `{state, effects}` (so `{state}`, `{effects}`, or `{state,effects}`); void/no-object returns are allowed. The earlier convention text below (`Record<string, never>` for empty halves) is OBSOLETE — retroactive cleanup of already-merged padded stores happens in the final enforcement PR. `state` holds everything read to render (data, derived values); `effects` holds everything called. **DOM ref convention (decided & empirically verified on PR5 #375):** React Compiler's `react-hooks/refs` rule forbids a ref escaping through the returned `{state,effects}` object — and worse, accessing a ref-like value **inline** in JSX (`ref={effects.setX}`) taints the ENTIRE `effects` binding, flagging every other `effects.foo` read during render (the verified error fired on unrelated `handleSubmit`/`handleInputChange`). The verified convention: hold the DOM node in the store via `const [el, setEl] = useState<HTMLElement | null>(null)` (the setter is stable and not ref-tainted; a `useRef` kept fully internal and NEVER returned also works), read `el` in the effect that needs it, and expose the setter `setEl` via `effects`. In the component, **destructure the setter before the JSX return** (`const { setEl } = effects; … <div ref={setEl} />`) — never `ref={effects.setEl}` inline. Never use `document.querySelector` for this. This is also why we do NOT allowlist `useRef` in component files — DOM handling stays owned by the store. Applies to all ref-heavy components ahead (matrix-rain canvas, scroll containers, focus management). **Shared ref-returning hooks (decided on PR8 #378):** when a SHARED design-system hook currently returns a `RefObject` (e.g. `useInViewList`, `useInView`, `useReadingProgress`), do NOT delete/reimplement it per-component — that loses the shared abstraction and any pooling optimization (`useInViewList` shares one `IntersectionObserver` across all consumers via a module-level pool). Instead convert the hook's PUBLIC API from `[ref, …]` to a **callback ref** `[setEl, …]` (internally `const [el, setEl] = useState(...)`, observe `el` in the effect), keep it shared, and have the consuming component's store call it and re-expose the callback ref via `effects`. Store hooks may call other hooks — only component files are limited to one. **Refinement (decided on PR1 #371):** a **pure side-effect store** — one with NO state AND NO effects (it only runs `useEffect`-style work) — returns `void` instead of an empty `{ state: {}, effects: {} }`. The component still calls `useNameStore()` for its side effect, just without destructuring. The `store-return-shape` rule already allows this (it only checks hooks that return an object literal).
- **Hook inputs:** the Store hook receives the props it needs as a single typed argument; purely presentational props (`className`, `children`, `label`, …) are used directly in JSX, not laundered through `state`.
- **Folder layout per component:** `component-name/` (kebab-case) containing:
  - `component-name.tsx` — the component (`export const ComponentName`)
  - `use-component-name-store.ts` — the Store hook, **only if the component has logic** (`export const useComponentNameStore`)
  - optional private sub-hooks `use-*.ts` (plain names; **only the top hook ends in `Store`**)
  - optional nested private child component folders (see placement)
  - `index.ts` — re-exports **only** the component (+ its public prop types). Never the hook.
- **Pure / server components:** folder + component file + `index.ts`, **no hook**. A component whose only logic is reading a global store still gets a Store hook (it wraps the read).
- **Placement by consumer count (everywhere):** used by exactly **1** consumer → nested **inside that consumer's folder** (private). Used by **2+** → hoisted to the **nearest shared ancestor**. Atomic tiers (`atoms/molecules/organism/templates` — note `organism` is singular) survive as the home for shared (2+) design-system components; single-consumer design-system components nest into their consumer.
- **Boundary (hard, enforced):** nothing may import a file inside a component folder except that folder's `index.ts`; nothing outside a private/nested folder may import into it. Consequence: adding a 2nd consumer creates an illegal cross-folder import → forces a hoist. De-sharing (dropping to 1 consumer) is **not** forced to sink.
- **Shared hooks home:** rename `design-system/utils/` hooks into a new `design-system/hooks/` (flat, one file each — NOT folderized). Includes utility hooks (`use-in-view.ts`, `use-typewriter.ts`, …) and the **exempt global-store hooks** (`use-motion-store.ts`, `use-consent-store.ts`, …) which return raw values via `useSyncExternalStore` and keep their names. Non-hook helpers stay in `design-system/utils/`.
- **`app/` scope:** route files (`page.tsx`, `layout.tsx`, providers) stay thin and delegate. Out of the component-folder rule. If one ever needs client logic, it follows the same Store pattern. (Today only `src/app/offline/page.tsx` is `"use client"` and it has no hooks.)
- **`useSyncExternalStore` gotcha:** global-store hooks returning an object must cache the snapshot (or React infinite-loops). Preserve existing caching; capture as a rule.

---

## File Structure (new/changed infrastructure)

- Create `src/types/component-store.ts` — the `ComponentStore<S, E>` type.
- Create `tools/eslint/index.js` + `tools/eslint/rules/*.js` — the local ESLint plugin (one rule per file).
- Create `.dependency-cruiser.js` — the dependency-cruiser config (boundary/isolation/layering/no-circular rules).
- Modify `eslint.config.mjs` — register the local plugin + `react/jsx-no-bind`, scoped to component files (warn during migration).
- Modify `package.json` — add `dependency-cruiser` devDep + `validate-architecture` (= `depcruise`) script.
- Modify CI (`.github/workflows/build.yml`) + `src/lib/build/prebuild.ts` — run `depcruise` (non-failing during migration).
- Modify `knip.*` config — prevent false "unused" on `index.ts` barrels, `tools/eslint/**`, and `dependency-cruiser`.
- Create `.claude/rules/component-architecture.md` — canonical pattern doc.
- Modify `.claude/rules/{design-system,content,code-style}.md` — remove obsolete two-folder guidance, point at the canonical doc.
- Rename `src/components/design-system/utils/` hooks → `src/components/design-system/hooks/`.
- Per migration PR: move/rewrite the section's components into the folder model.

---

## Chunk 1: PR0 — Tooling & Contract (non-blocking, then ratcheted)

**Branch:** `feat/component-store-tooling`. No component is migrated in this PR. It adds the enforcement stack and the contract type, all running **non-blocking** (custom ESLint rules at `"warn"`; dependency-cruiser boundary rules at `severity: "info"`/`"warn"`) so the build stays green over the not-yet-migrated codebase. Each later section PR raises its scope to `error`.

**Enforcement stack (decided — replaces the earlier ts-morph validator):**
- **Custom local ESLint plugin** (in-repo) — owns the bespoke, file/folder-scoped rules: `prefer-component-store`, `store-return-shape`, `index-only-component`, `folder-composition`. Runs in `npm run lint` → in-editor + CI.
- **dependency-cruiser** — owns all import/dependency/architecture rules: import a component only via its folder `index.ts`, sealed private/nested folders, content-page isolation, design-system layering, no circular deps. Runs as `depcruise` in CI + prebuild.
- **`react/jsx-no-bind`** (stock ESLint) — no functions in JSX.
- No `ts-morph`, no separate prebuild AST validator, no allowlist module. Migration scoping is done with ESLint flat-config `files` overrides + dependency-cruiser rule path-scopes that grow per PR.

### Task 0: De-risk spike (do FIRST, throwaway)

**Goal:** prove the three tools express our rules in this repo's ESLint 9 flat config before committing to them.

- [ ] On a scratch branch, install `eslint-plugin-` deps + `dependency-cruiser`, hand-write a minimal `prefer-component-store` rule and a minimal `.dependency-cruiser.js` "import only via index" rule, and point them at ONE folder (e.g. an already-simple `design-system/atoms/*` component and the `pwa` target). Confirm: (a) a local ESLint plugin loads in `eslint.config.mjs` flat config; (b) the custom rule fires on a deliberately-bad component and is clean on a good one; (c) dependency-cruiser flags a deep import and passes an index import; (d) `react/jsx-no-bind` fires on an inline arrow.
- [ ] Write up findings (which packages, versions, flat-config wiring, any expressiveness gaps). If a gap is found (e.g. dependency-cruiser can't seal nested folders the way we need), surface it before proceeding. **No commit** — this is throwaway; the real implementation follows below.

### Task 1: The `ComponentStore` contract type

**Files:**
- Create: `src/types/component-store.ts`

- [ ] **Step 1:** Write the type:

```ts
export type ComponentStore<TState, TEffects> = {
    state: TState;
    effects: TEffects;
};

export type EmptyState = Record<string, never>;
export type EmptyEffects = Record<string, never>;
```

- [ ] **Step 2:** `npm run build` → success.
- [ ] **Step 3:** Commit: `feat(capabilities): :sparkles: add ComponentStore contract type`.

### Task 2: Scaffold the local ESLint plugin

**Files:**
- Create: `tools/eslint/index.js` (the plugin: `{ rules: { ... } }`)
- Create: `tools/eslint/rules/*.js` (one file per rule)
- Modify: `eslint.config.mjs` (register the local plugin)

- [ ] Create a local flat-config plugin object that bundles the rules below and import it into `eslint.config.mjs` under a plugin namespace (e.g. `chicio`). Confirm `npm run lint` still runs with the (empty) plugin wired in. Commit: `feat(capabilities): :sparkles: scaffold local eslint plugin`.

> Local plugins in flat config are plain objects: `import chicio from "./tools/eslint/index.js"` then `{ plugins: { chicio }, rules: { "chicio/prefer-component-store": "warn" } }`. No npm publish needed.

### Task 3: Rule `prefer-component-store`

**Files:** Create `tools/eslint/rules/prefer-component-store.js`

**Spec:** In a component file (a `*.tsx` under `src/components/` whose basename does NOT start with `use-`), the only permitted hook call (callee matching `/^use[A-Z]/`, ignoring member expressions like `effects.useX`) is exactly the folder's own store: `use<PascalCase(folderName)>Store`. Any other `use*` call (React hooks, framer hooks, shared hooks) is a violation. More than one call to the store is a violation. The rule derives the expected store name from the file's directory name.

**Acceptance (verify by hand on fixtures during the spike, NOT as a committed test suite — repo forbids tests):**
- `const { state, effects } = useContactFormStore(props)` in `contact-form/contact-form.tsx` → OK.
- `useState(...)`, `useEffect(...)`, `useInView()`, `useMotionStore()` in a component file → violation.
- Two calls to `useContactFormStore()` → violation.
- Any `use*` call inside a `use-*.ts` file → ignored (rule only targets component files).

- [ ] Implement, set to `"warn"`, scope to `src/components/**/*.tsx` in `eslint.config.mjs`. `npm run lint` → 0 errors (warnings only). Commit.

### Task 4: Rule `store-return-shape`

**Files:** Create `tools/eslint/rules/store-return-shape.js`

**Spec:** In a `use-*-store.ts` file, the exported store hook must return an object with **exactly** the keys `state` and `effects` (no more, no fewer). Check the returned object-literal's property names (handle both `return { state, effects }` and arrow-body `=> ({ state, effects })`). (TypeScript already enforces the shape when the return is annotated `ComponentStore<…>`; this rule catches un-annotated/hand-rolled returns.)

**Acceptance:**
- `return { state, effects }` → OK. `=> ({ state, effects })` → OK.
- `return { state }` / `return { state, effects, foo }` → violation.

- [ ] Implement, `"warn"`, scope to `src/components/**/use-*-store.ts`. Lint clean. Commit.

### Task 5: Rule `index-only-component`

**Files:** Create `tools/eslint/rules/index-only-component.js`

**Spec:** In a component-folder `index.ts` (an `index.ts` under `src/components/` whose sibling contains a `*.tsx`), no export may be named `/^use[A-Z]/` (hooks must not leak through the barrel). Re-exporting the component and types is fine.

**Acceptance:**
- `export { ContactForm } from "./contact-form"` → OK.
- `export { useContactFormStore } from "./use-contact-form-store"` → violation.

- [ ] Implement, `"warn"`, scope to `src/components/**/index.ts`. Lint clean. Commit.

### Task 6: Rule `folder-composition`

**Files:** Create `tools/eslint/rules/folder-composition.js`

**Spec:** Triggered on each component `*.tsx` file (basename not starting with `use-`). Using `fs` on the file's directory, assert: (a) the directory name is kebab-case; (b) the component file basename equals `<dir>.tsx`; (c) an `index.ts` exists in the directory. If a `use-*-store.ts` exists in the dir, its name must be `use-<dir>-store.ts`. Tier bucket dirs (`atoms`/`molecules`/`organism`/`templates`) and the `design-system/hooks/` + `design-system/utils/` dirs are skipped (no direct components). (`organism` is SINGULAR in this repo.)

> ESLint rules may read the filesystem synchronously (`fs.existsSync`, `fs.readdirSync`) using `context.filename`; several published plugins do exactly this. Keep it cheap (one `readdir` per file dir).

**Acceptance:**
- `contact-form/contact-form.tsx` with sibling `index.ts` → OK.
- `contact-form/contactForm.tsx` (wrong case) or missing `index.ts` → violation.
- `contact-form/use-contact-form-store.ts` → OK; `contact-form/use-form-store.ts` → violation.

- [ ] Implement, `"warn"`, scope to `src/components/**/*.tsx`. Lint clean. Commit.

### Task 7: Wire `react/jsx-no-bind` + the custom rules into ESLint (warn, scoped)

**Files:** Modify `eslint.config.mjs`

- [ ] Add one flat-config block scoped to `src/components/**/*.tsx` (ignoring `**/use-*`) enabling `react/jsx-no-bind` (`{ allowArrowFunctions: false, allowFunctions: false, allowBind: false }`) and the `chicio/*` rules, all at `"warn"`. Per-section PRs add `error`-level overrides scoped to the migrated section's glob; the final PR replaces them with one global `error` block.
- [ ] `npm run lint` → 0 errors (warnings only). Commit.

### Task 8: dependency-cruiser for the architecture/boundary rules

**Files:**
- Add dep: `dependency-cruiser` (devDependency)
- Create: `.dependency-cruiser.js`
- Modify: `package.json` (script), CI workflow + `src/lib/build/prebuild.ts`

- [ ] Install `dependency-cruiser`, run `npx depcruise --init` to generate the baseline config, then add `forbidden` rules:
  - **import-only-via-index:** a module under `src/components/**` may not be imported from OUTSIDE its own folder unless the import target is that folder's `index.ts`. (Express with `from`/`to` path regex; `to.path` matching a file inside a component folder that is not `index.ts`, with `from.path` outside that folder → forbidden.)
  - **seal-private-folders:** nothing outside a nested component folder may import into it (same mechanism, applied to nested dirs).
  - **content-page-isolation:** `src/components/content/<pageA>/**` may not import `src/components/content/<pageB>/**` (finally enforces the CLAUDE.md rule that is currently unenforced). Allowed deps: design-system, features, lib.
  - **no-circular:** enable the built-in `no-circular`.
  - During migration, set these rules' `severity` to `"warn"`/`"info"` so CI stays green; OR scope each rule's `from.pathNot`/`to.pathNot` to exclude unmigrated sections and grow the scope per PR. Pick whichever the spike showed cleaner; document the choice.
- [ ] Add script `"validate-architecture": "depcruise src --config .dependency-cruiser.js"` (reuse the name the npm scripts already expect), wire it into CI (`build.yml`) and call it from `prebuild.ts` in a non-failing way during migration (or run as a separate CI step). Confirm it does NOT fail the build yet.
- [ ] `npm run build` + `npm run validate-architecture` → run, report violations as warnings/info, exit 0. Commit: `feat(capabilities): :sparkles: add dependency-cruiser architecture rules`.

### Task 9: knip + final PR0 verification

**Files:** Modify knip config

- [ ] Ensure component `index.ts` barrels, the local ESLint plugin files (`tools/eslint/**`), and `dependency-cruiser` are recognized (entry points / ignored) so `npm run knip` shows no NEW false positives.
- [ ] **Verify ALL:** `npm run lint` (0 errors), `npm run build` (success), `npm run validate-architecture` (runs, non-failing), `npm run knip` (no new issues), `npx tsc --noEmit` (exit 0). Paste the dependency-cruiser summary + ESLint warning count into the PR description.
- [ ] Open MR. Pause for human review of the rule set + sample output before any migration.


---

## Chunk 2: PR1 — Pilot migration (`features/pwa/`)

**Branch:** `feat/component-store-pilot-pwa`. Migrate the smallest self-contained section with real hooks to prove the recipe end-to-end and get sign-off before scaling. `pwa/` currently has 2 components + 3 hooks (`useInstallPrompt`, `usePwaInstallDecision`, `useOfflineContactQueue`).

### Task 1: Inventory the section

- [ ] List every file in `src/components/features/pwa/`, classify each component as pure vs. stateful, and map each hook to its consumer(s). Record the target folder layout (which hooks are private to one component → fold into its `use-<name>-store.ts`; which are shared by 2+ → hoist to `pwa/` root or `design-system/hooks/`). Produce a short written migration map. No code change. (No commit.)

### Task 2: Apply the per-component recipe to each pwa component

For **each** component in the section, follow the **Migration Recipe** (defined once in Chunk 3, Task R). In short, per component:

- [ ] Create `component-name/` folder; move the component into `component-name.tsx`.
- [ ] Create `use-component-name-store.ts` if it has logic; move ALL hooks/state/effects/derived values/refs into it; type its return as `ComponentStore<State, Effects>` with both keys; curry parameterized handlers.
- [ ] Rewrite the component to call exactly `useComponentNameStore(...)`, pass only the props it needs, and use no functions in JSX.
- [ ] Add `index.ts` exporting only the component (+ public prop types).
- [ ] Update all import sites to the folder index.
- [ ] Verify: `npm run lint && npm run build && npm run validate-architecture` clean for these files; manual browser check of the PWA install flow + offline behavior.

### Task 3: Flip pwa to ERROR

- [ ] Add an `error`-level ESLint override scoped to `src/components/features/pwa/**` (the `chicio/*` rules + `react/jsx-no-bind`), and extend the dependency-cruiser rule path-scopes to include `pwa/` at `error` severity. This makes pwa hard-enforced while the rest of the codebase stays at `warn`/`info`.

- [ ] **Verify:** `npm run lint` — errors if pwa regresses; clean because pwa conforms. `npm run build` + `npm run validate-architecture` clean.

- [ ] **Commit & open MR.** Pause for human sign-off on the pattern before proceeding.

```bash
git commit -m "refactor(capabilities): :recycle: migrate pwa to component-store pattern"
```

---

## Chunk 3: The reusable Migration Recipe + per-section PRs

### Task R: The Migration Recipe (reference for every component)

> This is the canonical per-component procedure. Every migration task in every section PR is an application of this recipe. Do NOT re-describe it per component — reference it.

1. **Create the folder.** `kebab-name/` at the component's correct placement (consumer-count: 1 consumer → nest inside that consumer's folder; 2+ → keep in shared tier / page root).
2. **Move the component file** to `kebab-name/kebab-name.tsx`, keeping `export const PascalName`.
3. **If the component has any React logic** (state, effects, refs, context, framer hooks, shared-hook calls, or any inline JSX function):
   - Create `use-kebab-name-store.ts`, `export const usePascalNameStore`.
   - Move **all** hook calls and logic into it. Convert event handlers into `effects` (curry those needing args: `(arg) => () => …`). Put data, derived values, and DOM refs into `state`.
   - Type the return as `ComponentStore<StateType, EffectsType>`; define `StateType`/`EffectsType` locally (or in `src/types/` if shared). Both keys present (`{}`/`Record<string,never>` if empty).
   - The hook takes the props it needs as one typed argument.
   - Private sub-logic → additional `use-*.ts` files in the same folder (plain names, not `Store`).
4. **Rewrite the component** to: receive props, call `usePascalNameStore({ …needed props })` exactly once (only if it has a store), destructure `{ state, effects }`, render. No functions in JSX (`onX={effects.handler}` or `onX={effects.handler(arg)}`). Presentational props used directly.
5. **Pure component?** Skip step 3–4's hook; just folder + file + `index.ts`.
6. **`"use client"`:** keep/add the directive at the top of the **component file** when it (or its store) is a client module. The store hook file is client by transitivity (imported by a client component); add `"use client"` to the store file too if it is imported anywhere a directive is needed.
7. **Create `index.ts`:** `export { PascalName } from "./kebab-name";` plus `export type { … } from "./kebab-name";` for public prop types. Never export the hook.
8. **Update all importers** to import from the folder (`@/.../kebab-name`), not the inner file.
9. **Nested private children:** if this component owns child components used only by it, recurse this recipe with their folders nested inside this folder; their `index.ts` is imported only by this component.
10. **Verify (per component or per small batch):** `npm run lint` (zero errors), `npm run build` (success), `npm run validate-architecture` (no new errors in this section), manual browser check of the affected UI.
11. **Commit** in small batches (per component or per closely-related cluster) with a `refactor(<scope>): :recycle:` message.

### Task S: Per-section PR checklist (apply once per section, in this order)

Order (smallest/least-risky first): **`features/` (non-pwa)** → **`content/chat/`** → **`content/art`/smaller content** → **`content/blog/`** → **`content/videogames/`** → **`design-system/` tiers** (`atoms` → `molecules` → `organism` → `templates`). Each is its own branch + MR, delegated to `fabrizioduroni-senior-engineer`.

For each section:

- [ ] **Inventory** the section: list components, classify pure vs. stateful, map every hook + sub-component to consumer count, decide placement (nest vs. hoist), and where the old `components/`+`hooks/` two-folder split exists, flatten it. Write the migration map.
- [ ] **Migrate** each component via Task R, committing in small batches, verifying continuously.
- [ ] **Relocate shared hooks:** any hook in this section used by 2+ components in the section stays at the section root; any cross-section/cross-cutting hook moves to `design-system/hooks/` (created/renamed from `design-system/utils/` — do this as part of the first section that needs it, or as a dedicated early step). Update importers.
- [ ] **Flip to ERROR:** add an `error`-level ESLint override scoped to this section's glob and extend the dependency-cruiser rule path-scopes to include this section at `error` severity.
- [ ] **Verify whole section:** `npm run lint`, `npm run build`, `npm run validate-architecture` all clean; manual browser pass of every affected route.
- [ ] **Commit + MR;** await review before the next section.

> The `design-system/hooks/` rename (from `utils/`) should happen in an **early dedicated micro-PR** (before content sections that import shared hooks) to avoid repeated import churn: move the ~20 hook files, keep non-hook helpers in `utils/`, update all importers, verify. Treat it as a standalone PR between PR1 and the first content section.

---

## Chunk 4: Final PR — Global enforcement + docs

**Branch:** `feat/component-store-finalize`.

### Task 1: Flip to global ERROR

- [ ] Once every section is migrated, replace the per-section ESLint `error` overrides with a single global `error` block for `src/components/**` (custom `chicio/*` rules + `react/jsx-no-bind`), and raise all dependency-cruiser rule severities to `error` (removing any per-path scoping that excluded unmigrated sections). Wire `depcruise` to fail CI + prebuild.
- [ ] **Verify:** `npm run lint && npm run build` — fully green with global enforcement. `npm run validate-architecture` (`depcruise`) — `0 violations`. `npx tsc --noEmit` — exit 0.
- [ ] **Commit:** `feat(capabilities): :lock: enforce component-store architecture globally`.

### Task 2: Canonical rule doc

**Files:**
- Create: `.claude/rules/component-architecture.md`

- [ ] Write the canonical doc capturing the full pattern from the Glossary section above: folder-per-component, one Store hook, `{state, effects}` + `ComponentStore` type, curried effects / no JSX functions, banned hooks list, consumer-count placement, `index.ts` encapsulation, shared-hooks home, the enforcement (ESLint + validator) and how to run it, and the `useSyncExternalStore` snapshot gotcha. Include a full worked example (a stateful component + its store + index).
- [ ] **Commit.**

### Task 3: Targeted edits to existing rule docs

**Files:**
- Modify: `.claude/rules/design-system.md` (nesting model + tiers-as-shared-bucket; point at canonical doc)
- Modify: `.claude/rules/content.md` (remove the two-folder `components/`+`hooks/` guidance; folder-per-component + nesting; point at canonical doc)
- Modify: `.claude/rules/code-style.md` (add: no functions in JSX, one-hook-per-component, `ComponentStore` typing, hook/file naming)
- Modify: `CLAUDE.md` (update the "Key Patterns" + directory-structure sections to reflect the new model)

- [ ] Edit each to remove obsolete guidance and reference `component-architecture.md`. Ensure no contradictions remain.
- [ ] **Commit.**

### Task 4: Emergent-rules pass (proposal → approval → write)

- [ ] Do a codebase pass to surface rules that exist in practice but aren't documented (candidates seen during exploration: named-exports-only + no default exports already in code-style; `"use client"` placement convention; the `useSyncExternalStore` object-snapshot caching gotcha; markdown content-negotiation pattern already in CLAUDE.md; build-time content caching). **Bring the list to the human for approval BEFORE writing** any new rule (per the agreed process). Then write the approved ones.
- [ ] **Commit.**

---

## Chunk 5: Review & sign-off gates

- [ ] After Chunk 1 (tooling): human reviews the spike findings, the custom ESLint rules + dependency-cruiser config, and sample warning output before any migration.
- [ ] After Chunk 2 (pilot): **mandatory human sign-off** on the realized pattern before scaling.
- [ ] After each section PR: human review before the next.
- [ ] After Chunk 4: final human review of global enforcement + docs.

## Intentionally NOT auto-validated (code-review gates)

These decisions are documented in the canonical rule doc and checked at human review time, not by tooling (automating them is low-value or unreliable):

- **Hook input signature** (Decision 5: hook takes the props it needs as one typed arg; presentational props used directly): a code-review/style expectation, not a lint rule.
- **Placement by consumer count** (Decision 6): the *boundary* is auto-enforced (dependency-cruiser makes a wrong placement produce an illegal import); the *judgment* of where to hoist is human.
- **`useSyncExternalStore` snapshot caching** (global stores): a review gate on the exempt global-store hooks; document the gotcha, do not attempt to detect correct memoization.
- **Store hooks written as arrow functions**: the `store-return-shape` rule inspects the store hook's returned object literal. Keep all store hooks as `export const useXStore = (...) => (...)` (matches repo style); the rule should handle both `return {…}` and arrow-body `=> ({…})`, and skip what it can't statically read — call this out in the canonical doc.

## Risks & mitigations (carried from brainstorming)

- **~173 `index.ts` barrels** → knip false positives. Mitigated in Chunk 1 Task 9.
- **Curried effects allocate per render** → accepted; structural purity, not a perf change.
- **Custom ESLint plugin is new tooling to maintain** → kept tiny (4 small rules, one per file); far less than a bespoke AST validator, and the heavy boundary logic is offloaded to maintained `dependency-cruiser`.
- **`eslint-plugin-` / dependency-cruiser flat-config + expressiveness risk** → de-risked up front by the Chunk 1 Task 0 spike before committing to the stack.
- **`useSyncExternalStore` snapshot gotcha** on global stores → preserve caching; documented as a rule.
- **Large diffs / no tests** → mitigated by per-section PRs + continuous lint/build/depcruise/manual verification.
- **"Exactly one Store call" + `{state,effects}` shape** → owned by the in-repo custom ESLint plugin (`prefer-component-store`, `store-return-shape`); these are the irreducibly-bespoke parts no off-the-shelf tool covers.
