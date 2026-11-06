"""Arte final do cartão no gabarito Printi 90×48 mm, frente e verso + máscara de verniz UV local.
Pedido Printi: Couché Fosco 300g, 4x4, laminação fosca, verniz UV local (só na frente).
Gera direto em CMYK, vetorial, fontes embutidas. Ordem: 1 máscara de verniz · 2 frente · 3 verso.

Uso (da raiz do repo):
    pip install reportlab segno fonttools brotli pikepdf pillow zxing-cpp
    python scripts/cartao/gerar_cartao.py <pasta>                 # grava cartao-printi-rascunho.pdf
    python scripts/cartao/finalizar_pdf.py <pasta>                # grava cartao-printi.pdf (PDF/X-1a)
    python scripts/cartao/conferir.py <pasta>/cartao-printi.pdf   # tintas, verniz, margens e QR
    python scripts/cartao/previa.py <pasta>/cartao-printi.pdf <pasta>

--sem-relevo gera a frente só com o símbolo (a reserva em marca/impressos/cartao-de-visita/reserva-sem-relevo/)."""
import io, math, os, sys
import segno
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from reportlab.lib.colors import CMYKColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from fontTools.ttLib import TTFont as FTFont
from fontTools.svgLib.path import parse_path
import malha

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT_DIR = sys.argv[1]
WITH_MESH = "--sem-relevo" not in sys.argv[2:]
os.makedirs(OUT_DIR, exist_ok=True)
OUT = os.path.join(OUT_DIR, "cartao-printi-rascunho.pdf")

# ---------- formato (gabarito Printi) ----------
BLEED, TW, TH = 3, 90, 48            # mm
PW, PH = TW + 2 * BLEED, TH + 2 * BLEED  # 96 × 54 mm
M = 6.0                               # margem do verso, nos quatro lados

# ---------- cores CMYK ----------
RICH = CMYKColor(.40, .30, .30, 1)    # preto rico, TAC 200%
K100 = CMYKColor(0, 0, 0, 1)
RED = CMYKColor(0, .88, .70, 0)
K75 = CMYKColor(0, 0, 0, .75)
VARNISH = CMYKColor(0, 0, 0, 1)       # máscara de verniz UV local: 100% K
SILVER = CMYKColor(.08, .04, .04, .22) # cinza claro frio: faz o papel do prata
OFFWHITE = CMYKColor(.03, .04, .08, 0) # fundo do verso, impresso sobre o couché branco

# ---------- fontes: as mesmas do site, de woff2 para TTF em memória ----------
FONTS = {}
for name in ["Panchang-800", "Satoshi-500", "Satoshi-700"]:
    ft = FTFont(os.path.join(ROOT, "public", "fonts", f"{name}.woff2"))
    ft.flavor = None
    for rec in ft["name"].names:  # nos woff2 o nome PostScript é "false" nas três, e o reportlab funde fontes de mesmo nome
        if rec.nameID == 6: rec.string = name.replace("-", "_")
    ttf = io.BytesIO(); ft.save(ttf); ttf.seek(0)
    pdfmetrics.registerFont(TTFont(name, ttf))
    FONTS[name] = ft["OS/2"].sCapHeight / ft["head"].unitsPerEm  # altura de maiúscula em em

def tracked_width(text, font, size, track):
    """Largura em mm sem o espaçamento que sobra depois da última letra."""
    return (pdfmetrics.stringWidth(text, font, size) + size * track * (len(text) - 1)) / mm

def cap(font, pt): return FONTS[font] * pt / 72 * 25.4

# ---------- coordenadas: mm a partir do canto superior esquerdo do CORTE ----------
class Face:
    def __init__(self, c):
        self.c = c
    def X(self, x): return (x + BLEED) * mm
    def Y(self, y): return (PH - (y + BLEED)) * mm

    def run(self, t, font, pt, track, col, x, base):
        o = self.c.beginText(self.X(x), self.Y(base))
        o.setFont(font, pt); o.setCharSpace(pt * track); o.setFillColor(col)
        o.textOut(t); self.c.drawText(o)

    def text(self, t, font, pt, track, col, x, base, align="left"):
        w = tracked_width(t, font, pt, track)
        x0 = x - w / 2 if align == "center" else x - w if align == "right" else x
        self.run(t, font, pt, track, col, x0, base)
        return x0, w

    def words(self, parts, font, pt, track, gap, x, base, align="left"):
        """Palavras com espaço explícito de `gap` mm (o espaço da Panchang é estreito demais).
        parts: [(palavra, cor)]. Devolve (x inicial, largura total)."""
        ws = [tracked_width(t, font, pt, track) for t, _ in parts]
        total = sum(ws) + gap * (len(parts) - 1)
        x0 = x - total / 2 if align == "center" else x - total if align == "right" else x
        cur = x0
        for (t, col), w in zip(parts, ws):
            self.run(t, font, pt, track, col, cur, base)
            cur += w + gap
        return x0, total

    def rect(self, x, y, w, h, col):
        self.c.setFillColor(col)
        self.c.rect(self.X(x), self.Y(y + h), w * mm, h * mm, stroke=0, fill=1)

