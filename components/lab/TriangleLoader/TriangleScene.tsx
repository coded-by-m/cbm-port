"use client";

import { useMemo, useRef, useState, type RefObject } from "react";
import { Line, OrbitControls } from "@react-three/drei";
import type { Group, Mesh } from "three";
import { Vector3 } from "three";
import type { Line2 } from "three-stdlib";
import Point from "./Point";
import Particles from "./Particles";
import ExitParticles from "./ExitParticles";
import { useTriangleAnimation } from "./useTriangleAnimation";
import { useOrganicMotion } from "./useOrganicMotion";
import { useResponsiveFit } from "./useResponsiveFit";
import { LINE_WIDTH, LOGO_POINTS, LOGO_STROKES, TIMING } from "./config";

type TriangleSceneProps = {
  onComplete?: () => void;
  scrollProgress?: RefObject<number>;
};

export default function TriangleScene({
  onComplete,
  scrollProgress,
}: TriangleSceneProps) {
  const fitRef = useRef<Group>(null);
  const rotateRef = useRef<Group>(null);
  const [autoRotate, setAutoRotate] = useState(false);

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
      setAutoRotate(true);
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

  return (
    <>
      <OrbitControls
        autoRotate={autoRotate}
        autoRotateSpeed={60 / TIMING.rotationDuration}
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.05}
      />

      <Particles />

      {scrollProgress && <ExitParticles scrollProgress={scrollProgress} />}

      <group ref={fitRef}>
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
    </>
  );
}
