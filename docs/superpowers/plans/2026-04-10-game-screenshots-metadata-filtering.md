# Game Screenshots Metadata-Based Filtering — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve `scripts/add-game-screenshots.py` to use frontmatter metadata (`title` + `metadata.console`) for more precise screenshot searches on IGDB and Wikimedia Commons, with an interactive console-to-platform mapping phase at startup.

**Architecture:** Single-file modification. A bootstrap phase at startup collects unique console names from content files, fetches IGDB platforms, and interactively maps consoles to platform IDs. The mapping is then threaded through to IGDB (platform filter) and Wikimedia (console name in query) search functions.

**Tech Stack:** Python 3, `python-frontmatter` (PEP 723 inline dep), `urllib` (existing), IGDB API v4, Wikimedia Commons API.

**Spec:** `docs/superpowers/specs/2026-04-10-game-screenshots-metadata-filtering-design.md`

---

## File Structure

All changes are in a single file:

- **Modify:** `scripts/add-game-screenshots.py` — add PEP 723 metadata, new dataclass, new functions, update existing functions and docstring

---

## Chunk 1: Foundation — PEP 723 metadata, GameMetadata dataclass, parse_frontmatter_metadata

### Task 1: Add PEP 723 inline script metadata

**Files:**
- Modify: `scripts/add-game-screenshots.py:1-2`

- [ ] **Step 1: Add PEP 723 block after the shebang line**

Insert the inline script metadata block between the shebang and the docstring:

```python
#!/usr/bin/env python3
# /// script
# requires-python = ">=3.12"
# dependencies = [
#     "python-frontmatter",
# ]
# ///
"""
add-game-screenshots.py
...
```

- [ ] **Step 2: Add `import frontmatter` to the imports section**

Add after the existing `from pathlib import Path` import (line 83):

```python
import frontmatter
```

- [ ] **Step 3: Verify the script still parses**

Run: `python3 -c "import ast; ast.parse(open('scripts/add-game-screenshots.py').read()); print('OK')"`
Expected: `OK`

- [ ] **Step 4: Commit**

```bash
git add scripts/add-game-screenshots.py
git commit -m "feat(scripts): add PEP 723 metadata with python-frontmatter dependency"
```

### Task 2: Add GameMetadata dataclass and parse_frontmatter_metadata()

**Files:**
- Modify: `scripts/add-game-screenshots.py`

- [ ] **Step 1: Add the GameMetadata dataclass**

Add after the existing `SelectedScreenshot` dataclass (after line 127):

```python
@dataclass
class GameMetadata:
    title: str
    console: str
```

- [ ] **Step 2: Add parse_frontmatter_metadata() function**

Replace `parse_frontmatter_title()` (lines 523-533) with:

```python
def parse_frontmatter_metadata(mdx_file: Path, game_slug: str) -> GameMetadata:
    post = frontmatter.load(str(mdx_file))
    title = post.get("title", game_slug)
    metadata = post.get("metadata", {})
    console = metadata.get("console", "") if isinstance(metadata, dict) else ""
    return GameMetadata(title=str(title).strip(), console=str(console).strip())
```

- [ ] **Step 3: Update process_game_folder() to use parse_frontmatter_metadata()**

In `process_game_folder()` (around line 644-645), replace:

```python
mdx_raw = mdx_file.read_text(encoding="utf-8")
game_title = parse_frontmatter_title(mdx_raw, game_slug)
```

with:

```python
mdx_raw = mdx_file.read_text(encoding="utf-8")
game_metadata = parse_frontmatter_metadata(mdx_file, game_slug)
game_title = game_metadata.title
```

- [ ] **Step 4: Delete parse_frontmatter_title()**

Remove the old function entirely (lines 523-533).

- [ ] **Step 5: Verify the script still parses**

Run: `python3 -c "import ast; ast.parse(open('scripts/add-game-screenshots.py').read()); print('OK')"`
Expected: `OK`

- [ ] **Step 6: Commit**

```bash
git add scripts/add-game-screenshots.py
git commit -m "feat(scripts): add GameMetadata dataclass and parse_frontmatter_metadata()"
```

---

## Chunk 2: Interactive Platform Mapping

### Task 3: Add collect_unique_consoles() function

**Files:**
- Modify: `scripts/add-game-screenshots.py`

- [ ] **Step 1: Add collect_unique_consoles() function**

Add after `parse_frontmatter_metadata()`:

