import type { CSSProperties } from "react";

export type TriArrowDir = "right" | "left" | "up-right";

/**
 * Seta da marca: o triângulo dos botões no lugar das setas de texto
 * (→, ↗, ←), que são genéricas e leem como template.
 *
 * - `right`: avançar, ir para a próxima.
 * - `up-right`: link que sai/abre (o ↗ de antes). Cunha de canto (◥), não o
 *   triângulo girado: em corpo pequeno, um isósceles a 45° lê como seta pra
 *   esquerda. A cunha conversa com as cantoneiras e a diagonal do logo.
 * - `left`: voltar.
 *
 * Tamanho em `em` (acompanha o texto ao lado) e cor `currentColor` (herda do
 * pai). Dentro de um link, avança na própria direção no hover; o CSS mora em
 * `app/globals.css` (`.tri-arrow`).
 */
export function TriArrow({
  dir = "right",
  className = "",
  style,
}: {
  dir?: TriArrowDir;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className={`tri-arrow tri-arrow--${dir} ${className}`.trim()}
      style={style}
    >
      <polygon points={dir === "up-right" ? "3,3 13,3 13,13" : "3,2 14,8 3,14"} />
    </svg>
  );
}
