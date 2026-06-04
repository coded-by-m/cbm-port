"use client";

import { Canvas } from "@react-three/fiber";
import TerrainScene from "@/components/lab/TerrainMesh/TerrainScene";
import { FOG } from "@/components/lab/TerrainMesh/config";

/**
 * Terreno wireframe como background da Seção Serviços.
 *
 * Câmera mais aberta (FOV 60, posição mais alta) pra dar paisagem ao fundo,
 * sem competir com os cards no foreground. Alpha do canvas é true — o opacity
 * 0.22 do wrapper externo compõe naturalmente com o bg do site.
 */
export default function TerrainBackground() {
  return (
    <div className="absolute inset-0">
      <Canvas
        frameloop="always"
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 3.5, 12], fov: 60 }}
      >
        <fog attach="fog" args={[FOG.color, FOG.near, FOG.far]} />
        <TerrainScene />
      </Canvas>
    </div>
  );
}
