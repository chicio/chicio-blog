#!/usr/bin/env python3
# /// script
# requires-python = ">=3.12"
# dependencies = [
#     "python-frontmatter",
# ]
# ///
"""
add-game-screenshots.py

Adds or recreates a "Game Screenshots" carousel section for one game or in batch.

Single game mode (--game-folder):
  1. Collects screenshot candidates (priority: local gameplay/ folder → Wikimedia Commons → IGDB API)
  2. If the gameplay/ folder already has enough images, they are used as-is
  3. Missing images are downloaded from Wikimedia Commons or IGDB into gameplay/
      and normalised to JPEG 1280px (via macOS sips)
  4. Updates src/content/videogames/console/<console>/game/<game>/content.mdx
      adding (or replacing) the ## Gameplay section with an ImageCarousel pointing at the images in gameplay/

Batch mode (--all-games):
  1. Scans src/content/videogames/console/*/game/*/content.mdx
  2. Skips games that already have a Gameplay carousel (unless --force is passed)
  3. Processes games one by one and continues on errors
  4. Waits a random delay between processed games (default: 30-120s)
      to avoid aggressive request bursts; delay is skipped in --dry-run mode

Screenshot sources (in priority order):
  1. Local images already in public/images/.../gameplay/  (kept in place, never re-copied)
  2. Wikimedia Commons (free-licensed images, downloaded into gameplay/ with next available number)
  3. IGDB API (requires IGDB_CLIENT_ID and IGDB_CLIENT_SECRET in .env.others; auto-generates access token, optional fallback)

The script collects up to --max-images candidates.
If fewer are available, it still creates the carousel with the found images.
It exits with an error only if no candidate is found.

Usage:
    python3 scripts/add-game-screenshots.py --game-folder <path>
    python3 scripts/add-game-screenshots.py --all-games

    Required (choose one):
        --game-folder     Path to one game folder, e.g.:
                                            src/content/videogames/console/nintendo-entertainment-system/game/super-mario-bros-3
        --all-games       Scan and process all games under src/content/videogames

    Optional:
        --max-images      Number of screenshots to collect (default: 3)
        --dry-run         Compute changes without writing files and without delay
        --force           Recreate Gameplay carousel even if already present
        --videogames-root Base folder to discover games in batch mode
                                            (default: src/content/videogames)
        --min-delay       Minimum delay in seconds between processed games in batch mode
                                            (default: 30)
        --max-delay       Maximum delay in seconds between processed games in batch mode
                                            (default: 120)

Examples:
  python3 scripts/add-game-screenshots.py \\
      --game-folder src/content/videogames/console/nintendo-entertainment-system/game/super-mario-bros-3

  python3 scripts/add-game-screenshots.py \\
      --game-folder src/content/videogames/console/playstation5/game/astrobot \\
      --max-images 3 \\
      --dry-run

  python3 scripts/add-game-screenshots.py \\
      --all-games \\
      --dry-run

  python3 scripts/add-game-screenshots.py \\
      --all-games \\
      --force \\
      --min-delay 45 \\
      --max-delay 150
"""

from __future__ import annotations

import argparse
import json
import os
import random
import re
import subprocess
import sys
import time
from dataclasses import dataclass
from html import unescape
from pathlib import Path
from typing import Any
import frontmatter
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen

# Scripts are run from the repo root; no config files needed.

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
USER_AGENT = "chicio-blog game screenshot pipeline"


def load_env_file(env_path: str = ".env.others") -> dict[str, str]:
    """Load environment variables from a file."""
    env_vars: dict[str, str] = {}
    if os.path.exists(env_path):
        with open(env_path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#"):
                    if "=" in line:
                        key, value = line.split("=", 1)
                        env_vars[key.strip()] = value.strip()
    return env_vars


@dataclass
class Candidate:
    provider: str
    safe: bool
    local_path: Path | None
    remote_url: str | None
    source_name: str
    source_url: str
    description: str
    license: str = ""


@dataclass
class SelectedScreenshot:
    image_web_path: str
    source_name: str
    source_url: str
    attribution: str


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Add game screenshots carousel section for one or many game MDX files.",
    )
    mode_group = parser.add_mutually_exclusive_group(required=True)
    mode_group.add_argument(
        "--game-folder",
        help="Path like src/content/videogames/console/<console>/game/<game>",
    )
    mode_group.add_argument(
        "--all-games",
        action="store_true",
        help="Scan src/content/videogames and process all games missing the Gameplay carousel",
    )
    parser.add_argument(
        "--max-images",
        type=int,
        default=3,
        help="How many screenshots to collect",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Compute changes but do not write files",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Recreate Gameplay carousel even if already present",
    )
    parser.add_argument(
        "--videogames-root",
        default="src/content/videogames",
        help="Base folder used to discover games when --all-games is set",
    )
    parser.add_argument(
        "--min-delay",
        type=int,
        default=30,
        help="Minimum delay in seconds between processed games in batch mode",
    )
    parser.add_argument(
        "--max-delay",
        type=int,
        default=120,
        help="Maximum delay in seconds between processed games in batch mode",
    )
    return parser.parse_args()


