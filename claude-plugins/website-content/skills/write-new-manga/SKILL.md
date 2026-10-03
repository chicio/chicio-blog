---
name: write-new-manga
description: "Use when adding a new Manga (one series Fabrizio collects) to the manga collection, or when processing the shelf photos of an existing one"
user_invocable: true
---

# New Manga Entry

Bootstrap a new Manga under `apps/website/src/content/manga/<slug>/`. A **Manga** is one series, never one Volume: a
series is a single entry however many **Volumes** are on the shelf (see the Website glossary,
`apps/website/GLOSSARY.md`). Facts are verified, never invented, and the plot summary is original.

## Steps

### 1. Gather Information

Ask the user for:

1. **Title** as it should appear on the site (e.g. "Demon Slayer: Kimetsu no Yaiba", "Death Note Complete Edition").
   The title names the edition when the edition is what he owns.
2. **Edition** (e.g. "Standard Edition", "Complete Edition", "Deluxe"), the **edition publisher** (e.g. "Star Comics")
   and the **language** (e.g. "Italian").
3. **Volumes in the edition** and **Volumes owned** (numbers). Volumes in the edition is the count of the edition he
   buys, which is NOT always the Japanese count AniList reports.
4. **Acquired year** (default: the current year).
5. Optional `--cover <url>`: the cover of the edition he owns. Ask for the publisher or shop page when he has it.

### 2. Validate

- Derive the **slug** from the title: lowercase, hyphens for spaces, strip special characters
  ("Death Note Complete Edition" -> `death-note`, use the series name without the edition wording when that reads
  better, and confirm it with the user).
- `apps/website/src/content/manga/<slug>/` must NOT exist. If it does, abort.
- Never create a `media/` folder directly under `apps/website/src/content/manga/`: every sub-folder there is read as a
  Manga, so a stray folder makes the build fail.

### 3. Fetch the facts and the cover

```bash
uv run --script claude-plugins/website-content/skills/write-new-manga/fetch-manga.py \
    --title "<series title>" \
    --folder apps/website/src/content/manga/<slug> \
    [--cover-url <edition cover url>]
```

The script queries the AniList GraphQL API (no key needed), prints the facts as JSON and saves the cover, resized and
without metadata, as `<slug>/media/cover.jpg`. Cover preference: the cover of the edition he owns (publisher or shop
page, via `--cover-url`), else AniList's.

What AniList gives: status, serialization years, genres, story and art authors. What it does NOT give, and must be
verified on the publisher page or another reliable source, never guessed: **original publisher**, **magazine**,
**demographic**. If a fact cannot be verified, ask the user instead of writing it. Check the edition facts (Volume
count, publisher, language) against the publisher or shop page the user gave.

### 4. Create content.mdx

```mdx
---
title: "<title>"
description: "<one sentence: what the series is, and the edition he owns with the Volumes count>"
date: YYYY-MM-DD
image: /media/content/manga/<slug>/cover.jpg
tags: [manga, <demographic-lowercase>, <slug>]
authors: [fabrizio_duroni]
metadata:
    storyBy: ["<name>"]
    artBy: ["<name>"]
    originalPublisher: "<publisher>"
    magazine: "<magazine>"
    serializationStartYear: "<year>"
    serializationEndYear: "<year>"
    demographic: "<demographic>"
    genres: ["<genre>", "<genre>"]
    status: "<Completed | Ongoing>"
    edition: "<edition>"
    editionPublisher: "<publisher>"
    language: "<language>"
    volumes: <number>
    volumesOwned: <number>
    acquiredYear: "<year>"
---

import { FaBookOpen } from "react-icons/fa";
import { ParagraphTitleWithIcon } from "matrix-design-system";
import { ImageCarousel } from "@/components/features/design-system-next/image-carousel";

<ImageCarousel
    images={[
        "/media/content/manga/<slug>/cover.jpg",
    ]}
    alt="<title> on the shelf"
    className="mb-6"
/>

<MangaInformation />

## <ParagraphTitleWithIcon icon={<FaBookOpen className="text-shadow-lg" />}>Plot</ParagraphTitleWithIcon>

<original, spoiler-free plot summary>
```

Rules:

- `date` is today (YYYY-MM-DD). Years and `acquiredYear` are quoted strings; `volumes` and `volumesOwned` are numbers.
- `serializationEndYear` is left out for an ongoing series, and `status` is then `"Ongoing"`.
- `storyBy` and `artBy` are lists: a series with two authors (one writing, one drawing) has one name in each. A
  single author who does both is in both lists.
- 4-space indentation in the frontmatter, double-quoted strings, one blank line between the closing `---` and the body
  imports, and one blank line between each block of the body.
- Facts live in the frontmatter, everything a reader looks at lives in the body (ADR-0002): there is no `gallery` in the
  frontmatter. The photos are the `<ImageCarousel>` written literally in the body, before the Plot. While there are no
  shelf photos it lists the cover alone, which is what the block above writes. `<MangaInformation />` (no props, no
  import) comes right after the carousel: the page binds it to the frontmatter facts, so the pills follow the photos.
- **Plot summary**: a short, ORIGINAL, spoiler-free paragraph written from the premise alone. Never copy or lightly
  reword AniList, the publisher or a shop blurb (their descriptions are only reference material). No dashes in prose
  (use commas, colons or parentheses).

### 5. Shelf photos (now or later)

When the user drops photos in `apps/website/src/content/manga/<slug>/media/gallery/` (jpg, jpeg or png; export HEIC
first), process them:

```bash
uv run --script claude-plugins/website-content/skills/write-new-manga/process-manga-photos.py \
    --manga-folder apps/website/src/content/manga/<slug>
```

It rotates by EXIF, re-encodes WITHOUT metadata (so EXIF and GPS never reach the repository), resizes to 1600px,
renames them `1.jpeg`, `2.jpeg`, ... in natural order (2 before 10), deletes the originals and rewrites the `images`
list of the `<ImageCarousel>` in the body of `content.mdx`: from the first photo on the carousel lists the shelf photos
alone, the cover is no longer in it (it stays the `image` of the card and the page). Files already named `N.jpeg` are
earlier output: they are kept as they are, never re-encoded, and new photos are numbered after them. The EXIF
orientation sometimes lies: look at the results, and when one is sideways, drop the original again and pass
`--rotate <original file name>=<degrees>` (or rotate that one by hand). The photos are Fabrizio's: do not invent or
generate any.

### 6. Verify and summarize

- `npm run dev`, then check `/manga/<slug>` and that the card appears on `/manga`.
- The Content Registry, sitemap, search index, Markdown Representation, llms.txt and Terminal manifest pick the new
  entry up on their own: nothing else to register.
- MCP `get_manga` and the `get_site_stats` counts read the same section, so they follow too.

Print what was created (the folder, `content.mdx`, `media/cover.jpg`) and the manual TODOs: add shelf photos (then step
5), and re-check facts that could not be verified.
