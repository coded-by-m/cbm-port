"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { CanvasTexture, type SpriteMaterial } from "three";
import { APEX_BEAM } from "./config";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

let cachedTexture: CanvasTexture | null = null;
function getBeamTexture(): CanvasTexture {
  if (cachedTexture) return cachedTexture;
  const w = 32;
  const h = 256;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    // Gradiente vertical: signal red embaixo → off-white meio → transparente topo.
    const grad = ctx.createLinearGradient(0, h, 0, 0);
    grad.addColorStop(0, "rgba(251, 54, 64, 0.95)");
    grad.addColorStop(0.15, "rgba(245, 242, 237, 0.85)");
    grad.addColorStop(0.5, "rgba(245, 242, 237, 0.45)");
    grad.addColorStop(1, "rgba(245, 242, 237, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }
  cachedTexture = new CanvasTexture(canvas);
  return cachedTexture;
}

/**
 * Feixe vertical de luz acima do apex — só quando ativo.
 *
 * Sprite com gradiente vertical (signal red na base → off-white → transparente
 * no topo). Sempre face-camera, parece uma "transmissão" vertical saindo do
 * fragmento ativo.
 */
export default function FragmentBeam({
  isActive,
  baseY,
}: {
  isActive: boolean;
  /** Y local onde o feixe começa (geralmente apex.y). */
  baseY: number;
}) {
  const texture = useMemo(() => {
    if (typeof window === "undefined") return null;
    return getBeamTexture();
  }, []);

  const matRef = useRef<SpriteMaterial | null>(null);
  const opacity = useRef(0);

  useFrame((_, delta) => {
    const target = isActive ? 1 : 0;
    opacity.current = lerp(
      opacity.current,
      target,
      Math.min(1, delta * APEX_BEAM.lerpSpeed),
    );
    if (matRef.current) matRef.current.opacity = opacity.current;
  });

  if (!texture) return null;

  return (
    <sprite
      position={[0, baseY + APEX_BEAM.height / 2, 0]}
      scale={[APEX_BEAM.width, APEX_BEAM.height, 1]}
    >
      <spriteMaterial
        ref={matRef}
        map={texture}
        transparent
        opacity={0}
        depthWrite={false}
        depthTest={false}
      />
    </sprite>
  );
}
