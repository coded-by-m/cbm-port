"use client";

import { useMemo, useRef, useState, type RefObject } from "react";
import { Line, OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { Group, Mesh } from "three";
import { Vector3 } from "three";
import type { Line2 } from "three-stdlib";
import Point from "./Point";
import Particles from "./Particles";
import { useTriangleAnimation } from "./useTriangleAnimation";
import { useOrganicMotion } from "./useOrganicMotion";
import { useResponsiveFit } from "./useResponsiveFit";
import {
  LINE_WIDTH,
  LOGO_POINTS,
  LOGO_ROTATION_PERIOD,
  LOGO_STROKES,
} from "./config";

/** Quanto o logo encolhe no final do exit (1.0 → RECOIL_END). */
const RECOIL_END = 0.6;
/** Velocidade angular (rad/s) — derivada de LOGO_ROTATION_PERIOD. */
const ROTATION_SPEED = (Math.PI * 2) / LOGO_ROTATION_PERIOD;

type TriangleSceneProps = {
  onComplete?: () => void;
  exitProgress?: RefObject<number>;
};

export default function TriangleScene({
  onComplete,
  exitProgress,
}: TriangleSceneProps) {
  const fitRef = useRef<Group>(null);
  const recoilRef = useRef<Group>(null);
  const rotateRef = useRef<Group>(null);
  const [spinning, setSpinning] = useState(false);

  const pointRefs = [
    useRef<Mesh>(null),
    useRef<Mesh>(null),
    useRef<Mesh>(null),
  ];
  const lineRefs = [
    useRef<Line2>(null),
    useRef<Line2>(null),
    useRef<Line2>(null),
  ];

  const strokes = useMemo(
    () =>
      LOGO_STROKES.map((stroke) =>
        stroke.points.map((p) => new Vector3(...p)),
      ),
    [],
  );

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const handleConstructionComplete = useMemo(
    () => () => {
      setSpinning(true);
      onCompleteRef.current?.();
    },
    [],
  );

  useResponsiveFit(fitRef);
  useTriangleAnimation(
    rotateRef,
    pointRefs,
    lineRefs,
    handleConstructionComplete,
  );
  useOrganicMotion(rotateRef);

  // Recuo: durante o EXIT, o logo encolhe ao centro enquanto desvanece.
  // Sem partículas — só uma cortina que diminui de presença.
  // Rotação livre no próprio eixo Y após o build (câmera fica parada).
  useFrame((_, delta) => {
    const recoil = recoilRef.current;
    if (recoil) {
      const p = exitProgress?.current ?? 0;
      recoil.scale.setScalar(1 - p * (1 - RECOIL_END));
    }
    const rotate = rotateRef.current;
    if (rotate && spinning) {
      rotate.rotation.y += ROTATION_SPEED * delta;
    }
  });

  return (
    <>
      <OrbitControls
        autoRotate={false}
        enableRotate={false}
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.05}
      />

      <Particles />

      <group ref={fitRef}>
        <group ref={recoilRef}>
          <group ref={rotateRef}>
          {LOGO_POINTS.map((vertex, index) => (
            <Point
              key={`point-${index}`}
              ref={pointRefs[index]}
              position={vertex}
            />
          ))}

          {strokes.map((points, index) => (
            <Line
              key={`stroke-${index}`}
              ref={lineRefs[index]}
              points={points}
              color={LOGO_STROKES[index].color}
              lineWidth={LINE_WIDTH}
              transparent
              opacity={0}
              dashed
              depthTest={false}
            />
          ))}
          </group>
        </group>
      </group>
    </>
  );
}
