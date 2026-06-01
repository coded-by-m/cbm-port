"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { SPATIAL_CAMERA } from "./config";

const [baseX, baseY, baseZ] = SPATIAL_CAMERA.position;
const [tgtX, tgtY, tgtZ] = SPATIAL_CAMERA.target;

/**
 * Câmera espacial — deriva lenta e contemplativa.
 *
 * Mais lenta e ampla que a câmera padrão do TerrainMesh. O percurso
 * revela a composição espacial de vários ângulos, com o target
 * deslizando suavemente para guiar o olhar em direção ao hero fragment.
 * Nunca acelera, nunca para — sempre observando.
 */
export function useSpatialCamera() {
  const { camera } = useThree();
  const elapsed = useRef(0);

  useEffect(() => {
    camera.position.set(baseX, baseY, baseZ);
    camera.lookAt(tgtX, tgtY, tgtZ);
  }, [camera]);

  useFrame((_, delta) => {
    elapsed.current += delta;
    const t = elapsed.current;

    camera.position.x =
      baseX + Math.sin(t * SPATIAL_CAMERA.speedX) * SPATIAL_CAMERA.driftX;
    camera.position.y =
      baseY +
      Math.sin(t * SPATIAL_CAMERA.speedY) * SPATIAL_CAMERA.driftY +
      Math.sin(t * SPATIAL_CAMERA.speedY * 0.37) * SPATIAL_CAMERA.driftY * 0.3;
    camera.position.z =
      baseZ + Math.cos(t * SPATIAL_CAMERA.speedZ) * SPATIAL_CAMERA.driftZ;

    camera.lookAt(
      tgtX + Math.sin(t * SPATIAL_CAMERA.targetDriftSpeed) * SPATIAL_CAMERA.targetDriftX,
      tgtY,
      tgtZ,
    );
  });
}
