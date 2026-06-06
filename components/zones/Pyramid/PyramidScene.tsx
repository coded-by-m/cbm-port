"use client";

import { createRef, useMemo, useRef, type MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Vector3, type Group, type Mesh } from "three";
import type { Line2 } from "three-stdlib";
import PyramidFace from "./PyramidFace";
import SignalBall from "./SignalBall";
import { usePyramidAnimation } from "./usePyramidAnimation";
import { buildPyramid } from "./geometry";
import {
  CAMERA_LOOK_AT,
  CAMERA_OVERVIEW,
  FIT_RATIO,
  FIT_RADIUS,
  MOTION,
  TIMELINE_STOPS,
} from "./config";
import { STOP_TIMES } from "./usePyramidTimeline";

const TWO_PI = Math.PI * 2;
const lookAtTarget = new Vector3(...CAMERA_LOOK_AT);
const overviewPos = new Vector3(...CAMERA_OVERVIEW);

function sineEase(t: number): number {
  return (1 - Math.cos(t * Math.PI)) / 2;
}

function getCameraPosition(time: number): Vector3 {
  if (time < STOP_TIMES[0].dwellStart) {
    return overviewPos;
  }

  for (let i = 0; i < STOP_TIMES.length; i++) {
    const st = STOP_TIMES[i];

    if (time >= st.dwellStart && time <= st.dwellEnd) {
      return new Vector3(...TIMELINE_STOPS[i].camera);
    }

    if (i < STOP_TIMES.length - 1) {
      const travelStart = st.dwellEnd;
      const travelEnd = STOP_TIMES[i + 1].dwellStart;

      if (time > travelStart && time < travelEnd) {
        const t = (time - travelStart) / (travelEnd - travelStart);
        return new Vector3(...TIMELINE_STOPS[i].camera).lerp(
          new Vector3(...TIMELINE_STOPS[i + 1].camera),
          sineEase(t),
        );
      }
    }
  }

  return new Vector3(...TIMELINE_STOPS[TIMELINE_STOPS.length - 1].camera);
}

type PyramidSceneProps = {
  timelineRef: MutableRefObject<gsap.core.Timeline | null>;
  onOrbitStart?: () => void;
  onOrbitEnd?: () => void;
};

export default function PyramidScene({
  timelineRef,
  onOrbitStart,
  onOrbitEnd,
}: PyramidSceneProps) {
  const fitRef = useRef<Group>(null);
  const elapsed = useRef(0);
  const camera = useThree((s) => s.camera);

  const geometry = useMemo(() => buildPyramid(), []);

  const allNodeRefs = useMemo(
    () => geometry.faces.map((face) => face.nodes.map(() => createRef<Mesh>())),
    [geometry],
  );

  const allEdgeRefs = useMemo(
    () => geometry.faces.map((face) => face.edges.map(() => createRef<Line2>())),
    [geometry],
  );

  usePyramidAnimation(geometry.faces, allNodeRefs, allEdgeRefs);

  useFrame((state, delta) => {
    const fit = fitRef.current;
    if (!fit) return;

    // Responsive fit
    const { width, height } = state.viewport;
    const smallestSide = Math.min(width, height);
    fit.scale.setScalar((smallestSide * FIT_RATIO) / FIT_RADIUS);

    // Camera animation driven by timeline
    const tl = timelineRef.current;
    if (tl) {
      const targetPos = getCameraPosition(tl.time());
      camera.position.lerp(targetPos, 0.04);
      camera.lookAt(lookAtTarget);
    }

    // Organic breathing
    elapsed.current += delta;
    const t = elapsed.current;
    const breath = 1 + Math.sin(t * (TWO_PI / MOTION.breathPeriod)) * MOTION.breathAmplitude;
    fit.scale.multiplyScalar(breath);

    const tilt = t * (TWO_PI / MOTION.tiltPeriod);
    fit.rotation.x = Math.sin(tilt) * MOTION.tiltAmplitude;
    fit.rotation.z = Math.cos(tilt * 0.8) * MOTION.tiltAmplitude * 0.6;
  });

  return (
    <>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.05}
        onStart={() => onOrbitStart?.()}
        onEnd={() => onOrbitEnd?.()}
      />

      <group ref={fitRef}>
        {geometry.faces.map((face, fi) => (
          <PyramidFace
            key={fi}
            face={face}
            nodeRefs={allNodeRefs[fi]}
            edgeRefs={allEdgeRefs[fi]}
          />
        ))}

        <SignalBall timelineRef={timelineRef} />
      </group>
    </>
  );
}
