"use client";

import { useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";

export interface CameraKey {
  /** Posição da câmera. */
  pos: [number, number, number];
  /** Ponto pra onde olha. */
  target: [number, number, number];
  fov: number;
}

/**
 * CameraRig — a câmera única do HomeCanvas, dirigida pelo scroll.
 *
 * Lê `progressRef` (0..1 ao longo da página) e interpola posição/target/fov
 * entre os keyframes de cada capítulo. A lerp por frame (`damp`) amortece o
 * movimento — câmera "manteigosa", nunca jerky, mesmo com scroll cru.
 *
 * Caso especial (futuro): quando Projetos é o capítulo ativo, o rig cede o
 * controle pro drag orbital e retoma a interpolação ao sair.
 */
export function CameraRig({
  keys,
  progressRef,
}: {
  keys: CameraKey[];
  progressRef: RefObject<number>;
}) {
  const camera = useThree((s) => s.camera);
  const curPos = useRef(new Vector3(...keys[0].pos));
  const curTarget = useRef(new Vector3(...keys[0].target));
  const curFov = useRef(keys[0].fov);

  // Buffers reusados (sem alocar por frame).
  const aPos = useRef(new Vector3());
  const bPos = useRef(new Vector3());
  const aTgt = useRef(new Vector3());
  const bTgt = useRef(new Vector3());

  useFrame((_, delta) => {
    const last = keys.length - 1;
    const p = Math.max(0, Math.min(1, progressRef.current ?? 0)) * last;
    const i = Math.min(Math.floor(p), last);
    const j = Math.min(i + 1, last);
    const f = p - i;

    const a = keys[i];
    const b = keys[j];

    // Alvo interpolado entre os dois keyframes adjacentes.
    aPos.current.set(...a.pos);
    bPos.current.set(...b.pos);
    aTgt.current.set(...a.target);
    bTgt.current.set(...b.target);
    const tgtPos = aPos.current.lerp(bPos.current, f);
    const tgtTarget = aTgt.current.lerp(bTgt.current, f);
    const tgtFov = a.fov + (b.fov - a.fov) * f;

    // Amortecimento frame-rate-independente.
    const k = 1 - Math.pow(0.0015, delta);
    curPos.current.lerp(tgtPos, k);
    curTarget.current.lerp(tgtTarget, k);
    curFov.current += (tgtFov - curFov.current) * k;

    camera.position.copy(curPos.current);
    camera.lookAt(curTarget.current);
    if (Math.abs((camera as { fov: number }).fov - curFov.current) > 0.01) {
      (camera as { fov: number }).fov = curFov.current;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
