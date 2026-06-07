"use client";

import { Canvas } from "@react-three/fiber";
import TerrainScene from "@/components/zones/TerrainMesh/TerrainScene";
import { ReleaseContext } from "@/components/three/ReleaseContext";
import { FOG } from "@/components/zones/TerrainMesh/config";

/**
 * Terreno wireframe como background da Seção Serviços.
 *
 * Câmera mais aberta (FOV 60, posição mais alta) pra dar paisagem ao fundo,
 * sem competir com os cards no foreground. Alpha do canvas é true — o opacity
 * 0.22 do wrapper externo compõe naturalmente com o bg do site.
 */
export default function TerrainBackground({
  active = true,
}: {
  /** `false` → congela o render loop fora do capítulo ativo (perf). */
  active?: boolean;
} = {}) {
  return (
    <div className="absolute inset-0">
      <Canvas
        frameloop={active ? "always" : "never"}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 3.5, 12], fov: 60 }}
      >
        <ReleaseContext />
        <fog attach="fog" args={[FOG.color, FOG.near, FOG.far]} />
        <TerrainScene />
      </Canvas>
    </div>
  );
}
