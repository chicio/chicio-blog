# I Know Kung Fu: mobile trigger as a red pill

Date: 2026-07-25
Status: approved design, not yet implemented

## Problem

The "I Know Kung Fu" easter egg has two triggers: the Konami key sequence (desktop) and five quick taps on a
hidden corner hotspot (intended for touch). The tap trigger does not work in practice on a phone. Two causes
were verified in the code.

**Cause 1: banners cover it.** The hotspot is `fixed bottom-0 right-0 z-30 h-11 w-11`, so it occupies the
bottom 44px of the viewport. `CookieConsentBanner` and `InstallPromptBanner` are both
`fixed bottom-5 left-0 right-0 max-w-[95%] z-50`, which is 20px from the bottom, nearly full width on mobile,
and 20 z-levels above the hotspot. While either is showing, the top 24px of the hotspot is covered and only
the bottom 20px remain tappable. `MatrixRainControlPanel` (`bottom-0 z-40`) covers it entirely when open.

**Cause 2: the remaining strip is the system gesture zone.** `bottom-0` with no `env(safe-area-inset-bottom)`
offset places the target inside the iOS home-indicator swipe area and the Android gesture-navigation strip.
The residual 20px left by cause 1 is precisely this zone. (This cause is inferred from well-established
platform behaviour, not measured locally: device-level gesture interception cannot be reproduced in desktop
browser emulation.)

Compounding both: the hotspot is invisible and gives no feedback until the fifth tap, so occlusion and
mis-aim are indistinguishable from "the egg is broken".

## Decision

Replace the invisible hotspot with a visible red pill in the bottom-right corner that materialises after a
dwell delay, on touch devices only. The pill is both the trigger and the hint.

The red pill is the Matrix's own invitation, so making it the tap target reads as intentional design rather
than a hidden hotspot, and it gives the egg a discovery channel it never had.

## Non-goals

- **The spoon egg's touch path is out of scope.** "There Is No Spoon" is genuinely unreachable on touch: it
  listens on `keydown`, and `shouldIgnoreKeystroke` deliberately bails when focus is in an input, so the only
  way to summon a mobile keyboard is also the way to guarantee the egg ignores you. This is a real gap and is
  parked for separate work, with "press and hold while staying perfectly still" as the leading candidate.
- **Gesture recognition is rejected for this egg.** A single-finger swipe-sequence Konami is thematically
  ideal, and the published hint already describes movements rather than keys, but this site is scroll-heavy
  long-form content. A global up/down recognizer sees every scroll flick and document scrolling cannot be
  `preventDefault`ed to disambiguate; horizontal swipes collide with the `image-carousel` framer-motion drag
  and with the iOS Safari edge back/forward gesture. An egg that misfires while someone reads is worse than
  one they cannot reach.
- **Shake / device motion is rejected outright.** `DeviceMotionEvent.requestPermission()` is mandatory on
  iOS 13+, must be called from a user gesture, and shows a system permission prompt. You cannot ask
  permission for a secret.
- **No banner coordination.** See "Accepted degradations".
- **No change to the published hunt copy.** Keeping the pill in the bottom-right corner and the count at five
  means `easter-eggs-content.ts` stays accurate as written.

## Design

### Placement

```
fixed right-4 bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] z-30
```

The safe-area inset plus 24px clears the home indicator and the gesture-navigation strip, fixing cause 2.
`right-4` keeps it off the iOS Safari right-edge forward-swipe.

The bottom-right corner is deliberate. A `fixed` element overlaps scrolling content at any vertical position,
so no placement escapes overlap; what changes is attention. The corner is the conventional location for a
floating affordance, so users expect it and tune it out, and it is the most thumb-reachable spot on a phone.
A vertically-centred right edge was considered and rejected: it sits at reading eye-level beside the body
column, where a floating artifact is most distracting, and at `z-30` with pointer events live an 84x50 target
would intercept taps meant for article links underneath.

