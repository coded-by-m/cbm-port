"use client";

/**
 * Conector visual entre o fragmento ativo e o card.
 *
 * Um traço técnico fino + um ponto-âncora sobre o ápice projetado. Ancora o
 * card visualmente ao fragmento (não flutuando solto). As coordenadas são
 * escritas a cada frame pela cena (projeção 3D→2D); aqui só definimos o estilo.
 *
 * SVG em pixels (sem viewBox → 1 unidade = 1px). Sem glow, sem neon.
 * Some no layout compacto (mobile), onde o card vira painel inferior.
 */
export default function Connector({
  visible,
  setLine,
  setDot,
}: {
  visible: boolean;
  setLine: (el: SVGLineElement | null) => void;
  setDot: (el: SVGCircleElement | null) => void;
}) {
  return (
    <svg
      aria-hidden="true"
      className={[
        "pointer-events-none absolute inset-0 z-10 h-full w-full transition-opacity duration-200 ease-out",
        visible ? "opacity-100" : "opacity-0",
      ].join(" ")}
    >
      <line
        ref={setLine}
        stroke="rgba(255,255,255,0.22)"
        strokeWidth={1}
        shapeRendering="crispEdges"
      />
      <circle ref={setDot} r={2.4} fill="rgba(255,255,255,0.55)" />
    </svg>
  );
}
