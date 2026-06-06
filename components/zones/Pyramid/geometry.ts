/**
 * Pyramid — geometria procedural.
 *
 * Gera uma treliça triangulada sobre cada face do tetraedro.
 * A grid 2D é gerada plana (mesma lógica do Triangle Lines) e depois
 * projetada no plano 3D da face via coordenadas baricêntricas.
 *
 * Cada nó recebe um valor `build` baseado na distância ao apex,
 * fazendo a estrutura "crescer" de cima para baixo.
 */

import { TETRA_VERTICES, TETRA_FACES, FACE_GRID } from "./config";

type Vec3 = [number, number, number];

/** PRNG determinístico (mulberry32). */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function vec3Add(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function vec3Scale(v: Vec3, s: number): Vec3 {
  return [v[0] * s, v[1] * s, v[2] * s];
}

function vec3Lerp(a: Vec3, b: Vec3, t: number): Vec3 {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

function vec3Length(v: Vec3): number {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
}

function vec3Sub(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

/**
 * Mapeia um ponto em coordenadas baricêntricas (u, v) para a posição 3D
 * sobre a face definida por 3 vértices. u e v variam de 0 a 1, com u+v <= 1.
 */
function barycentricToWorld(
  v0: Vec3,
  v1: Vec3,
  v2: Vec3,
  u: number,
  v: number,
): Vec3 {
  const w = 1 - u - v;
  return [
    w * v0[0] + u * v1[0] + v * v2[0],
    w * v0[1] + u * v1[1] + v * v2[1],
    w * v0[2] + u * v1[2] + v * v2[2],
  ];
}

export interface FaceNode {
  position: Vec3;
  build: number;
}

export interface FaceEdge {
  points: [Vec3, Vec3];
  build: number;
}

export interface BuiltFace {
  faceIndex: number;
  centroid: Vec3;
  nodes: FaceNode[];
  edges: FaceEdge[];
}

/**
 * Gera uma treliça triangulada sobre uma face do tetraedro.
 *
 * A subdivisão cria uma grade triangular dentro do triângulo da face,
 * usando coordenadas baricêntricas para mapear de 2D para 3D.
 */
function subdivideFace(
  faceIndex: number,
  vertexIndices: [number, number, number],
  subdivisions: number,
  jitter: number,
  seed: number,
): BuiltFace {
  const rand = mulberry32(seed);
  const v0 = TETRA_VERTICES[vertexIndices[0]] as Vec3;
  const v1 = TETRA_VERTICES[vertexIndices[1]] as Vec3;
  const v2 = TETRA_VERTICES[vertexIndices[2]] as Vec3;

  const centroid: Vec3 = [
    (v0[0] + v1[0] + v2[0]) / 3,
    (v0[1] + v1[1] + v2[1]) / 3,
    (v0[2] + v1[2] + v2[2]) / 3,
  ];

  const apex = TETRA_VERTICES[0] as Vec3;
  const maxDist = Math.max(
    vec3Length(vec3Sub(v0, apex)),
    vec3Length(vec3Sub(v1, apex)),
    vec3Length(vec3Sub(v2, apex)),
  );

  const nodes: FaceNode[] = [];
  const nodeMap = new Map<string, number>();

  const getKey = (row: number, col: number) => `${row},${col}`;

  for (let row = 0; row <= subdivisions; row++) {
    const rowCols = subdivisions - row;
    for (let col = 0; col <= rowCols; col++) {
      const u = col / subdivisions;
      const v = row / subdivisions;

      if (u + v > 1.001) continue;

      let ju = 0;
      let jv = 0;
      const isVertex = (u === 0 && v === 0) || (u === 1 && v === 0) ||
        (u === 0 && v === 1) || (u + v > 0.999);
      const isEdge = u === 0 || v === 0 || u + v > 0.999 - 0.001;

      if (!isVertex) {
        const jitterScale = isEdge ? jitter * 0.3 : jitter;
        ju = (rand() * 2 - 1) * jitterScale / subdivisions;
        jv = (rand() * 2 - 1) * jitterScale / subdivisions;
        if (u + ju + v + jv > 1) {
          ju *= 0.5;
          jv *= 0.5;
        }
      }

      const position = barycentricToWorld(v0, v1, v2, u + ju, v + jv);
      const distFromApex = vec3Length(vec3Sub(position, apex));
      const build = maxDist > 0 ? distFromApex / maxDist : 0;

      const idx = nodes.length;
      nodeMap.set(getKey(row, col), idx);
      nodes.push({ position, build });
    }
  }

  const edges: FaceEdge[] = [];
  const addEdge = (key1: string, key2: string) => {
    const i1 = nodeMap.get(key1);
    const i2 = nodeMap.get(key2);
    if (i1 !== undefined && i2 !== undefined) {
      edges.push({
        points: [nodes[i1].position, nodes[i2].position],
        build: Math.max(nodes[i1].build, nodes[i2].build),
      });
    }
  };

  for (let row = 0; row <= subdivisions; row++) {
    const rowCols = subdivisions - row;
    for (let col = 0; col <= rowCols; col++) {
      const key = getKey(row, col);
      if (col < rowCols) {
        addEdge(key, getKey(row, col + 1));
      }
      if (row < subdivisions && col <= subdivisions - row - 1) {
        addEdge(key, getKey(row + 1, col));
      }
      if (row < subdivisions && col > 0) {
        addEdge(key, getKey(row + 1, col - 1));
      }
    }
  }

  return { faceIndex, centroid, nodes, edges };
}

export interface PyramidGeometry {
  faces: BuiltFace[];
}

export function buildPyramid(): PyramidGeometry {
  const subdivisions = FACE_GRID.cols;

  const faces = TETRA_FACES.map((vertexIndices, i) =>
    subdivideFace(
      i,
      vertexIndices,
      subdivisions,
      FACE_GRID.jitter,
      7919 + i * 1337,
    ),
  );

  return { faces };
}
