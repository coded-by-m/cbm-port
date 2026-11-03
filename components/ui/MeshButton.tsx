"use client";

import {
  forwardRef,
  useMemo,
  useRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type PointerEvent,
  type Ref,
} from "react";
import { cbm } from "@/lib/palette";
import { MESH } from "./buttonSpec";
import { meshTris, triD } from "./triMesh";
import { useBoxSize } from "./useBoxSize";

export type MeshButtonProps = {
  /** Texto do botão. */
  label: string;
  /** Mostrar o triângulo vermelho à direita (default true). */
  showArrow?: boolean;
  /** `lg` para CTAs de seção, `sm` para ações em contexto (default `lg`). */
  size?: "lg" | "sm";
  /** Com `href` o botão vira um link de verdade (`<a>`). */
  href?: string;
  target?: AnchorHTMLAttributes<HTMLAnchorElement>["target"];
  rel?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

/**
 * MeshButton — botão da marca no design system Coded by M.
 *
 * "Malha que acorda": a malha triangulada (a mesma do terreno e do logo) fica
 * quase apagada em repouso e acende só num círculo em volta do cursor. Nada
 * anima parado. A malha é gerada no tamanho real do botão, então os triângulos
 * nunca esticam.
 *
 * Leitura: uma placa escura esfumada fica entre a malha e o rótulo — nenhuma
 * linha cruza as letras (contraste provado em scripts/buttons.test.mts).
 *
 * Mantém a className `word` no root para timelines GSAP que animem palavras.
 */
export const MeshButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, MeshButtonProps>(
  function MeshButton(
    {
      label,
      showArrow = true,
      size = "lg",
      href,
      target,
      rel,
      className = "",
      style,
      onPointerMove,
      ...rest
    },
    ref,
  ) {
    const boxRef = useRef<HTMLElement | null>(null);
    const { w, h } = useBoxSize(boxRef);
    const d = useMemo(() => meshTris(w, h, MESH.cell[size]).map(triD).join(""), [w, h, size]);

    const setRefs = (el: HTMLButtonElement | HTMLAnchorElement | null) => {
      boxRef.current = el;
      if (typeof ref === "function") ref(el);
      else if (ref) ref.current = el;
    };

    // Posição do cursor em px, direto no CSS (zero re-renders).
    const handlePointerMove = (e: PointerEvent<HTMLButtonElement>) => {
      const r = e.currentTarget.getBoundingClientRect();
      e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
      e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      onPointerMove?.(e);
    };

    const lines = (opacity: number) => (
      <svg aria-hidden width={w} height={h} className="mesh-btn__svg">
        <path d={d} fill="none" stroke={cbm("white")} strokeWidth={1} opacity={opacity} />
      </svg>
    );

    const rootStyle = {
      background: cbm("page", MESH.bgAlpha),
      "--r": `${MESH.litRadius}px`,
      ...style,
    } as CSSProperties;

    const content = (
      <>
        {lines(MESH.restLines)}
        <span className="mesh-btn__lit" aria-hidden>
          {lines(MESH.litLines)}
        </span>
        <span className="mesh-btn__label">
          <span className="mesh-btn__plate" aria-hidden style={{ background: cbm("page", MESH.plate) }} />
          {label}
        </span>
        {showArrow && (
          <svg aria-hidden className="mesh-btn__arrow" viewBox="0 0 16 16" fill={cbm("red")}>
            <polygon points="3,2 14,8 3,14" />
          </svg>
        )}
      </>
    );

    const classes = ["word", "mesh-btn", `mesh-btn--${size}`, className].filter(Boolean).join(" ");

    if (href)
      return (
        <a
          ref={setRefs as Ref<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
          className={classes}
          style={rootStyle}
          onPointerMove={handlePointerMove as unknown as AnchorHTMLAttributes<HTMLAnchorElement>["onPointerMove"]}
          {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      );

    return (
      <button
        ref={setRefs as Ref<HTMLButtonElement>}
        type="button"
        className={classes}
        style={rootStyle}
        onPointerMove={handlePointerMove}
        {...rest}
      >
        {content}
      </button>
    );
  },
);
