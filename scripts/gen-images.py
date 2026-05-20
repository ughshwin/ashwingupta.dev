"""
Generate og-image.png (1200x630) and apple-touch-icon.png (180x180)
matching ashwingupta.dev's black/warm-white/cyan-glow aesthetic.
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

FONTS = "C:/Windows/Fonts"
BG       = (0, 0, 0)
TEXT_PRI = (249, 246, 238)          # --holo-text warm white
TEXT_MUT = (130, 130, 140)          # muted gray
CYAN     = (167, 226, 255)          # --holo-glow cyan
CYAN_DIM = (90, 160, 200)           # dimmer cyan for rule/accents

def load(path, size):
    return ImageFont.truetype(path, size)

def add_glow(base: Image.Image, text_layer: Image.Image, radius: int) -> Image.Image:
    """Blur text_layer and composite beneath base for a soft glow."""
    glow = text_layer.filter(ImageFilter.GaussianBlur(radius))
    out = Image.alpha_composite(glow, base)
    return out

# ─────────────────────────────────────────────
# OG IMAGE  1200 × 630
# ─────────────────────────────────────────────
def make_og():
    W, H = 1200, 630
    PAD  = 88

    img  = Image.new("RGBA", (W, H), (*BG, 255))
    draw = ImageDraw.Draw(img)

    # Subtle dot-grid background (every 40px)
    for x in range(0, W, 40):
        for y in range(0, H, 40):
            draw.ellipse([x-1, y-1, x+1, y+1], fill=(255, 255, 255, 18))

    # Left accent bar (thin vertical cyan line)
    bar_x = PAD - 24
    bar_y1 = H // 2 - 100
    bar_y2 = H // 2 + 100
    draw.rectangle([bar_x, bar_y1, bar_x + 2, bar_y2], fill=(*CYAN_DIM, 180))

    # ── Fonts ──
    f_name   = load(f"{FONTS}/segoeuib.ttf", 74)
    f_role   = load(f"{FONTS}/segoeui.ttf",  34)
    f_tags   = load(f"{FONTS}/consola.ttf",  22)
    f_url    = load(f"{FONTS}/consola.ttf",  18)

    TEXT_X = PAD
    CENTER_Y = H // 2

    # ── Name ──
    name = "Ashwin Gupta"
    name_y = CENTER_Y - 110
    # glow pass: draw name in cyan on transparent layer, blur, composite
    glow_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow_layer)
    gd.text((TEXT_X, name_y), name, font=f_name, fill=(*CYAN, 80))
    glow_blurred = glow_layer.filter(ImageFilter.GaussianBlur(14))
    img = Image.alpha_composite(img, glow_blurred)
    draw = ImageDraw.Draw(img)
    draw.text((TEXT_X, name_y), name, font=f_name, fill=(*TEXT_PRI, 245))

    # ── Role ──
    role_y = name_y + 90
    draw.text((TEXT_X, role_y), "AI Systems Researcher", font=f_role, fill=(*TEXT_MUT, 220))

    # ── Horizontal rule ──
    rule_y = role_y + 54
    draw.rectangle([TEXT_X, rule_y, TEXT_X + 420, rule_y + 1], fill=(*CYAN_DIM, 90))

    # ── Tagline ──
    tags_y = rule_y + 18
    tagline = "Inference  ·  Orchestration  ·  Scientific ML"
    draw.text((TEXT_X, tags_y), tagline, font=f_tags, fill=(*CYAN, 200))

    # ── Domain ── bottom right
    url = "ashwingupta.dev"
    bbox = draw.textbbox((0, 0), url, font=f_url)
    url_w = bbox[2] - bbox[0]
    draw.text((W - PAD - url_w, H - PAD + 10), url, font=f_url, fill=(*TEXT_MUT, 140))

    # ── Right-side decorative bracket ──
    bx = W - PAD - 10
    by = H // 2 - 80
    bh = 160
    bw = 20
    c  = (*CYAN_DIM, 80)
    draw.rectangle([bx,      by,      bx + 2,  by + bh],    fill=c)  # vertical
    draw.rectangle([bx,      by,      bx + bw, by + 2],     fill=c)  # top arm
    draw.rectangle([bx,      by + bh, bx + bw, by + bh + 2],fill=c) # bottom arm

    out = img.convert("RGB")
    out.save("public/og-image.png", "PNG", optimize=True)
    print(f"OK public/og-image.png  ({W}x{H})")


# ─────────────────────────────────────────────
# APPLE TOUCH ICON  180 × 180
# ─────────────────────────────────────────────
def make_icon():
    S = 180
    img  = Image.new("RGBA", (S, S), (*BG, 255))
    draw = ImageDraw.Draw(img)


    f_init = load(f"{FONTS}/segoeuib.ttf", 82)

    # Glow pass
    glow_layer = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow_layer)
    bbox = gd.textbbox((0, 0), "AG", font=f_init)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    tx = (S - tw) // 2 - bbox[0]
    ty = (S - th) // 2 - bbox[1] - 2
    gd.text((tx, ty), "AG", font=f_init, fill=(*CYAN, 100))
    glow_blurred = glow_layer.filter(ImageFilter.GaussianBlur(10))
    img = Image.alpha_composite(img, glow_blurred)
    draw = ImageDraw.Draw(img)

    # Initials
    draw.text((tx, ty), "AG", font=f_init, fill=(*TEXT_PRI, 245))

    # Thin border
    draw.rectangle([2, 2, S - 3, S - 3], outline=(*CYAN_DIM, 60), width=1)

    out = img.convert("RGB")
    out.save("public/apple-touch-icon.png", "PNG", optimize=True)
    print(f"OK public/apple-touch-icon.png  ({S}x{S})")


if __name__ == "__main__":
    os.chdir(os.path.join(os.path.dirname(__file__), ".."))
    make_og()
    make_icon()