```python
def collect_unique_consoles(game_folders: list[Path]) -> list[str]:
    consoles: set[str] = set()
    for folder in game_folders:
        mdx_file = folder / "content.mdx"
        if not mdx_file.exists():
            continue
        game_slug = folder.name
        metadata = parse_frontmatter_metadata(mdx_file, game_slug)
        if metadata.console:
            consoles.add(metadata.console)
    return sorted(consoles)
```

- [ ] **Step 2: Verify the script still parses**

Run: `python3 -c "import ast; ast.parse(open('scripts/add-game-screenshots.py').read()); print('OK')"`
Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add scripts/add-game-screenshots.py
git commit -m "feat(scripts): add collect_unique_consoles() function"
```

### Task 4: Add fetch_igdb_platforms() function

**Files:**
- Modify: `scripts/add-game-screenshots.py`

- [ ] **Step 1: Add fetch_igdb_platforms() function**

Add after `collect_unique_consoles()`:

```python
def fetch_igdb_platforms(igdb_client_id: str, igdb_access_token: str) -> list[tuple[int, str]]:
    """Fetch all IGDB platforms. Returns list of (id, name) tuples."""
    headers = {
        "Client-ID": igdb_client_id,
        "Authorization": f"Bearer {igdb_access_token}",
        "User-Agent": USER_AGENT,
    }
    query = "fields id, name; limit 500;"
    try:
        req = Request(
            "https://api.igdb.com/v4/platforms",
            data=query.encode("utf-8"),
            headers=headers,
            method="POST",
        )
        with urlopen(req, timeout=15) as response:
            platforms = json.loads(response.read().decode("utf-8"))
        if not isinstance(platforms, list):
            return []
        return [(p["id"], p["name"]) for p in platforms if "id" in p and "name" in p]
    except (HTTPError, URLError, TimeoutError, json.JSONDecodeError, KeyError) as error:
        print(f"⚠️  Failed to fetch IGDB platforms: {error}", file=sys.stderr)
        return []
```

- [ ] **Step 2: Verify the script still parses**

Run: `python3 -c "import ast; ast.parse(open('scripts/add-game-screenshots.py').read()); print('OK')"`
Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add scripts/add-game-screenshots.py
git commit -m "feat(scripts): add fetch_igdb_platforms() function"
```

### Task 5: Add interactive_platform_mapping() function

**Files:**
- Modify: `scripts/add-game-screenshots.py`

- [ ] **Step 1: Add interactive_platform_mapping() function**

Add after `fetch_igdb_platforms()`:

```python
def interactive_platform_mapping(
    consoles: list[str],
    igdb_platforms: list[tuple[int, str]],
) -> dict[str, int | None]:
    """Interactively map console names to IGDB platform IDs."""
    mapping: dict[str, int | None] = {}

    if not igdb_platforms:
        print("⚠️  No IGDB platforms available. Skipping platform mapping.")
        for console in consoles:
            mapping[console] = None
        return mapping

    print("\n🎮 Mapping consoles to IGDB platforms...\n")

    for console in consoles:
        # Filter platforms by case-insensitive substring match on console name words
        console_lower = console.lower()
        words = console_lower.split()
        candidates = [
            (pid, name) for pid, name in igdb_platforms
            if any(word in name.lower() for word in words)
        ]

        if not candidates:
            print(f'Console: "{console}"')
            print("  No matching IGDB platforms found.")
            mapping[console] = None
            print()
            continue

        print(f'Console: "{console}"')
        for idx, (pid, name) in enumerate(candidates, start=1):
            print(f"  {idx}) {name} (ID: {pid})")
        print(f"  s) Skip (no platform filter)")

        while True:
            choice = input("Choose [number/s to skip]: ").strip().lower()
            if choice == "s":
                mapping[console] = None
                break
            try:
                choice_idx = int(choice)
                if 1 <= choice_idx <= len(candidates):
                    mapping[console] = candidates[choice_idx - 1][0]
                    break
                else:
                    print(f"  Please enter a number between 1 and {len(candidates)}, or 's'.")
            except ValueError:
                print("  Please enter a number or 's'.")

        print()

    return mapping
```

- [ ] **Step 2: Verify the script still parses**

