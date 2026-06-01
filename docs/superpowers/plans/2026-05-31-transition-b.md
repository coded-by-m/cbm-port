# Transition B (Hero → Landscape) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a new lab experiment that validates the seamless transition between Spatial Composition (hero contemplation) and Digital Landscape (scroll-driven exploration) in a single Canvas.

**Architecture:** Single Canvas with scroll-driven phases. Progress 0→0.12 handles hero exit (fog retreat, vignette dissolve, camera blend). Progress 0.12→1.00 is the existing Digital Landscape scroll narrative. All existing components are imported unchanged.

**Tech Stack:** React, Three.js/R3F, GSAP ScrollTrigger, Lenis, Next.js dynamic imports, Tailwind CSS

---

### Task 1: Config — `components/lab/HeroToLandscape/config.ts`

**Files:**
- Create: `components/lab/HeroToLandscape/config.ts`

- [ ] **Step 1: Create the config file**

```ts
export const TRANSITION = {
  heroFadeStart: 0.02,
  heroFadeEnd: 0.12,
  heroRetreatZ: 6,
  vignetteStart: 0.55,
  pulseDelay: 3000,
  pulseHideProgress: 0.02,
} as const;
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | Select-String "HeroToLandscape"`
Expected: no errors

- [ ] **Step 3: Commit**

```
git add components/lab/HeroToLandscape/config.ts
git commit -m "feat(lab): add Transition B config"
```

---

### Task 2: Hero Transition Hook — `components/lab/HeroToLandscape/useHeroTransition.ts`

**Files:**
- Create: `components/lab/HeroToLandscape/useHeroTransition.ts`

This hook reads scroll progress and returns computed values for the hero phase: hero visibility, hero Z offset, hero opacity, vignette opacity, fog near/far.

- [ ] **Step 1: Create the hook**

```ts
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
    heroZ: -5.5,
    heroOpacity: 1,
    vignetteOpacity: TRANSITION.vignetteStart,
  });

  useFrame(() => {
    const p = progress.current;
    const { heroFadeStart, heroFadeEnd, heroRetreatZ, vignetteStart } = TRANSITION;

    const fog = scene.fog as Fog | null;

    if (p <= heroFadeStart) {
      state.current.heroVisible = true;
      state.current.heroZ = -5.5;
      state.current.heroOpacity = 1;
      state.current.vignetteOpacity = vignetteStart;
      if (fog) {
        fog.near = SPATIAL_FOG.near;
        fog.far = SPATIAL_FOG.far;
      }
    } else if (p <= heroFadeEnd) {
      const t = smoothstep((p - heroFadeStart) / (heroFadeEnd - heroFadeStart));
      state.current.heroVisible = true;
      state.current.heroZ = -5.5 - t * heroRetreatZ;
      state.current.heroOpacity = 1 - t;
      state.current.vignetteOpacity = lerp(vignetteStart, 0, t);
      if (fog) {
        fog.near = lerp(SPATIAL_FOG.near, FOG.near, t);
        fog.far = lerp(SPATIAL_FOG.far, FOG.far, t);
      }
    } else {
      state.current.heroVisible = false;
      state.current.heroZ = -5.5 - heroRetreatZ;
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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | Select-String "HeroToLandscape"`
Expected: no errors

- [ ] **Step 3: Commit**

```
git add components/lab/HeroToLandscape/useHeroTransition.ts
git commit -m "feat(lab): add useHeroTransition hook"
```

---

### Task 3: Transition Camera Hook — `components/lab/HeroToLandscape/useTransitionCamera.ts`

**Files:**
- Create: `components/lab/HeroToLandscape/useTransitionCamera.ts`

This hook blends the spatial drift camera (p < 0.02) into the scroll-driven camera (p > 0.12), with smooth interpolation in between.

- [ ] **Step 1: Create the hook**

