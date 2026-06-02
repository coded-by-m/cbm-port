# Landscape Center Fragment — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace scroll-driven camera landscape with fixed camera + single centered fragment that swaps between projects via wheel/keyboard/dots.

**Architecture:** Fixed `useCinematicCamera` + one `CenterFragment` at terrain center. Wheel/keyboard/dots change `activeIndex`. Fragment fades out, rebuilds geometry with new seed, fades in. Card is CSS-centered HTML. No Lenis, no ScrollTrigger, no 3D→2D projection.

**Tech Stack:** React, Three.js (R3F), GSAP (card transitions only), TypeScript.

---

### Task 1: Create CenterFragment component

**Files:**
- Create: `components/lab/DigitalLandscape/CenterFragment.tsx`

- [ ] **Step 1: Create CenterFragment**

```tsx
"use client";

import { createRef, useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import type { Group, Mesh, MeshBasicMaterial } from "three";
import type { Line2 } from "three-stdlib";
import { sampleHeight } from "@/components/lab/TerrainMesh/geometry";
import { buildFragment } from "@/components/lab/ProjectFragments/geometry";
import {
  FRAGMENT,
  FRAGMENT_COLORS,
  FRAGMENT_MOTION,
  HOST_LAYER,
} from "@/components/lab/ProjectFragments/config";

const TWO_PI = Math.PI * 2;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function CenterFragment({ seed }: { seed: number }) {
  const [currentSeed, setCurrentSeed] = useState(seed);
  const presence = useRef(1);
  const targetPresence = useRef(1);
  const elapsed = useRef(0);
  const groupRef = useRef<Group>(null);

  useEffect(() => {
    if (seed !== currentSeed) {
      targetPresence.current = 0;
      const timer = setTimeout(() => {
        setCurrentSeed(seed);
        targetPresence.current = 1;
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [seed, currentSeed]);

  const geom = useMemo(() => buildFragment(currentSeed), [currentSeed]);
  const lineRefs = useMemo(() => geom.edges.map(() => createRef<Line2>()), [geom]);
  const nodeMeshRefs = useMemo(() => geom.nodes.map(() => createRef<Mesh>()), [geom]);
  const nodeMatRefs = useMemo(
    () => geom.nodes.map(() => createRef<MeshBasicMaterial>()),
    [geom],
  );

  useFrame((_, delta) => {
    elapsed.current += delta;
    const t = elapsed.current;

    presence.current = lerp(
      presence.current,
      targetPresence.current,
      Math.min(1, delta * 6),
    );
    const p = presence.current;

    const surfaceY = sampleHeight(0, 0, t, HOST_LAYER);
    const bob =
      Math.sin(t * (TWO_PI / FRAGMENT_MOTION.bobPeriod)) *
      FRAGMENT_MOTION.bobAmplitude;

    const group = groupRef.current;
    if (group) {
      group.position.set(0, surfaceY + FRAGMENT.surfaceLift + bob, 0);
      group.scale.setScalar(p);
      group.rotation.y = t * (TWO_PI / FRAGMENT_MOTION.yawPeriod);
    }

    const edgeOpacity = FRAGMENT_COLORS.edgeHighlightOpacity * p;
    lineRefs.forEach((ref) => {
      const line = ref.current;
      if (line) (line.material as { opacity: number }).opacity = edgeOpacity;
    });

    const nodeOpacity = FRAGMENT_COLORS.nodeHighlightOpacity * p;
    nodeMatRefs.forEach((ref) => {
      if (ref.current) ref.current.opacity = nodeOpacity;
    });
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {geom.edges.map((points, i) => (
        <Line
          key={`edge-${currentSeed}-${i}`}
          ref={lineRefs[i]}
          points={points}
          color={FRAGMENT_COLORS.edge}
          lineWidth={1.4}
          transparent
          opacity={0}
          depthWrite={false}
          depthTest={false}
        />
      ))}
      {geom.nodes.map((position, i) => (
        <mesh key={`node-${currentSeed}-${i}`} ref={nodeMeshRefs[i]} position={position}>
          <icosahedronGeometry args={[FRAGMENT.nodeRadius, 1]} />
          <meshBasicMaterial
            ref={nodeMatRefs[i]}
            color={i === 3 ? FRAGMENT_COLORS.apex : FRAGMENT_COLORS.node}
            transparent
            opacity={0}
            depthWrite={false}
            depthTest={false}
          />
        </mesh>
      ))}
    </group>
  );
}
```

