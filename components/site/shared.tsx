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

/** Pré-título: traço curto vermelho + label em Satoshi espaçado. */
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span aria-hidden style={{ display: "block", width: 24, height: 1, background: "#FB3640" }} />
      <span
        style={{
          fontFamily: SATOSHI,
          fontWeight: 500,
          fontSize: 10,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: "#FB3640",
        }}
      >
        {children}
      </span>
    </div>
  );
}

/** Cabeçalho padrão de seção: label + h2 + linha de apoio. */
export function SectionHead({
  label,
  heading,
  sub,
}: {
  label: string;
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
      <Reveal><SectionLabel>{label}</SectionLabel></Reveal>
      <Reveal delay={120}><h2
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
        <Reveal delay={240}><p
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
