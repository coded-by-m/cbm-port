"use client";

import { createRef, useMemo, useRef } from "react";
import { Line } from "@react-three/drei";
import type { Group, Mesh } from "three";
import type { Line2 } from "three-stdlib";
import Node from "./Node";
import { useBuildAnimation } from "./useBuildAnimation";
import { useLayerDrift } from "./useLivingMotion";
import { LINE_WIDTH } from "./config";
import type { BuiltLayer } from "./geometry";

/**
 * Uma camada de profundidade da malha triangulada.
 *
 * Renderiza os nós (que surgem por escala) e as arestas (que conectam por
 * opacidade), e encapsula a própria animação de construção e o seu
 * micro-deslocamento orgânico. As arestas usam `depthTest=false` para uma
 * leitura limpa de wireframe; a ordem das camadas (fundo → frente) resolve a
 * sobreposição.
 */
export default function LatticeLayer({
  geom,
  delay,
}: {
  geom: BuiltLayer;
  delay: number;
}) {
  const groupRef = useRef<Group>(null);

  const nodeRefs = useMemo(
    () => geom.nodes.map(() => createRef<Mesh>()),
    [geom],
  );
  const edgeRefs = useMemo(
    () => geom.edges.map(() => createRef<Line2>()),
    [geom],
  );

  useBuildAnimation(nodeRefs, edgeRefs, geom, delay);
  useLayerDrift(groupRef, geom.layer);

  return (
    <group ref={groupRef}>
      {geom.nodes.map((node, index) => (
        <Node
          key={`node-${index}`}
          ref={nodeRefs[index]}
          position={node.position}
          opacity={geom.layer.nodeOpacity}
        />
      ))}

      {geom.edges.map((edge, index) => (
        <Line
          key={`edge-${index}`}
          ref={edgeRefs[index]}
          points={edge.points}
          color={geom.layer.edgeColor}
          lineWidth={LINE_WIDTH}
          transparent
          opacity={0}
          depthTest={false}
          depthWrite={false}
        />
      ))}
    </group>
  );
}
