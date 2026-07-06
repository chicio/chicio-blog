---
name: arch_delegating_store_pattern
description: Pattern for deduping identical use-*-store.ts logic without breaking one-store-per-component
type: project
---

When N components have byte-identical store bodies (differing only in type/hook names), do NOT delete or merge
the per-component stores — ESLint `prefer-component-store` requires each component `.tsx` to call exactly its
own `use<Name>Store()`. Instead:

- Extract the duplicated logic into a shared hook in `src/components/design-system/hooks/` (direct import, no
  barrel — hooks/ is exempt from import-only-via-index).
- Each `use<Name>Store` keeps its own file, type name, and `EffectsStore<E>`/`StateStore<S>`/`ComponentStore<S,E>`
  return shape, but its body becomes a one-line delegation to the shared hook.
- Components need ZERO changes — same destructured key, same shape.

Example done in #433: 4 identical `onClick ?? (() => {})` tracking-callback stores (external-link, internal-link,
call-to-action-external-with-tracking, call-to-action-internal-with-tracking) unified via
`src/components/design-system/hooks/use-tracking-callback.ts` (`useTrackingCallback(onClick?: () => void): () =>
void`). Each store's body became `onTrack: useTrackingCallback(onClick)`. Zero component/test changes needed —
that absence is itself the proof the refactor preserved behavior.

**Why**: keeps the one-hook-per-component and folder-per-component contracts intact while still passing
dependency-cruiser/knip with no new duplication.

**How to apply**: whenever a hygiene/dedup issue targets N nearly-identical `use-*-store.ts` files, reach for
this shared-hook-delegation shape first, not a merge/delete of the component-owned stores.
