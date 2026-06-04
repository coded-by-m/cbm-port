"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  CanvasTexture,
  Color,
  type SpriteMaterial,
  type Sprite as ThreeSprite,
} from "three";
import { EDGE_PULSE } from "./config";
import type { TowerGeometry } from "./towerGeometry";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const colorBase = new Color("#F5F2ED");
const colorActive = new Color("#FB3640");
const colorScratch = new Color();

/** Textura singleton: ponto brilhante com fade suave nas bordas. */
let cachedTexture: CanvasTexture | null = null;
function getSparkTexture(): CanvasTexture {
  if (cachedTexture) return cachedTexture;
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    // Centro super brilhante, falloff rápido — sensação de faísca de luz.
    const cx = size / 2;
    const cy = size / 2;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, size / 2);
    grad.addColorStop(0, "rgba(255, 255, 255, 1)");
    grad.addColorStop(0.08, "rgba(255, 255, 255, 0.85)");
    grad.addColorStop(0.25, "rgba(255, 255, 255, 0.35)");
    grad.addColorStop(0.55, "rgba(255, 255, 255, 0.08)");
    grad.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }
  cachedTexture = new CanvasTexture(canvas);
  return cachedTexture;
}

/**
 * Faísca de luz percorrendo as arestas da torre.
 *
 * Sprite com textura radial procedural + AdditiveBlending — visual de
 * partícula de luz real. Caminho passa por todos os níveis (base ↔ mid ↔ apex).
 * Lento (1.6s por aresta) — total ≈22s loop. Acelera 1.4× quando ativo,
 * cor pende pra signal red.
 */
export default function FragmentEdgePulse({
  geom,
  isActive,
}: {
  geom: TowerGeometry;
  isActive: boolean;
}) {
  const spriteRef = useRef<ThreeSprite>(null);
  const matRef = useRef<SpriteMaterial>(null);
  const elapsed = useRef(0);
  const opacity = useRef<number>(EDGE_PULSE.baseOpacity);
  const colorMix = useRef<number>(0);

  const texture = useMemo(() => {
    if (typeof window === "undefined") return null;
    return getSparkTexture();
  }, []);

  // Caminho: 0,3,6,4,1,5,6,3,0,2,5,1,4,6,0 — atravessa todos os níveis.
  const path = useMemo<number[]>(
    () => [0, 3, 6, 4, 1, 5, 6, 3, 0, 2, 5, 1, 4, 6, 0],
    [],
  );

  const points = useMemo(() => path.map((i) => geom.nodes[i]), [path, geom]);

  useFrame((_, delta) => {
    const speedMul = isActive ? 1.4 : 1;
    elapsed.current += delta * speedMul;

    const totalEdges = points.length - 1;
    const totalDuration = totalEdges * EDGE_PULSE.timePerEdge;
    const t = elapsed.current % totalDuration;

    const edgeIdx = Math.min(
      totalEdges - 1,
      Math.floor(t / EDGE_PULSE.timePerEdge),
    );
    const localT =
      (t - edgeIdx * EDGE_PULSE.timePerEdge) / EDGE_PULSE.timePerEdge;

    const from = points[edgeIdx];
    const to = points[edgeIdx + 1];

    const sprite = spriteRef.current;
    if (sprite) {
      sprite.position.set(
        lerp(from[0], to[0], localT),
        lerp(from[1], to[1], localT),
        lerp(from[2], to[2], localT),
      );
    }

    const targetOpacity = isActive
      ? EDGE_PULSE.activeOpacity
      : EDGE_PULSE.baseOpacity;
    opacity.current = lerp(
      opacity.current,
      targetOpacity,
      Math.min(1, delta * EDGE_PULSE.lerpSpeed),
    );

    const targetMix = isActive ? 1 : 0;
    colorMix.current = lerp(
      colorMix.current,
      targetMix,
      Math.min(1, delta * EDGE_PULSE.lerpSpeed),
    );

    if (matRef.current) {
      matRef.current.opacity = opacity.current;
      colorScratch.copy(colorBase).lerp(colorActive, colorMix.current);
      matRef.current.color.copy(colorScratch);
    }
  });

  if (!texture) return null;

  return (
    <sprite
      ref={spriteRef}
      scale={[EDGE_PULSE.size, EDGE_PULSE.size, 1]}
    >
      <spriteMaterial
        ref={matRef}
        map={texture}
        color={"#F5F2ED"}
        transparent
        opacity={EDGE_PULSE.baseOpacity}
        depthWrite={false}
        depthTest={false}
        blending={AdditiveBlending}
      />
    </sprite>
  );
}
