---
name: type-only-import-needs-types-package
description: A dependency added to satisfy knip for a type-only import must be @types/x, not x; verify node_modules/<x>/package.json before accepting, and diff npm audit against main
metadata:
  type: feedback
---

When a diff adds a dependency to `package.json` to satisfy a **type-only** import (`import type { ... }
from "hast" / "mdast" / "unist" / "estree"`), verify it declared `@types/<x>` and not the bare `<x>`
runtime package.

**Why:** `hast`, `mdast`, `unist` and friends have real npm packages that are abandoned 2015-era
prototypes, unrelated to the type definitions the ecosystem actually ships in `@types/*`. Declaring the
bare name silences knip (knip maps a type import onto either name) while installing junk: `hast@0.0.2`
pulled 26 lockfile entries (`unified@^2`, `htmlparser2@^3`, `camelcase@^1`, `trim@0.0.1`, `ent`,
`param-case@1`, ...) and introduced a fresh `npm audit` advisory (GHSA-w5p7-h5w8-2hfq, ReDoS in
`trim` <0.0.3) that does not exist on `main`. No CI gate catches this — lint, knip, typecheck and build
are all green.

**How to apply:** for every new entry in the `package.json` diff, run
`cat node_modules/<name>/package.json` and check the description/version/deps look like the thing the
code actually imports. Then diff the supply chain against the base branch:

```
git diff main...HEAD -- package-lock.json | grep -E '^\+\s+"node_modules/'
git show main:package-lock.json | grep -cE '"node_modules/(<suspect>|<its transitive deps>)"'
npm audit --omit=optional
```

A newly-introduced advisory for zero functional benefit is blocking, not polish.
