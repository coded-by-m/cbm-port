"""
Recaptura os prints de um case direto do site no ar.

Os prints antigos saíram com seções inteiras vazias: animação de entrada que
não disparou, imagem lazy que nunca carregou, metade da página em branco. Este
script abre o site, rola a página inteira devagar (dispara os observers e o
lazy-load), força as imagens a carregar, volta ao topo, espera assentar e só
então fotografa. Também roda com `prefers-reduced-motion: reduce`, que nos
sites da CbM mostra o conteúdo sem depender da animação.

Uso (da raiz do repo):
    python scripts/capture-cases.py capture maison-etoile forma-viva
    python scripts/capture-cases.py build   maison-etoile forma-viva

    capture → brutos em coded-atlas/_recaptura/<slug>/ (gitignorado):
              desktop-full.png (2x), mobile-full.png (2x), sections.json,
              cand-XX.png (recortes 16:10 candidatos a "As Telas")
    build   → public/cases/<slug>/: desktop-tall, desktop-top, card,
              mobile-tall (todos .webp). As telas (hero-N/section-NN) são
              escolhidas à mão entre os candidatos: `pick` abaixo.
    pick    → python scripts/capture-cases.py pick <slug> hero=0,3,5 section=7,9,12,14
    mockups → python scripts/capture-cases.py mockups <slug>
              mockup-desktop-3d.webp (1920x1500) e mockup-mobile-3d.webp
              (1060x2000), fundo transparente, a partir dos brutos.
"""

import json
import os
import sys
import time

from PIL import Image

Image.MAX_IMAGE_PIXELS = None

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, "coded-atlas", "_recaptura")
PUB = os.path.join(ROOT, "public", "cases")

# Pasta em public/cases quando difere do slug.
FOLDER = {"machado-plataformas": "machado"}

# Esconde a barra de rolagem (aparecia como faixa na borda dos prints antigos).
BASE_CSS = """
html { scroll-behavior: auto !important; scrollbar-width: none !important; }
::-webkit-scrollbar { display: none !important; }
/* Seção fixada do GSAP (ScrollTrigger pin): o spacer reserva a altura da
   rolagem — no navegador ela vira animação, no print estático vira um bloco
   vazio (o "cinza" no meio do Machado). Recolhe o spacer. */
.pin-spacer { height: auto !important; padding: 0 !important; }
"""

TARGETS = {
    "mj-engenharia": {"url": "https://mj-engenharia-flame.vercel.app/"},
    "maison-etoile": {"url": "https://lp-interiores.vercel.app/"},
    "forma-viva": {"url": "https://forma-viva.vercel.app/"},
    "estudio-monteiro": {"url": "https://monteiro-nine.vercel.app/"},
    "machado-plataformas": {
        "url": "https://machadoplataformas.com.br/",
        # Com movimento reduzido o bloco "22+ anos" fica no tamanho inicial
        # da animação (48x48) e o número vaza por cima do parágrafo — bug do
        # site. O modo normal não serve: as entradas se desfazem fora da tela
        # e o print sai vazio. Corrige só o bloco.
        "css": """
            .sobre-kpi--hero { width: auto !important; height: auto !important; }
            .sobre-kpi--hero > * { position: relative; z-index: 1; }
        """,
    },
    "nord-arch": {"url": "https://nord-arch.vercel.app/"},
    "cafe-aroma": {
        "url": "https://cafearoma-one.vercel.app/",
        # A agenda está vazia ("Nenhum evento próximo") — estado vazio não
        # entra no portfólio. Some a seção inteira.
        "hide_sections_with_text": ["Próximos Eventos"],
    },
    "estudio-lentz": {"url": "https://estudio-lentz.vercel.app/"},
    "stige": {"url": "https://stige-rose.vercel.app/"},
    "valdete-costuras": {"url": "https://www.valdetecosturas.com.br/"},
}

DEVICES = {
    "desktop": dict(viewport={"width": 1440, "height": 900}, device_scale_factor=2),
    "mobile": dict(
        viewport={"width": 390, "height": 844},
        device_scale_factor=2,
        is_mobile=True,
        has_touch=True,
        user_agent=(
            "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) "
            "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 "
            "Mobile/15E148 Safari/604.1"
        ),
    ),
}

