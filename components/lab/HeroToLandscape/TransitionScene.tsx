"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import TerrainLayer from "@/components/lab/TerrainMesh/TerrainLayer";
import { useResponsiveFit } from "@/components/lab/TerrainMesh/useResponsiveFit";
import { FIT_RADIUS, LAYERS } from "@/components/lab/TerrainMesh/config";
import { HOST_LAYER } from "@/components/lab/ProjectFragments/config";
import type { OverlayStore } from "@/components/lab/HtmlOverlay/useOverlayStore";
import ScrollFragment from "@/components/lab/ScrollCamera/ScrollFragment";
import { useScrollNarrative } from "@/components/lab/ScrollCamera/useScrollNarrative";
import HeroFragment from "@/components/lab/SpatialComposition/HeroFragment";
import { LANDSCAPE_CARDS } from "@/components/lab/DigitalLandscape/config";
import { useTransitionCamera } from "./useTransitionCamera";
import { useHeroTransition, type HeroTransitionState } from "./useHeroTransition";
import { TRANSITION } from "./config";

export default function TransitionScene({
  store,
  progress,
  setActive,
  onHeroState,
}: {
  store: OverlayStore;
  progress: MutableRefObject<number>;
  setActive: (id: string | null) => void;
  onHeroState: MutableRefObject<HeroTransitionState | null>;
}) {
  const fitRef = useRef<Group>(null);
  const fragmentProgress = useRef(0);
  useFrame(() => {
    const p = progress.current;
    fragmentProgress.current =
      p <= TRANSITION.heroFadeEnd
        ? 0
        : (p - TRANSITION.heroFadeEnd) / (1 - TRANSITION.heroFadeEnd);
  });

  useResponsiveFit(fitRef, FIT_RADIUS);
  useTransitionCamera(progress);

  const heroState = useHeroTransition(progress);
  onHeroState.current = heroState.current;

  useScrollNarrative(fragmentProgress, setActive);

  return (
    <group ref={fitRef}>
      {LAYERS.map((layer) => (
        <TerrainLayer key={layer.name} layer={layer} />
      ))}

      {heroState.current.heroVisible && (
        <group position={[0, 0, heroState.current.heroZ - (-3.2)]}>
          <HeroFragment />
        </group>
      )}

      <group position={[HOST_LAYER.xOffset, HOST_LAYER.yOffset, HOST_LAYER.zOffset]}>
        {LANDSCAPE_CARDS.map((card, index) => (
          <ScrollFragment
            key={card.id}
            card={card}
            store={store}
            progress={fragmentProgress}
            envelopeIndex={index}
          />
        ))}
      </group>
    </group>
  );
}
