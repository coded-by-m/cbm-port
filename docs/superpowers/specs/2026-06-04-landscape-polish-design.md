# Paisagem Digital — Polish Final

**Data:** 2026-06-04
**Escopo:** acabamento completo da Paisagem Digital (3 fragmentos = 3 projetos) — slideshow, mobile, transições, hierarquia visual, indicadores e integração de assets reais.

Roadmap origem: [2026-06-04-next-steps.md](../plans/2026-06-04-next-steps.md) — itens 1.1, 1.2, 1.4 + polish extra.

---

## Objetivo

Transformar a Paisagem do estado "funciona em desktop com hover" para o estado "obra completa que respira sozinha em qualquer viewport". Quando o usuário pousa na seção, os 3 projetos se apresentam um a um automaticamente; quando ele decide interagir, o controle é dele. Em mobile, a experiência é nativa do formato — não uma versão degradada do desktop.

## Estado atual (baseline)

- 3 fragmentos triangulados sobre o terreno, layout em arco de profundidade
- Hover desktop: ativa fragmento → card HTML ancorado ao ápice projetado em 2D
- Card dual-preview (16:10 desktop + 9:16 mobile) com scroll vertical falso (CSS keyframe)
- Auto-ativa o fragmento central após 1000ms (`INITIAL_ACTIVE_SLUG` em [config.ts](../../../components/lab/ProjectLandscape/config.ts))
- Em viewports <768px o card de 480px não cabe — overflow ou clipping
- Fragmentos inativos têm a mesma presença visual do ativo
- Transição entre fragmentos: fade-out → fade-in puro
- Imagens reais não existem — sempre cai no `CardMeshPlaceholder` triangulado

## Decisões aprovadas

| Tema | Decisão |
|------|---------|
| Slideshow | Release-on-interact: auto-rotação até primeira interação real, depois user-controlled |
| Card mobile | Bottom sheet full-width fixo, layout vertical (desktop preview empilhado sobre mobile preview) |
| Transição entre cards | Slide direcional + crossfade (direção bate com posição espacial do fragmento) |
| Fragmentos inativos | Dim sutil quando há ativo (edge/node opacity × 0.55, apex perde vermelho) |
| Indicador | 3 dots abaixo do card, clicáveis para navegação manual |
| Assets Machado | Configurar paths e documentação; usuário dropa `.webp` (ou `.png`) depois |

---

## Design

### 1. Slideshow auto-rotativo

**Comportamento:**

- Ao entrar na Paisagem, espera `INITIAL_ACTIVE_DELAY` (1000ms, já existe) e ativa o fragmento central
- Após `SLIDESHOW_HOLD` (6000ms), avança para o próximo (machado → estudio-mendes → rota-clinica → machado → ...)
- Continua rotacionando até a **primeira interação real do usuário**:
  - `pointerover` em qualquer fragmento (hover desktop)
  - `pointerdown` em qualquer fragmento ou nos dots indicadores (click/tap)
- Após a interação, o intervalo é cancelado em definitivo (não volta a rotar mesmo se o usuário sair). Sessão "released".

**Ordem da rotação:** segue a ordem visual horizontal (left → center → right) e não a ordem de declaração em `FRAGMENT_SLOTS`. Já bate por coincidência (indices 0=left, 1=center, 2=right), mas o código deve ordenar por `slot.x` para ser robusto a reorder no config.

**Reduced motion:** se `prefers-reduced-motion: reduce`, o slideshow não auto-rotaciona. Para no fragmento inicial.

**Implementação:**

- Novo hook `useSlideshowRotation(activeSlug, setActiveSlug, isReleased, setReleased)` em [ProjectLandscape.tsx](../../../components/lab/ProjectLandscape/ProjectLandscape.tsx) (inline, não componente separado)
- `setInterval` clarivel via cleanup quando `isReleased` vira true
- Estado `isReleased` sobe pra orquestrador; `handleHover` e `handleClick` chamam `setReleased(true)` antes de qualquer outra coisa

**Novos valores em [config.ts](../../../components/lab/ProjectLandscape/config.ts):**

```ts
export const SLIDESHOW = {
  holdDuration: 6000,      // ms por fragmento antes de avançar
  transitionDuration: 600, // ms total da transição (slide + fade)
} as const;
```

### 2. Card mobile (bottom sheet)

**Breakpoint:** `(max-width: 767px)`. Detectado via `useMediaQuery` ou `window.matchMedia` num useEffect.

**Layout mobile:**

```
┌─────────────────────────────────┐
│                                 │
│         (3D canvas)             │  ← 100svh
│                                 │
│         (fragments)             │
│                                 │
├─────────────────────────────────┤
│  ◉ ○ ○            machado plat. │  ← bottom sheet
│  ┌────────────┐  Setor · Ano    │      fixo, ~280px alto
│  │ desktop pv │  Descrição curta│      pointer-events: auto
│  └────────────┘                 │      backdrop-blur
│  ┌─────┐                        │
│  │ mob │                        │
│  └─────┘                        │
└─────────────────────────────────┘
```

