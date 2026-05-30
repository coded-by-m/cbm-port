"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// Deformable wireframe mesh — lives inside a R3F Canvas
// ---------------------------------------------------------------------------

interface MeshProps {
  isHovered: boolean;
  isPressed: boolean;
}

function DeformableMesh({ isHovered, isPressed }: MeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const depth   = useRef(0);

  // Plane geometry with enough segments for visible deformation
  const { geo, origPositions } = useMemo(() => {
    const SEG_W = 16, SEG_H = 6;
    const g = new THREE.PlaneGeometry(3.6, 1.0, SEG_W, SEG_H);
    // Store original flat positions for reference
    const orig = (g.attributes.position.array as Float32Array).slice();
    return { geo: g, origPositions: orig };
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    const target = isPressed ? -0.22 : isHovered ? -0.12 : 0;
    // Smooth lerp toward target depth
    depth.current = THREE.MathUtils.lerp(
      depth.current,
      target,
      1 - Math.exp(-delta * 7),
    );

    const pos = meshRef.current.geometry.attributes
      .position as THREE.BufferAttribute;

    for (let i = 0; i < pos.count; i++) {
      const ox = origPositions[i * 3];
      const oy = origPositions[i * 3 + 1];
      // Gaussian centered at (0,0), elongated on X for button shape
      const d2 = ox * ox * 0.45 + oy * oy * 2.8;
      pos.setZ(i, depth.current * Math.exp(-d2 * 2.2));
    }
    pos.needsUpdate = true;
    meshRef.current.geometry.computeBoundingSphere();
  });

  const opacity = isPressed ? 0.58 : isHovered ? 0.45 : 0.20;

  return (
    <mesh ref={meshRef} geometry={geo}>
      <meshBasicMaterial
        wireframe
        color="#F5F2ED"
        transparent
        opacity={opacity}
        depthWrite={false}
      />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface Props {
  compact?: boolean;
  state?: "default" | "hover" | "pressed";
  label?: string;
}

export function CinematicMeshR3F({
  compact = false,
  state,
  label = "Iniciar Projeto",
}: Props) {
  const [live, setLive] = useState<"default" | "hover" | "pressed">("default");
  const btnRef = useRef<HTMLButtonElement>(null);

  const displayState = state ?? live;
  const isHovered = displayState === "hover";
  const isPressed = displayState === "pressed";
  const active    = isHovered || isPressed;

  const bgColor = isPressed ? "#C42030" : isHovered ? "#e82d37" : "#FB3640";

  const padH  = compact ? "pl-4"      : "pl-6";
  const padV  = compact ? "py-[10px]" : "py-[14px]";
  const fSize = compact ? "text-[10px]" : "text-[11px]";
  const sepPl = compact ? "pl-3"      : "pl-3.5";
  const arwSz = compact ? "text-[9px]" : "text-[10px]";

  return (
    <button
      ref={btnRef}
      type="button"
      onMouseEnter={() => state === undefined && setLive("hover")}
      onMouseLeave={() => state === undefined && setLive("default")}
      onMouseDown={() => state === undefined && setLive("pressed")}
      onMouseUp={() =>
        state === undefined &&
        setLive(btnRef.current?.matches(":hover") ? "hover" : "default")
      }
      className={`relative inline-flex items-center overflow-hidden font-display font-semibold uppercase tracking-[0.15em] text-cbm-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-cbm-red focus-visible:outline-offset-[3px] ${padH} ${padV} ${fSize}`}
      style={{
        backgroundColor: bgColor,
        transition: "background-color 180ms ease",
      }}
    >
      {/* R3F Canvas — fills button, pointer-events off */}
      <div className="pointer-events-none absolute inset-0">
        <Canvas
          // Camera: elevated to show z-deformation in perspective
          camera={{ position: [0, 0.3, 1.1], fov: 50 }}
          gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
          style={{ background: "transparent" }}
          frameloop={active ? "always" : "demand"}
        >
          <DeformableMesh isHovered={isHovered} isPressed={isPressed} />
        </Canvas>
      </div>

      {/* Label */}
      <span className="relative z-10">{label}</span>

      {/* Structural separator + arrow */}
      <span
        className={`relative z-10 ml-4 flex items-center self-stretch ${sepPl}`}
        style={{ borderLeft: "1px solid rgba(0,0,0,0.24)" }}
      >
        <span className={`${arwSz} leading-none`} aria-hidden="true">▸</span>
      </span>
    </button>
  );
}
