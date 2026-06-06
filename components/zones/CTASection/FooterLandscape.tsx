"use client";

import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import TerrainLayer from "@/components/zones/TerrainMesh/TerrainLayer";
import { useCursorHover } from "@/components/zones/TerrainMesh/useCursorHover";
import { LAYERS, FOG } from "@/components/zones/TerrainMesh/config";

/**
 * Terreno triangulado da marca subindo da base do footer. Reusa as LAYERS +
 * o hover de cursor (o relevo se eleva sob o mouse) — a "paisagem" reativa do
 * footer-showpiece. Câmera baixa pra ler como horizonte/relevo.
 */
function Terrain() {
  const scaleRef = useRef(1);
  const hoverRef = useCursorHover(scaleRef);
  return (
    <>
      {LAYERS.map((layer) => (
        <TerrainLayer key={layer.name} layer={layer} hoverRef={hoverRef} />
      ))}
    </>
  );
}

export default function FooterLandscape({
  active = true,
}: {
  /** `false` → congela o render loop (não gasta GPU fora de vista). */
  active?: boolean;
} = {}) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 1.4, 10.5], fov: 40 }}
      onCreated={({ camera }) => camera.lookAt(0, 0.4, 0)}
      style={{ background: "transparent" }}
    >
      <fog attach="fog" args={[FOG.color, 12, 40]} />
      <Terrain />
    </Canvas>
  );
}
