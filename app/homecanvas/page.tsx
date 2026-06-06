"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { ChapterRail } from "@/components/home/ChapterRail";
import { InteractionCue } from "@/components/home/InteractionCue";
import { ChapterSection } from "@/components/home/ChapterSection";
import { HOME_CONTENT } from "@/lib/homeContent";
import { useActiveChapter } from "@/hooks/useActiveChapter";

/**
 * Rota DEV do HomeCanvas (spec 2026-06-06-homecanvas-shared-design).
 *
 * Candidata à Home final: o `HomeCanvas` (1 contexto WebGL — terreno + pool de
 * fragmentos morphando + câmera scroll-driven) como fundo 3D unificado, com o
 * conteúdo HTML de cada capítulo por cima + as affordances (trilha + cue).
 * SEM o dip de transição: aqui os morphs do pool SÃO a transição.
 *
 * Isolada de `/` até atingir paridade; então vira o default e os canvas
 * por-zona saem.
 */
const HomeCanvas = dynamic(
  () => import("@/components/home/canvas/HomeCanvas").then((m) => m.HomeCanvas),
  { ssr: false },
);

export default function HomeCanvasDevPage() {
  const progressRef = useRef(0);
  const activeChapter = useActiveChapter();

  useEffect(() => {
    let raf = 0;
    const compute = () => {
      raf = 0;
      const max = document.body.scrollHeight - window.innerHeight;
      progressRef.current =
        max > 0 ? Math.max(0, Math.min(1, window.scrollY / max)) : 0;
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

  const jumpTo = (i: number) =>
    document
      .querySelector(`[data-chapter-index="${i}"]`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <main className="relative bg-[#000F08]">
      <HomeCanvas progressRef={progressRef} />
      <ChapterRail active={activeChapter} onJump={jumpTo} />
      <InteractionCue active={activeChapter} onSkipIntro={() => jumpTo(2)} />

      {HOME_CONTENT.map((content, i) => (
        <ChapterSection key={i} content={content} index={i} />
      ))}

      <p
        className="pointer-events-none fixed bottom-6 left-6 z-[60] text-[0.55rem] uppercase tracking-[0.3em] text-[#F5F2ED]/25"
        style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 500 }}
      >
        HomeCanvas · dev
      </p>
    </main>
  );
}
