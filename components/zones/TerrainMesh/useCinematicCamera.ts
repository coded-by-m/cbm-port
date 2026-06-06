"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { CAMERA } from "./config";

const [baseX, baseY, baseZ] = CAMERA.position;
const [targetX, targetY, targetZ] = CAMERA.target;

/**
 * Câmera cinematográfica.
 *
 * Observa o terreno de um ângulo elevado e deriva extremamente devagar em
 * torno da posição base (paralaxe lenta). Como as camadas estão em planos de
 * profundidade diferentes, o leve deslocamento lateral já produz paralaxe
 * entre elas. Sensação de observação — nunca de voo.
 */
export function useCinematicCamera() {
  const { camera } = useThree();
  const elapsed = useRef(0);

  useEffect(() => {
    camera.position.set(baseX, baseY, baseZ);
    camera.lookAt(targetX, targetY, targetZ);
  }, [camera]);

  useFrame((_, delta) => {
    elapsed.current += delta;
    const t = elapsed.current;

    camera.position.x = baseX + Math.sin(t * CAMERA.speedX) * CAMERA.driftX;
    camera.position.y = baseY + Math.sin(t * CAMERA.speedY) * CAMERA.driftY;
    camera.position.z = baseZ + Math.cos(t * CAMERA.speedZ) * CAMERA.driftZ;

    camera.lookAt(
      targetX + Math.sin(t * 0.04) * 0.5,
      targetY,
      targetZ,
    );
  });
}