```ts
"use client";

import { useEffect, useRef } from "react";
import type { MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { FIT_RATIO, LAYERS } from "@/components/lab/TerrainMesh/config";
import { SPATIAL_CAMERA } from "@/components/lab/SpatialComposition/config";
import { SCROLL_POSES, CAMERA_IDLE, type Pose } from "@/components/lab/ScrollCamera/config";
import { TRANSITION } from "./config";

const smoothstep = (t: number) => t * t * (3 - 2 * t);
const fitRadius = Math.max(...LAYERS.map((layer) => layer.sizeX / 2));

const [baseX, baseY, baseZ] = SPATIAL_CAMERA.position;
const [tgtX, tgtY, tgtZ] = SPATIAL_CAMERA.target;

const posA = new Vector3();
const tgtA = new Vector3();
const posB = new Vector3();
const tgtB = new Vector3();
const driftPos = new Vector3();
const driftTgt = new Vector3();
const scrollPos = new Vector3();
const scrollTgt = new Vector3();
const finalPos = new Vector3();
const finalTgt = new Vector3();

function computeScrollCamera(
  p: number,
  t: number,
  fit: number,
  outPos: Vector3,
  outTgt: Vector3,
) {
  let i = SCROLL_POSES.length - 2;
  for (let k = 0; k < SCROLL_POSES.length - 1; k++) {
    if (p >= SCROLL_POSES[k].p) i = k;
  }
  const a: Pose = SCROLL_POSES[i];
  const b: Pose = SCROLL_POSES[Math.min(i + 1, SCROLL_POSES.length - 1)];
  const span = b.p - a.p || 1;
  const localT = smoothstep(Math.min(1, Math.max(0, (p - a.p) / span)));

  posA.set(a.pos[0] * fit, a.pos[1] * fit, a.pos[2] * fit);
  posB.set(b.pos[0] * fit, b.pos[1] * fit, b.pos[2] * fit);
  tgtA.set(a.tgt[0] * fit, a.tgt[1] * fit, a.tgt[2] * fit);
  tgtB.set(b.tgt[0] * fit, b.tgt[1] * fit, b.tgt[2] * fit);

  outPos.lerpVectors(posA, posB, localT);
  outTgt.lerpVectors(tgtA, tgtB, localT);

  outPos.x += Math.sin(t * CAMERA_IDLE.speedX) * CAMERA_IDLE.amplitude * fit;
  outPos.y += Math.sin(t * CAMERA_IDLE.speedY) * CAMERA_IDLE.amplitude * fit;
}

export function useTransitionCamera(progress: MutableRefObject<number>) {
  const camera = useThree((s) => s.camera);
  const viewport = useThree((s) => s.viewport);
  const elapsed = useRef(0);

  useEffect(() => {
    camera.position.set(baseX, baseY, baseZ);
    camera.lookAt(tgtX, tgtY, tgtZ);
  }, [camera]);

  useFrame((_, delta) => {
    elapsed.current += delta;
    const t = elapsed.current;
    const p = progress.current;
    const fit = (Math.max(viewport.width, viewport.height) * FIT_RATIO) / fitRadius;

    const { heroFadeStart, heroFadeEnd } = TRANSITION;

    if (p <= heroFadeStart) {
      // Pure drift (spatial camera)
      camera.position.x =
        baseX + Math.sin(t * SPATIAL_CAMERA.speedX) * SPATIAL_CAMERA.driftX;
      camera.position.y =
        baseY +
        Math.sin(t * SPATIAL_CAMERA.speedY) * SPATIAL_CAMERA.driftY +
        Math.sin(t * SPATIAL_CAMERA.speedY * 0.37) * SPATIAL_CAMERA.driftY * 0.3;
      camera.position.z =
        baseZ + Math.cos(t * SPATIAL_CAMERA.speedZ) * SPATIAL_CAMERA.driftZ;

      camera.lookAt(
        tgtX + Math.sin(t * SPATIAL_CAMERA.targetDriftSpeed) * SPATIAL_CAMERA.targetDriftX,
        tgtY,
        tgtZ,
      );
    } else if (p <= heroFadeEnd) {
      // Blending: drift → scroll
      const blend = smoothstep((p - heroFadeStart) / (heroFadeEnd - heroFadeStart));
      const driftAtten = 1 - blend;

      // Drift side (attenuating)
      driftPos.set(
        baseX + Math.sin(t * SPATIAL_CAMERA.speedX) * SPATIAL_CAMERA.driftX * driftAtten,
        baseY +
          (Math.sin(t * SPATIAL_CAMERA.speedY) * SPATIAL_CAMERA.driftY +
            Math.sin(t * SPATIAL_CAMERA.speedY * 0.37) * SPATIAL_CAMERA.driftY * 0.3) *
            driftAtten,
        baseZ + Math.cos(t * SPATIAL_CAMERA.speedZ) * SPATIAL_CAMERA.driftZ * driftAtten,
      );
      driftTgt.set(
        tgtX + Math.sin(t * SPATIAL_CAMERA.targetDriftSpeed) * SPATIAL_CAMERA.targetDriftX * driftAtten,
        tgtY,
        tgtZ,
      );

      // Scroll side (at progress 0.00 = first pose)
      computeScrollCamera(0, t, fit, scrollPos, scrollTgt);

      // Blend
      finalPos.lerpVectors(driftPos, scrollPos, blend);
      finalTgt.lerpVectors(driftTgt, scrollTgt, blend);

      camera.position.copy(finalPos);
      camera.lookAt(finalTgt);
    } else {
      // Pure scroll (remapped progress)
      const scrollP = (p - heroFadeEnd) / (1 - heroFadeEnd);
      computeScrollCamera(scrollP, t, fit, scrollPos, scrollTgt);
      camera.position.copy(scrollPos);
      camera.lookAt(scrollTgt);
    }
  });
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | Select-String "HeroToLandscape"`
Expected: no errors

