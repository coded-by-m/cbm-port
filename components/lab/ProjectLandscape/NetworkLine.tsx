"use client";

import { createRef, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { Vector3 } from "three";
import type { Line2 } from "three-stdlib";
import { sampleHeight } from "@/components/lab/TerrainMesh/geometry";
import { FRAGMENT_MOTION } from "@/components/lab/ProjectFragments/config";
import { buildTower } from "./towerGeometry";
import {
  FRAGMENT_VISUAL,
  HOST_LAYER,
  NETWORK_LINE,
  type FragmentSlot,
} from "./config";

const TWO_PI = Math.PI * 2;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Linha sutil ligando os 3 apexes ao longo do horizonte.
 *
 * Segmentos adjacentes ao fragmento ativo brilham (`activeOpacity`); os
 * demais permanecem discretos (`baseOpacity`). A geometria respira junto
 * com os fragmentos — Y atualizado por frame via sampleHeight + bob.
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

  // Apex local de cada slot (determinístico pelo seed).
  const apexLocals = useMemo(
    () => ordered.map((slot) => buildTower(slot.seed).apex),
    [ordered],
  );

  // 2 segmentos: entre slots adjacentes na ordem.
  const segments = useMemo(
    () =>
      ordered.slice(0, -1).map((slot, i) => ({
        from: slot,
        to: ordered[i + 1],
        fromApex: apexLocals[i],
        toApex: apexLocals[i + 1],
      })),
    [ordered, apexLocals],
  );

  const lineRefs = useMemo(
    () => segments.map(() => createRef<Line2>()),
    [segments],
  );
  const opacities = useRef<number[]>(segments.map(() => NETWORK_LINE.baseOpacity));
  const elapsed = useRef(0);

  const fromVec = useRef(new Vector3());
  const toVec = useRef(new Vector3());

  useFrame((_, delta) => {
    elapsed.current += delta;
    const t = elapsed.current;

    segments.forEach((seg, i) => {
      const line = lineRefs[i].current;
      if (!line) return;

      // Y do apex em world space = surfaceY + surfaceLift + bob + apexY * scale.
      const fromBob =
        Math.sin(t * (TWO_PI / FRAGMENT_MOTION.bobPeriod) + seg.from.seed) *
        FRAGMENT_MOTION.bobAmplitude;
      const toBob =
        Math.sin(t * (TWO_PI / FRAGMENT_MOTION.bobPeriod) + seg.to.seed) *
        FRAGMENT_MOTION.bobAmplitude;

      const fromGroupY =
        sampleHeight(seg.from.x, seg.from.z, t, HOST_LAYER) +
        FRAGMENT_VISUAL.surfaceLift +
        fromBob;
      const toGroupY =
        sampleHeight(seg.to.x, seg.to.z, t, HOST_LAYER) +
        FRAGMENT_VISUAL.surfaceLift +
        toBob;

      fromVec.current.set(
        seg.from.x,
        fromGroupY + seg.fromApex[1] * seg.from.scale,
        seg.from.z,
      );
      toVec.current.set(
        seg.to.x,
        toGroupY + seg.toApex[1] * seg.to.scale,
        seg.to.z,
      );

      // Line2 (drei <Line>) expõe setPoints via geometry.
      const geometry = line.geometry as unknown as {
        setPositions: (positions: number[]) => void;
      };
      geometry.setPositions([
        fromVec.current.x,
        fromVec.current.y,
        fromVec.current.z,
        toVec.current.x,
        toVec.current.y,
        toVec.current.z,
      ]);

      // Opacidade alvo: brilha se o ativo é uma das pontas do segmento.
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
          // Pontos iniciais (serão sobrescritos no primeiro frame).
          points={[
            [seg.from.x, 0, seg.from.z],
            [seg.to.x, 0, seg.to.z],
          ]}
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
