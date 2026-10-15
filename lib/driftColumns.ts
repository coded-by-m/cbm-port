function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

/**
 * Desktop fica em 5. No compacto o desenho pede 3.
 *
 * 3 e 9 têm divisor comum: cada coluna só repetiria três projetos. 2 é o
 * mais próximo que ainda é coprimo com 9, então cada faixa percorre os nove.
 * Com 10, 3 volta a ser coprimo e o mobile fica em 3. 5 e 10 não são
 * coprimos, mas o desktop permanece em 5 — o ritmo da parede — e a ordem
 * dos tiles em `buildTiles` é que faz cada coluna passar pelos dez.
 */
export function driftColumnCount(compact: boolean, projects: number): number {
  const preferred = compact ? 3 : 5;
  if (projects <= 1) return 1;
  const count = Math.min(preferred, projects);
  if (gcd(count, projects) === 1) return count;
  // Dez projetos: 5 colunas no desktop. A cobertura fica na ordem dos tiles.
  if (!compact && projects === 10) return 5;
  const candidates = compact ? [2, 4] : [4, 6, 7, 3];
  for (const candidate of candidates) {
    if (candidate >= 1 && candidate <= projects && gcd(candidate, projects) === 1) {
      return candidate;
    }
  }
  return count;
}