- [ ] **Step 3: Commit**

```
git add components/lab/HeroToLandscape/useTransitionCamera.ts
git commit -m "feat(lab): add useTransitionCamera hook with drift→scroll blend"
```

---

### Task 4: Transition Scene — `components/lab/HeroToLandscape/TransitionScene.tsx`

**Files:**
- Create: `components/lab/HeroToLandscape/TransitionScene.tsx`

The R3F scene combining terrain, hero fragment (conditional), and scroll fragments. Wires up the transition camera, hero transition, responsive fit, and scroll narrative hooks.

- [ ] **Step 1: Create the scene component**

```tsx
"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import type { Group } from "three";
import TerrainLayer from "@/components/lab/TerrainMesh/TerrainLayer";
import { useResponsiveFit } from "@/components/lab/TerrainMesh/useResponsiveFit";
import { LAYERS } from "@/components/lab/TerrainMesh/config";
import { HOST_LAYER } from "@/components/lab/ProjectFragments/config";
import type { OverlayStore } from "@/components/lab/HtmlOverlay/useOverlayStore";
import ScrollFragment from "@/components/lab/ScrollCamera/ScrollFragment";
import { useScrollNarrative } from "@/components/lab/ScrollCamera/useScrollNarrative";
import HeroFragment from "@/components/lab/SpatialComposition/HeroFragment";
import { LANDSCAPE_CARDS } from "@/components/lab/DigitalLandscape/config";
import { useTransitionCamera } from "./useTransitionCamera";
import { useHeroTransition, type HeroTransitionState } from "./useHeroTransition";

export default function TransitionScene({
  store,
  progress,
  setActive,
  onHeroState,
}: {
  store: OverlayStore;
  progress: MutableRefObject<number>;
  setActive: (id: string | null) => void;
  onHeroState: MutableRefObject<HeroTransitionState | null>;
}) {
  const fitRef = useRef<Group>(null);
  const fitRadius = useMemo(
    () => Math.max(...LAYERS.map((layer) => layer.sizeX / 2)),
    [],
  );

  useResponsiveFit(fitRef, fitRadius);
  useTransitionCamera(progress);

  const heroState = useHeroTransition(progress);
  onHeroState.current = heroState.current;

  useScrollNarrative(progress, setActive);

  return (
    <group ref={fitRef}>
      {LAYERS.map((layer) => (
        <TerrainLayer key={layer.name} layer={layer} />
      ))}

      {heroState.current.heroVisible && (
        <group position={[-0.8, 1.8, heroState.current.heroZ]}>
          <HeroFragment />
        </group>
      )}

      <group position={[HOST_LAYER.xOffset, HOST_LAYER.yOffset, HOST_LAYER.zOffset]}>
        {LANDSCAPE_CARDS.map((card, index) => (
          <ScrollFragment
            key={card.id}
            card={card}
            store={store}
            progress={progress}
            envelopeIndex={index}
          />
        ))}
      </group>
    </group>
  );
}
```

**Important note:** The `HeroFragment` component renders its own `<group position={[...HERO.position]}>` wrapper internally (see `SpatialComposition/HeroFragment.tsx:93-100`). We need to override its Z position. However, `HeroFragment` already sets `position={[...HERO.position]}` on its own group. To control Z from outside without modifying `HeroFragment`, we wrap it in an outer group and set the outer group's position to the delta. But this would double-offset.

