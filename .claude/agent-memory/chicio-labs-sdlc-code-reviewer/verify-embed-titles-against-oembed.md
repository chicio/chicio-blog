---
name: verify-embed-titles-against-oembed
description: Newly authored video/iframe accessible names must be checked against the video's own oembed title and the embed's position in the prose
metadata:
  type: feedback
---

When a diff authors or rewrites a `<Youtube title="...">` accessible name, do not stop at "is it distinct" or
"does it sound plausible". Check it two ways:

- **The video's own title**, via oembed: `https://www.youtube.com/oembed?url=...&format=json` returns `title`
  and `author_name`. On this blog the older embeds are Fabrizio's own uploads, so his title is authoritative
  about what the clip demonstrates (e.g. "React Native multiple debugger" / "React Native single debugger").
- **Where the embed sits in the prose.** A symptom described in a bullet *after* the embed, especially one that
  has its own screenshot, is almost certainly not in the video: the screenshot exists because the video did not
  cover it. Only the bullets immediately *preceding* the embed are safe to describe.

**Why:** an accessible name that misdescribes its video is the exact defect the `Youtube` title work set out to
fix (a single hardcoded title on 20+ embeds). Shipping a freshly authored inaccurate one in the same change
reintroduces the bug class, and no gate can see it. oembed also doubles as the dead-embed check.

**How to apply:** treat an accessible name asserting content the video does not contain as blocking, same as any
other factual claim. Prefer names built only from the pre-embed prose. Also worth checking the *plan's* literal
title instruction against oembed: on the 2017 RCTRootView post the plan prescribed one string for both embeds,
but the second video is actually titled "single debugger", so the plan itself was wrong for that call site.

Related: [[fact-sheet-drift-intent-and-authorship]].
