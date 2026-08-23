---
name: deleted-prop-and-collapsing-enum-tests
description: Two test-quality traps that pass every gate — a deleted/hardcoded prop leaves no test surface because the local next/link mock discards it, and an enum whose members collapse to the same rendered value makes "defaults to X" tests unfalsifiable
metadata:
  type: feedback
---

Rule: when a diff changes what a component passes to a third-party component (`next/link`,
`next/image`, framer-motion), two distinct test-quality failures pass lint, typecheck, vitest and
build, and neither shows up in a coverage number. Check both explicitly.

**1. A deleted prop / deleted hardcoded value has no test surface.**
Removing `prefetch={false}` (or any hardcoded prop) to fall back to the library default IS a
behavior change, but the component's co-located test usually mocks `next/link` with an inline
mock that never forwards that prop — sometimes even destructures it into a discard
(`prefetch: _prefetch`). Nothing can fail if someone re-adds the hardcoded value later, which is
exactly the regression the change exists to prevent. Reviewer move: for every component in the
diff whose only change is a deleted prop, open its test's local mock and ask "does the mock even
expose the prop?" If not, the behavior is untested regardless of how many other tests the diff
added. `src/test-utils/next-module-mocks.tsx`'s shared `nextLinkMock` captures props onto
`data-*` attributes and is the fix.

**2. Enum members that collapse to the same rendered value make "defaults to X" tests
unfalsifiable.** A strategy/variant enum forwarded to a library prop often maps two members onto
one value (e.g. `"hover"` and `"never"` both render `prefetch={false}`; only a later transition
distinguishes them). A test named `it("defaults to the hover strategy")` asserting
`data-prefetch="false"` is then satisfied by `"never"`, and frequently by the pre-change code too
— it only fails if the default is dropped entirely. Reviewer move: for each assertion on a
forwarded enum, enumerate which OTHER enum members satisfy the same assertion. If any does,
demand the discriminating assertion (usually the state transition: hover the element and assert
the value changes), not just the initial value.

**Why:** both traps produce a diff where the headline behavior is "tested" by name and green
everywhere, while the two most likely regressions are uncatchable. Coverage cannot see either —
the lines execute, the branches are taken, only the assertions are too weak.

**How to apply:** on any diff that adds a strategy/variant prop or deletes a hardcoded one,
inventory every touched component and pair it with the assertion that would fail if its specific
mapping regressed. Missing pair = blocking; weak-but-nonvacuous pair (fails on "prop dropped",
passes on "wrong member") = non-blocking with the transition assertion as the direction.

Related: [[config-object-mutation-not-branch-coverage]], [[knip-does-not-ignore-test-files]].
