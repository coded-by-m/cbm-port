"use client";

import { type MutableRefObject, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { MOBILE_MAX_WIDTH, ORBIT, ORBIT_MOBILE } from "./config";

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
  // Largura do canvas (px) → enquadramento mobile vs desktop.
  const width = useThree((state) => state.size.width);
  const elapsed = useRef(0);

  useFrame((_, delta) => {
    if (!enabled) return;
    elapsed.current += delta;
    const a = angleRef.current;
    // Enquadramento responsivo: retrato estreito usa raio menor + target mais
    // baixo (ativo legível e empurrado pra cima, acima do card).
    const mobile = width <= MOBILE_MAX_WIDTH;
    const cameraRadius = mobile ? ORBIT_MOBILE.cameraRadius : ORBIT.cameraRadius;
    const cameraY = mobile ? ORBIT_MOBILE.cameraY : ORBIT.cameraY;
    const targetY = mobile ? ORBIT_MOBILE.targetY : ORBIT.targetY;
    // Respiração ambiente sutil em Y — dá vida mesmo em pausa.
    const breath =
      Math.sin((elapsed.current * TWO_PI) / ORBIT.breathPeriod) *
      ORBIT.breathAmp;
    _pos.set(
      Math.sin(a) * cameraRadius,
      cameraY + breath,
      Math.cos(a) * cameraRadius,
    );
    _tgt.set(0, targetY, 0);

    camera.position.copy(_pos);
    camera.lookAt(_tgt);
  });
}
