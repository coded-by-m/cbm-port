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
/**
 * @param enabled `false` quando o terreno é embutido em uma cena que já controla
 *   a câmera (ex.: a Paisagem orbital). Dois controladores escrevendo a câmera
 *   no mesmo frame brigam — o último a rodar vence e o orbital "perde", deixando
 *   o fragmento ativo fora de quadro. Desligado aqui, o orbital é dono único.
 */
export function useCinematicCamera(enabled = true) {
  const { camera } = useThree();
  const elapsed = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    camera.position.set(baseX, baseY, baseZ);
    camera.lookAt(targetX, targetY, targetZ);
  }, [camera, enabled]);

  useFrame((_, delta) => {
    if (!enabled) return;
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
