---
name: new-collection-section-review-checks
description: A new collection section built by "mirroring Videogames" inherits two latent gaps. The per-item open event (open_<item>) is declared in tracking.ts but never fired by the card. The gallery→cover carousel fallback's non-empty branch goes untested because every seed entry has gallery: []
metadata:
  type: feedback
---

Rule 1 (tracking): when a diff adds a collection card (CoverCard `action: { kind: "link" }`), grep
`tracking.action.open_<item>` outside `types/configuration/tracking.ts`. Zero fire sites = blocking registration gap.
`.claude/rules/content.md` says every new clickable UI element needs a tracking action, and the design system
README's own CoverCard example passes `onClick: trackOpen`.

**Why:** Videogames used to fire `open_videogame_game` from the game card and the prev/next pills, but the
design-system-self-contained refactor (#392) dropped those call sites. `open_videogame_game`, `open_videogame_console`
and `open_dsa_topic` have been dead declarations on main since then. So a unit told to "mirror Videogames" copies
the loss, and the data-layer unit's new `open_<item>` ends up orphaned. Seen on the Manga pages, 2026-09-29.

Rule 2 (carousel): `metadata.gallery || [cover]` never falls back for `gallery: []`, because `[]` is truthy. The
correct `gallery.length > 0 ? gallery : [cover]` usually sits inline in an async server component (untestable in
RTL). Since every seed entry has an empty gallery, the e2e only exercises the fallback half, and an
"always the cover" mutant passes everything. Demand a pure helper with both branches unit-tested.

**How to apply:** check both on any new collection detail/list page (Manga, future Books/Vinyl…). The prev/next
pills cannot carry tracking until `PreviousNextNavigationTarget` gains an `onClick`. That gap is non-blocking and
belongs to the design system.

Related: [[paired-variant-swap-mutant]], [[e2e-lazy-mounted-card-needs-scroll]], [[run-knip-in-unit-review]].