def get_json(url: str) -> dict[str, Any]:
    req = Request(url, headers={"User-Agent": USER_AGENT})
    with urlopen(req, timeout=30) as response:
        return json.loads(response.read().decode("utf-8"))


def download_file(url: str, output_path: Path) -> None:
    req = Request(url, headers={"User-Agent": USER_AGENT})
    with urlopen(req, timeout=60) as response:
        output_path.write_bytes(response.read())


def extract_console_and_game(game_folder: Path) -> tuple[str, str]:
    normalized = game_folder.as_posix().rstrip("/")
    match = re.search(r"src/content/videogames/console/([^/]+)/game/([^/]+)$", normalized)
    if not match:
        raise ValueError(
            "--game-folder must match src/content/videogames/console/<console>/game/<game>",
        )
    return match.group(1), match.group(2)


def decode_html(value: str | None) -> str:
    if not value:
        return ""
    return re.sub(r"<[^>]+>", "", unescape(value)).strip()


def list_images_recursive(folder: Path) -> list[Path]:
    if not folder.exists():
        return []

    images: list[Path] = []
    for child in folder.rglob("*"):
        if child.is_file() and child.suffix.lower() in IMAGE_EXTENSIONS:
            images.append(child)
    return images


def collect_local_candidates(public_game_folder: Path) -> list[Candidate]:
    local_candidates: list[Candidate] = []

    folder = public_game_folder / "gameplay"
    for idx, file_path in enumerate(sorted(list_images_recursive(folder)), start=1):
        local_candidates.append(
            Candidate(
                provider="local-gameplay",
                safe=True,
                local_path=file_path,
                remote_url=None,
                source_name="Personal Collection",
                source_url="",
                description=f"Gameplay screenshot {idx} from local collection",
            ),
        )

    return local_candidates


def collect_wikimedia_candidates(title: str) -> list[Candidate]:
    search_queries = [f"{title} gameplay screenshot", f"{title} screenshot"]
    candidates: list[Candidate] = []

    for query in search_queries:
        search_url = (
            "https://commons.wikimedia.org/w/api.php?action=query&list=search"
            f"&format=json&srlimit=10&srsearch={quote(query)}"
        )

        try:
            search_response = get_json(search_url)
        except (HTTPError, URLError, TimeoutError, json.JSONDecodeError):
            continue

        titles = []
        for item in search_response.get("query", {}).get("search", []):
            item_title = item.get("title")
            if isinstance(item_title, str) and item_title.startswith("File:"):
                titles.append(item_title)

        if not titles:
            continue

        info_url = (
            "https://commons.wikimedia.org/w/api.php?action=query&format=json"
            "&prop=imageinfo&iiprop=url|extmetadata"
            f"&titles={quote('|'.join(titles))}"
        )

        try:
            info_response = get_json(info_url)
        except (HTTPError, URLError, TimeoutError, json.JSONDecodeError):
            continue

        pages = info_response.get("query", {}).get("pages", {})
        for page in pages.values():
            image_info = (page.get("imageinfo") or [{}])[0]
            file_url = image_info.get("url")
            if not isinstance(file_url, str):
                continue

            extension = Path(file_url.lower()).suffix
            if extension not in IMAGE_EXTENSIONS:
                continue

            ext_meta = image_info.get("extmetadata", {})
            license_short = decode_html((ext_meta.get("LicenseShortName") or {}).get("value"))
            credit = decode_html((ext_meta.get("Credit") or {}).get("value"))
            description = credit or f"Gameplay screenshot from Wikimedia Commons ({license_short or 'free license'})"

            candidates.append(
                Candidate(
                    provider="wikimedia",
                    safe=True,
                    local_path=None,
                    remote_url=file_url,
                    source_name="Wikimedia Commons",
                    source_url=file_url,
                    description=description,
                    license=license_short,
                ),
            )

    return candidates


