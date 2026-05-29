"use client";

import { Canvas } from "@react-three/fiber";
import TriangleScene from "./TriangleScene";
import { COLORS } from "./config";

/**
 * Triangle Loader — Experimento 01 do Experience Lab.
 *
 * Conceito: "Nada surge pronto. Tudo é construído."
 * Pontos surgem, linhas conectam, o triângulo wireframe se forma e gira
 * lentamente sobre fundo de estúdio escuro.
 *
 * Procedural, sem shaders, sem post-processing e sem assets externos.
 * Materiais não-iluminados (basic / linhas) dispensam luzes — performance.
 */
export default function TriangleLoader() {
  return (
    <div className="absolute inset-0">
      <Canvas
        frameloop="demand"
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
