# Opening Sequence — Autoplay Refactor (Parte 1)

**Data:** 2026-06-03
**Escopo:** Refatorar a transição logo → PhilosophySection do `OpeningSequence` para autoplay temporizado, eliminando a dependência de scroll que está causando solavancos.

---

## 1. Problema

Hoje a transição da Parte 1 do portfólio (logo CbM construído → PhilosophySection) é dirigida por scroll via Lenis + GSAP ScrollTrigger ([useOpeningScroll.ts](../../components/lab/OpeningSequence/useOpeningScroll.ts)).

O mapeamento `scrollProgress → opacidades + exitParticles` é matematicamente coerente, mas o input (roda do mouse + trackpad + Lenis com `lerp: 0.07` e `wheelMultiplier: 0.35`) é instável na prática:

- Wheel rápida → Lenis interpola devagar → transição "engasga"
- Trackpad leve → salta direto pra Philosophy sem cinema
- Reduced-motion → comportamento ainda mais errático
- Em mobile, o `touchMultiplier: 0.4` torna a parte 1 quase impassável em alguns aparelhos

**Resultado:** a primeira impressão do site depende da sensibilidade do scroll do usuário, que é o pior lugar pra colocar uma animação cinematográfica de marca.

---

## 2. Objetivo

Trocar o motor de scroll por um motor de tempo (timer GSAP), mantendo:

- O **mesmo aspecto visual** (mesmas curvas, mesmos overlaps, mesma ordem)
- A **mesma sequência narrativa** (build → hold → exit → philosophy)
- A **autonomia da PhilosophySection** (já tem auto-advance + keyboard + wheel próprios — fica intocada)
- A **possibilidade de o usuário acelerar** o desfecho via clique ou tecla

---

## 3. Arquitetura

```
OpeningSequence (orquestrador)
 │
 ├─ TriangleLoader            → build do logo (~4.3s, autoplay GSAP existente)
 │   │                          dispara onConstructionComplete()
 │   └─ ExitParticles          → lê exitProgress ref (renomeado de scrollProgress)
 │
 ├─ useOpeningTimeline (novo)  → orquestra HOLD → EXIT
 │   │
 │   └─ timeline GSAP:
 │       ┌────────────────────────────────────────────┐
 │       │ HOLD  (1.5s)                               │
 │       │   logo completo respirando (useOrganicMotion já roda)│
 │       │   nada anima                                │
 │       ├────────────────────────────────────────────┤
 │       │ EXIT  (2.0s)  — exitProgress 0 → 1          │
 │       │   ├─ logo opacity 1→0       (0%–60%)        │
 │       │   ├─ exitProgress 0→1       (0%–100%)       │
 │       │   │   └─ ExitParticles consome via ref      │
 │       │   └─ philosophy opacity 0→1 (40%–100%)      │
 │       ├────────────────────────────────────────────┤
 │       │ END                                         │
 │       │   setPhase("philosophy")                    │
 │       │   PhilosophySection assume controle          │
 │       └────────────────────────────────────────────┘
 │
 └─ Accelerate listener        → window pointerdown / keydown
                                  durante a janela ativa
                                  timeline.timeScale(2.5)
```

**O que sai:** `<div overflow-y-auto>`, `SCROLL_LENGTH=250vh`, Lenis, ScrollTrigger, `scrollProgress` ref.

**O que entra:** um hook (`useOpeningTimeline`), um arquivo de config com constantes de tempo, um listener global de aceleração.

---

## 4. Tempos default

| Fase | Duração | O que acontece |
|---|---|---|
| Build | ~4.3s (existente, intocado) | Pontos pop → strokes desenham → signal red ([useTriangleAnimation.ts](../../components/lab/TriangleLoader/useTriangleAnimation.ts)) |
| Hold | 1.5s | Logo completo, respiração orgânica de `useOrganicMotion` continua |
| Exit | 2.0s | `exitProgress` 0→1 com ease `power2.inOut` |
| ↳ logo fade-out | 0–60% do exit | Opacidade do layer do logo 1→0 |
| ↳ partículas | 0–100% do exit | Curva atual de ExitParticles preservada |
| ↳ philosophy fade-in | 40–100% do exit | Overlap pra cobrir o vazio |

Total Parte 1: ~7.8s (build 4.3 + hold 1.5 + exit 2.0). Com aceleração: ~5.7s.

Constantes em `components/lab/OpeningSequence/config.ts` (novo):

```ts
export const TIMING = {
  HOLD_DURATION: 1.5,
  EXIT_DURATION: 2.0,
  LOGO_FADE_END: 0.6,        // % do EXIT_DURATION
  PHILOSOPHY_FADE_START: 0.4, // % do EXIT_DURATION
  ACCELERATE_FACTOR: 2.5,
  REDUCED_MOTION_FACTOR: 2.5, // aplicado por default em reduced motion
} as const;
```

