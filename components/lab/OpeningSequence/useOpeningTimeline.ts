"use client";

import { useEffect, type MutableRefObject, type RefObject } from "react";
import gsap from "gsap";
import { TIMING } from "./config";

type Layers = {
  logo: RefObject<HTMLDivElement>;
  philosophy: RefObject<HTMLDivElement>;
};

/**
 * Timeline autoplay da Parte 1.
 *
 * Monta apenas quando `enabled` vira `true` (após o build do logo terminar).
 * A timeline orquestra:
 *  - HOLD: pausa cinematográfica enquanto o logo respira (`useOrganicMotion`).
 *  - EXIT: anima `exitProgress` de 0→1; ExitParticles lê este ref, o logo faz
 *    fade-out e a Philosophy faz fade-in com overlap.
 *
 * Clique ou tecla durante a janela ativa multiplica a velocidade
 * (`ACCELERATE_FACTOR`). `prefers-reduced-motion: reduce` aplica o mesmo
 * multiplicador por default.
 */
export function useOpeningTimeline(
  layers: Layers,
  exitProgress: MutableRefObject<number>,
  enabled: boolean,
  onPhilosophyVisible: () => void,
) {
  useEffect(() => {
    if (!enabled) return;

    const logoEl = layers.logo.current;
    const philosophyEl = layers.philosophy.current;
    if (!logoEl || !philosophyEl) return;

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    // Mount PhilosophySection imediatamente — o TerrainBackground tem
    // um Canvas WebGL pesado (3 camadas de mesh triangulada + fBm noise)
    // que leva 100–300ms pra inicializar. Se isso acontecesse mid-EXIT,
    // o browser bloquearia o RAF e o recoil daria solavanco. O HOLD de
    // 1.2s dá tempo pro mount acontecer fora da janela animada.
    // A opacidade do `philosophyEl` continua 0 até o fade-in começar.
    onPhilosophyVisible();

    const exitState = { progress: 0 };

    const timeline = gsap.timeline();

    // HOLD: nada anima, só o tempo passa.
    timeline.to({}, { duration: TIMING.HOLD_DURATION });

    // EXIT: progress, logo e philosophy em paralelo dentro da mesma janela.
    // Usa um label fixo — passar ">" em cada `to` faria os tweens correrem
    // em sequência, porque ">" é resolvido no instante da inserção e cada
    // chamada move o fim do timeline pra frente.
    timeline.addLabel("exit");

    timeline.to(
      exitState,
      {
        progress: 1,
        duration: TIMING.EXIT_DURATION,
        ease: "power2.inOut",
        onUpdate: () => {
          exitProgress.current = exitState.progress;
        },
      },
      "exit",
    );

    timeline.to(
      logoEl,
      {
        opacity: 0,
        duration: TIMING.EXIT_DURATION * TIMING.LOGO_FADE_END,
        ease: "power2.in",
      },
      "exit",
    );

    timeline.fromTo(
      philosophyEl,
      { opacity: 0 },
      {
        opacity: 1,
        duration: TIMING.EXIT_DURATION * (1 - TIMING.PHILOSOPHY_FADE_START),
        ease: "power2.inOut",
      },
      `exit+=${TIMING.EXIT_DURATION * TIMING.PHILOSOPHY_FADE_START}`,
    );

    if (reducedMotion) {
      timeline.timeScale(TIMING.REDUCED_MOTION_FACTOR);
    }

    // Aceleração: clique ou tecla não-modificadora durante a janela ativa.
    let accelerated = false;
    const accelerate = () => {
      if (accelerated) return;
      accelerated = true;
      timeline.timeScale(
        timeline.timeScale() * TIMING.ACCELERATE_FACTOR,
      );
    };

    const onPointer = () => accelerate();
    const onKey = (e: KeyboardEvent) => {
      // Ignora teclas modificadoras sozinhas — só interação intencional.
      if (
        e.key === "Tab" ||
        e.key === "Shift" ||
        e.key === "Control" ||
        e.key === "Alt" ||
        e.key === "Meta"
      ) {
        return;
      }
      accelerate();
    };

    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);

    return () => {
      timeline.kill();
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
      exitProgress.current = 0;
    };
  }, [layers, exitProgress, enabled, onPhilosophyVisible]);
}
