"use client";

/**
 * Protótipos de botão que se preenche com triângulos no hover — /lab/revisao.
 *
 * X-E cascata (onda da esquerda), X-F a partir do ponto de entrada do cursor,
 * X-G um único triângulo crescendo do canto. Dois tons: `red` (ação
 * principal) e `white` (secundária). Usa a mesma malha do MeshButton (X-A).
 */

import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { cbm } from "@/lib/palette";
import { meshTris, type Size, type Tri } from "./MeshButtonConcepts";

const SIZE: Record<Size, { padX: number; padY: number; font: number; gap: number; tri: number; cell: number }> = {
  lg: { padX: 44, padY: 24, font: 15, gap: 22, tri: 16, cell: 30 },
  sm: { padX: 22, padY: 13, font: 12, gap: 14, tri: 11, cell: 20 },
};

/** Janela total da onda e duração de cada triângulo, em ms. */
const SPAN = 1000;
const STEP = 380;

export type Tone = "red" | "white";
const FILL: Record<Tone, string> = { red: cbm("red"), white: cbm("white") };

const LABEL: CSSProperties = {
  position: "relative",
  fontFamily: '"Satoshi", sans-serif',
  fontWeight: 500,
  textTransform: "uppercase",
  letterSpacing: "0.3em",
  whiteSpace: "nowrap",
  transition: `color 300ms ease ${SPAN * 0.45}ms`,
};

function base(size: Size, tone: Tone): CSSProperties {
  const s = SIZE[size];
  return {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    gap: s.gap,
    padding: `${s.padY}px ${s.padX}px`,
    fontSize: s.font,
    color: cbm("white"),
    background: cbm("page", 0.6),
    border: `1px solid ${tone === "red" ? cbm("red", 0.7) : cbm("white", 0.55)}`,
    borderRadius: 0,
    cursor: "pointer",
    overflow: "hidden",
    isolation: "isolate",
  };
}

const CSS = `
.fbx:focus-visible{outline:2px solid rgb(var(--cbm-red));outline-offset:3px}
.fbx .cell{fill-opacity:0;stroke-opacity:0;transition:fill-opacity ${STEP}ms ease, stroke-opacity ${STEP}ms ease}
.fbx.on .cell{fill-opacity:1;stroke-opacity:1}
.fbx.on .lbl{color:rgb(var(--cbm-page))}
.fbx .arrow{transition:transform .35s cubic-bezier(.22,1,.36,1), fill 300ms ease ${SPAN * 0.8}ms}
.fbx.on .arrow{transform:translateX(4px)}
.fbx.red.on .arrow{fill:rgb(var(--cbm-page))}
.fbx .wedge{clip-path:polygon(0 100%,0 100%,0 100%);transition:clip-path ${SPAN}ms cubic-bezier(.65,0,.35,1)}
.fbx.on .wedge{clip-path:polygon(0 100%,0 -250%,250% 100%)}
@media (prefers-reduced-motion: reduce){.fbx,.fbx *{transition-duration:1ms!important;transition-delay:0ms!important}}
`;
export function FillStyles() {
  return <style>{CSS}</style>;
}

/** Tamanho da caixa de borda, acompanhando redimensionamento. */
function useBox() {
  const ref = useRef<HTMLButtonElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setBox({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, box };
}

const centroid = (t: Tri) => [(t[0][0] + t[1][0] + t[2][0]) / 3, (t[0][1] + t[1][1] + t[2][1]) / 3];
const triD = (t: Tri) => `M${t.map((p) => p.map((v) => v.toFixed(1)).join(",")).join("L")}Z`;

function Arrow({ size }: { size: number }) {
  return (
    <svg className="arrow" aria-hidden width={size} height={size} viewBox="0 0 16 16" fill={cbm("red")} style={{ position: "relative", flex: "none" }}>
      <polygon points="3,2 14,8 3,14" />
    </svg>
  );
}

/**
 * X-E / X-F: cada triângulo da malha se pinta com um atraso próprio.
 * `cascata`: atraso pela posição em X. `cursor`: pela distância ao ponto onde
 * o ponteiro entrou (ou saiu, na volta).
 */
export function FillMesh({
  label,
  size = "lg",
  tone = "red",
  mode,
}: {
  label: string;
  size?: Size;
  tone?: Tone;
  mode: "cascata" | "cursor";
}) {
  const { ref, box } = useBox();
  const tris = useMemo(() => meshTris(box.w, box.h, SIZE[size].cell), [box, size]);
  const cells = useRef<(SVGPathElement | null)[]>([]);

  const stagger = (ox: number, oy: number, entering: boolean) => {
    const { w, h } = box;
    const max = Math.hypot(Math.max(ox, w - ox), Math.max(oy, h - oy)) || 1;
    tris.forEach((t, i) => {
      const [cx, cy] = centroid(t);
      const k =
        mode === "cascata"
          ? entering
            ? cx / w
            : 1 - cx / w
          : Math.hypot(cx - ox, cy - oy) / max;
      cells.current[i]?.style.setProperty("transition-delay", `${Math.round(k * (entering ? SPAN : SPAN * 0.6))}ms`);
    });
  };

  const at = (e: PointerEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top] as const;
  };

  const on = (x: number, y: number) => {
    stagger(x, y, true);
    // Um frame para os atrasos valerem antes da classe disparar a transição.
    requestAnimationFrame(() => ref.current?.classList.add("on"));
  };
  const off = (x: number, y: number) => {
    stagger(x, y, false);
    ref.current?.classList.remove("on");
  };

  return (
    <button
      ref={ref}
      className={`fbx ${tone}`}
      onPointerEnter={(e) => on(...at(e))}
      onPointerLeave={(e) => off(...at(e))}
      onFocus={() => on(0, box.h / 2)}
      onBlur={() => off(box.w, box.h / 2)}
      style={base(size, tone)}
    >
      <svg aria-hidden width={box.w} height={box.h} style={{ position: "absolute", inset: 0 }}>
        {tris.map((t, i) => (
          <path
            key={i}
            ref={(el) => {
              cells.current[i] = el;
            }}
            className="cell"
            d={triD(t)}
            fill={FILL[tone]}
            stroke={FILL[tone]}
            strokeWidth={0.8}
          />
        ))}
        {/* Os filetes ficam por cima: a malha continua legível enquanto pinta. */}
        <path d={tris.map(triD).join("")} fill="none" stroke={cbm("page")} strokeOpacity={0.25} strokeWidth={0.6} />
      </svg>
      <span className="lbl" style={LABEL}>
        {label}
      </span>
      <Arrow size={SIZE[size].tri} />
    </button>
  );
}

/** X-G: um triângulo só, crescendo do canto inferior esquerdo na diagonal. */
export function FillWedge({ label, size = "lg", tone = "red" }: { label: string; size?: Size; tone?: Tone }) {
  const ref = useRef<HTMLButtonElement>(null);
  const set = (v: boolean) => ref.current?.classList.toggle("on", v);
  return (
    <button
      ref={ref}
      className={`fbx ${tone}`}
      onPointerEnter={() => set(true)}
      onPointerLeave={() => set(false)}
      onFocus={() => set(true)}
      onBlur={() => set(false)}
      style={base(size, tone)}
    >
      <span className="wedge" aria-hidden style={{ position: "absolute", inset: 0, background: FILL[tone] }} />
      <span className="lbl" style={LABEL}>
        {label}
      </span>
      <Arrow size={SIZE[size].tri} />
    </button>
  );
}
