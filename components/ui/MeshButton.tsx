"use client";

import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  type ButtonHTMLAttributes,
  type PointerEvent,
} from "react";

const COLS = 14;
const ROWS = 4;
const JITTER = 0.34;
const SEED = 137;

/** Velocidade e amplitudes da animação ambiente da malha. */
const MOTION = {
  speed: 0.55,
  ampY: 2.4,
  ampX: 0.9,
  freqX: 0.07,
  freqY: 0.11,
} as const;

/**
 * PRNG determinístico (mulberry32) — garante que cada montagem gera o mesmo
 * jitter de vértices, mantendo a mesh estável entre re-renders.
 */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Gera uma malha triangulada procedural análoga à do terreno em coordenadas
 * normalizadas (0..100). Vértices das bordas ficam alinhados pra preservar a
 * moldura retangular; vértices internos recebem jitter.
 */
function buildMesh() {
  const rand = mulberry32(SEED);
  const points: { x: number; y: number }[] = [];
  for (let r = 0; r <= ROWS; r += 1) {
    for (let c = 0; c <= COLS; c += 1) {
      const isEdge = r === 0 || r === ROWS || c === 0 || c === COLS;
      const baseX = (c / COLS) * 100;
      const baseY = (r / ROWS) * 100;
      const jx = isEdge ? 0 : (rand() * 2 - 1) * JITTER * (100 / COLS);
      const jy = isEdge ? 0 : (rand() * 2 - 1) * JITTER * (100 / ROWS);
      points.push({ x: baseX + jx, y: baseY + jy });
    }
  }
  const tris: number[][] = [];
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLS; c += 1) {
      const a = r * (COLS + 1) + c;
      const b = a + 1;
      const cc = a + (COLS + 1);
      const d = cc + 1;
      tris.push([a, cc, b], [b, cc, d]);
    }
  }
  return { points, tris };
}