SETTLE_JS = """
async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  document.querySelectorAll('img[loading="lazy"]').forEach((i) => (i.loading = "eager"));
  const step = Math.round(innerHeight * 0.6);
  let y = 0;
  for (let guard = 0; guard < 400; guard++) {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (y >= max) break;
    y = Math.min(max, y + step);
    scrollTo(0, y);
    await sleep(220);
  }
  await sleep(800);
  await Promise.all(
    [...document.images].map((i) =>
      i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; setTimeout(r, 8000); })
    )
  );
  scrollTo(0, 0);
  await sleep(1500);
  // Flutuantes fixos na metade de baixo da tela (WhatsApp, barra de CTA,
  // cookies): no print de página inteira ficam carimbados por cima do texto
  // da primeira dobra. O menu do topo fica.
  for (const el of document.querySelectorAll("body *")) {
    const cs = getComputedStyle(el);
    if (cs.position !== "fixed") continue;
    const r = el.getBoundingClientRect();
    if (r.height > 0 && r.top > innerHeight * 0.5) el.style.visibility = "hidden";
  }
}
"""

HIDE_JS = """
(texts) => {
  for (const t of texts) {
    const el = [...document.querySelectorAll('h1,h2,h3')].find((h) => h.textContent.includes(t));
    const sec = el && (el.closest('section') || el.parentElement);
    if (sec) sec.style.display = 'none';
  }
}
"""

SECTIONS_JS = """
() => {
  const out = [];
  const seen = new Set();
  for (const el of document.querySelectorAll('section, header, footer, main > div')) {
    const r = el.getBoundingClientRect();
    const top = Math.round(r.top + scrollY);
    if (r.height < 280 || seen.has(top)) continue;
    seen.add(top);
    const h = el.querySelector('h1,h2,h3');
    out.push({ top, height: Math.round(r.height), heading: h ? h.textContent.trim().slice(0, 60) : '' });
  }
  return out.sort((a, b) => a.top - b.top);
}
"""


def full_shot(page, path, dpr):
    """
    Print de página inteira em fatias. O Chromium não pinta acima de 16384 px
    de altura num screenshot só: o resto sai BRANCO. Era exatamente o bug da
    Maison (branco a partir de 16384/24972 = 66% no desktop, 16384/48744 = 34%
    no mobile). Cada fatia fica abaixo do limite e a página não rola entre
    elas (clip além do viewport), então menu fixo não se repete.
    """
    import io

    w = page.evaluate("document.documentElement.clientWidth")
    h = page.evaluate("document.documentElement.scrollHeight")
    seg = int(15000 / dpr)
    sheet = Image.new("RGB", (round(w * dpr), round(h * dpr)))
    for y in range(0, h, seg):
        sh = min(seg, h - y)
        png = page.screenshot(full_page=True, clip={"x": 0, "y": y, "width": w, "height": sh})
        sheet.paste(Image.open(io.BytesIO(png)).convert("RGB"), (0, round(y * dpr)))
    sheet.save(path)


def folder(slug):
    return os.path.join(PUB, FOLDER.get(slug, slug))


def capture(slugs):
    from playwright.sync_api import sync_playwright

    with sync_playwright() as p:
        browser = p.chromium.launch()
        for slug in slugs:
            t = TARGETS[slug]
            out = os.path.join(RAW, slug)
            os.makedirs(out, exist_ok=True)
            meta = {"url": t["url"]}
            for dev, opts in DEVICES.items():
                ctx = browser.new_context(reduced_motion=t.get("motion", "reduce"), **opts)
                page = ctx.new_page()
                page.goto(t["url"], wait_until="networkidle", timeout=90000)
                page.add_style_tag(content=BASE_CSS + t.get("css", ""))
                if t.get("hide_sections_with_text"):
                    page.evaluate(HIDE_JS, t["hide_sections_with_text"])
                page.evaluate(SETTLE_JS)
                full_shot(page, os.path.join(out, f"{dev}-full.png"), opts["device_scale_factor"])
                if dev == "desktop":
                    meta["sections"] = page.evaluate(SECTIONS_JS)
                meta[f"{dev}_height"] = page.evaluate("document.documentElement.scrollHeight")
                ctx.close()
                print(f"{slug} {dev} ok")
            with open(os.path.join(out, "sections.json"), "w", encoding="utf-8") as f:
                json.dump(meta, f, ensure_ascii=False, indent=2)
            candidates(slug)
        browser.close()


