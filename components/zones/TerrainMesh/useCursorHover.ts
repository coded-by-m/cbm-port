"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { CURSOR_HOVER } from "./config";

export interface CursorHover {
  /** Posição X no espaço LOCAL do grupo do terreno (após `useResponsiveFit`). */
  x: number;
  /** Posição Z no espaço LOCAL do grupo do terreno. */
  z: number;
  /** True quando o cursor está sobre o canvas; falso ao sair. */
  active: boolean;
}

const _origin = new Vector3();
const _dir = new Vector3();
const _hit = new Vector3();

/**
 * Hook que rastreia o ponto do mundo onde o cursor está, projetado no plano
 * y=0 do terreno, em coordenadas LOCAIS (já dividido pela escala responsiva).
 *
 * Faz raycast cada frame do plano de projeção da câmera até o plano horizontal
 * do terreno. O resultado é interpolado (LERP) pra um efeito de "lift que
 * arrasta levemente atrás do cursor".
 *
 * `scaleRef` precisa apontar pra escala atual do grupo do terreno (a mesma
 * que `useResponsiveFit` aplica em `fitRef.scale`).
 */
export function useCursorHover(
  scaleRef: RefObject<number>,
): RefObject<CursorHover> {
  const { gl, camera } = useThree();
  const current = useRef<CursorHover>({ x: 0, z: 0, active: false });
  const target = useRef<CursorHover>({ x: 0, z: 0, active: false });
  const ndc = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = gl.domElement;

    // Escuta no `window` (não no canvas) porque em cenas como a Philosophy
    // há overlays HTML em cima do canvas que capturam pointermove primeiro.
    // Filtramos manualmente pela bounding box do canvas pra continuar limitando
    // o hover só quando o cursor está dentro da área renderizada.
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        target.current.active = false;
        return;
      }
      ndc.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      ndc.current.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      target.current.active = true;
    };

    const onWindowLeave = () => {
      target.current.active = false;
    };

    window.addEventListener("pointermove", onMove);
    document.addEventListener("mouseleave", onWindowLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseleave", onWindowLeave);
    };
  }, [gl]);

  useFrame((_, delta) => {
    if (target.current.active) {
      _origin.copy(camera.position);
      _dir
        .set(ndc.current.x, ndc.current.y, 0.5)
        .unproject(camera)
        .sub(_origin)
        .normalize();

      if (Math.abs(_dir.y) > 1e-6) {
        const t = -_origin.y / _dir.y;
        if (t > 0) {
          _hit.copy(_dir).multiplyScalar(t).add(_origin);
          const s = scaleRef.current ?? 1;
          target.current.x = _hit.x / s;
          target.current.z = _hit.z / s;
        }
      }
    }

    const k = 1 - Math.pow(1 - CURSOR_HOVER.lerp, delta * 60);
    current.current.x += (target.current.x - current.current.x) * k;
    current.current.z += (target.current.z - current.current.z) * k;
    current.current.active = target.current.active;
  });

  return current;
}