export type MeshButtonProps = {
  /** Texto do botão. Será dividido em palavras para animação por palavra. */
  label: string;
  /** Mostrar a seta vermelha à direita (default true). */
  showArrow?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

/**
 * MeshButton — botão **principal** do design system Coded by M.
 *
 * Assinatura visual da marca:
 *  - Malha triangulada procedural como fundo (mesma família do terreno/logo).
 *  - Halo radial seguindo o cursor (DOM direto, zero re-renders).
 *  - Animação ambiente da malha (rAF, vértices internos oscilam).
 *  - Border off-white sólida + fundo escuro com backdrop-blur.
 *  - Seta Signal Red opcional como acento de "ação à frente".
 *
 * Usar para o CTA primário de qualquer seção (Hero, Philosophy, CTA Final).
 * Mantém a className `word` no root pra integração com timelines GSAP que
 * animem suas palavras (split via stagger).
 */
export const MeshButton = forwardRef<HTMLButtonElement, MeshButtonProps>(
  function MeshButton(
    { label, showArrow = true, className = "", onPointerMove, onPointerLeave, ...rest },
    ref,
  ) {
    const mesh = useMemo(buildMesh, []);
    const glowRef = useRef<HTMLSpanElement>(null);
    const pathRef = useRef<SVGPathElement>(null);

    const initialPath = useMemo(
      () =>
        mesh.tris
          .map((t) => {
            const p0 = mesh.points[t[0]];
            const p1 = mesh.points[t[1]];
            const p2 = mesh.points[t[2]];
            return `M${p0.x.toFixed(2)},${p0.y.toFixed(2)} L${p1.x.toFixed(2)},${p1.y.toFixed(2)} L${p2.x.toFixed(2)},${p2.y.toFixed(2)} Z`;
          })
          .join(" "),
      [mesh],
    );

    // Animação ambiente da malha — atualização via DOM direto (zero re-renders).
    useEffect(() => {
      let raf = 0;
      const start = performance.now();
      const tick = (now: number) => {
        const t = ((now - start) / 1000) * MOTION.speed;
        let d = "";
        for (let i = 0; i < mesh.tris.length; i += 1) {
          const tri = mesh.tris[i];
          const p0 = mesh.points[tri[0]];
          const p1 = mesh.points[tri[1]];
          const p2 = mesh.points[tri[2]];
          const dx0 =
            p0.x === 0 || p0.x === 100
              ? 0
              : Math.sin(t + p0.y * MOTION.freqY) * MOTION.ampX;
          const dy0 =
            p0.y === 0 || p0.y === 100
              ? 0
              : Math.sin(t * 0.9 + p0.x * MOTION.freqX) * MOTION.ampY;
          const dx1 =
            p1.x === 0 || p1.x === 100
              ? 0
              : Math.sin(t + p1.y * MOTION.freqY) * MOTION.ampX;
          const dy1 =
            p1.y === 0 || p1.y === 100
              ? 0
              : Math.sin(t * 0.9 + p1.x * MOTION.freqX) * MOTION.ampY;
          const dx2 =
            p2.x === 0 || p2.x === 100
              ? 0
              : Math.sin(t + p2.y * MOTION.freqY) * MOTION.ampX;
          const dy2 =
            p2.y === 0 || p2.y === 100
              ? 0
              : Math.sin(t * 0.9 + p2.x * MOTION.freqX) * MOTION.ampY;
          d +=
            `M${(p0.x + dx0).toFixed(2)},${(p0.y + dy0).toFixed(2)} ` +
            `L${(p1.x + dx1).toFixed(2)},${(p1.y + dy1).toFixed(2)} ` +
            `L${(p2.x + dx2).toFixed(2)},${(p2.y + dy2).toFixed(2)} Z `;
        }
        if (pathRef.current) pathRef.current.setAttribute("d", d);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, [mesh]);

    const handlePointerMove = (e: PointerEvent<HTMLButtonElement>) => {
      const glow = glowRef.current;
      if (glow) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        glow.style.background = `radial-gradient(circle 110px at ${x}% ${y}%, rgba(245, 242, 237, 0.22) 0%, transparent 70%)`;
        glow.style.opacity = "1";
      }
      onPointerMove?.(e);
    };

    const handlePointerLeave = (e: PointerEvent<HTMLButtonElement>) => {
      const glow = glowRef.current;
      if (glow) glow.style.opacity = "0";
      onPointerLeave?.(e);
    };

    return (
      <button
        ref={ref}
        type="button"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className={[
          "word group relative inline-flex items-center gap-6 overflow-hidden border border-[#F5F2ED]/55 bg-[#000F08]/60 px-12 py-7 text-base uppercase tracking-[0.3em] text-[#F5F2ED] backdrop-blur-sm transition-colors duration-500 hover:border-[#F5F2ED] hover:bg-[#000F08]/80 sm:text-lg",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          fontFamily: '"Satoshi", sans-serif',
          fontWeight: 500,
          letterSpacing: "0.3em",
        }}
        {...rest}
      >
        {/* Malha triangulada procedural — animada por DOM direto. */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            ref={pathRef}
            d={initialPath}
            stroke="#F5F2ED"
            strokeWidth={0.35}
            fill="none"
            vectorEffect="non-scaling-stroke"
            className="opacity-[0.55] transition-opacity duration-500 group-hover:opacity-[0.9]"
          />
        </svg>

        {/* Halo radial seguindo o cursor. */}
        <span
          ref={glowRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
        />

        {/* Wash diagonal Signal Red — entra no hover. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(120deg, transparent 0%, rgba(251, 54, 64, 0.08) 50%, transparent 100%)",
          }}
        />

        <span className="relative">{label}</span>
        {showArrow && (
          <svg
            aria-hidden
            width="18"
            height="18"
            viewBox="0 0 16 16"
            fill="#FB3640"
            className="relative inline-block group-hover:animate-[spin_1.4s_linear_infinite]"
          >
            <polygon points="3,2 14,8 3,14" />
          </svg>
        )}
      </button>
    );
  },
);
