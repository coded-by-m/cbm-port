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
  FRAGMENT_COLORS,
  FRAGMENT_MOTION,
  HOST_LAYER,
} from "@/components/lab/ProjectFragments/config";
import { ACTIVE, OVERLAY } from "./config";
import type { OverlayStore } from "./useOverlayStore";
import type { ProjectCard } from "./config";

const TWO_PI = Math.PI * 2;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, min: number, max: number) =>
  v < min ? min : v > max ? max : v;

const projected = new Vector3();

/**
 * Fragmento de projeto com a ponte para o HTML.
 *
 * Reaproveita a geometria/visual de Project Fragments (sem alterá-lo). A
 * diferença: o estado ativo é centralizado no `store` (um card por vez) e,
 * quando ativo, o ápice do fragmento é projetado para coordenadas 2D de tela
 * e o card HTML é posicionado imperativamente (ancorado ao fragmento).
 */
export default function OverlayFragment({
  card,
  index,
  store,
  setActive,
}: {
  card: ProjectCard;
  index: number;
  store: OverlayStore;
  setActive: (id: string | null) => void;
}) {
  const geom = useMemo(() => buildFragment(card.seed), [card.seed]);
  const reveal = useFragmentBuild(index);

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
    onPointerOver: (event: { stopPropagation: () => void }) => {
      event.stopPropagation();
      if (!store.isCompact) setActive(card.id);
    },
    onPointerOut: (event: { stopPropagation: () => void }) => {
      event.stopPropagation();
      if (!store.isCompact && store.activeId === card.id) setActive(null);
    },
    onPointerDown: (event: { stopPropagation: () => void }) => {
      event.stopPropagation();
      setActive(store.activeId === card.id ? null : card.id);
    },
  };

  useFrame((_, delta) => {
    elapsed.current += delta;
    const t = elapsed.current;
    const isActive = store.activeId === card.id;

    highlight.current = lerp(
      highlight.current,
      isActive ? 1 : 0,
      Math.min(1, delta * FRAGMENT.highlightLerp),
    );
    const h = highlight.current;
    const r = reveal.current;

    const surfaceY = sampleHeight(card.x, card.z, t, HOST_LAYER);
    const bob =
      Math.sin(t * (TWO_PI / FRAGMENT_MOTION.bobPeriod) + card.seed) *
      FRAGMENT_MOTION.bobAmplitude;

    const group = groupRef.current;
    if (group) {
      group.position.set(
        card.x,
        surfaceY + FRAGMENT.surfaceLift + bob + ACTIVE.lift * h,
        card.z,
      );
      group.scale.setScalar((1 + (ACTIVE.scale - 1) * h) * r);
      group.rotation.y = t * (TWO_PI / FRAGMENT_MOTION.yawPeriod);
    }

    const edgeOpacity =
      lerp(FRAGMENT_COLORS.edgeNormalOpacity, ACTIVE.edgeOpacity, h) * r;
    lineRefs.forEach((ref) => {
      const line = ref.current;
      if (line) (line.material as { opacity: number }).opacity = edgeOpacity;
    });

    const nodeOpacity =
      lerp(FRAGMENT_COLORS.nodeNormalOpacity, ACTIVE.nodeOpacity, h) * r;
    nodeMatRefs.forEach((ref) => {
      if (ref.current) ref.current.opacity = nodeOpacity;
    });

    const apex = nodeMeshRefs[3].current;
    if (apex) apex.scale.setScalar(1 + ACTIVE.apexEmphasis * h);

    // Ponte 3D → 2D: projeta o ápice e ancora o card HTML (apenas desktop).
    if (isActive && apex && store.cardEl && !store.isCompact) {
      apex.updateWorldMatrix(true, false);
      apex.getWorldPosition(projected).project(camera);

      const screenX = (projected.x * 0.5 + 0.5) * size.width;
      const screenY = (-projected.y * 0.5 + 0.5) * size.height;

      const el = store.cardEl;
      const w = el.offsetWidth;
      const hgt = el.offsetHeight;
      const left = clamp(
        screenX + OVERLAY.offsetX,
        OVERLAY.margin,
        size.width - w - OVERLAY.margin,
      );
      const top = clamp(
        screenY - hgt - OVERLAY.offsetY,
        OVERLAY.margin,
        size.height - hgt - OVERLAY.margin,
      );
      el.style.left = `${left}px`;
      el.style.top = `${top}px`;

      // Conector técnico: liga o ápice projetado ao ponto mais próximo do card.
      const { connectorLine: line, connectorDot: dot } = store;
      if (line && dot) {
        const anchorX = clamp(screenX, left, left + w);
        const anchorY = clamp(screenY, top, top + hgt);
        line.setAttribute("x1", `${screenX}`);
        line.setAttribute("y1", `${screenY}`);
        line.setAttribute("x2", `${anchorX}`);
        line.setAttribute("y2", `${anchorY}`);
        dot.setAttribute("cx", `${screenX}`);
        dot.setAttribute("cy", `${screenY}`);
      }
    }
  });

  return (
    <group ref={groupRef} position={[card.x, 0, card.z]}>
      {/* Área de interação invisível (hover/toque) */}
      <mesh position={[0, geom.apex[1] * 0.5, 0]} {...handlers}>
        <sphereGeometry args={[FRAGMENT.baseRadius * 1.7, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {geom.edges.map((points, i) => (
        <Line
          key={`edge-${i}`}
          ref={lineRefs[i]}
          points={points}
          color={FRAGMENT_COLORS.edge}
          lineWidth={1.4}
          transparent
          opacity={0}
          depthWrite={false}
          depthTest={false}
        />
      ))}

      {geom.nodes.map((position, i) => (
        <mesh key={`node-${i}`} ref={nodeMeshRefs[i]} position={position}>
          <icosahedronGeometry args={[FRAGMENT.nodeRadius, 1]} />
          <meshBasicMaterial
            ref={nodeMatRefs[i]}
            color={i === 3 ? FRAGMENT_COLORS.apex : FRAGMENT_COLORS.node}
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
