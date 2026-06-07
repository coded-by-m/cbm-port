"use client";

import { type MutableRefObject } from "react";
import { useThree } from "@react-three/fiber";
import TerrainScene from "@/components/zones/TerrainMesh/TerrainScene";
import ProjectFragment from "./ProjectFragment";
import { useOrbitCameraConditional } from "./useOrbitCamera";
import { cases } from "@/data/cases";
import { FRAGMENT_SLOTS, MOBILE_MAX_WIDTH, ORBIT_MOBILE } from "./config";

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

  // Constelação compacta no retrato: aperta o anel escalando x/z. O ângulo
  // (atan2(x,z)) é invariante a essa escala → active/snap/dots intactos. Só a
  // posição/raio muda; o tamanho do fragmento (slot.scale) fica igual.
  const width = useThree((state) => state.size.width);
  const ringScale = width <= MOBILE_MAX_WIDTH ? ORBIT_MOBILE.ringScale : 1;

  return (
    <>
      {/* Câmera cinematográfica do terreno DESLIGADA: a Paisagem é orbital e já
          controla a câmera. Dois controladores brigariam e o orbital perderia. */}
      <TerrainScene cinematic={false} />
      {FRAGMENT_SLOTS.map((slot, i) => {
        const caseProject = cases.find((c) => c.slug === slot.slug);
        const isComingSoon = caseProject?.status === "coming-soon";
        const placedSlot =
          ringScale === 1
            ? slot
            : { ...slot, x: slot.x * ringScale, z: slot.z * ringScale };
        return (
          <ProjectFragment
            key={slot.slug}
            slot={placedSlot}
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
