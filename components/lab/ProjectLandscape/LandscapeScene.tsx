"use client";

import { type MutableRefObject } from "react";
import TerrainScene from "@/components/lab/TerrainMesh/TerrainScene";
import ProjectFragment from "./ProjectFragment";
import NetworkLine from "./NetworkLine";
import { useProjectScrollCamera } from "./useProjectScrollCamera";
import { FRAGMENT_SLOTS } from "./config";

/**
 * Cena 3D da Paisagem Digital de Projetos.
 *
 * Renderiza o terreno único + N fragmentos (um por case) + linha de rede
 * conectando os apexes + câmera dirigida pelo scroll. Eventos de hover/click
 * dos fragmentos sobem pro orquestrador via props.
 */
export default function LandscapeScene({
  progress,
  activeSlug,
  onHover,
  onClick,
  onScreenPosition,
}: {
  progress: MutableRefObject<number>;
  activeSlug: string | null;
  onHover: (slug: string | null) => void;
  onClick: (slug: string) => void;
  onScreenPosition: (
    slug: string,
    pos: { x: number; y: number; visible: boolean } | null,
  ) => void;
}) {
  useProjectScrollCamera(progress);

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
          onScreenPosition={onScreenPosition}
        />
      ))}
      <NetworkLine slots={FRAGMENT_SLOTS} activeSlug={activeSlug} />
    </>
  );
}
