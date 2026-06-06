"use client";

import { useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { MOTION } from "./config";

const TWO_PI = Math.PI * 2;

/**
 * Movimento orgânico do grupo de rotação.
 *
 * Sobrepõe duas camadas extremamente sutis à rotação principal (controlada
 * pelo GSAP em `rotation.y`):
 *  - respiração: uma escala que pulsa em torno de 1 com amplitude minúscula;
 *  - inclinação: micro oscilação em `rotation.x`/`rotation.z`, defasada, para
 *    dar a sensação de uma peça que respira sem nunca parecer "animada".
 *
 * Não toca em `rotation.y` nem na escala do fit (grupos separados), evitando
 * conflito com a timeline e com o ajuste responsivo.
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

    const tilt = t * (TWO_PI / MOTION.tiltPeriod);
    group.rotation.x = Math.sin(tilt) * MOTION.tiltAmplitude;
    group.rotation.z = Math.cos(tilt * 0.8) * MOTION.tiltAmplitude * 0.6;
  });
}
