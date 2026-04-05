# Chrome AI Summarizer - Design Spec

## Overview

Add TL;DR and Key Points summarization to blog posts using Chrome's built-in Summarizer API (Gemini Nano, on-device). The feature is progressive enhancement: completely hidden when the API or hardware is not available.

## Scope

### In scope
- TL;DR summary (1-5 sentences) and Key Points (bulleted list, 3-7 points) for blog posts
- Accordion toolbar with disclaimer and link to Chrome AI docs
- Summary displayed in a modal with streaming text
- Device capability detection to hide feature on low-end hardware
- Tracking on all interactive elements

### Out of scope
- Translation (future, separate effort)
- DSA and About Me sections (evaluate blog performance first)
- Server-side fallback
- Non-Chrome browsers

## Architecture

### New files

```
src/components/design-system/molecules/accordion/accordion.tsx         # Generic accordion component
src/components/design-system/atoms/loader/loader.tsx                   # Generic spinner/loader
src/components/design-system/molecules/terminal-progress-bar/terminal-progress-bar.tsx  # Reusable terminal-style progress bar
src/components/design-system/utils/hooks/use-device-capabilities.ts   # Device detection hook

src/components/sections/blog/hooks/use-chrome-summarize.ts         # Summarizer API hook
src/components/sections/blog/components/chrome-ai-features-toolbar.tsx  # Accordion + buttons
src/components/sections/blog/components/chrome-summary-modal.tsx   # Modal for summary result
```

### Modified files

```
src/types/configuration/tracking.ts                                # New tracking actions
src/components/design-system/utils/hooks/use-reduced-motions.ts    # Refactor to use useDeviceCapabilities
src/components/design-system/organism/reading-content-progress-bar.tsx  # Refactor to use TerminalProgressBar
src/components/sections/blog/components/blog-post-content.tsx      # Add toolbar to beforeContent
```

## Component Details

### 1. Accordion (design system)

`src/components/design-system/molecules/accordion/accordion.tsx`

- Generic, reusable accordion component
- `'use client'`
- Props: `title: ReactNode`, `children: ReactNode`, `defaultOpen?: boolean`, `className?: string`, `onToggle?: () => void`
- Animated expand/collapse with Framer Motion
- Chevron icon rotates on toggle

### 2. TerminalProgressBar (design system)

`src/components/design-system/molecules/terminal-progress-bar/terminal-progress-bar.tsx`

- Extracted from the inline rendering in `ContentProgressBar` (`reading-content-progress-bar.tsx`)
- Generic, reusable terminal-style progress bar with customizable messages
- Props:
  - `percentage: number` — 0-100
  - `loadingMessage: string` — shown while in progress (e.g., "Uploading knowledge...", "Downloading AI model...")
  - `completeMessage: string` — shown when done (e.g., "Transfer complete.", "Model ready.")
  - `shouldReduceMotion?: boolean` — controls cursor animation
- Renders the `getBar()` function output (`[████░░░░] 45%`) and status line using `TerminalLine`, `SuccessText`, `Cursor`
- `ContentProgressBar` is refactored to use this component instead of inline rendering, passing its own messages

### 3. Loader (design system)

`src/components/design-system/atoms/loader/loader.tsx`

- Simple spinner component, reusable
- Props: `size?: 'sm' | 'md' | 'lg'`, `className?: string`
- CSS animation (no Framer Motion needed for a spinner)
- Uses theme colors (primary-text / accent)

### 4. useDeviceCapabilities (design system)

`src/components/design-system/utils/hooks/use-device-capabilities.ts`

- Extracts `NavigatorWithDevice` interface and device detection logic from `useReducedMotions`
- Returns: `{ deviceMemory: number, cores: number, saveData: boolean, isLowEnd: boolean }`
- `isLowEnd`: `deviceMemory <= 2 || cores <= 2 || saveData` (same threshold as current `useReducedMotions`)
- Evaluated in `useEffect` with sensible defaults (memory: 4, cores: 4, saveData: false)
- Note: `isLowEnd` is used by `useReducedMotions` for animation gating. The summarizer hook reads `deviceMemory` directly from this hook to apply its own threshold (`< 8`), since the summarizer has stricter hardware requirements than animations

