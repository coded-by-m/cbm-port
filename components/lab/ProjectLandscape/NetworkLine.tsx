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
 * Linha sutil ligando os apexes ao longo do horizonte.
 *
 * Modo orbital: ordena por ângulo e fecha o loop (último → primeiro) — anel
 * de conexão que envolve todo o portfólio. Segmentos adjacentes ao fragmento
 * ativo brilham; os demais permanecem discretos.
 */
export default function NetworkLine({
  slots,
  activeSlug,
}: {
  slots: FragmentSlot[];
  activeSlug: string | null;
}) {
  // Ordena por ângulo orbital — adjacência espacial no anel.
  const ordered = useMemo(() => {
    const TWO_PI = Math.PI * 2;
    const angleOf = (s: FragmentSlot) =>
      ((Math.atan2(s.x, s.z) % TWO_PI) + TWO_PI) % TWO_PI;
    return [...slots].sort((a, b) => angleOf(a) - angleOf(b));
  }, [slots]);

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

  // Anel fechado: N segmentos (último→primeiro inclusive).
  const segments = useMemo(
    () =>
      ordered.map((slot, i) => {
        const nextIdx = (i + 1) % ordered.length;
        return {
          from: slot,
          to: ordered[nextIdx],
          points: [apexPoints[i], apexPoints[nextIdx]] as [
            [number, number, number],
            [number, number, number],
          ],
        };
      }),
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
