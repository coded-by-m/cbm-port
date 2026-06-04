"use client";

import { createRef, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import {
  Color,
  Vector3,
  type Group,
  type Mesh,
  type MeshBasicMaterial,
} from "three";
import type { Line2 } from "three-stdlib";
import { sampleHeight } from "@/components/lab/TerrainMesh/geometry";
import { useFragmentBuild } from "@/components/lab/ProjectFragments/useFragmentBuild";
import {
  FRAGMENT,
  FRAGMENT_MOTION,
} from "@/components/lab/ProjectFragments/config";
import { buildTower } from "./towerGeometry";
import FragmentBaseRing from "./FragmentBaseRing";
import FragmentGlow from "./FragmentGlow";
import {
  APEX_INDEX,
  FRAGMENT_VISUAL,
  HOST_LAYER,
  TOWER,
  type FragmentSlot,
} from "./config";

const TWO_PI = Math.PI * 2;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const projected = new Vector3();
const apexColorBase = new Color(FRAGMENT_VISUAL.apexColor);
const offWhite = new Color(FRAGMENT_VISUAL.nodeColor);
const dimColor = new Color(FRAGMENT_VISUAL.dimColor);
const colorScratch = new Color();

export default function ProjectFragment({
  slot,
  isActive,
  anyActive,
  onHover,
  onClick,
  onScreenPosition,
}: {
  slot: FragmentSlot;
  isActive: boolean;
  anyActive: boolean;
  onHover: (id: string | null) => void;
  onClick: (id: string) => void;
  onScreenPosition: (
    id: string,
    pos: { x: number; y: number; visible: boolean } | null,
  ) => void;
}) {
  const geom = useMemo(() => buildTower(slot.seed), [slot.seed]);
  const reveal = useFragmentBuild(0);

  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);

  const groupRef = useRef<Group>(null);
  const lineRefs = useMemo(
    () => geom.edges.map(() => createRef<Line2>()),
    [geom],
  );
  const nodeMeshRefs = useMemo(
    () => geom.nodes.map(() => createRef<Mesh>()),
    [geom],
  );
  const nodeMatRefs = useMemo(
    () => geom.nodes.map(() => createRef<MeshBasicMaterial>()),
    [geom],
  );

  const highlight = useRef(0);
  const dim = useRef(0);
  const elapsed = useRef(0);

  const handlers = {
    onPointerOver: (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      onHover(slot.slug);
      document.body.style.cursor = "pointer";
    },
    onPointerOut: (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      onHover(null);
      document.body.style.cursor = "";
    },
    onPointerDown: (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      onClick(slot.slug);
    },
  };

  useFrame((_, delta) => {
    elapsed.current += delta;
    const t = elapsed.current;

    highlight.current = lerp(
      highlight.current,
      isActive ? 1 : 0,
      Math.min(1, delta * FRAGMENT.highlightLerp),
    );
    dim.current = lerp(
      dim.current,
      anyActive && !isActive ? 1 : 0,
      Math.min(1, delta * FRAGMENT_VISUAL.dimLerpSpeed),
    );
    const h = highlight.current;
    const d = dim.current;
    const r = reveal.current;

    const dimAtten = lerp(1, FRAGMENT_VISUAL.dimMultiplier, d);

    // Cor dos edges/nodes: lerp off-white → terrain mid quando dim.
    colorScratch.copy(offWhite).lerp(dimColor, d);

    const surfaceY = sampleHeight(slot.x, slot.z, t, HOST_LAYER);
    const bob =
      Math.sin(t * (TWO_PI / FRAGMENT_MOTION.bobPeriod) + slot.seed) *
      FRAGMENT_MOTION.bobAmplitude;

    const group = groupRef.current;
    if (group) {
      group.position.set(
        slot.x,
        surfaceY +
          FRAGMENT_VISUAL.surfaceLift +
          bob +
          FRAGMENT_VISUAL.highlightLift * h,
        slot.z + FRAGMENT_VISUAL.activePushZ * h,
      );
      const presence = slot.scale;
      group.scale.setScalar(
        presence * (1 + (FRAGMENT_VISUAL.highlightScale - 1) * h) * r,
      );
      group.rotation.y = t * (TWO_PI / FRAGMENT_MOTION.yawPeriod);
    }

    const edgeOpacity =
      lerp(
        FRAGMENT_VISUAL.edgeNormalOpacity,
        FRAGMENT_VISUAL.edgeHighlightOpacity,
        h,
      ) *
      r *
      dimAtten;
    lineRefs.forEach((ref) => {
      const line = ref.current;
      if (!line) return;
      const mat = line.material as { opacity: number; color: Color };
      mat.opacity = edgeOpacity;
      mat.color.copy(colorScratch);
    });

    const nodeOpacity =
      lerp(
        FRAGMENT_VISUAL.nodeNormalOpacity,
        FRAGMENT_VISUAL.nodeHighlightOpacity,
        h,
      ) *
      r *
      dimAtten;
    nodeMatRefs.forEach((ref, i) => {
      if (!ref.current) return;
      ref.current.opacity = nodeOpacity;
      // Apex: lerp vermelho → off-white quando dim. Outros nós: off-white → terrain mid.
      if (i === APEX_INDEX) {
        ref.current.color.copy(apexColorBase).lerp(offWhite, d);
      } else {
        ref.current.color.copy(colorScratch);
      }
    });

    const apex = nodeMeshRefs[APEX_INDEX].current;
    if (apex) apex.scale.setScalar(1 + FRAGMENT_VISUAL.apexHighlightScale * h);

    if (isActive && apex) {
      apex.updateWorldMatrix(true, false);
      apex.getWorldPosition(projected).project(camera);
      const visible =
        projected.z < 1 &&
        projected.x > -1.2 &&
        projected.x < 1.2 &&
        projected.y > -1.2 &&
        projected.y < 1.2;
      onScreenPosition(slot.slug, {
        x: (projected.x * 0.5 + 0.5) * size.width,
        y: (-projected.y * 0.5 + 0.5) * size.height,
        visible,
      });
    } else if (highlight.current < 0.02) {
      onScreenPosition(slot.slug, null);
    }
  });

  return (
    <>
      <FragmentBaseRing slot={slot} isActive={isActive} />
      <group ref={groupRef} position={[slot.x, 0, slot.z]}>
        {/* Glow filho do group pra acompanhar position/scale do fragmento. */}
        <FragmentGlow isActive={isActive} size={TOWER.apexHeight} />

        {/* Área de interação invisível. */}
        <mesh position={[0, geom.apex[1] * 0.5, 0]} {...handlers}>
          <sphereGeometry args={[FRAGMENT.baseRadius * 1.7, 8, 8]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        {geom.edges.map((points, i) => (
          <Line
            key={`edge-${i}`}
            ref={lineRefs[i]}
            points={points}
            color={FRAGMENT_VISUAL.edgeColor}
            lineWidth={FRAGMENT_VISUAL.edgeWidth}
            transparent
            opacity={0}
            depthWrite={false}
            depthTest={false}
          />
        ))}

        {geom.nodes.map((position, i) => (
          <mesh
            key={`node-${i}`}
            ref={nodeMeshRefs[i]}
            position={position}
            scale={i === APEX_INDEX ? 1.4 : 1}
          >
            <icosahedronGeometry args={[FRAGMENT.nodeRadius, 1]} />
            <meshBasicMaterial
              ref={nodeMatRefs[i]}
              color={
                i === APEX_INDEX
                  ? FRAGMENT_VISUAL.apexColor
                  : FRAGMENT_VISUAL.nodeColor
              }
              transparent
              opacity={0}
              depthWrite={false}
              depthTest={false}
            />
          </mesh>
        ))}
      </group>
    </>
  );
}
