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

/** Raio de influência do cursor (unidades de mundo no plano da partícula). */
const REPEL_RADIUS = 1.7;

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
 * Uma camada de mini-triângulos em profundidade, que REAGEM ao cursor: cada
 * triângulo perto do mouse é empurrado pra longe (repulsão com falloff) e volta
 * suave à posição de origem quando o cursor se afasta. Não é parallax global —
 * é interação local, partícula por partícula.
 *
 * O cursor (state.pointer ∈ [-1,1]) é mapeado pro mundo no plano de cada
 * partícula (correção de profundidade via `depthScale`), pra reagir onde ele
 * visualmente está. Cada triângulo também gira devagar no próprio eixo (vivo).
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
    return Array.from({ length: layer.count }, () => {
      const pos = new Vector3(
        (Math.random() * 2 - 1) * spreadX,
        (Math.random() * 2 - 1) * spreadY,
        near + Math.random() * (far - near),
      );
      return {
        home: pos,
        cur: pos.clone(),
        axis: new Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5,
        ).normalize(),
        rotation: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.4,
      };
    });
  }, [layer]);

  // Matriz inicial (posições de origem).
  useEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    instances.forEach((inst, i) => {
      _quat.setFromAxisAngle(inst.axis, inst.rotation);
      _scale.setScalar(layer.size);
      _matrix.compose(inst.home, _quat, _scale);
      mesh.setMatrixAt(i, _matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [instances, layer.size]);

  useFrame((state, delta) => {
    const mesh = ref.current;
    if (!mesh) return;

    const camZ = state.camera.position.z || 6;
    const halfW = state.viewport.width / 2;
    const halfH = state.viewport.height / 2;
    const ease = Math.min(1, delta * 5);

    instances.forEach((inst, i) => {
      // Cursor no plano de profundidade desta partícula.
      const depthScale = (camZ - inst.home.z) / camZ;
      const cwx = state.pointer.x * halfW * depthScale;
      const cwy = state.pointer.y * halfH * depthScale;

      let tx = inst.home.x;
      let ty = inst.home.y;
      const dx = inst.home.x - cwx;
      const dy = inst.home.y - cwy;
      const d = Math.hypot(dx, dy);
      if (d < REPEL_RADIUS && d > 1e-4) {
        const force = (1 - d / REPEL_RADIUS) * layer.repel;
        tx += (dx / d) * force;
        ty += (dy / d) * force;
      }

      inst.cur.x += (tx - inst.cur.x) * ease;
      inst.cur.y += (ty - inst.cur.y) * ease;

      inst.rotation += inst.spin * delta;
      _quat.setFromAxisAngle(inst.axis, inst.rotation);
      _scale.setScalar(layer.size);
      _matrix.compose(inst.cur, _quat, _scale);
      mesh.setMatrixAt(i, _matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
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
 * Campo de partículas trianguladas do loader — três camadas em profundidade
 * (background / midground / foreground) que reagem ao cursor. Estabelece que
 * esse é um mundo triangulado e que ele responde ao usuário.
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
