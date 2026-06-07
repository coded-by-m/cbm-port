"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import gsap from "gsap";
import { LazySection } from "./LazySection";
import { ChapterRail } from "./ChapterRail";
import { ChapterDots } from "./ChapterDots";
import { InteractionCue } from "./InteractionCue";
import { ChapterTransition } from "./ChapterTransition";
import { LogoIntro } from "./LogoIntro";
import { ManifestoIntro } from "./ManifestoIntro";
import { useActiveChapter } from "@/hooks/useActiveChapter";
import { HOME_CHAPTERS } from "@/lib/homeChapters";

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

  // Transição guiada Logo ↔ Manifesto: WIPE DIRECIONAL. Um painel na cor da
  // marca varre a tela na direção do scroll (desce → varre pra cima; sobe →
  // varre pra baixo), o conteúdo troca no meio (coberto) e o painel varre pra
  // fora revelando o destino. Premium e bidirecional — nada de "piscar".
  const wipeRef = useRef<HTMLDivElement>(null);
  const transitioningRef = useRef(false);
  const guidedScroll = useCallback(
    (targetChapter: number, dir: "down" | "up") => {
      const panel = wipeRef.current;
      if (transitioningRef.current || !panel) return;
      transitioningRef.current = true;
      const startY = dir === "down" ? 100 : -100;
      const endY = dir === "down" ? -100 : 100;
      gsap.killTweensOf(panel);
      gsap.set(panel, { yPercent: startY, visibility: "visible" });
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(panel, { visibility: "hidden" });
          transitioningRef.current = false;
        },
      });
      // Cobre (acelera pra dentro).
      tl.to(panel, { yPercent: 0, duration: 0.42, ease: "power3.in" });
      // Troca o conteúdo por baixo da cobertura + RE-CORRIGE a posição
      // enquanto coberto: as LazySections montam conteúdo (e mudam alturas)
      // ao chegar perto, então um `scrollIntoView` só erra ±1 em saltos longos.
      // Re-assertamos por ~160ms (coberto) até a altura assentar.
      const reassert = () => {
        document
          .querySelector(`[data-chapter-index="${targetChapter}"]`)
          ?.scrollIntoView({ block: "start" });
      };
      tl.add(reassert);
      tl.to({}, { duration: 0.16, onUpdate: reassert });
      // Revela (desacelera pra fora).
      tl.to(panel, { yPercent: endY, duration: 0.5, ease: "power3.out" });
    },
    [],
  );

  // Retorno na sessão (voltar de /cases ou /lab): pula a intro travada e, se
  // houver alvo no hash (#projetos), posiciona direto na Paisagem — nunca
  // re-prende o usuário nos 12s da intro.
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("cbm-intro-seen") === "1";
    } catch {}
    const target = window.location.hash === "#projetos" ? 4 : null;
    if (seen || target !== null) setIntroDone(true);
    if (target !== null) {
      const t = setTimeout(() => {
        document
          .querySelector('[data-chapter-index="4"]')
          ?.scrollIntoView({ block: "start" });
        history.replaceState(null, "", window.location.pathname);
      }, 100);
      return () => clearTimeout(t);
    }
  }, []);

  // Marca a intro como vista nesta sessão.
  useEffect(() => {
    if (!introDone) return;
    try {
      sessionStorage.setItem("cbm-intro-seen", "1");
    } catch {}
  }, [introDone]);

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
    // capture: true → bloqueia na fase de captura, antes de qualquer handler
    // interno (canvas/snap) — não tem como furar o bloqueio.
    const opts: AddEventListenerOptions = { passive: false, capture: true };
    window.addEventListener("wheel", block, opts);
    window.addEventListener("touchmove", block, opts);
    window.addEventListener("keydown", blockKeys, true);

    // Fallback: destrava após 12s mesmo se o onComplete não disparar.
    const fail = setTimeout(() => setIntroDone(true), 12000);

    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
      window.removeEventListener("wheel", block, opts);
      window.removeEventListener("touchmove", block, opts);
      window.removeEventListener("keydown", blockKeys, true);
      clearTimeout(fail);
    };
  }, [introDone]);

  // Snap Logo → Manifesto: estando no Logo, qualquer scroll pra baixo leva
  // suave e EXATO até o Manifesto (cap. 1), sem parar no meio do caminho.
  // Só atua enquanto o usuário está no topo (Logo); depois disso, scroll livre.
  useEffect(() => {
    if (!introDone) return;
    const atLogo = () => window.scrollY < window.innerHeight * 0.5;
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 0 && atLogo()) {
        e.preventDefault();
        guidedScroll(1, "down");
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " "].includes(e.key) && atLogo()) {
        e.preventDefault();
        guidedScroll(1, "down");
      }
    };
    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (touchY - e.touches[0].clientY > 8 && atLogo()) {
        e.preventDefault();
        guidedScroll(1, "down");
      }
    };
    const opts: AddEventListenerOptions = { passive: false };
    window.addEventListener("wheel", onWheel, opts);
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, opts);
    return () => {
      window.removeEventListener("wheel", onWheel, opts);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove, opts);
    };
  }, [introDone, guidedScroll]);

  // Projetos (4), Processo (5) e Laboratório (6) são 100vh wheel-jacked. Ao
  // virar o capítulo ativo vindo por scroll livre (ex.: subindo do Sobre),
  // snapam pra preencher a viewport — entrar neles nunca deixa no meio.
  useEffect(() => {
    if (activeChapter !== 4 && activeChapter !== 5 && activeChapter !== 6)
      return;
    const el = document.querySelector(
      `[data-chapter-index="${activeChapter}"]`,
    );
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (Math.abs(rect.top) > 8) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeChapter]);

  // Navega pro capítulo i com o WIPE da marca (não scroll seco) — clique na
  // trilha e teclado usam isto. Direção pela posição relativa.
  const jumpTo = useCallback(
    (i: number) => {
      const target = Math.max(0, Math.min(HOME_CHAPTERS.length - 1, i));
      if (target === activeChapter) return;
      guidedScroll(target, target > activeChapter ? "down" : "up");
    },
    [activeChapter, guidedScroll],
  );

  // Teclado: ↑/↓ (ou J/K) anterior/próximo · 1–9 pula direto. Power-user +
  // acessibilidade. Só depois da intro, ignora inputs de texto.
  useEffect(() => {
    if (!introDone) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      const k = e.key;
      if (k === "ArrowDown" || k === "ArrowRight" || k === "j" || k === "J") {
        e.preventDefault();
        jumpTo(activeChapter + 1);
      } else if (k === "ArrowUp" || k === "ArrowLeft" || k === "k" || k === "K") {
        e.preventDefault();
        jumpTo(activeChapter - 1);
      } else if (/^[1-9]$/.test(k)) {
        e.preventDefault();
        jumpTo(Number(k) - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [introDone, activeChapter, jumpTo]);

  return (
    <main className="bg-[#000F08]">
      {/* Transição conectiva: dip na cor da marca esconde a emenda entre cenas. */}
      <ChapterTransition />

      {/* Painel do wipe direcional Logo ↔ Manifesto (varrido por GSAP). */}
      <div
        ref={wipeRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[50] bg-[#000F08]"
        style={{ visibility: "hidden" }}
      />

      {/* Affordances só aparecem DEPOIS da intro (reveal limpo). */}
      {introDone && (
        <>
          <ChapterRail active={activeChapter} onJump={jumpTo} />
          <ChapterDots active={activeChapter} onJump={jumpTo} />
          <InteractionCue active={activeChapter} />
        </>
      )}

      {/* 0 — Logo. A marca se constrói (intro travada). Ao terminar, destrava
          o scroll e revela o indicador "role para continuar". */}
      <LazySection minHeight="100vh" eager chapterIndex={0}>
        <LogoIntro onComplete={() => setIntroDone(true)} />
      </LazySection>

      {/* 1 — Manifesto. As 3 frases-manifesto, capítulo próprio. `onBack`:
          na 1ª frase, scroll↑ volta pro Logo com a mesma transição. */}
      <LazySection minHeight="100vh" chapterIndex={1}>
        <ManifestoIntro
          live={activeChapter === 1}
          onBack={() => guidedScroll(0, "up")}
          onForward={() => guidedScroll(2, "down")}
        />
      </LazySection>

      {/* 2 — Problema. Beat-stepper (100vh): 4 beats, anti-skip, torre
          constrói por beat. Entra/sai pelo wipe. (Serviços desacoplado.) */}
      <LazySection minHeight="100vh" chapterIndex={2}>
        <ProblemSection
          inPage
          live={activeChapter === 2}
          onBack={() => guidedScroll(1, "up")}
          onForward={() => guidedScroll(3, "down")}
        />
      </LazySection>

      {/* 3 — Serviços. Scroll livre nos cards; wipe nas bordas (fim → Projetos,
          topo → Problema) pra não travar no meio. Entrada sincronizada. */}
      <LazySection minHeight="100vh" chapterIndex={3}>
        <ServicesSection
          inPage
          live={activeChapter === 3}
          onForward={() => guidedScroll(4, "down")}
          onBack={() => guidedScroll(2, "up")}
        />
      </LazySection>

      {/* 4 — Projetos (orbital). Dona única da vitrine. `active` só no capítulo
          ativo (congela fora). Wheel navega por wipe (↑ Serviços, ↓ Processo);
          drag/setas giram a vitrine. */}
      <LazySection minHeight="100vh" chapterIndex={4}>
        <ViewportZone>
          <ProjectLandscape
            active={activeChapter === 4}
            onForward={() => guidedScroll(5, "down")}
            onBack={() => guidedScroll(3, "up")}
          />
        </ViewportZone>
      </LazySection>

      {/* 5 — Processo (jornada 3D). Beat-stepper (100vh): 4 etapas, anti-skip,
          câmera pana por estação. Entra/sai pelo wipe. */}
      <LazySection minHeight="100vh" chapterIndex={5}>
        <ProcessSection
          inPage
          live={activeChapter === 5}
          onBack={() => guidedScroll(4, "up")}
          onForward={() => guidedScroll(6, "down")}
        />
      </LazySection>

      {/* 6 — Laboratório (teaser /lab). Tela única wipe-connected (wheel ↑↓). */}
      <LazySection minHeight="100vh" chapterIndex={6}>
        <ViewportZone>
          <LabSection
            live={activeChapter === 6}
            onBack={() => guidedScroll(5, "up")}
            onForward={() => guidedScroll(7, "down")}
          />
        </ViewportZone>
      </LazySection>

      {/* 7 — Sobre. `relative min-h-screen`; scroll livre com wipe nas bordas
          (topo → Laboratório, fim → Convite). */}
      <LazySection minHeight="100vh" chapterIndex={7}>
        <AboutSection
          inPage
          live={activeChapter === 7}
          onBack={() => guidedScroll(6, "up")}
          onForward={() => guidedScroll(8, "down")}
        />
      </LazySection>

      {/* 8 — Convite / CTA Final (+ Footer). Scroll-driven, 200vh + footer.
          Finale: entra por wipe; subir do topo volta pro Sobre. */}
      <LazySection minHeight="200vh" chapterIndex={8}>
        <CTASection
          inPage
          live={activeChapter === 8}
          onBack={() => guidedScroll(7, "up")}
        />
      </LazySection>
    </main>
  );
}
