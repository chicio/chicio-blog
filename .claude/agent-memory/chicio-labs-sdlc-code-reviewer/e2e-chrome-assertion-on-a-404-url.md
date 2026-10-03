---
name: e2e-chrome-assertion-on-a-404-url
description: an e2e that goto()s a URL and asserts Menu/Footer state must target a real page; app/not-found.tsx renders no site chrome, and /blog/author/fabrizio-duroni (the owner) 404s by design
metadata:
  type: feedback
---

When a new e2e spec navigates to a URL and then asserts site chrome (menu highlight, dropdown, footer links), check
the URL is actually generated. `apps/website/src/app/not-found.tsx` renders only MatrixRain + terminal + two pills: no
Menu, no Footer, so any chrome locator on a 404 resolves nothing and the assertion times out.

Known trap: the owner's author page `/blog/author/fabrizio-duroni` is filtered out of `generateStaticParams`
(`ownerAuthorId`, `dynamicParams = false`) and `blog.spec.ts` asserts it returns 404. Use a non-owner author
(`/blog/author/antonino-gitto`) to exercise the Authors `activePathPrefixes` highlight.

The converse is also weak: `toHaveURL(/\/x$/)` after a click passes on a 404 too, so it only proves the href, not that
the page exists (fine only if another spec covers the page).

**Why:** caught in a Unit Review where an implementer's "Blog dropdown stays highlighted on an author page" spec
pointed at the owner page; no Unit Check runs e2e, so it would only surface red at Full Checks.

**How to apply:** for every new `page.goto(...)` in a spec, confirm the route's static params include it (grep the
route's `generateStaticParams`/`dynamicParams` and existing specs asserting 404) before accepting a chrome assertion.
Related: [[e2e-selector-must-be-feature-unique]].
