"use client";

import { useEffect, useRef } from "react";
import type { MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { FIT_RATIO, LAYERS } from "@/components/lab/TerrainMesh/config";
import { SPATIAL_CAMERA } from "@/components/lab/SpatialComposition/config";
import { SCROLL_POSES, CAMERA_IDLE, type Pose } from "@/components/lab/ScrollCamera/config";
import { TRANSITION, DRIFT_CAMERA } from "./config";

const smoothstep = (t: number) => t * t * (3 - 2 * t);
const fitRadius = Math.max(...LAYERS.map((layer) => layer.sizeX / 2));

const [baseX, baseY, baseZ] = SPATIAL_CAMERA.position;
const [tgtX, tgtY, tgtZ] = SPATIAL_CAMERA.target;

const _posA = new Vector3();
const _tgtA = new Vector3();
const _posB = new Vector3();
const _tgtB = new Vector3();
const _driftPos = new Vector3();
const _driftTgt = new Vector3();
const _scrollPos = new Vector3();
const _scrollTgt = new Vector3();
const _finalPos = new Vector3();
const _finalTgt = new Vector3();

function computeScrollCamera(
  p: number,
  t: number,
  fit: number,
  outPos: Vector3,
  outTgt: Vector3,
) {
  let i = SCROLL_POSES.length - 2;
  for (let k = 0; k < SCROLL_POSES.length - 1; k++) {
    if (p >= SCROLL_POSES[k].p) i = k;
  }
  const a: Pose = SCROLL_POSES[i];
  const b: Pose = SCROLL_POSES[Math.min(i + 1, SCROLL_POSES.length - 1)];
  const span = b.p - a.p || 1;
  const localT = smoothstep(Math.min(1, Math.max(0, (p - a.p) / span)));

  _posA.set(a.pos[0] * fit, a.pos[1] * fit, a.pos[2] * fit);
  _posB.set(b.pos[0] * fit, b.pos[1] * fit, b.pos[2] * fit);
  _tgtA.set(a.tgt[0] * fit, a.tgt[1] * fit, a.tgt[2] * fit);
  _tgtB.set(b.tgt[0] * fit, b.tgt[1] * fit, b.tgt[2] * fit);

  outPos.lerpVectors(_posA, _posB, localT);
  outTgt.lerpVectors(_tgtA, _tgtB, localT);

  outPos.x += Math.sin(t * CAMERA_IDLE.speedX) * CAMERA_IDLE.amplitude * fit;
  outPos.y += Math.sin(t * CAMERA_IDLE.speedY) * CAMERA_IDLE.amplitude * fit;
}

export function useTransitionCamera(progress: MutableRefObject<number>) {
  const camera = useThree((s) => s.camera);
  const viewport = useThree((s) => s.viewport);
  const elapsed = useRef(0);

  useEffect(() => {
    camera.position.set(baseX, baseY, baseZ);
    camera.lookAt(tgtX, tgtY, tgtZ);
  }, [camera]);

  useFrame((_, delta) => {
    elapsed.current += delta;
    const t = elapsed.current;
    const p = progress.current;
    const fit = (Math.max(viewport.width, viewport.height) * FIT_RATIO) / fitRadius;

    const { heroFadeStart, heroFadeEnd } = TRANSITION;

    if (p <= heroFadeStart) {
      camera.position.x =
        (baseX + Math.sin(t * DRIFT_CAMERA.speedX) * DRIFT_CAMERA.driftX) * fit;
      camera.position.y =
        (baseY +
        Math.sin(t * DRIFT_CAMERA.speedY) * DRIFT_CAMERA.driftY +
        Math.sin(t * DRIFT_CAMERA.speedY * 0.37) * DRIFT_CAMERA.driftY * 0.3) * fit;
      camera.position.z =
        (baseZ + Math.cos(t * DRIFT_CAMERA.speedZ) * DRIFT_CAMERA.driftZ) * fit;

      camera.lookAt(
        (tgtX + Math.sin(t * DRIFT_CAMERA.targetDriftSpeed) * DRIFT_CAMERA.targetDriftX) * fit,
        tgtY * fit,
        tgtZ * fit,
      );
    } else if (p <= heroFadeEnd) {
      const blend = smoothstep((p - heroFadeStart) / (heroFadeEnd - heroFadeStart));
      const driftAtten = 1 - blend;

      _driftPos.set(
        (baseX + Math.sin(t * DRIFT_CAMERA.speedX) * DRIFT_CAMERA.driftX * driftAtten) * fit,
        (baseY +
          (Math.sin(t * DRIFT_CAMERA.speedY) * DRIFT_CAMERA.driftY +
            Math.sin(t * DRIFT_CAMERA.speedY * 0.37) * DRIFT_CAMERA.driftY * 0.3) *
            driftAtten) * fit,
        (baseZ + Math.cos(t * DRIFT_CAMERA.speedZ) * DRIFT_CAMERA.driftZ * driftAtten) * fit,
      );
      _driftTgt.set(
        (tgtX + Math.sin(t * DRIFT_CAMERA.targetDriftSpeed) * DRIFT_CAMERA.targetDriftX * driftAtten) * fit,
        tgtY * fit,
        tgtZ * fit,
      );

      computeScrollCamera(0, t, fit, _scrollPos, _scrollTgt);

      _finalPos.lerpVectors(_driftPos, _scrollPos, blend);
      _finalTgt.lerpVectors(_driftTgt, _scrollTgt, blend);

      camera.position.copy(_finalPos);
      camera.lookAt(_finalTgt);
    } else {
      const scrollP = (p - heroFadeEnd) / (1 - heroFadeEnd);
      computeScrollCamera(scrollP, t, fit, _scrollPos, _scrollTgt);
      camera.position.copy(_scrollPos);
      camera.lookAt(_scrollTgt);
    }
  });
}
