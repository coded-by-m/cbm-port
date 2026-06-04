"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { CanvasTexture, type SpriteMaterial } from "three";
import { ACTIVE_GLOW } from "./config";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Cria uma textura radial procedural (off-white centro → transparente borda).
 *
 * Singleton — uma única textura compartilhada por todos os glows.
 */
let cachedTexture: CanvasTexture | null = null;
function getGlowTexture(): CanvasTexture {
  if (cachedTexture) return cachedTexture;
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const grad = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2,
    );
    grad.addColorStop(0, "rgba(245, 242, 237, 1)");
    grad.addColorStop(0.4, "rgba(245, 242, 237, 0.35)");
    grad.addColorStop(1, "rgba(245, 242, 237, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }
  cachedTexture = new CanvasTexture(canvas);
  return cachedTexture;
}

/**
 * Halo radial sutil atrás do fragmento ativo.
 *
 * Sprite com textura radial — billboard pra câmera. Opacidade lerp pra
 * suavizar enter/exit. Posicionado um pouco atrás (z negativo no espaço local
 * do fragmento) e abaixo do apex pra cercar a base da torre.
 */
export default function FragmentGlow({
  isActive,
  size,
}: {
  isActive: boolean;
  /** Tamanho do sprite em unidades world (multiplicador do sizeFactor). */
  size: number;
}) {
  const texture = useMemo(() => {
    if (typeof window === "undefined") return null;
    return getGlowTexture();
  }, []);

  const matRef = useRef<SpriteMaterial | null>(null);
  const opacity = useRef(0);

  useFrame((_, delta) => {
    const target = isActive ? ACTIVE_GLOW.peakOpacity : 0;
    opacity.current = lerp(opacity.current, target, Math.min(1, delta * 4));
    if (matRef.current) matRef.current.opacity = opacity.current;
  });

  if (!texture) return null;

  const finalSize = size * ACTIVE_GLOW.sizeFactor;

  return (
    <sprite position={[0, 0.3, -0.2]} scale={[finalSize, finalSize, 1]}>
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
