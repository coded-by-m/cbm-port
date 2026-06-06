"use client";

import dynamic from "next/dynamic";

const PhilosophySection = dynamic(
  () =>
    import("@/components/zones/PhilosophySection").then(
      (m) => m.PhilosophySection,
    ),
  { ssr: false },
);

/**
 * Capítulo 2 — Manifesto. As 3 frases-manifesto (PhilosophySection) num
 * capítulo próprio. Avança por scroll/clique; ao concluir (CTA ou última
 * frase), libera o scroll pra próxima seção (Problema).
 *
 * PhilosophySection sequestra o wheel pra avançar as frases — daí a conclusão
 * precisar rolar a página programaticamente pra soltar o usuário.
 */
export function ManifestoIntro({
  onBack,
  onForward,
  live,
}: {
  onBack?: () => void;
  onForward?: () => void;
  live?: boolean;
}) {
  return (
    <div
      data-cursor="triangle"
      className="relative h-screen w-full overflow-hidden bg-[#000F08]"
    >
      <PhilosophySection onComplete={onForward} onBack={onBack} live={live} />
    </div>
  );
}
