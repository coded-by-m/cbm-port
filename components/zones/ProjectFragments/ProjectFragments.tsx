"use client";

import { Canvas } from "@react-three/fiber";
import { CAMERA, COLORS, FOG } from "@/components/zones/TerrainMesh/config";
import ProjectScene from "./ProjectScene";

/**
 * Project Fragments — Experimento 04 do Experience Lab.
 *
 * Valida como os projetos existirão dentro da futura Paisagem Digital: não
 * como cards/grade, mas como fragmentos triangulados descobertos sobre o
 * terreno. Hover (desktop) / toque (mobile) destaca o fragmento e revela um
 * marcador simples. Sem cards, modais, overlay HTML, scroll ou CTA.
 *
 * Reaproveita o Terrain Mesh como base. Procedural, sem assets/modelos, sem
 * shaders complexos e sem post-processing. `frameloop="always"` mantém a cena
 * viva e responde às interações.
 */
export default function ProjectFragments() {
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
        <ProjectScene />
      </Canvas>
    </div>
  );
}
