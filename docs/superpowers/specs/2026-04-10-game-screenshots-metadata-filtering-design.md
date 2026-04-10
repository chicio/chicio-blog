# Game Screenshots: Metadata-Based Filtering

**Date:** 2026-04-10
**Status:** Approved
**Scope:** `scripts/add-game-screenshots.py`

## Problem

The `add-game-screenshots.py` script currently uses only the game `title` from frontmatter to search for screenshots on IGDB and Wikimedia Commons. This leads to imprecise results — for example, searching "Final Fantasy VII" on IGDB may return the PS5 remake instead of the PS1 original. The frontmatter already contains rich metadata (notably `metadata.console`) that can be used to disambiguate.

## Solution

Use `title` and `metadata.console` from the frontmatter to refine screenshot searches across all sources. An interactive console-to-IGDB-platform mapping phase runs at script startup so the user confirms the correct platform ID for each console.

## Design

### 1. Frontmatter Parsing with `python-frontmatter`

Replace the regex-based `parse_frontmatter_title()` with a new `parse_frontmatter_metadata()` function that uses the `python-frontmatter` library. Returns a dataclass:

```python
@dataclass
class GameMetadata:
    title: str
    console: str  # metadata.console value, e.g. "PlayStation 5"; empty string if missing
```

If `metadata.console` is absent from the frontmatter, `console` defaults to `""`. Downstream code treats empty console the same as `None` platform ID: IGDB queries use title-only search, Wikimedia queries omit the console name.

The `python-frontmatter` dependency is declared in a PEP 723 inline script metadata block (`# /// script`) which must be created at the top of the file. The script's existing `urllib`-based HTTP pattern is used for all new network calls (no `requests` dependency).

`parse_frontmatter_title()` is deleted; all its call sites (in `process_game_folder()`) are replaced by `parse_frontmatter_metadata()`.

### 2. Interactive Platform Mapping Phase

At startup, before processing any game:

1. **Collect unique consoles** — scan all relevant `content.mdx` files and extract distinct `metadata.console` values via `parse_frontmatter_metadata()`.
2. **Fetch IGDB platforms** — single bulk query to `/v4/platforms` (`fields id, name; limit 500;`). IGDB has ~200 platforms, fits in one request. The full list is fetched once and kept in memory.
3. **Interactive prompt** — for each unique console, the full platform list is filtered locally by case-insensitive substring match on the console name words, then displayed as a numbered list. The user picks the correct one or types `s` to skip.

Example interaction:

```
🎮 Mapping consoles to IGDB platforms...

Console: "PlayStation 1"
  1) PlayStation (ID: 7)
  2) PlayStation 2 (ID: 8)
  3) PlayStation 3 (ID: 9)
Choose [number/s to skip]: 1

Console: "Game Boy"
  1) Game Boy (ID: 33)
  2) Game Boy Color (ID: 22)
  3) Game Boy Advance (ID: 24)
Choose [number/s to skip]: 1
```

Result: `dict[str, int | None]` mapping each `metadata.console` to an IGDB platform ID (or `None` if skipped).

**No persistence** — the mapping is rebuilt every run to stay current with IGDB data.

**No IGDB credentials** — if `IGDB_CLIENT_ID`/`IGDB_CLIENT_SECRET` are not configured, the interactive phase is skipped entirely; platform ID is `None` for all consoles. Wikimedia queries still use `metadata.console`.

**Platform fetch failure** — if credentials are present but the `/v4/platforms` call fails (network error, invalid credentials), the error is printed to stderr and the interactive phase is skipped. All consoles get `None` as platform ID (same as no-credentials behavior). The script continues with title-only IGDB search.

### 3. Refined Search Queries

**IGDB** — `collect_igdb_candidates()` receives the platform ID. The search query becomes:

```
search "Final Fantasy VII"; fields id, name; where platforms = (7); limit 5;
```

If platform ID is `None` (skipped or no credentials), behavior is unchanged (title-only search).

**Wikimedia Commons** — `collect_wikimedia_candidates()` receives the console name. The primary search query becomes:

```
"Final Fantasy VII PlayStation 1 gameplay screenshot"
```

If console is empty (missing from frontmatter), the primary query remains title-only as today: `"Final Fantasy VII gameplay screenshot"`. The secondary fallback query is always title-only (`"Final Fantasy VII screenshot"`) to avoid over-restricting when results are scarce.

### 4. Single-Game vs Batch Mode

**Batch mode (`--all-games`):**
- Console collection scans all `content.mdx` files under `--videogames-root`
- Interactive mapping happens once before the game processing loop
- The mapping dict is passed to each `process_game_folder()` call

**Single-game mode (`--game-folder`):**
- Console collection reads only the target game's `content.mdx`
- Interactive mapping runs with just one console to map
- Same UX, shorter interaction

**Dry-run:** The interactive phase still runs (needed to determine which images would be selected). Only downloads and MDX writes are skipped.

### 5. Changes Summary

All changes are in `scripts/add-game-screenshots.py` — no new files.

| Change | Description |
|--------|-------------|
| Inline dependency | Add `python-frontmatter` to `uv run --script` metadata |
| `GameMetadata` dataclass | Holds `title` and `console` |
| `parse_frontmatter_metadata()` | Replaces `parse_frontmatter_title()`, uses `python-frontmatter` |
| `collect_unique_consoles()` | Scans content.mdx files, returns unique `metadata.console` values |
| `fetch_igdb_platforms()` | Queries `/v4/platforms`, returns list of `(id, name)` |
| `interactive_platform_mapping()` | Prompts user per console, returns `dict[str, int \| None]` |
| `collect_igdb_candidates()` | New param `platform_id`, adds `where platforms = (ID)` to query |
| `collect_wikimedia_candidates()` | New param `console_name`, adds console name to primary search query |
| `process_game_folder()` | New param `platform_mapping: dict[str, int \| None]` (added alongside existing `igdb_client_id`/`igdb_access_token`), uses `parse_frontmatter_metadata()` |
| `main()` | Adds bootstrap phase (collect consoles → fetch platforms → interactive mapping) |
| Docstring | Documents interactive phase, `python-frontmatter` dependency, `uv run --script` usage |
