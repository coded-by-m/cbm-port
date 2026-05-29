"use client";

import { useMemo, useRef } from "react";
import { Line } from "@react-three/drei";
import type { Group, Mesh, Vector3 } from "three";
import { Vector3 as ThreeVector3 } from "three";
import type { Line2 } from "three-stdlib";
import Point from "./Point";
import Particles from "./Particles";
import { useTriangleAnimation } from "./useTriangleAnimation";
import { useOrganicMotion } from "./useOrganicMotion";
import { useResponsiveFit } from "./useResponsiveFit";
import {
  COLORS,
  LINE_WIDTH,
  TRIANGLE_EDGES,
  TRIANGLE_VERTICES,
} from "./config";

/**
 * Cena do Triangle Loader.
 *
 * Monta os pontos e as linhas a partir de `config` e delega:
 *  - construção/rotação para `useTriangleAnimation`;
 *  - adaptação de tamanho para `useResponsiveFit`.
 *
 * Dois grupos aninhados separam responsabilidades:
 *  - `fitRef`    → escala responsiva;
 *  - `rotateRef` → rotação da estrutura.
 */
export default function TriangleScene() {
  const fitRef = useRef<Group>(null);
  const rotateRef = useRef<Group>(null);

  const pointRefs = [
    useRef<Mesh>(null),
    useRef<Mesh>(null),
    useRef<Mesh>(null),
  ];
  const lineRefs = [
    useRef<Line2>(null),
    useRef<Line2>(null),
    useRef<Line2>(null),
  ];

  // Pares de pontos de cada aresta, derivados dos vértices uma única vez.
  const edges = useMemo<[Vector3, Vector3][]>(
    () =>
      TRIANGLE_EDGES.map(([a, b]) => [
        new ThreeVector3(...TRIANGLE_VERTICES[a]),
        new ThreeVector3(...TRIANGLE_VERTICES[b]),
      ]),
    [],
  );

  useResponsiveFit(fitRef);
  useTriangleAnimation(rotateRef, pointRefs, lineRefs);
  useOrganicMotion(rotateRef);

  return (
    <>
      <Particles />

      <group ref={fitRef}>
        <group ref={rotateRef}>
          {TRIANGLE_VERTICES.map((vertex, index) => (
            <Point
              key={`point-${index}`}
              ref={pointRefs[index]}
              position={vertex}
            />
          ))}

          {edges.map((points, index) => (
            <Line
              key={`edge-${index}`}
              ref={lineRefs[index]}
              points={points}
              color={COLORS.line}
              lineWidth={LINE_WIDTH}
              transparent
              opacity={0}
              depthTest={false}
            />
          ))}
        </group>
      </group>
    </>
  );
}
