---
name: legacy-peer-deps-voids-peer-range-guarantees
description: The root .npmrc sets legacy-peer-deps = true, so npm ci never fails on a peerDependencies range violation — reject any claim that a bad version bump "will fail CI on arrival"
metadata:
  type: feedback
---

The repository root `.npmrc` contains `legacy-peer-deps = true`. npm then **ignores
`peerDependencies` entirely during resolution**, so a dependency installed outside a declared
peer range produces no `ERESOLVE`, no warning that any gate counts, and a clean `npm ci` (every
`ci.yml` job installs with `npm ci` under that same `.npmrc`).

**Why:** a diff on `chore/typescript-7` documented, in `.github/dependabot.yml`, that a root
`typescript` 6.1 minor "would fail CI on arrival, not merge silently" because
`typescript-eslint@8.69` peers `typescript` at `>=4.8.4 <6.1.0`. Proved false in a scratchpad:
`npm install typescript-eslint@8.69.0 typescript@7.0.2` exits 0 with the repo's `.npmrc`, and
only fails (`ERESOLVE`) with `--no-legacy-peer-deps`. A peer-range violation is therefore an
*invisible* failure mode here, and typescript-eslint's unsupported-version notice is a console
warning, not an ESLint diagnostic, so `--max-warnings 0` does not catch it either.

**How to apply:** whenever a diff (code, comment, or doc) rests on "the peer range protects us",
run the two-line control in the scratchpad — install the offending pair with and without
`--no-legacy-peer-deps` — before accepting the claim. The same reasoning voids any argument that
`overrides`/version-pin drift will be caught at install time. Real guards in this repo are the
gates that actually execute (`lint`, `typecheck`, `test:run`, `build`), never npm's resolver.
See [[knip-does-not-ignore-test-files]] for the sibling shape: a tool believed to be a guard that
structurally cannot be one.