# ---------- símbolo (path do LogoMark, viewBox 142×161) ----------
STROKES = [[(11.5, 148.039), (11.5, 59.0391), (53.5, 104.438)], [(130.5, 103.039), (130.5, 19.0391), (85.5, 67.2944)]]
DIAG = [(9.5, 18.0391), (130.5, 147.039)]
VX0, VX1, VY0, VY1 = 5, 135, 13.5, 152.6  # limites visuais (com a espessura do traço)

def draw_sym(face, left, top, width, parts, colors):
    k = width / (VX1 - VX0)
    c = face.c
    c.setLineCap(1); c.setLineJoin(1); c.setLineWidth(9 * k * mm)
    P = lambda u, v: (face.X(left + (u - VX0) * k), face.Y(top + (v - VY0) * k))
    for part, lines in (("strokes", STROKES), ("diag", [DIAG])):
        if part not in parts: continue
        c.setStrokeColor(colors[part])
        for pts in lines:
            p = c.beginPath(); p.moveTo(*P(*pts[0]))
            for q in pts[1:]: p.lineTo(*P(*q))
            c.drawPath(p, stroke=1, fill=0)
    return k

def seg_dist(p, a, b):
    ax, ay = a; bx, by = b; px, py = p
    t = max(0, min(1, ((px-ax)*(bx-ax)+(py-ay)*(by-ay)) / ((bx-ax)**2+(by-ay)**2)))
    return math.hypot(px-(ax+t*(bx-ax)), py-(ay+t*(by-ay)))

def min_gap_units():
    best = 1e9
    for pts in STROKES:
        for a, b in zip(pts, pts[1:]):
            for i in range(201):
                t = i / 200; p = (a[0]+t*(b[0]-a[0]), a[1]+t*(b[1]-a[1]))
                best = min(best, seg_dist(p, *DIAG))
    return best - 9

# ---------- ícone WhatsApp (viewBox 24×24) ----------
WA_D = "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
class RLPen:
    def __init__(self, path, tf): self.p, self.tf = path, tf
    def moveTo(self, pt): self.p.moveTo(*self.tf(pt))
    def lineTo(self, pt): self.p.lineTo(*self.tf(pt))
    def curveTo(self, *pts):
        a, b, cc = [self.tf(q) for q in pts]; self.p.curveTo(*a, *b, *cc)
    def qCurveTo(self, *pts):
        for q in pts: self.p.lineTo(*self.tf(q))
    def closePath(self): self.p.close()
    def endPath(self): pass

def draw_wa(face, x, top, size, col):
    s = size / 24
    path = face.c.beginPath()
    parse_path(WA_D, RLPen(path, lambda pt: (face.X(x + pt[0] * s), face.Y(top + pt[1] * s))))
    face.c.setFillColor(col)
    face.c.drawPath(path, stroke=0, fill=1, fillMode=0)  # nonzero, como no SVG

# ---------- QR ----------
QR_URL = "https://codedbym.com/projetos?utm_source=cartao&utm_medium=print"
qr = segno.make(QR_URL, error="m", micro=False)
MATRIX = [list(r) for r in qr.matrix]
NQ = len(MATRIX)

def draw_qr(face, left, top, size, col):
    m = size / NQ
    face.c.setFillColor(col)
    for r, row in enumerate(MATRIX):
        c0 = None
        for cidx in range(NQ + 1):
            on = cidx < NQ and row[cidx]
            if on and c0 is None: c0 = cidx
            if not on and c0 is not None:   # junta módulos vizinhos na linha (menos objetos, sem frestas)
                face.c.rect(face.X(left + c0 * m), face.Y(top + (r + 1) * m), (cidx - c0) * m * mm, m * mm, stroke=0, fill=1)
                c0 = None
    return m

# ================= frente: símbolo pequeno centrado nos dois eixos + relevo sutil =================
SYM_W = 10.0
SYM_K = SYM_W / (VX1 - VX0)
SYM_H = (VY1 - VY0) * SYM_K
SYM_TOP = (TH - SYM_H) / 2
SYM_LEFT = TW / 2 - SYM_W / 2
LINE_MM = 0.18                    # traço do relevo

def front_symbol(face, mask_page):
    colors = {"strokes": VARNISH, "diag": VARNISH} if mask_page else {"strokes": SILVER, "diag": RED}
    draw_sym(face, SYM_LEFT, SYM_TOP, SYM_W, ["strokes", "diag"], colors)

def page_mask(c):
    front_symbol(Face(c), True)

def page_front(c):
    f = Face(c)
    f.rect(-BLEED, -BLEED, PW, PH, RICH)
    if WITH_MESH:
        malha.draw(f, CMYKColor, (.40, .30, .30, 1), (.40, .30, .30, .60), LINE_MM, BLEED, TW, TH)  # CMY igual ao fundo: a linha existe só na chapa preta
    front_symbol(f, False)

