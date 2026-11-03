/**
 * Carrossel — Showcase do projeto Machado Plataformas (Coded by M).
 *
 * Post dedicado: o protagonista é o site real. Como o case não tem mockups 3D,
 * os screenshots reais entram em frames de navegador/celular angulares com o
 * chrome "blueprint estrutural" da marca. Segue os mesmos primitivos do
 * _shared/chrome — vermelho-sinal raro, Panchang/Satoshi, zero border-radius.
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
import { cbm } from "@/lib/palette";

export { SLIDE_W, SLIDE_H };
export const SLIDE_COUNT = 7;

// ─────────────────────────────────────────────────────────────────────────────
// Dados do projeto
// ─────────────────────────────────────────────────────────────────────────────
const PROJECT = {
  title: "Machado Plataformas",
  category: "Site Institucional · Implementos Rodoviários",
  url: "machadoplataformas.com.br",
  caseUrl: "codedbym.com/cases/machado-plataformas",
  challenge:
    "Uma empresa técnica de alto valor, percebida como commodity. A presença digital genérica não refletia a capacidade real do negócio.",
  solutionHeadline: "Percepção à altura\nda fábrica.",
  highlights: [
    "Autoridade percebida antes da primeira linha",
    "Clareza comercial da linha leve à pesada",
    "Presença nacional no padrão de quem entrega",
  ],
  stats: [
    { n: "22+", label: "anos no mercado" },
    { n: "4.000+", label: "plataformas entregues" },
    { n: "3.000", label: "m² de fábrica própria", accent: true },
    { n: "5,0★", label: "avaliação no Google" },
  ],
  hero: "/cases/machado/hero-1.webp",
  showcase: [
    "/cases/machado/gallery-3.webp",
    "/cases/machado/gallery-2.webp",
  ],
  mobile: "/cases/machado/mobile-tall.webp",
};

const SCREEN = cbm("frame");

/** Frame de navegador angular segurando um print. */
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

