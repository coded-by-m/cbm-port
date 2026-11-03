"use client";

import {
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";
import { cbm } from "@/lib/palette";
import { FILL } from "./buttonSpec";
import { centroid, meshTris, triD } from "./triMesh";
import { useBoxSize } from "./useBoxSize";

export type FillButtonProps = {
  href: string;
  children: ReactNode;
  /** Tamanhos das landings: `lg` hero/fechamento, `md` padrão, `sm` FAQ. */
  size?: "lg" | "md" | "sm";
  /** Ocupa a largura toda do container (centraliza o rótulo). */
  full?: boolean;
  /** Triângulo à direita do rótulo (default false). */
  showArrow?: boolean;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children">;

/**
 * FillButton — CTA de conversão do design system Coded by M.
 *
 * Vermelho sólido em repouso. No hover a malha triangulada se pinta de
 * off-white a partir do ponto por onde o cursor entrou, triângulo a
 * triângulo, e recolhe para o ponto de saída. Pelo teclado a onda parte da
 * esquerda. O texto fica `page` o tempo todo — legível sobre o vermelho, o
 * off-white e qualquer mistura no meio (scripts/buttons.test.mts).
 *
 * Os filetes da malha só aparecem enquanto ativo, com um furo esfumado em
 * volta do rótulo: nenhuma linha cruza as letras.
 */
export function FillButton({
  href,
  children,
  size = "md",
  full = false,
  showArrow = false,
  className = "",
  style,
  target,
  rel,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ...rest
}: FillButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const cells = useRef<(SVGPathElement | null)[]>([]);
  // Sem ":" do useId: o id vai dentro de url(#…), onde dois-pontos quebram a referência.
  const maskId = `fill${useId().replace(/:/g, "")}`;
  const { w, h } = useBoxSize(ref);
  const tris = useMemo(() => meshTris(w, h, FILL.cell[size]), [w, h, size]);
  const centers = useMemo(() => tris.map(centroid), [tris]);

  // Caixa do rótulo, para o furo dos filetes.
  const [hole, setHole] = useState({ x: 0, y: 0, w: 0, h: 0 });
  useLayoutEffect(() => {
    const l = labelRef.current;
    if (l) setHole({ x: l.offsetLeft, y: l.offsetTop, w: l.offsetWidth, h: l.offsetHeight });
  }, [w, h]);

  /** Atraso de cada triângulo pela distância ao ponto de origem da onda. */
  const stagger = (ox: number, oy: number, entering: boolean) => {
    const max = Math.hypot(Math.max(ox, w - ox), Math.max(oy, h - oy)) || 1;
    const span = entering ? FILL.span : FILL.span * FILL.exit;
    centers.forEach(([cx, cy], i) => {
      const k = Math.hypot(cx - ox, cy - oy) / max;
      cells.current[i]?.style.setProperty("transition-delay", `${Math.round(k * span)}ms`);
    });
  };

  const on = (x: number, y: number) => {
    stagger(x, y, true);
    // Um frame para os atrasos valerem antes da classe disparar a transição.
    requestAnimationFrame(() => ref.current?.classList.add("is-on"));
  };
  const off = (x: number, y: number) => {
    stagger(x, y, false);
    ref.current?.classList.remove("is-on");
  };

  const at = (e: PointerEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top] as const;
  };

  const f = FILL.holeFade;

  return (
    <a
      ref={ref}
      href={href}
      target={target}
      rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
      className={["fill-btn", `fill-btn--${size}`, full ? "fill-btn--full" : "", className].filter(Boolean).join(" ")}
      style={
        {
          background: cbm("red"),
          color: cbm("page"),
          "--span": `${FILL.span}ms`,
          "--step": `${FILL.step}ms`,
          ...style,
        } as CSSProperties
      }
      onPointerEnter={(e) => {
        on(...at(e));
        onPointerEnter?.(e);
      }}
      onPointerLeave={(e) => {
        off(...at(e));
        onPointerLeave?.(e);
      }}
      onFocus={(e) => {
        on(0, h / 2);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        off(w, h / 2);
        onBlur?.(e);
      }}
      {...rest}
    >
      <svg aria-hidden width={w} height={h} className="fill-btn__svg">
        <defs>
          <filter id={`${maskId}-blur`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={f / 2} />
          </filter>
          <mask id={`${maskId}-hole`} maskUnits="userSpaceOnUse" x={0} y={0} width={w} height={h}>
            <rect width={w} height={h} fill="#fff" />
            <rect
              x={hole.x - f}
              y={hole.y - f / 2}
              width={hole.w + f * 2}
              height={hole.h + f}
              fill="#000"
              filter={`url(#${maskId}-blur)`}
            />
          </mask>
        </defs>
        {tris.map((t, i) => (
          <path
            key={i}
            ref={(el) => {
              cells.current[i] = el;
            }}
            className="fill-btn__cell"
            d={triD(t)}
            fill={cbm("white")}
            stroke={cbm("white")}
            strokeWidth={0.8}
          />
        ))}
        <path
          className="fill-btn__lines"
          d={tris.map(triD).join("")}
          fill="none"
          stroke={cbm("page")}
          strokeOpacity={FILL.lines}
          strokeWidth={0.6}
          mask={`url(#${maskId}-hole)`}
        />
      </svg>
      <span ref={labelRef} className="fill-btn__label">
        {children}
      </span>
      {showArrow && (
        <svg aria-hidden className="fill-btn__arrow" viewBox="0 0 16 16">
          <polygon points="3,2 14,8 3,14" />
        </svg>
      )}
    </a>
  );
}
