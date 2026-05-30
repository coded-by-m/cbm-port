import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

export const metadata: Metadata = {
  title: "UI Lab — Coded by M",
  description: "Vitrine de componentes visuais da Coded by M.",
};

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

interface TypeScaleEntry {
  token: string;
  family: string;
  size: string;
  weight: number;
  tracking: string;
  lineHeight: number;
  sample: string;
  color?: string;
  uppercase?: boolean;
}

const COLOR_PALETTE = [
  { name: "Deep Black", token: "cbm-black", hex: "#000F08" },
  { name: "Forest Dark", token: "cbm-forest", hex: "#0E1810" },
  { name: "Off White", token: "cbm-white", hex: "#F5F2ED" },
  { name: "Signal Red", token: "cbm-red", hex: "#FB3640" },
  { name: "Red Dark", token: "cbm-red-dark", hex: "#C42030" },
  { name: "Gray 100", token: "cbm-gray-100", hex: "#E8E4DE" },
  { name: "Gray 400", token: "cbm-gray-400", hex: "#8A8780" },
  { name: "Gray 600", token: "cbm-gray-600", hex: "#4A4844" },
  { name: "Gray 800", token: "cbm-gray-800", hex: "#1E1E1A" },
  { name: "Border", token: "cbm-border", hex: "#1a2a1e" },
  { name: "Border Active", token: "cbm-border-active", hex: "#2a4a32" },
];

const TYPE_SCALE: TypeScaleEntry[] = [
  {
    token: "display",
    family: "Panchang, sans-serif",
    size: "clamp(36px, 5vw, 52px)",
    weight: 800,
    tracking: "-0.03em",
    lineHeight: 0.92,
    sample: "Coded by M",
  },
  {
    token: "h1",
    family: "Panchang, sans-serif",
    size: "clamp(26px, 3.5vw, 38px)",
    weight: 700,
    tracking: "-0.02em",
    lineHeight: 1.05,
    sample: "Construímos presença digital.",
  },
  {
    token: "h2",
    family: "Panchang, sans-serif",
    size: "clamp(18px, 2vw, 26px)",
    weight: 600,
    tracking: "-0.01em",
    lineHeight: 1.15,
    sample: "Design de Sistema",
  },
  {
    token: "h3",
    family: "Panchang, sans-serif",
    size: "clamp(15px, 1.5vw, 20px)",
    weight: 500,
    tracking: "0",
    lineHeight: 1.25,
    sample: "Identidade e Marca",
  },
  {
    token: "body-lg",
    family: "Satoshi, sans-serif",
    size: "17px",
    weight: 300,
    tracking: "0",
    lineHeight: 1.75,
    sample: "Toda grande presença digital começa por uma ideia.",
    color: "#C8C4BE",
  },
  {
    token: "body",
    family: "Satoshi, sans-serif",
    size: "15px",
    weight: 400,
    tracking: "0",
    lineHeight: 1.7,
    sample: "Explorações visuais, estudos de interface e experimentos visuais.",
    color: "#F5F2ED",
  },
  {
    token: "body-sm",
    family: "Satoshi, sans-serif",
    size: "13px",
    weight: 300,
    tracking: "0",
    lineHeight: 1.7,
    color: "#8A8780",
    sample: "Texto secundário, descrição de card, informação de apoio.",
  },
  {
    token: "label",
    family: "Satoshi, sans-serif",
    size: "9px",
    weight: 500,
    tracking: "0.35em",
    lineHeight: 1.4,
    color: "#8A8780",
    uppercase: true,
    sample: "Tag de seção / Categoria",
  },
  {
    token: "ui",
    family: "Panchang, sans-serif",
    size: "11px",
    weight: 600,
    tracking: "0.15em",
    lineHeight: 1,
    uppercase: true,
    sample: "Iniciar Projeto",
  },
  {
    token: "micro",
    family: "Satoshi, sans-serif",
    size: "9px",
    weight: 400,
    tracking: "0.25em",
    lineHeight: 1.4,
    color: "#4A4844",
    uppercase: true,
    sample: "2026 / Caption / Metadata",
  },
];

const COMPARE_TOKENS = [
  "display", "h1", "h2", "h3", "body-lg", "body", "body-sm", "ui", "micro",
];

const TYPE_SCALE_V2: TypeScaleEntry[] = TYPE_SCALE.map((e) =>
  e.token === "h3" ? { ...e, family: "Satoshi, sans-serif" } : e
);

const PROCESS_STEPS = [
  {
    n: 1,
    title: "Diagnóstico",
    desc: "Entendemos o negócio, o público e o contexto antes de qualquer decisão visual.",
  },
  {
    n: 2,
    title: "Estratégia",
    desc: "Definimos identidade, proposta de valor e direção criativa com clareza.",
  },
  {
    n: 3,
    title: "Construção",
    desc: "Design e desenvolvimento em paralelo, com foco em qualidade e performance.",
  },
  {
    n: 4,
    title: "Entrega",
    desc: "Lançamento supervisionado, refinamento e suporte contínuo pós-go-live.",
  },
];

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

