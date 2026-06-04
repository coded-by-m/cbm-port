"use client";

import { type MutableRefObject } from "react";
import TerrainScene from "@/components/lab/TerrainMesh/TerrainScene";
import ProjectFragment from "./ProjectFragment";
import NetworkLine from "./NetworkLine";
import { useOrbitCameraConditional } from "./useOrbitCamera";
import { FRAGMENT_SLOTS } from "./config";

/**
 * Cena 3D da Paisagem Digital — modo orbital.
 *
 * Terreno + 6 fragmentos em círculo + linha de rede + câmera orbital
 * dirigida pelo `angleRef` do orquestrador. Active deriva do ângulo da
 * câmera lá em cima (rAF poll) — aqui só renderizamos.
 */
export default function LandscapeScene({
  angleRef,
  activeSlug,
  onHover,
  onClick,
  devCamera,
}: {
  angleRef: MutableRefObject<number>;
  activeSlug: string | null;
  onHover: (slug: string | null) => void;
  onClick: (slug: string) => void;
  devCamera: boolean;
}) {
  // Em dev mode, OrbitControls assume a câmera — não executa o hook orbital.
  useOrbitCameraConditional(angleRef, !devCamera);

  const anyActive = activeSlug !== null;

  return (
    <>
      <TerrainScene />
      {FRAGMENT_SLOTS.map((slot) => (
        <ProjectFragment
          key={slot.slug}
          slot={slot}
          isActive={activeSlug === slot.slug}
          anyActive={anyActive}
          onHover={onHover}
          onClick={onClick}
        />
      ))}
      <NetworkLine slots={FRAGMENT_SLOTS} activeSlug={activeSlug} />
    </>
  );
}
