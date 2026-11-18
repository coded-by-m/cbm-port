import { mulberry32 } from "@/components/ui/triMesh";

/**
 * Terreno triangulado em perspectiva: a mesma geometria do hero da home, sem
 * WebGL. É SVG estático gerado no servidor (a página é estática, então roda
 * só no build): custa um caminho no HTML e nenhum JavaScript.
 *
 * O caminho é desenhado uma vez, na abertura (`define`), e reaproveitado no
 * contato com `<use>`, para a página abrir e fechar sobre o mesmo chão.
 *
 * Uma única face sai em vermelho: o sinal da marca, raro por regra.
 */

const W = 1440;
const H = 560;
const COLS = 28;
const ROWS = 13;
/** Linha do horizonte, em unidades do viewBox. */
const HORIZON = 36;

type P = [number, number];

function build() {
  const rand = mulberry32(911);
  const grid: P[][] = [];

  for (let r = 0; r <= ROWS; r++) {
    // `t` vai do fundo (0) para a frente (1); as fileiras abrem perto do olho.
    const t = r / ROWS;
    const depth = Math.pow(t, 1.75);
    const y0 = HORIZON + (H - HORIZON) * depth;
    const spread = 0.95 + 1.9 * t;
    const amp = 6 + 74 * depth;
    const row: P[] = [];
    for (let c = 0; c <= COLS; c++) {
      const u = c / COLS - 0.5;
      const edge = r === 0;
      const jx = edge ? 0 : (rand() * 2 - 1) * 0.28;
      const jy = edge ? 0 : (rand() * 2 - 1) * 0.3;
      const wave =
        Math.sin(c * 0.52 + r * 0.34) * 0.55 +
        Math.sin(c * 0.21 - r * 0.73 + 1.3) * 0.45 +
        Math.sin(c * 1.37 + r * 1.9) * 0.12;
      const x = W / 2 + (u + jx / COLS) * W * spread;
      const y = y0 - wave * amp + jy * amp * 0.4;
      row.push([Math.round(x), Math.round(y)]);
    }
    grid.push(row);
  }

  const seg = (a: P, b: P) => `M${a[0]} ${a[1]}L${b[0]} ${b[1]}`;
  let d = "";
  for (let r = 0; r <= ROWS; r++) {
    for (let c = 0; c <= COLS; c++) {
      const p = grid[r][c];
      if (c < COLS) d += seg(p, grid[r][c + 1]);
      if (r < ROWS) d += seg(p, grid[r + 1][c]);
      if (r < ROWS && c < COLS) {
        // Diagonal alternada: a malha não vira grade de losangos iguais.
        d += (r + c) % 2 === 0 ? seg(p, grid[r + 1][c + 1]) : seg(grid[r][c + 1], grid[r + 1][c]);
      }
    }
  }

  // A face vermelha: perto da frente, à direita, onde a figura da abertura assenta.
  const r = ROWS - 4;
  const c = Math.round(COLS * 0.7);
  const signal = [grid[r][c], grid[r][c + 1], grid[r + 1][c + 1]].map((p) => p.join(",")).join(" ");

  return { d, signal };
}

const MESH = build();

export function Terrain({ define = false, className }: { define?: boolean; className?: string }) {
  return (
    <svg
      aria-hidden
      focusable="false"
      className={["cs-terrain", className].filter(Boolean).join(" ")}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMax slice"
    >
      {define ? (
        <path id="cs-terrain-mesh" className="cs-terrain-mesh" d={MESH.d} vectorEffect="non-scaling-stroke" />
      ) : (
        <use href="#cs-terrain-mesh" className="cs-terrain-mesh" />
      )}
      <polygon className="cs-terrain-signal" points={MESH.signal} pathLength={100} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
