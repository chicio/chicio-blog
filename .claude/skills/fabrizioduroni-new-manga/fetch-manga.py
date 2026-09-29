#!/usr/bin/env python3
# /// script
# requires-python = ">=3.12"
# dependencies = [
#     "pillow",
# ]
# ///
"""
fetch-manga.py

Looks a manga series up on AniList (public GraphQL API, no key needed), prints the facts that are safe to copy
into the frontmatter as JSON, and optionally downloads the cover.

AniList describes the series, not the edition on the shelf: `volumes` is the Japanese tankobon count, which the
edition Fabrizio owns may not share (a Complete Edition can be a single Volume). Magazine, demographic and the
original publisher are not exposed by the API either, so they must come from the publisher page or another
reliable source and never be guessed.

Usage:
    uv run --script .claude/skills/fabrizioduroni-new-manga/fetch-manga.py --title "Demon Slayer"
    uv run --script .claude/skills/fabrizioduroni-new-manga/fetch-manga.py --title "Death Note" \\
        --folder apps/website/src/content/manga/death-note \\
        --cover-url https://example.com/edition-cover.jpg

Options:
    --title        Title to search on AniList (required)
    --folder       Manga content folder. When given, the cover is saved as <folder>/media/cover.jpg
    --cover-url    Cover to download instead of AniList's (prefer the cover of the edition that is owned)
    --max-size     Longest side of the saved cover in pixels (default: 1000)
"""

import argparse
import io
import json
import sys
import urllib.request
from pathlib import Path

from PIL import Image

ANILIST_URL = "https://graphql.anilist.co"
USER_AGENT = "Mozilla/5.0 (chicio-blog new-manga skill)"

QUERY = """
query ($search: String) {
  Media(search: $search, type: MANGA) {
    id
    siteUrl
    title { romaji english native }
    format
    status
    startDate { year }
    endDate { year }
    volumes
    chapters
    genres
    coverImage { extraLarge }
    staff(sort: RELEVANCE, perPage: 10) { edges { role node { name { full } } } }
  }
}
"""


def request(url: str, data: bytes | None = None, headers: dict[str, str] | None = None) -> bytes:
    req = urllib.request.Request(url, data=data, headers={"User-Agent": USER_AGENT, **(headers or {})})
    with urllib.request.urlopen(req, timeout=30) as response:
        return response.read()


def search_anilist(title: str) -> dict:
    payload = json.dumps({"query": QUERY, "variables": {"search": title}}).encode()
    body = request(ANILIST_URL, payload, {"Content-Type": "application/json"})
    media = json.loads(body).get("data", {}).get("Media")

    if not media:
        raise SystemExit(f"AniList found nothing for '{title}'")

    return media


def authors_with_role(media: dict, keyword: str) -> list[str]:
    names = []

    for edge in media["staff"]["edges"]:
        if keyword in edge["role"] and edge["node"]["name"]["full"] not in names:
            names.append(edge["node"]["name"]["full"])

    return names


def facts_of(media: dict) -> dict:
    return {
        "anilistId": media["id"],
        "anilistUrl": media["siteUrl"],
        "title": media["title"],
        "format": media["format"],
        "status": "Completed" if media["status"] == "FINISHED" else "Ongoing",
        "serializationStartYear": str(media["startDate"]["year"]) if media["startDate"]["year"] else None,
        "serializationEndYear": str(media["endDate"]["year"]) if media["endDate"]["year"] else None,
        "volumesInTheJapaneseRun": media["volumes"],
        "genres": media["genres"],
        "storyBy": authors_with_role(media, "Story"),
        "artBy": authors_with_role(media, "Art"),
        "coverUrl": media["coverImage"]["extraLarge"],
    }


def save_cover(url: str, destination: Path, max_size: int) -> None:
    image = Image.open(io.BytesIO(request(url))).convert("RGB")
    image.thumbnail((max_size, max_size))
    destination.parent.mkdir(parents=True, exist_ok=True)
    image.save(destination, "JPEG", quality=82, optimize=True)


def main() -> int:
    parser = argparse.ArgumentParser(description="Fetch manga facts and cover from AniList")
    parser.add_argument("--title", required=True)
    parser.add_argument("--folder")
    parser.add_argument("--cover-url")
    parser.add_argument("--max-size", type=int, default=1000)
    args = parser.parse_args()

    facts = facts_of(search_anilist(args.title))

    if args.folder:
        destination = Path(args.folder) / "media" / "cover.jpg"
        save_cover(args.cover_url or facts["coverUrl"], destination, args.max_size)
        facts["coverSavedTo"] = str(destination)

    json.dump(facts, sys.stdout, indent=2, ensure_ascii=False)
    sys.stdout.write("\n")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
