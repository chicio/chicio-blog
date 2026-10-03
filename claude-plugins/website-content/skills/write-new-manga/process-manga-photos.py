#!/usr/bin/env python3
# /// script
# requires-python = ">=3.12"
# dependencies = [
#     "pillow",
# ]
# ///
"""
process-manga-photos.py

Turns the shelf photos Fabrizio drops in a manga's `media/gallery/` folder into web-ready gallery images and
rewrites the image list of the `<ImageCarousel>` in the body of its `content.mdx`.

Every image (jpg, jpeg or png; export HEIC to jpeg first) is:
  - rotated the way its EXIF orientation says, then re-encoded WITHOUT any metadata, so EXIF and GPS never
    reach the repository (phone photos carry the location of the shelf, that is, of the house)
  - resized so its longest side is at most --max-size pixels
  - saved as `<n>.jpeg`, numbered in the natural order of the source file names (2 before 10)

Files already named `<n>.jpeg` are the output of a previous run: they are kept as they are, never re-encoded, and
new photos are numbered after the highest one. The carousel is rewritten to list the shelf photos alone: from the
first photo on, the cover the skill wrote at creation is no longer in it (it stays the card and page image).

The EXIF orientation sometimes lies (a photo taken with the phone locked). The originals are deleted after the run
so their GPS never lingers in the working tree: when a processed photo comes out sideways, rotate that one by hand
or drop the original again and pass `--rotate <original file name>=<degrees>`.

Usage:
    uv run --script claude-plugins/website-content/skills/write-new-manga/process-manga-photos.py \\
        --manga-folder apps/website/src/content/manga/demon-slayer

Options:
    --manga-folder   Manga content folder (required)
    --max-size       Longest side in pixels (default: 1600)
    --rotate         `<source file name>=<degrees clockwise>`, repeatable, applied after the EXIF rotation
    --dry-run        Print what would happen without writing anything
"""

import argparse
import re
from pathlib import Path

from PIL import Image, ImageOps

SOURCE_EXTENSIONS = {".jpg", ".jpeg", ".png"}
PROCESSED_NAME = re.compile(r"^(\d+)\.jpeg$")
CAROUSEL_IMAGES = re.compile(r"(<ImageCarousel\b[^>]*?images=\{\[).*?(\]\})", re.S)


def natural_key(name: str) -> list[object]:
    return [int(part) if part.isdigit() else part.lower() for part in re.split(r"(\d+)", name)]


def gallery_paths(manga_slug: str, numbers: list[int]) -> list[str]:
    return [f"/media/content/manga/{manga_slug}/gallery/{n}.jpeg" for n in numbers]


def process(source: Path, destination: Path, max_size: int, extra_rotation: int) -> None:
    image = ImageOps.exif_transpose(Image.open(source)).convert("RGB")

    if extra_rotation:
        image = image.rotate(-extra_rotation, expand=True)

    image.thumbnail((max_size, max_size))
    image.save(destination, "JPEG", quality=82, optimize=True)


def rewrite_carousel(content_file: Path, paths: list[str]) -> None:
    text = content_file.read_text(encoding="utf8")
    images = "\n" + "".join(f'        "{path}",\n' for path in paths) + "    "
    updated, replaced = CAROUSEL_IMAGES.subn(lambda match: match[1] + images + match[2], text, count=1)

    if replaced != 1:
        raise SystemExit("Could not find `<ImageCarousel images={[...]} />` in the body of content.mdx")

    content_file.write_text(updated, encoding="utf8")


def main() -> int:
    parser = argparse.ArgumentParser(description="Resize manga shelf photos and strip their metadata")
    parser.add_argument("--manga-folder", required=True)
    parser.add_argument("--max-size", type=int, default=1600)
    parser.add_argument("--rotate", action="append", default=[])
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    folder = Path(args.manga_folder)
    gallery = folder / "media" / "gallery"
    rotations = {name: int(degrees) for name, degrees in (item.split("=") for item in args.rotate)}
    files = [p for p in gallery.glob("*") if p.suffix.lower() in SOURCE_EXTENSIONS]
    already_processed = sorted((p for p in files if PROCESSED_NAME.match(p.name)), key=lambda p: natural_key(p.name))
    sources = sorted((p for p in files if not PROCESSED_NAME.match(p.name)), key=lambda p: natural_key(p.name))

    if not sources:
        raise SystemExit(f"No new photos found in {gallery}")

    kept_numbers = [int(PROCESSED_NAME.match(p.name)[1]) for p in already_processed]
    first_number = max(kept_numbers, default=0) + 1
    processed = folder / "media" / ".gallery-processed"

    if not args.dry_run:
        processed.mkdir(exist_ok=True)

    for number, source in enumerate(sources, start=first_number):
        destination = processed / f"{number}.jpeg"
        print(f"{source.name} -> {destination.name}")

        if not args.dry_run:
            process(source, destination, args.max_size, rotations.get(source.name, 0))

    if args.dry_run:
        return 0

    for source in sources:
        source.unlink()

    for image in processed.glob("*.jpeg"):
        image.rename(gallery / image.name)

    processed.rmdir()
    numbers = kept_numbers + list(range(first_number, first_number + len(sources)))
    rewrite_carousel(folder / "content.mdx", gallery_paths(folder.name, numbers))
    print(f"Done: {len(sources)} new photos, {len(numbers)} in the carousel. Originals were deleted from {gallery}.")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