**Diferenças do desktop:**

- Posicionamento: `position: fixed; bottom: 0; left: 0; right: 0` em vez de `top/left` calculados pela projeção 3D
- Não recebe `screenPos` — desktop ainda usa, mobile ignora
- Layout interno: grid `grid-cols-[auto_1fr]` em vez de coluna empilhada (preview à esquerda, texto à direita)
- Desktop preview: aspect 16:10 limitado a ~120px de largura. Mobile preview: aspect 9:16 limitado a ~50px largura
- Borda só no topo (`border-t`) — não wrapper completo, evita "card flutuando"
- Sempre visível enquanto a Paisagem está em viewport (não fade out)
- Dots indicadores no canto superior esquerdo do card

**Fragment interaction em mobile:**

- `pointerdown` em fragmento já funciona via raycast 3D (touch dispara pointerdown). Mantém comportamento atual de "tap to activate"
- Adicionalmente, dots clicáveis no bottom sheet permitem navegação direta

### 3. Transição direcional entre cards

**Hoje:** GSAP `opacity: 0 → 1` no wrapper inteiro quando `caseProject` muda.

**Novo:**

- Wrapper exterior continua estável (mantém position)
- Conteúdo interno fica em wrapper separado que faz slide + fade
- Quando `activeSlug` muda:
  1. Detecta direção: novo `slot.x` > antigo `slot.x` → direção `right`; menor → `left`
  2. Conteúdo antigo: `gsap.to(content, { x: dir === 'right' ? -12 : 12, opacity: 0, duration: 0.25 })`
  3. Quando termina, swap do conteúdo
  4. Conteúdo novo entra de `x: dir === 'right' ? 12 : -12, opacity: 0` → `x: 0, opacity: 1, duration: 0.35`

**Total ~600ms** (transitionDuration acima). Combina com `SLIDESHOW.holdDuration` 6000ms: usuário tem 5.4s pra ler antes do próximo começar a entrar.

**Reduced motion:** transição cai pra fade simples 200ms total, sem deslocamento X.

### 4. Dim de fragmentos inativos

**Implementação em [ProjectFragment.tsx](../../../components/lab/ProjectFragment.tsx):**

- Novo prop `anyActive: boolean` (true quando `activeSlug !== null`)
- Quando `anyActive && !isActive`:
  - `edgeOpacity *= FRAGMENT_VISUAL.dimMultiplier` (0.55)
  - `nodeOpacity *= FRAGMENT_VISUAL.dimMultiplier`
  - Apex color: lerp `FB3640 → F5F2ED` baseado em `(1 - dim)` (perde vermelho)
- Transição entre estados via `lerp(current, target, delta * 4)` — mesmo padrão do highlight

**Novo em [FRAGMENT_VISUAL](../../../components/lab/ProjectLandscape/config.ts):**

```ts
dimMultiplier: 0.55,
dimLerpSpeed: 4,
```

### 5. Dots indicadores

**3 dots horizontais** abaixo do card (desktop) ou no canto sup. esq. do card (mobile).

**Visual:**

- Cada dot: `8×8px`, `border-radius: 50%`, `border: 1px solid` `#F5F2ED/40`
- Inativo: `bg: transparent`, opacity 0.5
- Ativo: `bg: #F5F2ED`, opacity 1
- Spacing: `gap-2`
- Hover (desktop): `opacity: 1`, `border: #F5F2ED/80`
- Click: chama `setActiveSlug(slot.slug)` + dispara `setReleased(true)`

**Componente novo:** `<SlideshowDots>` em [components/lab/ProjectLandscape/SlideshowDots.tsx](../../../components/lab/ProjectLandscape/SlideshowDots.tsx). Recebe `slots`, `activeSlug`, `onSelect`.

**Posicionamento desktop:** dentro do card wrapper, container flex no rodapé do card, centralizado. Padding `pt-3 pb-1`.

**Posicionamento mobile:** no header do bottom sheet, lado esquerdo da linha de meta.

### 6. Assets reais — Machado

**Documentação:** novo arquivo `public/cases/machado/README.md`:

```markdown
# Assets do case Machado Plataformas

Dropar os seguintes arquivos aqui:

- `desktop-tall.webp` — screenshot da home completa em viewport 1600px
  - Resolução: ~1600×6000px
  - Peso alvo: <300KB
- `mobile-tall.webp` — screenshot da home completa em viewport 400px
  - Resolução: ~400×2400px
  - Peso alvo: <150KB

PNG também aceito — ajustar extensão em `data/cases.ts`.

Como gerar: Chrome DevTools → Cmd+Shift+P → "Capture full size screenshot"
```

