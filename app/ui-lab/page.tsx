import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { CaseHero } from "@/components/case/CaseHero";
import { CaseOverview } from "@/components/case/CaseOverview";
import { CaseGallery } from "@/components/case/CaseGallery";
import { CaseReturnCTA } from "@/components/case/CaseReturnCTA";
import { getCaseBySlug } from "@/data/cases";

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
  { name: "Forest Dark", token: "cbm-forest", hex: "#070B08" },
  { name: "Off White", token: "cbm-white", hex: "#F5F2ED" },
  { name: "Signal Red", token: "cbm-red", hex: "#FB3640" },
  { name: "Red Dark", token: "cbm-red-dark", hex: "#C42030" },
  { name: "Gray 100", token: "cbm-gray-100", hex: "#E8E4DE" },
  { name: "Gray 400", token: "cbm-gray-400", hex: "#8A8780" },
  { name: "Gray 600", token: "cbm-gray-600", hex: "#4A4844" },
  { name: "Gray 800", token: "cbm-gray-800", hex: "#1E1E1A" },
  { name: "Border", token: "cbm-border", hex: "#111511" },
  { name: "Border Active", token: "cbm-border-active", hex: "#1A2418" },
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
// Project Overlay — data
// ---------------------------------------------------------------------------

type OverlayVariant = "left" | "right" | "compact" | "mobile";
type OverlayState   = "hidden" | "entering" | "active" | "leaving";

interface ProjectMeta {
  label: string;
  value: string;
}

interface ProjectOverlayData {
  eyebrow:     string;
  title:       string;
  description: string;
  meta:        ProjectMeta[];
  cta:         string;
}

