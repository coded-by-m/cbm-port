"use client";

import { useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { MOTION, type LayerConfig } from "./config";

const TWO_PI = Math.PI * 2;

/**
 * Movimento vivo da estrutura (nível do grupo de rotação).
 *
 * Sobrepõe três camadas extremamente sutis, todas de baixa intensidade:
 *  - respiração: escala pulsando em torno de 1;
 *  - inclinação: micro oscilação em x/z;
 *  - balanço: yaw oscilante (vai-e-volta), nunca um giro completo.
 *
 * Movimento rígido do conjunto, não deformação por vértice — precisão de
 * engenharia, jamais líquido/fumaça/partículas.
 */
export function useOrganicMotion(ref: RefObject<Group>) {
  const elapsed = useRef(0);

  useFrame((_, delta) => {
    const group = ref.current;
    if (!group) return;

    elapsed.current += delta;
    const t = elapsed.current;

    const breath =
      1 + Math.sin(t * (TWO_PI / MOTION.breathPeriod)) * MOTION.breathAmplitude;
    group.scale.setScalar(breath);

    group.rotation.y =
      Math.sin(t * (TWO_PI / MOTION.yawPeriod)) * MOTION.yawAmplitude;
    group.rotation.x =
      Math.sin(t * (TWO_PI / MOTION.tiltPeriod)) * MOTION.tiltAmplitude;
    group.rotation.z =
      Math.cos(t * (TWO_PI / MOTION.tiltPeriod) * 0.8) *
      MOTION.tiltAmplitude *
      0.6;
  });
}

/**
 * Micro-deslocamento próprio de cada camada (parallax orgânico em
 * profundidade). Amplitude minúscula e fase própria: as camadas nunca se
 * movem em uníssono, dando vida espacial sem poluição.
 */
export function useLayerDrift(ref: RefObject<Group>, layer: LayerConfig) {
  const elapsed = useRef(0);

  useFrame((_, delta) => {
    const group = ref.current;
    if (!group) return;

    elapsed.current += delta;
    const phase = elapsed.current * (TWO_PI / layer.driftPeriod) + layer.driftPhase;

    group.position.x = Math.sin(phase) * layer.driftAmp;
    group.position.y = Math.cos(phase * 0.85) * layer.driftAmp * 0.7;
    group.position.z = Math.sin(phase * 0.6) * layer.driftAmp * 0.5;
  });
}
