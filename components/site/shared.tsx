import type { CSSProperties, ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";

export const SATOSHI = '"Satoshi", sans-serif';
export const PANCHANG = '"Panchang", sans-serif';

/**
 * Escala de superfícies da home — verde quase preto.
 *
 * Fonte única: mexa aqui e a página inteira acompanha. A hierarquia importa
 * mais que os valores absolutos — `sunken` recua, `raised` destaca. Achatar
 * tudo em um só tom faz a página perder a camada.
 *
 * Nenhum é `#000` puro de propósito: o DESIGN-LANGUAGE trata a temperatura
 * como o que separa "premium" de "dark theme genérico".
 */
export const SURFACE = {
  /** Fundo da página. */
  base: "#040806",
  /** Cards de projeto e serviço — recuam em relação à página. */
  sunken: "#020504",
  /** Faixa da Experiência — destaca como objeto separado. */
  raised: "#070C09",
  /** Painel do menu drawer. */
  drawer: "#080D0A",
  /** Barra da moldura de browser no hero. */
  frameBar: "#070D09",
  /** Corpo da moldura de browser no hero. */
  frame: "#0A120C",
} as const;

/**
 * Superfície invertida — a lasca de luz que corta o escuro.
 *
 * Off-white quente da marca, nunca `#fff`: a temperatura é o que separa
 * "premium" de "bootstrap". Cantos retos de propósito — a referência que
 * originou isto usa raio grande, mas `border-radius: 0` é regra dura aqui.
 */
export const INK = {
  /** Fundo do bloco claro. */
  base: "#F5F2ED",
  /** Títulos sobre o claro. */
  ink: "#040806",
  /** Corpo. */
  body: "#4A4844",
  /** Secundário e legendas. */
  muted: "#6E6B66",
  /** Bordas sobre o claro. */
  border: "rgba(4,8,6,0.14)",
  /** Fundo de card sobre o claro. */
  card: "rgba(4,8,6,0.025)",
  /**
   * Vermelho para TEXTO sobre o claro.
   *
   * O #FB3640 da marca só dá 3.15:1 sobre #F5F2ED e reprova AA — sobre o
   * escuro ele dava 5.5:1. O red-dark da paleta resolve com 4.96:1.
   * Elementos decorativos (losangos, filetes) seguem no #FB3640: não são
   * texto e não respondem à regra.
   */
  signal: "#C42030",
} as const;

/** `base` em rgb, para gradientes e overlays com alpha. */
export const BASE_RGB = "4,8,6";
/** `sunken` em rgb, para o fade no rodapé dos cards. */
export const SUNKEN_RGB = "2,5,4";

/** Padding e largura de todas as seções da home. */
export const SECTION: CSSProperties = {
  maxWidth: 1440,
  margin: "0 auto",
  padding: "clamp(72px,10vh,120px) clamp(24px,5vw,80px)",
  borderTop: "1px solid #111511",
};

/** Losango de 7px — marcador recorrente da marca. */
export function Diamond({
  size = 7,
  filled = true,
  color = "#FB3640",
}: {
  size?: number;
  filled?: boolean;
  color?: string;
}) {
  return (
    <span
      aria-hidden
      style={{
        display: "block",
        width: size,
        height: size,
        flex: "none",
        background: filled ? color : "transparent",
        border: filled ? undefined : `1px solid ${color}`,
        transform: "rotate(45deg)",
      }}
    />
  );
}

/** Cabeçalho padrão de seção: label + h2 + linha de apoio. */
export function SectionHead({
  heading,
  sub,
}: {
  heading: string;
  sub?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 18,
        marginBottom: "clamp(40px,5vh,60px)",
      }}
    >
      <Reveal variant="wipe"><h2
        style={{
          margin: 0,
          maxWidth: "20ch",
          fontFamily: PANCHANG,
          fontWeight: 700,
          fontSize: "clamp(30px,4vw,52px)",
          letterSpacing: "-0.012em",
          lineHeight: 1.04,
          color: "#F5F2ED",
          textWrap: "balance",
        }}
      >
        {heading}
      </h2></Reveal>
      {sub && (
        <Reveal delay={140}><p
          style={{
            margin: 0,
            maxWidth: "60ch",
            fontFamily: SATOSHI,
            fontWeight: 400,
            fontSize: "clamp(15px,1.4vw,17px)",
            lineHeight: 1.7,
            color: "#C8C4BE",
            textWrap: "pretty",
          }}
        >
          {sub}
        </p></Reveal>
      )}
    </div>
  );
}

/** Símbolo CbM em wireframe. */
export function LogoMarkSvg({ size = 16, stroke = 12 }: { size?: number; stroke?: number }) {
  return (
    <svg
      width={size}
      height={(size * 161) / 142}
      viewBox="0 0 142 161"
      fill="none"
      aria-hidden="true"
    >
      <path d="M11.5 148.039V59.0391L53.5 104.438" stroke="#F5F2ED" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M130.5 103.039V19.0391L85.5 67.2944" stroke="#F5F2ED" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.5 18.0391L130.5 147.039" stroke="#FB3640" strokeWidth={stroke} strokeLinecap="round" />
    </svg>
  );
}