const PROJECT_SAMPLE: ProjectOverlayData = {
  eyebrow:     "Web Design Premium / Case Study",
  title:       "Machado Plataformas",
  description: "Site institucional premium para uma empresa técnica, com foco em percepção de valor, clareza comercial e presença digital mais profissional.",
  meta: [
    { label: "Cliente",  value: "Machado Plataformas"   },
    { label: "Setor",    value: "Implementos Rodoviários"},
    { label: "Tipo",     value: "Site Institucional"     },
    { label: "Status",   value: "Case Real"              },
  ],
  cta: "View Case",
};

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
      className={`border ${bg} ${noPad ? "" : "p-8"} ${className}`}
      style={{ borderColor: "rgba(245,242,237,0.07)" }}
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
    <header className="sticky top-0 z-50 border-b backdrop-blur-sm" style={{ background: "rgba(3,4,3,0.95)", borderColor: "rgba(245,242,237,0.06)" }}>
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
  const focusRing = isFocus ? "outline outline-[1.5px] outline-white/25 outline-offset-[5px]" : "";
  const pad = compact ? "pl-4 py-[10px]" : "pl-6 py-[14px]";
  const fz  = compact ? "text-[10px]"  : "text-[11px]";
  const sep = compact ? "px-2.5"       : "px-3.5";
  const arw = compact ? "text-[13px]"  : "text-[16px]";

  return (
    <button
      type="button"
      className={`group inline-flex items-center font-display font-semibold uppercase text-cbm-black transition-all duration-150 focus-visible:outline focus-visible:outline-[1.5px] focus-visible:outline-white/25 focus-visible:outline-offset-[5px] ${bg} ${pad} ${fz} ${scale} ${opacity} ${focusRing}`}
    >
      <span className={`${tracking} transition-[letter-spacing] duration-200`}>{label}</span>
      {/* Precisão tipográfica: separador 1px + seta direcional */}
      <span
        className={`ml-4 flex items-center self-stretch ${sep} transition-transform duration-150 ${arrowShift}`}
        style={{ borderLeft: "1px solid rgba(0,0,0,0.32)" }}
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
    : "1px solid rgba(245,242,237,0.40)";
  const textOp = isHover ? "text-cbm-white" : "text-cbm-white/80 hover:text-cbm-white";
  const scale = isPressed ? "scale-[0.98]" : "";
  const opacity = isDisabled ? "opacity-35 cursor-not-allowed pointer-events-none" : "";
  const focusRing = isFocus ? "outline outline-[1.5px] outline-white/20 outline-offset-[5px]" : "";
  const hoverBorder = !isHover
    ? "hover:[border-color:rgba(245,242,237,0.85)]"
    : "";
  const pad = compact ? "px-4 py-[10px]" : "px-6 py-[14px]";
  const fz  = compact ? "text-[10px]"   : "text-[11px]";

  return (
    <button
      type="button"
      className={`bg-transparent font-display font-semibold uppercase tracking-[0.15em] transition-all duration-200 focus-visible:outline focus-visible:outline-[1.5px] focus-visible:outline-white/20 focus-visible:outline-offset-[5px] ${textOp} ${hoverBorder} ${pad} ${fz} ${scale} ${opacity} ${focusRing}`}
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
    : "text-cbm-white/90 hover:text-cbm-white";
  const lineScale = isHover ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100";
  const opacity = isDisabled ? "opacity-35 cursor-not-allowed pointer-events-none" : "";
  const focusRing = isFocus
    ? "outline outline-[1.5px] outline-white/20 outline-offset-[5px]"
    : "";

  return (
    <span
      className={`group inline-flex cursor-pointer flex-col items-start gap-[3px] ${opacity} ${focusRing}`}
    >
      <span className={`inline-flex items-center gap-[6px] font-display text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors duration-200 ${textColor}`}>
        {label}
        <span className="text-[10px] leading-none opacity-75 transition-[opacity,transform] duration-200 group-hover:translate-x-[2px] group-hover:opacity-100" aria-hidden="true">→</span>
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
  const focusRing = isFocus ? "outline outline-[1.5px] outline-white/20 outline-offset-[5px]" : "";
  const fz = compact ? "text-[10px]" : "text-[11px]";

  return (
    <button
      type="button"
      className={`bg-transparent font-display font-semibold uppercase tracking-[0.15em] transition-colors duration-200 focus-visible:outline focus-visible:outline-[1.5px] focus-visible:outline-white/20 focus-visible:outline-offset-[5px] ${textColor} ${fz} ${opacity} ${focusRing}`}
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
    <div
      className="max-w-[440px] bg-cbm-black p-4"
      style={{ border: "1px solid rgba(245,242,237,0.07)", borderLeft: "2px solid #FB3640" }}
    >
      <div className="flex items-start justify-between">
        <p className="font-body text-[9px] font-medium uppercase tracking-[0.32em] text-cbm-red/70">
          Web Design
        </p>
        <button
          type="button"
          className="font-body text-[11px] text-cbm-gray-400 transition-colors duration-150 hover:text-cbm-white focus-visible:outline focus-visible:outline-[1.5px] focus-visible:outline-white/25 focus-visible:outline-offset-[5px]"
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
      <div className="mt-4 pt-3" style={{ borderTop: "1px solid rgba(245,242,237,0.07)" }}>
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
    <div
      className="w-52 border-l-2 border-l-cbm-red p-3 shadow-[0_2px_16px_rgba(0,0,0,0.5)]"
      style={{ background: "#060A07", border: "1px solid rgba(245,242,237,0.07)", borderLeft: "2px solid #FB3640" }}
    >
      <p className="font-body text-[9px] font-medium uppercase tracking-[0.32em] text-cbm-red/70">
        Web Design
      </p>
      <h3 className="mt-2 font-display text-[15px] font-bold leading-[1.15] tracking-[-0.01em] text-cbm-white">
        Marca Orgânica
      </h3>
      <p className="mt-2 font-body text-[12px] font-light leading-[1.7] text-cbm-gray-400">
        Identidade visual premium para studio de arquitetura sustentável.
      </p>
      <div className="mt-4 pt-3" style={{ borderTop: "1px solid rgba(245,242,237,0.07)" }}>
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
      className="border bg-transparent p-8 transition-colors duration-200"
      style={{ borderColor: hovered ? "rgba(245,242,237,0.22)" : "rgba(245,242,237,0.07)" }}
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
        style={{ fontSize: 52, color: "rgba(245,242,237,0.07)" }}
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
        className={`flex aspect-[4/3] items-center justify-center border transition-all duration-200 ${hovered ? "scale-[1.02]" : "hover:scale-[1.02]"}`}
        style={{ background: "#060A07", borderColor: hovered ? "rgba(245,242,237,0.18)" : "rgba(245,242,237,0.07)" }}
      >
        <LogoMark size={48} />
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
    <div className="border bg-cbm-black px-10 py-20 text-center" style={{ borderColor: "rgba(245,242,237,0.07)" }}>
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
        : "border-cbm-gray-800 focus:border-cbm-red focus:ring-1 focus:ring-cbm-red";

  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-body text-[9px] font-medium uppercase tracking-[0.3em] text-cbm-gray-400">
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        readOnly
        className={`border px-4 py-3 font-body text-[14px] text-cbm-white placeholder:text-cbm-gray-600 outline-none transition-colors duration-150 ${borderClass}`}
        style={{ background: "#050806" }}
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
        className="resize-none border px-4 py-3 font-body text-[14px] text-cbm-white placeholder:text-cbm-gray-600 outline-none transition-colors duration-150 focus:border-cbm-red focus:ring-1 focus:ring-cbm-red"
        style={{ background: "#050806", borderColor: "rgba(245,242,237,0.07)" }}
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
      className="relative border"
      style={{ background: "#060A07", borderColor: "rgba(245,242,237,0.07)", height: 240 }}
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
// Project Overlay — component
// ---------------------------------------------------------------------------

function ProjectOverlayPanel({
  data,
  variant = "left",
  overlayState = "active",
}: {
  data: ProjectOverlayData;
  variant?: OverlayVariant;
  overlayState?: OverlayState;
}) {
  const isCompact = variant === "compact";
  const isMobile  = variant === "mobile";

  const enterX = variant === "right" ? "translate-x-2" : "-translate-x-2";
  const stateClass: Record<OverlayState, string> = {
    hidden:   "opacity-0 pointer-events-none",
    entering: `opacity-[0.50] ${isMobile ? "translate-y-2" : enterX}`,
    active:   "opacity-100 translate-x-0 translate-y-0",
    leaving:  `opacity-[0.15] ${isMobile ? "translate-y-0.5" : variant === "right" ? "translate-x-0.5" : "-translate-x-0.5"}`,
  };

  const width    = isMobile ? "w-full" : isCompact ? "w-[236px]" : "w-[296px]";
  const pad      = isCompact ? "p-5" : isMobile ? "px-6 py-7" : "p-7";
  const titleSz  = isCompact ? "text-[16px]" : isMobile ? "text-[20px]" : "text-[22px]";
  const descSz   = isCompact ? "text-[12px]" : "text-[13px]";
  const metaGrid = isCompact ? "grid-cols-1 gap-y-3" : "grid-cols-2 gap-x-5 gap-y-4";

  const DIVIDER_COLOR = "rgba(245,242,237,0.07)";
  const BORDER_COLOR  = "rgba(245,242,237,0.09)";
  const CORNER_COLOR  = "rgba(251,54,64,0.45)";
  const CORNER_SIZE   = 10;

  return (
    <div
      className={`relative ${width} transition-all duration-300 ${stateClass[overlayState]}`}
      style={{ background: "rgba(245,242,237,0.03)", border: `1px solid ${BORDER_COLOR}` }}
    >
      {/* Corner marks — technical detail */}
      {(["tl","tr","bl","br"] as const).map((c) => (
        <span
          key={c}
          className="pointer-events-none absolute"
          style={{
            top:    c.startsWith("t") ? 0 : undefined,
            bottom: c.startsWith("b") ? 0 : undefined,
            left:   c.endsWith("l")   ? 0 : undefined,
            right:  c.endsWith("r")   ? 0 : undefined,
            width:  CORNER_SIZE,
            height: CORNER_SIZE,
            borderTop:    c.startsWith("t") ? `1px solid ${CORNER_COLOR}` : undefined,
            borderBottom: c.startsWith("b") ? `1px solid ${CORNER_COLOR}` : undefined,
            borderLeft:   c.endsWith("l")   ? `1px solid ${CORNER_COLOR}` : undefined,
            borderRight:  c.endsWith("r")   ? `1px solid ${CORNER_COLOR}` : undefined,
          }}
        />
      ))}

      <div className={pad}>
        {/* Eyebrow */}
        <p className="mb-4 font-display text-[8px] font-semibold uppercase tracking-[0.38em] text-cbm-red/70">
          {data.eyebrow}
        </p>

        {/* Title */}
        <h3 className={`mb-4 font-display font-bold leading-[1.08] tracking-[-0.02em] text-cbm-white ${titleSz}`}>
          {data.title}
        </h3>

        {/* Description — hidden in compact */}
        {!isCompact && (
          <p className={`mb-7 font-body font-light leading-[1.78] text-cbm-gray-400 ${descSz}`}>
            {data.description}
          </p>
        )}

        {/* Divider */}
        <div className="mb-6 h-px w-full" style={{ background: DIVIDER_COLOR }} />

        {/* Meta grid */}
        <div className={`mb-6 grid ${metaGrid}`}>
          {data.meta.map(({ label, value }) => (
            <div key={label}>
              <p className="mb-0.5 font-body text-[8px] uppercase tracking-[0.3em] text-cbm-gray-600">{label}</p>
              <p className="font-body text-[11px] font-medium text-cbm-gray-400">{value}</p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="mb-5 h-px w-full" style={{ background: DIVIDER_COLOR }} />

        {/* CTA */}
        <span className="group inline-flex cursor-pointer flex-col items-start gap-[3px]">
          <span className="inline-flex items-center gap-[7px] font-display text-[11px] font-semibold uppercase tracking-[0.15em] text-cbm-white/90 transition-colors duration-200 group-hover:text-cbm-white">
            {data.cta}
            <span className="text-[10px] leading-none opacity-75 transition-[opacity,transform] duration-200 group-hover:translate-x-[2px] group-hover:opacity-100" aria-hidden="true">→</span>
          </span>
          <span className="block h-px w-full origin-left scale-x-0 bg-cbm-red transition-transform duration-[350ms] ease-out group-hover:scale-x-100" />
        </span>
      </div>
    </div>
  );
}

// Landscape mesh — triangulated SVG terrain simulating Paisagem Digital
function LandscapeMesh() {
  const pts: [number, number][] = [
    [530,72],[598,58],[668,80],[740,52],[812,70],[880,48],[940,62],
    [510,148],[580,132],[650,155],[722,128],[794,150],[864,124],[930,140],
    [490,235],[562,218],[634,242],[706,212],[778,238],[850,210],[918,228],
    [472,330],[545,310],[618,336],[690,304],[762,330],[836,300],[904,322],
  ];
  const edges: [number, number][] = [
    [0,1],[1,2],[2,3],[3,4],[4,5],[5,6],
    [7,8],[8,9],[9,10],[10,11],[11,12],[12,13],
    [14,15],[15,16],[16,17],[17,18],[18,19],[19,20],
    [21,22],[22,23],[23,24],[24,25],[25,26],[26,27],
    [0,7],[1,8],[2,9],[3,10],[4,11],[5,12],[6,13],
    [7,14],[8,15],[9,16],[10,17],[11,18],[12,19],[13,20],
    [14,21],[15,22],[16,23],[17,24],[18,25],[19,26],[20,27],
    [0,8],[1,9],[2,10],[3,11],[4,12],[5,13],
    [7,15],[8,16],[9,17],[10,18],[11,19],[12,20],
    [14,22],[15,23],[16,24],[17,25],[18,26],[19,27],
  ];
  return (
    <svg
      className="pointer-events-none absolute right-0 top-0 h-full"
      style={{ width: "62%", opacity: 0.09 }}
      viewBox="460 40 500 310"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {edges.map(([a, b], i) => (
        <line key={i} x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]}
          stroke="#F5F2ED" strokeWidth="0.5" />
      ))}
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1" fill="#F5F2ED" fillOpacity="0.5" />
      ))}
    </svg>
  );
}

// Anchor connector — simulates 3D hotspot anchor
function OverlayConnector({ direction = "right" }: { direction?: "left" | "right" }) {
  const x1 = direction === "right" ? "2%" : "98%";
  const x2 = direction === "right" ? "68%" : "32%";
  const y1 = "50%"; const y2 = "36%";
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" style={{ shapeRendering: "crispEdges" } as CSSProperties} aria-hidden="true">
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(251,54,64,0.30)" strokeWidth="1" />
      <circle cx={x2} cy={y2} r="2.5" fill="#FB3640" fillOpacity="0.85" />
      <circle cx={x2} cy={y2} r="5" fill="none" stroke="rgba(251,54,64,0.20)" strokeWidth="1" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Lab page header — system status inventory
// ---------------------------------------------------------------------------

const SYSTEM_STATUS = [
  { label: "Brand Tokens",     status: "draft"    },
  { label: "Navbar System",    status: "draft"    },
  { label: "Button System V1", status: "approved" },
  { label: "Project Overlay",  status: "progress" },
  { label: "Cards",            status: "progress" },
  { label: "Forms",            status: "progress" },
  { label: "Case System",      status: "progress" },
] as const;

type SystemStatus = "approved" | "draft" | "progress";

const STATUS_STYLE: Record<SystemStatus, string> = {
  approved: "text-cbm-red/80 border-cbm-red/25",
  draft:    "text-cbm-gray-800 border-cbm-gray-800",
  progress: "text-cbm-gray-600 border-cbm-gray-600/40",
};

const STATUS_TEXT: Record<SystemStatus, string> = {
  approved: "✦ V1 Approved",
  draft:    "Draft",
  progress: "In Progress",
};

function LabPageHeader() {
  return (
    <div className="border-b" style={{ background: "#030403", borderColor: "rgba(245,242,237,0.06)" }}>
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 py-24">
        {/* Status inventory */}
        <div className="mb-16 flex flex-wrap gap-2">
          {SYSTEM_STATUS.map(({ label, status }) => (
            <span
              key={label}
              className={`border px-3 py-1 font-body text-[8px] uppercase tracking-[0.25em] ${STATUS_STYLE[status]}`}
            >
              {label} — {STATUS_TEXT[status]}
            </span>
          ))}
        </div>

        {/* Title + index */}
        <div className="flex items-end justify-between gap-12">
          <div>
            <p className="mb-4 font-body text-[9px] font-medium uppercase tracking-[0.4em] text-cbm-red/60">
              Coded by M
            </p>
            <h1
              className="font-display font-bold leading-[0.92] tracking-[-0.03em] text-cbm-white"
              style={{ fontSize: "clamp(56px, 7vw, 96px)" }}
            >
              UI Lab
            </h1>
            <p className="mt-6 max-w-[440px] font-body text-[14px] font-light leading-[1.75] text-cbm-gray-400">
              Laboratório de design system. Tokens, componentes e padrões que constroem a identidade visual da Coded by M.
            </p>
          </div>

          <nav className="hidden lg:flex flex-col items-end gap-2.5 pb-1 shrink-0">
            <p className="mb-1 font-body text-[8px] uppercase tracking-[0.3em] text-cbm-gray-800">Índice</p>
            {[
              { n: "01", label: "Brand Tokens",    href: "#brand-tokens" },
              { n: "02", label: "Navbar System",   href: "#navbar"       },
              { n: "03", label: "Button System",   href: "#buttons"      },
              { n: "04", label: "Project Overlay", href: "#overlay-v1"   },
              { n: "05", label: "Playground",      href: "#playground"   },
              { n: "06", label: "Case System", href: "#case-system" },
            ].map(({ n, label, href }) => (
              <a
                key={n}
                href={href}
                className="flex items-center gap-3 font-body text-[10px] uppercase tracking-[0.2em] text-cbm-gray-600 transition-colors duration-150 hover:text-cbm-white"
              >
                <span className="text-cbm-gray-800">{n}</span>
                {label}
              </a>
            ))}
          </nav>
        </div>
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
      <LabPageHeader />

      {/* ── 01 BRAND TOKENS ────────────────────────────────────────────────── */}
      <SectionBlock id="brand-tokens" label="01 — Brand Tokens" title="Tokens de Marca">

        {/* Color palette */}
        <div className="mb-16">
          <CLabel>Paleta de Cores</CLabel>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11">
            {COLOR_PALETTE.map((color) => (
              <div key={color.token}>
                <div
                  className="mb-2 h-10 w-full border border-cbm-gray-800"
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

        {/* Typography scale */}
        <div className="mb-16">
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
          <div className="overflow-hidden border border-cbm-gray-800">
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
                  <div className="flex items-center gap-2 border-r border-cbm-gray-800 px-4 py-5">
                    <p className="font-body text-[8px] uppercase tracking-[0.2em] text-cbm-gray-600">{token}</p>
                    {changed && <span className="shrink-0 rounded-full bg-cbm-red" style={{ width: 5, height: 5 }} />}
                  </div>
                  <div className="border-r border-cbm-gray-800 px-6 py-5">
                    <p style={{ fontFamily: v1.family, fontSize: v1.size, fontWeight: v1.weight, letterSpacing: v1.tracking, lineHeight: v1.lineHeight, color: v1.color ?? "#F5F2ED", textTransform: v1.uppercase ? "uppercase" : undefined } as CSSProperties}>
                      {v1.sample}
                    </p>
                  </div>
                  <div className="px-6 py-5">
                    <p style={{ fontFamily: v2.family, fontSize: v2.size, fontWeight: v2.weight, letterSpacing: v2.tracking, lineHeight: v2.lineHeight, color: v2.color ?? "#F5F2ED", textTransform: v2.uppercase ? "uppercase" : undefined } as CSSProperties}>
                      {v2.sample}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </SectionBlock>

      {/* ── 02 NAVBAR SYSTEM ───────────────────────────────────────────────── */}
      <SectionBlock id="navbar" label="02 — Navbar System" title="Navbar">
        <p className="mb-10 max-w-[480px] font-body text-[13px] font-light leading-[1.75] text-cbm-gray-600">
          Transição de 96px (default) para 72px (scrolled). Logo, links centralizados e CTA Primary no extremo direito.
        </p>
        <div className="flex flex-col gap-8">
          <div>
            <CLabel>Default — 96px · logo 40px</CLabel>
            <div className="px-12 py-16" style={{ background: "#030403" }}>
              <NavbarPreview scrolled={false} />
            </div>
          </div>
          <div>
            <CLabel>Scrolled — 72px · logo 30px</CLabel>
            <div className="px-12 py-16" style={{ background: "#030403" }}>
              <NavbarPreview scrolled={true} />
            </div>
          </div>
        </div>
      </SectionBlock>

      {/* ── 03 BUTTON SYSTEM V1 ────────────────────────────────────────────── */}
      <SectionBlock id="buttons" label="03 — Button System" title="Sistema de Botões — V1">

        {/* System info bar */}
        <div className="mb-12 flex items-start justify-between gap-8">
          <p className="max-w-[480px] font-body text-[13px] font-light leading-[1.75] text-cbm-gray-600">
            Quatro variantes com hierarquia explícita. Primary reservado para ação máxima.
            Text Link CTA para navegação contextual. Ghost para descoberta passiva.
          </p>
          <span className="shrink-0 border border-cbm-red/25 px-3 py-1 font-body text-[8px] uppercase tracking-[0.25em] text-cbm-red/80">
            ✦ V1 Approved
          </span>
        </div>

        <div className="flex flex-col gap-14">

          {/* ── Primary */}
          <div>
            <div className="mb-4">
              <CLabel>Primary — Ação principal · Panchang 600 · bg-cbm-red</CLabel>
              <p className="font-body text-[11px] font-light leading-[1.7] text-cbm-gray-600 max-w-[520px]">
                Único elemento vermelho por viewport. A seta desloca +2px no hover.
                O tracking abre de 0.15em para 0.18em. Pressed comprime 2%.
              </p>
            </div>
            <PreviewBox>
              <div className="flex flex-col gap-8">
                <div className="flex flex-wrap items-end gap-8">
                  {(["default","hover","pressed","focus","disabled"] as BtnState[]).map((s) => (
                    <div key={s}>
                      <StateLabel>{s}</StateLabel>
                      <BtnPrimary state={s} label="Iniciar Projeto" />
                    </div>
                  ))}
                </div>
                <div className="border-t border-cbm-gray-800 pt-6 flex flex-wrap items-end gap-8">
                  <div><StateLabel>Compact · Default</StateLabel><BtnPrimary compact label="Iniciar" /></div>
                  <div><StateLabel>Compact · Hover</StateLabel><BtnPrimary compact state="hover" label="Iniciar" /></div>
                </div>
              </div>
            </PreviewBox>
          </div>

          {/* ── Secondary */}
          <div>
            <div className="mb-4">
              <CLabel>Secondary — Navegação secundária · Panchang 600 · border-only</CLabel>
              <p className="font-body text-[11px] font-light leading-[1.7] text-cbm-gray-600 max-w-[520px]">
                Borda como estrutura, não decoração. Default recua em opacidade. Hover sobe para presença total.
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
                  <div><StateLabel>Compact · Default</StateLabel><BtnSecondary compact label="Ver" /></div>
                  <div><StateLabel>Compact · Hover</StateLabel><BtnSecondary compact state="hover" label="Ver" /></div>
                </div>
              </div>
            </PreviewBox>
          </div>

          {/* ── Text Link CTA */}
          <div>
            <div className="mb-4">
              <CLabel>Text Link CTA — O mais elegante do sistema · tipografia + linha</CLabel>
              <p className="font-body text-[11px] font-light leading-[1.7] text-cbm-gray-600 max-w-[520px]">
                Sem caixa, sem borda. Linha vermelha desliza da esquerda em 350ms ease-out. Seta avança 2px.
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

          {/* ── Ghost */}
          <div>
            <div className="mb-4">
              <CLabel>Ghost — Ações discretas · tipografia apenas · opacidade como hierarquia</CLabel>
              <p className="font-body text-[11px] font-light leading-[1.7] text-cbm-gray-600 max-w-[520px]">
                Mínimo absoluto. Default quase invisível. Hover revela completamente. Para exploração, não conversão.
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
                  <div><StateLabel>Compact · Default</StateLabel><BtnGhost compact label="Ver" /></div>
                  <div><StateLabel>Compact · Hover</StateLabel><BtnGhost compact state="hover" label="Ver" /></div>
                </div>
              </div>
            </PreviewBox>
          </div>

          {/* ── Usage table */}
          <div>
            <CLabel>Hierarquia de Uso — onde cada botão pertence</CLabel>
            <div className="overflow-hidden border border-cbm-gray-800">
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
              {[
                { surface: "Hero",             p: "✦ Principal", s: "Secundário", l: "—",        g: "—"        },
                { surface: "CTA Final",        p: "✦ Único",     s: "—",          l: "—",        g: "—"        },
                { surface: "Paisagem Digital", p: "—",           s: "—",          l: "—",        g: "✦ Hint"   },
                { surface: "Cards",            p: "—",           s: "—",          l: "✦ CTA",    g: "—"        },
                { surface: "Cases",            p: "—",           s: "—",          l: "✦ Estudo", g: "Explorar" },
                { surface: "Navbar",           p: "✦ Iniciar",   s: "—",          l: "—",        g: "✦ Links"  },
              ].map(({ surface, p, s, l, g }) => (
                <div key={surface} className="grid grid-cols-[160px_1fr_1fr_1fr_1fr] border-b border-cbm-gray-800 last:border-0">
                  <div className="border-r border-cbm-gray-800 px-5 py-4">
                    <p className="font-body text-[10px] font-medium text-cbm-gray-400">{surface}</p>
                  </div>
                  {[p, s, l, g].map((v, i) => (
                    <div key={i} className="border-r border-cbm-gray-800 last:border-0 px-5 py-4">
                      <p className={`font-body text-[10px] ${v.startsWith("✦") ? "font-medium text-cbm-red/80" : v === "—" ? "text-cbm-gray-800" : "text-cbm-gray-400"}`}>
                        {v}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <p className="mt-4 max-w-[560px] font-body text-[10px] font-light leading-[1.75] text-cbm-gray-600">
              Nunca mais de um Primary por viewport. O vermelho funciona porque é raro.
              Text Link CTA é o padrão dentro de conteúdo. Ghost para ações que não devem solicitar atenção.
            </p>
          </div>

        </div>
      </SectionBlock>

      {/* ── 04 PROJECT OVERLAY V1 ──────────────────────────────────────────── */}
      <SectionBlock id="overlay-v1" label="04 — Project Overlay" title="Project Overlay System — V1">

        {/* ── Hero: 2 colunas — info esquerda + preview direita */}
        <div className="mb-0 overflow-hidden border border-cbm-gray-800">
          <div className="grid grid-cols-[260px_1fr]">

            {/* Coluna esquerda — info */}
            <div className="flex flex-col justify-between border-r border-cbm-gray-800 p-8">
              <div>
                <p className="mb-2 font-body text-[8px] uppercase tracking-[0.4em] text-cbm-red/60">
                  Overlay Layer
                </p>
                <p className="font-body text-[13px] font-light leading-[1.78] text-cbm-gray-400">
                  Painel editorial que emerge sobre a Paisagem Digital. Ancorado a um fragmento 3D
                  via projeção de coordenadas. Apenas um ativo por vez.
                </p>

                <div className="mt-8 flex flex-col gap-3">
                  {[
                    "Um overlay ativo por vez",
                    "Não é card de grade",
                    "CTA: Text Link — nunca Primary",
                    "Descrição máxima 2 linhas",
                    "Mobile: bottom sheet",
                  ].map((r) => (
                    <div key={r} className="flex items-start gap-2.5">
                      <span className="mt-[5px] h-px w-3 shrink-0 bg-cbm-red/40" />
                      <p className="font-body text-[10px] font-light leading-[1.6] text-cbm-gray-600">{r}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 border-t border-cbm-gray-800 pt-6">
                <p className="font-body text-[9px] font-light italic text-cbm-gray-800">
                  Nada surge pronto. Tudo é construído.
                </p>
              </div>
            </div>

            {/* Coluna direita — preview hero */}
            <div className="relative overflow-hidden" style={{ background: "#000F08", minHeight: 480 }}>

              {/* Dot grid sutil */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage: "radial-gradient(circle, rgba(245,242,237,0.035) 1px, transparent 1px)",
                  backgroundSize: "36px 36px",
                }}
              />

              {/* Terrain mesh SVG */}
              <LandscapeMesh />

              {/* Tab labels */}
              <div className="absolute right-5 top-5 flex items-center gap-1.5">
                {["Preview Principal", "Overlay Left", "Active"].map((t, i) => (
                  <span
                    key={t}
                    className="font-body text-[8px] uppercase tracking-[0.2em]"
                    style={{
                      padding: "3px 10px",
                      border: i === 0 ? "1px solid rgba(245,242,237,0.12)" : "1px solid rgba(251,54,64,0.25)",
                      color: i === 0 ? "rgba(245,242,237,0.35)" : "rgba(251,54,64,0.6)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Overlay panel + connector */}
              <div className="relative flex h-full items-center" style={{ minHeight: 480, padding: "60px 52px" }}>
                <ProjectOverlayPanel data={PROJECT_SAMPLE} variant="left" overlayState="active" />
                <OverlayConnector direction="right" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Variações — fila horizontal */}
        <div className="mt-0 border border-t-0 border-cbm-gray-800">
          <div className="border-b border-cbm-gray-800 px-6 py-3">
            <p className="font-body text-[8px] uppercase tracking-[0.3em] text-cbm-gray-600">
              Variações — Left · Right · Compact · Mobile
            </p>
          </div>
          <div className="grid grid-cols-4">
            {([
              { v: "left"    as OverlayVariant, label: "Left",    note: "Projeto ativo à direita",        justify: "justify-start" },
              { v: "right"   as OverlayVariant, label: "Right",   note: "Projeto ativo à esquerda",       justify: "justify-end"   },
              { v: "compact" as OverlayVariant, label: "Compact", note: "Cena com pouco espaço",          justify: "justify-start" },
              { v: "mobile"  as OverlayVariant, label: "Mobile",  note: "Bottom sheet — telas pequenas",  justify: "justify-start" },
            ]).map(({ v, label, note, justify }, i) => (
              <div
                key={v}
                className="flex flex-col"
                style={{ borderRight: i < 3 ? "1px solid rgba(26,42,30,1)" : undefined }}
              >
                <div className="border-b border-cbm-gray-800 px-4 py-2">
                  <p className="font-body text-[8px] uppercase tracking-[0.2em] text-cbm-gray-600">{label}</p>
                </div>
                <div
                  className={`flex flex-1 ${justify} p-5`}
                  style={{ background: "#000F08", minHeight: 320 }}
                >
                  <ProjectOverlayPanel data={PROJECT_SAMPLE} variant={v} overlayState="active" />
                </div>
                <div className="border-t border-cbm-gray-800 px-4 py-2">
                  <p className="font-body text-[9px] font-light text-cbm-gray-800">{note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom: 3 colunas — Estados | Regras | Export */}
        <div className="mt-0 overflow-hidden border border-t-0 border-cbm-gray-800">
          <div className="grid grid-cols-[1fr_1fr_1fr]">

            {/* Col 1: Estados */}
            <div className="border-r border-cbm-gray-800">
              <div className="border-b border-cbm-gray-800 px-6 py-3">
                <p className="font-body text-[8px] uppercase tracking-[0.3em] text-cbm-gray-600">Estados</p>
              </div>
              <div className="flex flex-col gap-0">
                {(["hidden","entering","active","leaving"] as OverlayState[]).map((s, i) => (
                  <div
                    key={s}
                    className="flex items-center gap-5 px-6 py-5"
                    style={{ borderBottom: i < 3 ? "1px solid rgba(26,42,30,0.8)" : undefined, background: "#000F08" }}
                  >
                    {s === "hidden" ? (
                      <div
                        className="w-full shrink-0"
                        style={{ border: "1px dashed rgba(245,242,237,0.06)", padding: "10px 12px" }}
                      >
                        <p className="font-body text-[8px] uppercase tracking-[0.2em] text-cbm-gray-800">
                          hidden · opacity 0
                        </p>
                      </div>
                    ) : (
                      <div className="w-full overflow-hidden" style={{ transform: "scale(0.72)", transformOrigin: "left center" }}>
                        <ProjectOverlayPanel data={PROJECT_SAMPLE} variant="left" overlayState={s} />
                      </div>
                    )}
                  </div>
                ))}
                <div className="grid grid-cols-4 border-t border-cbm-gray-800" style={{ background: "#000F08" }}>
                  {[
                    { s: "hidden",   label: "Fora de cena"    },
                    { s: "entering", label: "Slide + fade"    },
                    { s: "active",   label: "Plena leitura"   },
                    { s: "leaving",  label: "Saída discreta"  },
                  ].map(({ s, label }, i) => (
                    <div
                      key={s}
                      className="px-3 py-3"
                      style={{ borderRight: i < 3 ? "1px solid rgba(26,42,30,0.8)" : undefined }}
                    >
                      <p className="font-body text-[8px] uppercase tracking-[0.18em] text-cbm-gray-800">{s}</p>
                      <p className="mt-0.5 font-body text-[9px] font-light text-cbm-gray-800">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Col 2: Regras de Uso */}
            <div className="border-r border-cbm-gray-800">
              <div className="border-b border-cbm-gray-800 px-6 py-3">
                <p className="font-body text-[8px] uppercase tracking-[0.3em] text-cbm-gray-600">Regras de Uso</p>
              </div>
              <div className="flex flex-col gap-0 p-0">
                {[
                  { rule: "Um overlay ativo por vez",                    note: "Dois painéis simultâneos quebram a atenção." },
                  { rule: "Não usar em grade ou lista",                  note: "O overlay é contextual ao projeto ativo."    },
                  { rule: "CTA: Text Link, nunca Primary",               note: "O usuário está explorando, não convertendo." },
                  { rule: "Descrição máxima 2 linhas",                   note: "Texto longo quebra a imersão da cena 3D."    },
                  { rule: "Mobile: bottom sheet",                        note: "Bottom sheet preserva o contexto visual."    },
                  { rule: "Compact quando altura disponível < 300px",    note: "Evita overflow na cena 3D."                  },
                ].map(({ rule, note }, i) => (
                  <div
                    key={i}
                    className="px-6 py-4"
                    style={{ borderBottom: i < 5 ? "1px solid rgba(26,42,30,0.8)" : undefined }}
                  >
                    <p className="font-body text-[11px] font-medium text-cbm-white/70">{rule}</p>
                    <p className="mt-1 font-body text-[10px] font-light leading-[1.6] text-cbm-gray-600">{note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Col 3: Export Notes */}
            <div>
              <div className="border-b border-cbm-gray-800 px-6 py-3">
                <p className="font-body text-[8px] uppercase tracking-[0.3em] text-cbm-gray-600">Export Notes</p>
              </div>
              <div className="p-6">
                <p className="mb-6 font-body text-[11px] font-light leading-[1.7] text-cbm-gray-600">
                  Separação futura em arquivos independentes:
                </p>
                <div className="flex flex-col gap-5">
                  {[
                    { path: "components/project/ProjectOverlay.tsx",       note: "Left, Right, Compact via prop variant"     },
                    { path: "components/project/ProjectOverlayMobile.tsx", note: "Bottom sheet com swipe gesture"             },
                    { path: "components/project/ProjectMeta.tsx",          note: "Grade de meta — reutilizável"               },
                    { path: "hooks/useOverlayProjection.ts",               note: "3D→2D via useFrame sem re-render a 60fps"   },
                  ].map(({ path, note }) => (
                    <div key={path}>
                      <code className="block font-body text-[9px] text-cbm-red/60">{path}</code>
                      <p className="mt-0.5 font-body text-[10px] font-light text-cbm-gray-600">{note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

      </SectionBlock>

      {/* ── 05 PLAYGROUND ──────────────────────────────────────────────────── */}
      <SectionBlock id="playground" label="05 — Playground" title="Components">
        <p className="mb-12 max-w-[480px] font-body text-[13px] font-light leading-[1.75] text-cbm-gray-600">
          Componentes em desenvolvimento. Estrutura definida, testada em contexto. Prontos para exportação individual.
        </p>

        <div className="flex flex-col">

          {/* ── Cards ──────────────────────────────────────────────── */}
          <div className="pb-16">
            <div className="mb-8 border-b border-cbm-gray-800 pb-4">
              <p className="font-body text-[9px] uppercase tracking-[0.3em] text-cbm-gray-600">Cards</p>
            </div>
            <div className="flex flex-col gap-12">
              <div>
                <CLabel>Project Card — bg-cbm-forest · w-52</CLabel>
                <PreviewBox>
                  <div className="flex flex-wrap gap-10">
                    <div><StateLabel>Default</StateLabel><ProjectCard /></div>
                    <div><StateLabel>Hover (link CTA)</StateLabel><ProjectCard ctaHovered /></div>
                  </div>
                </PreviewBox>
              </div>
              <div>
                <CLabel>Service Card — transparent · border-cbm-border · hover: border-active</CLabel>
                <PreviewBox>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div><StateLabel>Default</StateLabel><ServiceCard /></div>
                    <div><StateLabel>Hover</StateLabel><ServiceCard hovered /></div>
                    <div><StateLabel>Variant</StateLabel><ServiceCard n="02" title="Desenvolvimento Web" description="Código limpo, performático e acessível. Do protótipo ao deploy em produção." /></div>
                  </div>
                </PreviewBox>
              </div>
              <div>
                <CLabel>Process Card — número decorativo · Panchang · Satoshi body-sm</CLabel>
                <PreviewBox>
                  <div className="flex flex-wrap gap-12">
                    {PROCESS_STEPS.map((s) => (
                      <ProcessCard key={s.n} step={s.n} title={s.title} description={s.desc} />
                    ))}
                  </div>
                </PreviewBox>
              </div>
              <div>
                <CLabel>Lab Card — thumbnail · hover: scale-[1.02] + border-active</CLabel>
                <PreviewBox>
                  <div className="flex flex-wrap gap-8">
                    <div><StateLabel>Default</StateLabel><LabCard /></div>
                    <div><StateLabel>Hover</StateLabel><LabCard hovered /></div>
                    <div><StateLabel>Variant</StateLabel><LabCard label="Triangle Loader" year="2026" /></div>
                  </div>
                </PreviewBox>
              </div>
            </div>
          </div>

          {/* ── Overlay ────────────────────────────────────────────── */}
          <div className="border-t border-cbm-gray-800 pb-16 pt-16">
            <div className="mb-8 border-b border-cbm-gray-800 pb-4">
              <p className="font-body text-[9px] uppercase tracking-[0.3em] text-cbm-gray-600">Overlay</p>
            </div>
            <div className="flex flex-col gap-10">
              <div>
                <CLabel>Mobile Panel — fixed bottom · slide-up (translateY)</CLabel>
                <PreviewBox bg="bg-cbm-black" className="relative min-h-[200px]">
                  <div className="flex items-end justify-start pt-20">
                    <ProjectOverlay />
                  </div>
                </PreviewBox>
              </div>
              <div>
                <CLabel>Connector — SVG · stroke rgba(251,54,64,0.5) · dot cbm-red · desktop only</CLabel>
                <ConnectorPreview />
              </div>
            </div>
          </div>

          {/* ── Forms ──────────────────────────────────────────────── */}
          <div className="border-t border-cbm-gray-800 pb-16 pt-16">
            <div className="mb-8 border-b border-cbm-gray-800 pb-4">
              <p className="font-body text-[9px] uppercase tracking-[0.3em] text-cbm-gray-600">Forms</p>
            </div>
            <PreviewBox>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                <InputField label="Nome" placeholder="Seu nome completo" state="default" />
                <InputField label="Email — Focus" placeholder="seu@email.com" state="focus" />
                <InputField label="Empresa — Error" placeholder="Nome da empresa" state="error" />
              </div>
              <div className="mt-8 max-w-sm">
                <TextareaField />
              </div>
            </PreviewBox>
          </div>

          {/* ── CTA Block ──────────────────────────────────────────── */}
          <div className="border-t border-cbm-gray-800 pb-16 pt-16">
            <div className="mb-8 border-b border-cbm-gray-800 pb-4">
              <p className="font-body text-[9px] uppercase tracking-[0.3em] text-cbm-gray-600">CTA Block</p>
            </div>
            <CTABlock />
          </div>

          {/* ── Section Header ─────────────────────────────────────── */}
          <div className="border-t border-cbm-gray-800 pt-16">
            <div className="mb-8 border-b border-cbm-gray-800 pb-4">
              <p className="font-body text-[9px] uppercase tracking-[0.3em] text-cbm-gray-600">Section Header</p>
            </div>
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
                  <SectionHeader tag="Laboratório" title="Explorações visuais que expandem a linguagem." />
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
          </div>

        </div>
      </SectionBlock>

      {/* ── 06 CASE SYSTEM ───────────────────────────────────────────────────── */}
      <SectionBlock id="case-system" label="06 — Case System" title="Case System — V1">

        <p className="mb-12 max-w-[480px] font-body text-[13px] font-light leading-[1.75] text-cbm-gray-600">
          Destino final dos projetos da Paisagem Digital. Rota{" "}
          <code className="font-body text-[12px] text-cbm-red/60">/cases/[slug]</code>{" "}
          com split hero, galeria assimétrica e retorno ao 3D.
        </p>

        <div className="flex flex-col gap-16">

          {/* ── Case Hero */}
          <div>
            <CLabel>Case Hero V1 — Split 50/50 · collage 5 painéis · Project Facts</CLabel>
            <div style={{ border: "1px solid rgba(245,242,237,0.07)" }}>
              {(() => {
                const project = getCaseBySlug("machado-plataformas");
                if (!project) return null;
                return <CaseHero project={project} />;
              })()}
            </div>
          </div>

          {/* ── Overview */}
          <div>
            <CLabel>Case Overview — texto editorial + bloco de desafio</CLabel>
            <div style={{ border: "1px solid rgba(245,242,237,0.07)" }}>
              {(() => {
                const project = getCaseBySlug("machado-plataformas");
                if (!project) return null;
                return <CaseOverview project={project} />;
              })()}
            </div>
          </div>

          {/* ── Gallery */}
          <div>
            <CLabel>Case Gallery — grid assimétrico de prints</CLabel>
            <div style={{ border: "1px solid rgba(245,242,237,0.07)" }}>
              {(() => {
                const project = getCaseBySlug("machado-plataformas");
                if (!project) return null;
                return <CaseGallery project={project} />;
              })()}
            </div>
          </div>

          {/* ── Return CTA */}
          <div>
            <CLabel>Case Return CTA — volta à Paisagem Digital</CLabel>
            <div style={{ border: "1px solid rgba(245,242,237,0.07)" }}>
              <CaseReturnCTA />
            </div>
          </div>

        </div>
      </SectionBlock>

      {/* Footer */}
      <footer className="border-t border-cbm-gray-800 py-8">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 sm:px-10">
          <p className="font-body text-[9px] uppercase tracking-[0.3em] text-cbm-gray-600">
            Coded by M — UI Lab
          </p>
          <p className="font-body text-[9px] uppercase tracking-[0.3em] text-cbm-gray-600">
            Button System V1 · 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
