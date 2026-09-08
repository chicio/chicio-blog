---
name: arch_typescript_7_split
description: Root pinned to TypeScript 6, every workspace bumped to 7; why, and the tsc-file-arg-plus-tsconfig gotcha it exposed in verify-packages.mjs
type: project
---

`chore/typescript-7` (2026-09-08) put root `typescript` at `^6.0.3` and every workspace's own
`typescript` devDependency at `^7.0.2`. Full rationale lives in the `CLAUDE.md` TypeScript
paragraph (Repository Layout section) — read that before touching any `typescript` version in
this repo, do not re-derive it here.

Two facts worth remembering because they are non-obvious and were wrong in the first draft of the
docs:
- TS 7.0.2 does export an API surface (`./unstable/sync`, `/async`, `/fs`, `/ast*`) — what it
  lacks is the classic `lib/typescript.js` entry `typescript-eslint` imports. And the Go binary
  does not ship inside the `typescript` npm package itself; it arrives via 20 platform-specific
  `optionalDependencies` (`@typescript/typescript-<platform>-<arch>`), which is why CI on
  `ubuntu-latest` and a local Mac pull different binaries.
- Root-hoisted TS-6 consumers are not just `typescript-eslint` and `dependency-cruiser`: `knip`,
  `react-docgen-typescript` (Storybook prop tables) and `rolldown-plugin-dts` (tsdown's `.d.ts`
  emit) resolve root `typescript` the same way. Consequence: `matrix-design-system` and
  `matrix-component-store`'s *published* `.d.ts` files are emitted by TS 6 while their *sources*
  are type-checked by TS 7 in each workspace's own `tsc --noEmit`.

**The `tsc <file> --noEmit` + adjacent `tsconfig.json` gotcha** (caught by
`fabrizioduroni-code-reviewer` on round 1 of this branch's review loop): from TypeScript 6 onward,
running `tsc --noEmit somefile.ts` in a directory that also contains a `tsconfig.json` aborts
immediately with `TS5112` ("tsconfig.json is present but will not be loaded if files are specified
on commandline") — nothing is compiled, so a resolution failure the check exists to catch can
never surface. `scripts/verify-packages.mjs`'s consumer type-probe used exactly that shape; bumping
its throwaway consumer's `typescript` from `^5` to `^7` (needed to prove the package resolves for
a TS 7 consumer) silently turned the check into a no-op, because the script's `catch` only called
`fail()` on `/Cannot find module|has no exported member/` and TS5112 fell into the tolerant
`else` branch. Fix: drop the file argument (`tsc --noEmit`, project mode) so tsc loads the written
tsconfig.json itself. Verified non-vacuous both ways: with the package installed it reports the
intended `TS2314` arity complaints (real compilation happened); with the package removed it
reports `TS2307 Cannot find module`, which the existing `catch` correctly turns into a failure.
**Whenever a script's compiler/linter version changes, reproduce its exact invocation in a
scratchpad and prove it still goes red on a deliberate regression** — a green re-run of the
unmodified check proves nothing about whether the check itself still works.

See [[feature_testing_pyramid]] for the wider Vitest/typecheck picture this interacts with (the
editor's `tsserver` is root TS 6, the `typecheck` gate is workspace TS 7 — same tsconfig, different
compiler, documented in `testing.md`).
