"use client";

import { Canvas } from "@react-three/fiber";
import { COLORS, CAMERA } from "@/components/lab/TerrainMesh/config";
import SpatialScene from "./SpatialScene";
import { SPATIAL_FOG, VIGNETTE } from "./config";

/**
 * Spatial Composition — Experimento V1.1 do Experience Lab.
 *
 * Composição espacial pura. Sem textos, sem overlay, sem interação.
 * Terreno em profundidade + estrutura focal distante + câmera lenta +
 * vinheta de hierarquia visual. A cena precisa despertar curiosidade
 * sozinha — antes de qualquer conteúdo.
 */
export default function SpatialComposition() {
  return (
    <div className="absolute inset-0">
      <Canvas
        frameloop="always"
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        camera={{ position: [...CAMERA.position], fov: CAMERA.fov }}
        style={{ background: COLORS.background }}
      >
        <fog attach="fog" args={[SPATIAL_FOG.color, SPATIAL_FOG.near, SPATIAL_FOG.far]} />
        <SpatialScene />
      </Canvas>

      {/* Vinheta focal — bordas escuras, centro mais claro. Dirige o olhar. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 50% ${VIGNETTE.offsetY}, transparent 0%, rgba(0,15,8,${VIGNETTE.opacity}) 100%)`,
        }}
      />
    </div>
  );
}
