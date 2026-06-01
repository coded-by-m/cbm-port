# Pyramid V2 — Design Spec

**Date:** 2026-05-31
**Status:** Approved
**Scope:** Redesign of pyramid section — auto-timeline, split layout, camera movements

## Overview

Replaces the scroll-driven pyramid with an automatic GSAP timeline. The pyramid occupies the left 60% of the viewport (3D canvas), while philosophy-driven content cards appear on the right 40% (HTML). The camera moves between vertices as the signal ball travels, creating a cinematic presentation. No scroll — the section is a fixed 100vh stage.

## Layout

```
┌─────────────────────────────────────────────────────┐
│  ┌──────────────────────┐   ┌────────────────────┐  │
│  │                      │   │ | 01 | PRINCÍPIO   │  │
│  │   Pirâmide 3D        │   │                    │  │
│  │   (Canvas R3F)        │   │  Construção        │  │
│  │   60% viewport        │   │                    │  │
│  │                      │   │  Acreditamos que   │  │
│  │   câmera move         │   │  toda grande...    │  │
│  │   entre vértices      │   │                    │  │
│  └──────────────────────┘   └────────────────────┘  │
│                              ● ● ● ●  (dots)       │
└─────────────────────────────────────────────────────┘
```

- **Left (60%):** R3F Canvas. Pyramid geometry, signal ball, camera animation. No text inside canvas.
- **Right (40%):** HTML cards outside canvas. Fade + slide-x transitions.
- **Dots:** Centered bottom, horizontal. Indicate active principle. Clickable to jump.
- **Fixed 100vh:** No scroll in this section.

## Timeline

```
0.0s    Pyramid constructs (apex → base, ~2.5s)
2.5s    Camera pulls back to overview (~1s)
3.5s    ── Stop 0: Apex ──
        Ball appears at apex
        Camera dollies to frame top
        Card 01 enters (fade + slide-x)
        Dwell: 4s
7.5s    Ball travels apex → base 1 (~1.2s)
        Camera moves to vertex 1 angle
8.7s    ── Stop 1: Base 1 ──
        Card 02 enters, card 01 exits
        Dwell: 4s
12.7s   Ball travels base 1 → base 2 (~1.2s)
        Camera moves to vertex 2 angle
13.9s   ── Stop 2: Base 2 ──
        Card 03 enters
        Dwell: 4s
17.9s   Ball travels base 2 → base 3 (~1.2s)
        Camera moves to vertex 3 angle
19.1s   ── Stop 3: Base 3 ──
        Card 04 (CTA) enters
        Dwell: 5s
24.1s   End — awaits interaction or transition
```

Total: ~24s.

## Camera Positions

| Stop | Position | Description |
|------|----------|-------------|
| Overview | `[0, 0.3, 4.5]` | Full pyramid visible |
| Apex | `[0.5, 1.5, 3.5]` | Camera rises, approaches top |
| Base 1 | `[-1.5, 0, 3.5]` | Camera descends, orbits left |
| Base 2 | `[1.5, -0.2, 3.5]` | Camera orbits right |
| Base 3 | `[0, -0.5, 4.0]` | Camera descends, returns center |

- All transitions: `power2.inOut`, ~1.2s duration
- LookAt: always targets pyramid center `[0, 0.3, 0]`

## Content Cards (Placeholders)

```
| 01 | PRINCÍPIO
Construção
Acreditamos que toda grande presença digital
começa com uma estrutura sólida.

| 02 | PRINCÍPIO
Precisão
Cada pixel, cada interação, cada decisão —
nada é acidental.

| 03 | PRINCÍPIO
Presença
Um site não é uma página. É a primeira
impressão que nunca se repete.

| 04 | PRINCÍPIO
Resultado
Projetamos para converter. Design que não
performa é só decoração.

[VER PROJETOS →]  ← card 04 only
```

### Card Typography
- Number: `| 01 |` monospace + `PRINCÍPIO` tracking-wide, both `#F5F2ED/40`
- Title: `text-2xl font-light tracking-wide text-[#F5F2ED]/90`
- Description: `text-sm leading-relaxed text-[#F5F2ED]/50`, max 2 lines
- CTA: `text-sm uppercase tracking-[0.2em] text-[#FB3640]/90` + pulsing arrow
- Background: transparent (no box)
- Transition: fade-in + translate-x (20px from right), 0.6s ease

## User Controls

- **Dots:** Click jumps to any stop (timeline.seek)
- **Arrow keys ←→:** Navigate between stops
- **Drag:** OrbitControls preserved for free exploration (pauses timeline during interaction, resumes on release)

## Component Changes

### Removed
- `ContentPoint.tsx` — text moves out of canvas to HTML

### Modified
- `config.ts` — remove SCROLL_PHASES, add TIMELINE config (camera positions, dwell durations)
- `PyramidScene.tsx` — remove scroll rotation, add camera animation via GSAP, remove ContentPoint rendering
- `Pyramid.tsx` — split layout: canvas left + HTML card right, manages timeline state
- `SignalBall.tsx` — driven by timeline progress ref instead of scroll progress
- `OpeningSequence.tsx` — remove scroll wrapper for pyramid section, mount as fixed 100vh
- `useOpeningScroll.ts` — simplify to only handle logo → pyramid transition
- `StageNav.tsx` — simplify to 4 horizontal dots for principles only

### Preserved
- `geometry.ts` — pyramid face subdivision unchanged
- `PyramidFace.tsx` — node + edge rendering unchanged
- `usePyramidAnimation.ts` — build animation unchanged (useFrame-based)
- Signal ball travel mechanics + vertex trail

## Integration with OpeningSequence

The opening sequence becomes two fixed-height sections:

1. **Logo section (100vh):** Scroll-driven transition from logo to pyramid (existing, keeps scroll for this transition only)
2. **Pyramid section (100vh):** Fixed. Auto-timeline plays when visible. No scroll interaction.

The transition from logo to pyramid still uses scroll. Once the pyramid is fully visible, scroll is disabled and the auto-timeline takes over.

## Out of Scope
- Terrain/projects section (next implementation)
- Mobile layout adaptation
- Content finalization (placeholders only)
