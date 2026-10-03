---
name: run-knip-in-unit-review
description: Unit Checks skip knip, so a Binding barrel re-exporting design-system types "for convenience" ships knip-red; run `npx knip` in apps/website yourself (read-only, safe in parallel)
metadata:
  type: feedback
---

The implementer's Unit Checks are lint, validate-architecture, typecheck and test:run; knip belongs to the
gate-runner. So a Work Unit can arrive with its own knip failures, most often a `design-system-next/<x>/index.ts`
that re-exports extra design-system types nobody imports (`export type { MenuEntry, MenuLink, MenuDropdown,
MenuGroup }` where only `MenuEntry` is used) -> "Unused exported types".

`npx knip` from `apps/website/` writes nothing, binds no port and never touches `.next`, so it is safe during
concurrent Unit Reviews.

**Why:** a knip red caused by the unit's own files will not be fixed by any later Work Unit and costs a whole
integration round if left to Full Checks.

**How to apply:** run it, then triage each item by owner: items that a later Wave consumes (a new Binding's
`index.ts` not yet imported, MDX imports of components another unit builds, a type another unit's route will use) are
expected and non-blocking; items in files the unit owns that no downstream unit will import are blocking.
Test imports count as usage (see [[knip-does-not-ignore-test-files]]), but a test importing `./x` rather than the
barrel leaves the barrel's `index.ts` "unused".
