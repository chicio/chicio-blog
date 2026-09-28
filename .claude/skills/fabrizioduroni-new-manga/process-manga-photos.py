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
rewrites `metadata.gallery` in its `content.mdx`.

Every image (jpg, jpeg or png; export HEIC to jpeg first) is:
  - rotated the way its EXIF orientation says, then re-encoded WITHOUT any metadata, so EXIF and GPS never
    reach the repository (phone photos carry the location of the shelf, that is, of the house)
  - resized so its longest side is at most --max-size pixels
  - saved as `<n>.jpeg`, numbered from 1 in the alphabetical order of the source files

The EXIF orientation sometimes lies (a photo taken with the phone locked). The originals are deleted after the run
so their GPS never lingers in the working tree: when a processed photo comes out sideways, rotate that one by hand
or drop the original again and pass `--rotate <original file name>=<degrees>`.

Usage:
    uv run --script .claude/skills/fabrizioduroni-new-manga/process-manga-photos.py \\
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


def gallery_paths(manga_slug: str, count: int) -> list[str]:
    return [f"/media/content/manga/{manga_slug}/gallery/{n}.jpeg" for n in range(1, count + 1)]


def process(source: Path, destination: Path, max_size: int, extra_rotation: int) -> None:
    image = ImageOps.exif_transpose(Image.open(source)).convert("RGB")

    if extra_rotation:
        image = image.rotate(-extra_rotation, expand=True)

    image.thumbnail((max_size, max_size))
    image.save(destination, "JPEG", quality=82, optimize=True)


def rewrite_gallery(content_file: Path, paths: list[str]) -> None:
    text = content_file.read_text(encoding="utf8")
    block = "    gallery:" + ("" if paths else " []") + "".join(f"\n        - {path}" for path in paths)
    updated, replaced = re.subn(r"^    gallery:.*?(?=^\S|^---$)", block + "\n", text, count=1, flags=re.S | re.M)

    if replaced != 1:
        raise SystemExit("Could not find `metadata.gallery` in the frontmatter of content.mdx")

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
    sources = sorted(p for p in gallery.glob("*") if p.suffix.lower() in SOURCE_EXTENSIONS)

    if not sources:
        raise SystemExit(f"No photos found in {gallery}")

    processed = folder / "media" / ".gallery-processed"

    if not args.dry_run:
        processed.mkdir(exist_ok=True)

    for number, source in enumerate(sources, start=1):
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
    rewrite_gallery(folder / "content.mdx", gallery_paths(folder.name, len(sources)))
    print(f"Done: {len(sources)} photos, metadata.gallery updated. Originals were deleted from {gallery}.")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
