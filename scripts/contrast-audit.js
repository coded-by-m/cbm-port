// Auditoria de contraste do texto renderizado (rodar no console do navegador
// ou via Playwright `page.evaluate`). Devolve os textos visíveis abaixo do
// mínimo WCAG AA: 4.5:1 para texto normal, 3:1 para texto grande
// (≥ 24px, ou ≥ 18.66px com peso ≥ 700).
//
// Cor do texto e fundo são compostos com alpha. O fundo é o primeiro ancestral
// com background-color opaco o bastante; canvas e imagem de fundo não entram na
// conta (o resultado ali é aproximado e vem marcado como `overImage`).
(() => {
  const parse = (c) => {
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const over = (top, bottom) => ({
    r: top.r * top.a + bottom.r * (1 - top.a),
    g: top.g * top.a + bottom.g * (1 - top.a),
    b: top.b * top.a + bottom.b * (1 - top.a),
    a: 1,
  });
  const lum = ({ r, g, b }) =>
    [r, g, b]
      .map((v) => v / 255)
      .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
      .reduce((s, c, i) => s + c * [0.2126, 0.7152, 0.0722][i], 0);
  const ratio = (a, b) => {
    const [h, l] = [lum(a), lum(b)].sort((x, y) => y - x);
    return (h + 0.05) / (l + 0.05);
  };

  const bgOf = (el) => {
    const stack = [];
    let overImage = false;
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.backgroundImage !== "none") overImage = true;
      const c = parse(cs.backgroundColor);
      if (c && c.a > 0) {
        stack.push(c);
        if (c.a >= 0.95) break;
      }
    }
    let bg = parse(getComputedStyle(document.body).backgroundColor) || { r: 10, g: 10, b: 10, a: 1 };
    for (let i = stack.length - 1; i >= 0; i--) bg = over(stack[i], bg);
    return { bg, overImage };
  };

  const out = [];
  const seen = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const t = walker.currentNode;
    const text = t.textContent.trim();
    if (!text) continue;
    const el = t.parentElement;
    if (!el || seen.has(el)) continue;
    seen.add(el);
    if (el.closest("[aria-hidden='true'], svg, script, style, noscript")) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none") continue;
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) continue;
    let op = 1;
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) op *= Number(getComputedStyle(n).opacity);
    if (op < 0.05) continue;
    const fg = parse(cs.color);
    if (!fg) continue;
    const { bg, overImage } = bgOf(el);
    const eff = over({ ...fg, a: fg.a * op }, bg);
    const r = ratio(eff, bg);
    const size = parseFloat(cs.fontSize);
    const bold = Number(cs.fontWeight) >= 700;
    const large = size >= 24 || (size >= 18.66 && bold);
    const min = large ? 3 : 4.5;
    if (r < min)
      out.push({
        text: text.slice(0, 50),
        ratio: Math.round(r * 100) / 100,
        min,
        size,
        color: cs.color,
        opacity: Math.round(op * 100) / 100,
        overImage,
        cls: (el.className && el.className.baseVal === undefined ? el.className : "").toString().slice(0, 60),
        tag: el.tagName.toLowerCase(),
      });
  }
  return out.sort((a, b) => a.ratio - b.ratio);
})();
