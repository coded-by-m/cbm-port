"use client";

import type { RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import TriangleScene from "./TriangleScene";
import { COLORS } from "./config";

type TriangleLoaderProps = {
  onComplete?: () => void;
  scrollProgress?: RefObject<number>;
};

export default function TriangleLoader({
  onComplete,
  scrollProgress,
}: TriangleLoaderProps) {
  return (
    <div className="absolute inset-0">
      <Canvas
        frameloop="demand"
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 6], fov: 45 }}
        style={{ background: COLORS.background }}
      >
        <TriangleScene
          onComplete={onComplete}
          scrollProgress={scrollProgress}
        />
      </Canvas>
    </div>
  );
}
