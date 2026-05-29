"use client";

import { type MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { sampleHeight } from "@/components/lab/TerrainMesh/geometry";
import { CAMERA, FIT_RATIO, LAYERS } from "@/components/lab/TerrainMesh/config";
import {
  FRAGMENT,
  HOST_LAYER,
} from "@/components/lab/ProjectFragments/config";
import { PROJECT_CARDS } from "@/components/lab/HtmlOverlay/config";
import { CAMERA_IDLE, FOCUS_OFFSET, KEYFRAMES, type Keyframe } from "./config";

const smoothstep = (t: number) => t * t * (3 - 2 * t);

const fitRadius = Math.max(...LAYERS.map((layer) => layer.sizeX / 2));

const posA = new Vector3();
const tgtA = new Vector3();
const posB = new Vector3();
const tgtB = new Vector3();
const pos = new Vector3();
const tgt = new Vector3();

/** Pose (posição + alvo) de um keyframe, no espaço de mundo (já com fit). */
function poseOf(
  key: Keyframe["key"],
  fit: number,
  t: number,
  outPos: Vector3,
  outTarget: Vector3,
) {
  if (key === "wide") {
    outPos.set(...CAMERA.position);
    outTarget.set(...CAMERA.target);
    return;
  }

  const card = PROJECT_CARDS[key];
  const y =
    sampleHeight(card.x, card.z, t, HOST_LAYER) +
    FRAGMENT.surfaceLift +
    FRAGMENT.apexHeight * 0.5;

  outTarget.set(
    (HOST_LAYER.xOffset + card.x) * fit,
    (HOST_LAYER.yOffset + y) * fit,
    (HOST_LAYER.zOffset + card.z) * fit,
  );
  outPos.set(
    outTarget.x + FOCUS_OFFSET[0] * fit,
    outTarget.y + FOCUS_OFFSET[1] * fit,
    outTarget.z + FOCUS_OFFSET[2] * fit,
  );
}

/**
 * Câmera dirigida pelo scroll.
 *
 * Interpola, com easing suave, entre os keyframes da trilha narrativa: visão
 * ampla → foco em cada fragmento → retorno. A escala de fit (igual à do
 * terreno) mantém o enquadramento consistente em qualquer viewport. Uma
 * micro-deriva dá vida sem quebrar a sensação observacional.
 */
export function useScrollCamera(progress: MutableRefObject<number>) {
  const camera = useThree((state) => state.camera);
  const viewport = useThree((state) => state.viewport);

  useFrame((state) => {
    const fit = (Math.max(viewport.width, viewport.height) * FIT_RATIO) / fitRadius;
    const p = progress.current;
    const t = state.clock.elapsedTime;

    // Segmento atual da trilha.
    let i = 0;
    for (let k = 0; k < KEYFRAMES.length - 1; k += 1) {
      if (p >= KEYFRAMES[k].p) i = k;
    }
    const a = KEYFRAMES[i];
    const b = KEYFRAMES[Math.min(i + 1, KEYFRAMES.length - 1)];
    const span = b.p - a.p || 1;
    const localT = smoothstep(Math.min(1, Math.max(0, (p - a.p) / span)));

    poseOf(a.key, fit, t, posA, tgtA);
    poseOf(b.key, fit, t, posB, tgtB);
    pos.lerpVectors(posA, posB, localT);
    tgt.lerpVectors(tgtA, tgtB, localT);

    // Micro-deriva (vida), proporcional ao fit.
    pos.x += Math.sin(t * CAMERA_IDLE.speedX) * CAMERA_IDLE.amplitude * fit;
    pos.y += Math.sin(t * CAMERA_IDLE.speedY) * CAMERA_IDLE.amplitude * fit;

    camera.position.copy(pos);
    camera.lookAt(tgt);
  });
}