Looking at HeroFragment source: it uses `position={[...HERO.position]}` where `HERO.position = [-0.8, 1.8, -5.5]`. We need Z to change. The cleanest approach: wrap HeroFragment in a group that sets `position={[0, 0, heroState.current.heroZ - (-5.5)]}` — i.e., only the Z delta. Let me fix the code:

Actually, a simpler fix: the outer group positions at `[0, 0, deltaZ]` where `deltaZ = heroState.current.heroZ - (-5.5)`. Since `heroZ` starts at `-5.5` and decreases, `deltaZ` starts at `0` and goes negative. This way HeroFragment's internal position is unchanged.

Let me revise the relevant JSX in the scene:

```tsx
      {heroState.current.heroVisible && (
        <group position={[0, 0, heroState.current.heroZ - (-5.5)]}>
          <HeroFragment />
        </group>
      )}
```

When `heroZ = -5.5`, deltaZ = 0 (no offset). When `heroZ = -11.5`, deltaZ = -6 (retreats 6 units).

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | Select-String "HeroToLandscape"`
Expected: no errors

- [ ] **Step 3: Commit**

```
git add components/lab/HeroToLandscape/TransitionScene.tsx
git commit -m "feat(lab): add TransitionScene combining hero + landscape"
```

---

### Task 5: Wrapper Component — `components/lab/HeroToLandscape/HeroToLandscape.tsx`

**Files:**
- Create: `components/lab/HeroToLandscape/HeroToLandscape.tsx`

The main wrapper: scroll container, Canvas, HTML overlay (Connector + ProjectCard), vignette div, and scroll pulse indicator.

- [ ] **Step 1: Create the wrapper component**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { CAMERA, COLORS } from "@/components/lab/TerrainMesh/config";
import { SPATIAL_FOG } from "@/components/lab/SpatialComposition/config";
import { useOverlayStore } from "@/components/lab/HtmlOverlay/useOverlayStore";
import ProjectCard from "@/components/lab/HtmlOverlay/ProjectCard";
import Connector from "@/components/lab/HtmlOverlay/Connector";
import { useScrollDriver } from "@/components/lab/ScrollCamera/useScrollDriver";
import { SCROLL_LENGTH } from "@/components/lab/ScrollCamera/config";
import { LANDSCAPE_CARDS } from "@/components/lab/DigitalLandscape/config";
import TransitionScene from "./TransitionScene";
import { TRANSITION } from "./config";
import type { HeroTransitionState } from "./useHeroTransition";

export default function HeroToLandscape() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const heroStateRef = useRef<HeroTransitionState | null>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [pulseReady, setPulseReady] = useState(false);

  const {
    store,
    activeId,
    isCompact,
    setActive,
    setCardEl,
    setConnectorLine,
    setConnectorDot,
  } = useOverlayStore();

  useScrollDriver(wrapperRef, contentRef, progress, setStarted);

  const length = isCompact ? SCROLL_LENGTH.compact : SCROLL_LENGTH.desktop;

  // Delay pulse indicator appearance
  useEffect(() => {
    const timer = setTimeout(() => setPulseReady(true), TRANSITION.pulseDelay);
    return () => clearTimeout(timer);
  }, []);

  // Sync vignette + pulse opacity from R3F state via rAF
  useEffect(() => {
    let raf: number;
    const sync = () => {
      const state = heroStateRef.current;
      if (state && vignetteRef.current) {
        vignetteRef.current.style.opacity = String(state.vignetteOpacity);
      }
      if (pulseRef.current) {
        const hide = progress.current >= TRANSITION.pulseHideProgress;
        pulseRef.current.style.opacity = hide ? "0" : "1";
      }
      raf = requestAnimationFrame(sync);
    };
    raf = requestAnimationFrame(sync);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="absolute inset-0 overflow-y-auto overscroll-contain"
    >
      <div ref={contentRef} className="relative w-full" style={{ height: `${length}vh` }}>
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
          <Canvas
            frameloop="always"
            gl={{ antialias: true, alpha: false }}
            dpr={[1, 2]}
            camera={{ position: [...CAMERA.position], fov: CAMERA.fov }}
            style={{ background: COLORS.background }}
          >
            <fog attach="fog" args={[SPATIAL_FOG.color, SPATIAL_FOG.near, SPATIAL_FOG.far]} />
            <TransitionScene
              store={store}
              progress={progress}
              setActive={setActive}
              onHeroState={heroStateRef}
            />
          </Canvas>

          <Connector
            visible={Boolean(activeId) && !isCompact}
            setLine={setConnectorLine}
            setDot={setConnectorDot}
          />

          <ProjectCard
            activeId={activeId}
            isCompact={isCompact}
            setCardEl={setCardEl}
            onClose={() => setActive(null)}
            cards={LANDSCAPE_CARDS}
          />

          {/* Vignette — dissolves during transition */}
          <div
            ref={vignetteRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 70% 60% at 50% 8%, transparent 0%, rgba(0,15,8,1) 100%)`,
              opacity: TRANSITION.vignetteStart,
            }}
          />

          {/* Scroll indicator — geometric pulse */}
          <div
            ref={pulseRef}
            aria-hidden="true"
            className={[
              "pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 transition-opacity duration-500",
              pulseReady ? "opacity-100" : "opacity-0",
            ].join(" ")}
            style={{ opacity: pulseReady && !started ? 1 : 0 }}
          >
            <span
              className="inline-block text-sm text-neutral-500"
              style={{
                animation: "heroToLandscapePulse 2.5s ease-in-out infinite",
              }}
            >
              ▽
            </span>
            <style>{`
              @keyframes heroToLandscapePulse {
                0%, 100% { opacity: 0.4; transform: translateY(0); }
                50% { opacity: 0.7; transform: translateY(4px); }
              }
            `}</style>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | Select-String "HeroToLandscape"`
Expected: no errors

- [ ] **Step 3: Commit**

```
git add components/lab/HeroToLandscape/HeroToLandscape.tsx
git commit -m "feat(lab): add HeroToLandscape wrapper with vignette + pulse"
```

---

### Task 6: Index + Experiment Registry + Lab Page

**Files:**
- Create: `components/lab/HeroToLandscape/index.ts`
- Modify: `lib/experiments.ts`
- Modify: `app/lab/page.tsx`

- [ ] **Step 1: Create the barrel export**

Create `components/lab/HeroToLandscape/index.ts`:

```ts
export { default as HeroToLandscape } from "./HeroToLandscape";
```

- [ ] **Step 2: Add experiment to registry**

In `lib/experiments.ts`, add the following entry after the `spatial-composition` entry (before the `cta-formation` entry):

```ts
  {
    slug: "hero-to-landscape",
    title: "Hero → Landscape",
    description:
      "Transição B: passagem entre contemplação (hero) e exploração (scroll). Hero recua no fog, vignette dissolve, câmera troca de drift para scroll.",
    status: "ready",
  },
