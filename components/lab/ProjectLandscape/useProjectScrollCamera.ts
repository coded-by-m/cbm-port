"use client";

import { type MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { CAMERA_KEYFRAMES, type CameraKeyframe } from "./config";

const smoothstep = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

const _posA = new Vector3();
const _posB = new Vector3();
const _tgtA = new Vector3();
const _tgtB = new Vector3();
const _pos = new Vector3();
const _tgt = new Vector3();

/**
 * Câmera dirigida por scroll, com 3 keyframes em arco.
 *
 * Para cada par adjacente de keyframes, interpola posição e target com
 * smoothstep — acelera e desacelera perto de cada fragmento, sensação
 * cinematográfica de "câmera respirando entre projetos."
 */
export function useProjectScrollCamera(
  progress: MutableRefObject<number>,
) {
  const camera = useThree((state) => state.camera);

  useFrame(() => {
    const p = clamp01(progress.current);

    // Encontra o segmento atual (par de keyframes adjacentes).
    let i = CAMERA_KEYFRAMES.length - 2;
    for (let k = 0; k < CAMERA_KEYFRAMES.length - 1; k += 1) {
      if (p >= CAMERA_KEYFRAMES[k].p) i = k;
    }
    const a: CameraKeyframe = CAMERA_KEYFRAMES[i];
    const b: CameraKeyframe =
      CAMERA_KEYFRAMES[Math.min(i + 1, CAMERA_KEYFRAMES.length - 1)];

    const span = b.p - a.p || 1;
    const localT = smoothstep(clamp01((p - a.p) / span));

    _posA.set(a.pos[0], a.pos[1], a.pos[2]);
    _posB.set(b.pos[0], b.pos[1], b.pos[2]);
    _tgtA.set(a.tgt[0], a.tgt[1], a.tgt[2]);
    _tgtB.set(b.tgt[0], b.tgt[1], b.tgt[2]);

    _pos.lerpVectors(_posA, _posB, localT);
    _tgt.lerpVectors(_tgtA, _tgtB, localT);

    camera.position.copy(_pos);
    camera.lookAt(_tgt);
  });
}
