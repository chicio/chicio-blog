---
name: tsc-file-arg-tsconfig-ts5112-false-green
description: A `tsc <file>` invocation next to a tsconfig.json fails with TS5112 on TypeScript >= 6, so a script that only fails on selected error strings prints success while checking nothing
metadata:
  type: feedback
---

`tsc --noEmit probe.ts` run in a directory that also contains a `tsconfig.json` **stops with
`error TS5112: tsconfig.json is present but will not be loaded if files are specified on
commandline`** from TypeScript 6 onward (TS 5.9 silently ignored the config and type-checked the
file). Nothing is compiled: imports are never resolved, so the invocation cannot detect a missing
or unresolvable type.

Whenever a verification script wraps a compiler call in `try/catch` and only calls `fail()` for a
whitelist of message substrings (`/Cannot find module|has no exported member/` in
`scripts/verify-packages.mjs`), a TS5112 bail-out lands in the tolerant branch and the script logs
its success line. Bumping the compiler version *inside* such a script therefore converts a real
check into a no-op with no gate turning red.

**Why:** caught on `chore/typescript-7`, where the consumer smoke test moved from `typescript@^5`
to `^7`; proved by re-running the same probe under 5.9.3 (real TS2314 arity errors, i.e. it
compiled), 6.0.3 and 7.0.2 (TS5112 only) and by deleting the package entirely under 7 (still only
TS5112 — so it passes even with nothing installed).

**How to apply:** when a diff changes the TypeScript (or any compiler/linter) version used by a
script rather than by the build, reproduce that script's *exact* invocation in the scratchpad and
prove it still fails on a regression — delete the thing it checks and confirm the script goes red.
Argument-vs-project mode is the tell: project mode (`tsc --noEmit`, no file argument) honours
`tsconfig.json` and does report `TS2307 Cannot find module`, so it is the fix; `--ignoreConfig`
silences TS5112 but throws away the very `moduleResolution` the check exists to exercise.
See [[config-object-mutation-not-branch-coverage]] for the same "green but asserts nothing" shape.