Run: `python3 -c "import ast; ast.parse(open('scripts/add-game-screenshots.py').read()); print('OK')"`
Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add scripts/add-game-screenshots.py
git commit -m "feat(scripts): add interactive_platform_mapping() function"
```

---

## Chunk 3: Update Search Functions and Integration

### Task 6: Update collect_igdb_candidates() with platform filter

**Files:**
- Modify: `scripts/add-game-screenshots.py`

- [ ] **Step 1: Update function signature**

Change the signature of `collect_igdb_candidates()` (line 326) from:

```python
def collect_igdb_candidates(title: str, igdb_client_id: str | None, igdb_access_token: str | None) -> list[Candidate]:
```

to:

```python
def collect_igdb_candidates(title: str, igdb_client_id: str | None, igdb_access_token: str | None, platform_id: int | None = None) -> list[Candidate]:
```

- [ ] **Step 2: Update the IGDB search query to use platform filter**

In the game search section (around line 343-345), replace:

```python
        search_query = f'search "{title}"; fields id, name; limit 5;'
```

with:

```python
        platform_filter = f" where platforms = ({platform_id});" if platform_id else ""
        search_query = f'search "{title}"; fields id, name;{platform_filter} limit 5;'
```

- [ ] **Step 3: Verify the script still parses**

Run: `python3 -c "import ast; ast.parse(open('scripts/add-game-screenshots.py').read()); print('OK')"`
Expected: `OK`

- [ ] **Step 4: Commit**

```bash
git add scripts/add-game-screenshots.py
git commit -m "feat(scripts): add platform filter to IGDB search query"
```

### Task 7: Update collect_wikimedia_candidates() with console name

**Files:**
- Modify: `scripts/add-game-screenshots.py`

- [ ] **Step 1: Update function signature**

Change the signature of `collect_wikimedia_candidates()` (line 238) from:

```python
def collect_wikimedia_candidates(title: str) -> list[Candidate]:
```

to:

```python
def collect_wikimedia_candidates(title: str, console_name: str = "") -> list[Candidate]:
```

- [ ] **Step 2: Update the search queries**

Replace the search queries list (line 239):

```python
    search_queries = [f"{title} gameplay screenshot", f"{title} screenshot"]
```

with:

```python
    if console_name:
        search_queries = [f"{title} {console_name} gameplay screenshot", f"{title} screenshot"]
    else:
        search_queries = [f"{title} gameplay screenshot", f"{title} screenshot"]
```

- [ ] **Step 3: Verify the script still parses**

Run: `python3 -c "import ast; ast.parse(open('scripts/add-game-screenshots.py').read()); print('OK')"`
Expected: `OK`

- [ ] **Step 4: Commit**

```bash
git add scripts/add-game-screenshots.py
git commit -m "feat(scripts): add console name to Wikimedia search queries"
```

### Task 8: Update process_game_folder() signature and main() bootstrap

**Files:**
- Modify: `scripts/add-game-screenshots.py`

- [ ] **Step 1: Add platform_mapping parameter to process_game_folder()**

Update the signature (around line 626-631) from:

```python
def process_game_folder(
    game_folder: Path,
    max_images: int,
    dry_run: bool,
    igdb_client_id: str | None,
    igdb_access_token: str | None,
) -> tuple[bool, str, str | None]:
```

to:

```python
def process_game_folder(
    game_folder: Path,
    max_images: int,
    dry_run: bool,
    igdb_client_id: str | None,
    igdb_access_token: str | None,
    platform_mapping: dict[str, int | None] | None = None,
) -> tuple[bool, str, str | None]:
```

- [ ] **Step 2: Update call sites in process_game_folder() to use new params**

Now that `platform_mapping` is a parameter, update the call sites inside `process_game_folder()`.

Update the `collect_wikimedia_candidates` call (around line 665) from:

```python
    wikimedia_candidates = collect_wikimedia_candidates(game_title)
```

to:

```python
    wikimedia_candidates = collect_wikimedia_candidates(game_title, game_metadata.console)
```

Update the `collect_igdb_candidates` call (around line 668) from:

```python
    igdb_candidates = collect_igdb_candidates(game_title, igdb_client_id, igdb_access_token)
```

to:

```python
    platform_id = platform_mapping.get(game_metadata.console) if platform_mapping else None
    igdb_candidates = collect_igdb_candidates(game_title, igdb_client_id, igdb_access_token, platform_id)