function LogoMark({ size = 26 }: { size?: number }) {
  const h = Math.round((size * 161) / 142);
  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 142 161"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.5 148.039V59.0391L53.5 104.438"
        stroke="#F5F2ED"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M130.5 103.039V19.0391L85.5 67.2944"
        stroke="#F5F2ED"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 18.0391L130.5 147.039"
        stroke="#FB3640"
        strokeWidth="9"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SectionBlock({
  id,
  label,
  title,
  children,
}: {
  id: string;
  label: string;
  title?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="border-b border-cbm-gray-800 py-16">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10">
        <div className="mb-10">
          <div className="mb-3 flex items-center gap-3">
            <span className="block h-px w-5 bg-cbm-red/50" />
            <span className="font-body text-[9px] font-medium uppercase tracking-[0.4em] text-cbm-red/70">
              {label}
            </span>
          </div>
          {title && (
            <h2 className="font-display text-[22px] font-semibold tracking-[-0.01em] text-cbm-white">
              {title}
            </h2>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}

function CLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 font-body text-[9px] uppercase tracking-[0.28em] text-cbm-gray-600">
      {children}
    </p>
  );
}

function PreviewBox({
  children,
  bg = "bg-cbm-black",
  className = "",
  noPad = false,
}: {
  children: ReactNode;
  bg?: string;
  className?: string;
  noPad?: boolean;
}) {
  return (
    <div
      className={`border border-cbm-border ${bg} ${noPad ? "" : "p-8"} ${className}`}
    >
      {children}
    </div>
  );
}

function StateLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-2 font-body text-[8px] uppercase tracking-[0.2em] text-cbm-gray-600">
      {children}
    </p>
  );
}

// ---------------------------------------------------------------------------
// Lab meta-nav
// ---------------------------------------------------------------------------

function LabNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-cbm-border backdrop-blur-sm" style={{ background: "rgba(3,4,3,0.95)" }}>
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-3 sm:px-10">
        <div className="flex items-center gap-4">
          <LogoMark />
          <div className="flex items-center gap-3">
            <span className="font-display text-[11px] font-semibold uppercase tracking-[0.12em] text-cbm-white">
              Coded{" "}
              <span className="text-cbm-red">by</span>{" "}
              M
            </span>
            <span className="select-none text-cbm-gray-800">/</span>
            <span className="font-body text-[9px] font-medium uppercase tracking-[0.35em] text-cbm-gray-400">
              UI Lab
            </span>
          </div>
        </div>

        <nav className="flex items-center gap-6">
          <span className="hidden font-body text-[9px] uppercase tracking-[0.2em] text-cbm-gray-600 sm:block">
            v0.1
          </span>
          <Link
            href="/lab"
            className="font-body text-[10px] uppercase tracking-[0.2em] text-cbm-gray-400 transition-colors duration-200 hover:text-cbm-white"
          >
            ← Lab
          </Link>
          <Link
            href="/"
            className="font-body text-[10px] uppercase tracking-[0.2em] text-cbm-gray-400 transition-colors duration-200 hover:text-cbm-white"
          >
            ← Home
          </Link>
        </nav>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// 1. Navbar component
// ---------------------------------------------------------------------------

const NAV_LINKS = [
  { label: "WORKS", active: false },
  { label: "SERVICES", active: false },
  { label: "PROCESS", active: false },
  { label: "LAB", active: false },
  { label: "ABOUT", active: false },
];

const DIVIDER = (
  <div
    className="self-stretch"
    style={{ width: 1, background: "rgba(245, 242, 237, 0.06)" }}
    aria-hidden="true"
  />
);

