---
name: test-fixture-on-a-flagged-content-bug
description: cross-check the implementer's "pre-existing content bug, left as is" uncertainties against the items the new tests use; an e2e that asserts the buggy path goes red when Fabrizio fixes the content
metadata:
  type: feedback
---

When the implementer reports content bugs it deliberately kept ("Fabrizio owns the photos"), grep the new tests for
those same items. On the Videogames content-in-MDX PR (2026-09-29) the implementer flagged that Super Mario Odyssey's
Gameplay carousel points at `super-mario-bros-wonder/gameplay/*.jpg`, then wrote the e2e "gameplay carousel still
renders" against Odyssey, asserting the Wonder path. The test is green and exercises the behavior, but it pins the
bug: the obvious content fix (Odyssey's own `media/gameplay/1..3.jpeg` exist) turns it red.

**Why:** a correct content fix should never break a behavior test. It also makes the bug look intentional to the
next reader.

**How to apply:** at Unit or Integration Review, read the implementer's `uncertainties`, then grep the diff's
tests/e2e for each named slug. If a test asserts the buggy value, report it (non-blocking unless the plan forbade it)
with the direction "pick an item whose data is correct". Related: [[content-conversion-self-oracle-tests]],
[[e2e-selector-must-be-feature-unique]].
