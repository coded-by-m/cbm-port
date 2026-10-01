"""
Gera o "pôster" do hero de cada case: o primeiro quadro do print de página
inteira (`preview.desktop`), recortado em 16:10 e leve.

O hero do case mostra só o topo do print, mas o print inteiro tem 5–10 mil
px de altura. Sem o pôster, nada aparece no quadro até ele baixar inteiro —
e ele é o maior elemento da primeira dobra (LCP). O pôster fica atrás do
print, com os mesmos pixels no topo; quando o print chega, cobre o pôster
sem salto visível.

Uso (da raiz do repo):
    pip install pillow
    python scripts/build-case-posters.py

Saída: public/cases/<pasta>/desktop-top.webp para cada `desktop-tall.*`.
Depois, aponte `preview.top` do case em data/cases.ts para o arquivo.
"""

import glob
import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAX_W = 1440  # o quadro do hero não passa de 860px; 1440 cobre tela 1.7x

for src in sorted(glob.glob(os.path.join(ROOT, "public", "cases", "*", "desktop-tall.*"))):
    im = Image.open(src).convert("RGB")
    w, h = im.size
    crop_h = round(w * 10 / 16)
    top = im.crop((0, 0, w, min(crop_h, h)))
    if w > MAX_W:
        top = top.resize((MAX_W, round(top.height * MAX_W / w)), Image.LANCZOS)
    out = os.path.join(os.path.dirname(src), "desktop-top.webp")
    top.save(out, "WEBP", quality=80, method=6)
    print(os.path.relpath(out, ROOT), top.size, os.path.getsize(out) // 1024, "KB")
