"""
Convert new transparent-bg assets to webp and overwrite existing webp files.
"""
import os
from PIL import Image

os.chdir(os.path.join(os.path.dirname(__file__), ".."))
ASSETS = "src/assets"

RASTER = [
    ("coforgeLogo.png",    "coforgeLogo.webp"),
    ("gidaLogo.png",       "gidaLogo.webp"),
    ("HDFClogo.png",       "HDFClogo.webp"),
    ("prismforceLogo.png", "prismforceLogo.webp"),
    ("IIITlogo.png",       "IIITlogo.webp"),
    ("iiscLogo.PNG",       "iiscLogo.webp"),
    ("outlawedLogo.png",   "outlawedLogo.webp"),
    ("cellstratLogo.ico",  "cellstratLogo.webp"),
]

for src_name, dst_name in RASTER:
    src = os.path.join(ASSETS, src_name)
    dst = os.path.join(ASSETS, dst_name)
    if not os.path.exists(src):
        print(f"SKIP {src_name} (not found)")
        continue
    try:
        img = Image.open(src).convert("RGBA")
        img.save(dst, "WEBP", lossless=True, quality=100)
        print(f"OK   {src_name} -> {dst_name}")
    except Exception as e:
        print(f"FAIL {src_name}: {e}")

# SVG -> webp via cairosvg if available
svg_src = os.path.join(ASSETS, "BMSlogo.svg")
svg_dst = os.path.join(ASSETS, "BMSlogo.webp")
try:
    import cairosvg
    png_bytes = cairosvg.svg2png(url=svg_src, output_width=200, output_height=200)
    from io import BytesIO
    img = Image.open(BytesIO(png_bytes)).convert("RGBA")
    img.save(svg_dst, "WEBP", lossless=True, quality=100)
    print(f"OK   BMSlogo.svg -> BMSlogo.webp")
except ImportError:
    print("NOTE BMSlogo.svg: cairosvg not available, keeping as SVG")
except Exception as e:
    print(f"FAIL BMSlogo.svg: {e}")

print("Done.")
