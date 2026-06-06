"use client";

import dynamic from "next/dynamic";

/**
 * Rota DEV do HomeCanvas (spec 2026-06-06-homecanvas-shared-design).
 *
 * Isolada de propósito: a Home real (`/`) fica intocada enquanto o canvas
 * compartilhado + os morphs são construídos aqui incrementalmente. Quando
 * tiver paridade, vira o default de `/` e os canvas por-zona saem.
 */
const HomeCanvas = dynamic(
  () => import("@/components/home/canvas/HomeCanvas").then((m) => m.HomeCanvas),
  { ssr: false },
);

export default function HomeCanvasDevPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#000F08]">
      <HomeCanvas />
      <p
        className="pointer-events-none fixed left-6 top-6 z-10 text-[0.6rem] uppercase tracking-[0.3em] text-[#F5F2ED]/45"
        style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 500 }}
      >
        HomeCanvas · scaffold (dev)
      </p>
    </main>
  );
}
