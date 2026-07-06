/**
 * Carrossel de apresentação — Coded by M.
 *
 * Formato feed do Instagram (1080×1350, 4:5). Construído com o design system
 * real do site — fundo #000F08, Panchang/Satoshi, sinal vermelho raro (#FB3640),
 * linguagem angular (border-radius 0), símbolo triangular da marca.
 *
 * Arte-direção "blueprint estrutural": chrome técnico comum (marcas de registro,
 * barra de progresso segmentada, número de seção em outline) unifica os 5 slides,
 * enquanto cada slide tem composição própria e ritmo distinto (capa assimétrica →
 * denso → lista → arejado → ação). Exportado como PNG via a rota [[...slug]].
 */

const BLACK = "#000F08";
const WHITE = "#F5F2ED";
const RED = "#FB3640";
const GRAY_200 = "#C8C4BE";
const GRAY_400 = "#8A8780";
const GRAY_600 = "#4A4844";
const BORDER = "#1a2a1e";
const OUTLINE = "#16271b"; // stroke do número de seção — verde-escuro técnico

export const SLIDE_W = 1080;
export const SLIDE_H = 1350;
export const SLIDE_COUNT = 5;

const PAD = 88; // margem lateral base

// ─────────────────────────────────────────────────────────────────────────────
// Chrome compartilhado
// ─────────────────────────────────────────────────────────────────────────────

/** Símbolo triangular da marca (mesmo path do LogoMark). */
function Symbol({ size = 96 }: { size?: number }) {
  const h = Math.round((size * 161) / 142);
  return (
    <svg width={size} height={h} viewBox="0 0 142 161" fill="none" aria-hidden>
      <path
        d="M11.5 148.039V59.0391L53.5 104.438"
        stroke={WHITE}
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M130.5 103.039V19.0391L85.5 67.2944"
        stroke={WHITE}
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 18.0391L130.5 147.039"
        stroke={RED}
        strokeWidth="9"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Marcas de registro nos 4 cantos — enquadramento técnico discreto. */
function CropMarks() {
  const L = 24;
  const inset = 44;
  const mark = (x: "left" | "right", y: "top" | "bottom") => (
    <>
      <span
        style={{
          position: "absolute",
          [x]: inset,
          [y]: inset,
          width: L,
          height: 1,
          background: BORDER,
        }}
      />
      <span
        style={{
          position: "absolute",
          [x]: inset,
          [y]: inset,
          width: 1,
          height: L,
          background: BORDER,
        }}
      />
    </>
  );
  return (
    <>
      {mark("left", "top")}
      {mark("right", "top")}
      {mark("left", "bottom")}
      {mark("right", "bottom")}
    </>
  );
}

/** Número de seção em outline gigante — elemento estrutural, pode cropar na borda. */
function OutlineNumber({
  n,
  style,
}: {
  n: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      style={{
        position: "absolute",
        fontFamily: "Panchang, sans-serif",
        fontWeight: 800,
        fontSize: 400,
        lineHeight: 0.78,
        letterSpacing: "-0.05em",
        color: "transparent",
        WebkitTextStroke: `2px ${OUTLINE}`,
        userSelect: "none",
        ...style,
      }}
    >
      {n}
    </span>
  );
}

/** Kicker — traço vermelho + label Satoshi tracked. Posicionável. */
function Kicker({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, ...style }}>
      <span style={{ width: 40, height: 1, background: RED, opacity: 0.75 }} />
      <span
        style={{
          fontFamily: "Satoshi, sans-serif",
          fontWeight: 500,
          fontSize: 17,
          letterSpacing: "0.34em",
          textTransform: "uppercase",
          color: RED,
          opacity: 0.74,
        }}
      >
        {children}
      </span>
    </div>
  );
}

