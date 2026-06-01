"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { MutableRefObject } from "react";
import type { Fog } from "three";
import { SPATIAL_FOG } from "@/components/lab/SpatialComposition/config";
import { FOG } from "@/components/lab/TerrainMesh/config";
import { TRANSITION } from "./config";

const smoothstep = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export interface HeroTransitionState {
  heroVisible: boolean;
  heroZ: number;
  heroOpacity: number;
  vignetteOpacity: number;
}

export function useHeroTransition(
  progress: MutableRefObject<number>,
): MutableRefObject<HeroTransitionState> {
  const scene = useThree((s) => s.scene);

  const state = useRef<HeroTransitionState>({
    heroVisible: true,
    heroZ: -3.2,
    heroOpacity: 1,
    vignetteOpacity: TRANSITION.vignetteStart,
  });

  useFrame(() => {
    const p = progress.current;
    const { heroFadeStart, heroFadeEnd, heroRetreatZ, vignetteStart } = TRANSITION;

    const fog = scene.fog as Fog | null;

    if (p <= heroFadeStart) {
      state.current.heroVisible = true;
      state.current.heroZ = -3.2;
      state.current.heroOpacity = 1;
      state.current.vignetteOpacity = vignetteStart;
      if (fog) {
        fog.near = SPATIAL_FOG.near;
        fog.far = SPATIAL_FOG.far;
      }
    } else if (p <= heroFadeEnd) {
      const t = smoothstep((p - heroFadeStart) / (heroFadeEnd - heroFadeStart));
      state.current.heroVisible = true;
      state.current.heroZ = -3.2 - t * heroRetreatZ;
      state.current.heroOpacity = 1 - t;
      state.current.vignetteOpacity = lerp(vignetteStart, 0, t);
      if (fog) {
        fog.near = lerp(SPATIAL_FOG.near, FOG.near, t);
        fog.far = lerp(SPATIAL_FOG.far, FOG.far, t);
      }
    } else {
      state.current.heroVisible = false;
      state.current.heroZ = -3.2 - heroRetreatZ;
      state.current.heroOpacity = 0;
      state.current.vignetteOpacity = 0;
      if (fog) {
        fog.near = FOG.near;
        fog.far = FOG.far;
      }
    }
  });

  return state;
}
