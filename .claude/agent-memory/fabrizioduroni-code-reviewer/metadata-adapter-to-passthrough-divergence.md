---
name: metadata-adapter-to-passthrough-divergence
description: When a field-picking metadata adapter is replaced by raw frontmatter pass-through, check for extra MDX keys the adapter dropped AND whether any consumer serializes metadata wholesale
metadata:
  type: feedback
---

Replacing a field-picking `metadataAdapter` (that explicitly picks named keys like
`{technique, leetcodeUrl, difficulty}`) with a raw pass-through
(`fileParsed.data?.metadata as TMeta`) is behavior-preserving ONLY if two things hold.
Verify both before accepting such a refactor as inert:

1. **No content file carries an extra frontmatter metadata key the adapter dropped.**
   Enumerate distinct 2nd-level metadata keys per section with grep/awk across `src/content`.
   Example caught in the section-factory PR: one console (`nintendo-wii`) had a stray
   `formats: ["Physical"]` key the old `consoleMetadataAdapter` silently dropped; the
   new pass-through keeps it.

2. **No consumer serializes the metadata object wholesale.** In this repo the consumers
   are: search index (`search-index-factory.ts` — indexes only title/description/tags/
   authors/slug, NOT metadata), the markdown generators (`*-markdown.ts` — read NAMED
   fields like `metadata?.releaseYear`, never JSON.stringify the object), and the
   filesystem manifest (`filesystem-manifest-factory.ts` — title/description/slug only).
   Because all three read named fields, extra keys are inert and the divergence is safe.

**Why:** the divergence is only observable if an extra key is both present in content AND
serialized wholesale. If either is false, pass-through == adapter output. Confirming both
is what lets you clear the change instead of blocking on a theoretical difference.

**How to apply:** any PR that deletes content metadata adapters / normalizers in favor of
raw pass-through. Also flag the stray extra key as a non-blocking data-hygiene nit — it is
latent noise even when currently inert. Related: [[recharts-legend-text-color]] is a
different domain; this one is content-ingestion specific.
