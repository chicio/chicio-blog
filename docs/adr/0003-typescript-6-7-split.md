# TypeScript sits on two majors: root is 6, every workspace is 7

The root `package.json` pins TypeScript 6 while every workspace pins `^7.0.2`, so `next build` and `tsc --noEmit` get
the TS 7 type checker (measured 6x faster on this repo) while the tooling hoisted at the root keeps the compiler API it
imports. Revisit when TS 7.1 ships its compiler API and `typescript-eslint` follows.

## Why the root cannot move to 7

`typescript@7.0.2` exports an API surface (`./unstable/sync`, `./unstable/async`, `./unstable/fs`, `./unstable/ast*`),
but not the classic `lib/typescript.js` entry `typescript-eslint` imports: `exports["."]` is `./lib/version.cjs`, and
`lib/` holds only `tsc.js`, `getExePath.js`/`.d.ts` and `version.cjs`/`.d.cts`. It also ships no `tsserver`, and 7.1
is expected to ship a new, different API. `typescript-eslint` throws at import once the compiler's major is `>= 7`
(that is how PR #620 failed, so the lint job already enforces the pin on its own), and it resolves `typescript` from
wherever it itself is installed.

Root `node_modules` hoists `knip`, `dependency-cruiser`, `react-docgen-typescript` (Storybook's prop-table generator)
and `rolldown-plugin-dts` (tsdown's `.d.ts` emit) alongside `typescript-eslint`. None of the five has its own nested
`typescript`, so all resolve the one root copy. Both eslint configs load that one `typescript-eslint` copy
(`packages/matrix-design-system/eslint.config.mjs` directly, `apps/website` transitively through
`eslint-config-next/typescript`), and VS Code's "Use Workspace Version" needs it for a working `tsserver`.
`typescript-eslint` itself is declared only in `packages/matrix-design-system/package.json`.

## Consequences

- The published `.d.ts` files of `packages/matrix-design-system` and `packages/matrix-component-store` are emitted by
  TS 6 (`rolldown-plugin-dts`, inside each tsdown build), while their sources are type-checked by TS 7.
- `apps/website`, `apps/matrix-design-system-showcase`, `packages/matrix-design-system` and
  `packages/matrix-component-store` each pin their own `typescript`; `packages/eslint-plugin-chicio` declares none.
- The TS 7 compiler is not inside the `typescript` package: it arrives through 20 platform-specific
  `optionalDependencies` (`@typescript/typescript-<platform>-<arch>`) recorded at root in `package-lock.json` with
  `os`/`cpu` guards, so `npm ci` on `ubuntu-latest` pulls `@typescript/typescript-linux-x64` while a Mac gets
  `typescript-darwin-arm64`.
- `.github/dependabot.yml` ignores major bumps of `typescript`.
- The `matrix-rain-*` packages pin `typescript: "npm:tsover@6.0.2"` for operator overloading: an unrelated reason, but
  the same lesson. Check why a `typescript` version looks wrong before "fixing" it.