```

- [ ] **Step 3: Add dynamic import to lab page**

In `app/lab/page.tsx`, add the following entry to `EXPERIMENT_COMPONENTS` after the `spatial-composition` entry:

```ts
  "hero-to-landscape": dynamic(
    () =>
      import("@/components/lab/HeroToLandscape").then(
        (m) => m.HeroToLandscape,
      ),
    { ssr: false },
  ),
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit --pretty`
Expected: no errors related to HeroToLandscape or experiments

- [ ] **Step 5: Commit**

```
git add components/lab/HeroToLandscape/index.ts lib/experiments.ts app/lab/page.tsx
git commit -m "feat(lab): register Hero → Landscape experiment in lab"
```

---

### Task 7: Fix ScrollFragment Visibility Remapping

**Files:**
- Modify: `components/lab/HeroToLandscape/TransitionScene.tsx`

The `ScrollFragment` uses `VISIBILITY_ENVELOPES` which expect progress 0.00→1.00, but our progress 0.00→0.12 is the hero phase. The fragments should only appear after 0.12. The scroll camera remaps progress via `(p - 0.12) / 0.88`, but `ScrollFragment` reads `progress.current` directly.

We need to pass a remapped progress ref to `ScrollFragment` and `useScrollNarrative` so they see 0.00→1.00 when the real progress is 0.12→1.00.

- [ ] **Step 1: Add remapped progress ref to TransitionScene**

Update `TransitionScene.tsx` to create a remapped progress ref and use it for fragments and narrative:

```tsx
"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import TerrainLayer from "@/components/lab/TerrainMesh/TerrainLayer";
import { useResponsiveFit } from "@/components/lab/TerrainMesh/useResponsiveFit";
import { LAYERS } from "@/components/lab/TerrainMesh/config";
import { HOST_LAYER } from "@/components/lab/ProjectFragments/config";
import type { OverlayStore } from "@/components/lab/HtmlOverlay/useOverlayStore";
import ScrollFragment from "@/components/lab/ScrollCamera/ScrollFragment";
import { useScrollNarrative } from "@/components/lab/ScrollCamera/useScrollNarrative";
import HeroFragment from "@/components/lab/SpatialComposition/HeroFragment";
import { LANDSCAPE_CARDS } from "@/components/lab/DigitalLandscape/config";
import { useTransitionCamera } from "./useTransitionCamera";
import { useHeroTransition, type HeroTransitionState } from "./useHeroTransition";
import { TRANSITION } from "./config";

