"use client";

import { type MutableRefObject, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { ORBIT } from "./config";

const _pos = new Vector3();
const _tgt = new Vector3();
const TWO_PI = Math.PI * 2;

/**
 * Câmera orbital ao redor do centro.
 *
 * Lê `angleRef.current` por frame e posiciona a câmera. O orquestrador
 * decide se está em auto-rotate, drag manual ou snap GSAP — aqui só
 * espelhamos o estado.
 *
 * Câmera em:
 *   x = sin(θ) * R
 *   z = cos(θ) * R
 * sempre olhando para (0, targetY, 0). Single-axis (yaw only), sem tilt
 * orbital nem pitch — mantém a Paisagem lendo como horizonte coerente.
 */
export function useOrbitCamera(angleRef: MutableRefObject<number>) {
  useOrbitCameraConditional(angleRef, true);
}

export function useOrbitCameraConditional(
  angleRef: MutableRefObject<number>,
  enabled: boolean,
) {
  const camera = useThree((state) => state.camera);
  const elapsed = useRef(0);

  useFrame((_, delta) => {
    if (!enabled) return;
    elapsed.current += delta;
    const a = angleRef.current;
    // Respiração ambiente sutil em Y — dá vida mesmo em pausa.
    const breath =
      Math.sin((elapsed.current * TWO_PI) / ORBIT.breathPeriod) *
      ORBIT.breathAmp;
    _pos.set(
      Math.sin(a) * ORBIT.cameraRadius,
      ORBIT.cameraY + breath,
      Math.cos(a) * ORBIT.cameraRadius,
    );
    _tgt.set(0, ORBIT.targetY, 0);

    camera.position.copy(_pos);
    camera.lookAt(_tgt);
  });
}