/** Frame de celular angular — barra superior + print vertical (mobile-tall). */
function PhoneFrame({
  src,
  width,
  viewport,
  style,
}: {
  src: string;
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
        boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
        ...style,
      }}
    >
      <div
        style={{
          height: 34,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        <span style={{ width: 40, height: 4, background: GRAY_600 }} />
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

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 1 — CAPA (hero real bleeding + nome)
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
        <path d="M-40 980 L1120 300" stroke={RED} strokeOpacity="0.12" strokeWidth="1" />
      </svg>

      <Kicker style={{ position: "absolute", top: 96, left: PAD }}>
        Projeto no ar
      </Kicker>

      <div style={{ position: "absolute", left: PAD, right: PAD, top: 168 }}>
        <h1
          style={{
            fontFamily: "Panchang, sans-serif",
            fontWeight: 800,
            fontSize: 92,
            lineHeight: 0.94,
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          Machado
          <br />
          Plataformas
        </h1>
        <p
          style={{
            fontFamily: "Satoshi, sans-serif",
            fontWeight: 400,
            fontSize: 22,
            letterSpacing: "0.04em",
            color: RED,
            opacity: 0.85,
            margin: "22px 0 0",
          }}
        >
          {PROJECT.category}
        </p>
      </div>

      <BrowserFrame
        src={PROJECT.hero}
        url={PROJECT.url}
        width={1000}
        viewport={470}
        style={{ position: "absolute", left: 96, top: 560 }}
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

      <div style={{ position: "absolute", left: PAD, right: PAD, top: 300 }}>
        <h2
          style={{
            fontFamily: "Panchang, sans-serif",
            fontWeight: 700,
            fontSize: 68,
            lineHeight: 1.0,
            letterSpacing: "-0.025em",
            margin: 0,
          }}
        >
          Valor de fábrica.
          <br />
          Percepção de <span style={{ color: RED }}>commodity</span>.
        </h2>
      </div>

      <div style={{ position: "absolute", left: PAD, right: PAD, top: 620 }}>
        <p
          style={{
            fontFamily: "Satoshi, sans-serif",
            fontWeight: 300,
            fontSize: 40,
            lineHeight: 1.5,
            color: GRAY_200,
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
// SLIDE 3 — AUTORIDADE (números reais)
// ─────────────────────────────────────────────────────────────────────────────
function Slide3() {
  return (
    <div style={frame}>
      <Kicker style={{ position: "absolute", top: 110, left: PAD }}>
        Quem é a Machado
      </Kicker>

      <h2
        style={{
          position: "absolute",
          left: PAD,
          top: 180,
          margin: 0,
          maxWidth: 760,
          fontFamily: "Panchang, sans-serif",
          fontWeight: 700,
          fontSize: 58,
          lineHeight: 1.02,
          letterSpacing: "-0.025em",
        }}
      >
        Uma fábrica que já
        <br />
        movia o Brasil.
      </h2>

      <div
        style={{
          position: "absolute",
          left: PAD,
          right: PAD,
          top: 470,
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
          borderTop: `1px solid ${BORDER}`,
          borderLeft: `1px solid ${BORDER}`,
        }}
      >
        {PROJECT.stats.map((s, i) => (
          <div
            key={i}
            style={{
              minWidth: 0,
              padding: "46px 34px",
              borderRight: `1px solid ${BORDER}`,
              borderBottom: `1px solid ${BORDER}`,
            }}
          >
            <div
              style={{
                fontFamily: "Panchang, sans-serif",
                fontWeight: 800,
                fontSize: 76,
                lineHeight: 1,
                letterSpacing: "-0.03em",
                whiteSpace: "nowrap",
                color: s.accent ? RED : WHITE,
              }}
            >
              {s.n}
            </div>
            <div
              style={{
                marginTop: 18,
                fontFamily: "Satoshi, sans-serif",
                fontWeight: 400,
                fontSize: 22,
                letterSpacing: "0.02em",
                color: GRAY_400,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <Chrome index={3} total={SLIDE_COUNT} swipe />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 4 — POR DENTRO (vitrine em cascata)
// ─────────────────────────────────────────────────────────────────────────────
function Slide4() {
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

      <BrowserFrame
        src={PROJECT.showcase[0]}
        width={620}
        viewport={250}
        style={{ position: "absolute", left: 60, top: 470 }}
      />
      <BrowserFrame
        src={PROJECT.showcase[1]}
        width={620}
        viewport={250}
        style={{ position: "absolute", left: 380, top: 800 }}
      />

      <Chrome index={4} total={SLIDE_COUNT} swipe />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 5 — A SOLUÇÃO (headline + destaques)
// ─────────────────────────────────────────────────────────────────────────────
function Slide5() {
  return (
    <div style={frame}>
      <OutlineNumber n="02" style={{ top: -50, right: 60 }} />
      <Kicker style={{ position: "absolute", top: 110, left: PAD }}>
        A solução
      </Kicker>

      <div style={{ position: "absolute", left: PAD, right: PAD, top: 240 }}>
        <h2
          style={{
            fontFamily: "Panchang, sans-serif",
            fontWeight: 700,
            fontSize: 76,
            lineHeight: 1.02,
            letterSpacing: "-0.025em",
            color: WHITE,
            margin: "0 0 64px",
            maxWidth: 820,
            whiteSpace: "pre-line",
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
                  fontSize: 29,
                  color: GRAY_200,
                }}
              >
                {h}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Chrome index={5} total={SLIDE_COUNT} swipe />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 6 — NA PRÁTICA (celular real)
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
        Pensado no mobile primeiro. A mesma presença, do desktop ao bolso do
        cliente.
      </p>

      <PhoneFrame
        src={PROJECT.mobile}
        width={330}
        viewport={720}
        style={{ position: "absolute", right: 130, top: 300, transform: "rotate(3deg)" }}
      />

      <Chrome index={6} total={SLIDE_COUNT} swipe />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 7 — CTA
// ─────────────────────────────────────────────────────────────────────────────
function Slide7() {
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

      <Chrome index={7} total={SLIDE_COUNT} />
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
  <Slide7 key={7} />,
];
