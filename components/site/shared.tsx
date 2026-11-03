import type { CSSProperties, ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { cbm } from "@/lib/palette";

export const SATOSHI = '"Satoshi", sans-serif';
export const PANCHANG = '"Panchang", sans-serif';

/**
 * Escala de superfícies da home.
 *
 * Os valores vêm da paleta ativa em lib/palette.ts (variáveis `--cbm-*`):
 * trocar a cor é trocar a paleta, não este arquivo. A hierarquia importa mais
 * que os valores absolutos — `sunken` recua, `raised` destaca. Achatar tudo
 * em um só tom faz a página perder a camada.
 */
export const SURFACE = {
  /** Fundo da página. */
  base: cbm("base"),
  /** Cards de projeto e serviço — recuam em relação à página. */
  sunken: cbm("sunken"),
  /** Faixa da Experiência — destaca como objeto separado. */
  raised: cbm("raised"),
  /** Painel do menu drawer. */
  drawer: cbm("drawer"),
  /** Barra da moldura de browser no hero. */
  frameBar: cbm("frame-bar"),
  /** Corpo da moldura de browser no hero. */
  frame: cbm("frame"),
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
  ink: cbm("base"),
  /** Corpo. */
  body: cbm("gray-600"),
  /** Secundário e legendas. */
  muted: cbm("gray-500"),
  /** Bordas sobre o claro. */
  border: cbm("base", 0.14),
  /** Fundo de card sobre o claro. */
  card: cbm("base", 0.025),
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

/**
 * Canais de `base` como variável CSS, para gradientes e overlays com alpha.
 * Uso correto: `rgb(${BASE_RGB} / a)` — não `rgba(${BASE_RGB},a)`, porque a
 * variável guarda canais separados por espaço. No código do site prefira
 * `cbm("base", a)`.
 */
export const BASE_RGB = "var(--cbm-base)";
/**
 * Canais de `sunken` como variável CSS, para o fade no rodapé dos cards.
 * Uso correto: `rgb(${SUNKEN_RGB} / a)`. No código do site prefira
 * `cbm("sunken", a)`.
 */
export const SUNKEN_RGB = "var(--cbm-sunken)";

/** Padding e largura de todas as seções da home. */
export const SECTION: CSSProperties = {
  maxWidth: 1440,
  margin: "0 auto",
  padding: "clamp(72px,10vh,120px) clamp(24px,5vw,80px)",
  borderTop: `1px solid ${cbm("border")}`,
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

/**
 * Triângulo de contorno — o sinal da marca ao lado do nome.
 *
 * É a mesma figura que a paisagem do fundo repete milhares de vezes: um
 * triângulo em fio, não preenchido. Ele se desenha junto com a palavra e
 * depois gira devagar, o que mantém o lockup vivo em repouso.
 *
 * `pathLength={100}` normaliza o perímetro, então o tracejado do desenho é o
 * mesmo em qualquer tamanho.
 */
export function TriangleMark({
  color = "#FB3640",
  strokeWidth = 5,
  drawDelay = 0,
  className = "",
  style,
}: {
  color?: string;
  strokeWidth?: number;
  drawDelay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      aria-hidden
      className={`site-tri ${className}`.trim()}
      style={{ display: "block", flex: "none", ...style }}
    >
      <svg viewBox="0 0 100 88" fill="none" style={{ display: "block", width: "100%", height: "auto" }}>
        <polygon
          points="50,6 94,82 6,82"
          pathLength={100}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          style={{ animationDelay: `${drawDelay}s` }}
        />
      </svg>
    </span>
  );
}

/** Cabeçalho padrão de seção: label + h2 + linha de apoio. */
export function SectionHead({
  heading,
  sub,
  dense = false,
}: {
  heading: string;
  sub?: string;
  /** Título e apoio um pouco menores — a seção de projetos cabe 10 linhas na tela. */
  dense?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: dense ? 12 : 18,
        marginBottom: dense ? "clamp(18px,2.4vh,28px)" : "clamp(40px,5vh,60px)",
      }}
    >
      <Reveal variant="wipe"><h2
        style={{
          margin: 0,
          maxWidth: "20ch",
          fontFamily: PANCHANG,
          fontWeight: 700,
          fontSize: dense ? "clamp(28px,2.7vw,40px)" : "clamp(30px,4vw,52px)",
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
            fontSize: dense ? "clamp(14px,1.15vw,15.5px)" : "clamp(15px,1.4vw,17px)",
            lineHeight: dense ? 1.5 : 1.7,
            color: cbm("gray-200"),
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
/**
 * O símbolo da marca. `size` em número fixa a largura em px; em string
 * (`"52%"`) a medida passa a ser relativa ao pai e a altura vem da razão do
 * viewBox, não de uma conta — é o que deixa o símbolo acompanhar um quadro
 * que encolhe.
 */
export function LogoMarkSvg({
  size = 16,
  stroke = 12,
}: {
  size?: number | string;
  stroke?: number;
}) {
  const fixo = typeof size === "number";
  return (
    <svg
      width={size}
      height={fixo ? (size * 161) / 142 : undefined}
      style={fixo ? undefined : { width: size, height: "auto" }}
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
