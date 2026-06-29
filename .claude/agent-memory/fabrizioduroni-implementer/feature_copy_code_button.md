---
name: Copy-to-clipboard code block button
description: Architecture decisions and learned pitfalls from building the copy button on every MDX code block
type: project
---

Automatic copy button on every MDX code block, wired via the `pre` mapping in `src/mdx-components.tsx`.

**Files**:
- `src/components/design-system/molecules/code/code-block.tsx` — wrapper around `<pre>`, owns the `useRef<HTMLPreElement>` and renders the button
- `src/components/design-system/molecules/code/copy-code-button.tsx` — button with three states: default, copied (green), error (red); 2-second timeout to reset
- `src/components/design-system/atoms/icons/copy-icon.tsx` — icon atom

**Why:** Convenience for readers copying code samples from blog and DSA content.

**How to apply:** If copy-button behaviour needs changing, the three-state machine lives entirely in `CopyCodeButton`; layout changes live in `CodeBlock`.

---

## Key decisions and pitfalls

### Text extraction — use DOM, not React element tree
First attempt used `extractTextFromReactNode` to walk the React element tree recursively. This is fragile because it depends on React internals and element shapes. Replaced with `useRef<HTMLPreElement>` + `preRef.current.textContent`, which reads the real DOM after render. Simpler and robust to future MDX/plugin changes.

### Hydration mismatch — use `useEffect` to gate the button
An initial `if (typeof navigator === "undefined") return null` guard caused an SSR/client mismatch (server rendered nothing, client rendered the button on first paint). Fix: render `null` on both server and first client render, then use `useEffect` to set a mounted flag and show the button only after hydration completes.

### Mobile layout — flex column, not absolute overlay
The absolutely positioned overlay button overlapped code on narrow viewports. Fix: `flex flex-col` on mobile so the button appears in a bottom bar below the code block; `sm:block` with `sm:absolute` restores the overlay on desktop.

### CSS border ownership
Border and shadow styling must live on the `#code-block` wrapper `<div>`, not on the `<pre>` element, to avoid double borders when the two are composed together.

### Clipboard unavailability — hide, don't silently fail
When `navigator.clipboard` is unavailable (non-HTTPS or certain browsers) the button is hidden entirely rather than showing a disabled state. If `writeText` rejects at runtime (e.g., permission denied), the button shows the red error icon for 2 seconds then resets.

### No hover gating
Fabrizio explicitly chose always-visible button over a hover show/hide interaction — applies to both mobile and desktop.
