# There Is No Spoon: the chat becomes the only trigger

Date: 2026-07-25
Status: approved design, not yet implemented

## Problem

The "There Is No Spoon" easter egg is unreachable on touch devices, and the cause is a catch-22 in two lines of
code.

`use-spoon-easter-egg-store.ts` listens on `document` for `keydown`, buffers printable characters, and fires
when the buffer ends with the phrase. Before buffering anything it bails:

```ts
if (shouldIgnoreKeystroke(document.activeElement)) {
    return;
}
```

`shouldIgnoreKeystroke` (`src/lib/easter-eggs/input-focus-guard.ts`) returns true for `input`, `textarea`,
`select`, and any `contentEditable` element. On a phone there is no hardware keyboard, so focusing a text field
is the only way to raise one. The single action that lets you type is therefore the same action that guarantees
the egg ignores you. There is no sequence of gestures that reaches the egg on a phone.

The guard is correct for what it was written to do (it stops the contact form and the search box from silently
buffering the phrase). It just happens to close the only door touch users have.

## Decision

Delete the global `keydown` path entirely and make the AI chat the single trigger. On `/chat` you type
`there is no spoon` and send it. The chat intercepts the submission, never calls the LLM, and fires the
existing glitch and warp sequence unchanged.

Telling the machine the truth and watching reality bend instead of receiving an answer is a better beat than
typing at a page, and the chat input raises the soft keyboard by construction, so the catch-22 dissolves rather
than being worked around.

One trigger in one place also collapses the whole problem: no focus guard, no buffer, one code path, and one
honest hint.

### Why matching must read the input value, not keystrokes

A tempting smaller fix is to keep the `keydown` listener and relax the guard for allowlisted fields. Neither the
command palette store nor the terminal store calls `stopPropagation` on `keydown`, so keystrokes typed into
those inputs really do reach the document listener, and this would be a handful of lines.

It is rejected because it is unreliable on exactly the platform it is meant to fix. Android GBoard fires
`keydown` with `key: "Unidentified"` (keyCode 229) while composing predictive text, so a keystroke buffer cannot
be trusted on touch. Reading the submitted value can.

This is also why the white rabbit egg already works on a phone: `white-rabbit.tsx` matches on `query === "101"`,
the palette input's value, through the injected `searchEasterEgg` prop. Value matching is the established
touch-safe pattern in this codebase, and this design follows it.

## Non-goals

- **No second trigger surface.** The command palette search was the first candidate, and it is a good one: it is
  tap reachable everywhere through the always-visible search button in `menu.tsx`, and it is the same channel
  the white rabbit already uses. It lost to the chat on theme (you tell something that listens, rather than
  searching for a truth) and on the decision to have exactly one place rather than several. The `/terminal`
  shell was considered for the same reason and rejected for the same reason.
- **Gesture recognition is rejected**, unchanged from the kung fu spec: a global swipe recognizer sees every
  scroll flick on a scroll-heavy site, and horizontal swipes collide with the `image-carousel` drag and the iOS
  Safari edge back gesture.
- **Speech recognition is rejected**, despite the published hint literally saying "say that truth out loud".
  `SpeechRecognition` needs a microphone permission prompt, which fails the same test that killed shake in the
  kung fu spec: you cannot ask permission for a secret.
- **No press-and-hold gesture.** It was the parked candidate in the kung fu spec, but it abandons the phrase,
  which is the entire charm of this egg, and it needs a new visible target on every page.
- **No in-chat nudge.** No placeholder hint, no seeded example question. The hunt page is the discovery channel
  for all four eggs by design. This egg is becoming reachable, which is a different problem from being
  discoverable.
- **The focus guard is not kept "just in case".** `knip` gates CI, and the guard's only caller is disappearing.
  See Deletions.

## Design

### Mechanic

Matching reuses `matchesSpoonPhrase` with no change to its behaviour: normalized (lowercased, whitespace
stripped) and `endsWith` based. So `there is no spoon`, `THERE IS NO SPOON`, `thereisnospoon`, and
`what is the truth? there is no spoon` all fire, while `there is no fork` and `there is no spoonx` do not.

### Wiring

`handleSubmit` in `use-chat-store.ts` gains one guard. It goes after the existing `setInput("")` and before
`sendMessage`, so the input is already cleared by the time it returns:

