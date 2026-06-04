"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Text } from "@react-three/drei";
import type { Mesh } from "three";
import { FRAGMENT_LABEL } from "./config";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Numeração técnica do fragmento (01, 02, ...).
 *
 * Texto 3D em Satoshi (fonte do drei Text com fallback default), envolto em
 * Billboard pra sempre encarar a câmera. Opacidade lerp pra suavizar
 * estado normal → ativo.
 */
export default function FragmentLabel({
  index,
  isActive,
  yPosition,
}: {
  index: number;
  isActive: boolean;
  /** Y local onde colocar o label (geralmente apex.y + offset). */
  yPosition: number;
}) {
  const textRef = useRef<Mesh>(null);
  const opacity = useRef<number>(FRAGMENT_LABEL.baseOpacity);

  useFrame((_, delta) => {
    const target = isActive
      ? FRAGMENT_LABEL.activeOpacity
      : FRAGMENT_LABEL.baseOpacity;
    opacity.current = lerp(
      opacity.current,
      target,
      Math.min(1, delta * FRAGMENT_LABEL.lerpSpeed),
    );
    const mesh = textRef.current;
    if (mesh) {
      const mat = mesh.material as { opacity: number };
      if (typeof mat.opacity === "number") mat.opacity = opacity.current;
    }
  });

  const label = `0${index + 1}`;

  return (
    <Billboard position={[0, yPosition, 0]}>
      <Text
        ref={textRef}
        fontSize={FRAGMENT_LABEL.fontSize}
        color={FRAGMENT_LABEL.color}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.18}
        material-transparent
        material-depthWrite={false}
        material-depthTest={false}
      >
        {label}
      </Text>
    </Billboard>
  );
}
