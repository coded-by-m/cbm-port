/**
 * Carrossel 2 — Importância de um bom site.
 *
 * Mesmo sistema "blueprint estrutural" do carrossel 1 (chrome compartilhado),
 * com ritmo próprio: capa com mockup de celular → estatística gigante (75%) →
 * lista de credibilidade (✔) → conversão → CTA de análise gratuita.
 */

import {
  BLACK,
  WHITE,
  RED,
  GRAY_200,
  GRAY_400,
  GRAY_600,
  BORDER,
  PAD,
  SLIDE_W,
  SLIDE_H,
  Symbol,
  Kicker,
  Chrome,
  frame,
} from "@/app/posts/_shared/chrome";

export { SLIDE_W, SLIDE_H };
export const SLIDE_COUNT = 5;

const SCREEN = "#0b120d"; // tela do mockup — verde-escuro um tom acima do fundo

/**
 * Mockup de celular no estilo wireframe da marca — "site carregando".
 * Sem foto: esqueleto de conteúdo + barra de carregamento vermelha.
 */
function PhoneLoading({ style }: { style?: React.CSSProperties }) {
  return (
    <svg
      width="300"
      height="600"
      viewBox="0 0 300 600"
      fill="none"
      aria-hidden
      style={style}
    >
      {/* corpo */}
      <rect x="3" y="3" width="294" height="594" rx="40" fill={SCREEN} stroke={GRAY_600} strokeWidth="2" />
      {/* tela */}
      <rect x="18" y="24" width="264" height="552" rx="22" fill={BLACK} stroke={BORDER} strokeWidth="1" />
      {/* notch */}
      <rect x="120" y="12" width="60" height="7" rx="3.5" fill={GRAY_600} />

      {/* barra de topo do "site" */}
      <rect x="40" y="58" width="70" height="10" fill={GRAY_600} opacity="0.55" />
      <rect x="238" y="58" width="24" height="10" fill={BORDER} />

      {/* hero skeleton */}
      <rect x="40" y="96" width="222" height="96" fill={BORDER} />

      {/* barra de carregamento */}
      <rect x="40" y="214" width="222" height="6" fill={BORDER} />
      <rect x="40" y="214" width="104" height="6" fill={RED} />
      <text
        x="40"
        y="242"
        fill={GRAY_400}
        fontFamily="Satoshi, sans-serif"
        fontSize="12"
        letterSpacing="3"
      >
        CARREGANDO
      </text>

      {/* linhas de conteúdo skeleton */}
      <rect x="40" y="286" width="200" height="12" fill={BORDER} />
      <rect x="40" y="312" width="168" height="12" fill={BORDER} />
      <rect x="40" y="338" width="188" height="12" fill={BORDER} />

      {/* botão skeleton */}
      <rect x="40" y="392" width="130" height="40" fill={GRAY_600} opacity="0.4" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 1 — CAPA (pergunta + mockup)
// ─────────────────────────────────────────────────────────────────────────────
function Slide1() {
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
        <path d="M-40 1120 L1120 240" stroke={WHITE} strokeOpacity="0.045" strokeWidth="1" />
        <path d="M60 900 L360 1180" stroke={RED} strokeOpacity="0.13" strokeWidth="1" />
      </svg>

      <Kicker style={{ position: "absolute", top: 96, left: PAD }}>
        A pergunta
      </Kicker>

      <h1
        style={{
          position: "absolute",
          left: PAD,
          top: 300,
          margin: 0,
          maxWidth: 640,
          fontFamily: "Panchang, sans-serif",
          fontWeight: 800,
          fontSize: 104,
          lineHeight: 0.98,
          letterSpacing: "-0.03em",
        }}
      >
        Seu site <span style={{ color: RED }}>vende</span> ou só existe?
      </h1>

      {/* mockup de celular, inclinado e sangrando no rodapé-direito */}
      <div
        style={{
          position: "absolute",
          right: 40,
          bottom: -70,
          transform: "rotate(-8deg)",
          transformOrigin: "bottom right",
        }}
      >
        <PhoneLoading />
      </div>

      <Chrome index={1} total={SLIDE_COUNT} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 2 — O PRIMEIRO CONTATO (estatística gigante)
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
        <circle cx="720" cy="340" r="2.4" fill={WHITE} fillOpacity="0.12" />
      </svg>

      <Kicker style={{ position: "absolute", top: 110, left: PAD }}>
        O primeiro contato
      </Kicker>

      <div style={{ position: "absolute", left: PAD, right: PAD, top: 210 }}>
        <div
          style={{
            fontFamily: "Panchang, sans-serif",
            fontWeight: 800,
            fontSize: 300,
            lineHeight: 0.82,
            letterSpacing: "-0.05em",
          }}
        >
          75<span style={{ color: RED }}>%</span>
        </div>
        <p
          style={{
            fontFamily: "Satoshi, sans-serif",
            fontWeight: 300,
            fontSize: 33,
            lineHeight: 1.55,
            color: GRAY_200,
            margin: "24px 0 0",
            maxWidth: 720,
          }}
        >
          das pessoas julgam a credibilidade de uma empresa pelo{" "}
          <span style={{ color: WHITE, fontWeight: 500 }}>design do site</span>.
        </p>
        <p
          style={{
            fontFamily: "Satoshi, sans-serif",
            fontWeight: 500,
            fontSize: 15,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: GRAY_600,
            margin: "26px 0 0",
          }}
        >
          Pesquisa · Stanford University
        </p>
      </div>

      <p
        style={{
          position: "absolute",
          left: PAD,
          right: PAD,
          bottom: 200,
          margin: 0,
          paddingTop: 34,
          borderTop: `1px solid ${BORDER}`,
          fontFamily: "Panchang, sans-serif",
          fontWeight: 500,
          fontSize: 34,
          lineHeight: 1.25,
          color: WHITE,
          maxWidth: 760,
        }}
      >
        A primeira impressão não se repete.
      </p>

      <Chrome index={2} total={SLIDE_COUNT} swipe />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 3 — CREDIBILIDADE (lista ✔)
// ─────────────────────────────────────────────────────────────────────────────
function CheckRow({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 26,
        padding: "28px 0",
        borderTop: `1px solid ${BORDER}`,
      }}
    >
      <span
        style={{
          flexShrink: 0,
          width: 26,
          color: RED,
          fontFamily: "Panchang, sans-serif",
          fontWeight: 700,
          fontSize: 30,
          lineHeight: 1,
        }}
      >
        ✔
      </span>
      <span
        style={{
          fontFamily: "Panchang, sans-serif",
          fontWeight: 500,
          fontSize: 40,
          letterSpacing: "-0.01em",
          color: WHITE,
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

      <Kicker style={{ position: "absolute", top: 110, left: PAD }}>
        Credibilidade
      </Kicker>

      <div style={{ position: "absolute", left: PAD, right: PAD, top: 220 }}>
        <h2
          style={{
            fontFamily: "Panchang, sans-serif",
            fontWeight: 700,
            fontSize: 60,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            margin: "0 0 50px",
          }}
        >
          Um site bem feito
          <br />
          transmite:
        </h2>

        <CheckRow>Profissionalismo</CheckRow>
        <CheckRow>Confiança</CheckRow>
        <CheckRow>Você leva seu negócio a sério</CheckRow>

        <p
          style={{
            fontFamily: "Satoshi, sans-serif",
            fontWeight: 300,
            fontSize: 29,
            lineHeight: 1.5,
            color: GRAY_400,
            margin: "48px 0 0",
            borderTop: `1px solid ${BORDER}`,
            paddingTop: 36,
          }}
        >
          Um site genérico transmite o oposto.
        </p>
      </div>

      <Chrome index={3} total={SLIDE_COUNT} swipe />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 4 — CONVERSÃO
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

      <Kicker style={{ position: "absolute", top: 130, left: PAD }}>
        Conversão
      </Kicker>

      <div style={{ position: "absolute", left: PAD, right: PAD, top: 250 }}>
        <h2
          style={{
            fontFamily: "Panchang, sans-serif",
            fontWeight: 700,
            fontSize: 78,
            lineHeight: 1.0,
            letterSpacing: "-0.025em",
            margin: 0,
          }}
        >
          Beleza atrai. Mas é a{" "}
          <span style={{ color: RED }}>conversão</span> que fecha.
        </h2>
        <p
          style={{
            fontFamily: "Satoshi, sans-serif",
            fontWeight: 300,
            fontSize: 30,
            lineHeight: 1.6,
            color: GRAY_200,
            margin: "48px 0 0",
            maxWidth: 760,
          }}
        >
          Botão de contato à vista. Navegação que faz sentido. Carregamento que
          não testa a paciência.
        </p>
      </div>

      <p
        style={{
          position: "absolute",
          left: PAD,
          right: PAD,
          bottom: 200,
          margin: 0,
          paddingTop: 34,
          borderTop: `1px solid ${BORDER}`,
          fontFamily: "Panchang, sans-serif",
          fontWeight: 500,
          fontSize: 34,
          lineHeight: 1.25,
          color: WHITE,
          maxWidth: 800,
        }}
      >
        Um site bonito que não vende é só enfeite digital.
      </p>

      <Chrome index={4} total={SLIDE_COUNT} swipe />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 5 — CTA (análise gratuita)
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
        Bora?
      </Kicker>

      <div style={{ position: "absolute", left: PAD, right: PAD, top: 280 }}>
        <p
          style={{
            fontFamily: "Satoshi, sans-serif",
            fontWeight: 300,
            fontSize: 30,
            lineHeight: 1.5,
            color: GRAY_200,
            margin: "0 0 28px",
            maxWidth: 620,
          }}
        >
          Seu próximo cliente vai te encontrar online.
        </p>
        <h2
          style={{
            fontFamily: "Panchang, sans-serif",
            fontWeight: 700,
            fontSize: 92,
            lineHeight: 0.98,
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          Seu site está
          <br />
          pronto?
        </h2>

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
            Análise gratuita
          </span>
          <span
            style={{
              fontFamily: "Satoshi, sans-serif",
              fontWeight: 400,
              fontSize: 19,
              letterSpacing: "0.04em",
              color: GRAY_400,
              maxWidth: 240,
            }}
          >
            do seu site atual, sem compromisso
          </span>
        </div>
      </div>

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

      <Chrome index={5} total={SLIDE_COUNT} />
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
