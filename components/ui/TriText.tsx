"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { cbm } from "@/lib/palette";
import { ASCENT, STROKE_LINE_HEIGHT } from "./strokeMetrics";
import { centroid, meshTris, triD, type Tri } from "./triMesh";

export type TriTextProps = {
  text: string;
  fontFamily?: string;
  fontWeight?: number | string;
  /** Corpo em unidades do SVG; o tamanho na tela vem do `font-size` herdado. */
  fontSize?: number;
  letterSpacing?: number;
  /** Atraso do bloco, em segundos — é com ele que se encadeiam linhas. */
  delay?: number;
  /** Janela da onda, em segundos. */
  duration?: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * Palavra que se revela pela malha da marca.
 *
 * A palavra é uma malha triangulada do tamanho do desenho, recortada pelo
 * formato das letras. Cada triângulo acende com um atraso que
 * cresce da esquerda para a direita, então a palavra aparece triângulo a
 * triângulo — a mesma gramática do terreno e dos botões. Os filetes da malha
 * passam em vermelho por dentro das letras junto com a onda e somem: o
 * vermelho é passagem, não moldura.
 *
 * Substitui o StrokeText no hero. Mede só quando a fonte pedida responde
 * (medir antes daria a métrica da fonte de sistema) e roda uma vez por
 * montagem. Quem pede menos movimento recebe o estado final.
 */
export function TriText({
  text,
  fontFamily,
  fontWeight = 800,
  fontSize = 128,
  letterSpacing = 0,
  delay = 0,
  duration = 0.9,
  className = "",
  style,
}: TriTextProps) {
  const textRef = useRef<SVGTextElement>(null);
  const rootRef = useRef<SVGSVGElement>(null);
  const [box, setBox] = useState<{ x: number; width: number } | null>(null);
  const [on, setOn] = useState(false);
  const [still, setStill] = useState(false);
  const id = `tri${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const height = STROKE_LINE_HEIGHT * fontSize;
  const top = -ASCENT * fontSize;
  const font: CSSProperties = {
    fontFamily,
    fontSize: `${fontSize}px`,
    fontWeight,
    letterSpacing: `${letterSpacing}px`,
  };

  useLayoutEffect(() => {
    let cancelled = false;
    const measure = () => {
      const node = textRef.current;
      if (cancelled || !node) return;
      let b: DOMRect | undefined;
      try {
        b = node.getBBox();
      } catch {
        return;
      }
      if (!b?.width) return;
      const pad = fontSize * 0.02;
      setBox({ x: b.x - pad, width: b.width + pad * 2 });
    };
    const family = (fontFamily ?? "sans-serif").split(",")[0].trim().replace(/^["']|["']$/g, "");
    const spec = `${fontWeight} ${fontSize}px "${family}"`;
    if (!document.fonts || document.fonts.check(spec)) measure();
    else document.fonts.load(spec).then(measure).catch(() => document.fonts.ready.then(measure));
    return () => {
      cancelled = true;
    };
  }, [text, fontFamily, fontSize, fontWeight, letterSpacing]);

  // Células ~0.22em: grandes o bastante para ler como triângulo, pequenas
  // o bastante para a onda atravessar cada letra em vários passos.
  const tris = useMemo(
    () => (box ? meshTris(box.width, height, fontSize * 0.22) : []),
    [box, height, fontSize],
  );
  const delays = useMemo(() => {
    if (!box) return [];
    return tris.map((t) => {
      const [cx, cy] = centroid(t);
      // Da esquerda para a direita, com um leve viés diagonal do logo.
      return ((cx / box.width) * 0.85 + (cy / height) * 0.15) * duration;
    });
  }, [tris, box, height, duration]);

  useEffect(() => {
    if (!box) return;
    // Menos movimento: estado final direto, sem a onda (a classe desliga as
    // transições — o atraso por triângulo ainda rodaria sem ela).
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setStill(true);
      setOn(true);
      return;
    }
    // Dois frames: o estado inicial pinta antes de a transição começar.
    let r2 = 0;
    const r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => setOn(true));
    });
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
    };
  }, [box]);

  const ratio = box ? box.width / height : 4;
  const viewBox = box ? `${box.x} ${top} ${box.width} ${height}` : `0 ${top} ${fontSize * 4} ${height}`;
  /** A malha nasce em 0..w × 0..h; o desenho do texto começa em (box.x, top). */
  const at = (t: Tri) => triD(t.map(([x, y]) => [x + (box?.x ?? 0), y + top]) as Tri);

  return (
    <svg
      ref={rootRef}
      className={`tri-text ${on ? "is-on" : ""} ${still ? "is-still" : ""} ${className}`.trim()}
      viewBox={viewBox}
      preserveAspectRatio="xMinYMid meet"
      aria-hidden
      style={{
        width: `${(ratio * STROKE_LINE_HEIGHT).toFixed(4)}em`,
        height: `${STROKE_LINE_HEIGHT}em`,
        overflow: "visible",
        visibility: box ? "visible" : "hidden",
        "--tri-delay": `${delay}s`,
        ...style,
      } as CSSProperties}
    >
      <defs>
        <clipPath id={`${id}-c`}>
          <text x="0" y="0" style={font}>
            {text}
          </text>
        </clipPath>
      </defs>
      {/* Só mede: a palavra visível é a malha recortada pelas letras. */}
      <text ref={textRef} x="0" y="0" fill="none" style={font}>
        {text}
      </text>
      {/* Triângulos off-white recortados pelo formato das letras: juntos,
          formam a palavra. (Animar dentro de um <mask> não repinta no
          Chrome; recortar por clipPath repinta.) */}
      <g clipPath={`url(#${id}-c)`}>
        {tris.map((t, i) => (
          <path
            key={i}
            className="tri-text__cell"
            d={at(t)}
            fill={cbm("white")}
            stroke={cbm("white")}
            strokeWidth={fontSize * 0.01}
            style={{ transitionDelay: `calc(var(--tri-delay) + ${delays[i].toFixed(3)}s)` }}
          />
        ))}
      </g>
      {/* Filetes vermelhos por dentro das letras, acompanhando a onda. */}
      <g clipPath={`url(#${id}-c)`} className="tri-text__lines">
        {tris.map((t, i) => (
          <path
            key={i}
            d={at(t)}
            fill="none"
            stroke={cbm("red")}
            strokeWidth={fontSize * 0.012}
            style={{ animationDelay: `calc(var(--tri-delay) + ${delays[i].toFixed(3)}s)` }}
          />
        ))}
      </g>
    </svg>
  );
}
