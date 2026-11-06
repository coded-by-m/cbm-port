"""Terrain mesh do site (components/zones/TerrainMesh) portado para a frente do cartão: mesmo noise, semente e câmera.
Saída vetorial em CMYK: linhas quase no tom do fundo, que se dissolvem no preto sem corte brusco."""
import math

SEED, JITTER, HEIGHT_AMP = 137, 0.22, 0.55
SIZE_X, SIZE_Z = 50.0, 36.0
CALM_RADIUS, CALM_FALLOFF, CALM_MIN = 0.0, 0.5, 0.78
AMPLITUDE, FREQ, OCTAVES, LACUNARITY, GAIN, CONTRAST = 2.6, 0.28, 3, 2.05, 0.4, 1.3
CAM, TARGET, FOV = (0.0, 5.2, 15.0), (0.0, -0.8, -0.6), 42.0

SEG_X, SEG_Z = 30, 21   # menos denso que o site: no cartão, a malha cheia fecha numa mancha
SHIFT_MM = 26.0         # desloca o terreno para baixo do centro do cartão
SEG_MM = 0.5            # cada aresta é dividida em trechos deste tamanho, cada um com o seu tom
STEP = 0.02             # passo do tom: trechos vizinhos com o mesmo tom viram um traço só

U32 = 2 ** 32
def to_u32(f): return int(f) % U32
def imul(a, b): return (a * b) % U32

def mulberry32(seed):
    state = [seed % U32]
    def rnd():
        state[0] = (state[0] + 0x6d2b79f5) % U32
        a = state[0]
        t = imul(a ^ (a >> 15), 1 | a)
        t = ((t + imul(t ^ (t >> 7), 61 | t)) % U32) ^ t
        return (t ^ (t >> 14)) / 4294967296
    return rnd

def hash2(xi, yi, seed):
    h = to_u32(float(xi) * 374761393.0 + float(yi) * 668265263.0 + float(seed) * 1274126177.0)
    h = h ^ (h >> 13)
    h = imul(h, 1274126177)
    return (h ^ (h >> 16)) / 4294967295

def smooth(t): return t * t * (3 - 2 * t)

def value_noise(x, y, seed):
    xi, yi = math.floor(x), math.floor(y)
    u, v = smooth(x - xi), smooth(y - yi)
    a, b = hash2(xi, yi, seed), hash2(xi + 1, yi, seed)
    c, d = hash2(xi, yi + 1, seed), hash2(xi + 1, yi + 1, seed)
    ab, cd = a + (b - a) * u, c + (d - c) * u
    return ab + (cd - ab) * v

def fbm(x, y, seed):
    amp, freq, total, norm = 1.0, 1.0, 0.0, 0.0
    for i in range(OCTAVES):
        total += amp * (value_noise(x * freq, y * freq, seed + i * 31) * 2 - 1)
        norm += amp; amp *= GAIN; freq *= LACUNARITY
    return total / norm

def sstep(e0, e1, x):
    t = max(0.0, min(1.0, (x - e0) / (e1 - e0)))
    return t * t * (3 - 2 * t)

def height(x, z):
    nx, nz = x * FREQ, z * FREQ + 0.12   # t = 0 no site: cos(0) * timeWobble
    h = fbm(nx, nz, SEED)
    h = math.copysign(abs(h) ** CONTRAST, h) * HEIGHT_AMP * AMPLITUDE
    d = min(1.0, math.hypot(x / (SIZE_X / 2), z / (SIZE_Z / 2)))
    return h * (CALM_MIN + (1 - CALM_MIN) * sstep(CALM_RADIUS, CALM_RADIUS + CALM_FALLOFF, d))

def _sub(a, b): return (a[0] - b[0], a[1] - b[1], a[2] - b[2])
def _dot(a, b): return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
def _cross(a, b): return (a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0])
def _norm(a):
    n = math.sqrt(_dot(a, a)); return (a[0] / n, a[1] / n, a[2] / n)