### The pill

Reuse `RedPillNoReflection` from `design-system/atoms/effects/pills`. It already accepts `pillBodyClassName`
and `pillLabelClassName`, so the atom needs no changes.

- Override `min-w-0 w-[84px]`, keep the native `h-[50px]` from `.pill` (`pills.css:3`).
- Result: 84x50, versus 44x44 today. Roughly 2.2x the tap area, and at least 44px on both axes, so it meets
  the touch-target minimum on its own rather than relying on the screen corner.
- No visible label. A red pill is self-evident and any text would explain the joke. The accessible name comes
  from `aria-label`, not visible text.

### Reveal

- Not rendered at all until a 4 second dwell timer elapses. This keeps the test contract simple (absent, then
  present) and avoids a hidden-but-present interactive node.
- On mount at dwell, a CSS keyframe animation fades it from `opacity-0` to a resting `opacity-45` over 2
  seconds, then it stays. A keyframe animation is used rather than a class-flip transition because a
  freshly-mounted element needs no extra frame to start animating.
- Reduced motion (`useReducedMotions`): skip the animation and render at resting opacity directly.
- The timer lives in the egg's own store. Because `KungFuEasterEgg` is mounted from `LayoutAdditionalContent`,
  which sits in the persistent layout and is not remounted on navigation, the dwell runs once per session
  rather than restarting on every route change. No state needs lifting to achieve this.

Opacity-only, no movement or scale, low resting opacity, and peripheral placement keep the appearance from
being jarring mid-read. Holding the reveal until scrolling stops was considered and deferred: easy to add
later, hard to justify before seeing it in practice.

### Interaction

- Still five taps, matching the published solution steps.
- `TAP_RESET_WINDOW_MS` widens from 1500 to 2500. Five taps in 1.5s is punishing on a deliberate, visible
  affordance.
- Each tap pulses the pill to full opacity, so it is obvious it is counting. Today there is no feedback until
  tap five, which is the other half of why it felt broken.
- The existing `activate()` path is unchanged, so the Konami sequence, the single-fire guard, and tracking all
  behave exactly as they do now.

### Accessibility

The current node is `aria-hidden="true"` on a `div`, which was correct for an invisible decoration. A
*visible* interactive control excluded from the accessibility tree is a regression, so this becomes a real
`<button>` with an `aria-label`.

This reverses the earlier decision to keep the hotspot out of the accessibility tree. That decision was made
to resolve axe label violations on decorative-hidden elements, and it still holds for genuine honeypots; it
does not apply to a control the user is meant to see and press. Screen readers will announce the egg, which
is acceptable: `/easter-egg-hunt` already documents all four eggs publicly.

**The accessible name must not be `"I Know Kung Fu"`.** The replay pill inside the overlay already uses that
name and is queried by it (`kung-fu-easter-egg.test.tsx:190`, `:204`). Reusing it would make those
`getByRole("button", { name: ... })` queries ambiguous. Use a distinct name such as `"Take the red pill"`.

### Scope: touch devices only

Gated behind a coarse-pointer check. Desktop stays visually untouched and keeps the Konami sequence, which
already works there. The problem being solved is specifically the phone.

New shared hook: `src/components/design-system/hooks/use-coarse-pointer.ts` (flat file plus co-located
`.test.ts`, matching the convention in that directory).

It uses `useSyncExternalStore` over `matchMedia("(pointer: coarse)")` with a server snapshot of `false`,
following the pattern already in `use-install-prompt-banner-store.ts:25-37`. This is hydration-safe: the
server renders nothing, the client resolves after mount, and since the pill needs a 4 second dwell anyway
there is no flash. The snapshot is a boolean, so it needs no caching (unlike object-returning
`useSyncExternalStore` stores, which loop if the snapshot is not cached).

## Files touched

