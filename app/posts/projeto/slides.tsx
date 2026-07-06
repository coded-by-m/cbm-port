/**
 * Modelo de post — Showcase de Projeto (Coded by M).
 *
 * TEMPLATE reutilizável e VISUAL: preencha o objeto PROJECT abaixo e os 6 slides
 * se montam sozinhos. O protagonista é o trabalho — usa os mockups 3D prontos
 * (laptop/celular, PNG transparente) e prints de seção reais dentro de frames
 * de navegador angulares. Para um novo case, duplique a pasta e troque o PROJECT.
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
  OutlineNumber,
  Kicker,
  Chrome,
  frame,
} from "@/app/posts/_shared/chrome";

export { SLIDE_W, SLIDE_H };
export const SLIDE_COUNT = 6;

// ─────────────────────────────────────────────────────────────────────────────
// ▼▼▼  PREENCHA AQUI PARA CADA NOVO PROJETO  ▼▼▼
// ─────────────────────────────────────────────────────────────────────────────
const PROJECT = {
  title: "MJ Engenharia",
  category: "Landing Page · Engenharia",
  url: "mj-engenharia-flame.vercel.app",
  caseUrl: "codedbym.com/cases/mj-engenharia",
  challenge:
    "Transformar um serviço de engenharia técnico e regulatório numa página que comunica autoridade e conduz o cliente certo até o contato.",
  solutionHeadline: "Uma narrativa de confiança.",
  highlights: [
    "Landing de alta conversão",
    "Narrativa técnica de autoridade",
    "Do problema ao contato qualificado",
  ],
  // Mockups 3D prontos (PNG transparente) — laptop na capa, celular no responsivo
  laptopMockup: "/cases/mj-engenharia/mockup-desktop-3d.webp",
  phoneMockup: "/cases/mj-engenharia/mockup-phone.webp",
  // 2 prints de seção reais para a vitrine (16:10)
  showcase: [
    "/cases/mj-engenharia/hero-2.webp",
    "/cases/mj-engenharia/section-01.webp",
  ],
};
// ─────────────────────────────────────────────────────────────────────────────
// ▲▲▲  FIM DA CONFIGURAÇÃO  ▲▲▲
// ─────────────────────────────────────────────────────────────────────────────

const SCREEN = "#0b120d";

/** Frame de navegador angular segurando um print (hero cropado no topo). */
function BrowserFrame({
  src,
  url,
  width,
  viewport,
  style,
}: {
  src: string;
  url?: string;
  width: number;
  viewport: number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        width,
        background: SCREEN,
        border: `1px solid ${BORDER}`,
        boxShadow: "0 24px 70px rgba(0,0,0,0.55)",
        ...style,
      }}
    >
      <div
        style={{
          height: 40,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 16px",
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        <span style={{ width: 9, height: 9, borderRadius: 999, background: RED }} />
        <span style={{ width: 9, height: 9, borderRadius: 999, background: GRAY_600 }} />
        <span style={{ width: 9, height: 9, borderRadius: 999, background: GRAY_600 }} />
        {url && (
          <span
            style={{
              marginLeft: 14,
              fontFamily: "Satoshi, sans-serif",
              fontWeight: 400,
              fontSize: 13,
              color: GRAY_400,
            }}
          >
            {url}
          </span>
        )}
      </div>
      <div style={{ height: viewport, overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          style={{
            width: "100%",
            display: "block",
            objectFit: "cover",
            objectPosition: "top center",
          }}
        />
      </div>
    </div>
  );
}

/** Imagem-mockup transparente (laptop/celular 3D já renderizado). */
function Mockup({
  src,
  width,
  style,
}: {
  src: string;
  width: number;
  style?: React.CSSProperties;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      style={{
        width,
        display: "block",
        filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.55))",
        ...style,
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 1 — CAPA (laptop 3D + nome)
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
        <path d="M-40 1080 L1120 300" stroke={RED} strokeOpacity="0.12" strokeWidth="1" />
      </svg>

      <Kicker style={{ position: "absolute", top: 96, left: PAD }}>Projeto</Kicker>

      <div style={{ position: "absolute", left: PAD, right: PAD, top: 170 }}>
        <h1
          style={{
            fontFamily: "Panchang, sans-serif",
            fontWeight: 800,
            fontSize: 96,
            lineHeight: 0.94,
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          {PROJECT.title}
        </h1>
        <p
          style={{
            fontFamily: "Satoshi, sans-serif",
            fontWeight: 400,
            fontSize: 24,
            letterSpacing: "0.04em",
            color: RED,
            opacity: 0.85,
            margin: "20px 0 0",
          }}
        >
          {PROJECT.category}
        </p>
      </div>

      <Mockup
        src={PROJECT.laptopMockup}
        width={1000}
        style={{ position: "absolute", left: 60, top: 500 }}
      />

      <Chrome index={1} total={SLIDE_COUNT} swipe />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 2 — O DESAFIO
// ─────────────────────────────────────────────────────────────────────────────
function Slide2() {
  return (
    <div style={frame}>
      <OutlineNumber n="01" style={{ top: -50, right: 60 }} />
      <Kicker style={{ position: "absolute", top: 110, left: PAD }}>
        O desafio
      </Kicker>

      <div style={{ position: "absolute", left: PAD, right: PAD, top: 470 }}>
        <p
          style={{
            fontFamily: "Satoshi, sans-serif",
            fontWeight: 300,
            fontSize: 48,
            lineHeight: 1.42,
            color: WHITE,
            margin: 0,
            maxWidth: 840,
          }}
        >
          {PROJECT.challenge}
        </p>
      </div>

      <Chrome index={2} total={SLIDE_COUNT} swipe />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 3 — POR DENTRO (vitrine de seções)
// ─────────────────────────────────────────────────────────────────────────────
function Slide3() {
  return (
    <div style={frame}>
      <Kicker style={{ position: "absolute", top: 110, left: PAD }}>
        Por dentro
      </Kicker>

      <h2
        style={{
          position: "absolute",
          left: PAD,
          top: 190,
          margin: 0,
          fontFamily: "Panchang, sans-serif",
          fontWeight: 700,
          fontSize: 62,
          lineHeight: 1.0,
          letterSpacing: "-0.025em",
        }}
      >
        Cada seção,
        <br />
        uma <span style={{ color: RED }}>decisão</span>.
      </h2>

      {/* duas seções emolduradas em cascata */}
      <BrowserFrame
        src={PROJECT.showcase[0]}
        width={640}
        viewport={250}
        style={{ position: "absolute", left: 60, top: 470 }}
      />
      <BrowserFrame
        src={PROJECT.showcase[1]}
        width={640}
        viewport={250}
        style={{ position: "absolute", left: 360, top: 800 }}
      />

      <Chrome index={3} total={SLIDE_COUNT} swipe />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 4 — A SOLUÇÃO (headline + destaques)
// ─────────────────────────────────────────────────────────────────────────────
function Slide4() {
  return (
    <div style={frame}>
      <OutlineNumber n="02" style={{ top: -50, right: 60 }} />
      <Kicker style={{ position: "absolute", top: 110, left: PAD }}>
        A solução
      </Kicker>

      <div style={{ position: "absolute", left: PAD, right: PAD, top: 250 }}>
        <h2
          style={{
            fontFamily: "Panchang, sans-serif",
            fontWeight: 700,
            fontSize: 72,
            lineHeight: 1.02,
            letterSpacing: "-0.025em",
            color: WHITE,
            margin: "0 0 64px",
            maxWidth: 820,
          }}
        >
          {PROJECT.solutionHeadline}
        </h2>

        <div>
          {PROJECT.highlights.map((h, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                padding: "24px 0",
                borderTop: `1px solid ${BORDER}`,
              }}
            >
              <span
                style={{
                  flexShrink: 0,
                  color: RED,
                  fontFamily: "Panchang, sans-serif",
                  fontWeight: 700,
                  fontSize: 22,
                  lineHeight: 1,
                }}
              >
                ▲
              </span>
              <span
                style={{
                  fontFamily: "Satoshi, sans-serif",
                  fontWeight: 400,
                  fontSize: 30,
                  color: GRAY_200,
                }}
              >
                {h}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Chrome index={4} total={SLIDE_COUNT} swipe />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 5 — NA PRÁTICA (celular 3D)
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
        <path d="M40 260 L360 120" stroke={WHITE} strokeOpacity="0.05" strokeWidth="1" />
      </svg>

      <Kicker style={{ position: "absolute", top: 110, left: PAD }}>
        Na prática
      </Kicker>

      <h2
        style={{
          position: "absolute",
          left: PAD,
          top: 230,
          margin: 0,
          maxWidth: 440,
          fontFamily: "Panchang, sans-serif",
          fontWeight: 700,
          fontSize: 64,
          lineHeight: 1.04,
          letterSpacing: "-0.02em",
        }}
      >
        Rápido e
        <br />
        <span style={{ color: RED }}>responsivo</span>.
      </h2>

      <p
        style={{
          position: "absolute",
          left: PAD,
          top: 520,
          margin: 0,
          maxWidth: 420,
          fontFamily: "Satoshi, sans-serif",
          fontWeight: 300,
          fontSize: 28,
          lineHeight: 1.6,
          color: GRAY_200,
        }}
      >
        Pensado no mobile primeiro. A mesma presença, do desktop ao bolso do seu
        cliente.
      </p>

      <Mockup
        src={PROJECT.phoneMockup}
        width={360}
        style={{ position: "absolute", right: 120, top: 300, transform: "rotate(4deg)" }}
      />

      <Chrome index={5} total={SLIDE_COUNT} swipe />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 6 — CTA
// ─────────────────────────────────────────────────────────────────────────────
function Slide6() {
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
      </svg>

      <div style={{ position: "absolute", top: 120, right: 96 }}>
        <Symbol size={92} />
      </div>

      <Kicker style={{ position: "absolute", top: 150, left: PAD }}>
        Seu projeto
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
          }}
        >
          Quer um site
          <br />
          <span style={{ color: RED }}>assim</span>?
        </h2>
        <p
          style={{
            fontFamily: "Satoshi, sans-serif",
            fontWeight: 300,
            fontSize: 30,
            lineHeight: 1.55,
            color: GRAY_200,
            margin: "40px 0 0",
            maxWidth: 640,
          }}
        >
          Veja o case completo e vamos conversar sobre o seu.
        </p>

        <div style={{ marginTop: 56, display: "flex", alignItems: "center", gap: 30 }}>
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
          gap: 20,
          fontFamily: "Satoshi, sans-serif",
          fontWeight: 400,
          fontSize: 22,
          letterSpacing: "0.03em",
          color: WHITE,
        }}
      >
        <span>{PROJECT.caseUrl}</span>
      </div>

      <Chrome index={6} total={SLIDE_COUNT} />
    </div>
  );
}

export const SLIDES = [
  <Slide1 key={1} />,
  <Slide2 key={2} />,
  <Slide3 key={3} />,
  <Slide4 key={4} />,
  <Slide5 key={5} />,
  <Slide6 key={6} />,
];
