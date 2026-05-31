"use client";

import { createRef, useMemo, useRef } from "react";
import { Line } from "@react-three/drei";
import type { Group, Mesh } from "three";
import type { Line2 } from "three-stdlib";
import { COLORS, NODE_RADIUS, APEX_RADIUS, LINE_WIDTH, FACE_GRID } from "./config";
import type { BuiltFace } from "./geometry";

type PyramidFaceProps = {
  face: BuiltFace;
  nodeRefs: React.RefObject<Mesh>[];
  edgeRefs: React.RefObject<Line2>[];
};

export default function PyramidFace({ face, nodeRefs, edgeRefs }: PyramidFaceProps) {
  return (
    <group>
      {face.nodes.map((node, i) => {
        const isApex = node.build < 0.01;
        return (
          <mesh
            key={`node-${i}`}
            ref={nodeRefs[i]}
            position={node.position}
            scale={0}
          >
            <icosahedronGeometry args={[isApex ? APEX_RADIUS : NODE_RADIUS, 2]} />
            <meshBasicMaterial
              color={isApex ? COLORS.apex : COLORS.node}
              transparent
              opacity={FACE_GRID.nodeOpacity}
            />
          </mesh>
        );
      })}

      {face.edges.map((edge, i) => (
        <Line
          key={`edge-${i}`}
          ref={edgeRefs[i]}
          points={edge.points}
          color={COLORS.edge}
          lineWidth={LINE_WIDTH}
          transparent
          opacity={0}
          depthTest={false}
          depthWrite={false}
        />
      ))}
    </group>
  );
}
