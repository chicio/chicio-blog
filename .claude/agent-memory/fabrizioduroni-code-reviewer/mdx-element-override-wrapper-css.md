---
name: mdx-element-override-wrapper-css
description: When a global mdx-components override wraps an element in a new tag (e.g. img -> button>img), verify existing content CSS uses descendant not child selectors, and that the element is never used inline
metadata:
  type: feedback
---

When a global `mdx-components.tsx` element override wraps the native element in a new tag
(e.g. `img: LightboxImage` renders `<button><img></button>`), the layout-regression risk is in
the existing content CSS, not the component.

**Why:** `src/app/css/globals.css` styles content images via `#reading-content-container figure img`
(a DESCENDANT selector) — it survives an intermediate `<button>` wrapper unchanged. A CHILD selector
(`figure > img`) would have broken. The blast radius of an element override is "which CSS selectors
targeting that element are child-combinator vs descendant."

**How to apply:** for any global MDX element override that adds a wrapper, grep globals.css for that
element and confirm (1) selectors are descendant (` img`) not child (`> img`), and (2) the element is
never used inline in content — `@microflash/rehype-figure` converts only block images (image alone on
its line) to `<figure>`; a truly inline image (text on the same line as `![...]`) would get a
`block w-full` wrapper and reflow. Verify with `grep -rn '[^ ]!\[' src/content` returning nothing.
Both held for the global lightbox; a future override of a smaller/inline element (code, span) needs
the same two checks. Related: [[replacestate-does-not-swap-route]].
