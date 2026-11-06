"""Confere o PDF final: fontes, caixas, separações de tinta, verniz × símbolo, margens e leitura do QR.
Uso: python scripts/cartao/conferir.py <pdf>
O Ghostscript vem da variável GS, do PATH ou da instalação padrão no Windows."""
import os, shutil, subprocess, sys, tempfile
import pikepdf, zxingcpp
from PIL import Image, ImageChops

GS = os.environ.get("GS") or shutil.which("gswin64c") or shutil.which("gs") or r"C:\Program Files\gs\gs10.02.1\bin\gswin64c.exe"
PDF = sys.argv[1]
DPI = 600
PX = DPI / 25.4
BLEED = 3
def px(v): return round((v + BLEED) * PX)   # mm a partir do corte → pixel

# ---------- estrutura ----------
pdf = pikepdf.open(PDF)
print("versão PDF:", pdf.pdf_version, "| páginas:", len(pdf.pages), "| PDF/X:", pdf.docinfo.get("/GTS_PDFXVersion"), "| Trapped:", pdf.docinfo.get("/Trapped"))
print("OutputIntent:", pdf.Root.OutputIntents[0].OutputConditionIdentifier)
for i, p in enumerate(pdf.pages, 1):
    fonts = p.Resources.get("/Font", {})
    names = []
    for k in fonts.keys():
        fo = fonts[k]
        d = fo.get("/FontDescriptor")
        if d is None and "/DescendantFonts" in fo: d = fo.DescendantFonts[0].get("/FontDescriptor")
        emb = d is not None and any(x in d for x in ("/FontFile", "/FontFile2", "/FontFile3"))
        names.append(f"{fo.get('/BaseFont')}{'' if emb else ' (NÃO EMBUTIDA)'}")
    tb = [round(float(v) / 72 * 25.4, 2) for v in p.TrimBox]; bb = [round(float(v) / 72 * 25.4, 2) for v in p.BleedBox]
    print(f"página {i}: corte {tb} sangria {bb} fontes {sorted(set(names)) or '-'}")

# ---------- separações ----------
tmp = tempfile.mkdtemp()
subprocess.run([GS, "-q", "-dNOPAUSE", "-dBATCH", "-sDEVICE=tiffsep", f"-r{DPI}",
                f"-sOutputFile={tmp}/s%d.tif", PDF], check=True)
def inks(page):
    return {c: Image.open(f"{tmp}/s{page}({n}).tif").convert("L") for c, n in
            [("C", "Cyan"), ("M", "Magenta"), ("Y", "Yellow"), ("K", "Black")]}
def sample(chs, x, y):
    return " ".join(f"{k}{round((255 - chs[k].getpixel((px(x), px(y)))) / 2.55)}" for k in "CMYK")

mask, front, back = inks(1), inks(2), inks(3)
print("\nmáscara: tintas usadas =", [k for k in "CMYK" if mask[k].point(lambda v: 255 - v).getbbox()],
      "| K máximo =", round((255 - mask["K"].getextrema()[0]) / 2.55))
print("frente, fundo (5,5):", sample(front, 5, 5))
print("frente, fundo na sangria (-2,-2):", sample(front, -2, -2))
print("frente, traço do símbolo (x≈40.5, y≈26):", sample(front, 40.5, 26))
print("verso, fundo (45,20):", sample(back, 45, 20))
print("verso, fundo na sangria (-2,-2):", sample(back, -2, -2))
# tintas nas áreas de texto (pixel mais carregado em K e em M)
def peak(chs, box):
    b = (px(box[0]), px(box[1]), px(box[2]), px(box[3]))
    return {k: round((255 - chs[k].crop(b).getextrema()[0]) / 2.55) for k in "CMYK"}
print("frente, faixa do relevo (pico):", peak(front, (5, 36, 85, 46)))
print("verso, nome (pico):", peak(back, (6, 6, 52, 8.5)))
print("verso, função (pico):", peak(back, (6, 11, 32, 12.4)))
print("verso, rótulo do QR (pico):", peak(back, (64, 18, 84, 19.7)))
print("verso, contatos (pico):", peak(back, (6, 29, 42, 42.5)))

# ---------- verniz × símbolo ----------
# símbolo da frente = onde o preto K some (cinza K22 ou vermelho K0); o corte em 31 mm deixa o relevo de fora
top_zone = (0, 0, mask["K"].width, px(31))
sym_front = front["K"].crop(top_zone).point(lambda v: 255 if v > 128 else 0)   # sem K cheio = símbolo
sym_mask = mask["K"].crop(top_zone).point(lambda v: 255 if v < 128 else 0)     # K cheio = verniz
print("\nverniz × símbolo: bbox verniz", sym_mask.getbbox(), "bbox símbolo", sym_front.getbbox())
diff = ImageChops.difference(sym_front, sym_mask)
area = sum(1 for v in sym_mask.get_flattened_data() if v)
d = sum(1 for v in diff.get_flattened_data() if v)
print(f"pixels divergentes: {d} de {area} ({d/area*100:.2f}%)")

# ---------- margens ----------
def bbox_mm(chs, bg):
    """Caixa do que difere do fundo, em mm a partir do corte."""
    acc = None
    for k in "CMYK":
        v = bg[k]
        m = chs[k].point(lambda p: 255 if abs((255 - p) / 2.55 - v) > 8 else 0)
        acc = m if acc is None else ImageChops.lighter(acc, m)
    x0, y0, x1, y1 = acc.getbbox()
    return x0 / PX - BLEED, y0 / PX - BLEED, x1 / PX - BLEED, y1 / PX - BLEED
for name, chs, bg in (("frente", front, dict(C=40, M=30, Y=30, K=100)), ("verso", back, dict(C=3, M=4, Y=8, K=0))):
    x0, y0, x1, y1 = bbox_mm(chs, bg)
    print(f"{name}: distância ao corte  esq {x0:.2f}  topo {y0:.2f}  dir {90 - x1:.2f}  base {48 - y1:.2f} mm")

# ---------- QR ----------
for dpi in (300, 150):
    out = f"{tmp}/q{dpi}.png"
    subprocess.run([GS, "-q", "-dNOPAUSE", "-dBATCH", "-sDEVICE=png16m", f"-r{dpi}", "-dFirstPage=3", "-dLastPage=3", f"-sOutputFile={out}", PDF], check=True)
    res = zxingcpp.read_barcodes(Image.open(out))
    print(f"QR em {dpi} dpi:", [(r.format.name, r.text) for r in res] or "NÃO LEU")
