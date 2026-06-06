"use client";

import { type MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

/**
 * Modo dev de câmera livre.
 *
 * Renderiza `<OrbitControls>` do drei (mouse drag + scroll zoom + right-click
 * pan) e reporta o estado da câmera por frame em `stateRef` — o HUD externo
 * faz poll desse ref pra exibir os valores ao usuário.
 */
export default function DevCameraControls({
  stateRef,
}: {
  stateRef: MutableRefObject<{
    radius: number;
    y: number;
    targetY: number;
    angleDeg: number;
  }>;
}) {
  const camera = useThree((state) => state.camera);

  useFrame(() => {
    const x = camera.position.x;
    const y = camera.position.y;
    const z = camera.position.z;
    const radius = Math.sqrt(x * x + z * z);
    const angleDeg = (Math.atan2(x, z) * 180) / Math.PI;
    stateRef.current = {
      radius,
      y,
      targetY: stateRef.current.targetY,
      angleDeg,
    };
  });

  return (
    <OrbitControls
      makeDefault
      enableDamping
      dampingFactor={0.08}
      enablePan
      enableZoom
      minDistance={3}
      maxDistance={40}
      onChange={(e) => {
        // OrbitControls expõe `.target` no controls. Atualiza targetY ao fazer pan.
        const controls = e?.target as unknown as { target?: { y: number } } | undefined;
        if (controls?.target) {
          stateRef.current = {
            ...stateRef.current,
            targetY: controls.target.y,
          };
        }
      }}
    />
  );
}
