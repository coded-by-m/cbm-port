import { SLIDES, SLIDE_W, SLIDE_H } from "../slides";

/**
 * Modelo de post — Showcase de Projeto.
 *
 *  /posts/projeto        → contact-sheet dos 5 slides (revisão)
 *  /posts/projeto/2      → só o slide 2, 1080×1350 (export PNG)
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
        Modelo · Showcase de Projeto · 1080×1350
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