- `src/components/features/easter-eggs/kung-fu-easter-egg/kung-fu-easter-egg.tsx`: hotspot div becomes the
  `RedPillNoReflection` button, rendered conditionally.
- `src/components/features/easter-eggs/kung-fu-easter-egg/use-kung-fu-easter-egg-store.ts`: dwell timer,
  coarse-pointer and reduced-motion reads, per-tap pulse state, widened reset window. Store return type stays
  `ComponentStore<KungFuEasterEggState, KungFuEasterEggEffects>` with new fields on both halves.
- `src/components/design-system/hooks/use-coarse-pointer.ts` and `use-coarse-pointer.test.ts`: new.
- `src/app/css/pills.css`: the materialise keyframe animation.
- `src/test-utils/`: a `matchMediaMock(matches: boolean)` factory plus barrel export (see Test plan).
- `src/components/features/easter-eggs/kung-fu-easter-egg/kung-fu-easter-egg.test.tsx`: updated (see below).

No change to `easter-eggs-content.ts`, the atom, or `LayoutAdditionalContent`'s props.

## Test plan

`vitest.setup.ts` currently only imports jest-dom. There is no global `matchMedia` mock; the sole existing one
is inline in `install-prompt-banner.test.tsx:6-16` and hardcodes `matches: false`. This work needs a
*parameterised* mock (coarse and fine), so add a `matchMediaMock(matches)` factory to `src/test-utils/`
following the existing factory convention (`motionDivMock`, `nextLinkMock`) and export it from the barrel.
`useSyncExternalStore` only needs `matches`, `addEventListener`, and `removeEventListener`, so the existing
mock shape is sufficient.

New coverage:

- `use-coarse-pointer.test.ts`: returns true for coarse, false for fine, subscribes and unsubscribes.
- Pill absent before the dwell elapses, present after (fake timers).
- Pill never rendered on a fine pointer.
- The button exposes an accessible name, and that name is not `"I Know Kung Fu"`.
- Reduced motion renders at resting opacity with no animation class.

Existing tests that must change:

- `:60-65` asserts `aria-hidden="true"` on the hotspot. Now a labelled button, so this assertion inverts.
- The `tapHotspot` helper (`:45-50`) needs a preceding `revealPill()` step that mocks a coarse pointer and
  advances the dwell timer, since the target no longer exists at mount.
- `:89-101` advances 1500ms to prove the count resets. Becomes 2500ms.
- Konami-path tests (`:131-170`) and replay-pill tests (`:172-209`) should keep passing untouched, which is
  the regression signal that `activate()` was not disturbed.

Gates per `.claude/rules/testing.md`: `lint`, `validate-architecture`, `knip`, `typecheck`, `test:run`,
`build`. Coverage floor must not drop. Live QA on a real phone is the only way to confirm cause 2 is actually
fixed, since gesture interception does not reproduce in emulation.

## Accepted degradations

- **Android Chrome install-banner occlusion.** `use-install-prompt-banner-store.ts:54` computes
  `visible = isInstallable && cookieAccepted`, and the cookie banner shows while `!decided`, so the two
  banners are mutually exclusive and can never co-occupy the corner. `isInstallable` also requires a
  `beforeinstallprompt` event, which Safari has never implemented, so the install banner never appears on
  iPhone at all. Both banners are one-time and localStorage-persisted, so neither returns for a repeat
  visitor. In the residual case (Android Chrome, immediately after accepting consent) the pill is merely
  covered at `z-30` and self-heals when the banner is dismissed. Gating the reveal on banner state was
  considered and rejected as disproportionate: a *visible* pill behind a banner is self-explanatory, which is
  exactly what the invisible hotspot was not.
- **`MatrixRainControlPanel` covers the pill when open.** Correct behaviour for a panel the user deliberately
  opened.
- **The pill intercepts taps on content beneath it.** Inherent to any floating affordance. Mitigated by the
  corner placement and by looking like a control.
