import type { CameraKey } from "./CameraRig";

/**
 * Keyframes de câmera por capítulo (9), na ordem da jornada. O CameraRig
 * interpola entre eles conforme o scroll.
 *
 * ATENÇÃO: valores ainda são PLACEHOLDER — variados o bastante pra provar o
 * movimento sobre o terreno. Os alvos definitivos vêm quando cada cena for
 * migrada (cada `<XScene>` vai declarar o seu). Base: câmera do terreno
 * (pos [0,5.2,15], target [0,-0.8,-0.6], fov 42).
 */
export const CHAPTER_CAMERA_KEYS: CameraKey[] = [
  { pos: [0, 7, 20], target: [0, 0, 0], fov: 38 }, // 0 Logo — establishing
  { pos: [0, 5.5, 15], target: [0, -0.5, -1], fov: 42 }, // 1 Manifesto
  { pos: [-4, 4, 12], target: [-1, -0.5, -2], fov: 45 }, // 2 Problema — desce no campo
  { pos: [4, 5, 13], target: [1, -0.5, -1], fov: 44 }, // 3 Serviços
  { pos: [0, 6, 16], target: [0, -0.8, -0.6], fov: 42 }, // 4 Projetos — visão orbital
  { pos: [-6, 3.5, 11], target: [2, -0.5, -2], fov: 48 }, // 5 Processo — pan lateral
  { pos: [3, 5, 14], target: [-1, -0.5, -1], fov: 43 }, // 6 Laboratório
  { pos: [0, 4.5, 13], target: [0, -0.6, -1], fov: 41 }, // 7 Sobre — calmo, centrado
  { pos: [0, 8, 22], target: [0, 0, 0], fov: 36 }, // 8 Convite — recua, clímax
];