def get_igdb_access_token(igdb_client_id: str, igdb_client_secret: str) -> str | None:
    """
    Generate an IGDB access token using Client ID + Client Secret via Twitch OAuth.
    Returns None if token generation fails.
    """
    try:
        token_url = (
            f"https://id.twitch.tv/oauth2/token"
            f"?client_id={igdb_client_id}"
            f"&client_secret={igdb_client_secret}"
            f"&grant_type=client_credentials"
        )
        req = Request(token_url, method="POST", headers={"User-Agent": USER_AGENT})
        with urlopen(req, timeout=10) as response:
            response_data = json.loads(response.read().decode("utf-8"))
            return response_data.get("access_token")
    except (HTTPError, URLError, TimeoutError, json.JSONDecodeError, KeyError) as error:
        print(f"  [DEBUG] IGDB token error: {error}", file=sys.stderr)
        return None


def collect_igdb_candidates(title: str, igdb_client_id: str | None, igdb_access_token: str | None) -> list[Candidate]:
    """
    Collect screenshot candidates from IGDB API.
    Requires IGDB_CLIENT_ID and IGDB_CLIENT_SECRET environment variables.
    Automatically generates access token via Twitch OAuth.
    Silently returns empty list if credentials are not configured.
    """
    if not igdb_client_id or not igdb_access_token:
        return []

    candidates: list[Candidate] = []
    headers = {
        "Client-ID": igdb_client_id,
        "Authorization": f"Bearer {igdb_access_token}",
    }

    # Step 1: Search for the game by name
    try:
        search_query = f'search "{title}"; fields id, name; limit 5;'
        search_url = "https://api.igdb.com/v4/games"
        req = Request(
            search_url,
            data=search_query.encode("utf-8"),
            headers={**headers, "User-Agent": USER_AGENT},
            method="POST",
        )
        with urlopen(req, timeout=10) as response:
            games = json.loads(response.read().decode("utf-8"))

        if not games or not isinstance(games, list) or len(games) == 0:
            return []

        game_id = games[0].get("id")
        if not game_id:
            return []

    except (HTTPError, URLError, TimeoutError, json.JSONDecodeError, KeyError) as error:
        print(f"  [DEBUG] IGDB search error (Client ID or Secret may be invalid): {error}", file=sys.stderr)
        return []

    # Step 2: Fetch screenshots for the game
    try:
        screenshots_query = f"fields image_id; where game = {game_id}; limit 10;"
        screenshots_url = "https://api.igdb.com/v4/screenshots"
        req = Request(
            screenshots_url,
            data=screenshots_query.encode("utf-8"),
            headers={**headers, "User-Agent": USER_AGENT},
            method="POST",
        )
        with urlopen(req, timeout=10) as response:
            screenshots = json.loads(response.read().decode("utf-8"))

        if not screenshots or not isinstance(screenshots, list) or len(screenshots) == 0:
            return []

        for screenshot in screenshots:
            image_id = screenshot.get("image_id")
            if image_id and isinstance(image_id, str):
                # Construct IGDB image URL using the image_id
                url = f"https://images.igdb.com/igdb/image/upload/t_screenshot_huge/{image_id}.jpg"
                candidates.append(
                    Candidate(
                        provider="igdb",
                        safe=True,
                        local_path=None,
                        remote_url=url,
                        source_name="IGDB",
                        source_url=f"https://www.igdb.com/games/{game_id}",
                        description="Screenshot from IGDB",
                        license="",
                    ),
                )

    except (HTTPError, URLError, TimeoutError, json.JSONDecodeError, KeyError) as error:
        print(f"  [DEBUG] IGDB screenshots error: {error}", file=sys.stderr)

    return candidates


def select_candidates(
    all_candidates: list[Candidate],
    max_images: int,
) -> list[Candidate]:
    pool = list(all_candidates)
    if not pool:
        return []

    random.shuffle(pool)

    by_provider: dict[str, list[Candidate]] = {}
    for candidate in pool:
        by_provider.setdefault(candidate.provider, []).append(candidate)

    providers = list(by_provider.keys())
    random.shuffle(providers)

    selected: list[Candidate] = []
    while len(selected) < max_images:
        consumed = False
        for provider in providers:
            provider_candidates = by_provider.get(provider, [])
            if not provider_candidates:
                continue

            selected.append(provider_candidates.pop(0))
            consumed = True

            if len(selected) == max_images:
                break

        if not consumed:
            break

    return selected


