"use client";

import { useMemo, useRef, type RefObject } from "react";
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

const COUNT = 36;
const SIZE = 0.06;

const _matrix = new Matrix4();
const _position = new Vector3();
const _quaternion = new Quaternion();
const _scale = new Vector3();

type Particle = {
  direction: Vector3;
  speed: number;
  axis: Vector3;
  spin: number;
  size: number;
  delay: number;
};

function createTriangleGeo(): BufferGeometry {
  const geo = new BufferGeometry();
  const h = SIZE * 0.866;
  const vertices = new Float32Array([
    0, h * 0.667, 0,
    -SIZE * 0.5, -h * 0.333, 0,
    SIZE * 0.5, -h * 0.333, 0,
  ]);
  geo.setAttribute("position", new BufferAttribute(vertices, 3));
  return geo;
}

type Props = {
  scrollProgress: RefObject<number>;
};

export default function ExitParticles({ scrollProgress }: Props) {
  const meshRef = useRef<InstancedMesh>(null);
  const geometry = useMemo(createTriangleGeo, []);

  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: COUNT }, (_, i) => {
        const angle =
          (i / COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
        return {
          direction: new Vector3(
            Math.cos(angle),
            Math.sin(angle),
            (Math.random() - 0.5) * 0.3,
          ).normalize(),
          speed: 2 + Math.random() * 3,
          axis: new Vector3(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5,
          ).normalize(),
          spin: 2 + Math.random() * 6,
          size: 0.5 + Math.random(),
          delay: Math.random() * 0.15,
        };
      }),
    [],
  );

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const p = scrollProgress.current ?? 0;

    particles.forEach((pt, i) => {
      if (p <= 0.01) {
        _matrix.makeScale(0, 0, 0);
      } else {
        const t = Math.max(
          0,
          Math.min(1, (p - pt.delay) / (0.85 - pt.delay)),
        );

        if (t <= 0) {
          _matrix.makeScale(0, 0, 0);
        } else {
          const fadeIn = Math.min(1, t * 4);
          const fadeOut = t > 0.5 ? Math.max(0, 1 - (t - 0.5) / 0.5) : 1;
          const s = pt.size * fadeIn * fadeOut;

          _position.copy(pt.direction).multiplyScalar(t * pt.speed);
          _quaternion.setFromAxisAngle(pt.axis, t * pt.spin * Math.PI * 2);
          _scale.setScalar(s);

          _matrix.compose(_position, _quaternion, _scale);
        }
      }

      mesh.setMatrixAt(i, _matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[geometry, undefined, COUNT]}>
      <meshBasicMaterial
        color="#F5F2ED"
        transparent
        opacity={0.3}
        depthWrite={false}
        side={DoubleSide}
      />
    </instancedMesh>
  );
}
