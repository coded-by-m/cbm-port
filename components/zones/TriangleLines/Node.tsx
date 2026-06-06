"use client";

import { forwardRef } from "react";
import type { Mesh } from "three";
import { COLORS, NODE_RADIUS } from "./config";

type NodeProps = {
  position: [number, number, number];
  opacity: number;
};

/**
 * Nó estrutural da malha.
 *
 * Começa com escala 0 (invisível). A animação faz cada nó "surgir" antes das
 * arestas que o conectam — "nada surge pronto, tudo é construído". A opacidade
 * vem da camada (perspectiva atmosférica em profundidade).
 */
const Node = forwardRef<Mesh, NodeProps>(function Node({ position, opacity }, ref) {
  return (
    <mesh ref={ref} position={position} scale={0}>
      <icosahedronGeometry args={[NODE_RADIUS, 2]} />
      <meshBasicMaterial
        color={COLORS.node}
        transparent
        opacity={opacity}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
});

export default Node;