**[data/cases.ts](../../../data/cases.ts)** ganha `preview` no objeto do Machado:

```ts
preview: {
  desktop: "/cases/machado/desktop-tall.webp",
  mobile: "/cases/machado/mobile-tall.webp",
},
```

**Fallback resiliente:** se a imagem 404, [ProjectCard.tsx](../../../components/lab/ProjectLandscape/ProjectCard.tsx) já cai no `CardMeshPlaceholder` quando `caseProject.preview` é undefined. Para tratar 404 da imagem em si, adicionar `onError` no `<img>` que troca pra placeholder via estado local. Pequeno, mas evita "imagem quebrada" se o usuário esquecer de dropar antes do deploy.

---

## Arquitetura

### Estado adicional em ProjectLandscape

```ts
const [activeSlug, setActiveSlug] = useState<string | null>(null);
const [released, setReleased] = useState(false);    // NEW
const [isMobile, setIsMobile] = useState(false);    // NEW
const [direction, setDirection] = useState<'left'|'right'|null>(null); // NEW
```

### Fluxo

```
mount → setTimeout(1000ms) → setActiveSlug('estudio-mendes')
   → setInterval(6000ms) → advance to next slot by x-order
      → on hover/click → setReleased(true) → clearInterval
         → activeSlug muda → calc direction from slot.x delta
            → ProjectCard wrapper recebe direction prop
               → conteúdo antigo slide-out → swap → novo slide-in
```

### Componentes (mudanças)

| Arquivo | Mudança |
|---------|---------|
| `ProjectLandscape.tsx` | + slideshow hook, + isMobile, + released, + direction calc |
| `ProjectCard.tsx` | split em wrapper estável + content slidável; mobile bottom-sheet branch; integra SlideshowDots; onError no img |
| `ProjectFragment.tsx` | + prop `anyActive`, dim apex/edges quando dormente |
| `SlideshowDots.tsx` | **novo** |
| `config.ts` | + SLIDESHOW, + dimMultiplier/dimLerpSpeed em FRAGMENT_VISUAL |
| `data/cases.ts` | + preview em machado-plataformas |
| `public/cases/machado/README.md` | **novo** — instruções de dropping |

### Isolation

- `useSlideshowRotation` é hook inline em `ProjectLandscape.tsx` — escopo pequeno, sem reuso previsto
- `<SlideshowDots>` é componente puro: recebe slots/active/onSelect, renderiza dots. Zero side effects
- Dim de fragmentos: prop adicional em `ProjectFragment`, lerp local, não vaza estado
- Detecção de mobile via `useMediaQuery` hook simples ou matchMedia direto — sem dependência extra

---

## Risk & trade-offs

- **Bottom sheet mobile vs desktop overlay:** dois layouts diferentes na mesma seção. Tradeoff aceito — desktop e mobile têm modelos mentais distintos pra esse padrão. Card flutuante 3D-anchored não tem análogo natural em mobile.
- **Slideshow release-on-interact:** se o usuário fizer hover por acidente (mouse passa rápido), o slideshow para definitivamente. Considerado aceitável — exploração explícita > automação burra. Alternativa rejeitada: "pause + resume após N segundos" adiciona complexidade sem ganho claro.
- **onError no `<img>`:** adicionado para não quebrar visual se assets faltarem, mas em produção o ideal é validar no build (CI checa que `preview.desktop` aponta pra arquivo existente). Fora de escopo desta iteração.
- **Direção da transição em mobile:** dots clicáveis podem pular do 1 pro 3 (esquerda → direita +2). Direção continua `right`. Pulos não-adjacentes raramente acontecem (3 fragmentos só) — não otimizar.

## Out of scope

- Imagens reais dos outros 2 cases (Estúdio Mendes, Rota Clínica) — continuam coming-soon com placeholder
- Lightbox/zoom no preview
- Animação de progresso no slideshow (linha que preenche durante o hold)
- Refatoração de `components/lab/` → `components/sections/`
- Performance audit (Canvas duplicado Philosophy + Landscape)

## Verification

Antes de marcar como concluído:

- [ ] Type check passa (`pnpm typecheck`)
- [ ] Lint passa (`pnpm lint`)
- [ ] Build passa (`pnpm build`)
- [ ] Manualmente em browser:
  - [ ] Desktop ≥1024px: slideshow roda, card aparece ancorado ao apex, hover em fragmento para o auto-rotate
  - [ ] Mobile <768px (DevTools): bottom sheet aparece, dots funcionam, tap em fragmento muda o card
  - [ ] Dim: ao ativar um fragmento, os outros 2 dimam suavemente e apex perde vermelho
  - [ ] Transição direcional: troca center → right desliza pra esquerda
  - [ ] Reduced motion: slideshow não roda, transição é fade simples
  - [ ] Sem assets reais: placeholder triangulado continua aparecendo (não quebra)