def candidates(slug):
    """Recortes 16:10 (2880x1800) no topo de cada seção — material pra escolher as telas."""
    out = os.path.join(RAW, slug)
    meta = json.load(open(os.path.join(out, "sections.json"), encoding="utf-8"))
    full = Image.open(os.path.join(out, "desktop-full.png")).convert("RGB")
    scale = full.width / 1440
    tops = [0] + [s["top"] for s in meta["sections"]]
    # Site sem <section> (Monteiro) rende 2 candidatos: completa com uma
    # janela por tela.
    tops += list(range(900, int(full.height / scale), 900))
    picked = []
    for y in sorted(set(tops)):
        if picked and y - picked[-1] < 450:
            continue
        if (y + 900) * scale > full.height:
            y = full.height / scale - 900
        picked.append(y)
    meta["candidates"] = []
    for i, y in enumerate(picked):
        box = (0, round(y * scale), full.width, round((y + 900) * scale))
        full.crop(box).save(os.path.join(out, f"cand-{i:02d}.png"))
        meta["candidates"].append(round(y))
    json.dump(meta, open(os.path.join(out, "sections.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print(f"{slug}: {len(picked)} candidatos")


def save_webp(im, path, q=80):
    im.save(path, "WEBP", quality=q, method=6)
    print("  ", os.path.relpath(path, ROOT), im.size, os.path.getsize(path) // 1024, "KB")


def fit_tall(im, width, max_h=15800):
    """Largura alvo, mas sem passar de max_h (limite de decodificação no Safari/iOS)."""
    h = round(im.height * width / im.width)
    if h > max_h:
        width = round(width * max_h / h)
        h = max_h
    return im.resize((width, h), Image.LANCZOS)


def build(slugs):
    for slug in slugs:
        raw = os.path.join(RAW, slug)
        dst = folder(slug)
        os.makedirs(dst, exist_ok=True)
        print(slug)
        desk = Image.open(os.path.join(raw, "desktop-full.png")).convert("RGB")
        tall = fit_tall(desk, 1440)
        save_webp(tall, os.path.join(dst, "desktop-tall.webp"))
        top = desk.crop((0, 0, desk.width, round(desk.width * 10 / 16))).resize((1440, 900), Image.LANCZOS)
        save_webp(top, os.path.join(dst, "desktop-top.webp"))
        card_src = desk.resize((760, round(desk.height * 760 / desk.width)), Image.LANCZOS)
        save_webp(card_src.crop((0, 0, 760, 874)), os.path.join(dst, "card.webp"))
        mob = Image.open(os.path.join(raw, "mobile-full.png")).convert("RGB")
        save_webp(fit_tall(mob, 560), os.path.join(dst, "mobile-tall.webp"))


def pick(slug, args):
    raw = os.path.join(RAW, slug)
    dst = folder(slug)
    for arg in args:
        kind, idx = arg.split("=")
        for n, i in enumerate(idx.split(","), 1):
            im = Image.open(os.path.join(raw, f"cand-{int(i):02d}.png")).convert("RGB")
            name = f"hero-{n}.webp" if kind == "hero" else f"section-{n:02d}.webp"
            save_webp(im, os.path.join(dst, name))


# Mockups 3D: monitor com pé e celular em perspectiva, renderizados em HTML/CSS
# e fotografados com fundo transparente. Mesmo padrão dos mockups do Café Aroma.
MONITOR_HTML = """<!doctype html><html><head><style>
html,body{margin:0;background:transparent;width:1920px;height:1500px;overflow:hidden}
.stage{position:absolute;inset:0;perspective:2600px;perspective-origin:50% 40%}
.rig{position:absolute;left:50%;top:150px;width:1500px;margin-left:-790px;transform-style:preserve-3d;
  transform:scale(.9) rotateX(4deg) rotateY(-15deg) rotateZ(-1.2deg)}
.monitor{position:relative;width:1500px;height:952px;border-radius:26px;padding:22px;box-sizing:border-box;
  background:linear-gradient(160deg,#3a3d44 0%,#22242a 45%,#16171b 100%);
  box-shadow:inset 0 0 0 2px #4a4e57, inset 0 2px 0 3px rgba(255,255,255,.06), 0 40px 80px -30px rgba(0,0,0,.55)}
.screen{width:100%;height:100%;border-radius:8px;overflow:hidden;background:#000;position:relative}
.screen img{width:100%;height:100%;object-fit:cover;object-position:top;display:block}
.screen:after{content:"";position:absolute;inset:0;background:linear-gradient(115deg,rgba(255,255,255,.07) 0%,rgba(255,255,255,0) 38%)}
.neck{position:absolute;left:50%;top:950px;width:150px;margin-left:-75px;height:180px;
  background:linear-gradient(90deg,#2a2c32,#4b4f58 45%,#2b2d33);transform:translateZ(-60px)}
.base{position:absolute;left:50%;top:1110px;width:520px;margin-left:-260px;height:36px;border-radius:10px 10px 16px 16px;
  background:linear-gradient(180deg,#5a5e68,#2c2e34);transform:translateZ(-60px)}
.shadow{position:absolute;left:50%;top:1215px;width:1200px;height:110px;margin-left:-620px;border-radius:50%;
  background:radial-gradient(ellipse at center,rgba(0,0,0,.42) 0%,rgba(0,0,0,.18) 45%,rgba(0,0,0,0) 72%);filter:blur(14px)}
</style></head><body><div class="shadow"></div><div class="stage"><div class="rig">
<div class="neck"></div><div class="base"></div>
<div class="monitor"><div class="screen"><img src="__SRC__"></div></div>
</div></div></body></html>"""

# A faixa no topo da tela do celular leva a cor do site: a ilha da câmera
# não cobre o logo do menu.
PHONE_HTML = """<!doctype html><html><head><style>
html,body{margin:0;background:transparent;width:1060px;height:2000px;overflow:hidden}
.stage{position:absolute;inset:0;perspective:2400px;perspective-origin:50% 45%}
.rig{position:absolute;left:50%;top:110px;width:780px;margin-left:-390px;transform-style:preserve-3d;
  transform:rotateX(6deg) rotateY(18deg) rotateZ(4deg)}
.phone{position:relative;width:780px;height:1640px;border-radius:118px;padding:26px;box-sizing:border-box;
  background:linear-gradient(150deg,#45484f 0%,#24262b 40%,#141518 100%);
  box-shadow:inset 0 0 0 3px #5a5e67, inset 0 0 0 9px #17181b, 0 60px 90px -30px rgba(0,0,0,.6), -24px 40px 60px -20px rgba(0,0,0,.35)}
.screen{width:100%;height:100%;border-radius:94px;overflow:hidden;background:#000;position:relative}
.screen img{width:100%;display:block;margin-top:92px}
.island{position:absolute;top:24px;left:50%;width:200px;height:56px;margin-left:-100px;border-radius:30px;background:#050506;z-index:2}
.screen:after{content:"";position:absolute;inset:0;background:linear-gradient(120deg,rgba(255,255,255,.08) 0%,rgba(255,255,255,0) 40%)}
.btn{position:absolute;left:-7px;width:8px;border-radius:4px 0 0 4px;background:#3a3d44}
.shadow{position:absolute;left:50%;top:1770px;width:820px;height:90px;margin-left:-390px;border-radius:50%;
  background:radial-gradient(ellipse at center,rgba(0,0,0,.38) 0%,rgba(0,0,0,.15) 45%,rgba(0,0,0,0) 72%);filter:blur(16px)}
</style></head><body><div class="shadow"></div><div class="stage"><div class="rig">
<div class="phone"><div class="btn" style="top:300px;height:110px"></div><div class="btn" style="top:440px;height:110px"></div>
<div class="screen" style="background:__BG__"><div class="island"></div><img src="__SRC__"></div></div>
</div></div></body></html>"""


def _data_url(im):
    import base64
    import io

    buf = io.BytesIO()
    im.save(buf, "PNG")
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()


def mockups(slugs):
    import io

    from playwright.sync_api import sync_playwright

    with sync_playwright() as p:
        browser = p.chromium.launch()
        for slug in slugs:
            raw = os.path.join(RAW, slug)
            dst = folder(slug)
            print(slug)
            desk = Image.open(os.path.join(raw, "desktop-full.png")).convert("RGB")
            top = desk.crop((0, 0, desk.width, round(desk.width * 10 / 16))).resize((2880, 1800), Image.LANCZOS)
            mob = Image.open(os.path.join(raw, "mobile-full.png")).convert("RGB")
            mob_top = mob.crop((0, 0, mob.width, round(mob.width * 1600 / 780)))
            r, g, b = mob.crop((0, 0, mob.width, 6)).resize((1, 1), Image.LANCZOS).getpixel((0, 0))
            jobs = [
                ("mockup-desktop-3d", MONITOR_HTML.replace("__SRC__", _data_url(top)), 1920, 1500),
                (
                    "mockup-mobile-3d",
                    PHONE_HTML.replace("__SRC__", _data_url(mob_top)).replace("__BG__", f"rgb({r},{g},{b})"),
                    1060,
                    2000,
                ),
            ]
            for name, html, w, h in jobs:
                page = browser.new_page(viewport={"width": w, "height": h}, device_scale_factor=1)
                page.set_content(html, wait_until="load")
                png = page.screenshot(omit_background=True)
                page.close()
                im = Image.open(io.BytesIO(png)).convert("RGBA")
                out = os.path.join(dst, name + ".webp")
                im.save(out, "WEBP", quality=82, method=6)
                print("  ", os.path.relpath(out, ROOT), im.size, os.path.getsize(out) // 1024, "KB")
        browser.close()


if __name__ == "__main__":
    cmd, rest = sys.argv[1], sys.argv[2:]
    if cmd == "capture":
        capture(rest)
    elif cmd == "build":
        build(rest)
    elif cmd == "candidates":
        for s in rest:
            candidates(s)
    elif cmd == "pick":
        pick(rest[0], rest[1:])
    elif cmd == "mockups":
        mockups(rest)
