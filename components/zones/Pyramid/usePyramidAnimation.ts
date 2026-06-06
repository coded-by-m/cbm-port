"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";
import type { Line2 } from "three-stdlib";
import { FACE_GRID } from "./config";
import type { BuiltFace } from "./geometry";

/**
 * Animação de construção da pirâmide via useFrame.
 *
 * Usa tempo desde mount (não GSAP) para evitar race conditions com refs
 * do drei Line. Nós surgem por escala, arestas por opacidade.
 * A ordem é controlada pelo valor `build` — distância do apex.
 *
 * BUILD_DURATION controla quanto tempo leva para construir tudo.
 * Nós e arestas com `build` baixo aparecem primeiro.
 */
const BUILD_DELAY = 0.3;
const BUILD_DURATION = 2.2;
const EDGE_DELAY = 0.4;

export function usePyramidAnimation(
  faces: BuiltFace[],
  allNodeRefs: React.RefObject<Mesh>[][],
  allEdgeRefs: React.RefObject<Line2>[][],
) {
  const elapsed = useRef(0);

  useFrame((_, delta) => {
    elapsed.current += delta;
    const t = elapsed.current - BUILD_DELAY;
    if (t < 0) return;

    const buildProgress = Math.min(1, t / BUILD_DURATION);

    faces.forEach((face, fi) => {
      face.nodes.forEach((node, ni) => {
        const mesh = allNodeRefs[fi]?.[ni]?.current;
        if (!mesh) return;

        const nodeT = Math.max(
          0,
          Math.min(1, (buildProgress - node.build * 0.7) / 0.3),
        );
        const eased = 1 - Math.pow(1 - nodeT, 2);
        mesh.scale.setScalar(eased);
      });

      face.edges.forEach((edge, ei) => {
        const line = allEdgeRefs[fi]?.[ei]?.current;
        if (!line) return;

        const edgeProgress = Math.max(
          0,
          (t - EDGE_DELAY) / BUILD_DURATION,
        );
        const edgeT = Math.max(
          0,
          Math.min(1, (edgeProgress - edge.build * 0.7) / 0.3),
        );
        line.material.opacity = edgeT * FACE_GRID.edgeOpacity;
      });
    });
  });
}
