"use client";

/**
 * Protótipos de refatoração do MeshButton — só para o /lab/revisao.
 *
 * Quatro direções que mantêm a identidade triangular. Nada aqui é usado pelo
 * site: a escolhida vira o novo components/ui/MeshButton.tsx depois.
 *
 * Em comum: malha/facetas geradas na proporção REAL do botão (sem esticar),
 * zero animação em repouso, foco visível e dois tamanhos.
 */

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { cbm } from "@/lib/palette";

export type Size = "lg" | "sm";

const SIZE: Record<Size, { padX: number; padY: number; font: number; gap: number; tri: number }> = {
  lg: { padX: 44, padY: 24, font: 15, gap: 22, tri: 16 },
  sm: { padX: 22, padY: 13, font: 12, gap: 14, tri: 11 },
};

const LABEL: CSSProperties = {
  position: "relative",
  fontFamily: '"Satoshi", sans-serif',
  fontWeight: 500,
  textTransform: "uppercase",
  letterSpacing: "0.3em",
  whiteSpace: "nowrap",
};

/** Base comum: botão reto, sem estilo nativo, com foco visível. */
function baseStyle(size: Size): CSSProperties {
  const s = SIZE[size];
  return {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    gap: s.gap,
    padding: `${s.padY}px ${s.padX}px`,
    fontSize: s.font,
    color: cbm("white"),
    background: "transparent",
    border: 0,
    borderRadius: 0,
    cursor: "pointer",
    overflow: "hidden",
    isolation: "isolate",
  };
}

function useSize(ref: RefObject<HTMLElement>) {
  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Caixa de borda: a malha cobre o padding também.
    const ro = new ResizeObserver(() =>
      setSize({ w: Math.round(el.clientWidth), h: Math.round(el.clientHeight) }),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return size;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Triangle({ size, color = cbm("red"), style }: { size: number; color?: string; style?: CSSProperties }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 16 16" style={{ flex: "none", ...style }}>
      <polygon points="3,2 14,8 3,14" fill={color} />
    </svg>
  );
}

const FOCUS_CSS = `
.mbx:focus-visible{outline:2px solid rgb(var(--cbm-red));outline-offset:3px}
@media (prefers-reduced-motion: reduce){.mbx,.mbx *{transition-duration:1ms!important}}
`;
export function ConceptStyles() {
  return <style>{FOCUS_CSS}</style>;
}

/* ------------------------------------------------------------------------ */
/* A. Malha que acorda                                                       */
/* ------------------------------------------------------------------------ */

export type Tri = [number, number][];

/** Malha em pixels reais: células ~`cell`px, bordas retas, miolo com jitter. */
export function meshTris(w: number, h: number, cell = 22): Tri[] {
  if (!w || !h) return [];
  const cols = Math.max(2, Math.round(w / cell));
  const rows = Math.max(2, Math.round(h / cell));
  const rand = mulberry32(137);
  const pts: [number, number][] = [];
  for (let r = 0; r <= rows; r++)
    for (let c = 0; c <= cols; c++) {
      const edge = r === 0 || r === rows || c === 0 || c === cols;
      const jx = edge ? 0 : (rand() * 2 - 1) * 0.32 * (w / cols);
      const jy = edge ? 0 : (rand() * 2 - 1) * 0.32 * (h / rows);
      pts.push([(c / cols) * w + jx, (r / rows) * h + jy]);
    }
  const out: Tri[] = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const a = r * (cols + 1) + c;
      const b = a + 1;
      const e = a + cols + 1;
      const f = e + 1;
      // Alterna a diagonal para o padrão não ler como grade.
      const idx = (r + c) % 2 ? [[a, e, b], [b, e, f]] : [[a, e, f], [a, f, b]];
      for (const t of idx) out.push(t.map((i) => pts[i]));
    }
  return out;
}

const triD = (t: Tri) => `M${t.map((p) => p.map((v) => v.toFixed(1)).join(",")).join("L")}Z`;

function meshPath(w: number, h: number, cell = 22) {
  return meshTris(w, h, cell).map(triD).join("");
}

