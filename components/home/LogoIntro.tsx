"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const TriangleLoader = dynamic(
  () => import("@/components/zones/TriangleLoader/TriangleLoader"),
  { ssr: false },
);

/**
 * Capítulo 1 — Logo (intro travada). A marca CbM se constrói (TriangleLoader)
 * e descansa com o selo "Coded by M". Enquanto constrói, o scroll da página
 * fica travado (HomeExperience). Ao terminar (`onComplete`), o scroll é
 * liberado e aparece o indicador "role para continuar".
 *
 * @param onComplete chamado quando a construção da marca termina.
 */
export function LogoIntro({ onComplete }: { onComplete?: () => void }) {
  const [built, setBuilt] = useState(false);

  const handleBuilt = () => {
    setBuilt(true);
    onComplete?.();
  };

  return (
    <div
      data-cursor="triangle"
      className="relative h-screen w-full overflow-hidden bg-[#000F08]"
    >
      <TriangleLoader onComplete={handleBuilt} />

      {/* Selo da marca */}
      <div
        className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-end pb-[18vh]"
        style={{ opacity: built ? 1 : 0, transition: "opacity 1s ease" }}
      >
        <p className="text-[0.65rem] font-light uppercase tracking-[0.5em] text-[#F5F2ED]/70">
          Coded by M
        </p>
      </div>

      {/* Indicador "role para continuar" — só após o build (scroll liberado). */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-2.5"
        style={{ opacity: built ? 1 : 0, transition: "opacity 0.8s ease 0.3s" }}
      >
        <span
          className="text-[0.55rem] uppercase tracking-[0.4em] text-[#F5F2ED]/45"
          style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 500 }}
        >
          Role para continuar
        </span>
        <svg
          width="10"
          height="12"
          viewBox="0 0 10 12"
          aria-hidden
          style={{ animation: "logo-scroll-bob 1.6s ease-in-out infinite" }}
        >
          <polygon points="1,3 9,3 5,11" fill="#FB3640" />
        </svg>
      </div>

      <style>{`@keyframes logo-scroll-bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(4px); } }`}</style>
    </div>
  );
}
