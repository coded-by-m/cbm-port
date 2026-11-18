import { mulberry32 } from "@/components/ui/triMesh";

/**
 * Terreno triangulado em perspectiva: a geometria do hero da home, sem WebGL.
 * Fileiras que abrem perto do olho, ondas somadas e jitter determinístico (a
 * malha é a mesma a cada build). Devolve o SVG inteiro, pronto para servir.
 *
 * Uma única face sai em vermelho: o sinal da marca, raro por regra.
 */

export const TERRAIN_W = 1440;
export const TERRAIN_H = 560;
/** Linha do horizonte, em unidades do viewBox. */
const HORIZON = 30;

type P = [number, number];

export function terrainSvg({
  cols,
  rows,
  stroke,
  strokeOpacity,
  signal,
}: {
  cols: number;
  rows: number;
  stroke: string;
  strokeOpacity: number;
  signal: string;
}): string {
  const W = TERRAIN_W;
  const H = TERRAIN_H;
  const rand = mulberry32(911);
  const grid: P[][] = [];

  for (let r = 0; r <= rows; r++) {
    // `t` vai do fundo (0) para a frente (1).
    const t = r / rows;
    const depth = Math.pow(t, 1.75);
    const y0 = HORIZON + (H - HORIZON) * depth;
    const spread = 0.95 + 1.9 * t;
    const amp = 4 + 52 * depth;
    const row: P[] = [];
    for (let c = 0; c <= cols; c++) {
      const u = c / cols - 0.5;
      const edge = r === 0;
      const jx = edge ? 0 : (rand() * 2 - 1) * 0.28;
      const jy = edge ? 0 : (rand() * 2 - 1) * 0.3;
      const wave =
        Math.sin(c * 0.36 + r * 0.3) * 0.55 +
        Math.sin(c * 0.15 - r * 0.6 + 1.3) * 0.45 +
        Math.sin(c * 1.1 + r * 1.7) * 0.12;
      const x = W / 2 + (u + jx / cols) * W * spread;
      const y = y0 - wave * amp + jy * amp * 0.4;
      row.push([Math.round(x), Math.round(y)]);
    }
    grid.push(row);
  }

  const seg = (a: P, b: P) => `M${a[0]} ${a[1]}L${b[0]} ${b[1]}`;
  let d = "";
  for (let r = 0; r <= rows; r++) {
    for (let c = 0; c <= cols; c++) {
      const p = grid[r][c];
      if (c < cols) d += seg(p, grid[r][c + 1]);
      if (r < rows) d += seg(p, grid[r + 1][c]);
      if (r < rows && c < cols) {
        // Diagonal alternada: a malha não vira grade de losangos iguais.
        d += (r + c) % 2 === 0 ? seg(p, grid[r + 1][c + 1]) : seg(grid[r][c + 1], grid[r + 1][c]);
      }
    }
  }

  // A face vermelha: perto da frente, à direita.
  const r = rows - 5;
  const c = Math.round(cols * 0.68);
  const face = [grid[r][c], grid[r][c + 1], grid[r + 1][c + 1]].map((p) => p.join(",")).join(" ");

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice">` +
    `<path d="${d}" fill="none" stroke="${stroke}" stroke-opacity="${strokeOpacity}" stroke-width="1" vector-effect="non-scaling-stroke"/>` +
    `<polygon points="${face}" fill="none" stroke="${signal}" stroke-width="1.5" vector-effect="non-scaling-stroke"/>` +
    `</svg>`
  );
}
