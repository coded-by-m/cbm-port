"use client";

import { type MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { FIT_RADIUS, FIT_RATIO } from "@/components/zones/TerrainMesh/config";
import { CAMERA_IDLE, SCROLL_POSES, type Pose } from "./config";

const smoothstep = (t: number) => t * t * (3 - 2 * t);

const fitRadius = FIT_RADIUS;

const posA = new Vector3();
const tgtA = new Vector3();
const posB = new Vector3();
const tgtB = new Vector3();
const pos  = new Vector3();
const tgt  = new Vector3();

/**
 * Câmera dirigida pelo scroll ao longo de um percurso narrativo explícito.
 *
 * Interpola entre as poses de SCROLL_POSES com easing suave (smoothstep).
 * Todas as posições são multiplicadas por `fit` — a câmera escala junto com
 * o terreno em qualquer viewport, mantendo o enquadramento consistente.
 * Uma micro-deriva proporcional ao fit mantém a sensação de vida.
 */
export function useScrollCamera(progress: MutableRefObject<number>) {
  const camera   = useThree((state) => state.camera);
  const viewport = useThree((state) => state.viewport);

  useFrame((state) => {
    const fit = (Math.max(viewport.width, viewport.height) * FIT_RATIO) / fitRadius;
    const p   = progress.current;
    const t   = state.clock.elapsedTime;

    // Segmento atual da trilha.
    let i = SCROLL_POSES.length - 2;
    for (let k = 0; k < SCROLL_POSES.length - 1; k++) {
      if (p >= SCROLL_POSES[k].p) i = k;
    }
    const a: Pose = SCROLL_POSES[i];
    const b: Pose = SCROLL_POSES[Math.min(i + 1, SCROLL_POSES.length - 1)];

    const span   = b.p - a.p || 1;
    const localT = smoothstep(Math.min(1, Math.max(0, (p - a.p) / span)));

    posA.set(a.pos[0] * fit, a.pos[1] * fit, a.pos[2] * fit);
    posB.set(b.pos[0] * fit, b.pos[1] * fit, b.pos[2] * fit);
    tgtA.set(a.tgt[0] * fit, a.tgt[1] * fit, a.tgt[2] * fit);
    tgtB.set(b.tgt[0] * fit, b.tgt[1] * fit, b.tgt[2] * fit);

    pos.lerpVectors(posA, posB, localT);
    tgt.lerpVectors(tgtA, tgtB, localT);

    // Micro-deriva (vida), proporcional ao fit.
    pos.x += Math.sin(t * CAMERA_IDLE.speedX) * CAMERA_IDLE.amplitude * fit;
    pos.y += Math.sin(t * CAMERA_IDLE.speedY) * CAMERA_IDLE.amplitude * fit;

    camera.position.copy(pos);
    camera.lookAt(tgt);
  });
}
