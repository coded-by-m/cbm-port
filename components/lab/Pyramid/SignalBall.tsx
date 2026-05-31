"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, type Mesh, type MeshBasicMaterial, Vector3 } from "three";
import {
  COLORS,
  NODE_RADIUS,
  SIGNAL_PATH,
  TETRA_VERTICES,
  TIMELINE_STOPS,
} from "./config";
import { STOP_TIMES } from "./usePyramidTimeline";

const signalColor = new Color(COLORS.apex);
const nodeColor = new Color(COLORS.node);

type SignalBallProps = {
  timelineRef: MutableRefObject<gsap.core.Timeline | null>;
};

export default function SignalBall({ timelineRef }: SignalBallProps) {
  const ballRef = useRef<Mesh>(null);
  const markerRefs = [
    useRef<Mesh>(null),
    useRef<Mesh>(null),
    useRef<Mesh>(null),
    useRef<Mesh>(null),
  ];

  const vertices = useMemo(
    () => TETRA_VERTICES.map((v) => new Vector3(...v)),
    [],
  );

  useFrame(() => {
    const ball = ballRef.current;
    const tl = timelineRef.current;
    if (!ball || !tl) return;

    const currentTime = tl.time();

    if (currentTime < STOP_TIMES[0].dwellStart) {
      ball.scale.setScalar(0);
      return;
    }

    ball.scale.setScalar(1);

    let ballPos: Vector3 = vertices[0];
    let currentStopIndex = -1;

    for (let i = 0; i < STOP_TIMES.length; i++) {
      const st = STOP_TIMES[i];

      if (currentTime >= st.dwellStart && currentTime <= st.dwellEnd) {
        ballPos = vertices[TIMELINE_STOPS[i].vertex];
        currentStopIndex = i;
        break;
      }

      if (i < STOP_TIMES.length - 1) {
        const travelStart = st.dwellEnd;
        const travelEnd = STOP_TIMES[i + 1].dwellStart;

        if (currentTime > travelStart && currentTime < travelEnd) {
          const t = (currentTime - travelStart) / (travelEnd - travelStart);
          const eased = t * t * (3 - 2 * t);
          ballPos = new Vector3().lerpVectors(
            vertices[TIMELINE_STOPS[i].vertex],
            vertices[TIMELINE_STOPS[i + 1].vertex],
            eased,
          );
          currentStopIndex = i;
          break;
        }
      }
    }

    if (currentStopIndex === -1 && currentTime > STOP_TIMES[STOP_TIMES.length - 1].dwellEnd) {
      ballPos = vertices[TIMELINE_STOPS[TIMELINE_STOPS.length - 1].vertex];
      currentStopIndex = STOP_TIMES.length - 1;
    }

    ball.position.copy(ballPos);

    for (let i = 0; i < markerRefs.length; i++) {
      const marker = markerRefs[i].current;
      if (!marker) continue;

      const mat = marker.material as MeshBasicMaterial;
      const stopIdx = TIMELINE_STOPS.findIndex((s) => s.vertex === i);
      const visited = stopIdx >= 0 && stopIdx <= currentStopIndex;
      const isActive = TIMELINE_STOPS[currentStopIndex]?.vertex === i;

      if (isActive) {
        mat.color.copy(signalColor);
        mat.opacity = 1;
      } else if (visited) {
        mat.color.lerp(signalColor, 0.06);
        mat.opacity = SIGNAL_PATH.trailOpacity;
      } else {
        mat.color.copy(nodeColor);
        mat.opacity = 0.3;
      }
    }
  });

  return (
    <>
      <mesh ref={ballRef} scale={0}>
        <icosahedronGeometry args={[SIGNAL_PATH.ballRadius, 3]} />
        <meshBasicMaterial color={COLORS.apex} />
      </mesh>

      {TETRA_VERTICES.map((pos, i) => (
        <mesh key={`marker-${i}`} ref={markerRefs[i]} position={pos}>
          <icosahedronGeometry args={[NODE_RADIUS * 1.4, 2]} />
          <meshBasicMaterial color={COLORS.node} transparent opacity={0.3} />
        </mesh>
      ))}
    </>
  );
}
