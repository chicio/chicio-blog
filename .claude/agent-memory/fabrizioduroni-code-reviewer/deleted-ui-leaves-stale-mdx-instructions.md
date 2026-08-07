---
name: deleted-ui-leaves-stale-mdx-instructions
description: When a diff deletes an interaction step, grep src/content/**/*.mdx for prose that still instructs users to perform it — no gate can see stale instructions
metadata:
  type: feedback
---

Deleting a UI affordance (a button, a sound, an intermediate screen) does not delete the MDX prose
that tells readers to use it. Nothing catches this: lint/typecheck/depcruise/knip do not read prose,
and tests assert against the components, not the instructions.

**Why:** in the easter-egg standardization review, the diff deleted `neo-room-easter-egg` (its
"Knock, knock" `RedPillButton`) and `public/media/sounds/knock-knock.mp3`, but
`src/content/easter-egg-hunt/content.mdx` still told readers "Something will answer. Then… knock."
and listed "Follow the white rabbit, then knock, knock." as a solution step. Because that page is a
`contentRegistry` `mdxPage` with `searchable: true`, the wrong instructions also shipped into the
search index and into the `Accept: text/markdown` representation.

**How to apply:** for any diff that removes an interaction, grep `src/content/` for the removed
verb/noun (the sound name, the button label, the component name in prose form). Then confirm the
published markdown: after `npm run build`, read
`.next/server/app/markdown/<slug>.body` — it is the exact text agents and the search index consume.
Also worth checking `src/lib/content/**/*-content.ts` for hard-coded counts ("Four of them, for
now") when a diff changes how many of something exist.
