"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { HOME_CHAPTERS } from "@/lib/homeChapters";

/**
 * Rota DEV do HomeCanvas (spec 2026-06-06-homecanvas-shared-design).
 *
 * Isolada de propósito: a Home real (`/`) fica intocada enquanto o canvas
 * compartilhado + os morphs são construídos aqui incrementalmente. Quando
 * tiver paridade, vira o default de `/` e os canvas por-zona saem.
 *
 * Passo 2: 9 seções roláveis alimentam o `progressRef` (0..1); o CameraRig
 * dentro do canvas interpola a câmera entre os capítulos conforme o scroll.
 */
const HomeCanvas = dynamic(
  () => import("@/components/home/canvas/HomeCanvas").then((m) => m.HomeCanvas),
  { ssr: false },
);

export default function HomeCanvasDevPage() {
  const progressRef = useRef(0);
  const [activeLabel, setActiveLabel] = useState(HOME_CHAPTERS[0].label);

  useEffect(() => {
    let raf = 0;
    const compute = () => {
      raf = 0;
      const max = document.body.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      progressRef.current = Math.max(0, Math.min(1, p));
      const idx = Math.round(progressRef.current * (HOME_CHAPTERS.length - 1));
      setActiveLabel(HOME_CHAPTERS[idx].label);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    compute();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <main className="relative bg-[#000F08]">
      <HomeCanvas progressRef={progressRef} />

      {/* HUD dev fixo */}
      <p
        className="pointer-events-none fixed left-6 top-6 z-10 text-[0.6rem] uppercase tracking-[0.3em] text-[#F5F2ED]/45"
        style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 500 }}
      >
        HomeCanvas · passo 2 — camera rig · {activeLabel}
      </p>

      {/* Espaçadores roláveis — um por capítulo (placeholder pro conteúdo HTML
          real, que entra quando as cenas forem migradas). */}
      {HOME_CHAPTERS.map((ch, i) => (
        <section
          key={ch.id}
          className="relative z-[1] flex h-screen items-center justify-center"
        >
          <span
            className="pointer-events-none text-[0.6rem] uppercase tracking-[0.4em] text-[#F5F2ED]/25"
            style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 500 }}
          >
            {String(i + 1).padStart(2, "0")} · {ch.label}
          </span>
        </section>
      ))}
    </main>
  );
}
