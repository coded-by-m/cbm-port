"use client";

import { createRef, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { Vector3, type Group, type Mesh, type MeshBasicMaterial } from "three";
import type { Line2 } from "three-stdlib";
import { sampleHeight } from "@/components/lab/TerrainMesh/geometry";
import { buildFragment } from "@/components/lab/ProjectFragments/geometry";
import { useFragmentBuild } from "@/components/lab/ProjectFragments/useFragmentBuild";
import {
  FRAGMENT,
  FRAGMENT_MOTION,
} from "@/components/lab/ProjectFragments/config";
import {
  FRAGMENT_VISUAL,
  HOST_LAYER,
  type FragmentSlot,
} from "./config";

const TWO_PI = Math.PI * 2;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const projected = new Vector3();

/**
 * Um fragmento de projeto na Paisagem Digital.
 *
 * Reaproveita a geometria triangulada de `lab/ProjectFragments`. Acompanha o
 * relevo do terreno (sampleHeight) e bobs/yaws sutilmente. Em hover ganha
 * presença (opacidade/scale) e empurra coordenadas 2D do ápice pro pai —
 * que renderiza o card HTML.
 */
export default function ProjectFragment({
  slot,
  isActive,
  onHover,
  onClick,
  onScreenPosition,
}: {
  slot: FragmentSlot;
  isActive: boolean;
  onHover: (id: string | null) => void;
  onClick: (id: string) => void;
  onScreenPosition: (
    id: string,
    pos: { x: number; y: number; visible: boolean } | null,
  ) => void;
}) {
  const geom = useMemo(() => buildFragment(slot.seed), [slot.seed]);
  // index=0 pra todos: sem stagger entre fragmentos. Eles surgem juntos,
  // garantindo opacidades e escalas uniformes em qualquer instante.
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
    const h = highlight.current;
    const r = reveal.current;

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
        slot.z,
      );
      // slot.scale é o multiplicador de presença (central > laterais).
      // FRAGMENT_VISUAL.highlightScale dá o bump no hover.
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
      ) * r;
    lineRefs.forEach((ref) => {
      const line = ref.current;
      if (line) (line.material as { opacity: number }).opacity = edgeOpacity;
    });

    const nodeOpacity =
      lerp(
        FRAGMENT_VISUAL.nodeNormalOpacity,
        FRAGMENT_VISUAL.nodeHighlightOpacity,
        h,
      ) * r;
    nodeMatRefs.forEach((ref) => {
      if (ref.current) ref.current.opacity = nodeOpacity;
    });

    const apex = nodeMeshRefs[3].current;
    if (apex) apex.scale.setScalar(1 + FRAGMENT_VISUAL.apexHighlightScale * h);

    // Quando o fragmento está ativo, projeta o ápice para coordenadas 2D
    // e reporta pro pai posicionar o card. Quando inativo, manda null.
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
    <group ref={groupRef} position={[slot.x, 0, slot.z]}>
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
          scale={i === 3 ? 1.4 : 1}
        >
          <icosahedronGeometry args={[FRAGMENT.nodeRadius, 1]} />
          <meshBasicMaterial
            ref={nodeMatRefs[i]}
            color={
              i === 3 ? FRAGMENT_VISUAL.apexColor : FRAGMENT_VISUAL.nodeColor
            }
            transparent
            opacity={0}
            depthWrite={false}
            depthTest={false}
          />
        </mesh>
      ))}
    </group>
  );
}
