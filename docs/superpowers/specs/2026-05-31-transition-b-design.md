# Transition B — Hero to Landscape

**Date:** 2026-05-31
**Experiment slug:** `hero-to-landscape`
**Question:** A passagem entre contemplação e exploração parece natural?

---

## Scope

Novo experimento no lab que valida a transição entre Spatial Composition (08) e Digital Landscape (07). Canvas único contendo terreno, Hero Fragment, scroll fragments e overlay HTML.

### In scope

- Hero Fragment recua no fog via scroll
- Vignette dissolve gradualmente
- Câmera interpola de drift (contemplativo) para scroll-driven (narrativo)
- Pulso geométrico como scroll indicator
- Fog interpola de profundo (spatial) para apertado (terrain)

### Out of scope

- CTA Formation
- Novos projetos (usa placeholders existentes)
- Novos efeitos visuais
- Novos componentes
- Modificação de experimentos existentes

---

## Architecture

### Files

```
components/lab/HeroToLandscape/
├── HeroToLandscape.tsx      # wrapper (scroll container + Canvas + HTML overlay)
├── TransitionScene.tsx      # cena R3F (terreno + hero + fragments)
├── config.ts                # constantes da transição
├── useTransitionCamera.ts   # câmera que interpola drift ↔ scroll
└── useHeroTransition.ts     # controla fade do Hero + vignette + fog
```

### Imports (nothing modified, everything reused)

| Source | What |
|---|---|
| TerrainMesh | `TerrainLayer`, `LAYERS`, `CAMERA`, `COLORS`, `FIT_RATIO`, `useResponsiveFit` |
| SpatialComposition | `HeroFragment`, `SPATIAL_CAMERA`, `SPATIAL_FOG`, `VIGNETTE` |
| ScrollCamera | `useScrollDriver`, `SCROLL_POSES`, `SCROLL_LENGTH`, `CAMERA_IDLE`, `ScrollFragment` |
| ScrollCamera | `useScrollNarrative` |
| HtmlOverlay | `useOverlayStore`, `ProjectCard`, `Connector` |
| DigitalLandscape | `LANDSCAPE_CARDS` |
| ProjectFragments | `HOST_LAYER` |

---

## Phases

The scroll progress (0→1) divides the experience into three phases:

| Phase | Progress | State |
|---|---|---|
| Hero | p = 0.00 | Contemplation. Hero visible, vignette active, camera drifting, pulse indicator visible |
| Transition | 0.00 < p ≤ 0.12 | Hero retreats into fog, vignette dissolves, camera blends drift→scroll, pulse fades |
| Landscape | p > 0.12 | Digital Landscape. Scroll camera, fragments, overlay. Hero unmounted |

---

## Camera — `useTransitionCamera`

Single hook that blends two behaviors based on progress.

### p < 0.02 — Pure drift

Copy of `useSpatialCamera` logic:

```
position = base + sin(t * speed) * drift
lookAt   = target + sin(t * targetSpeed) * targetDrift
```

Base position: `[0, 3.4, 7.6]` (shared with SCROLL_POSES[0]).

### 0.02 ≤ p ≤ 0.12 — Blending

```
blendFactor = smoothstep((p - 0.02) / 0.10)

driftPosition  = calculated from spatial drift
scrollPosition = SCROLL_POSES[0] position (the wide view)

finalPosition = lerp(driftPosition, scrollPosition, blendFactor)
finalTarget   = lerp(driftTarget, scrollTarget, blendFactor)
```

The drift amplitudes also attenuate: `drift * (1 - blendFactor)`.

### p > 0.12 — Pure scroll

Reuses `useScrollCamera` logic but remaps progress:

```
scrollProgress = (p - 0.12) / 0.88
```

This maps real progress 0.12→1.00 to scroll poses 0.00→1.00.

The transition is imperceptible because both phases share the same base position `[0, 3.4, 7.6]`.

---

## Hero Fragment — `useHeroTransition`

Receives the `progress` ref and returns `{ heroVisible, heroZ, heroOpacity, vignetteOpacity, fogNear, fogFar }`.

