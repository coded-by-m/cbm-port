"use client";

import { Canvas } from "@react-three/fiber";
import TerrainScene from "./TerrainScene";
import { CAMERA, COLORS, FOG } from "./config";

/**
 * Terrain Mesh — Experimento do Experience Lab.
 *
 * Paisagem digital procedural: heightfield triangulado em fBm (4 oitavas)
 * com câmera de observação e parallax dirigido pelo cursor. O cursor move
 * o conteúdo do noise sob a tela; a câmera permanece fixa, preservando a
 * composição cinematográfica.
 *
 * Materiais não-iluminados, sem post-processing, sem texturas. A névoa
 * funde a profundidade no preto e o edge fade garante que a borda da
 * malha nunca apareça mesmo durante o parallax.
 */
export default function TerrainMesh() {
  return (
    <div className="absolute inset-0">
      <Canvas
        frameloop="always"
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        camera={{ position: [...CAMERA.position], fov: CAMERA.fov }}
        style={{ background: COLORS.background }}
      >
        <fog attach="fog" args={[FOG.color, FOG.near, FOG.far]} />
        <TerrainScene />
      </Canvas>
    </div>
  );
}
