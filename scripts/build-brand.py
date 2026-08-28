from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont


ROOT = Path(__file__).resolve().parents[1]
FONT_PATH = ROOT / "public/fonts/la-belle-aurore.woff2"
OUTPUT_DIR = ROOT / "public/brand"
CANVAS = 512


def main() -> None:
    font = TTFont(FONT_PATH)
    glyph_set = font.getGlyphSet()
    glyph_name = font.getBestCmap()[ord("S")]
    glyph = glyph_set[glyph_name]

    bounds_pen = BoundsPen(glyph_set)
    glyph.draw(bounds_pen)
    x_min, y_min, x_max, y_max = bounds_pen.bounds
    width = x_max - x_min
    height = y_max - y_min
    scale = min((CANVAS * 0.62) / width, (CANVAS * 0.72) / height)
    tx = (CANVAS - width * scale) / 2 - x_min * scale
    ty = (CANVAS + height * scale) / 2 + y_min * scale

    path_pen = SVGPathPen(glyph_set)
    transform_pen = TransformPen(path_pen, (scale, 0, 0, -scale, tx, ty))
    glyph.draw(transform_pen)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {CANVAS} {CANVAS}" role="img" aria-label="README Stack handwritten S">
  <rect width="512" height="512" rx="112" fill="#0a0a0a"/>
  <path d="{path_pen.getCommands()}" fill="#f5f5f4"/>
</svg>
'''
    (OUTPUT_DIR / "favicon.svg").write_text(svg, encoding="utf-8")


if __name__ == "__main__":
    main()