export default function TransitionScene({
  store,
  progress,
  setActive,
  onHeroState,
}: {
  store: OverlayStore;
  progress: MutableRefObject<number>;
  setActive: (id: string | null) => void;
  onHeroState: MutableRefObject<HeroTransitionState | null>;
}) {
  const fitRef = useRef<Group>(null);
  const fitRadius = useMemo(
    () => Math.max(...LAYERS.map((layer) => layer.sizeX / 2)),
    [],
  );

  // Remapped progress: 0.12→1.00 in real progress maps to 0.00→1.00 for fragments
  const fragmentProgress = useRef(0);
  useFrame(() => {
    const p = progress.current;
    fragmentProgress.current =
      p <= TRANSITION.heroFadeEnd
        ? 0
        : (p - TRANSITION.heroFadeEnd) / (1 - TRANSITION.heroFadeEnd);
  });

  useResponsiveFit(fitRef, fitRadius);
  useTransitionCamera(progress);

  const heroState = useHeroTransition(progress);
  onHeroState.current = heroState.current;

  useScrollNarrative(fragmentProgress, setActive);

  return (
    <group ref={fitRef}>
      {LAYERS.map((layer) => (
        <TerrainLayer key={layer.name} layer={layer} />
      ))}

      {heroState.current.heroVisible && (
        <group position={[0, 0, heroState.current.heroZ - (-5.5)]}>
          <HeroFragment />
        </group>
      )}

      <group position={[HOST_LAYER.xOffset, HOST_LAYER.yOffset, HOST_LAYER.zOffset]}>
        {LANDSCAPE_CARDS.map((card, index) => (
          <ScrollFragment
            key={card.id}
            card={card}
            store={store}
            progress={fragmentProgress}
            envelopeIndex={index}
          />
        ))}
      </group>
    </group>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | Select-String "HeroToLandscape"`
Expected: no errors

- [ ] **Step 3: Commit**

```
git add components/lab/HeroToLandscape/TransitionScene.tsx
git commit -m "fix(lab): remap scroll progress for fragments in Transition B"
```

---

### Task 8: Visual Verification

**Files:** None (testing only)

- [ ] **Step 1: Start dev server**

Run: `npm run dev`

- [ ] **Step 2: Open lab and select "Hero → Landscape"**

Open `http://localhost:3000/lab` in the browser. Click the "Hero → Landscape" button in the experiment selector.

- [ ] **Step 3: Verify hero phase (no scroll)**

Expected:
- Terrain visible with 3 layers breathing
- Hero Fragment visible in the distance, partially in fog
- Vignette (dark edges) visible
- After ~3s, pulse indicator (▽) appears at bottom center, pulsing
- Camera drifts slowly (spatial camera behavior)
- No fragments visible, no cards

- [ ] **Step 4: Verify transition phase (scroll ~first 12%)**

Scroll slowly. Expected:
- Hero Fragment retreats into fog (moves backward in Z)
- Vignette dissolves smoothly (opacity → 0)
- Pulse indicator fades out immediately on first scroll
- Camera smoothly transitions from drift to scroll-driven
- No visible cut, jerk, or snap
- Fog tightens (distant objects fade earlier)

- [ ] **Step 5: Verify landscape phase (scroll past 12%)**

Continue scrolling. Expected:
- Fragment A appears (fade in), card appears when active
- Fragment B appears after A fades
- Fragment C appears after B fades
- Cards show correct content, connector SVG works
- Click card link navigates to case study
- Scroll back reverses everything smoothly

- [ ] **Step 6: Verify mobile behavior**

Resize browser to mobile width (< 640px). Expected:
- Compact layout: cards appear as bottom panel
- Scroll length adjusted (440vh vs 580vh)
- Pulse indicator still visible initially
- Transition still smooth

- [ ] **Step 7: Final commit if any fixes were needed**

```
git add -A
git commit -m "fix(lab): visual adjustments for Transition B"
```