- [ ] **Step 2: Verify no type errors**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: no output (clean)

- [ ] **Step 3: Commit**

```bash
git add components/lab/DigitalLandscape/CenterFragment.tsx
git commit -m "feat(landscape): add CenterFragment component"
```

---

### Task 2: Create DotsNav component

**Files:**
- Create: `components/lab/DigitalLandscape/DotsNav.tsx`

- [ ] **Step 1: Create DotsNav**

```tsx
"use client";

import { useRef } from "react";
import gsap from "gsap";

export default function DotsNav({
  count,
  activeIndex,
  onGo,
}: {
  count: number;
  activeIndex: number;
  onGo: (index: number) => void;
}) {
  const lineRef = useRef<HTMLDivElement>(null);

  if (lineRef.current) {
    gsap.to(lineRef.current, {
      width: `${((activeIndex + 1) / count) * 100}%`,
      duration: 0.5,
      ease: "power2.inOut",
    });
  }

  return (
    <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 flex flex-col items-center gap-3">
      <div className="h-px w-32 overflow-hidden bg-[#F5F2ED]/10">
        <div
          ref={lineRef}
          className="h-full bg-[#FB3640]/60"
          style={{ width: "0%" }}
        />
      </div>
      <div className="flex gap-3">
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Projeto ${i + 1}`}
            onClick={() => onGo(i)}
            className="h-1.5 w-1.5 rounded-full transition-all duration-300 ease-out"
            style={{
              backgroundColor: activeIndex === i ? "#FB3640" : "#F5F2ED",
              opacity: activeIndex === i ? 1 : 0.25,
              transform: activeIndex === i ? "scale(1.5)" : "scale(1)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/lab/DigitalLandscape/DotsNav.tsx
git commit -m "feat(landscape): add DotsNav component"
```

---

### Task 3: Create CenteredCard component

**Files:**
- Create: `components/lab/DigitalLandscape/CenteredCard.tsx`

- [ ] **Step 1: Create CenteredCard**

This component renders the active project card centered in the viewport with GSAP fade transitions when `activeIndex` changes.

```tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { ProjectCard } from "@/components/lab/HtmlOverlay/config";

export default function CenteredCard({
  activeIndex,
  cards,
}: {
  activeIndex: number;
  cards: ProjectCard[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevIndex = useRef(-1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (prevIndex.current === -1) {
      gsap.fromTo(el, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
    } else {
      gsap.timeline()
        .to(el, { opacity: 0, y: -15, duration: 0.2, ease: "power2.in" })
        .call(() => { prevIndex.current = activeIndex; })
        .set(el, { y: 15 })
        .to(el, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" });
    }
    prevIndex.current = activeIndex;
  }, [activeIndex]);

  const card = cards[activeIndex];
  if (!card) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
      <div
        ref={containerRef}
        className="pointer-events-auto translate-y-[10vh]"
        style={{ opacity: 0 }}
      >
        <article
          className="border border-white/10 bg-[#0a0a0a]/95 rounded-md border-l-2 border-l-white/30 shadow-[0_2px_12px_rgba(0,0,0,0.28)] w-60 p-4"
        >
          <p className="text-[0.55rem] uppercase tracking-[0.32em] text-neutral-500">
            {card.type}
          </p>
          <h3 className="mt-1.5 text-sm font-light tracking-wide text-neutral-100">
            {card.title}
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-neutral-400">
            {card.description}
          </p>
          <a
            href={card.href}
            className="group mt-3 inline-flex items-center gap-1.5 text-[0.7rem] uppercase tracking-[0.2em] text-neutral-300 transition-colors hover:text-neutral-50"
          >
            Ver estudo de caso
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">
              →
            </span>
          </a>
        </article>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/lab/DigitalLandscape/CenteredCard.tsx
git commit -m "feat(landscape): add CenteredCard component"
```

---

### Task 4: Simplify LandscapeScene

**Files:**
- Modify: `components/lab/DigitalLandscape/LandscapeScene.tsx` (full rewrite)

- [ ] **Step 1: Rewrite LandscapeScene**

Replace the scroll-driven scene with fixed camera + single CenterFragment.

```tsx
"use client";

import { useRef } from "react";
import type { Group } from "three";
import TerrainLayer from "@/components/lab/TerrainMesh/TerrainLayer";
import { useCinematicCamera } from "@/components/lab/TerrainMesh/useCinematicCamera";
import { useResponsiveFit } from "@/components/lab/TerrainMesh/useResponsiveFit";
import { FIT_RADIUS, LAYERS } from "@/components/lab/TerrainMesh/config";
import { HOST_LAYER } from "@/components/lab/ProjectFragments/config";
import CenterFragment from "./CenterFragment";
import { LANDSCAPE_CARDS } from "./config";

export default function LandscapeScene({
  activeIndex,
}: {
  activeIndex: number;
}) {
  const fitRef = useRef<Group>(null);

  useResponsiveFit(fitRef, FIT_RADIUS);
  useCinematicCamera();

  const seed = LANDSCAPE_CARDS[activeIndex]?.seed ?? 17;

  return (
    <group ref={fitRef}>
      {LAYERS.map((layer) => (
        <TerrainLayer key={layer.name} layer={layer} />
      ))}
      <group position={[HOST_LAYER.xOffset, HOST_LAYER.yOffset, HOST_LAYER.zOffset]}>
        <CenterFragment seed={seed} />
      </group>
    </group>
  );
}
```

- [ ] **Step 2: Verify no type errors**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: Errors in DigitalLandscape.tsx (expected — we fix that next)

- [ ] **Step 3: Commit**

```bash
git add components/lab/DigitalLandscape/LandscapeScene.tsx
git commit -m "refactor(landscape): simplify LandscapeScene to fixed camera + CenterFragment"
```

---

### Task 5: Rewrite DigitalLandscape container

**Files:**
- Modify: `components/lab/DigitalLandscape/DigitalLandscape.tsx` (full rewrite)

- [ ] **Step 1: Rewrite DigitalLandscape**

Replace scroll-driven container with wheel/keyboard handler + centered components.

```tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { CAMERA, COLORS, FOG } from "@/components/lab/TerrainMesh/config";
import LandscapeScene from "./LandscapeScene";
import CenteredCard from "./CenteredCard";
import DotsNav from "./DotsNav";
import { LANDSCAPE_CARDS } from "./config";

const COOLDOWN = 1200;

export default function DigitalLandscape() {
  const [activeIndex, setActiveIndex] = useState(0);
  const cooldown = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, LANDSCAPE_CARDS.length - 1));
    if (clamped === activeIndex) return;
    setActiveIndex(clamped);
  }, [activeIndex]);

  const next = useCallback(() => {
    if (cooldown.current) return;
    cooldown.current = true;
    setTimeout(() => { cooldown.current = false; }, COOLDOWN);
    goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  const prev = useCallback(() => {
    if (cooldown.current) return;
    cooldown.current = true;
    setTimeout(() => { cooldown.current = false; }, COOLDOWN);
    goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0) next();
      else if (e.deltaY < 0) prev();
    };
    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, [next, prev]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  return (
    <div ref={containerRef} className="absolute inset-0">
      <Canvas
        frameloop="always"
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        camera={{ position: [...CAMERA.position], fov: CAMERA.fov }}
        style={{ background: COLORS.background }}
      >
        <fog attach="fog" args={[FOG.color, FOG.near, FOG.far]} />
        <LandscapeScene activeIndex={activeIndex} />
      </Canvas>

      <CenteredCard activeIndex={activeIndex} cards={LANDSCAPE_CARDS} />
      <DotsNav
        count={LANDSCAPE_CARDS.length}
        activeIndex={activeIndex}
        onGo={goTo}
      />
    </div>
  );
}
```

- [ ] **Step 2: Verify no type errors**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: clean (no output)

- [ ] **Step 3: Commit**

```bash
git add components/lab/DigitalLandscape/DigitalLandscape.tsx
git commit -m "refactor(landscape): rewrite container with fixed camera + wheel/keyboard nav"
```

---

### Task 6: Simplify config — remove scroll-specific exports

**Files:**
- Modify: `components/lab/DigitalLandscape/config.ts`

- [ ] **Step 1: Remove VISIBILITY_ENVELOPES and ACTIVE_RANGES re-exports**

The config currently imports and re-exports `VISIBILITY_ENVELOPES` and `ACTIVE_RANGES` from ScrollCamera. These are no longer used by DigitalLandscape. Simplify the file:

```ts
import type { ProjectCard } from "@/components/lab/HtmlOverlay/config";
import { FRAGMENTS } from "@/components/lab/ProjectFragments/config";

export const LANDSCAPE_CARDS: ProjectCard[] = FRAGMENTS.map((frag) => ({
  id: frag.id,
  title: frag.label.replace("PROJECT ", "Project "),
  type: "Web Design",
  description: "Placeholder — projeto em desenvolvimento.",
  href: "#",
  x: frag.x,
  z: frag.z,
  seed: frag.seed,
}));

const REAL_CONTENT: Partial<ProjectCard>[] = [
  {
    title: "Machado Plataformas",
    type: "Web Design Premium",
    description: "Site institucional premium para empresa de implementos rodoviários.",
    href: "/cases/machado-plataformas",
  },
  {
    title: "Vértice Arquitetura",
    type: "Site Institucional",
    description: "Presença digital para escritório de arquitetura contemporânea.",
    href: "/cases/vertice-arquitetura",
  },
  {
    title: "Nexo Consultoria",
    type: "Landing Page",
    description: "Página de conversão para consultoria empresarial.",
    href: "/cases/nexo-consultoria",
  },
  {
    title: "Onda Digital",
    type: "E-commerce",
    description: "Loja virtual com experiência de navegação premium.",
    href: "/cases/onda-digital",
  },
  {
    title: "Cimento Base",
    type: "Site Institucional",
    description: "Plataforma digital para indústria de materiais.",
    href: "/cases/cimento-base",
  },
  {
    title: "Pulso Saúde",
    type: "Web App",
    description: "Interface para plataforma de saúde digital.",
    href: "/cases/pulso-saude",
  },
  {
    title: "Terra Incorporadora",
    type: "Landing Page",
    description: "Lançamento imobiliário com narrativa visual envolvente.",
    href: "/cases/terra-incorporadora",
  },
  {
    title: "Forja Studio",
    type: "Portfolio",
    description: "Portfólio digital para estúdio de design de produto.",
    href: "/cases/forja-studio",
  },
  {
    title: "Rota Logística",
    type: "Dashboard",
    description: "Painel de controle para operação logística integrada.",
    href: "/cases/rota-logistica",
  },
];

REAL_CONTENT.forEach((content, i) => {
  if (LANDSCAPE_CARDS[i]) {
    Object.assign(LANDSCAPE_CARDS[i], content);
  }
});
```

- [ ] **Step 2: Verify no type errors**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: clean

- [ ] **Step 3: Commit**

```bash
git add components/lab/DigitalLandscape/config.ts
git commit -m "refactor(landscape): simplify config, remove scroll-specific exports"
```

---

### Task 7: Visual test and polish

**Files:**
- Possibly adjust: `components/lab/DigitalLandscape/CenterFragment.tsx`, `CenteredCard.tsx`

- [ ] **Step 1: Start dev server and navigate to Digital Landscape V1**

Run: dev server should already be running at `http://localhost:3000/lab`
Click "Digital Landscape V1" experiment.

- [ ] **Step 2: Verify fragment is centered**

Take screenshot. The fragment tetrahedron should be visible in the center of the viewport. The card should appear below it.

- [ ] **Step 3: Test scroll navigation**

Scroll down — should advance to next project with fade transition. Scroll up — should go back. Verify cooldown prevents rapid-fire.

- [ ] **Step 4: Test keyboard navigation**

Press Arrow Down/Right — advance. Arrow Up/Left — go back.

- [ ] **Step 5: Test dots navigation**

Click different dots — should jump directly to that project with transition.

- [ ] **Step 6: Verify terrain stays visible**

The terrain mesh should remain visible and breathing throughout all transitions. No disappearing.

- [ ] **Step 7: Commit any polish adjustments**

```bash
git add -A
git commit -m "fix(landscape): polish transitions and visual adjustments"
```
