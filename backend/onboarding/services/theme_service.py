"""
Logo-driven theme palette generation.

Two flavours of palette:

1. **Matched palettes** — derived from the colours actually present in the
   uploaded logo. The first is *Logo Match* (uses the dominant logo colour
   verbatim), followed by Professional / Vibrant / Minimal variations that
   still reference the logo hue.

2. **Standard palettes** — six brand-agnostic presets (Worklynx, Forest,
   Sunset, Ocean, Royal, Slate). Always returned, so the user can ignore the
   logo extraction entirely if they prefer.
"""
from __future__ import annotations

import colorsys
import io
from pathlib import Path
from typing import Any

from colorthief import ColorThief


PALETTE_SAMPLE_COUNT = 8


# ─────────────────────────────────────────────────────────────────────────────
# Standard, brand-agnostic preset palettes
# ─────────────────────────────────────────────────────────────────────────────

STANDARD_PALETTES: list[dict[str, str]] = [
    {"name": "Worklynx", "primary": "#4f46e5", "secondary": "#1e293b", "accent": "#6366f1", "background": "#f8fafc"},
    {"name": "Forest",   "primary": "#059669", "secondary": "#0f766e", "accent": "#10b981", "background": "#f7fdf9"},
    {"name": "Sunset",   "primary": "#ea580c", "secondary": "#9a3412", "accent": "#f97316", "background": "#fff7ed"},
    {"name": "Ocean",    "primary": "#0891b2", "secondary": "#155e75", "accent": "#06b6d4", "background": "#f0fbff"},
    {"name": "Royal",    "primary": "#7c3aed", "secondary": "#4c1d95", "accent": "#a855f7", "background": "#faf5ff"},
    {"name": "Slate",    "primary": "#334155", "secondary": "#0f172a", "accent": "#64748b", "background": "#f8fafc"},
]


# ─────────────────────────────────────────────────────────────────────────────
# Colour-space helpers
# ─────────────────────────────────────────────────────────────────────────────

def _rgb_to_hex(rgb: tuple[int, int, int]) -> str:
    r, g, b = (max(0, min(255, int(c))) for c in rgb)
    return f"#{r:02x}{g:02x}{b:02x}"


def _hex_to_rgb(hex_color: str) -> tuple[int, int, int]:
    s = hex_color.lstrip("#")
    return int(s[0:2], 16), int(s[2:4], 16), int(s[4:6], 16)


def _to_hls(rgb: tuple[int, int, int]) -> tuple[float, float, float]:
    r, g, b = (c / 255.0 for c in rgb)
    return colorsys.rgb_to_hls(r, g, b)


def _from_hls(hls: tuple[float, float, float]) -> tuple[int, int, int]:
    r, g, b = colorsys.hls_to_rgb(*hls)
    return int(round(r * 255)), int(round(g * 255)), int(round(b * 255))


def _adjust(hex_color: str, *, dl: float = 0.0, ds: float = 0.0, dh: float = 0.0) -> str:
    h, l, s = _to_hls(_hex_to_rgb(hex_color))
    h = (h + dh) % 1.0
    l = max(0.04, min(0.96, l + dl))
    s = max(0.0, min(1.0, s + ds))
    return _rgb_to_hex(_from_hls((h, l, s)))


def _luminance(hex_color: str) -> float:
    _, l, _ = _to_hls(_hex_to_rgb(hex_color))
    return l


def _saturation(hex_color: str) -> float:
    _, _, s = _to_hls(_hex_to_rgb(hex_color))
    return s


def _is_neutral(hex_color: str) -> bool:
    """Near-black / white / grey — bad candidate for a brand primary."""
    l = _luminance(hex_color)
    s = _saturation(hex_color)
    return l < 0.10 or l > 0.92 or s < 0.10


def _hue_distance(a: str, b: str) -> float:
    ah, _, _ = _to_hls(_hex_to_rgb(a))
    bh, _, _ = _to_hls(_hex_to_rgb(b))
    d = abs(ah - bh)
    return min(d, 1.0 - d)


# ─────────────────────────────────────────────────────────────────────────────
# Colour extraction from the image
# ─────────────────────────────────────────────────────────────────────────────

