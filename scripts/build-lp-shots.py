"""
Gera a primeira tela do celular de cada cliente da landing `/criacao-de-sites`.

A landing mostra o site do cliente em duas vistas, computador e celular. O
print de celular (`mobile-tall.webp`) é a página inteira, com mais de 12 mil
px de altura: carregar isso para mostrar a primeira tela pesaria na página que
recebe clique pago. O recorte abaixo é só o topo, na proporção de um celular.

Uso (da raiz do repo):
    pip install pillow
    python scripts/build-lp-shots.py

Saída: public/cases/<pasta>/mobile-top.webp para cada pasta em `FOLDERS`.
As pastas são as dos clientes reais listados em `data/criacaoDeSites.ts`.
"""

import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FOLDERS = ["machado", "mj-engenharia", "valdete-costuras"]
RATIO = 19 / 9  # altura / largura da tela de um celular atual

for folder in FOLDERS:
    src = os.path.join(ROOT, "public", "cases", folder, "mobile-tall.webp")
    im = Image.open(src).convert("RGB")
    w, h = im.size
    top = im.crop((0, 0, w, min(round(w * RATIO), h)))
    out = os.path.join(os.path.dirname(src), "mobile-top.webp")
    top.save(out, "WEBP", quality=80, method=6)
    print(os.path.relpath(out, ROOT), top.size, os.path.getsize(out) // 1024, "KB")