### 5. useReducedMotions (refactored)

`src/components/design-system/utils/hooks/use-reduced-motions.ts`

- Refactored to use `useDeviceCapabilities` instead of inline device detection
- Behavior unchanged: `!motionEnabled || isLowEnd`

### 6. useChromeSummarize

`src/components/sections/blog/hooks/use-chrome-summarize.ts`

- `'use client'` hook
- **Feature detection**: `'Summarizer' in self` checked in `useEffect`
- **Availability check**: calls `Summarizer.availability()` in `useEffect` to get model state (`unavailable | downloadable | downloading | available`)
  - `unavailable`: feature hidden entirely
  - `downloadable` / `downloading` / `available`: feature shown, handled on interaction
- **Device gate**: uses `useDeviceCapabilities` — hides feature if `deviceMemory < 8`
- **`isAvailable`**: `boolean` — true only if API exists, device is capable, and availability is not `unavailable`
- **`summarize(type: 'tldr' | 'key-points', text: string)`**: starts summarization
- **States**: `idle | downloading | loading | streaming | done | error`
- **`downloadProgress`**: `number` (0-100) — tracked during model download phase
- **`result`**: progressively updated string during streaming
- **Summarizer options**:
  - TL;DR: `{ type: 'tldr', format: 'markdown', length: 'long' }`
  - Key Points: `{ type: 'key-points', format: 'markdown', length: 'long' }`
- **Lazy creation with download monitoring**: `Summarizer.create()` is called on first button click, not on mount, to avoid unnecessary model downloads. Uses `monitor` callback to track `downloadprogress` events:
  ```typescript
  Summarizer.create({
    ...options,
    monitor(m) {
      m.addEventListener('downloadprogress', (e) => {
        setDownloadProgress(Math.round(e.loaded * 100));
      });
    }
  })
  ```
  - If model is already `available`, `downloading` state is skipped entirely
  - If model needs download, state transitions: `idle → downloading → loading → streaming → done`
  - Download only triggers with user activation (`navigator.userActivation.isActive`), which is guaranteed since it's called from a click handler
- Uses `summarizeStreaming()` for progressive output
- **Abort/cancellation**: uses `AbortController` to cancel in-flight streaming when:
  - The user closes the modal
  - The user starts a new summarization while one is in progress
  - The component unmounts
- **Result caching**: caches results in component state keyed by summary type, so repeated clicks for the same type on the same post don't re-run inference

### 7. ChromeAiFeaturesToolbar

`src/components/sections/blog/components/chrome-ai-features-toolbar.tsx`

- `'use client'`
- Uses `useChromeSummarize` — **renders nothing** if `isAvailable` is false
- Contains the Accordion with:
  - **Title**: "AI features"
  - **Subtitle/disclaimer inside accordion header**: "These features require [Chrome 138+](https://developer.chrome.com/docs/ai/built-in) and capable hardware to run" — link uses `StandardExternalLinkWithTracking`
  - **Body (expanded)**: two buttons — "TL;DR" and "Key Points"
- On button click:
  1. Extracts text via `document.getElementById(contentContainerId)?.innerText` (defensive null check — early return with error if element not found)
  2. Calls `summarize(type, text)`
  3. Opens `ChromeSummaryModal`
- **Server/client boundary note**: `BlogPostContent` is an async server component, but `ChromeAiFeaturesToolbar` is a `'use client'` component embedded in the `beforeContent` ReactNode prop — this is valid in Next.js. The `reading-content-container` div is rendered after `beforeContent` in the DOM, but is guaranteed to exist when the user clicks a button (user interaction happens after full hydration)
- Props: `contentContainerId: string`
- Tracking on: accordion toggle, TL;DR click, Key Points click, Chrome AI link click

### 8. ChromeSummaryModal

`src/components/sections/blog/components/chrome-summary-modal.tsx`

