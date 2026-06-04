# Landscape Flip Transition + Arc Depth + Dual Preview Card

**Data:** 2026-06-04
**Escopo:** 3 ajustes coordenados na transição Philosophy → ProjectLandscape e na própria Paisagem.

---

## 1. Triangle Flip Transition

**Quando dispara:** click no MeshButton da Philosophy.

**Mecânica:**
- Wrapper `<div style="perspective: 1500px">` envolve Philosophy + ProjectLandscape
- Card interno com `transform-style: preserve-3d` que vira
- Dois lados absolutos, `backface-visibility: hidden`:
  - **Front:** PhilosophySection (default, sem rotação)
  - **Back:** ProjectLandscape (pré-rotacionado 180° no mesmo eixo)
- Animação: `rotate3d(0.5, 0.866, 0, 0deg → 180deg)`
  - Vetor (cos60°, sin60°, 0) = aresta de triângulo equilátero — eco da marca
- Duração: **1.2s**, ease `power3.inOut`

**Setup:** ProjectLandscape monta junto com `setPhase("flipping")`, mas o Canvas já está aquecido (técnica do pre-mount). Quando o flip termina, `setPhase("landscape")` desmonta o wrapper.

**Estados em OpeningSequence:**
```
phase: "logo" | "philosophy" | "flipping" | "landscape"
```

`flipping` é estado intermediário curto (1.2s).

---

## 2. Arc Depth Layout

Fragmentos em arco — central mais perto da câmera, laterais mais ao fundo:

| # | Slug | x | z | Scale |
|---|---|---|---|---|
| 0 | machado-plataformas | -7 | -2 | 1.0× |
| 1 | estudio-mendes | 0 | +1.5 | 1.4× |
| 2 | rota-clinica | +7 | -2 | 1.0× |

**Câmera de scroll** ganha 3 keyframes com smoothstep entre eles:

| Progress | Position | Target |
|---|---|---|
| 0% | (-4, 5.2, 13) | (-7, -0.5, -2) |
| 50% | (0, 5.2, 14) | (0, -0.5, +1.5) |
| 100% | (+4, 5.2, 13) | (+7, -0.5, -2) |

`useProjectScrollCamera` evolui de "lerp linear de x" pra "keyframes com smoothstep entre cada par".

---

## 3. Dual Preview Card

**Anatomia (~480×280px):**

```
┌────────────────────────────────────────────┐
│ ┌──────────────────────┐ ┌──────────┐     │
│ │  DESKTOP PREVIEW     │ │  MOBILE  │     │
│ │  (aspect ~16:10)     │ │ (ratio   │     │
│ │                      │ │  9:16)   │     │
│ └──────────────────────┘ └──────────┘     │
│                                            │
│ ARQUITETURA · 2026                         │
│ Estúdio Mendes                             │
│ Identidade digital + site institucional    │
│                                            │
│ Ver projeto  →                             │
└────────────────────────────────────────────┘
```

**Estados:**
- **Published:** preview real + click → `/cases/[slug]`
- **Coming-soon:** placeholder SVG triangulado com label "Em breve" + sem navegação

**Placeholder:** mesmo padrão de malha do MeshButton (procedural, deterministic). Fundo `#000F08`, wireframe sutil.

**Mudanças em [types/case.ts](../../types/case.ts):**
```ts
preview?: {
  desktop: string;  // path ou URL
  mobile: string;
};
```

[data/cases.ts](../../data/cases.ts): Machado fica com `preview` placeholder até o usuário adicionar paths reais.

---

## 4. Arquivos

| Arquivo | Mudança | Linhas |
|---|---|---|
| `components/lab/OpeningSequence/config.ts` | + `FLIP = { DURATION, AXIS_X, AXIS_Y }` | +10 |
| `components/lab/OpeningSequence/useFlipTransition.ts` | **Novo** — orquestra timeline GSAP 3D | +70 |
| `components/lab/OpeningSequence/OpeningSequence.tsx` | + phase "flipping" + wrapper 3D | +50 / -10 |
| `components/lab/ProjectLandscape/config.ts` | Reposicionar arc + 3 keyframes + scale por slot | +40 / -20 |
| `components/lab/ProjectLandscape/ProjectFragment.tsx` | + prop `scale` (default 1.0) | +5 |
| `components/lab/ProjectLandscape/useProjectScrollCamera.ts` | Reescrever pra 3 keyframes | +30 / -15 |
| `components/lab/ProjectLandscape/ProjectCard.tsx` | Reescrever — dual preview layout | +120 / -80 |
| `types/case.ts` + `data/cases.ts` | + `preview` field | +20 |

**Total:** ~350 linhas novas, ~125 removidas/substituídas.

---

## 5. Não está no escopo

- Câmera default do TerrainMesh (compartilhada com outras cenas)
- Cursor triangular ou MeshButton
- Logo / Philosophy
- Página `/cases/[slug]`
- Mobile fine-tuning do card (desktop-first, mobile depois)
- Imagens reais (estrutura + placeholders)

---

## 6. Testing manual

1. Recarregar → logo → philosophy → click no CTA
2. Flip 3D anima 1.2s em torno do eixo de 60°
3. Aterriza em ProjectLandscape com fragmento central destacado
4. Scroll desliza câmera entre os 3 keyframes
5. Hover em fragmento → card 480px aparece com preview placeholder + texto
6. Click em Machado → navega pra `/cases/machado-plataformas`
7. Click em Estúdio/Rota → card persistente, sem navegação
