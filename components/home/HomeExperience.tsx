"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { LazySection } from "./LazySection";
import { ChapterRail } from "./ChapterRail";
import { InteractionCue } from "./InteractionCue";
import { ChapterTransition } from "./ChapterTransition";
import { LogoIntro } from "./LogoIntro";
import { ManifestoIntro } from "./ManifestoIntro";
import { useActiveChapter } from "@/hooks/useActiveChapter";

/**
 * Zonas usam WebGL → só montam no cliente (`ssr: false`), igual ao /lab.
 * As scroll-driven (Problema, Processo, CTA) recebem `inPage` pra ler o
 * scroll da página em vez de um scroller interno.
 */
const ProblemSection = dynamic(
  () => import("@/components/zones/ProblemSection").then((m) => m.ProblemSection),
  { ssr: false },
);
const ServicesSection = dynamic(
  () =>
    import("@/components/zones/ServicesSection").then((m) => m.ServicesSection),
  { ssr: false },
);
const ProjectLandscape = dynamic(
  () =>
    import("@/components/zones/ProjectLandscape").then((m) => m.ProjectLandscape),
  { ssr: false },
);
const LabSection = dynamic(
  () => import("@/components/zones/LabSection").then((m) => m.LabSection),
  { ssr: false },
);
const ProcessSection = dynamic(
  () => import("@/components/zones/ProcessSection").then((m) => m.ProcessSection),
  { ssr: false },
);
const AboutSection = dynamic(
  () => import("@/components/zones/AboutSection").then((m) => m.AboutSection),
  { ssr: false },
);
const CTASection = dynamic(
  () => import("@/components/zones/CTASection").then((m) => m.CTASection),
  { ssr: false },
);

/**
 * Encaixa uma zona de viewport único (não scroll-driven, originalmente
 * `absolute inset-0`) no fluxo da página: bloco de contenção `relative` de
 * 100vh. O `transform-gpu` cria um containing block pros descendentes
 * `position: fixed` (ex.: terrain de fundo do AboutSection) ficarem presos à
 * seção em vez de vazarem pra viewport inteira.
 */
function ViewportZone({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-screen overflow-hidden transform-gpu">
      {children}
    </div>
  );
}

/**
 * A Home real — composição das zonas na ordem da jornada (fundação).
 *
 * Empilhamento vertical com scroll nativo da página. Cada zona é montada por
 * proximidade de viewport (`LazySection`) pra não manter vários contextos
 * WebGL vivos ao mesmo tempo. A `ChapterTransition` faz o dip na cor da marca
 * entre as cenas (esconde a emenda).
 *
 * Ordem (9 capítulos): Logo → Manifesto → Problema → Serviços → Projetos →
 * Processo → Laboratório → Sobre → Convite. As `minHeight` casam com a altura
 * real de cada zona pra não haver pulo de layout ao montar/desmontar.
 */
export function HomeExperience() {
  const activeChapter = useActiveChapter();
  // Intro travada: o scroll fica bloqueado até a marca terminar de construir.
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    if (introDone) return;
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    // Bloqueia o input de scroll do usuário (overflow:hidden sozinho não basta
    // dependendo do scroller raiz). Teclas de rolagem também.
    const block = (e: Event) => e.preventDefault();
    const blockKeys = (e: KeyboardEvent) => {
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(e.key))
        e.preventDefault();
    };
    const opts: AddEventListenerOptions = { passive: false };
    window.addEventListener("wheel", block, opts);
    window.addEventListener("touchmove", block, opts);
    window.addEventListener("keydown", blockKeys);

    // Fallback: destrava após 8s mesmo se o onComplete não disparar.
    const fail = setTimeout(() => setIntroDone(true), 8000);

    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
      window.removeEventListener("wheel", block, opts);
      window.removeEventListener("touchmove", block, opts);
      window.removeEventListener("keydown", blockKeys);
      clearTimeout(fail);
    };
  }, [introDone]);

  // Navega pro capítulo i (clique na trilha).
  const jumpTo = (i: number) => {
    document
      .querySelector(`[data-chapter-index="${i}"]`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="bg-[#000F08]">
      {/* Transição conectiva: dip na cor da marca esconde a emenda entre cenas. */}
      <ChapterTransition />

      {/* Affordances só aparecem DEPOIS da intro (reveal limpo). */}
      {introDone && (
        <>
          <ChapterRail active={activeChapter} onJump={jumpTo} />
          <InteractionCue active={activeChapter} />
        </>
      )}

      {/* 0 — Logo. A marca se constrói (intro travada). Ao terminar, destrava
          o scroll e revela o indicador "role para continuar". */}
      <LazySection minHeight="100vh" eager chapterIndex={0}>
        <LogoIntro onComplete={() => setIntroDone(true)} />
      </LazySection>

      {/* 1 — Manifesto. As 3 frases-manifesto, capítulo próprio. */}
      <LazySection minHeight="100vh" chapterIndex={1}>
        <ManifestoIntro />
      </LazySection>

      {/* 2 — Problema. Scroll-driven, 520vh. (Serviços desacoplado.) */}
      <LazySection minHeight="520vh" chapterIndex={2}>
        <ProblemSection inPage />
      </LazySection>

      {/* 3 — Serviços (desacoplado, standalone). 3 cards expansíveis. */}
      <LazySection minHeight="100vh" chapterIndex={3}>
        <ServicesSection inPage />
      </LazySection>

      {/* 4 — Projetos (orbital). Dona única da vitrine.
          `active` só quando é o capítulo na tela → congela o orbital fora dela. */}
      <LazySection minHeight="100vh" chapterIndex={4}>
        <ViewportZone>
          <ProjectLandscape active={activeChapter === 4} />
        </ViewportZone>
      </LazySection>

      {/* 5 — Processo (jornada 3D). Scroll-driven, 560vh. */}
      <LazySection minHeight="560vh" chapterIndex={5}>
        <ProcessSection inPage />
      </LazySection>

      {/* 6 — Laboratório (teaser /lab). */}
      <LazySection minHeight="100vh" chapterIndex={6}>
        <ViewportZone>
          <LabSection />
        </ViewportZone>
      </LazySection>

      {/* 7 — Sobre. `inPage`: relative min-h-screen (sem scroller interno). */}
      <LazySection minHeight="100vh" chapterIndex={7}>
        <AboutSection inPage />
      </LazySection>

      {/* 8 — Convite / CTA Final (+ Footer). Scroll-driven, 240vh + footer. */}
      <LazySection minHeight="240vh" chapterIndex={8}>
        <CTASection inPage />
      </LazySection>
    </main>
  );
}
