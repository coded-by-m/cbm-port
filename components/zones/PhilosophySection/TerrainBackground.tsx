"use client";

import { Canvas } from "@react-three/fiber";
import TerrainScene from "@/components/zones/TerrainMesh/TerrainScene";
import { COLORS, FOG } from "@/components/zones/TerrainMesh/config";

export default function TerrainBackground() {
  return (
    <div className="absolute inset-0">
      <Canvas
        frameloop="always"
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        camera={{ position: [0, 1.8, 9.5], fov: 55 }}
        style={{ background: COLORS.background }}
      >
        <fog attach="fog" args={[FOG.color, FOG.near, FOG.far]} />
        <TerrainScene />
      </Canvas>
    </div>
  );
}
