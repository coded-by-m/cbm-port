# Pyramid Section — Design Spec

**Date:** 2026-05-31
**Status:** Approved
**Scope:** Section 2 of the opening sequence — replaces Triangle Lines

## Overview

A wireframe pyramid (tetrahedron) with triangulated mesh faces, serving as the brand positioning section. Four content points reveal sequentially as the user scrolls, one per face. The pyramid uses the same visual language as Triangle Lines (procedural lattice, off-white wireframe on #000F08, organic motion) with a Signal Red apex.

## Geometry

### Tetrahedron Structure
- 4 vertices: apex at `(0, 1.2, 0)` + 3 equidistant base vertices at Y = -0.4
- Apex node: Signal Red (#FB3640), radius 0.04 (larger than standard 0.028)
- 4 triangular faces, each subdivided into a triangular lattice

### Face Subdivision
- Each face is a flat triangular grid (~4 cols x 3 rows) projected onto the 3D face plane
- Jitter: 0.06 (organic, matching Triangle Lines)
- Reuses `triangularGrid` logic from Triangle Lines geometry.ts, adapted for 3D face projection
- Build order: apex → base (distance from apex, normalized 0→1)

### Visual Properties
- Node color: #F5F2ED (off-white)
- Edge color: #F5F2ED at ~0.5 opacity (structural)
- Edge width: 1.4px (matching Triangle Lines)
- Background: #000F08

## Scroll-Driven Interaction

### Phases (mapped to scroll progress 0→1)
| Progress | Phase |
|----------|-------|
| 0.00–0.15 | Pyramid constructs (apex → base) |
| 0.15–0.35 | Point 1: "Web Design Premium" |
| 0.35–0.55 | Point 2: "Estudio independente · Sao Paulo" |
| 0.55–0.75 | Point 3: "Design e codigo no mesmo lugar" |
| 0.75–0.95 | Point 4: "Ver projetos →" |
| 0.95–1.00 | Fade out → transition to terrain |

### Scroll-Driven Rotation
- Pyramid Y rotation is controlled by scroll progress (not auto-rotate)
- Each point reveal rotates the pyramid ~90° to present the corresponding face
- Total rotation: ~360° across the full scroll range

### Content Overlays
- drei `<Html>` anchored to face centroids (average of 3 face vertices)
- Appear with fade-in + translate-y (bottom-up, 12px)
- Remain visible while scroll is in their range, fade out when leaving
- Typography:
  - Points 1-3: `text-sm font-light tracking-wide text-[#F5F2ED]/80`
  - Point 4 (CTA): same + pulsing `→` arrow

## Component Architecture

```
components/lab/Pyramid/
├── Pyramid.tsx              Canvas wrapper
├── PyramidScene.tsx          Scene: faces, overlays, scroll bindings
├── PyramidFace.tsx           Single subdivided face (nodes + edges)
├── ContentPoint.tsx          drei <Html> overlay
├── geometry.ts               Tetrahedron + face subdivision
├── config.ts                 Vertices, palette, timing, content
├── usePyramidAnimation.ts    Build animation (GSAP)
└── index.ts
```

## Integration with OpeningSequence

- Replaces TriangleLines as section 2
- Receives `scrollProgress` ref from OpeningSequence
- OpeningSequence scroll height increases to ~500vh (logo ~100vh, pyramid ~250vh, terrain transition ~150vh)
- Crossfade transitions between sections (same pattern as logo → pyramid)

## Living Motion
- Breathing: scale oscillation (amplitude 0.01, period 9s)
- Micro-tilt: subtle rotation.x/z oscillation
- Per-face node drift reusing Triangle Lines living motion pattern

## Performance
- ~48 nodes + ~80 edges total — lightweight
- Individual meshes (not instanced) — count is low enough
- `frameloop="demand"` with scroll/GSAP invalidation

## Out of Scope
- Terrain/projects section (separate implementation)
- Mobile-optimized layout (future iteration)
- Animated transition effects to terrain (opacity fade only)