def normalize_image_to_jpg(input_path: Path, output_path: Path) -> None:
    subprocess.run(
        [
            "/usr/bin/sips",
            "-s",
            "format",
            "jpeg",
            "-Z",
            "1280",
            str(input_path),
            "--out",
            str(output_path),
        ],
        check=True,
        capture_output=True,
        text=True,
    )


def persist_screenshots(
    selected: list[Candidate],
    gameplay_dir: Path,
    console_slug: str,
    game_slug: str,
    dry_run: bool,
) -> list[SelectedScreenshot]:
    persisted: list[SelectedScreenshot] = []

    # Next index for newly downloaded images (after any existing files)
    existing_images = sorted(list_images_recursive(gameplay_dir)) if gameplay_dir.exists() else []
    next_index = len(existing_images) + 1

    for idx, candidate in enumerate(selected, start=1):
        if candidate.local_path is not None:
            # Already in gameplay/ — derive the web path from the existing file, no copy needed.
            rel = candidate.local_path.relative_to(Path.cwd() / "public")
            image_web_path = "/" + rel.as_posix()
            attribution = "Personal Collection"
            print(f"  [{idx}/{len(selected)}] Using local: {candidate.local_path.name}")
        else:
            # Remote image — download into gameplay/ with the next sequential number.
            output_path = gameplay_dir / f"{next_index}.jpg"
            temp_path = gameplay_dir / f".__tmp_{next_index}"

            if not dry_run:
                if not gameplay_dir.exists():
                    gameplay_dir.mkdir(parents=True, exist_ok=True)
                print(f"  [{idx}/{len(selected)}] Downloading from {candidate.source_name}...")
                download_file(candidate.remote_url, temp_path)  # type: ignore[arg-type]
                print(f"    Normalizing to JPEG 1280px...")
                normalize_image_to_jpg(temp_path, output_path)
                if temp_path.exists():
                    temp_path.unlink()
            else:
                print(f"  [{idx}/{len(selected)}] Would download from {candidate.source_name}")

            image_web_path = (
                f"/images/videogames/console/{console_slug}/game/{game_slug}/gameplay/{next_index}.jpg"
            )
            # Determine attribution based on provider
            if candidate.provider == "igdb":
                attribution = "IGDB"
            elif candidate.provider == "wikimedia":
                attribution = f"Wikimedia Commons ({candidate.license})" if candidate.license else "Wikimedia Commons"
            else:
                attribution = candidate.source_name
            next_index += 1

        persisted.append(
            SelectedScreenshot(
                image_web_path=image_web_path,
                source_name=candidate.source_name,
                source_url=candidate.source_url,
                attribution=attribution,
            ),
        )

    return persisted


def parse_frontmatter_title(mdx_raw: str, game_slug: str) -> str:
    match = re.match(r"^---\n([\s\S]*?)\n---", mdx_raw)
    if not match:
        return game_slug

    frontmatter = match.group(1)
    title_match = re.search(r'^title:\s*"?(.+?)"?\s*$', frontmatter, re.MULTILINE)
    if not title_match:
        return game_slug

    return title_match.group(1).strip()


def ensure_imports(mdx_body: str) -> str:
    required_imports = [
        'import { ImageCarousel } from "@/components/design-system/organism/image-carousel";',
        'import { MDXTitleWithIcon } from "@/components/sections/videogames/components/mdx-title-with-icon";',
        'import { FaGamepad } from "react-icons/fa";',
    ]

    body = mdx_body
    for import_line in required_imports:
        if import_line not in body:
            body = f"{import_line}\n{body}"

    return body


def build_caption(screenshots: list[SelectedScreenshot]) -> str:
    seen: list[str] = []
    for screenshot in screenshots:
        if screenshot.attribution not in seen:
            seen.append(screenshot.attribution)
    return " · ".join(seen)


def build_screenshots_section(title: str, screenshots: list[SelectedScreenshot]) -> str:
    image_lines = "\n".join([f'        "{entry.image_web_path}",' for entry in screenshots])
    caption = build_caption(screenshots)

    section = (
        "## <MDXTitleWithIcon icon={<FaGamepad className=\"text-shadow-lg\" />}>Gameplay</MDXTitleWithIcon>\n\n"
        "<ImageCarousel\n"
        "    images={[\n"
        f"{image_lines}\n"
        "    ]}\n"
        f"    alt=\"{title} gameplay\"\n"
        f"    caption=\"{caption}\"\n"
        "/>"
    )

    return section