/** Rodapé técnico: índice + wordmark + barra de progresso segmentada. */
function Chrome({ index, swipe }: { index: number; swipe?: boolean }) {
  return (
    <>
      <CropMarks />

      {/* linha índice + wordmark */}
      <div
        style={{
          position: "absolute",
          left: PAD,
          right: PAD,
          bottom: 86,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontFamily: "Satoshi, sans-serif",
            fontWeight: 400,
            fontSize: 15,
            letterSpacing: "0.3em",
            color: GRAY_600,
          }}
        >
          {String(index).padStart(2, "0")}
          <span style={{ color: BORDER }}> / </span>
          {String(SLIDE_COUNT).padStart(2, "0")}
        </span>
        <span
          style={{
            fontFamily: "Panchang, sans-serif",
            fontWeight: 600,
            fontSize: 15,
            letterSpacing: "0.03em",
            color: GRAY_400,
          }}
        >
          CODED <span style={{ color: RED }}>BY</span> M
        </span>
      </div>

      {/* barra de progresso — 5 segmentos */}
      <div
        style={{
          position: "absolute",
          left: PAD,
          right: PAD,
          bottom: 62,
          display: "flex",
          gap: 8,
        }}
      >
        {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
          <span
            key={i}
            style={{
              flex: 1,
              height: 3,
              background:
                i + 1 === index ? RED : i + 1 < index ? GRAY_600 : BORDER,
            }}
          />
        ))}
      </div>

      {swipe && (
        <div
          style={{
            position: "absolute",
            right: PAD,
            bottom: 140,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontFamily: "Satoshi, sans-serif",
            fontWeight: 400,
            fontSize: 13,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: GRAY_600,
          }}
        >
          Arraste
          <svg width="32" height="9" viewBox="0 0 32 9" fill="none" aria-hidden>
            <path d="M0 4.5 H28" stroke={RED} strokeWidth="1.4" />
            <path
              d="M23 1 L29 4.5 L23 8"
              stroke={RED}
              strokeWidth="1.4"
              fill="none"
            />
          </svg>
        </div>
      )}
    </>
  );
}