def build(seg_x, seg_z):
    """Devolve vértices (x, y, z) e triângulos, na mesma ordem do geometry.ts."""
    rnd = mulberry32(SEED)
    cols, rows = seg_x + 1, seg_z + 1
    verts = []
    for r in range(rows):
        for c in range(cols):
            x = (c / seg_x - .5) * SIZE_X; z = (r / seg_z - .5) * SIZE_Z
            if not (c in (0, seg_x) or r in (0, seg_z)):
                x += (rnd() * 2 - 1) * JITTER * SIZE_X / seg_x
                z += (rnd() * 2 - 1) * JITTER * SIZE_Z / seg_z
            verts.append((x, height(x, z), z))
    tris = []
    for r in range(seg_z):
        for c in range(seg_x):
            a = r * cols + c; b = a + 1; cc = a + cols; d = cc + 1
            tris += [(a, cc, b), (b, cc, d)]
    return verts, tris

def project(verts, page_w, page_h, cx, cy):
    """Perspectiva da câmera do site → mm na página (altura da página = campo de visão vertical)."""
    f = _norm(_sub(TARGET, CAM)); s = _norm(_cross(f, (0, 1, 0))); u = _cross(s, f)
    k = (page_h / 2) / math.tan(math.radians(FOV / 2))
    out = []
    for v in verts:
        p = _sub(v, CAM); depth = _dot(p, f)
        if depth < 1.0: out.append(None); continue
        out.append((cx + k * _dot(p, s) / depth, cy - k * _dot(p, u) / depth, depth))
    return out

def mix(a, b, t): return tuple(x + (y - x) * t for x, y in zip(a, b))

def edges(bleed, tw, th):
    """Arestas únicas visíveis, de trás para a frente, como pares de pontos (x mm, y mm, profundidade)."""
    verts, tris = build(SEG_X, SEG_Z)
    pts = project(verts, tw + 2 * bleed, th + 2 * bleed, tw / 2, th / 2 + SHIFT_MM)
    depths = [p[2] for p in pts if p]
    seen = set()
    for a, b, c in tris:
        for i, j in ((a, b), (b, c), (c, a)):
            seen.add((min(i, j), max(i, j)))
    out = []
    for i, j in seen:
        p, q = pts[i], pts[j]
        if p is None or q is None: continue
        if max(p[0], q[0]) < -bleed or min(p[0], q[0]) > tw + bleed: continue
        if max(p[1], q[1]) < -bleed or min(p[1], q[1]) > th + bleed: continue
        out.append((p, q))
    out.sort(key=lambda e: -(e[0][2] + e[1][2]))
    return out, min(depths), max(depths)

def draw(face, cmyk, rich, tone, line_mm, bleed, tw, th):
    """O tom de cada trecho vem só da posição dele: some em direção ao horizonte e à distância, sem limite brusco.
    Sem oclusão entre as arestas, porque ela criaria cortes."""
    lines, near, far = edges(bleed, tw, th)
    c = face.c; c.saveState()
    c.setLineWidth(line_mm * 72 / 25.4); c.setLineJoin(1); c.setLineCap(1)

    def strength(x, y, depth):
        fog = 1 - sstep(near + (far - near) * .15, near + (far - near) * .70, depth)
        return fog * sstep(34.0, 45.0, y)

    for p, q in lines:
        n = max(1, math.ceil(math.hypot(q[0] - p[0], q[1] - p[1]) / SEG_MM))
        path, cur = None, None
        for k in range(n):
            t0, t1 = k / n, (k + 1) / n
            tm = (t0 + t1) / 2
            s = strength(p[0] + (q[0] - p[0]) * tm, p[1] + (q[1] - p[1]) * tm, p[2] + (q[2] - p[2]) * tm)
            level = round(s / STEP) * STEP
            if level != cur:
                if path is not None:
                    c.drawPath(path, stroke=1, fill=0)
                path = None
                cur = level
                if level > 0:
                    c.setStrokeColor(cmyk(*mix(rich, tone, level)))
                    path = c.beginPath()
                    path.moveTo(face.X(p[0] + (q[0] - p[0]) * t0), face.Y(p[1] + (q[1] - p[1]) * t0))
            if path is not None:
                path.lineTo(face.X(p[0] + (q[0] - p[0]) * t1), face.Y(p[1] + (q[1] - p[1]) * t1))
        if path is not None:
            c.drawPath(path, stroke=1, fill=0)
    c.restoreState()
