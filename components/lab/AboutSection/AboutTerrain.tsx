"use client";

import { Canvas } from "@react-three/fiber";
import TerrainLayer from "@/components/lab/TerrainMesh/TerrainLayer";
import { LAYERS, FOG } from "@/components/lab/TerrainMesh/config";

/**
 * Terreno residual estático como background da Seção Sobre. Câmera fixa,
 * sem controle cinematográfico — só a respiração própria das camadas. A
 * seção compõe com opacity baixa (~8%): textura mínima, zero distração.
 */
export default function AboutTerrain() {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 4, 14], fov: 42 }}
      style={{ background: "transparent" }}
    >
      <fog attach="fog" args={[FOG.color, 16, 44]} />
      {LAYERS.map((layer) => (
        <TerrainLayer key={layer.name} layer={layer} />
      ))}
    </Canvas>
  );
}
