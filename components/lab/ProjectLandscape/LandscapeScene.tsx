"use client";

import { type MutableRefObject } from "react";
import TerrainScene from "@/components/lab/TerrainMesh/TerrainScene";
import ProjectFragment from "./ProjectFragment";
import NetworkLine from "./NetworkLine";
import { useTunnelCamera } from "./useTunnelCamera";
import { FRAGMENT_SLOTS } from "./config";

/**
 * Cena 3D da Paisagem Digital — modo tunnel.
 *
 * Terreno + 6 fragmentos distribuídos em Z + linha de rede + câmera dirigida
 * pelo scroll (linearmente, sem keyframes em arco). Active deriva da posição
 * Z da câmera lá em cima (no orquestrador) — aqui só renderizamos.
 */
export default function LandscapeScene({
  progress,
  activeSlug,
  onHover,
  onClick,
}: {
  progress: MutableRefObject<number>;
  activeSlug: string | null;
  onHover: (slug: string | null) => void;
  onClick: (slug: string) => void;
}) {
  useTunnelCamera(progress);

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
