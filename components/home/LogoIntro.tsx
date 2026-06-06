"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const TriangleLoader = dynamic(
  () => import("@/components/lab/TriangleLoader/TriangleLoader"),
  { ssr: false },
);

/**
 * Capítulo 1 — Logo. A marca CbM se constrói (TriangleLoader) e descansa com
 * o selo "Coded by M". É o herói: o usuário chega, vê a marca emergir, e rola
 * pro manifesto (a transição é o dip de capítulo).
 *
 * Separado do OpeningSequence de propósito: o /lab mantém o cinematográfico
 * combinado (logo→manifesto→flip) intacto; a Home usa Logo e Manifesto como
 * dois capítulos próprios.
 */
export function LogoIntro() {
  const [built, setBuilt] = useState(false);

  return (
    <div
      data-cursor="triangle"
      className="relative h-screen w-full overflow-hidden bg-[#000F08]"
    >
      <TriangleLoader onComplete={() => setBuilt(true)} />

      <div
        className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-end pb-[16vh]"
        style={{ opacity: built ? 1 : 0, transition: "opacity 1.2s ease" }}
      >
        <p className="text-[0.65rem] font-light uppercase tracking-[0.5em] text-[#F5F2ED]/70">
          Coded by M
        </p>
      </div>
    </div>
  );
}
