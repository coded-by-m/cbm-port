"use client";

import { createRef, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Line, Text } from "@react-three/drei";
import type { Group, Mesh, MeshBasicMaterial } from "three";
import type { Line2 } from "three-stdlib";
import { sampleHeight } from "@/components/zones/TerrainMesh/geometry";
import { buildFragment } from "./geometry";
import { useDiscovery } from "./useDiscovery";
import { useFragmentBuild } from "./useFragmentBuild";
import {
  FRAGMENT,
  FRAGMENT_COLORS,
  FRAGMENT_MOTION,
  HOST_LAYER,
  LABEL,
  type FragmentConfig,
} from "./config";

const TWO_PI = Math.PI * 2;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smoothstep = (t: number) => t * t * (3 - 2 * t);

/**
 * Um fragmento de projeto.
 *
 * Pequena estrutura triangulada que repousa sobre o terreno vivo (acompanha a
 * altura da superfície a cada frame) e emerge na construção. Em repouso é
 * discreto e integrado; ao ser descoberto (hover/toque) ganha contraste,
 * presença e um marcador simples — sem card, sem glow, sem neon.
 */
export default function Fragment({
  config,
  index,
}: {
  config: FragmentConfig;
  index: number;
}) {
  const geom = useMemo(() => buildFragment(config.seed), [config.seed]);
  const { active, handlers } = useDiscovery();
  const reveal = useFragmentBuild(index);

  const groupRef = useRef<Group>(null);
  const labelRef = useRef<Group>(null);
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

  useFrame((_, delta) => {
    elapsed.current += delta;
    const t = elapsed.current;

    // Destaque suave (lerp), sem saltos.
    highlight.current = lerp(
      highlight.current,
      active ? 1 : 0,
      Math.min(1, delta * FRAGMENT.highlightLerp),
    );
    const h = highlight.current;
    const r = reveal.current;

    const surfaceY = sampleHeight(config.x, config.z, t, HOST_LAYER);
    const bob =
      Math.sin(t * (TWO_PI / FRAGMENT_MOTION.bobPeriod) + config.seed) *
      FRAGMENT_MOTION.bobAmplitude;

    const group = groupRef.current;
    if (group) {
      group.position.set(
        config.x,
        surfaceY + FRAGMENT.surfaceLift + bob + FRAGMENT.highlightLift * h,
        config.z,
      );
      group.scale.setScalar((1 + (FRAGMENT.scaleHighlight - 1) * h) * r);
      group.rotation.y = t * (TWO_PI / FRAGMENT_MOTION.yawPeriod);
    }

    const edgeOpacity =
      lerp(
        FRAGMENT_COLORS.edgeNormalOpacity,
        FRAGMENT_COLORS.edgeHighlightOpacity,
        h,
      ) * r;
    lineRefs.forEach((ref) => {
      const line = ref.current;
      if (line) (line.material as { opacity: number }).opacity = edgeOpacity;
    });

    const nodeOpacity =
      lerp(
        FRAGMENT_COLORS.nodeNormalOpacity,
        FRAGMENT_COLORS.nodeHighlightOpacity,
        h,
      ) * r;
    nodeMatRefs.forEach((ref) => {
      if (ref.current) ref.current.opacity = nodeOpacity;
    });

    // Ápice ganha uma ênfase discreta ao destacar (a "ponta" que emerge).
    const apex = nodeMeshRefs[3].current;
    if (apex) apex.scale.setScalar(1 + 0.22 * h);

    // Marcador surge só depois do fragmento já destacado (hierarquia) e de
    // forma sutil — etiqueta técnica, não título.
    if (labelRef.current) {
      const show = smoothstep(
        clamp01((h - LABEL.showThreshold) / (1 - LABEL.showThreshold)),
      );
      labelRef.current.scale.setScalar(show);
    }
  });

  return (
    <group ref={groupRef} position={[config.x, 0, config.z]}>
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

      {/* Marcador simples (texto 3D billboard — não é HTML overlay) */}
      <Billboard
        position={[geom.apex[0], geom.apex[1] + LABEL.offsetY, geom.apex[2]]}
      >
        <group ref={labelRef} scale={0}>
          <Text
            fontSize={LABEL.fontSize}
            color={FRAGMENT_COLORS.label}
            fillOpacity={LABEL.fillOpacity}
            anchorX="center"
            anchorY="middle"
            letterSpacing={LABEL.letterSpacing}
          >
            {config.label}
          </Text>
        </group>
      </Billboard>
    </group>
  );
}
