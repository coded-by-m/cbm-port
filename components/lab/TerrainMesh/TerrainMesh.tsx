"use client";

import { Canvas } from "@react-three/fiber";
import TerrainScene from "./TerrainScene";
import { CAMERA, COLORS, FOG } from "./config";

/**
 * Terrain Mesh — Experimento 03 do Experience Lab.
 *
 * Primeira versão da futura Paisagem Digital: apenas o terreno. Uma malha
 * triangulada procedural com profundidade real (3 camadas), respiração sutil e
 * câmera de observação. Sem projetos, cards ou cases — só a estrutura.
 *
 * Procedural, sem assets/modelos, sem shaders complexos e sem post-processing.
 * Materiais não-iluminados (basic) dispensam luzes; a névoa funde a
 * profundidade no preto. `frameloop="always"` mantém a malha viva.
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