### p < 0.02

- Position: original `[-0.8, 1.8, -5.5]`
- Opacity: 1
- Fully visible

### 0.02 ≤ p ≤ 0.12

```
heroProgress = smoothstep((p - 0.02) / 0.10)

position.z = -5.5 - (heroProgress * 6)    // retreats ~6 units into fog
opacity    = 1 - heroProgress              // redundant safety fade
```

The fog does the main work: with far=22, the hero at z=-11.5 is fully engulfed.

### p > 0.12

- `heroVisible = false`
- Hero conditionally unmounted (zero GPU cost)

---

## Vignette

CSS overlay controlled by `useHeroTransition`:

```
vignetteOpacity = p < 0.02 ? 0.55
               : p < 0.12 ? lerp(0.55, 0, heroProgress)
               : 0
```

Applied via `style={{ opacity: vignetteOpacity }}` on the vignette div. When opacity hits 0, the div has `pointer-events: none` and is invisible.

---

## Fog Interpolation

During transition, fog parameters blend from Spatial to Terrain values:

```
fog.near = lerp(5, 6, heroProgress)   // SPATIAL_FOG.near → FOG.near
fog.far  = lerp(22, 17, heroProgress) // SPATIAL_FOG.far  → FOG.far
```

This is necessary because:
- Deep fog (far=22) reveals the Hero partially
- Tight fog (far=17) gives better atmosphere for scroll fragments

---

## Scroll Indicator

A CSS triangle (`▽`) centered at the bottom of the viewport.

### Style
- Color: `neutral-500` (#737373)
- Size: ~12px
- Animation: CSS keyframe pulse (opacity 0.4→0.7, translateY 0→4px, 2.5s infinite)

### Visibility
- p < 0.02: visible (opacity 1)
- p ≥ 0.02: fade out (opacity 0, transition 500ms)
- Appears after ~3s delay (hero contemplation time)

---

## Wrapper — `HeroToLandscape.tsx`

Structure mirrors `DigitalLandscape.tsx`:

```
<div ref={wrapperRef} overflow-y-auto>
  <div ref={contentRef} height={length}vh>
    <div sticky top-0 h-100svh>
      <Canvas>
        <fog />
        <TransitionScene />
      </Canvas>

      <Connector />
      <ProjectCard />

      <!-- Vignette (opacity controlled by heroTransition) -->
      <div vignette />

      <!-- Scroll indicator (pulse, fades on scroll) -->
      <div pulse-indicator />
    </div>
  </div>
</div>
```

---

## TransitionScene — `TransitionScene.tsx`

```
<group ref={fitRef}>
  {LAYERS.map → <TerrainLayer />}

  {heroVisible && <HeroFragment />}   <!-- conditional mount -->

  <group position={HOST_LAYER}>
    {LANDSCAPE_CARDS.map → <ScrollFragment />}
  </group>
</group>
```

Hooks:
- `useResponsiveFit(fitRef, fitRadius)`
- `useTransitionCamera(progress)`
- `useScrollNarrative(progress, setActive)` (only fires when p > 0.12)
- `useHeroTransition(progress)` → returns values for vignette + fog + hero visibility

---

## Config — `config.ts`

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

All other values imported from existing configs.

---

## Experiment Registry

Add to `lib/experiments.ts`:

```ts
{
  slug: "hero-to-landscape",
  title: "Hero → Landscape",
  description: "Transição B: passagem entre contemplação (hero) e exploração (scroll). Hero recua no fog, vignette dissolve, câmera troca de drift para scroll.",
  status: "ready",
}
```

---

## Success Criteria

1. **No visible cut** between hero and landscape phases
2. **Camera blend feels smooth** — no jerk, no snap, no stutter
3. **Hero disappears naturally** — fog engulfs it, not a CSS trick
4. **Vignette dissolves imperceptibly** — user doesn't notice it leaving
5. **Scroll indicator is obvious enough** to prompt action, subtle enough to not distract
6. **Fragments appear exactly as they do in Digital Landscape V1** — no regression
7. **Works on mobile** — compact mode, bottom panel cards, adapted scroll length
