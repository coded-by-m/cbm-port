"use client";

import { useMemo, useRef } from "react";
import type { Group } from "three";
import LatticeLayer from "./LatticeLayer";
import { useOrganicMotion } from "./useLivingMotion";
import { useResponsiveFit } from "./useResponsiveFit";
import { buildLattice } from "./geometry";
import { TIMING } from "./config";

/**
 * Cena do Triangle Lines.
 *
 * Constrói a treliça uma única vez e distribui as camadas em profundidade.
 * Dois grupos aninhados separam responsabilidades:
 *  - `fitRef`    → escala responsiva (fit ao viewport);
 *  - `rotateRef` → movimento vivo do conjunto (respiração + balanço).
 *
 * Cada `LatticeLayer` cuida da própria construção e do próprio micro-drift.
 */
export default function TriangleScene() {
  const fitRef = useRef<Group>(null);
  const rotateRef = useRef<Group>(null);

  const { layers, fitRadius } = useMemo(() => buildLattice(), []);

  useResponsiveFit(fitRef, fitRadius);
  useOrganicMotion(rotateRef);

  return (
    <group ref={fitRef}>
      <group ref={rotateRef}>
        {layers.map((geom, index) => (
          <LatticeLayer
            key={geom.layer.name}
            geom={geom}
            delay={index * TIMING.layerStagger}
          />
        ))}
      </group>
    </group>
  );
}