```ts
if (trySpoonPhrase(messageText)) {
    return;
}
```

A new `src/lib/easter-eggs/spoon-activation.ts` owns both halves of the signal:

- `spoonActivationEvent`: the event name constant.
- `activateSpoonEasterEgg()`: dispatches the event on `window`, guarded by `typeof window !== "undefined"`.
- `trySpoonPhrase(text: string): boolean`: matches, activates on a match, and reports whether it fired.

The spoon store replaces its `keydown` effect with a listener for that event. It keeps its existing
`phase !== "idle"` guard, so activations arriving during a warp are ignored, and it keeps
`setPhase(reducedMotion ? "warping" : "glitching")` so the reduced-motion path is untouched.

Tracking moves from the deleted `keydown` handler into the activation handler, with the same category, label
`there_is_no_spoon`, and action. Putting it in the egg rather than in the chat means it fires once per
activation regardless of which channel ever activates it.

`src/lib/` is the correct home for the signal. The chat is a content page and the egg is a feature mounted from
`LayoutAdditionalContent`, so they share no component ancestor, but both layers may import `lib/`. There are two
in-repo precedents: `lib/consents/consents.ts` already dispatches a window event from `lib/`, and
`design-system/state/command-palette` already uses a window event for exactly this sibling-to-sibling signal
(`openCommandPalette`, dispatched by the menu and heard by the palette).

Keeping the phase machine in the egg's own store means the chat store gains one import and one branch, and no
egg timing logic. Keeping the phrase matching in `lib/` means the chat store has no opinion about what the
phrase is.

### Visual

The warp overlay moves from `z-40` to `z-60`. The chat input is a full-width bar pinned to the bottom at `z-50`
(`chat-input.tsx`), so at `z-40` the input bar and its send button would float on top of the 75% black overlay
and read as a rendering bug rather than a takeover. `z-60` is the existing top tier used by `lightbox.tsx`, and
the two cannot co-occur, since the lightbox opens from post images and the warp is now chat-only.

Nothing else about the sequence changes: `GLITCH_DURATION_MS` 400 on `document.body`, then `WARP_DURATION_MS`
5600 of clipped spoon-shaped rain, then back to idle. The overlay stays `pointer-events-none`, so the chat
remains usable underneath while it plays.

### Deletions

Dropping the global listener orphans real code. `knip` gates CI, so it is deleted rather than left in place:

- `src/lib/easter-eggs/input-focus-guard.ts` and `input-focus-guard.test.ts`. `shouldIgnoreKeystroke` has
  exactly one caller, the spoon store. The kung fu Konami listener never used it, so no other egg changes
  behaviour.
- `appendToSpoonPhraseBuffer` and `MAX_BUFFER_LENGTH` from `spoon-phrase-buffer.ts`, plus their tests. The only
  caller is the deleted `keydown` handler.
- `matchesSpoonPhrase` and `SPOON_PHRASE` survive, which leaves a file named for a buffer that no longer
  contains one, so `spoon-phrase-buffer.ts` is renamed to `spoon-phrase.ts` (with its test).

This removes roughly 50 lines of fully covered pure `lib/` code, which moves the aggregate coverage ratio. The
floor in `vitest.config.ts` must not be lowered: if the ratio drops below it, the answer is to add tests, not to
relax the gate.

### Copy

`src/content/easter-egg-hunt/content.mdx` currently tells readers to type the phrase "anywhere on a page" and
twice warns them to stay out of inputs and search boxes. After this change both statements are false, and the
second is the exact opposite of the truth. The riddle keeps its shape (a clue, not an instruction) and the
`EggSolution` block carries the specifics, matching how the other three eggs are documented.

Riddle:

> A boy once warned Neo never to try bending it. Instead, only try to realize a simple truth about it. Then find
> the one thing on this site that answers when you talk to it, and tell it that truth.

Solution:

- Open the chat, from the menu or the command palette.
- Type there is no spoon and send it.
- Case and spacing do not matter, and the phrase can end a longer sentence.

No change to `easterEggHuntIntroLines` or to the egg count.

## Files touched

