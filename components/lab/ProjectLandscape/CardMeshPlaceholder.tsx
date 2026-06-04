"use client";

import { useMemo } from "react";

/** PRNG determinístico (mulberry32). */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Quão maior é a malha rolável vs a janela visível. */
const SCROLL_FACTOR = 3.6;
/** Tempo (s) de um ciclo completo de scroll (descer + voltar). */
const SCROLL_DURATION = 18;

type Props = {
  /** "desktop" (16:10) ou "mobile" (9:16). */
  variant: "desktop" | "mobile";
  /** Seed estável (use o seed do slot pra cada placeholder ter padrão único). */
  seed: number;
  /** Texto opcional sobreposto (ex: "Em breve"). */
  label?: string;
};

/**
 * Placeholder triangulado com efeito de "página rolando".
 *
 * SVG procedural ~3.6× mais alto que o container. Animação CSS infinita
 * desliza a SVG verticalmente, simulando a sensação de "o site passando"
 * dentro do frame do preview (desktop ou mobile).
 *
 * Quando o usuário tiver imagens reais, basta substituir por `<img>` com
 * altura proporcional e a mesma classe `.preview-scroll`.
 */
export function CardMeshPlaceholder({ variant, seed, label }: Props) {
  const cols = variant === "desktop" ? 12 : 6;
  const baseRows = variant === "desktop" ? 7 : 14;
  const totalRows = Math.round(baseRows * SCROLL_FACTOR);
  const viewBoxH = Math.round((baseRows * SCROLL_FACTOR * 100) / baseRows);
  const jitter = 0.32;

  const pathD = useMemo(() => {
    const rand = mulberry32(seed);
    const points: { x: number; y: number }[] = [];
    for (let r = 0; r <= totalRows; r += 1) {
      for (let c = 0; c <= cols; c += 1) {
        const isEdge = c === 0 || c === cols;
        const baseX = (c / cols) * 100;
        const baseY = (r / totalRows) * viewBoxH;
        const jx = isEdge ? 0 : (rand() * 2 - 1) * jitter * (100 / cols);
        const jy = (rand() * 2 - 1) * jitter * (viewBoxH / totalRows);
        points.push({ x: baseX + jx, y: baseY + jy });
      }
    }
    let d = "";
    for (let r = 0; r < totalRows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const a = r * (cols + 1) + c;
        const b = a + 1;
        const cc = a + (cols + 1);
        const dd = cc + 1;
        for (const tri of [
          [a, cc, b],
          [b, cc, dd],
        ]) {
          const p0 = points[tri[0]];
          const p1 = points[tri[1]];
          const p2 = points[tri[2]];
          d +=
            `M${p0.x.toFixed(2)},${p0.y.toFixed(2)} ` +
            `L${p1.x.toFixed(2)},${p1.y.toFixed(2)} ` +
            `L${p2.x.toFixed(2)},${p2.y.toFixed(2)} Z `;
        }
      }
    }
    return d;
  }, [cols, totalRows, viewBoxH, seed]);

  const aspectClass =
    variant === "desktop" ? "aspect-[16/10]" : "aspect-[9/16]";

  // Distância de scroll (em %): % do container que a SVG cobre além do visível.
  const scrollPercent = (SCROLL_FACTOR - 1) * 100;

  return (
    <div
      className={`relative w-full overflow-hidden border border-[#F5F2ED]/20 bg-[#000F08] ${aspectClass}`}
    >
      <svg
        aria-hidden
        viewBox={`0 0 100 ${viewBoxH}`}
        preserveAspectRatio="none"
        className="preview-scroll absolute left-0 top-0 w-full"
        style={{
          height: `${SCROLL_FACTOR * 100}%`,
          // Animação CSS embutida via custom property + keyframes globais
          // (definidas inline abaixo). Reduce-motion para a animação.
          animation: `card-preview-scroll ${SCROLL_DURATION}s ease-in-out infinite`,
        }}
      >
        <path
          d={pathD}
          stroke="#F5F2ED"
          strokeWidth={0.4}
          fill="none"
          vectorEffect="non-scaling-stroke"
          style={{ opacity: 0.4 }}
        />
      </svg>
      {label && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <p className="bg-[#000F08]/55 px-3 py-1 text-[0.55rem] uppercase tracking-[0.4em] text-[#F5F2ED]/70 backdrop-blur-sm">
            {label}
          </p>
        </div>
      )}
      <style>{`
        @keyframes card-preview-scroll {
          0%   { transform: translateY(0%); }
          50%  { transform: translateY(-${scrollPercent}%); }
          100% { transform: translateY(0%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .preview-scroll { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