```

- [ ] **Step 3: Add bootstrap phase to main()**

In `main()`, after the IGDB token generation block (around line 731) and before the `if args.game_folder:` branch (line 736), add the bootstrap logic. The full updated `main()` flow becomes:

In the **single-game branch** (`if args.game_folder:`, around line 736), add before the `process_game_folder` call:

```python
        game_folder = Path(args.game_folder).resolve()
        # Bootstrap: collect console and build platform mapping
        platform_mapping: dict[str, int | None] | None = None
        if igdb_access_token and igdb_client_id:
            unique_consoles = collect_unique_consoles([game_folder])
            if unique_consoles:
                igdb_platforms = fetch_igdb_platforms(igdb_client_id, igdb_access_token)
                platform_mapping = interactive_platform_mapping(unique_consoles, igdb_platforms)

        success, key, error_message = process_game_folder(
            game_folder,
            args.max_images,
            args.dry_run,
            igdb_client_id,
            igdb_access_token,
            platform_mapping,
        )
```

In the **batch mode branch** (after `game_folders = discover_game_folders(videogames_root)`), add:

```python
    # Bootstrap: collect consoles and build platform mapping
    platform_mapping: dict[str, int | None] | None = None
    if igdb_access_token and igdb_client_id:
        unique_consoles = collect_unique_consoles(game_folders)
        if unique_consoles:
            igdb_platforms = fetch_igdb_platforms(igdb_client_id, igdb_access_token)
            platform_mapping = interactive_platform_mapping(unique_consoles, igdb_platforms)
```

And update the `process_game_folder` call in the batch loop to pass `platform_mapping`:

```python
        success, processed_key, error_message = process_game_folder(
            game_folder,
            args.max_images,
            args.dry_run,
            igdb_client_id,
            igdb_access_token,
            platform_mapping,
        )
```

- [ ] **Step 4: Verify the script still parses**

Run: `python3 -c "import ast; ast.parse(open('scripts/add-game-screenshots.py').read()); print('OK')"`
Expected: `OK`

- [ ] **Step 5: Commit**

```bash
git add scripts/add-game-screenshots.py
git commit -m "feat(scripts): integrate platform mapping into main() bootstrap and process_game_folder()"
```

---

## Chunk 4: Docstring Update and Final Verification

### Task 9: Update the script docstring

**Files:**
- Modify: `scripts/add-game-screenshots.py`

- [ ] **Step 1: Update the docstring**

Replace the existing docstring (lines 2-69 approximately, after the PEP 723 block) with an updated version that documents:
- The `python-frontmatter` dependency and `uv run --script` usage
- The interactive console-to-IGDB-platform mapping phase
- That `metadata.console` from frontmatter is used for refined searches
- Updated usage examples showing `uv run --script`

Key additions to the docstring:

```
Dependencies:
    python-frontmatter (declared via PEP 723 inline metadata, auto-installed by uv)

Interactive platform mapping:
    At startup, the script collects unique metadata.console values from the target
    content.mdx files and fetches the IGDB platform list. For each console, the user
    is prompted to select the matching IGDB platform (or skip). This mapping is used
    to filter IGDB searches by platform and to include the console name in Wikimedia
    Commons queries for more precise results.

    The mapping is not persisted — it is rebuilt on every run.
    If IGDB credentials are not configured, the mapping phase is skipped.

Usage:
    uv run --script scripts/add-game-screenshots.py --game-folder <path>
    uv run --script scripts/add-game-screenshots.py --all-games
```

- [ ] **Step 2: Verify the script still parses**

Run: `python3 -c "import ast; ast.parse(open('scripts/add-game-screenshots.py').read()); print('OK')"`
Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add scripts/add-game-screenshots.py
git commit -m "docs(scripts): update docstring with metadata filtering and uv run usage"
```

### Task 10: End-to-end dry-run verification

**Files:**
- Read: `scripts/add-game-screenshots.py`

- [ ] **Step 1: Run a single-game dry-run**

Run: `uv run --script scripts/add-game-screenshots.py --game-folder src/content/videogames/console/playstation5/game/astrobot --dry-run`

Expected: The script prompts for platform mapping (one console: "PlayStation 5"), then runs the dry-run showing candidate collection with the refined search queries. No files should be written.

- [ ] **Step 2: Verify no errors in output**

Check that:
- The interactive platform prompt appears and works
- Candidate collection proceeds without errors
- The dry-run completes with the "Dry run completed" message

- [ ] **Step 3: Final commit if any fixups were needed**

```bash
git add scripts/add-game-screenshots.py
git commit -m "fix(scripts): fixups from end-to-end dry-run verification"
```

Only commit if changes were made. Skip if the dry-run passed cleanly.