- `src/lib/easter-eggs/spoon-activation.ts` and `spoon-activation.test.ts`: new.
- `src/lib/easter-eggs/spoon-phrase-buffer.ts` renamed to `spoon-phrase.ts`, buffer functions removed.
- `src/lib/easter-eggs/input-focus-guard.ts` and its test: deleted.
- `src/components/features/easter-eggs/spoon-easter-egg/use-spoon-easter-egg-store.ts`: `keydown` effect and
  `bufferRef` replaced by an activation-event listener; tracking moves here. Return type stays
  `StateStore<SpoonEasterEggState>` with the same two fields.
- `src/components/features/easter-eggs/spoon-easter-egg/spoon-easter-egg.tsx`: `z-40` becomes `z-60`.
- `src/components/content/chat/chat/use-chat-store.ts`: one guard in `handleSubmit`.
- `src/content/easter-egg-hunt/content.mdx`: riddle and solution rewritten.
- `vitest.config.ts`: route the new activation test to the jsdom project (see Test plan).
- Tests listed below.

No change to the chat API route, to `guardrails.ts`, to `ChatInput`, to `LayoutAdditionalContent`, to the
command palette, or to the spoon warp animation itself.

## Test plan

`spoon-activation.ts` touches `window`, and `src/lib/**/*.test.ts` runs in the node project where `window` is
undefined. `vitest.config.ts` already handles this case: six browser-API lib folders are listed in the node
project's `exclude` and re-included under the jsdom project. This follows that pattern with a file-level glob
for `spoon-activation.test.ts` specifically, so the pure phrase tests stay in node rather than migrating the
whole `easter-eggs` folder to jsdom.

New coverage:

- `spoon-activation.test.ts`: dispatches the event and returns true on a match; dispatches nothing and returns
  false otherwise; tolerant of case, spacing, and a trailing-phrase sentence.
- Chat store: submitting the phrase does not call `sendMessage` and clears the input; submitting a normal
  message still calls `sendMessage`; leading and trailing whitespace does not prevent a match (`normalize`
  strips all whitespace, so no explicit trim is needed on the matching path).
- Spoon egg: an activation event moves it to glitching then warping; a second event during a warp is ignored;
  reduced motion goes straight to warping.

Existing tests that must change:

- `spoon-easter-egg.test.tsx`: the helper that types `SPOON_PHRASE` one character at a time through `keydown`
  goes away, replaced by dispatching the activation event. The focus-guard case (typing while an input is
  focused) is deleted along with the guard.
- `spoon-phrase-buffer.test.ts`: renamed, and the `appendToSpoonPhraseBuffer` blocks plus the
  character-at-a-time build-up case are removed. The `matchesSpoonPhrase` cases stay as the regression signal
  that matching behaviour did not shift.
- `e2e/chat.spec.ts` already route-mocks the chat API, so add a case asserting the phrase produces the warp and
  triggers no API call.

Gates per `.claude/rules/testing.md`: `lint`, `validate-architecture`, `knip`, `typecheck`, `test:run`, `build`,
and `test:e2e` (the chat spec changes). `knip` matters more than usual here: it is what proves the deletions are
complete. Live QA on a real phone confirms the actual fix, since the whole point is a device where the previous
trigger could not be reached.

## Accepted degradations

- **The egg is now page-scoped.** It fires only on `/chat`, where before it fired anywhere on the site for
  desktop users. That reach is deliberately traded for a single trigger that works on every device. The hunt
  page and the palette's "Open chat" action both lead there.
- **The phrase is not sent to the LLM and is not echoed into the transcript.** The input clears, the screen
  glitches, the warp plays. An answer would compete with the warp for attention, and there is nothing to answer.
- **No device gating.** The chat path works with a hardware keyboard too, so there is one code path and one hint
  for everyone.
- **Repeat triggering is cheap.** Anyone who knows the phrase can replay the warp by sending it again. It is a
  6 second overlay on a page they navigated to on purpose, so no throttle beyond the existing `idle` guard.

## Note for the kung fu spec

`2026-07-25-kung-fu-pill-mobile-trigger-design.md` places the red pill at `bottom-right z-30`. On `/chat` the
chat input is a full-width bar pinned to the bottom at `z-50`, so the pill will render behind it on that route
specifically. That belongs in the kung fu spec's accepted degradations, which currently lists the banners and
the rain panel but not the chat bar. Out of scope here, but it should not be discovered during implementation.
