"use client";

import TerrainScene from "@/components/lab/TerrainMesh/TerrainScene";
import ProjectFragment from "./ProjectFragment";
import NetworkLine from "./NetworkLine";
import { FRAGMENT_SLOTS } from "./config";

/**
 * Cena 3D da Paisagem Digital de Projetos — vista fixa.
 *
 * Terreno + 3 fragmentos + linha de rede. Câmera não se move (controlada pelo
 * Canvas no orquestrador). Slideshow muda apenas o `activeSlug`; ativos
 * avançam em z + cor; inativos recuam pra cor do terreno.
 */
export default function LandscapeScene({
  activeSlug,
  onHover,
  onClick,
  onScreenPosition,
}: {
  activeSlug: string | null;
  onHover: (slug: string | null) => void;
  onClick: (slug: string) => void;
  onScreenPosition: (
    slug: string,
    pos: { x: number; y: number; visible: boolean } | null,
  ) => void;
}) {
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
