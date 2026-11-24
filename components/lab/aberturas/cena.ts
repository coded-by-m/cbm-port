import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";

/** O que toda cena WebGL de abertura recebe da moldura (`AberturaCena`). */
export interface CenaProps {
  /** Capas dos projetos em destaque. */
  covers: string[];
  /** Nomes dos mesmos projetos, na mesma ordem. */
  names: string[];
  /** Cor do tipo de cada projeto, na mesma ordem. */
  colors: string[];
  accent: string;
  skip: MutableRefObject<boolean>;
  /** `?t=1.2` congela a cena nesse instante. */
  freeze?: number;
  /** Projeto em foco (índice em `covers`), ou -1 pra nenhum. */
  onCue: (index: number) => void;
  /** Fase da cena, pra moldura acompanhar com o HUD. */
  onPhase?: (phase: string) => void;
  onEnd: () => void;
}

export const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInCubic = (t: number) => t * t * t;
export const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
/** Progresso 0→1 de `t` entre `a` e `b`. */
export const span = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
/** Ruído determinístico em [0, 1) a partir de dois inteiros. */
export const hash = (i: number, k: number) => {
  const s = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

/** Quanto a cena espera pelas capas antes de seguir sem elas. */
const MAX_WAIT_MS = 2000;

/**
 * Carrega as capas como texturas cruas (sem conversão de cor: o shader devolve
 * o sRGB como veio). `ready` vira true quando todas chegam ou a espera estoura.
 */
export function useCovers(srcs: string[]) {
  const [ready, setReady] = useState(false);
  const textures = useMemo(
    () =>
      srcs.map(() => {
        const t = new THREE.Texture();
        t.colorSpace = THREE.NoColorSpace;
        t.minFilter = THREE.LinearFilter;
        t.generateMipmaps = false;
        return t;
      }),
    [srcs],
  );

  useEffect(() => {
    const list = textures;
    let alive = true;
    let left = srcs.length;
    const settle = () => {
      left -= 1;
      if (left <= 0 && alive) setReady(true);
    };
    srcs.forEach((src, i) => {
      const img = new window.Image();
      img.onload = () => {
        list[i].image = img;
        list[i].needsUpdate = true;
        settle();
      };
      img.onerror = settle;
      img.src = src;
    });
    const timer = window.setTimeout(() => alive && setReady(true), MAX_WAIT_MS);
    return () => {
      alive = false;
      window.clearTimeout(timer);
      list.forEach((t) => t.dispose());
    };
  }, [srcs, textures]);

  return { textures, ready };
}

/** Proporção (largura / altura) de uma textura já carregada; 1.6 enquanto não. */
export function aspectOf(t: THREE.Texture) {
  const img = t.image as HTMLImageElement | undefined;
  return img && img.naturalWidth ? img.naturalWidth / img.naturalHeight : 1.6;
}

/**
 * Relógio da cena: só anda com `ready`, obedece `freeze` e `skip`, e avisa o
 * fim uma única vez. Devolve a função que o `useFrame` chama a cada quadro.
 */
export function useCenaClock(
  {
    skip,
    freeze,
    onEnd,
    onCue,
    onPhase,
  }: Pick<CenaProps, "skip" | "freeze" | "onEnd" | "onCue" | "onPhase">,
  end: number,
  ready: boolean,
) {
  const clock = useRef(0);
  const ended = useRef(false);
  const cue = useRef(-2);
  const phase = useRef("");
  const cbs = useRef({ onEnd, onCue, onPhase });
  cbs.current = { onEnd, onCue, onPhase };

  return {
    tick(dt: number) {
      if (ready) clock.current += Math.min(dt, 0.05);
      if (freeze !== undefined) clock.current = freeze;
      if (skip.current) clock.current = Math.max(clock.current, end);
      if (clock.current >= end && !ended.current && freeze === undefined) {
        ended.current = true;
        cbs.current.onEnd();
      }
      return clock.current;
    },
    cue(index: number) {
      if (index === cue.current) return;
      cue.current = index;
      cbs.current.onCue(index);
    },
    phase(name: string) {
      if (name === phase.current) return;
      phase.current = name;
      cbs.current.onPhase?.(name);
    },
  };
}

/** Recorte "cover" ancorado no topo: escala (xy) e deslocamento (zw) do UV. */
export function crop(out: THREE.Vector4, image: number, frame: number) {
  if (image > frame) {
    const sx = frame / image;
    return out.set(sx, 1, (1 - sx) / 2, 0);
  }
  const sy = image / frame;
  return out.set(1, sy, 0, 1 - sy);
}
