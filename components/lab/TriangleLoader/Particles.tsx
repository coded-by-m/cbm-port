"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Points } from "three";
import { PARTICLE_LAYERS } from "./config";

type Layer = (typeof PARTICLE_LAYERS)[number];

/**
 * Uma camada de partículas em profundidade.
 *
 * Posições aleatórias são geradas uma única vez. A camada gira lentamente
 * em torno de Y, criando um parallax discreto entre planos (cada camada com
 * seu próprio `drift`). Sem `depthWrite` para não ocultar a estrutura.
 */
function ParticleLayer({ layer }: { layer: Layer }) {
  const ref = useRef<Points>(null);

  const positions = useMemo(() => {
    const data = new Float32Array(layer.count * 3);
    const [spreadX, spreadY] = layer.spread;
    const [near, far] = layer.depth;

    for (let i = 0; i < layer.count; i += 1) {
      data[i * 3] = (Math.random() * 2 - 1) * spreadX;
      data[i * 3 + 1] = (Math.random() * 2 - 1) * spreadY;
      data[i * 3 + 2] = near + Math.random() * (far - near);
    }

    return data;
  }, [layer]);

  useFrame((_, delta) => {
    const points = ref.current;
    if (!points) return;
    points.rotation.y += layer.drift * delta;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={layer.color}
        size={layer.size}
        sizeAttenuation
        transparent
        opacity={layer.opacity}
        depthWrite={false}
      />
    </points>
  );
}

/**
 * Profundidade cinematográfica do loader.
 *
 * Renderiza as três camadas (background / midground / foreground) como
 * ambiente — fora dos grupos de fit e rotação, para que não escalem nem
 * girem com o triângulo. Extremamente discreto: a estrutura continua sendo
 * o foco.
 */
export default function Particles() {
  return (
    <group>
      {PARTICLE_LAYERS.map((layer) => (
        <ParticleLayer key={layer.name} layer={layer} />
      ))}
    </group>
  );
}
