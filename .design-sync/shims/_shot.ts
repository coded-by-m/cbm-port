// Gerador de screenshot sintetico, na paleta da marca.
//
// Usado pelo shim de @/data/cases. O mesmo desenho existe, de forma
// independente, em .design-sync/previews/_fixtures.tsx — os dois lados vivem em
// mundos diferentes (um entra no bundle, o outro so nos previews) e manter a
// duplicacao e mais barato que acoplar os dois.

const INK = "#F5F2ED";
const BASE = "#000F08";
const SIGNAL = "#FB3640";

export function shot(w: number, h: number, accent: string = SIGNAL): string {
  const bar = Math.round(h * 0.06);
  const rows = Array.from({ length: 5 }, (_, i) => {
    const y = bar + Math.round(h * 0.14) + i * Math.round(h * 0.09);
    const rw = Math.round(w * (i % 2 ? 0.52 : 0.68));
    return `<rect x="${Math.round(w * 0.08)}" y="${y}" width="${rw}" height="${Math.max(
      3,
      Math.round(h * 0.022),
    )}" fill="${INK}" opacity="${0.16 + i * 0.03}"/>`;
  }).join("");
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
    `<rect width="${w}" height="${h}" fill="#070B08"/>` +
    `<rect width="${w}" height="${bar}" fill="${BASE}"/>` +
    `<circle cx="${Math.round(w * 0.06)}" cy="${Math.round(bar / 2)}" r="${Math.max(
      2,
      Math.round(bar * 0.16),
    )}" fill="${accent}"/>` +
    `<rect x="${Math.round(w * 0.08)}" y="${bar + Math.round(h * 0.05)}" width="${Math.round(
      w * 0.44,
    )}" height="${Math.round(h * 0.045)}" fill="${INK}" opacity="0.82"/>` +
    rows +
    `<rect x="${Math.round(w * 0.08)}" y="${Math.round(h * 0.78)}" width="${Math.round(
      w * 0.24,
    )}" height="${Math.round(h * 0.05)}" fill="${accent}"/>` +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/** Proporcao escolhida pela pista no nome do arquivo original. */
export function shotFor(path: string): string {
  if (/mobile|phone/i.test(path)) return shot(390, 844);
  if (/card/i.test(path)) return shot(760, 874);
  return shot(1280, 800);
}
