"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface LazySectionProps {
  children: ReactNode;
  /**
   * Altura reservada enquanto a seção está desmontada. Deve casar com a
   * altura real da zona (ex.: "520vh" pras scroll-driven, "100vh" pras de
   * viewport único) pra não haver pulo de layout / salto do scrollbar ao
   * montar/desmontar.
   */
  minHeight?: string;
  /**
   * Margem do IntersectionObserver — histerese de mount/unmount. O default
   * monta quando a seção está a ~1 viewport de entrar e só desmonta quando
   * está a >1 viewport de distância, evitando thrash em scroll de borda.
   */
  rootMargin?: string;
  /**
   * Monta já no primeiro paint (sem esperar o observer). Use na primeira
   * seção (above the fold) pra evitar um frame de placeholder no load.
   */
  eager?: boolean;
  /**
   * Índice do capítulo. Exposto como `data-chapter-index` no wrapper (sempre
   * presente no DOM, mesmo desmontado) pra `useActiveChapter` rastrear a
   * posição da jornada.
   */
  chapterIndex?: number;
}

/**
 * Controla o ciclo de vida do conteúdo 3D pesado de uma zona por viewport.
 *
 * Numa Home com várias zonas 3D empilhadas, manter todos os `<Canvas>` vivos
 * = vários contextos WebGL simultâneos (caro, e o browser limita ~16).
 * `<LazySection>` monta os `children` só quando a zona está perto do viewport
 * e desmonta ao sair, reservando a altura pra estabilidade do layout.
 *
 * Responsabilidade única: ligar/desligar `children` por proximidade de
 * viewport. Não conhece as zonas — só o DOM (IntersectionObserver).
 *
 * Trade-off: a cena remonta (re-init do canvas) ao revisitar. Aceitável na
 * fundação; um HomeCanvas compartilhado resolveria isso depois.
 */
export function LazySection({
  children,
  minHeight = "100vh",
  rootMargin = "50% 0px 50% 0px",
  eager = false,
  chapterIndex,
}: LazySectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(eager);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setActive(entry.isIntersecting);
      },
      { rootMargin },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin]);

  // Ativa → children ditam a altura. Inativa → reserva minHeight.
  return (
    <div
      ref={ref}
      data-chapter-index={chapterIndex}
      style={active ? undefined : { minHeight }}
    >
      {active ? children : null}
    </div>
  );
}
