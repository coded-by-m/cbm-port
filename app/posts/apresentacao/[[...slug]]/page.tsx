import type { Metadata } from "next";

/** Renderizador de carrossel — ferramenta de producao, nao conteudo. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

import { SLIDES, SLIDE_W, SLIDE_H } from "../slides";

/**
 * Rota do carrossel de apresentação.
 *
 *  /posts/apresentacao        → contact-sheet: os 5 slides empilhados (revisão)
 *  /posts/apresentacao/2      → só o slide 2, exatamente 1080×1350 (export PNG)
 *
 * O modo single-slide serve pra screenshot 1:1: viewport 1080×1350 → PNG limpo.
 */
export default function Page({ params }: { params: { slug?: string[] } }) {
  const raw = params.slug?.[0];
  const single = raw ? Number(raw) : null;

  if (single && single >= 1 && single <= SLIDES.length) {
    return (
      <main
        style={{
          margin: 0,
          width: SLIDE_W,
          height: SLIDE_H,
          overflow: "hidden",
          background: "#000F08",
        }}
      >
        {SLIDES[single - 1]}
      </main>
    );
  }

  // Contact-sheet de revisão
  return (
    <main
      style={{
        background: "#050505",
        minHeight: "100vh",
        padding: 48,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 48,
      }}
    >
      <p
        style={{
          fontFamily: "Satoshi, sans-serif",
          fontSize: 13,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "#8A8780",
        }}
      >
        Carrossel · Apresentação Coded by M · 1080×1350
      </p>
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          style={{ width: SLIDE_W, height: SLIDE_H, boxShadow: "0 0 0 1px #1a2a1e" }}
        >
          {slide}
        </div>
      ))}
    </main>
  );
}
