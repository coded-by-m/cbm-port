"use client";

import type { RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { CAMERA, COLORS, FOG } from "@/components/lab/TerrainMesh/config";
import { ConnectiveSubstrate } from "./ConnectiveSubstrate";
import { CameraRig } from "./CameraRig";
import { CHAPTER_CAMERA_KEYS } from "./cameraKeys";

/**
 * HomeCanvas — o ÚNICO contexto WebGL da Home (alvo do spec
 * `2026-06-06-homecanvas-shared-design.md`). Fixo atrás de todo o conteúdo
 * HTML; as cenas de cada capítulo renderizam aqui dentro (substituindo os 8
 * `<Canvas>` por-zona) e a câmera transiciona entre elas.
 *
 * Estado atual: Passo 2 — `ConnectiveSubstrate` (terreno persistente) +
 * `CameraRig` dirigido pelo scroll (`progressRef`). As cenas por capítulo e os
 * morphs entram nos próximos passos. Vive isolado em `/homecanvas` até ter
 * paridade com a Home atual.
 *
 * @param progressRef progresso 0..1 ao longo da página (do scroll), lido pelo
 *   CameraRig pra interpolar a câmera entre os capítulos.
 */
export function HomeCanvas({
  progressRef,
}: {
  progressRef: RefObject<number>;
}) {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        frameloop="always"
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        camera={{ position: [...CAMERA.position], fov: CAMERA.fov }}
        style={{ background: COLORS.background }}
      >
        <fog attach="fog" args={[FOG.color, FOG.near, FOG.far]} />
        <CameraRig keys={CHAPTER_CAMERA_KEYS} progressRef={progressRef} />
        <ConnectiveSubstrate />
      </Canvas>
    </div>
  );
}
