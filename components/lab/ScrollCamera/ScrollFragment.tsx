"use client";

import { createRef, useMemo, useRef, type MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { Vector3, type Group, type Mesh, type MeshBasicMaterial } from "three";
import type { Line2 } from "three-stdlib";
import { sampleHeight } from "@/components/lab/TerrainMesh/geometry";
import { buildFragment } from "@/components/lab/ProjectFragments/geometry";
import {
  FRAGMENT,
  FRAGMENT_COLORS,
  FRAGMENT_MOTION,
  HOST_LAYER,
} from "@/components/lab/ProjectFragments/config";
import { ACTIVE, OVERLAY } from "@/components/lab/HtmlOverlay/config";
import type { OverlayStore } from "@/components/lab/HtmlOverlay/useOverlayStore";
import type { ProjectCard } from "@/components/lab/HtmlOverlay/config";
import { VISIBILITY_ENVELOPES, type VisibilityEnvelope } from "./config";

const TWO_PI = Math.PI * 2;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, min: number, max: number) =>
  v < min ? min : v > max ? max : v;
const smoothstep01 = (t: number) => t * t * (3 - 2 * t);

const projected = new Vector3();

/**
 * Calcula a presença visual do fragmento (0..1) baseado no progresso do scroll.
 *
 * Fora da janela: dormant (invisível). Entrando: fade suave com smoothstep.
 * Ativo: presença total. Saindo: fade suave. Cada fragmento tem exclusividade.
 */
function computePresence(p: number, env: VisibilityEnvelope): number {
  if (p <= env.fadeInStart) return env.dormant;
  if (p < env.activeFrom) {
    const t = (p - env.fadeInStart) / (env.activeFrom - env.fadeInStart);
    return env.dormant + (1 - env.dormant) * smoothstep01(t);
  }
  if (p <= env.activeTo) return 1;
  if (p < env.fadeOutEnd) {
    const t = (p - env.activeTo) / (env.fadeOutEnd - env.activeTo);
    return 1 - (1 - env.dormant) * smoothstep01(t);
  }
  return env.dormant;
}

/**
 * Fragmento da cena de scroll.
 *
 * A visibilidade é controlada exclusivamente pelo envelope de progresso: o
 * fragmento emerge quando a câmera se aproxima e desaparece quando a câmera
 * segue em frente. Nunca há dois fragmentos com presença plena ao mesmo tempo.
 *
 * Remove a dependência de useFragmentBuild — neste contexto o envelope de
 * scroll é o único mecanismo de aparecimento; a escala parte de 0 com
 * `presence`, emergindo do terreno conforme a câmera avança.
 */
export default function ScrollFragment({
  card,
  store,
  progress,
  envelopeIndex,
}: {
  card: ProjectCard;
  store: OverlayStore;
  progress: MutableRefObject<number>;
  envelopeIndex: number;
}) {
  const geom = useMemo(() => buildFragment(card.seed), [card.seed]);

  const camera = useThree((state) => state.camera);
  const size   = useThree((state) => state.size);

  const groupRef     = useRef<Group>(null);
  const lineRefs     = useMemo(() => geom.edges.map(() => createRef<Line2>()), [geom]);
  const nodeMeshRefs = useMemo(() => geom.nodes.map(() => createRef<Mesh>()), [geom]);
  const nodeMatRefs  = useMemo(
    () => geom.nodes.map(() => createRef<MeshBasicMaterial>()),
    [geom],
  );

  const highlight = useRef(0);
  const elapsed   = useRef(0);

  const envelope = VISIBILITY_ENVELOPES[envelopeIndex] ?? VISIBILITY_ENVELOPES[0];

  useFrame((_, delta) => {
    elapsed.current += delta;
    const t        = elapsed.current;
    const isActive = store.activeId === card.id;

    const presence = computePresence(progress.current, envelope);

    highlight.current = lerp(
      highlight.current,
      isActive ? 1 : 0,
      Math.min(1, delta * FRAGMENT.highlightLerp),
    );
    const h = highlight.current;

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
      // Escala junto com a presença: emerge do terreno ao aproximar.
      group.scale.setScalar((1 + (ACTIVE.scale - 1) * h) * presence);
      group.rotation.y = t * (TWO_PI / FRAGMENT_MOTION.yawPeriod);
    }

    const edgeOpacity =
      lerp(FRAGMENT_COLORS.edgeNormalOpacity, ACTIVE.edgeOpacity, h) * presence;
    lineRefs.forEach((ref) => {
      const line = ref.current;
      if (line) (line.material as { opacity: number }).opacity = edgeOpacity;
    });

    const nodeOpacity =
      lerp(FRAGMENT_COLORS.nodeNormalOpacity, ACTIVE.nodeOpacity, h) * presence;
    nodeMatRefs.forEach((ref) => {
      if (ref.current) ref.current.opacity = nodeOpacity;
    });

    const apex = nodeMeshRefs[3].current;
    if (apex) apex.scale.setScalar(1 + ACTIVE.apexEmphasis * h);

    // Ponte 3D → 2D: ancora o card ao ápice projetado (apenas desktop).
    if (isActive && apex && store.cardEl && !store.isCompact) {
      apex.updateWorldMatrix(true, false);
      apex.getWorldPosition(projected).project(camera);

      const screenX = (projected.x * 0.5 + 0.5) * size.width;
      const screenY = (-projected.y * 0.5 + 0.5) * size.height;

      const el  = store.cardEl;
      const w   = el.offsetWidth;
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
      el.style.top  = `${top}px`;

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
