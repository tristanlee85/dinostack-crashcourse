#!/usr/bin/env python3
"""One-off generator for the Discover wireframe placeholder mockups.

Produces labeled, spec-aligned wireframe PNGs (NOT pixel-perfect art):
- discover-desktop.png  (1440 wide, 3-column grid)
- discover-mobile.png   (375 wide, 1-column grid)

spec.md is authoritative; these images are visual references only. This script
is committed alongside the assets so the placeholders are reproducible. It is a
one-off asset generator, not imported by the app.
"""
from PIL import Image, ImageDraw, ImageFont

# Palette from spec.md section 3.
BG = "#f8fafc"
SURFACE = "#ffffff"
BORDER = "#e2e8f0"
TEXT_PRIMARY = "#0f172a"
TEXT_SECONDARY = "#475569"
TEXT_MUTED = "#94a3b8"
ACCENT = "#4f46e5"
ACCENT_SOFT = "#eef2ff"
CHIP_BG = "#e0f2fe"
CHIP_TEXT = "#0369a1"

COVERS = ["#c0556a", "#6f8fb0", "#8e6fd6", "#b8893a", "#d68f5b",
          "#9c6b8e", "#4fb0a5", "#5b8def", "#3f7d4f"]


def font(size, bold=False):
    candidates = [
        "/System/Library/Fonts/Helvetica.ttc",
        "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/Library/Fonts/Arial.ttf",
    ]
    for path in candidates:
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()


def rounded(draw, box, radius, fill=None, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def chip(draw, x, y, text, f, fg=CHIP_TEXT, bg=CHIP_BG):
    tw = draw.textlength(text, font=f)
    w = tw + 20
    h = 22
    rounded(draw, [x, y, x + w, y + h], radius=11, fill=bg)
    draw.text((x + 10, y + 4), text, font=fg if isinstance(fg, tuple) else fg and None, fill=fg)
    return w


def draw_card(draw, x, y, w, h, idx, title_f, author_f, chip_f):
    rounded(draw, [x, y, x + w, y + h], radius=12, fill=SURFACE, outline=BORDER, width=2)
    pad = 16
    cover_h = int((h - 90))
    rounded(draw, [x + pad, y + pad, x + w - pad, y + pad + cover_h], radius=8,
            fill=COVERS[idx % len(COVERS)])
    ty = y + pad + cover_h + 12
    draw.text((x + pad, ty), "Book Title", font=title_f, fill=TEXT_PRIMARY)
    draw.text((x + pad, ty + 22), "Author Name", font=author_f, fill=TEXT_SECONDARY)
    cy = ty + 46
    cx = x + pad
    for label in ("Fiction", "Sci-Fi"):
        cw = chip(draw, cx, cy, label, chip_f)
        cx += cw + 8


def header_block(draw, x, y, w, eyebrow_f, title_f, sub_f, search_f, chip_f, search_w):
    # eyebrow
    rounded(draw, [x, y, x + 96, y + 22], radius=6, fill=ACCENT_SOFT)
    draw.text((x + 10, y + 4), "DISCOVER", font=eyebrow_f, fill=ACCENT)
    # title
    draw.text((x, y + 34), "Browse Books", font=title_f, fill=TEXT_PRIMARY)
    # subtitle
    draw.text((x, y + 34 + title_f.size + 10),
              "Find your next read from a curated shelf.",
              font=sub_f, fill=TEXT_SECONDARY)
    # search
    sy = y + 34 + title_f.size + 10 + sub_f.size + 22
    rounded(draw, [x, sy, x + search_w, sy + 48], radius=8, fill=SURFACE,
            outline=BORDER, width=2)
    draw.ellipse([x + 16, sy + 16, x + 32, sy + 32], outline=TEXT_MUTED, width=2)
    draw.line([x + 30, sy + 30, x + 36, sy + 36], fill=TEXT_MUTED, width=2)
    draw.text((x + 48, sy + 13), "Search by title or author",
              font=search_f, fill=TEXT_MUTED)
    # chip row
    cy = sy + 64
    cx = x
    cats = ["All", "Fiction", "Sci-Fi", "Fantasy", "Non-Fiction", "Classic"]
    for i, c in enumerate(cats):
        cw = draw.textlength(c, font=chip_f) + 28
        active = i == 0
        rounded(draw, [cx, cy, cx + cw, cy + 30], radius=15,
                fill=ACCENT if active else SURFACE,
                outline=None if active else BORDER, width=2)
        draw.text((cx + 14, cy + 7), c, font=chip_f,
                  fill=SURFACE if active else TEXT_SECONDARY)
        cx += cw + 8
    return cy + 30  # bottom y of header block


def banner(draw, w, label_f):
    # top label strip making the placeholder nature explicit
    draw.rectangle([0, 0, w, 28], fill=ACCENT)
    draw.text((16, 6), "WIREFRAME PLACEHOLDER - spec.md is authoritative",
              font=label_f, fill=SURFACE)


def build_desktop(path):
    W, H = 1440, 1100
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    banner(d, W, font(13, bold=True))
    # app shell header bar
    d.rectangle([0, 28, W, 92], fill=SURFACE)
    d.line([0, 92, W, 92], fill=BORDER, width=1)
    d.text((144, 50), "Iridium Reading Room", font=font(20, bold=True), fill=TEXT_PRIMARY)
    d.text((W - 320, 54), "Reading List", font=font(15), fill=TEXT_SECONDARY)
    d.text((W - 180, 54), "Discover", font=font(15, bold=True), fill=TEXT_PRIMARY)
    # content container max-w-6xl centered (1152), px-6
    cx = (W - 1152) // 2 + 24
    cw = 1152 - 48
    hb = header_block(d, cx, 128, cw, font(13, bold=True), font(38, bold=True),
                      font(17), font(16), font(14), search_w=560)
    # section label
    sy = hb + 40
    d.text((cx, sy), "Featured", font=font(16, bold=True), fill=TEXT_PRIMARY)
    # 3-column grid
    gy = sy + 36
    gap = 24
    col_w = (cw - 2 * gap) // 3
    card_h = 300
    for i in range(6):
        col = i % 3
        row = i // 3
        x = cx + col * (col_w + gap)
        y = gy + row * (card_h + gap)
        draw_card(d, x, y, col_w, card_h, i, font(16, bold=True), font(14), font(12))
    img.save(path)


def build_mobile(path):
    W, H = 375, 1180
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    banner(d, W, font(10, bold=True))
    # app shell header
    d.rectangle([0, 28, W, 80], fill=SURFACE)
    d.line([0, 80, W, 80], fill=BORDER, width=1)
    d.text((16, 46), "Iridium Reading Room", font=font(15, bold=True), fill=TEXT_PRIMARY)
    cx = 16
    cw = W - 32
    hb = header_block(d, cx, 100, cw, font(11, bold=True), font(26, bold=True),
                      font(13), font(13), font(11), search_w=cw)
    sy = hb + 28
    d.text((cx, sy), "Featured", font=font(14, bold=True), fill=TEXT_PRIMARY)
    gy = sy + 30
    card_h = 280
    for i in range(3):
        y = gy + i * (card_h + 20)
        draw_card(d, cx, y, cw, card_h, i, font(15, bold=True), font(13), font(11))
    img.save(path)


if __name__ == "__main__":
    import os
    here = os.path.dirname(os.path.abspath(__file__))
    build_desktop(os.path.join(here, "discover-desktop.png"))
    build_mobile(os.path.join(here, "discover-mobile.png"))
    print("generated discover-desktop.png (1440w) and discover-mobile.png (375w)")