def _extract_colors(image_bytes: bytes) -> list[str]:
    """Return hex strings sampled from the logo, dominant first, deduped."""
    thief = ColorThief(io.BytesIO(image_bytes))
    palette: list[str] = []

    try:
        dominant = thief.get_color(quality=2)
        palette.append(_rgb_to_hex(dominant))
    except Exception:
        pass

    try:
        for rgb in thief.get_palette(color_count=PALETTE_SAMPLE_COUNT, quality=3):
            hx = _rgb_to_hex(rgb)
            if hx not in palette:
                palette.append(hx)
    except Exception:
        pass

    if not palette:
        palette = ["#4f46e5", "#6366f1", "#0ea5e9", "#0f172a"]
    return palette


def _pick_brand_primary(colors: list[str]) -> str:
    """
    Pick the brand colour: the FIRST non-neutral entry in the extracted list.

    Colorthief returns colours in frequency order, so the first non-neutral
    is the dominant brand colour the human eye actually sees on the logo.
    Sorting by saturation (the previous approach) over-favours rare,
    super-saturated pixels at the expense of the obvious brand colour.
    """
    for c in colors:
        if not _is_neutral(c):
            return c
    return colors[0] if colors else "#4f46e5"


def _pick_secondary(colors: list[str], primary: str) -> str:
    """
    Sidebar / chrome colour. Always derive a darker variant of the primary
    so the palette stays harmonic — a single-hue logo (like a blue
    wordmark) shouldn't suddenly produce an unrelated dark accent.
    """
    return _adjust(primary, dl=-0.32, ds=-0.05)


def _pick_accent(colors: list[str], primary: str, secondary: str) -> str:
    """
    Accent for chips / hover. We only adopt a second logo colour if it is
    clearly *and* harmoniously a brand colour: hue at least 70 deg apart,
    bright enough to stand out, and well-saturated. Dark muddy reds in a
    blue logo (which colorthief sometimes surfaces as outliers) do not
    pass — we fall back to a lighter primary, which is always safe.
    """
    for c in colors:
        if c in (primary, secondary) or _is_neutral(c):
            continue
        h_dist = _hue_distance(c, primary)
        l = _luminance(c)
        s = _saturation(c)
        if h_dist > 0.20 and l > 0.35 and s > 0.40:
            return c
    return _adjust(primary, dl=0.12, ds=0.08)


# ─────────────────────────────────────────────────────────────────────────────
# Palette construction
# ─────────────────────────────────────────────────────────────────────────────

def build_palettes(image_bytes: bytes) -> dict[str, Any]:
    """Generate logo-matched palettes plus the standard preset list."""
    colors = _extract_colors(image_bytes)
    primary = _pick_brand_primary(colors)
    secondary = _pick_secondary(colors, primary)
    accent = _pick_accent(colors, primary, secondary)

    # 1. Logo Match — exact dominant colours, no destructive adjustment.
    logo_match = {
        "name": "Logo Match",
        "primary":    primary,
        "secondary":  secondary,
        "accent":     accent,
        "background": "#f8fafc",
        "source":     "logo",
    }

    # 2. Professional — same hue, slightly darker and desaturated.
    professional = {
        "name": "Professional",
        "primary":    _adjust(primary, dl=-0.06, ds=-0.10),
        "secondary":  "#1e293b",
        "accent":     _adjust(primary, dl=0.10),
        "background": "#f8fafc",
        "source":     "logo",
    }

    # 3. Vibrant — same hue, more saturated, lighter accent.
    vibrant = {
        "name": "Vibrant",
        "primary":    _adjust(primary, ds=0.10, dl=0.02),
        "secondary":  _adjust(primary, dl=-0.30, ds=0.05),
        "accent":     _adjust(primary, dl=0.18, ds=-0.05),
        "background": "#ffffff",
        "source":     "logo",
    }

    # 4. Minimal — neutral chrome with the logo colour as the only accent.
    minimal = {
        "name": "Minimal",
        "primary":    "#0f172a",
        "secondary":  "#475569",
        "accent":     primary,
        "background": "#ffffff",
        "source":     "logo",
    }

    matched = [logo_match, professional, vibrant, minimal]
    standard = [{**p, "source": "standard"} for p in STANDARD_PALETTES]

    return {
        "extracted_colors": colors,
        "palettes":         matched,
        "standard_palettes": standard,
    }


def fallback_palettes() -> dict[str, Any]:
    """Used when no logo is uploaded — only standard presets."""
    return {
        "extracted_colors": [],
        "palettes":         [],
        "standard_palettes": [{**p, "source": "standard"} for p in STANDARD_PALETTES],
    }


def from_path(image_path: str | Path) -> dict[str, Any]:
    p = Path(image_path)
    if not p.exists():
        return fallback_palettes()
    return build_palettes(p.read_bytes())