# ================= verso =================
NAME_PT, ROLE_PT, CT_PT = 10, 6, 7
NAME_TR, ROLE_TR = 0, 0.18
NAME_GAP = 0.42 * NAME_PT / 72 * 25.4
NAME_ROLE_GAP = 2.4               # base do nome → topo da função
LEAD = 3.6                        # entrelinha dos contatos, mm
QR_SIZE = 20.0
QR_GAP = 2.4                      # base do rótulo → QR (zona de silêncio de 4 módulos cabe aqui)
LBL = "VEJA OS PROJETOS"
LBL_PT = 5.6
WA_SIZE = 2.3

def page_back(c):
    f = Face(c)
    f.rect(-BLEED, -BLEED, PW, PH, OFFWHITE)
    c.setFillOverprint(True); c.setStrokeOverprint(True); c.setOverprintMask(1)  # sobreposição: sem filete branco se o registro variar
    right = TW - M
    # nome + função, canto superior esquerdo
    name_base = M + cap("Panchang-800", NAME_PT)
    _, name_w = f.words([("Matheus", K100), ("Mendes", K100)], "Panchang-800", NAME_PT, NAME_TR, NAME_GAP, M, name_base)
    role_base = name_base + NAME_ROLE_GAP + cap("Satoshi-700", ROLE_PT)
    _, role_w = f.text("CRIAÇÃO DE SITES", "Satoshi-700", ROLE_PT, ROLE_TR, K75, M, role_base)
    # coluna da direita alinhada à margem: símbolo, rótulo e QR com a mesma borda direita
    qr_left, qr_top = right - QR_SIZE, TH - M - QR_SIZE
    draw_qr(f, qr_left, qr_top, QR_SIZE, K100)
    # rótulo com exatamente a largura do QR
    base_w = tracked_width(LBL, "Satoshi-700", LBL_PT, 0)
    lbl_tr = (QR_SIZE - base_w) * mm / (LBL_PT * (len(LBL) - 1))
    lbl_base = qr_top - QR_GAP
    f.text(LBL, "Satoshi-700", LBL_PT, lbl_tr, K100, qr_left, lbl_base)  # K100: em 5,6 pt a retícula do cinza borraria
    # símbolo pequeno com a altura do bloco nome + função: topo no topo do nome, base na base da função
    mini_w = (role_base - M) * (VX1 - VX0) / (VY1 - VY0)
    draw_sym(f, right - mini_w, M, mini_w, ["strokes", "diag"], {"strokes": K100, "diag": RED})
    # contatos, canto inferior esquerdo; base da última linha = base do QR
    last = TH - M
    lines = [("(48) 99991-6638", "Satoshi-500"), ("contato.codedbym@gmail.com", "Satoshi-500"),
             ("@codedbym.co", "Satoshi-500"), ("codedbym.com", "Satoshi-700")]
    widths = []
    for i, (t, fn) in enumerate(lines):
        base = last - (len(lines) - 1 - i) * LEAD
        _, w = f.text(t, fn, CT_PT, 0, K100, M, base)
        widths.append(w)
        if i == 0:
            draw_wa(f, M + w + 1.0, base - cap(fn, CT_PT) / 2 - WA_SIZE / 2, WA_SIZE, RED)
    return dict(name_w=name_w, name_base=name_base, role_base=role_base, role_w=role_w,
                qr_left=qr_left, qr_right=right, qr_top=qr_top, lbl_tr=lbl_tr, lbl_base=lbl_base,
                lbl_top=lbl_base - cap("Satoshi-700", LBL_PT), mini_w=mini_w, mini_stroke=9 * mini_w / (VX1 - VX0), mini_bottom=role_base,
                first_contact_top=last - 3 * LEAD - cap("Satoshi-500", CT_PT), email_w=widths[1])

c = canvas.Canvas(OUT, pagesize=(PW * mm, PH * mm), pageCompression=1)
c.setTitle("Cartão de visita Coded by M"); c.setAuthor("Coded by M"); c.setCreator("cbm-port/scripts/cartao/gerar_cartao.py")
info = {}
for fn in (page_mask, page_front, page_back):
    c.setBleedBox((0, 0, PW * mm, PH * mm))
    c.setTrimBox((BLEED * mm, BLEED * mm, (BLEED + TW) * mm, (BLEED + TH) * mm))
    r = fn(c)
    if r: info.update(r)
    c.showPage()
c.save()

print("pdf:", OUT)
print(f"símbolo frente: {SYM_W:.1f}×{SYM_H:.1f} mm, topo {SYM_TOP:.2f}, base {SYM_TOP+SYM_H:.2f}, esquerda {SYM_LEFT:.2f}; traço {9*SYM_K:.2f} mm")
print(f"distância traço↔diagonal: {min_gap_units()*SYM_K:.2f} mm")
print(f"módulo do QR: {QR_SIZE/NQ:.3f} mm ({NQ} módulos), zona de silêncio 4 módulos = {4*QR_SIZE/NQ:.2f} mm")
for k, v in info.items(): print(f"  {k}: {v:.3f}")
