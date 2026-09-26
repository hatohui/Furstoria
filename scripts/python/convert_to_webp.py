#!/usr/bin/env python3
"""
Convert raster images in `public/` to .webp, and move the original files
into `public/_original/` (mirroring their original relative path).

Usage:
    python scripts/convert_to_webp.py [--quality 80] [--lossless] [--dry-run] [--public-dir public]

Notes:
    - Only raster formats are converted: .png .jpg .jpeg .bmp .tif .tiff .gif
    - .svg and .webp files are left alone (vector / already webp).
    - --lossless keeps every pixel intact; --quality then only controls
      compression effort (higher = smaller file, slower encode).
    - Requires Pillow: pip install Pillow
"""

from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path

try:
    from PIL import Image, ImageSequence
except ImportError:
    sys.exit(
        "Pillow is required but not installed.\n"
        "Install it with: pip install Pillow"
    )

CONVERTIBLE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".bmp", ".tif", ".tiff", ".gif"}
ORIGINAL_DIR_NAME = "_original"


def find_convertible_images(public_dir: Path) -> list[Path]:
    original_dir = public_dir / ORIGINAL_DIR_NAME
    files = []
    for path in public_dir.rglob("*"):
        if not path.is_file():
            continue
        if original_dir in path.parents:
            continue
        if path.suffix.lower() in CONVERTIBLE_EXTENSIONS:
            files.append(path)
    return files


def convert_one(src: Path, public_dir: Path, quality: int, lossless: bool, dry_run: bool) -> Path:
    """Convert `src` to .webp next to itself, then move the original into
    `public/_original/<relative path>`. Returns the new .webp path."""
    dest_webp = src.with_suffix(".webp")

    if dry_run:
        print(f"[dry-run] convert {src} -> {dest_webp}")
    else:
        with Image.open(src) as im:
            if getattr(im, "is_animated", False):
                frames = [
                    frame.convert("RGBA")
                    for frame in ImageSequence.Iterator(im)
                ]
                frames[0].save(
                    dest_webp,
                    format="WEBP",
                    save_all=True,
                    append_images=frames[1:],
                    quality=quality,
                    lossless=lossless,
                    loop=im.info.get("loop", 0),
                    duration=im.info.get("duration", 100),
                )
            else:
                if im.mode not in ("RGB", "RGBA"):
                    im = im.convert("RGBA" if "A" in im.getbands() else "RGB")
                im.save(dest_webp, format="WEBP", quality=quality, lossless=lossless)
        print(f"converted {src} -> {dest_webp}")

    relative = src.relative_to(public_dir)
    archive_path = public_dir / ORIGINAL_DIR_NAME / relative

    if dry_run:
        print(f"[dry-run] move {src} -> {archive_path}")
    else:
        archive_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(src), str(archive_path))
        print(f"archived {src} -> {archive_path}")

    return dest_webp


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--public-dir",
        default="public",
        help="Path to the public directory (default: public)",
    )
    parser.add_argument(
        "--quality",
        type=int,
        default=80,
        help="WebP quality, 0-100 (default: 80)",
    )
    parser.add_argument(
        "--lossless",
        action="store_true",
        help="Encode losslessly (no quality loss)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would happen without writing/moving any files",
    )
    args = parser.parse_args()

    public_dir = Path(args.public_dir).resolve()
    if not public_dir.is_dir():
        sys.exit(f"public dir not found: {public_dir}")

    images = find_convertible_images(public_dir)
    if not images:
        print("No convertible raster images found. Nothing to do.")
        return

    print(f"Found {len(images)} image(s) to convert in {public_dir}")
    for src in images:
        try:
            convert_one(src, public_dir, args.quality, args.lossless, args.dry_run)
        except Exception as exc:  # keep going on a per-file failure
            print(f"FAILED: {src}: {exc}", file=sys.stderr)

    print("Done.")


if __name__ == "__main__":
    main()