def upsert_section(mdx_body: str, section: str) -> str:
    # Match from the Gameplay heading to the next ## heading (exclusive) or end of body
    section_pattern = re.compile(
        r"## <MDXTitleWithIcon[^\n]*>Gameplay</MDXTitleWithIcon>[\s\S]*?(?=\n## |\Z)"
    )

    if section_pattern.search(mdx_body):
        return section_pattern.sub(section, mdx_body)

    return f"{mdx_body.rstrip()}\n\n{section}\n"


def update_game_mdx(
    mdx_file: Path,
    title: str,
    screenshots: list[SelectedScreenshot],
    dry_run: bool,
) -> None:
    raw = mdx_file.read_text(encoding="utf-8")
    frontmatter_match = re.match(r"^(---\n[\s\S]*?\n---\n*)", raw)

    if not frontmatter_match:
        raise ValueError(f"Frontmatter not found in {mdx_file}")

    frontmatter = frontmatter_match.group(1)
    body = raw[len(frontmatter) :]

    body = ensure_imports(body)
    section = build_screenshots_section(title, screenshots)
    output = frontmatter + upsert_section(body, section)

    if not dry_run:
        mdx_file.write_text(output, encoding="utf-8")


def has_gameplay_section(mdx_raw: str) -> bool:
    section_pattern = re.compile(
        r"## <MDXTitleWithIcon[^\n]*>Gameplay</MDXTitleWithIcon>[\s\S]*?<ImageCarousel",
    )
    return bool(section_pattern.search(mdx_raw))


def discover_game_folders(videogames_root: Path) -> list[Path]:
    game_folders: list[Path] = []
    for mdx_file in sorted(videogames_root.glob("console/*/game/*/content.mdx")):
        game_folders.append(mdx_file.parent)
    return game_folders


def process_game_folder(
    game_folder: Path,
    max_images: int,
    dry_run: bool,
    igdb_client_id: str | None,
    igdb_access_token: str | None,
) -> tuple[bool, str, str | None]:
    mdx_file = game_folder / "content.mdx"
    if not mdx_file.exists():
        return False, game_folder.as_posix(), f"Unable to find {mdx_file}"

    try:
        console_slug, game_slug = extract_console_and_game(game_folder)
    except ValueError as error:
        return False, game_folder.as_posix(), str(error)

    print(f"🎮 Starting: {console_slug}/{game_slug}")

    mdx_raw = mdx_file.read_text(encoding="utf-8")
    game_title = parse_frontmatter_title(mdx_raw, game_slug)
    print(f"📄 Title: {game_title}")

    public_game_folder = (
        Path.cwd()
        / "public"
        / "images"
        / "videogames"
        / "console"
        / console_slug
        / "game"
        / game_slug
    )
    gameplay_folder = public_game_folder / "gameplay"
    key = f"{console_slug}/{game_slug}"

    print("🔍 Collecting candidates...")
    local_candidates = collect_local_candidates(public_game_folder)
    print(f"  ✓ Local: {len(local_candidates)}")

    wikimedia_candidates = collect_wikimedia_candidates(game_title)
    print(f"  ✓ Wikimedia Commons: {len(wikimedia_candidates)}")

    igdb_candidates = collect_igdb_candidates(game_title, igdb_client_id, igdb_access_token)
    print(f"  ✓ IGDB: {len(igdb_candidates)}")

    total_candidates = len(local_candidates) + len(wikimedia_candidates) + len(igdb_candidates)
    print(f"📊 Total candidates: {total_candidates}")

    selected = select_candidates(
        [*local_candidates, *wikimedia_candidates, *igdb_candidates],
        max_images,
    )
    print(f"✅ Selected: {len(selected)}/{max_images}")

    if len(selected) == 0:
        return (
            False,
            key,
            "No candidates found. Add local gameplay images or check Wikimedia Commons / IGDB availability.",
        )

    if len(selected) < max_images:
        print(f"⚠️  Proceeding with {len(selected)} images (max requested: {max_images}).")

    try:
        print("⬇️  Persisting screenshots...")
        persisted = persist_screenshots(
            selected,
            gameplay_folder,
            console_slug,
            game_slug,
            dry_run,
        )
        print(f"  ✓ Downloaded and normalized: {len(persisted)}")

        print("📝 Updating MDX file...")
        update_game_mdx(mdx_file, game_title, persisted, dry_run)
        print("  ✓ MDX updated")
    except (ValueError, RuntimeError, subprocess.CalledProcessError, HTTPError, URLError) as error:
        return False, key, str(error)

    print(f"\n✨ Processed {key}")
    for image in persisted:
        print(f"   • {image.image_web_path} ({image.source_name})")

    return True, key, None