const frame: React.CSSProperties = {
  position: "relative",
  width: SLIDE_W,
  height: SLIDE_H,
  background: BLACK,
  overflow: "hidden",
  color: WHITE,
  fontFamily: "Satoshi, sans-serif",
};

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 1 — CAPA (hero assimétrico)
// ─────────────────────────────────────────────────────────────────────────────
function Slide1() {
  return (
    <div style={frame}>
      {/* geometria de fundo própria da capa */}
      <svg
        width={SLIDE_W}
        height={SLIDE_H}
        viewBox={`0 0 ${SLIDE_W} ${SLIDE_H}`}
        fill="none"
        aria-hidden
        style={{ position: "absolute", inset: 0 }}
      >
        {/* diagonal-assinatura longa, ecoa o corte vermelho do símbolo */}
        <path d="M-40 980 L1180 180" stroke={RED} strokeOpacity="0.16" strokeWidth="1" />
        <path d="M120 1250 L980 60" stroke={WHITE} strokeOpacity="0.05" strokeWidth="1" />
        <circle cx="1180" cy="180" r="3" fill={RED} fillOpacity="0.5" />
      </svg>

      {/* símbolo grande, ancorado ao topo-direito */}
      <div style={{ position: "absolute", top: 150, right: 110 }}>
        <Symbol size={168} />
      </div>

      <Kicker style={{ position: "absolute", top: 96, left: PAD }}>
        Web Design Premium
      </Kicker>

      {/* wordmark ancorado embaixo à esquerda */}
      <div style={{ position: "absolute", left: PAD, bottom: 250 }}>
        <h1
          style={{
            fontFamily: "Panchang, sans-serif",
            fontWeight: 800,
            fontSize: 168,
            lineHeight: 0.86,
            letterSpacing: "-0.035em",
            margin: 0,
            textTransform: "uppercase",
          }}
        >
          <span style={{ display: "block" }}>CODED</span>
          <span style={{ display: "block" }}>
            <span style={{ color: RED }}>BY</span>&nbsp;M
          </span>
        </h1>
        <p
          style={{
            fontFamily: "Satoshi, sans-serif",
            fontWeight: 300,
            fontSize: 28,
            letterSpacing: "0.02em",
            color: GRAY_400,
            margin: "38px 0 0",
          }}
        >
          Web design &amp; desenvolvimento
        </p>
      </div>

      <Chrome index={1} swipe />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 2 — O QUE FAZEMOS (número denso topo, texto ancorado embaixo)
// ─────────────────────────────────────────────────────────────────────────────
function Slide2() {
  return (
    <div style={frame}>
      <svg
        width={SLIDE_W}
        height={SLIDE_H}
        viewBox={`0 0 ${SLIDE_W} ${SLIDE_H}`}
        fill="none"
        aria-hidden
        style={{ position: "absolute", inset: 0 }}
      >
        <path d="M760 -40 L1120 300 L720 340 Z" stroke={WHITE} strokeOpacity="0.05" strokeWidth="1" />
        <path d="M1020 40 L1160 300" stroke={RED} strokeOpacity="0.14" strokeWidth="1" />
        <circle cx="720" cy="340" r="2.4" fill={WHITE} fillOpacity="0.14" />
      </svg>

      <OutlineNumber n="01" style={{ top: -50, right: 60 }} />
      <Kicker style={{ position: "absolute", top: 110, left: PAD }}>
        O que fazemos
      </Kicker>

      <div style={{ position: "absolute", left: PAD, right: PAD, bottom: 250 }}>
        <h2
          style={{
            fontFamily: "Panchang, sans-serif",
            fontWeight: 700,
            fontSize: 82,
            lineHeight: 1.02,
            letterSpacing: "-0.025em",
            margin: 0,
          }}
        >
          Criamos sites
          <br />
          que <span style={{ color: RED }}>posicionam</span>.
        </h2>
        <p
          style={{
            fontFamily: "Satoshi, sans-serif",
            fontWeight: 300,
            fontSize: 31,
            lineHeight: 1.62,
            color: GRAY_200,
            margin: "44px 0 0",
            maxWidth: 720,
          }}
        >
          Design + código. Do conceito à publicação. Cada pixel é uma decisão;
          cada decisão existe para converter.
        </p>
      </div>

      <Chrome index={2} swipe />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 3 — A DIFERENÇA (lista estruturada ✕ / ▲ — quebra o parágrafo)
// ─────────────────────────────────────────────────────────────────────────────
function DiffRow({
  mark,
  color,
  children,
  strong,
}: {
  mark: React.ReactNode;
  color: string;
  children: React.ReactNode;
  strong?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 26,
        padding: "26px 0",
        borderTop: `1px solid ${BORDER}`,
      }}
    >
      <span
        style={{
          flexShrink: 0,
          width: 22,
          color,
          fontFamily: "Panchang, sans-serif",
          fontWeight: 700,
          fontSize: 26,
          lineHeight: 1,
        }}
      >
        {mark}
      </span>
      <span
        style={{
          fontFamily: "Satoshi, sans-serif",
          fontWeight: strong ? 500 : 300,
          fontSize: 29,
          lineHeight: 1.4,
          color: strong ? WHITE : GRAY_200,
        }}
      >
        {children}
      </span>
    </div>
  );
}

function Slide3() {
  return (
    <div style={frame}>
      <svg
        width={SLIDE_W}
        height={SLIDE_H}
        viewBox={`0 0 ${SLIDE_W} ${SLIDE_H}`}
        fill="none"
        aria-hidden
        style={{ position: "absolute", inset: 0 }}
      >
        <path d="M-60 300 L260 120 L200 520 Z" stroke={WHITE} strokeOpacity="0.045" strokeWidth="1" />
        <circle cx="260" cy="120" r="2.4" fill={WHITE} fillOpacity="0.12" />
      </svg>

      <OutlineNumber n="02" style={{ top: -50, right: 60 }} />
      <Kicker style={{ position: "absolute", top: 110, left: PAD }}>
        A diferença
      </Kicker>

      <div style={{ position: "absolute", left: PAD, right: PAD, top: 240 }}>
        <h2
          style={{
            fontFamily: "Panchang, sans-serif",
            fontWeight: 700,
            fontSize: 74,
            lineHeight: 1.02,
            letterSpacing: "-0.025em",
            margin: "0 0 60px",
          }}
        >
          Design e código.
          <br />
          Mesmo autor.
        </h2>

        <div>
          <DiffRow mark="✕" color={GRAY_600}>
            Não terceirizamos.
          </DiffRow>
          <DiffRow mark="✕" color={GRAY_600}>
            Não usamos templates.
          </DiffRow>
          <DiffRow mark="▲" color={RED} strong>
            Cada site construído do zero, com o design já pensando na
            implementação.
          </DiffRow>
        </div>

        <p
          style={{
            fontFamily: "Satoshi, sans-serif",
            fontWeight: 300,
            fontSize: 27,
            lineHeight: 1.55,
            color: GRAY_400,
            margin: "44px 0 0",
            borderTop: `1px solid ${BORDER}`,
            paddingTop: 34,
          }}
        >
          Resultado: sites rápidos, bonitos e que funcionam.
        </p>
      </div>

      <Chrome index={3} swipe />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 4 — PARA QUEM (arejado, statement dominante)
// ─────────────────────────────────────────────────────────────────────────────
function Slide4() {
  return (
    <div style={frame}>
      <svg
        width={SLIDE_W}
        height={SLIDE_H}
        viewBox={`0 0 ${SLIDE_W} ${SLIDE_H}`}
        fill="none"
        aria-hidden
        style={{ position: "absolute", inset: 0 }}
      >
        <path d="M180 1180 L520 1420 L60 1420 Z" stroke={WHITE} strokeOpacity="0.05" strokeWidth="1" />
        <path d="M80 900 L360 1180" stroke={RED} strokeOpacity="0.12" strokeWidth="1" />
        <circle cx="360" cy="1180" r="2.4" fill={RED} fillOpacity="0.45" />
      </svg>

      {/* número cropado no rodapé-direito */}
      <OutlineNumber n="03" style={{ bottom: 130, right: 40 }} />

      <Kicker style={{ position: "absolute", top: 130, left: PAD }}>
        Para quem
      </Kicker>

      <div style={{ position: "absolute", left: PAD, right: PAD, top: 300 }}>
        <h2
          style={{
            fontFamily: "Panchang, sans-serif",
            fontWeight: 700,
            fontSize: 96,
            lineHeight: 0.98,
            letterSpacing: "-0.03em",
            margin: 0,
            maxWidth: 820,
          }}
        >
          Para quem quer ser levado a <span style={{ color: RED }}>sério</span>.
        </h2>
        <p
          style={{
            fontFamily: "Satoshi, sans-serif",
            fontWeight: 300,
            fontSize: 31,
            lineHeight: 1.6,
            color: GRAY_200,
            margin: "52px 0 0",
            maxWidth: 640,
          }}
        >
          Independente do segmento. Seu site é seu cartão de visitas: ele precisa
          ter a sua cara.
        </p>
      </div>

      <Chrome index={4} swipe />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 5 — CTA (ação)
// ─────────────────────────────────────────────────────────────────────────────
function Slide5() {
  return (
    <div style={frame}>
      <svg
        width={SLIDE_W}
        height={SLIDE_H}
        viewBox={`0 0 ${SLIDE_W} ${SLIDE_H}`}
        fill="none"
        aria-hidden
        style={{ position: "absolute", inset: 0 }}
      >
        <path d="M700 -40 L1120 60 L960 420 Z" stroke={WHITE} strokeOpacity="0.05" strokeWidth="1" />
        <path d="M-40 1000 L1120 120" stroke={WHITE} strokeOpacity="0.04" strokeWidth="1" />
      </svg>

      <div style={{ position: "absolute", top: 120, right: 96 }}>
        <Symbol size={92} />
      </div>

      <Kicker style={{ position: "absolute", top: 150, left: PAD }}>
        Vamos construir
      </Kicker>

      <div style={{ position: "absolute", left: PAD, right: PAD, top: 300 }}>
        <h2
          style={{
            fontFamily: "Panchang, sans-serif",
            fontWeight: 700,
            fontSize: 108,
            lineHeight: 0.96,
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          Vamos
          <br />
          conversar?
        </h2>
        <p
          style={{
            fontFamily: "Satoshi, sans-serif",
            fontWeight: 300,
            fontSize: 30,
            lineHeight: 1.55,
            color: GRAY_200,
            margin: "44px 0 0",
            maxWidth: 640,
          }}
        >
          Seu site é a sua primeira impressão. Vamos fazer ela valer.
        </p>

        <div style={{ marginTop: 60, display: "flex", alignItems: "center", gap: 30 }}>
          <span
            style={{
              display: "inline-block",
              background: RED,
              color: BLACK,
              fontFamily: "Panchang, sans-serif",
              fontWeight: 600,
              fontSize: 22,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              padding: "26px 50px",
            }}
          >
            Chame no WhatsApp
          </span>
          <span
            style={{
              fontFamily: "Satoshi, sans-serif",
              fontWeight: 400,
              fontSize: 19,
              letterSpacing: "0.04em",
              color: GRAY_400,
            }}
          >
            link na bio
          </span>
        </div>
      </div>

      {/* contatos — bloco estruturado acima do chrome */}
      <div
        style={{
          position: "absolute",
          left: PAD,
          right: PAD,
          bottom: 190,
          paddingTop: 34,
          borderTop: `1px solid ${BORDER}`,
          display: "flex",
          alignItems: "center",
          gap: 30,
          fontFamily: "Satoshi, sans-serif",
          fontWeight: 400,
          fontSize: 23,
          letterSpacing: "0.03em",
          color: WHITE,
        }}
      >
        <span>codedbym.com</span>
        <span style={{ color: BORDER }}>·</span>
        <span>@codedbym.co</span>
      </div>

      <Chrome index={5} />
    </div>
  );
}

export const SLIDES = [
  <Slide1 key={1} />,
  <Slide2 key={2} />,
  <Slide3 key={3} />,
  <Slide4 key={4} />,
  <Slide5 key={5} />,
];