- Uses existing `Overlay` component (with `useLockBodyScroll`, backdrop blur, animations)
- Props: `title: string`, `content: string`, `status: 'downloading' | 'loading' | 'streaming' | 'done' | 'error'`, `downloadProgress: number`, `onClose: () => void`
- Layout:
  - Title: "TL;DR" or "Key Points"
  - Content area:
    - `downloading`: shows `TerminalProgressBar` with `loadingMessage="Downloading AI model..."`, `completeMessage="Model ready."`, and `percentage={downloadProgress}`
    - `loading`: shows `Loader` (model is ready, generating summary)
    - `streaming` / `done`: shows summary text
    - `error`: shows error message with Retry button
  - Close button (reuses `Button` from design system)
- Content rendered as plain text with `whitespace-pre-wrap` — the Summarizer output for TL;DR (paragraphs) and Key Points (bulleted list) is simple enough that a markdown library is unnecessary. If richer rendering is needed later, `react-markdown` can be added.
- Follows `ModalWithImage` pattern with Framer Motion variants (hidden → visible → exit)
- Must be wrapped in `AnimatePresence` in the parent component for exit animations to work
- **Error state**: shows a brief error message with a "Retry" button that re-triggers the summarization
- **Retry**: clears the cached result for that type and re-runs `summarize()`

## Accessibility

- **Accordion**: `aria-expanded` on trigger, `aria-controls` pointing to content panel, `role="region"` on panel
- **Modal**: focus trapped inside when open, `Escape` key closes it, focus returns to the trigger button on close
- **Streaming content**: `aria-live="polite"` on the content area so screen readers announce progressive updates
- **Loader**: `role="status"` with `aria-label="Loading summary"`
- **Buttons**: standard accessible buttons with descriptive text ("TL;DR", "Key Points", "Close", "Retry")

## Tracking

New entries in `src/types/configuration/tracking.ts`:

```typescript
// action:
toggle_chrome_ai_features: "toggle_chrome_ai_features"
chrome_ai_tldr: "chrome_ai_tldr"
chrome_ai_key_points: "chrome_ai_key_points"
open_chrome_ai_docs: "open_chrome_ai_docs"

// All use:
// category: tracking.category.blog_post
// label: tracking.label.body
```

## Integration

In `blog-post-content.tsx`, add `ChromeAiFeaturesToolbar` at the end of `beforeContent`, after `PostMeta`:

```tsx
beforeContent={
  <>
    <h1 className="leading-tight">{frontmatter.title}</h1>
    <PostAuthors ... />
    <PostMeta ... />
    <ChromeAiFeaturesToolbar contentContainerId="reading-content-container" />
  </>
}
```

The `contentContainerId` references the existing `reading-content-container` div in `ReadingContentPageTemplate`.

### 9. ContentProgressBar (refactored)

`src/components/design-system/organism/reading-content-progress-bar.tsx`

- Refactored to use `TerminalProgressBar` instead of inline `getBar()` / `getStatusLine()` rendering
- Passes `loadingMessage="Uploading knowledge..."`, `completeMessage="Transfer complete."`
- Behavior and appearance unchanged

## User Flow

### First time (model not downloaded)

1. User opens a blog post on Chrome 138+ desktop with capable hardware (8GB+ RAM)
2. Sees closed accordion "AI features" below date/reading time
3. Clicks accordion — expands showing disclaimer + TL;DR and Key Points buttons
4. Clicks "TL;DR" — modal opens with terminal progress bar: "Downloading AI model..." `[████░░░░] 45%`
5. Download completes — progress bar shows "Model ready.", transitions to Loader
6. Text streams in progressively as Gemini Nano generates the summary
7. User reads summary, closes modal via Close button or overlay click
8. Can repeat with "Key Points" — no download needed this time

### Subsequent uses (model already available)

1. User opens a blog post
2. Clicks accordion → clicks "TL;DR"
3. Modal opens with Loader (no download step)
4. Text streams in progressively
5. Closes modal

## Progressive Enhancement Strategy

The feature is completely invisible when any of these conditions is true:
- Browser does not have `Summarizer` in `self` (non-Chrome, Chrome < 138)
- Device memory < 8 GB (`navigator.deviceMemory`)
- The check runs client-side in `useEffect`, so SSR renders nothing (no hydration mismatch)