export function ConceptA({ label, size = "lg" }: { label: string; size?: Size }) {
  const ref = useRef<HTMLButtonElement>(null);
  const { w, h } = useSize(ref);
  const d = useMemo(() => meshPath(w, h, size === "lg" ? 30 : 22), [w, h, size]);

  const move = (e: PointerEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const svg = (opacity: number, extra?: CSSProperties) => (
    <svg aria-hidden width={w} height={h} style={{ position: "absolute", inset: 0, ...extra }}>
      <path d={d} fill="none" stroke={cbm("white")} strokeWidth={1} opacity={opacity} />
    </svg>
  );

  return (
    <button
      ref={ref}
      className="mbx mbx-a"
      onPointerMove={move}
      style={{ ...baseStyle(size), border: `1px solid ${cbm("white", 0.55)}`, background: cbm("page", 0.6) }}
    >
      <style>{`
        .mbx-a .lit{opacity:0;transition:opacity .35s ease;
          -webkit-mask-image:radial-gradient(circle 90px at var(--mx,50%) var(--my,50%),#000 0%,transparent 75%);
          mask-image:radial-gradient(circle 90px at var(--mx,50%) var(--my,50%),#000 0%,transparent 75%)}
        .mbx-a:hover .lit,.mbx-a:focus-visible .lit{opacity:1}
        .mbx-a:focus-visible{--mx:50%;--my:50%}
        .mbx-a{transition:border-color .4s}
        .mbx-a:hover{border-color:rgb(var(--cbm-white))!important}
        .mbx-a .tri{transition:transform .35s cubic-bezier(.22,1,.36,1)}
        .mbx-a:hover .tri{transform:translateX(4px)}
      `}</style>
      {svg(0.08)}
      {/* Mesma malha, acesa — só aparece dentro do círculo do cursor (mask). */}
      <span className="lit" style={{ position: "absolute", inset: 0 }}>
        {svg(0.85)}
      </span>
      <span style={LABEL}>{label}</span>
      <span className="tri" style={{ display: "inline-flex" }}>
        <Triangle size={SIZE[size].tri} />
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------------ */
/* B. Corte diagonal                                                         */
/* ------------------------------------------------------------------------ */

export function ConceptB({ label, size = "lg" }: { label: string; size?: Size }) {
  const cut = size === "lg" ? 20 : 13;
  const clip = `polygon(0 0,100% 0,100% calc(100% - ${cut}px),calc(100% - ${cut}px) 100%,0 100%)`;
  return (
    <button className="mbx mbx-b" style={{ ...baseStyle(size), padding: 0 }}>
      <style>{`
        .mbx-b .edge{transition:background .4s}
        .mbx-b:hover .edge{background:rgb(var(--cbm-red))!important}
        .mbx-b .sweep{transform:translateX(-110%) skewX(-45deg);transition:transform .55s cubic-bezier(.22,1,.36,1)}
        .mbx-b:hover .sweep,.mbx-b:focus-visible .sweep{transform:translateX(-8%) skewX(-45deg)}
        .mbx-b .lbl{transition:color .4s .05s}
        .mbx-b:hover .lbl,.mbx-b:focus-visible .lbl{color:rgb(var(--cbm-page))}
        .mbx-b .corner{transition:opacity .3s}
        .mbx-b:hover .corner{opacity:0}
      `}</style>
      {/* Borda: camada cortada atrás do miolo; aparece como filete de 1px. */}
      <span
        className="edge"
        aria-hidden
        style={{ position: "absolute", inset: 0, background: cbm("white", 0.55), clipPath: clip }}
      />
      {/* Miolo: 1px para dentro, mesmo corte. */}
      <span
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          gap: SIZE[size].gap,
          margin: 1,
          padding: `${SIZE[size].padY - 1}px ${SIZE[size].padX + cut / 2}px ${SIZE[size].padY - 1}px ${SIZE[size].padX - 1}px`,
          background: cbm("page"),
          clipPath: `polygon(0 0,100% 0,100% calc(100% - ${cut - 0.6}px),calc(100% - ${cut - 0.6}px) 100%,0 100%)`,
          overflow: "hidden",
        }}
      >
        <span
          className="sweep"
          aria-hidden
          style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "130%", background: cbm("red") }}
        />
        <span className="lbl" style={LABEL}>
          {label}
        </span>
      </span>
      {/* O triângulo mora no corte: aponta para fora, na diagonal do logo. */}
      <svg
        className="corner"
        aria-hidden
        width={cut}
        height={cut}
        viewBox="0 0 10 10"
        style={{ position: "absolute", right: 0, bottom: 0 }}
      >
        <polygon points="10,0 10,10 0,10" fill={cbm("red")} />
      </svg>
    </button>
  );
}

/* ------------------------------------------------------------------------ */
/* C. Triângulo protagonista                                                 */
/* ------------------------------------------------------------------------ */

