"use client";

import dynamic from "next/dynamic";
import type { DriftTile } from "@/components/site/DriftWall";

/**
 * Só no cliente e depois da hidratação: título e botão chegam no HTML e
 * continuam sendo o LCP. A parede é a segunda coisa a aparecer, e o espaço
 * dela já existe no layout, então nada pula quando ela chega.
 */
const DriftWall = dynamic(() => import("@/components/site/DriftWall").then((m) => m.DriftWall), {
  ssr: false,
});

/** `wide` precisa bater com `WALL_COLUMNS` de `HERO_WALL`. */
const COLUMNS = { wide: 5, compact: 4 };

/**
 * Parede de projetos, a mesma da seção Projetos da home, com todos os sites
 * publicados. É ambiente: os tiles não levam a lugar nenhum (a landing não
 * tem saída lateral), e o muro inteiro é `aria-hidden`. A prova de cliente
 * que se lê está nas pranchas logo abaixo.
 */
export function HeroWall({ tiles }: { tiles: DriftTile[] }) {
  return (
    <div className="cs-hero-wall" aria-hidden>
      <DriftWall tiles={tiles} columns={COLUMNS} linkTiles={false} speed={26} />
    </div>
  );
}