---

## 5. Interação acelera

**Quando ativa:** entre o `onConstructionComplete` do build e o fim da timeline (janela ~3.5s).

**Como dispara:** `window.addEventListener("pointerdown", ...)` e `keydown` (qualquer tecla não-modificadora — ignora Tab/Shift/Ctrl/Alt/Meta sozinhos).

**Efeito:** `timeline.timeScale(TIMING.ACCELERATE_FACTOR)` — Hold + Exit que duravam 3.5s viram ~1.4s. Múltiplos cliques não acumulam.

**Reduced motion:** `timeScale` já aplicado por default (`REDUCED_MOTION_FACTOR`). Build do logo já ignora `useOrganicMotion` (existente).

---

## 6. Mudanças por arquivo

| Arquivo | Mudança | Linhas |
|---|---|---|
| `components/lab/OpeningSequence/useOpeningScroll.ts` | **Deletar** | -102 |
| `components/lab/OpeningSequence/useOpeningTimeline.ts` | **Criar** | +~70 |
| `components/lab/OpeningSequence/config.ts` | **Criar** com TIMING | +~20 |
| `components/lab/OpeningSequence/OpeningSequence.tsx` | Tira wrapper de scroll, `SCROLL_LENGTH`, refs de scroll, hook antigo. Layout vira layers absolutos puros. | ~-30 / +~15 |
| `components/lab/TriangleLoader/TriangleLoader.tsx` | Renomeia prop `scrollProgress` → `exitProgress` (mesmo tipo `RefObject<number>`) | ~5 |
| `components/lab/TriangleLoader/TriangleScene.tsx` | Mesmo rename + passa adiante | ~5 |
| `components/lab/TriangleLoader/ExitParticles.tsx` | Mesmo rename (props.scrollProgress → props.exitProgress). Lógica interna idêntica. | ~3 |

**Nenhuma mudança em:** `useTriangleAnimation`, `Particles`, `Point`, `useOrganicMotion`, `useResponsiveFit`, `PhilosophySection`, `DigitalLandscape`.

**Total:** ~180 linhas tocadas, das quais 102 são deleção.

---

## 7. Interface do hook novo

```ts
type Layers = {
  logo: RefObject<HTMLDivElement>;
  philosophy: RefObject<HTMLDivElement>;
};

function useOpeningTimeline(
  layers: Layers,
  exitProgress: MutableRefObject<number>,
  enabled: boolean,              // true após buildComplete
  onPhilosophyVisible: () => void, // setPhase("philosophy")
): void;
```

- `enabled` é `true` somente após o build do logo terminar — a timeline só monta quando o sinal de `onConstructionComplete` chega
- `exitProgress.current` é animado de 0→1 pela timeline GSAP (é o mesmo ref que vai pra ExitParticles)
- `onPhilosophyVisible` é chamado quando o overlap começa (~40% do EXIT), pra montar a Philosophy cedo e dar tempo do TerrainBackground carregar

---

## 8. Edge cases

- **Tab/Shift+Tab durante a janela ativa:** não acelera (filtro de teclas modificadoras)
- **Unmount no meio da timeline:** cleanup do `useEffect` chama `timeline.kill()` — seguro
- **Resize durante hold:** `useResponsiveFit` do logo já trata; nada a fazer
- **Reduced motion:** `timeScale(2.5)` aplicado já no `play()`; build do logo já respeita (lógica existente)
- **Múltiplos cliques:** `timeScale` é idempotente — segundo clique é no-op
- **PhilosophySection precoce:** montada quando `onPhilosophyVisible` dispara (~40% do exit), pra `TerrainBackground` ter tempo de carregar antes do fade-in completar

---

## 9. O que NÃO muda

- Visual idêntico ao atual quando o scroll funciona bem (mesmas curvas, mesmos overlaps)
- Build do logo (`useTriangleAnimation`) intacto — pontos, strokes, signal red
- PhilosophySection intacta — auto-advance, keyboard, wheel próprios
- Transição Philosophy → DigitalLandscape intacta — segue por `onComplete` da Philosophy
- ExitParticles renderização e curva — só a fonte do `progress` muda

---

## 10. Testing manual

1. Recarregar a home → logo monta em ~4.3s sem input
2. Esperar passivamente → hold de 1.5s → exit de 2s → Philosophy aparece
3. Recarregar e clicar durante o hold → exit acelera (~0.8s ao todo)
4. Recarregar e apertar Enter durante o exit → continua acelerando até o fim
5. Tab/Shift/Ctrl sozinhos não disparam aceleração
6. DevTools → reduced-motion ON → recarregar → sequência roda ~3s mais curta sem interação
7. Resize horizontal durante hold → logo se reajusta sem quebra
8. Sair da página no meio do hold (navegar /lab) → sem erro de cleanup no console
