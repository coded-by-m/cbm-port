"use client";

import { createRef, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import type { Line2 } from "three-stdlib";
import { sampleHeight } from "@/components/lab/TerrainMesh/geometry";
import { buildTower } from "./towerGeometry";
import {
  FRAGMENT_VISUAL,
  HOST_LAYER,
  NETWORK_LINE,
  type FragmentSlot,
} from "./config";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Linha sutil ligando os 3 apexes ao longo do horizonte.
 *
 * Segmentos adjacentes ao fragmento ativo brilham (`activeOpacity`); os
 * demais permanecem discretos (`baseOpacity`). Geometria estática (computada
 * uma vez via sampleHeight em t=0) — o bob é amplitude 0.02 e o efeito na
 * linha seria imperceptível.
 */
export default function NetworkLine({
  slots,
  activeSlug,
}: {
  slots: FragmentSlot[];
  activeSlug: string | null;
}) {
  // Ordena por x para garantir adjacência espacial (left → center → right).
  const ordered = useMemo(
    () => [...slots].sort((a, b) => a.x - b.x),
    [slots],
  );

  // Computa apex world position de cada slot uma única vez (em t=0).
  const apexPoints = useMemo(
    () =>
      ordered.map((slot): [number, number, number] => {
        const apexLocal = buildTower(slot.seed).apex;
        const surfaceY = sampleHeight(slot.x, slot.z, 0, HOST_LAYER);
        const y =
          surfaceY + FRAGMENT_VISUAL.surfaceLift + apexLocal[1] * slot.scale;
        return [slot.x, y, slot.z];
      }),
    [ordered],
  );

  // Pares de pontos para cada segmento entre slots adjacentes.
  const segments = useMemo(
    () =>
      ordered.slice(0, -1).map((slot, i) => ({
        from: slot,
        to: ordered[i + 1],
        points: [apexPoints[i], apexPoints[i + 1]] as [
          [number, number, number],
          [number, number, number],
        ],
      })),
    [ordered, apexPoints],
  );

  const lineRefs = useMemo(
    () => segments.map(() => createRef<Line2>()),
    [segments],
  );
  const opacities = useRef<number[]>(segments.map(() => NETWORK_LINE.baseOpacity));

  useFrame((_, delta) => {
    segments.forEach((seg, i) => {
      const line = lineRefs[i].current;
      if (!line) return;

      const isAdjacent =
        activeSlug !== null &&
        (activeSlug === seg.from.slug || activeSlug === seg.to.slug);
      const target = isAdjacent
        ? NETWORK_LINE.activeOpacity
        : NETWORK_LINE.baseOpacity;
      const next = lerp(
        opacities.current[i],
        target,
        Math.min(1, delta * NETWORK_LINE.lerpSpeed),
      );
      opacities.current[i] = next;
      (line.material as { opacity: number }).opacity = next;
    });
  });

  return (
    <>
      {segments.map((seg, i) => (
        <Line
          key={`net-${seg.from.slug}-${seg.to.slug}`}
          ref={lineRefs[i]}
          points={seg.points}
          color={NETWORK_LINE.color}
          lineWidth={NETWORK_LINE.lineWidth}
          transparent
          opacity={NETWORK_LINE.baseOpacity}
          depthWrite={false}
          depthTest={false}
        />
      ))}
    </>
  );
}