function NavbarPreview({ scrolled = false }: { scrolled?: boolean }) {
  const height   = scrolled ? 72 : 96;
  const logoSize = scrolled ? 30 : 40;
  const ctaH     = scrolled ? 40 : 52;
  const ctaW     = scrolled ? 164 : 196;
  const linkCls  = scrolled ? "text-[10px]" : "text-[11px]";

  return (
    <nav
      className="flex w-full items-center bg-transparent transition-all duration-300"
      style={{
        height,
        border: "1px solid rgba(245, 242, 237, 0.08)",
      }}
    >
      {/* Logo module — padding próprio, sem depender do nav */}
      <div className="flex shrink-0 items-center px-6">
        <LogoMark size={logoSize} />
      </div>

      {DIVIDER}

      {/* Links — flex-1 centralizado */}
      <div className="flex flex-1 items-center justify-center gap-10">
        {NAV_LINKS.map(({ label, active }) => (
          <div
            key={label}
            className="group flex cursor-pointer flex-col items-center gap-[5px]"
          >
            <span
              className={`font-display font-semibold uppercase tracking-[0.22em] text-cbm-white transition-opacity duration-200 ${linkCls} ${
                active ? "opacity-100" : "opacity-[0.72] group-hover:opacity-100"
              }`}
            >
              {label}
            </span>

            {/* Triângulo: só ativo ou hover */}
            <span
              className={`block transition-opacity duration-200 ${
                active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
              style={{
                width: 0,
                height: 0,
                borderLeft: "4px solid transparent",
                borderRight: "4px solid transparent",
                borderTop: "6px solid #FB3640",
              }}
              aria-hidden="true"
            />
          </div>
        ))}
      </div>

      {DIVIDER}

      {/* CTA */}
      <button
        type="button"
        className="flex shrink-0 items-center justify-center gap-2 bg-cbm-red font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-cbm-black transition-colors duration-150 hover:bg-cbm-red-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-cbm-red focus-visible:outline-offset-[3px]"
        style={{ height: ctaH, width: ctaW }}
      >
        GET IN TOUCH
        <span aria-hidden="true" className="text-[9px] leading-none">▸</span>
      </button>
    </nav>
  );
}

// ---------------------------------------------------------------------------
// 2. Buttons — Sistema refinado
// state: "default" | "hover" | "pressed" | "focus" | "disabled" | "compact"
// ---------------------------------------------------------------------------

type BtnState = "default" | "hover" | "pressed" | "focus" | "disabled";

// ---- Primary
// Hierarquia máxima. Único elemento vermelho por viewport.
// Microinteração: seta desloca +2px no hover. Tracking abre levemente.
// Pressed: compressão sutil de escala 0.98.
function BtnPrimary({
  compact = false,
  state = "default",
  label = "Iniciar Projeto",
}: {
  compact?: boolean;
  state?: BtnState;
  label?: string;
}) {
  const isHover    = state === "hover";
  const isPressed  = state === "pressed";
  const isFocus    = state === "focus";
  const isDisabled = state === "disabled";
  const active     = isHover || isPressed;

  const bg = active ? "bg-cbm-red-dark" : "bg-cbm-red hover:bg-cbm-red-dark";
  const scale = isPressed ? "scale-[0.98]" : "";
  const tracking = isHover || isPressed ? "tracking-[0.18em]" : "tracking-[0.15em] hover:tracking-[0.18em]";
  const arrowShift = active ? "translate-x-0.5" : "translate-x-0 group-hover:translate-x-0.5";
  const opacity = isDisabled ? "opacity-40 cursor-not-allowed pointer-events-none" : "";
  const focusRing = isFocus ? "outline outline-2 outline-cbm-red outline-offset-[3px]" : "";
  const pad = compact ? "pl-4 py-[10px]" : "pl-6 py-[14px]";
  const fz  = compact ? "text-[10px]"  : "text-[11px]";
  const sep = compact ? "pl-2.5"       : "pl-3.5";
  const arw = compact ? "text-[9px]"   : "text-[10px]";

  return (
    <button
      type="button"
      className={`group inline-flex items-center font-display font-semibold uppercase text-cbm-black transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cbm-red focus-visible:outline-offset-[3px] ${bg} ${pad} ${fz} ${scale} ${opacity} ${focusRing}`}
    >
      <span className={`${tracking} transition-[letter-spacing] duration-200`}>{label}</span>
      {/* Precisão tipográfica: separador 1px + seta direcional */}
      <span
        className={`ml-4 flex items-center self-stretch ${sep} transition-transform duration-150 ${arrowShift}`}
        style={{ borderLeft: "1px solid rgba(0,0,0,0.22)" }}
        aria-hidden="true"
      >
        <span className={`${arw} leading-none`}>▸</span>
      </span>
    </button>
  );
}

// ---- Secondary
// Presença discreta. Borda como estrutura, não como decoração.
// Default: borda e texto em opacidade reduzida — recua do Primary.
// Hover: tudo sobe para opacidade total — botão se torna visível.
function BtnSecondary({
  compact = false,
  state = "default",
  label = "Ver Projetos",
}: {
  compact?: boolean;
  state?: BtnState;
  label?: string;
}) {
  const isHover    = state === "hover" || state === "pressed";
  const isFocus    = state === "focus";
  const isDisabled = state === "disabled";
  const isPressed  = state === "pressed";

  const border = isHover
    ? "1px solid rgba(245,242,237,0.85)"
    : "1px solid rgba(245,242,237,0.28)";
  const textOp = isHover ? "text-cbm-white" : "text-cbm-white/70 hover:text-cbm-white";
  const scale = isPressed ? "scale-[0.98]" : "";
  const opacity = isDisabled ? "opacity-35 cursor-not-allowed pointer-events-none" : "";
  const focusRing = isFocus ? "outline outline-1 outline-cbm-red/60 outline-offset-4" : "";
  const hoverBorder = !isHover
    ? "hover:[border-color:rgba(245,242,237,0.85)]"
    : "";
  const pad = compact ? "px-4 py-[10px]" : "px-6 py-[14px]";
  const fz  = compact ? "text-[10px]"   : "text-[11px]";

  return (
    <button
      type="button"
      className={`bg-transparent font-display font-semibold uppercase tracking-[0.15em] transition-all duration-200 focus-visible:outline focus-visible:outline-1 focus-visible:outline-cbm-red/60 focus-visible:outline-offset-4 ${textOp} ${hoverBorder} ${pad} ${fz} ${scale} ${opacity} ${focusRing}`}
      style={{ border }}
    >
      {label}
    </button>
  );
}

// ---- Text Link CTA
// O botão mais elegante do sistema. Pureza tipográfica.
// Default: texto sem ornamento.
// Hover: linha vermelha precisa desliza da esquerda até a largura total.
//        A linha é sinal de direção — não decoração.
function BtnLinkCTA({
  state = "default",
  label = "Ver estudo de caso",
}: {
  state?: BtnState;
  label?: string;
}) {
  const isHover    = state === "hover" || state === "pressed";
  const isFocus    = state === "focus";
  const isDisabled = state === "disabled";

  const textColor = isHover
    ? "text-cbm-white"
    : "text-cbm-white/80 hover:text-cbm-white";
  const lineScale = isHover ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100";
  const opacity = isDisabled ? "opacity-35 cursor-not-allowed pointer-events-none" : "";
  const focusRing = isFocus
    ? "outline outline-1 outline-cbm-red/60 outline-offset-4"
    : "";

  return (
    <span
      className={`group inline-flex cursor-pointer flex-col items-start gap-[3px] ${opacity} ${focusRing}`}
    >
      <span className={`inline-flex items-center gap-[6px] font-display text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors duration-200 ${textColor}`}>
        {label}
        <span className="text-[10px] leading-none opacity-60 transition-[opacity,transform] duration-200 group-hover:translate-x-[2px] group-hover:opacity-100" aria-hidden="true">→</span>
      </span>
      {/* Linha de sinal — cresce da esquerda via scaleX (compositor-only, sem layout recalc) */}
      <span
        className={`block h-px w-full origin-left bg-cbm-red transition-transform duration-[350ms] ease-out ${lineScale}`}
      />
    </span>
  );
}

// ---- Ghost
// Mínimo absoluto. Tipografia apenas.
// Usado para ações secundárias que não devem competir.
// Hover revela o texto completamente — de quase invisível a legível.
function BtnGhost({
  compact = false,
  state = "default",
  label = "Explorar",
}: {
  compact?: boolean;
  state?: BtnState;
  label?: string;
}) {
  const isHover    = state === "hover" || state === "pressed";
  const isFocus    = state === "focus";
  const isDisabled = state === "disabled";

  const textColor = isHover
    ? "text-cbm-white"
    : "text-cbm-gray-400 hover:text-cbm-white";
  const opacity = isDisabled ? "opacity-25 cursor-not-allowed pointer-events-none" : "";
  const focusRing = isFocus ? "outline outline-1 outline-cbm-red/60 outline-offset-4" : "";
  const fz = compact ? "text-[10px]" : "text-[11px]";

  return (
    <button
      type="button"
      className={`bg-transparent font-display font-semibold uppercase tracking-[0.15em] transition-colors duration-200 focus-visible:outline focus-visible:outline-1 focus-visible:outline-cbm-red/60 focus-visible:outline-offset-4 ${textColor} ${fz} ${opacity} ${focusRing}`}
    >
      {label}
    </button>
  );
}


// ---------------------------------------------------------------------------
// 3. Project Overlay (mobile panel)
// ---------------------------------------------------------------------------

function ProjectOverlay() {
  return (
    <div className="border-l-2 border-l-cbm-red border-t border-cbm-border bg-cbm-black max-w-[440px] p-4">
      <div className="flex items-start justify-between">
        <p className="font-body text-[9px] font-medium uppercase tracking-[0.32em] text-cbm-red/70">
          Web Design
        </p>
        <button
          type="button"
          className="font-body text-[11px] text-cbm-gray-400 transition-colors duration-150 hover:text-cbm-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cbm-red focus-visible:outline-offset-[3px]"
          aria-label="Fechar"
        >
          ✕
        </button>
      </div>
      <h3 className="mt-2 font-display text-[16px] font-bold leading-[1.15] tracking-[-0.01em] text-cbm-white">
        Marca Orgânica
      </h3>
      <p className="mt-2 font-body text-[12px] font-light leading-[1.7] text-cbm-gray-400">
        Identidade visual premium para studio de arquitetura sustentável em São Paulo.
      </p>
      <div className="mt-4 border-t border-cbm-border pt-3">
        <BtnLinkCTA />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 4. Project Card
// ---------------------------------------------------------------------------

function ProjectCard({ ctaHovered = false }: { ctaHovered?: boolean }) {
  return (
    <div className="w-52 border border-cbm-border border-l-2 border-l-cbm-red bg-cbm-forest p-3 shadow-[0_2px_12px_rgba(0,0,0,0.28)]">
      <p className="font-body text-[9px] font-medium uppercase tracking-[0.32em] text-cbm-red/70">
        Web Design
      </p>
      <h3 className="mt-2 font-display text-[15px] font-bold leading-[1.15] tracking-[-0.01em] text-cbm-white">
        Marca Orgânica
      </h3>
      <p className="mt-2 font-body text-[12px] font-light leading-[1.7] text-cbm-gray-400">
        Identidade visual premium para studio de arquitetura sustentável.
      </p>
      <div className="mt-4 border-t border-cbm-border pt-3">
        <BtnLinkCTA state={ctaHovered ? "hover" : "default"} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 5. Service Card
// ---------------------------------------------------------------------------

function ServiceCard({
  n = "01",
  title = "Design de Sistema",
  description = "Identidade visual, tipografia, cor e componentes que escalam com a marca ao longo do tempo.",
  hovered = false,
}: {
  n?: string;
  title?: string;
  description?: string;
  hovered?: boolean;
}) {
  return (
    <div
      className={`border bg-transparent p-8 transition-colors duration-200 ${
        hovered
          ? "border-cbm-border-active"
          : "border-cbm-border hover:border-cbm-border-active"
      }`}
    >
      <p className="font-body text-[9px] font-medium uppercase tracking-[0.32em] text-cbm-red/70">
        {n}
      </p>
      <h3 className="mt-4 font-display text-[20px] font-semibold leading-[1.2] tracking-[-0.01em] text-cbm-white">
        {title}
      </h3>
      <p className="mt-3 font-body text-[14px] font-light leading-[1.7] text-cbm-gray-400">
        {description}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 6. Process Card
// ---------------------------------------------------------------------------

function ProcessCard({
  step,
  title,
  description,
}: {
  step: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-w-[180px] max-w-[220px] flex-col gap-3">
      <span
        className="font-display font-extrabold leading-none tracking-[-0.02em]"
        style={{ fontSize: 52, color: "#1a2e1e" }}
      >
        {String(step).padStart(2, "0")}
      </span>
      <h4 className="font-display text-[18px] font-medium leading-[1.25] text-cbm-white">
        {title}
      </h4>
      <p className="font-body text-[13px] font-light leading-[1.7] text-cbm-gray-400">
        {description}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 7. Lab Card
// ---------------------------------------------------------------------------

function LabCard({
  label = "Terrain Mesh",
  year = "2026",
  hovered = false,
}: {
  label?: string;
  year?: string;
  hovered?: boolean;
}) {
  return (
    <div className="w-56">
      <div
        className={`flex aspect-[4/3] items-center justify-center border bg-cbm-forest transition-all duration-200 ${
          hovered
            ? "scale-[1.02] border-cbm-border-active"
            : "border-cbm-border hover:scale-[1.02] hover:border-cbm-border-active"
        }`}
      >
        <LogoMark size={18} />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <p className="font-body text-[10px] font-light uppercase tracking-[0.3em] text-cbm-gray-600">
          {label}
        </p>
        <span className="font-body text-[9px] text-cbm-gray-800">{year}</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 8. CTA Block
// ---------------------------------------------------------------------------

function CTABlock() {
  return (
    <div className="border border-cbm-border bg-cbm-black px-10 py-20 text-center">
      <p className="mb-6 font-body text-[9px] font-medium uppercase tracking-[0.4em] text-cbm-red/70">
        Próximo passo
      </p>
      <h2
        className="font-display font-bold leading-[1.05] tracking-[-0.025em] text-cbm-white"
        style={{ fontSize: "clamp(28px, 4vw, 44px)" }}
      >
        Boas empresas constroem produtos.
        <br />
        Grandes empresas constroem{" "}
        <span className="text-cbm-red">percepção</span>.
      </h2>
      <p className="mx-auto mt-6 max-w-[520px] font-body text-[16px] font-light leading-[1.75] text-cbm-gray-400">
        Vamos construir a sua presença digital.
      </p>
      <div className="mt-10">
        <BtnPrimary label="Iniciar Projeto" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 9. Inputs / Form Fields
// ---------------------------------------------------------------------------

function InputField({
  label,
  placeholder = "",
  state = "default",
  errorMsg = "Campo obrigatório",
}: {
  label: string;
  placeholder?: string;
  state?: "default" | "focus" | "error";
  errorMsg?: string;
}) {
  const borderClass =
    state === "focus"
      ? "border-cbm-red ring-1 ring-cbm-red"
      : state === "error"
        ? "border-cbm-red/60"
        : "border-cbm-border focus:border-cbm-red focus:ring-1 focus:ring-cbm-red";

  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-body text-[9px] font-medium uppercase tracking-[0.3em] text-cbm-gray-400">
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        readOnly
        className={`border bg-cbm-forest px-4 py-3 font-body text-[14px] text-cbm-white placeholder:text-cbm-gray-600 outline-none transition-colors duration-150 ${borderClass}`}
      />
      {state === "error" && (
        <p className="font-body text-[10px] text-cbm-red/80">{errorMsg}</p>
      )}
    </div>
  );
}

function TextareaField() {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-body text-[9px] font-medium uppercase tracking-[0.3em] text-cbm-gray-400">
        Mensagem
      </label>
      <textarea
        rows={4}
        placeholder="Descreva seu projeto..."
        readOnly
        className="resize-none border border-cbm-border bg-cbm-forest px-4 py-3 font-body text-[14px] text-cbm-white placeholder:text-cbm-gray-600 outline-none transition-colors duration-150 focus:border-cbm-red focus:ring-1 focus:ring-cbm-red"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// 10. Section Header
// ---------------------------------------------------------------------------

function SectionHeader({
  tag,
  title,
  subtitle,
}: {
  tag: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="max-w-[680px]">
      <div className="mb-4 flex items-center gap-3">
        <span className="block h-px w-6 bg-cbm-red/50" />
        <p className="font-body text-[9px] font-medium uppercase tracking-[0.35em] text-cbm-red/70">
          {tag}
        </p>
      </div>
      <h2
        className="font-display font-bold leading-[1.05] tracking-[-0.02em] text-cbm-white"
        style={{ fontSize: "clamp(26px, 3.5vw, 38px)" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 font-body text-[16px] font-light leading-[1.75] text-cbm-gray-400">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Connector preview
// ---------------------------------------------------------------------------

function ConnectorPreview() {
  return (
    <div
      className="relative border border-cbm-border bg-cbm-forest"
      style={{ height: 240 }}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        style={{ shapeRendering: "crispEdges" } as CSSProperties}
        aria-hidden="true"
      >
        <line
          x1="22%"
          y1="35%"
          x2="48%"
          y2="58%"
          stroke="rgba(251,54,64,0.5)"
          strokeWidth="1"
        />
        <circle cx="22%" cy="35%" r="3" fill="#FB3640" />
      </svg>

      {/* Anchor dot */}
      <div
        className="absolute rounded-full bg-cbm-red"
        style={{ left: "calc(22% - 4px)", top: "calc(35% - 4px)", width: 8, height: 8 }}
      />

      {/* Floating project card */}
      <div className="absolute" style={{ left: "48%", top: "58%", transform: "translateY(-50%)" }}>
        <ProjectCard />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function UILabPage() {
  return (
    <div className="min-h-screen font-body text-cbm-white" style={{ background: "#030403" }}>
      <LabNav />

      {/* FOUNDATIONS -------------------------------------------------------- */}
      <SectionBlock id="foundations" label="Foundations" title="Sistema de Design">
        {/* Color palette */}
        <div className="mb-14">
          <CLabel>Paleta de Cores</CLabel>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11">
            {COLOR_PALETTE.map((color) => (
              <div key={color.token}>
                <div
                  className="mb-2 h-10 w-full border border-cbm-border"
                  style={{ backgroundColor: color.hex }}
                />
                <p className="font-body text-[8px] font-medium uppercase leading-[1.4] tracking-[0.15em] text-cbm-gray-400">
                  {color.name}
                </p>
                <p className="font-body text-[8px] text-cbm-gray-600">{color.hex}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Typography scale V1 */}
        <div className="mb-14">
          <CLabel>Escala Tipográfica — V1</CLabel>
          <PreviewBox>
            <div className="flex flex-col gap-6">
              {TYPE_SCALE.map((entry) => (
                <div
                  key={entry.token}
                  className="flex items-baseline gap-6 border-b border-cbm-gray-800 pb-6 last:border-0 last:pb-0"
                >
                  <div className="w-24 shrink-0">
                    <p className="font-body text-[8px] uppercase tracking-[0.2em] text-cbm-gray-600">
                      {entry.token}
                    </p>
                  </div>
                  <p
                    style={
                      {
                        fontFamily: entry.family,
                        fontSize: entry.size,
                        fontWeight: entry.weight,
                        letterSpacing: entry.tracking,
                        lineHeight: entry.lineHeight,
                        color: entry.color ?? "#F5F2ED",
                        textTransform: entry.uppercase ? "uppercase" : undefined,
                      } as CSSProperties
                    }
                  >
                    {entry.sample}
                  </p>
                </div>
              ))}
            </div>
          </PreviewBox>
        </div>

        {/* Typography comparison V1 × V2 */}
        <div>
          <CLabel>Tipografia — V1 × V2</CLabel>
          <div className="overflow-hidden border border-cbm-border">
            {/* Header */}
            <div className="grid grid-cols-[72px_1fr_1fr] border-b border-cbm-gray-800">
              <div className="border-r border-cbm-gray-800 px-4 py-3" />
              <div className="border-r border-cbm-gray-800 px-6 py-3">
                <p className="font-body text-[9px] uppercase tracking-[0.3em] text-cbm-gray-600">
                  V1 — Panchang Display · H1 · H2 · H3 · UI
                </p>
              </div>
              <div className="px-6 py-3">
                <p className="font-body text-[9px] uppercase tracking-[0.3em] text-cbm-gray-400">
                  V2 — Panchang Display · H1 · H2 · UI · Satoshi H3
                </p>
              </div>
            </div>

            {/* Rows */}
            {COMPARE_TOKENS.map((token) => {
              const v1 = TYPE_SCALE.find((e) => e.token === token)!;
              const v2 = TYPE_SCALE_V2.find((e) => e.token === token)!;
              const changed = v1.family !== v2.family;

              return (
                <div
                  key={token}
                  className="grid grid-cols-[72px_1fr_1fr] border-b border-cbm-gray-800 last:border-0"
                  style={changed ? { background: "rgba(14,24,16,0.6)" } : undefined}
                >
                  {/* Token label */}
                  <div className="flex items-center gap-2 border-r border-cbm-gray-800 px-4 py-5">
                    <p className="font-body text-[8px] uppercase tracking-[0.2em] text-cbm-gray-600">
                      {token}
                    </p>
                    {changed && (
                      <span
                        className="shrink-0 rounded-full bg-cbm-red"
                        style={{ width: 5, height: 5 }}
                      />
                    )}
                  </div>

                  {/* V1 sample */}
                  <div className="border-r border-cbm-gray-800 px-6 py-5">
                    <p
                      style={{
                        fontFamily: v1.family,
                        fontSize: v1.size,
                        fontWeight: v1.weight,
                        letterSpacing: v1.tracking,
                        lineHeight: v1.lineHeight,
                        color: v1.color ?? "#F5F2ED",
                        textTransform: v1.uppercase ? "uppercase" : undefined,
                      } as CSSProperties}
                    >
                      {v1.sample}
                    </p>
                  </div>

                  {/* V2 sample */}
                  <div className="px-6 py-5">
                    <p
                      style={{
                        fontFamily: v2.family,
                        fontSize: v2.size,
                        fontWeight: v2.weight,
                        letterSpacing: v2.tracking,
                        lineHeight: v2.lineHeight,
                        color: v2.color ?? "#F5F2ED",
                        textTransform: v2.uppercase ? "uppercase" : undefined,
                      } as CSSProperties}
                    >
                      {v2.sample}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </SectionBlock>

      {/* NAVIGATION --------------------------------------------------------- */}
      <SectionBlock id="navigation" label="Navigation" title="Navbar">
        <div className="flex flex-col gap-8">
          <div>
            <CLabel>Default — 96px</CLabel>
            <div className="px-12 py-16" style={{ background: "#030403" }}>
              <NavbarPreview scrolled={false} />
            </div>
          </div>
          <div>
            <CLabel>Scrolled — 72px</CLabel>
            <div className="px-12 py-16" style={{ background: "#030403" }}>
              <NavbarPreview scrolled={true} />
            </div>
          </div>
        </div>
      </SectionBlock>

      {/* BUTTONS ------------------------------------------------------------ */}
      <SectionBlock id="buttons" label="Buttons" title="Sistema de Botões">
        <div className="flex flex-col gap-14">

          {/* ── Primary ─────────────────────────────────────────────────── */}
          <div>
            <div className="mb-4">
              <CLabel>Primary — Ação principal · Panchang 600 · bg-cbm-red</CLabel>
              <p className="font-body text-[11px] font-light leading-[1.7] text-cbm-gray-600 max-w-[520px]">
                Único elemento vermelho por viewport. A seta desloca +2px no hover.
                O tracking abre de 0.15em para 0.18em — respiração tipográfica.
                Pressed comprime 2% — feedback tátil sem exagero.
              </p>
            </div>
            <PreviewBox>
              <div className="flex flex-col gap-8">
                {/* States row */}
                <div className="flex flex-wrap items-end gap-8">
                  {(["default","hover","pressed","focus","disabled"] as BtnState[]).map((s) => (
                    <div key={s}>
                      <StateLabel>{s}</StateLabel>
                      <BtnPrimary state={s} label="Iniciar Projeto" />
                    </div>
                  ))}
                </div>
                {/* Compact row */}
                <div className="border-t border-cbm-gray-800 pt-6 flex flex-wrap items-end gap-8">
                  <div>
                    <StateLabel>Compact · Default</StateLabel>
                    <BtnPrimary compact label="Iniciar" />
                  </div>
                  <div>
                    <StateLabel>Compact · Hover</StateLabel>
                    <BtnPrimary compact state="hover" label="Iniciar" />
                  </div>
                </div>
              </div>
            </PreviewBox>
          </div>

          {/* ── Secondary ───────────────────────────────────────────────── */}
          <div>
            <div className="mb-4">
              <CLabel>Secondary — Navegação secundária · Panchang 600 · border-only</CLabel>
              <p className="font-body text-[11px] font-light leading-[1.7] text-cbm-gray-600 max-w-[520px]">
                Borda como estrutura, não como decoração. No default, borda e texto recuam
                em opacidade — o botão existe mas não compete. No hover, tudo sobe para
                presença total. Sem fill, sem sombra.
              </p>
            </div>
            <PreviewBox>
              <div className="flex flex-col gap-8">
                <div className="flex flex-wrap items-end gap-8">
                  {(["default","hover","pressed","focus","disabled"] as BtnState[]).map((s) => (
                    <div key={s}>
                      <StateLabel>{s}</StateLabel>
                      <BtnSecondary state={s} label="Ver Projetos" />
                    </div>
                  ))}
                </div>
                <div className="border-t border-cbm-gray-800 pt-6 flex flex-wrap items-end gap-8">
                  <div>
                    <StateLabel>Compact · Default</StateLabel>
                    <BtnSecondary compact label="Ver" />
                  </div>
                  <div>
                    <StateLabel>Compact · Hover</StateLabel>
                    <BtnSecondary compact state="hover" label="Ver" />
                  </div>
                </div>
              </div>
            </PreviewBox>
          </div>

          {/* ── Text Link CTA ───────────────────────────────────────────── */}
          <div>
            <div className="mb-4">
              <CLabel>Text Link CTA — O mais elegante do sistema · tipografia + linha</CLabel>
              <p className="font-body text-[11px] font-light leading-[1.7] text-cbm-gray-600 max-w-[520px]">
                Sem caixa. Sem borda. Apenas tipo e uma linha de sinal.
                No hover: linha vermelha precisa desliza da esquerda até
                a largura total em 350ms ease-out. A seta avança 2px.
                O botão existe para indicar direção, não peso.
              </p>
            </div>
            <PreviewBox>
              <div className="flex flex-wrap items-start gap-12">
                {(["default","hover","pressed","focus","disabled"] as BtnState[]).map((s) => (
                  <div key={s}>
                    <StateLabel>{s}</StateLabel>
                    <BtnLinkCTA state={s} label="Ver estudo de caso" />
                  </div>
                ))}
              </div>
            </PreviewBox>
          </div>

          {/* ── Ghost ───────────────────────────────────────────────────── */}
          <div>
            <div className="mb-4">
              <CLabel>Ghost — Ações discretas · tipografia apenas · opacidade como hierarquia</CLabel>
              <p className="font-body text-[11px] font-light leading-[1.7] text-cbm-gray-600 max-w-[520px]">
                Mínimo absoluto. O texto no default está quase invisível —
                a ação existe mas não solicita atenção. No hover, revela-se
                completamente. Usado para exploração, não conversão.
              </p>
            </div>
            <PreviewBox>
              <div className="flex flex-col gap-8">
                <div className="flex flex-wrap items-center gap-12">
                  {(["default","hover","pressed","focus","disabled"] as BtnState[]).map((s) => (
                    <div key={s}>
                      <StateLabel>{s}</StateLabel>
                      <BtnGhost state={s} label="Explorar" />
                    </div>
                  ))}
                </div>
                <div className="border-t border-cbm-gray-800 pt-6 flex flex-wrap items-center gap-12">
                  <div>
                    <StateLabel>Compact · Default</StateLabel>
                    <BtnGhost compact label="Ver" />
                  </div>
                  <div>
                    <StateLabel>Compact · Hover</StateLabel>
                    <BtnGhost compact state="hover" label="Ver" />
                  </div>
                </div>
              </div>
            </PreviewBox>
          </div>

          {/* ── Hierarquia de uso ───────────────────────────────────────── */}
          <div>
            <CLabel>Hierarquia de Uso — onde cada botão pertence</CLabel>
            <div className="border border-cbm-border overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-[160px_1fr_1fr_1fr_1fr] border-b border-cbm-gray-800">
                <div className="border-r border-cbm-gray-800 px-5 py-3">
                  <p className="font-body text-[8px] uppercase tracking-[0.25em] text-cbm-gray-600">Superfície</p>
                </div>
                {["Primary","Secondary","Text Link","Ghost"].map((h) => (
                  <div key={h} className="border-r border-cbm-gray-800 last:border-0 px-5 py-3">
                    <p className="font-body text-[8px] uppercase tracking-[0.25em] text-cbm-gray-600">{h}</p>
                  </div>
                ))}
              </div>
              {/* Rows */}
              {[
                { surface: "Hero",             p: "✦ Principal", s: "Secundário", l: "—",          g: "—"       },
                { surface: "CTA Final",        p: "✦ Único",     s: "—",          l: "—",          g: "—"       },
                { surface: "Paisagem Digital", p: "—",           s: "—",          l: "—",          g: "✦ Hint"  },
                { surface: "Cards",            p: "—",           s: "—",          l: "✦ CTA",      g: "—"       },
                { surface: "Cases",            p: "—",           s: "—",          l: "✦ Estudo",   g: "Explorar"},
                { surface: "Navbar",           p: "✦ Iniciar",   s: "—",          l: "—",          g: "✦ Links" },
              ].map(({ surface, p, s, l, g }) => (
                <div key={surface} className="grid grid-cols-[160px_1fr_1fr_1fr_1fr] border-b border-cbm-gray-800 last:border-0">
                  <div className="border-r border-cbm-gray-800 px-5 py-4">
                    <p className="font-body text-[10px] font-medium text-cbm-gray-400">{surface}</p>
                  </div>
                  {[p, s, l, g].map((v, i) => (
                    <div key={i} className="border-r border-cbm-gray-800 last:border-0 px-5 py-4">
                      <p className={`font-body text-[10px] ${v.startsWith("✦") ? "text-cbm-red/80 font-medium" : v === "—" ? "text-cbm-gray-800" : "text-cbm-gray-400"}`}>
                        {v}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <p className="mt-4 font-body text-[10px] font-light leading-[1.75] text-cbm-gray-600 max-w-[560px]">
              Regra de ouro: nunca mais de um Primary por viewport. O vermelho funciona porque é raro.
              Text Link CTA é o padrão dentro de conteúdo. Ghost é usado para ações que não devem solicitar atenção.
            </p>
          </div>

        </div>
      </SectionBlock>

      {/* CARDS -------------------------------------------------------------- */}
      <SectionBlock id="cards" label="Cards" title="Cards">
        <div className="flex flex-col gap-12">
          {/* Project Card */}
          <div>
            <CLabel>
              Project Card — bg-cbm-forest · border-l-2 cbm-red · w-52
            </CLabel>
            <PreviewBox>
              <div className="flex flex-wrap gap-10">
                <div>
                  <StateLabel>Default</StateLabel>
                  <ProjectCard />
                </div>
                <div>
                  <StateLabel>Hover (link CTA)</StateLabel>
                  <ProjectCard ctaHovered />
                </div>
              </div>
            </PreviewBox>
          </div>

          {/* Service Card */}
          <div>
            <CLabel>
              Service Card — transparent · border-cbm-border · hover: border-cbm-border-active
            </CLabel>
            <PreviewBox>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <StateLabel>Default</StateLabel>
                  <ServiceCard />
                </div>
                <div>
                  <StateLabel>Hover</StateLabel>
                  <ServiceCard hovered />
                </div>
                <div>
                  <StateLabel>Variant</StateLabel>
                  <ServiceCard
                    n="02"
                    title="Desenvolvimento Web"
                    description="Código limpo, performático e acessível. Do protótipo ao deploy em produção."
                  />
                </div>
              </div>
            </PreviewBox>
          </div>

          {/* Process Card */}
          <div>
            <CLabel>
              Process Card — número decorativo · Panchang H3 · Satoshi body-sm
            </CLabel>
            <PreviewBox>
              <div className="flex flex-wrap gap-12">
                {PROCESS_STEPS.map((s) => (
                  <ProcessCard
                    key={s.n}
                    step={s.n}
                    title={s.title}
                    description={s.desc}
                  />
                ))}
              </div>
            </PreviewBox>
          </div>

          {/* Lab Card */}
          <div>
            <CLabel>
              Lab Card — thumbnail · border-cbm-border · hover: scale-[1.02] + border-active
            </CLabel>
            <PreviewBox>
              <div className="flex flex-wrap gap-8">
                <div>
                  <StateLabel>Default</StateLabel>
                  <LabCard />
                </div>
                <div>
                  <StateLabel>Hover</StateLabel>
                  <LabCard hovered />
                </div>
                <div>
                  <StateLabel>Variant</StateLabel>
                  <LabCard label="Triangle Loader" year="2026" />
                </div>
              </div>
            </PreviewBox>
          </div>
        </div>
      </SectionBlock>

      {/* OVERLAY ------------------------------------------------------------ */}
      <SectionBlock id="overlay" label="Overlay" title="Project Overlay">
        <div className="flex flex-col gap-10">
          {/* Mobile panel */}
          <div>
            <CLabel>
              Mobile Panel — fixed bottom · border-l-2 cbm-red · slide-up (translateY)
            </CLabel>
            <PreviewBox bg="bg-cbm-forest" className="relative min-h-[200px]">
              <div className="flex items-end justify-start pt-20">
                <ProjectOverlay />
              </div>
            </PreviewBox>
          </div>

          {/* Connector */}
          <div>
            <CLabel>
              Connector — SVG · stroke rgba(251,54,64,0.5) · dot cbm-red · desktop only
            </CLabel>
            <ConnectorPreview />
          </div>
        </div>
      </SectionBlock>

      {/* FORMS -------------------------------------------------------------- */}
      <SectionBlock id="forms" label="Forms" title="Inputs e Formulários">
        <PreviewBox>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <InputField
              label="Nome"
              placeholder="Seu nome completo"
              state="default"
            />
            <InputField
              label="Email — Focus"
              placeholder="seu@email.com"
              state="focus"
            />
            <InputField
              label="Empresa — Error"
              placeholder="Nome da empresa"
              state="error"
            />
          </div>
          <div className="mt-8 max-w-sm">
            <TextareaField />
          </div>
        </PreviewBox>
      </SectionBlock>

      {/* CTA --------------------------------------------------------------- */}
      <SectionBlock id="cta" label="CTA" title="CTA Block">
        <CTABlock />
      </SectionBlock>

      {/* SECTION HEADER ----------------------------------------------------- */}
      <SectionBlock
        id="section-header"
        label="Section Header"
        title="Section Header"
      >
        <div className="flex flex-col gap-12">
          <div>
            <CLabel>Com subtítulo</CLabel>
            <PreviewBox>
              <SectionHeader
                tag="Serviços"
                title="Construímos presença digital."
                subtitle="Toda grande presença digital começa por uma ideia. Nós transformamos essa ideia em linguagem, sistema e experiência visual que converte."
              />
            </PreviewBox>
          </div>
          <div>
            <CLabel>Sem subtítulo</CLabel>
            <PreviewBox>
              <SectionHeader
                tag="Laboratório"
                title="Explorações visuais que expandem a linguagem."
              />
            </PreviewBox>
          </div>
          <div>
            <CLabel>Compacto (tag apenas)</CLabel>
            <PreviewBox>
              <div className="flex items-center gap-3">
                <span className="block h-px w-6 bg-cbm-red/50" />
                <p className="font-body text-[9px] font-medium uppercase tracking-[0.35em] text-cbm-red/70">
                  Como Trabalhamos
                </p>
              </div>
            </PreviewBox>
          </div>
        </div>
      </SectionBlock>

      {/* Footer */}
      <footer className="border-t border-cbm-border py-8">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 sm:px-10">
          <p className="font-body text-[9px] uppercase tracking-[0.3em] text-cbm-gray-600">
            Coded by M — UI Lab
          </p>
          <p className="font-body text-[9px] uppercase tracking-[0.3em] text-cbm-gray-600">
            v0.1 · 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
