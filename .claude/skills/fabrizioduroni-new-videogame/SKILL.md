---
name: fabrizioduroni-new-videogame
description: "Use when adding a new videogame entry to an existing console in the videogames collection"
user_invocable: true
---

# New Videogame Entry

Bootstrap a new game entry under `src/content/videogames/console/<console>/game/<slug>/`.

## Steps

### 1. Check IGDB Credentials

Before collecting any input, verify `.env.others` exists and contains `IGDB_CLIENT_ID` and `IGDB_CLIENT_SECRET`.
If missing, **stop** and ask the user to add them. Do not proceed without credentials.

### 2. Gather Information

Ask the user for all of these:

1. **Game title** (e.g., "Elden Ring")
2. **Console** — must be one of the existing console slugs:
   - `gameboy` (Game Boy)
   - `nintendo-ds-lite` (Nintendo DS Lite)
   - `nintendo-entertainment-system` (Nintendo Entertainment System)
   - `nintendo-switch` (Nintendo Switch)
   - `nintendo-wii` (Nintendo Wii)
   - `playstation-portable` (PlayStation Portable)
   - `playstation1` (PlayStation 1)
   - `playstation2` (PlayStation 2)
   - `playstation3` (PlayStation 3)
   - `playstation4` (PlayStation 4)
   - `playstation5` (PlayStation 5)
3. **Developer** (e.g., "FromSoftware")
4. **Publisher** (e.g., "Bandai Namco Entertainment")
5. **Genre** — title-cased (e.g., "Action RPG", "Platformer")
6. **PEGI rating** — one of: 3, 7, 8, 12, 16, 18
7. **Region** — PAL or NTSC
8. **Formats** — Physical, Digital, or both
9. **Release year** (e.g., "2022")
10. **Acquired year** (default: current year)

### 3. Validate

- **Console exists**: verify `src/content/videogames/console/<console>/` directory exists. If not, abort with the list above.
- **Game does not exist**: verify `src/content/videogames/console/<console>/game/<slug>/` does NOT exist. If it does, abort.
- Derive the **slug** from the title: lowercase, hyphens for spaces, strip special characters (e.g., "Elden Ring" -> `elden-ring`).

### 4. Derive Fields

From the collected inputs, derive:

| Field | Value |
|---|---|
| `slug` | Title in kebab-case |
| `description` | `"{title} is a/an {genre-lowercase} game developed by {developer} for the {consoleName}"` — use "an" before vowel sounds (e.g., "an action RPG"), "a" otherwise (e.g., "a platformer"). Genre in lowercase. |
| `date` | Today's date (YYYY-MM-DD) |
| `image` | `/images/content/videogames/console/{console}/game/{slug}/cover.jpg` |
| `tags` | `[{console-slug}, game, {genre-lowercase}]` |
| `authors` | `[fabrizio_duroni]` |
| `metadata.console` | Console display name from mapping (e.g., "PlayStation 5") |
| `metadata.gallery` | 3 placeholder paths: `/images/content/videogames/console/{console}/game/{slug}/media/N.jpeg` for N=1,2,3 |

**Console slug to display name mapping:**

| Slug | Display Name |
|---|---|
| `gameboy` | Game Boy |
| `nintendo-ds-lite` | Nintendo DS Lite |
| `nintendo-entertainment-system` | Nintendo Entertainment System |
| `nintendo-switch` | Nintendo Switch |
| `nintendo-wii` | Nintendo Wii |
| `playstation-portable` | PlayStation Portable |
| `playstation1` | PlayStation 1 |
| `playstation2` | PlayStation 2 |
| `playstation3` | PlayStation 3 |
| `playstation4` | PlayStation 4 |
| `playstation5` | PlayStation 5 |

### 5. Create Directory Structure

```
src/content/videogames/console/<console>/game/<slug>/
    images/
        media/
```

Create the directories. The `images/gameplay/` folder will be created by the screenshot script.

### 6. Create content.mdx

Write `content.mdx` with **only the frontmatter** — no MDX body yet. The Gameplay section will be added by the screenshot script in step 7.

```mdx
---
title: "<title>"
description: "<description>"
date: YYYY-MM-DD
image: /images/content/videogames/console/<console>/game/<slug>/cover.jpg
tags: [<console-slug>, game, <genre-lowercase>]
authors: [fabrizio_duroni]
metadata:
    formats: ["<format1>", "<format2>"]
    releaseYear: "<releaseYear>"
    acquiredYear: "<acquiredYear>"
    developer: "<developer>"
    publisher: "<publisher>"
    console: "<consoleName>"
    genre: "<genre>"
    pegiRating: "<pegiRating>"
    region: "<region>"
    gallery:
        - /images/content/videogames/console/<console>/game/<slug>/media/1.jpeg
        - /images/content/videogames/console/<console>/game/<slug>/media/2.jpeg
        - /images/content/videogames/console/<console>/game/<slug>/media/3.jpeg
---
```

**Formatting rules:**
- 4-space indentation for metadata fields
- String values in double quotes
- `formats` is a YAML array: `["Physical"]`, `["Digital"]`, or `["Physical", "Digital"]`
- `gallery` is a YAML block sequence (one path per line with `-` prefix)
- No blank line between `---` and body content

### 7. Run Screenshot Script

Run the `add-game-screenshots.py` script to download gameplay screenshots and add the Gameplay section to the MDX:

```bash
uv run --script .claude/skills/fabrizioduroni-new-videogame/add-game-screenshots.py \
    --game-folder src/content/videogames/console/<console>/game/<slug>
```

The script:
- Downloads gameplay screenshots from Wikimedia Commons and/or IGDB
- Saves them to `<game>/images/gameplay/` as numbered JPEGs
- Adds the `## Gameplay` section with `ImageCarousel` component and imports to `content.mdx`

**If the script fails** (no screenshots found, network error): the entry is still valid. Inform the user the Gameplay section was not added and they can re-run the script later.

### 8. Summary

Print what was created and what the user needs to do manually:

**Created:**
- `src/content/videogames/console/<console>/game/<slug>/content.mdx`
- `src/content/videogames/console/<console>/game/<slug>/images/gameplay/` (with screenshots, if script succeeded)
- `src/content/videogames/console/<console>/game/<slug>/images/media/` (empty)

**Manual TODOs:**
- Add `cover.jpg` to `<slug>/images/` (game box art / cover image)
- Add 3 photos to `<slug>/images/media/` named `1.jpeg`, `2.jpeg`, `3.jpeg` (photos of the physical game)
- If more or fewer than 3 media photos: update the `metadata.gallery` array in `content.mdx`
- Run `npm run dev` to verify the page renders at `/videogames/console/<console>/game/<slug>`
