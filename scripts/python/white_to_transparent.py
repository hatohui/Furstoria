#!/usr/bin/env python3
"""
Turn white (or near-white) pixels in an image into transparent pixels.

Usage:
    python scripts/python/white_to_transparent.py <path> [<path> ...] [options]

<path> can be a file or a directory (directories are searched recursively
for .png / .webp / .gif / .bmp / .tiff / .jpg / .jpeg files).

Options:
    --threshold N     Pixels whose min(R,G,B) is >= N are treated as pure
                       white and made fully transparent. 0-255 (default: 240)
    --feather N       Extra band below --threshold over which alpha fades
                       smoothly instead of a hard cutoff, to avoid a jagged
                       edge / white halo around anti-aliased artwork.
                       0-255 (default: 20, 0 disables feathering)
    --in-place        Overwrite the source file. Formats without alpha
                       (.jpg/.jpeg) are switched to .png; the old file is
                       removed on success.
    --suffix TEXT      Suffix appended to the output filename when not
                       writing in-place (default: "-transparent").
    --format FMT       Force the output format: png or webp
                       (default: keep source format if it supports alpha,
                       otherwise png).
    --dry-run          Show what would happen without writing any files.

Examples:
    # Preview, non-destructive
    python scripts/python/white_to_transparent.py public/logo.png --dry-run

    # Write public/logo-transparent.png
    python scripts/python/white_to_transparent.py public/logo.png

    # Overwrite every image under public/ in place
    python scripts/python/white_to_transparent.py public --in-place
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

try:
    from PIL import Image, ImageChops
except ImportError:
    sys.exit(
        "Pillow is required but not installed.\n"
        "Install it with: pip install Pillow"
    )

SEARCHABLE_EXTENSIONS = {".png", ".webp", ".gif", ".bmp", ".tif", ".tiff", ".jpg", ".jpeg"}
ALPHA_CAPABLE_EXTENSIONS = {".png", ".webp", ".gif", ".tif", ".tiff"}


def collect_paths(inputs: list[str]) -> list[Path]:
    files: list[Path] = []
    for raw in inputs:
        p = Path(raw)
        if p.is_dir():
            files.extend(
                sorted(
                    f
                    for f in p.rglob("*")
                    if f.is_file() and f.suffix.lower() in SEARCHABLE_EXTENSIONS
                )
            )
        elif p.is_file():
            files.append(p)
        else:
            print(f"WARNING: path not found, skipping: {p}", file=sys.stderr)
    return files


def whiten_to_alpha(im: Image.Image, threshold: int, feather: int) -> Image.Image:
    """Return an RGBA copy of `im` with white/near-white pixels made
    transparent, fading smoothly over `feather` levels below `threshold`."""
    rgba = im.convert("RGBA")
    r, g, b, a = rgba.split()

    # "Whiteness" of a pixel = the minimum of its channels (a pixel is only
    # as white as its darkest channel).
    min_rgb = ImageChops.darker(ImageChops.darker(r, g), b)

    low = max(threshold - feather, 0)

    def alpha_for(min_value: int) -> int:
        if min_value >= threshold:
            return 0
        if feather > 0 and min_value >= low:
            # Linear fade: low -> fully opaque, threshold -> fully transparent
            fraction = (threshold - min_value) / feather
            return round(255 * fraction)
        return 255

    lut = [alpha_for(v) for v in range(256)]
    new_alpha_mask = min_rgb.point(lut)
    # Preserve any pre-existing transparency: never make a pixel *more*
    # opaque than it already was.
    combined_alpha = ImageChops.darker(a, new_alpha_mask)

    rgba.putalpha(combined_alpha)
    return rgba


def output_path_for(src: Path, in_place: bool, suffix: str, output_format: str | None) -> Path:
    ext = src.suffix.lower()
    if output_format:
        new_ext = f".{output_format.lower()}"
    elif ext in ALPHA_CAPABLE_EXTENSIONS:
        new_ext = ext
    else:
        new_ext = ".png"  # jpg/jpeg has no alpha channel

    if in_place:
        return src.with_suffix(new_ext)
    return src.with_name(f"{src.stem}{suffix}{new_ext}")


def process_one(
    src: Path,
    threshold: int,
    feather: int,
    in_place: bool,
    suffix: str,
    output_format: str | None,
    dry_run: bool,
) -> None:
    dest = output_path_for(src, in_place, suffix, output_format)
    pillow_format = "WEBP" if dest.suffix.lower() == ".webp" else \
        "GIF" if dest.suffix.lower() == ".gif" else "PNG"

    if dry_run:
        print(f"[dry-run] {src} -> {dest} (threshold={threshold}, feather={feather})")
        if in_place and dest != src:
            print(f"[dry-run] remove original {src}")
        return

    with Image.open(src) as im:
        result = whiten_to_alpha(im, threshold, feather)
        result.save(dest, format=pillow_format)

    if in_place and dest != src:
        src.unlink()

    print(f"processed {src} -> {dest}")


def main() -> None:
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument("paths", nargs="+", help="Image file(s) or directory(ies) to process")
    parser.add_argument("--threshold", type=int, default=240, help="Whiteness cutoff, 0-255 (default: 240)")
    parser.add_argument("--feather", type=int, default=20, help="Fade band below threshold, 0-255 (default: 20)")
    parser.add_argument("--in-place", action="store_true", help="Overwrite the source file")
    parser.add_argument("--suffix", default="-transparent", help='Output filename suffix (default: "-transparent")')
    parser.add_argument("--format", choices=["png", "webp"], default=None, help="Force output format")
    parser.add_argument("--dry-run", action="store_true", help="Preview without writing files")
    args = parser.parse_args()

    if not (0 <= args.threshold <= 255):
        sys.exit("--threshold must be between 0 and 255")
    if not (0 <= args.feather <= 255):
        sys.exit("--feather must be between 0 and 255")

    files = collect_paths(args.paths)
    if not files:
        print("No matching image files found. Nothing to do.")
        return

    print(f"Found {len(files)} image(s) to process")
    for src in files:
        try:
            process_one(src, args.threshold, args.feather, args.in_place, args.suffix, args.format, args.dry_run)
        except Exception as exc:
            print(f"FAILED: {src}: {exc}", file=sys.stderr)

    print("Done.")


if __name__ == "__main__":
    main()
