"""
Gera as imagens de compartilhamento (Open Graph, 1200x630) em public/og/.

Por que estático e não `opengraph-image.tsx`: o satori do `next/og` não lê
woff2 nem webp, que são os formatos de toda fonte e todo print do projeto.
Gerar uma vez aqui sai mais barato que converter assets no build.

Uso (da raiz do repo):
    pip install pillow fonttools brotli
    python scripts/build-og-images.py

Rode de novo quando entrar um case novo em data/cases.ts ou quando trocar o
print do hero de algum case. As imagens geradas são commitadas.
"""

import io
import os
import re
import sys

from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC = os.path.join(ROOT, "public")
OUT = os.path.join(PUBLIC, "og")

W, H = 1200, 630
BASE = (0, 15, 8)  # #000F08
BONE = (245, 242, 237)  # #F5F2ED
MUTED = (180, 176, 170)  # #B4B0AA
RED = (251, 54, 64)  # #FB3640


def font(name, size):
    """woff2 -> ttf em memória (o Pillow não lê woff2)."""
    f = TTFont(os.path.join(PUBLIC, "fonts", f"{name}.woff2"))
    f.flavor = None
    buf = io.BytesIO()
    f.save(buf)
    buf.seek(0)
    return ImageFont.truetype(buf, size)


def wrap(draw, text, fnt, max_w):
    words, lines, cur = text.split(), [], ""
    for w in words:
        test = f"{cur} {w}".strip()
        if draw.textlength(test, font=fnt) <= max_w or not cur:
            cur = test
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def card(out_name, image_path, eyebrow, title, sub):
    canvas = Image.new("RGB", (W, H), BASE)

    # Print do site, sangrando pela direita.
    shot = Image.open(os.path.join(PUBLIC, image_path.lstrip("/"))).convert("RGB")
    scale = H / shot.height
    shot = shot.resize((round(shot.width * scale), H), Image.LANCZOS)
    # Começa onde o texto acaba: print atrás do título vira ruído.
    shot = Image.blend(shot, Image.new("RGB", shot.size, BASE), 0.18)
    canvas.paste(shot, (520, 0))

    # Degradê que devolve a esquerda ao fundo da marca.
    grad = Image.new("L", (W, 1))
    for x in range(W):
        if x < 520:
            a = 255
        elif x < 760:
            a = round(255 * (1 - (x - 520) / 240) ** 1.6)
        else:
            a = 0
        grad.putpixel((x, 0), a)
    grad = grad.resize((W, H))
    canvas.paste(Image.new("RGB", (W, H), BASE), (0, 0), grad)

    d = ImageDraw.Draw(canvas)
    pad = 64

    eb = font("Satoshi-500", 17)
    d.text((pad, pad), eyebrow.upper(), font=eb, fill=RED, spacing=4)

    size = 66
    tf = font("Panchang-800", size)
    fits = lambda ls: len(ls) <= 3 and all(d.textlength(l, font=tf) <= 480 for l in ls)
    lines = wrap(d, title, tf, 480)
    while not fits(lines) and size > 40:
        size -= 4
        tf = font("Panchang-800", size)
        lines = wrap(d, title, tf, 480)
    y = 150
    for line in lines:
        d.text((pad, y), line, font=tf, fill=BONE)
        y += round(size * 1.08)

    sf = font("Satoshi-400", 24)
    y += 18
    for line in wrap(d, sub, sf, 520)[:3]:
        d.text((pad, y), line, font=sf, fill=MUTED)
        y += 34

    # Assinatura no pé.
    d.rectangle((pad, H - pad - 26, pad + 14, H - pad - 12), fill=RED)
    bf = font("Panchang-700", 20)
    d.text((pad + 26, H - pad - 31), "Coded by M", font=bf, fill=BONE)
    uf = font("Satoshi-400", 18)
    d.text((pad + 26 + d.textlength("Coded by M", font=bf) + 18, H - pad - 28),
           "codedbym.com", font=uf, fill=MUTED)

    os.makedirs(os.path.dirname(os.path.join(OUT, out_name)), exist_ok=True)
    canvas.save(os.path.join(OUT, out_name), "JPEG", quality=84, optimize=True,
                progressive=True)
    print("og/" + out_name)


def published_cases():
    """Lê data/cases.ts sem executar TS: cada objeto começa em `slug:`."""
    src = open(os.path.join(ROOT, "data", "cases.ts"), encoding="utf8").read()
    blocks = re.split(r"\n  \{\n    slug: ", src)[1:]
    for b in blocks:
        if 'status: "published"' not in b:
            continue
        get = lambda pat: (re.search(pat, b) or [None, None])[1]
        yield {
            "slug": re.match(r'"([^"]+)"', b)[1],
            "title": get(r'\n    title: "([^"]+)"'),
            "tipo": get(r'tipo: "([^"]+)"'),
            "setor": get(r'setor: "([^"]+)"'),
            "hero": get(r'heroImages: \[\s*"([^"]+)"'),
            "concept": "concept: true" in b,
        }


if __name__ == "__main__":
    card("home.jpg", "/cases/estudio-lentz/hero-1.webp",
         "Estúdio de web design · Florianópolis", "Coded by M",
         "Landing pages, sites institucionais e aplicações web sob medida.")
    card("projetos.jpg", "/cases/mj-engenharia/hero-1.webp",
         "Portfólio", "Projetos",
         "Sites e landing pages no ar — arquitetura, engenharia, interiores e indústria.")
    card("experiencia.jpg", "/cases/estudio-lentz/hero-2.webp",
         "Coded by M · WebGL", "A Experiência",
         "Nove capítulos navegáveis, do símbolo ao convite.")
    # Landing de campanha (noindex, mas o preview no WhatsApp/anúncio importa).
    card("lp/arquitetura.jpg", "/cases/estudio-lentz/hero-1.webp",
         "Para arquitetura, interiores e engenharia",
         "Sites para escritórios de arquitetura",
         "Feitos do zero, sem template.")
    n = 0
    for c in published_cases():
        if not c["hero"]:
            print("sem hero:", c["slug"], file=sys.stderr)
            continue
        kind = "Conceito" if c["concept"] else "Case"
        card(f"cases/{c['slug']}.jpg", c["hero"], f"{kind} · {c['tipo']}",
             c["title"], c["setor"])
        n += 1
    print(f"{n} cases")
