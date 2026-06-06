"use client";

import { Canvas } from "@react-three/fiber";
import { CAMERA, COLORS, FOG } from "@/components/lab/TerrainMesh/config";
import { ConnectiveSubstrate } from "./ConnectiveSubstrate";

/**
 * HomeCanvas — o ÚNICO contexto WebGL da Home (alvo do spec
 * `2026-06-06-homecanvas-shared-design.md`). Fixo atrás de todo o conteúdo
 * HTML; as cenas de cada capítulo renderizam aqui dentro (substituindo os 8
 * `<Canvas>` por-zona) e a câmera transiciona entre elas.
 *
 * Estado atual: SCAFFOLD (Passo 1) — só o `ConnectiveSubstrate` (terreno
 * persistente). Câmera estática (config do terreno); o `CameraRig` e as cenas
 * por capítulo entram nos próximos passos. Vive isolado em `/homecanvas` até
 * ter paridade com a Home atual.
 */
export function HomeCanvas() {
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
        <ConnectiveSubstrate />
      </Canvas>
    </div>
  );
}
