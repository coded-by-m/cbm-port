"use client";

import { Canvas } from "@react-three/fiber";
import TriangleScene from "./TriangleScene";
import { COLORS } from "./config";

/**
 * Triangle Lines — Experimento 02 do Experience Lab.
 *
 * Conceito: não desenhar triângulos, mas construir uma estrutura triangulada
 * — um sistema sendo montado. Nós surgem, linhas conectam, triângulos emergem
 * como consequência, a malha cresce em profundidade e permanece viva.
 *
 * Procedural, sem shaders, sem post-processing e sem assets externos.
 * Materiais não-iluminados (basic / linhas) dispensam luzes — performance.
 * `frameloop="always"` mantém a estrutura viva de forma contínua.
 */
export default function TriangleLines() {
  return (
    <div className="absolute inset-0">
      <Canvas
        frameloop="always"
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 6], fov: 45 }}
        style={{ background: COLORS.background }}
      >
        <TriangleScene />
      </Canvas>
    </div>
  );
}