def main() -> int:
    args = parse_args()

    if args.max_images < 1:
        print("--max-images must be a positive number", file=sys.stderr)
        return 1
    if args.min_delay < 0 or args.max_delay < 0:
        print("--min-delay and --max-delay must be >= 0", file=sys.stderr)
        return 1
    if args.min_delay > args.max_delay:
        print("--min-delay cannot be greater than --max-delay", file=sys.stderr)
        return 1

    # Load IGDB credentials from .env.others
    env_vars = load_env_file(".env.others")
    igdb_client_id = env_vars.get("IGDB_CLIENT_ID")
    igdb_client_secret = env_vars.get("IGDB_CLIENT_SECRET")
    igdb_access_token = get_igdb_access_token(igdb_client_id, igdb_client_secret) if igdb_client_id and igdb_client_secret else None

    if igdb_client_id and igdb_client_secret and not igdb_access_token:
        print("⚠️  IGDB token could not be generated. Proceeding with local + Wikimedia only.")

    if args.game_folder:
        game_folder = Path(args.game_folder).resolve()
        success, key, error_message = process_game_folder(
            game_folder,
            args.max_images,
            args.dry_run,
            igdb_client_id,
            igdb_access_token,
        )

        if not success:
            print(f"❌ {key}: {error_message}", file=sys.stderr)
            return 1

        if args.dry_run:
            print("\n💭 Dry run completed. No files were written.")
        else:
            print("\n✅ Done! Changes written.")
        return 0

    videogames_root = Path(args.videogames_root).resolve()
    game_folders = discover_game_folders(videogames_root)
    if not game_folders:
        print(f"No games found under {videogames_root}", file=sys.stderr)
        return 1

    print(f"🧭 Batch mode: discovered {len(game_folders)} games")

    skipped = 0
    processed_attempts = 0
    modified_successfully = 0
    failed: list[tuple[str, str]] = []

    for index, game_folder in enumerate(game_folders, start=1):
        mdx_file = game_folder / "content.mdx"
        key = game_folder.as_posix().split("/src/content/videogames/console/")[-1].replace("/game/", "/")

        if not mdx_file.exists():
            failed.append((key, f"Missing file: {mdx_file}"))
            print(f"[{index}/{len(game_folders)}] ❌ {key} -> Missing content.mdx")
            continue

        raw = mdx_file.read_text(encoding="utf-8")
        if has_gameplay_section(raw) and not args.force:
            skipped += 1
            print(f"[{index}/{len(game_folders)}] ⏭️  Skipping {key} (Gameplay carousel already present)")
            continue

        if not args.dry_run and processed_attempts > 0:
            delay = random.randint(args.min_delay, args.max_delay)
            print(f"⏳ Waiting {delay}s before next processed game...")
            time.sleep(delay)

        processed_attempts += 1
        print(f"[{index}/{len(game_folders)}] ▶️  Processing {key}")
        success, processed_key, error_message = process_game_folder(
            game_folder,
            args.max_images,
            args.dry_run,
            igdb_client_id,
            igdb_access_token,
        )

        if success:
            modified_successfully += 1
        else:
            failed.append((processed_key, error_message or "Unknown error"))
            print(f"❌ {processed_key}: {error_message}", file=sys.stderr)

    print("\n📦 Batch summary")
    print(f"  • Discovered games: {len(game_folders)}")
    print(f"  • Skipped (already had carousel): {skipped}")
    print(f"  • Processed games: {processed_attempts}")
    print(f"  • Modified successfully: {modified_successfully}")
    print(f"  • Errors: {len(failed)}")

    if failed:
        print("\n❌ Failed games:")
        for failed_key, failed_reason in failed:
            print(f"  - {failed_key}: {failed_reason}")

    if args.dry_run:
        print("\n💭 Dry run completed. No files were written.")

    return 0 if len(failed) == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
