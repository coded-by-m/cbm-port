"use client";

import { type MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { TUNNEL } from "./config";

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smoothstep = (t: number) => t * t * (3 - 2 * t);

const _pos = new Vector3();
const _tgt = new Vector3();

/**
 * Câmera-tunnel: scroll move a câmera linearmente em Z.
 *
 * Diferente do `useProjectScrollCamera` antigo (que tinha 3 keyframes em arco
 * e pan em X), aqui o movimento é single-axis: a câmera sai de `TUNNEL.startZ`
 * e vai até `TUNNEL.endZ` conforme o progresso (0→1). Target acompanha à
 * `lookAhead` à frente — câmera sempre olhando pra frente do corredor.
 *
 * Smoothstep no progresso evita arrancadas/freadas bruscas perto das pontas.
 */
export function useTunnelCamera(progress: MutableRefObject<number>) {
  const camera = useThree((state) => state.camera);

  useFrame(() => {
    const p = smoothstep(clamp01(progress.current));
    const z = TUNNEL.startZ + (TUNNEL.endZ - TUNNEL.startZ) * p;

    _pos.set(0, TUNNEL.cameraY, z);
    _tgt.set(0, TUNNEL.targetY, z - TUNNEL.lookAhead);

    camera.position.copy(_pos);
    camera.lookAt(_tgt);
  });
}