export function ConceptC({ label, size = "lg" }: { label: string; size?: Size }) {
  const t = SIZE[size].tri;
  return (
    <button
      className="mbx mbx-c"
      style={{ ...baseStyle(size), border: `1px solid ${cbm("white", 0.4)}`, background: cbm("page") }}
    >
      <style>{`
        .mbx-c{transition:border-color .4s}
        .mbx-c:hover{border-color:rgb(var(--cbm-white))!important}
        .mbx-c .line{transform:scaleX(0);transform-origin:left;transition:transform .5s cubic-bezier(.22,1,.36,1)}
        .mbx-c:hover .line,.mbx-c:focus-visible .line{transform:scaleX(1)}
        .mbx-c .solid{transition:transform .45s cubic-bezier(.22,1,.36,1)}
        .mbx-c:hover .solid,.mbx-c:focus-visible .solid{transform:translateX(${Math.round(t * 0.9)}px)}
        .mbx-c .ghost{opacity:0;transition:opacity .2s, transform .6s cubic-bezier(.22,1,.36,1)}
        .mbx-c:hover .g1,.mbx-c:focus-visible .g1{opacity:.55;transform:translateX(${Math.round(t * 0.45)}px)}
        .mbx-c:hover .g2,.mbx-c:focus-visible .g2{opacity:.25}
      `}</style>
      <span style={LABEL}>{label}</span>
      <span style={{ position: "relative", display: "inline-flex", width: t * 2, height: t }}>
        {[1, 2].map((g) => (
          <svg
            key={g}
            className={`ghost g${g}`}
            aria-hidden
            width={t}
            height={t}
            viewBox="0 0 16 16"
            style={{ position: "absolute", left: 0, top: 0 }}
          >
            <polygon points="3,2 14,8 3,14" fill="none" stroke={cbm("red")} strokeWidth={1.4} />
          </svg>
        ))}
        <span className="solid" style={{ position: "absolute", left: 0, top: 0, display: "inline-flex" }}>
          <Triangle size={t} />
        </span>
      </span>
      {/* Filete vermelho que se desenha na base — "hover revela". */}
      <span
        className="line"
        aria-hidden
        style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 2, background: cbm("red") }}
      />
    </button>
  );
}

/* ------------------------------------------------------------------------ */
/* D. Facetas                                                                */
/* ------------------------------------------------------------------------ */

interface Facet {
  pts: [number, number][];
  /** Inclinação fictícia da faceta — define como ela pega a luz. */
  nx: number;
  ny: number;
}

/** 4–6 facetas grandes: um zigue-zague de vértices entre o topo e a base. */
function facets(w: number, h: number): Facet[] {
  if (!w || !h) return [];
  const n = Math.max(3, Math.min(5, Math.round(w / 90)));
  const rand = mulberry32(71);
  const top: [number, number][] = [];
  const bot: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const x = (i / n) * w;
    const j = i === 0 || i === n ? 0 : (rand() - 0.5) * (w / n) * 0.6;
    top.push([x + j, 0]);
    bot.push([x - j * 0.5 + (i === 0 || i === n ? 0 : (w / n) * 0.35), h]);
  }
  const out: Facet[] = [];
  for (let i = 0; i < n; i++) {
    const tilt = () => rand() * 2 - 1;
    out.push({ pts: [top[i], bot[i], top[i + 1]], nx: tilt(), ny: tilt() });
    out.push({ pts: [top[i + 1], bot[i], bot[i + 1]], nx: tilt(), ny: tilt() });
  }
  return out;
}

export function ConceptD({ label, size = "lg" }: { label: string; size?: Size }) {
  const ref = useRef<HTMLButtonElement>(null);
  const polys = useRef<(SVGPolygonElement | null)[]>([]);
  const { w, h } = useSize(ref);
  const list = useMemo(() => facets(w, h), [w, h]);

  /** Luz vinda de (lx, ly) em -1..1: cada faceta clareia pelo alinhamento. */
  const light = (lx: number, ly: number, boost = 0) => {
    list.forEach((f, i) => {
      const k = (f.nx * lx + f.ny * ly) * 0.5 + 0.5; // 0..1
      polys.current[i]?.setAttribute("fill-opacity", (0.03 + k * (0.11 + boost)).toFixed(3));
    });
  };

  useEffect(() => light(-0.7, -0.7), [list]); // luz de repouso: canto superior esquerdo

  const move = (e: PointerEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    light(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1, 0.05);
  };

  return (
    <button
      ref={ref}
      className="mbx mbx-d"
      onPointerMove={move}
      onPointerLeave={() => light(-0.7, -0.7)}
      style={{ ...baseStyle(size), border: `1px solid ${cbm("white", 0.3)}`, background: cbm("page") }}
    >
      <style>{`
        .mbx-d{transition:border-color .4s}
        .mbx-d:hover{border-color:rgb(var(--cbm-white) / .7)!important}
        .mbx-d polygon{transition:fill-opacity .25s ease}
        .mbx-d .tri{transition:transform .35s cubic-bezier(.22,1,.36,1)}
        .mbx-d:hover .tri{transform:translateX(4px)}
      `}</style>
      <svg aria-hidden width={w} height={h} style={{ position: "absolute", inset: 0 }}>
        {list.map((f, i) => (
          <polygon
            key={i}
            ref={(el) => {
              polys.current[i] = el;
            }}
            points={f.pts.map((p) => p.join(",")).join(" ")}
            fill={cbm("white")}
            fillOpacity={0.06}
            stroke={cbm("white")}
            strokeOpacity={0.08}
          />
        ))}
      </svg>
      <span style={LABEL}>{label}</span>
      <span className="tri" style={{ display: "inline-flex" }}>
        <Triangle size={SIZE[size].tri} />
      </span>
    </button>
  );
}

/** Linha do lab: o mesmo conceito em lg e sm, lado a lado. */
export function ConceptRow({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 28, padding: 28 }}>{children}</div>
  );
}
