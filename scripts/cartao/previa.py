"""Renderiza o PDF com Ghostscript e monta a prévia (com brilho simulado do verniz) e a revisão com guias.
Uso: python scripts/cartao/previa.py <pdf> <pasta de saída>
O Ghostscript vem da variável GS, do PATH ou da instalação padrão no Windows."""
import os, shutil, subprocess, sys, tempfile
from PIL import Image, ImageChops, ImageDraw

GS = os.environ.get("GS") or shutil.which("gswin64c") or shutil.which("gs") or r"C:\Program Files\gs\gs10.02.1\bin\gswin64c.exe"
pdf, out = sys.argv[1], sys.argv[2]
DPI = 600
PX = DPI / 25.4
BLEED, TW, TH, SAFE = 3, 90, 48, 3
BG = (243, 244, 246)

tmp = tempfile.mkdtemp()
subprocess.run([GS, "-q", "-dNOPAUSE", "-dBATCH", "-sDEVICE=png16m", f"-r{DPI}", "-dGraphicsAlphaBits=4", "-dTextAlphaBits=4",
                f"-sOutputFile={tmp}/p%d.png", pdf], check=True)
mask, front, back = [Image.open(f"{tmp}/p{i}.png").convert("RGB") for i in (1, 2, 3)]

# brilho do verniz: clareia só onde a máscara imprime
lum = mask.convert("L").point(lambda v: 255 - v)
front_gloss = Image.composite(ImageChops.screen(front, Image.new("RGB", front.size, (26, 26, 26))), front, lum)

def px(mm): return round(mm * PX)
trim = (px(BLEED), px(BLEED), px(BLEED + TW), px(BLEED + TH))
gap, pad = px(4), px(4)

# prévia cortada
w, h = trim[2] - trim[0], trim[3] - trim[1]
sheet = Image.new("RGB", (w + 2 * pad, 2 * h + gap + 2 * pad), BG)
sheet.paste(front_gloss.crop(trim), (pad, pad))
sheet.paste(back.crop(trim), (pad, pad + h + gap))
sheet.resize((sheet.width // 2, sheet.height // 2), Image.LANCZOS).save(os.path.join(out, "previa-frente-verso.png"), optimize=True)

# revisão com guias: sangria (vermelho), corte (cinza), segurança (azul)
pages = [mask, front, back]
bw, bh = pages[0].size
rev = Image.new("RGB", (bw + 2 * pad, 3 * bh + 2 * gap + 2 * pad), BG)
lw = 3
for i, p in enumerate(pages):
    im = p.copy(); d = ImageDraw.Draw(im)
    d.rectangle((0, 0, bw - 1, bh - 1), outline=(230, 40, 50), width=lw)
    d.rectangle(trim, outline=(128, 128, 128), width=lw)
    d.rectangle((px(BLEED + SAFE), px(BLEED + SAFE), px(BLEED + TW - SAFE), px(BLEED + TH - SAFE)), outline=(20, 170, 230), width=lw)
    rev.paste(im, (pad, pad + i * (bh + gap)))
rev.resize((rev.width // 2, rev.height // 2), Image.LANCZOS).save(os.path.join(out, "revisao-com-guias.png"), optimize=True)
print("ok", sheet.size, rev.size)
