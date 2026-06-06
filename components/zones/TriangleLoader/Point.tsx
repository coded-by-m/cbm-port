"use client";

import { forwardRef } from "react";
import type { Mesh } from "three";
import { COLORS, POINT_RADIUS } from "./config";

type PointProps = {
  position: [number, number, number];
};

/**
 * Ponto estrutural reutilizável do loader.
 *
 * Começa com escala 0 (invisível). A animação faz cada ponto "surgir"
 * antes das linhas — "nada surge pronto, tudo é construído".
 */
const Point = forwardRef<Mesh, PointProps>(function Point({ position }, ref) {
  return (
    <mesh ref={ref} position={position} scale={0}>
      <icosahedronGeometry args={[POINT_RADIUS, 2]} />
      <meshBasicMaterial color={COLORS.point} />
    </mesh>
  );
});

export default Point;
