"use client";

import { type MutableRefObject } from "react";
import TerrainScene from "@/components/zones/TerrainMesh/TerrainScene";
import ProjectFragment from "./ProjectFragment";
import { useOrbitCameraConditional } from "./useOrbitCamera";
import { cases } from "@/data/cases";
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
  revealPlay = true,
}: {
  angleRef: MutableRefObject<number>;
  activeSlug: string | null;
  onHover: (slug: string | null) => void;
  onClick: (slug: string) => void;
  devCamera: boolean;
  /** Capítulo ativo → dispara a montagem escalonada dos fragmentos. */
  revealPlay?: boolean;
}) {
  // Em dev mode, OrbitControls assume a câmera — não executa o hook orbital.
  useOrbitCameraConditional(angleRef, !devCamera);

  const anyActive = activeSlug !== null;

  return (
    <>
      <TerrainScene />
      {FRAGMENT_SLOTS.map((slot, i) => {
        const caseProject = cases.find((c) => c.slug === slot.slug);
        const isComingSoon = caseProject?.status === "coming-soon";
        return (
          <ProjectFragment
            key={slot.slug}
            slot={slot}
            index={i}
            isActive={activeSlug === slot.slug}
            anyActive={anyActive}
            isComingSoon={isComingSoon}
            revealPlay={revealPlay}
            onHover={onHover}
            onClick={onClick}
          />
        );
      })}
    </>
  );
}
