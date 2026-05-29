"use client";

import { Canvas } from "@react-three/fiber";
import { CAMERA, COLORS, FOG } from "@/components/lab/TerrainMesh/config";
import OverlayScene from "./OverlayScene";
import ProjectCard from "./ProjectCard";
import Connector from "./Connector";
import { useOverlayStore } from "./useOverlayStore";

/**
 * HTML Overlay — Experimento 05 do Experience Lab.
 *
 * Valida a ponte Three.js + HTML acessível: o fragmento continua 3D, mas o
 * conteúdo do projeto (texto, link, CTA) é HTML fora do canvas. A posição 3D
 * do fragmento ativo é projetada para coordenadas 2D e o card é ancorado a ela.
 *
 * O estado é compartilhado por props (o contexto do React não cruza o Canvas):
 * a cena escreve a posição no card; o card lê o id ativo para o conteúdo.
 * Clicar/tocar fora (onPointerMissed) dispensa o card.
 */
export default function HtmlOverlay() {
  const {
    store,
    activeId,
    isCompact,
    setActive,
    setCardEl,
    setConnectorLine,
    setConnectorDot,
  } = useOverlayStore();

  return (
    <div className="absolute inset-0">
      <Canvas
        frameloop="always"
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        camera={{ position: [...CAMERA.position], fov: CAMERA.fov }}
        style={{ background: COLORS.background }}
        onPointerMissed={() => setActive(null)}
      >
        <fog attach="fog" args={[FOG.color, FOG.near, FOG.far]} />
        <OverlayScene store={store} setActive={setActive} />
      </Canvas>

      <Connector
        visible={Boolean(activeId) && !isCompact}
        setLine={setConnectorLine}
        setDot={setConnectorDot}
      />

      <ProjectCard
        activeId={activeId}
        isCompact={isCompact}
        setCardEl={setCardEl}
        onClose={() => setActive(null)}
      />
    </div>
  );
}
