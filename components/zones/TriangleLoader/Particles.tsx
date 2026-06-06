"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  type InstancedMesh,
  Matrix4,
  Quaternion,
  Vector3,
} from "three";
import { PARTICLE_LAYERS } from "./config";

type Layer = (typeof PARTICLE_LAYERS)[number];

const _matrix = new Matrix4();
const _quat = new Quaternion();
const _scale = new Vector3();

/**
 * Triângulo unitário equilátero (altura 0.866). Compartilhado por todas as
 * camadas — cada instância é posicionada/escalada por `setMatrixAt`.
 */
function createUnitTriangleGeo(): BufferGeometry {
  const geo = new BufferGeometry();
  const h = 0.866;
  const v = new Float32Array([
    0, h * 0.667, 0,
    -0.5, -h * 0.333, 0,
    0.5, -h * 0.333, 0,
  ]);
  geo.setAttribute("position", new BufferAttribute(v, 3));
  return geo;
}

/**
 * Uma camada de mini-triângulos em profundidade.
 *
 * Posições e rotações geradas uma única vez. A camada gira lentamente em
 * torno de Y (parallax discreto entre planos). `depthWrite=false` para não
 * ocultar a estrutura do logo.
 *
 * Trianguladas em vez de pontos: amarra o vocabulário visual com
 * ExitParticles e os triângulos do TerrainBackground que vem em seguida.
 */
function ParticleLayer({
  layer,
  geometry,
}: {
  layer: Layer;
  geometry: BufferGeometry;
}) {
  const ref = useRef<InstancedMesh>(null);

  const instances = useMemo(() => {
    const [spreadX, spreadY] = layer.spread;
    const [near, far] = layer.depth;
    return Array.from({ length: layer.count }, () => ({
      pos: new Vector3(
        (Math.random() * 2 - 1) * spreadX,
        (Math.random() * 2 - 1) * spreadY,
        near + Math.random() * (far - near),
      ),
      axis: new Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5,
      ).normalize(),
      rotation: Math.random() * Math.PI * 2,
    }));
  }, [layer]);

  useEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    instances.forEach((inst, i) => {
      _quat.setFromAxisAngle(inst.axis, inst.rotation);
      _scale.setScalar(layer.size);
      _matrix.compose(inst.pos, _quat, _scale);
      mesh.setMatrixAt(i, _matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [instances, layer.size]);

  useFrame((state, delta) => {
    const mesh = ref.current;
    if (!mesh) return;
    mesh.rotation.y += layer.drift * delta;

    // Parallax interativo: a camada segue o cursor (state.pointer ∈ [-1,1]),
    // proporcional ao seu `parallax` (foreground reage mais). Lerp suaviza.
    const tx = state.pointer.x * layer.parallax;
    const ty = state.pointer.y * layer.parallax;
    const k = Math.min(1, delta * 3);
    mesh.position.x += (tx - mesh.position.x) * k;
    mesh.position.y += (ty - mesh.position.y) * k;
  });

  return (
    <instancedMesh ref={ref} args={[geometry, undefined, layer.count]}>
      <meshBasicMaterial
        color={layer.color}
        transparent
        opacity={layer.opacity}
        depthWrite={false}
        side={DoubleSide}
      />
    </instancedMesh>
  );
}

/**
 * Profundidade cinematográfica do loader.
 *
 * Três camadas (background / midground / foreground) renderizadas fora dos
 * grupos de fit e rotação: não escalam nem giram com a logo. Discreto — a
 * estrutura continua sendo o foco; as partículas só estabelecem que esse é
 * um mundo triangulado.
 */
export default function Particles() {
  const geometry = useMemo(createUnitTriangleGeo, []);
  return (
    <group>
      {PARTICLE_LAYERS.map((layer) => (
        <ParticleLayer key={layer.name} layer={layer} geometry={geometry} />
      ))}
    </group>
  );
}
