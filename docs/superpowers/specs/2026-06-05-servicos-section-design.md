# Seção Serviços — Spec de implementação

**Data:** 2026-06-05
**Escopo:** seção #5 da Home (Serviços), conforme [master roadmap](../plans/2026-06-05-home-roadmap-master.md).

---

## Objetivo

Apresentar os 3 produtos da CbM (Landing Pages, Sites Institucionais, Experiências Web) de forma clara comercial + visualmente coerente com o vocabulário da marca. Cards expandem inline (acordeon) revelando detalhes do serviço, com CTAs de contato específicos.

## Estado da arte (input)

- Vocabulário visual estabelecido: wireframe triangulado, off-white + signal red + deep black, Satoshi/Panchang
- Triângulo rotativo como CTA marker (estabelecido no MeshButton + cards da Paisagem)
- Border-draw animation (mencionada no next-steps mas ainda não usada)

## Decisões aprovadas

| Tema | Escolha |
|------|---------|
| Click no card | Expande inline (acordeon) — só 1 expandido por vez |
| Canvas strategy | 3 canvases pequenos (1 por card) |
| Estado inicial | Todos colapsados |
| CTA do card colapsado | "Saber mais →" com triângulo rotativo no hover |
| CTA do card expandido | "Conversar sobre este serviço →" (mailto com subject) |

---

## Copy oficial

**Headline:** "Construímos presença digital."
**Sub:** "Para empresas que levam a sério."

### Cards

| # | Título | Descrição (colapsado) | Inclui (expandido) | Indicado pra |
|---|--------|----------------------|-------------------|--------------|
| 01 | Landing Pages | Sites de conversão. Foco em uma única ação. Performance e clareza. | Estratégia de conversão · Copywriting persuasivo · Design responsivo · Setup analytics · Deploy + handover | Empresas com produto único ou campanha específica |
| 02 | Sites Institucionais | Presença digital completa. Estrutura, autoridade, profundidade. | Arquitetura de informação · Identidade aplicada · 5-12 páginas · CMS leve · SEO técnico · Performance | Empresas que querem presença sólida e profunda |
| 03 | Experiências Web | Interfaces que surpreendem. Para quem quer se diferenciar. | Conceito visual original · WebGL/Three.js · Motion design · Storytelling interativo · Performance refinada | Marcas premium que querem se diferenciar pela experiência |

---

## Layout

### Desktop (≥1024px)

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│  EYEBROW                                                     │
│  Construímos presença digital.                               │
│  Para empresas que levam a sério.                            │
│                                                              │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐                 │
│  │   01     │   │   02     │   │   03     │                 │
│  │ [3D scene│   │ [3D scene│   │ [3D scene│                 │
│  │  240×160]│   │  240×160]│   │  240×160]│                 │
│  │          │   │          │   │          │                 │
│  │ Landing  │   │Sites Inst│   │Experiên. │                 │
│  │ Pages    │   │tucionais │   │  Web     │                 │
│  │          │   │          │   │          │                 │
│  │ descrip. │   │ descrip. │   │ descrip. │                 │
│  │          │   │          │   │          │                 │
│  │Saber mais│   │Saber mais│   │Saber mais│                 │
│  └──────────┘   └──────────┘   └──────────┘                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

Quando expandido (ex: card 02):

```
┌─────────────────────────────────────────────────────────────┐
│  ┌──────────┐   ┌────────────────────────────┐ ┌──────────┐│
│  │   01     │   │           02                │ │   03     ││
│  │ [3D]     │   │ [3D ampliado: 280×180]      │ │ [3D]     ││
│  │ Landing  │   │                              │ │ Experiên.││
│  │ collapsed│   │ Sites Institucionais         │ │collapsed ││
│  └──────────┘   │ descrição estendida          │ └──────────┘│
│                 │                              │             │
│                 │ INCLUI                       │             │
│                 │ • Arquitetura de informação  │             │
│                 │ • Identidade aplicada        │             │
│                 │ • 5-12 páginas               │             │
│                 │ • CMS leve                   │             │
│                 │ • SEO técnico                │             │
│                 │ • Performance                │             │
│                 │                              │             │
│                 │ INDICADO PRA                 │             │
│                 │ Empresas que querem...       │             │
│                 │                              │             │
│                 │ [Conversar sobre este serviço]│            │
│                 └──────────────────────────────┘             │
└─────────────────────────────────────────────────────────────┘
```

Layout do grid: `grid grid-cols-3 gap-6` com `grid-template-columns: minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)` que se ajusta para `minmax(0,1fr) minmax(0,2.4fr) minmax(0,1fr)` quando o card do meio está expandido (e similar para os outros).

### Mobile (<768px)

Cards empilhados vertical. Sem grid de expansão lateral — quando expande, o card cresce em altura e empurra os outros pra baixo.

---

## Design dos cards

### Card colapsado

- **Container:** `bg-[#0E1810]` (Forest Dark), `border border-[#1a2a1e]`, sem border-radius, `cursor-pointer`
- **Padding:** `p-6` (24px)
- **Width:** desktop 100% da coluna (~320px), mobile full
- **Height:** ~420px desktop
- **Hover:** border → `#F5F2ED/50`, translateY -2px

**Estrutura interna (top → bottom):**

1. **Número** (Panchang 600, 11px, tracking 0.15em, uppercase, off-white/45) — ex: "01"
2. **Mini canvas 3D** (240×160px desktop, full×120 mobile)
3. **Título** (Panchang 700, 24-28px, off-white) — ex: "Landing Pages"
4. **Descrição** (Satoshi 400, 14-15px, off-white/65) — ~3 linhas
5. **CTA inline** (Satoshi 500, 11px, uppercase, tracking 0.3em, off-white/85) — "Saber mais →" + triângulo vermelho rotativo no hover

### Card expandido

- Mesmo container, mas border `#F5F2ED/70` (mais brilhante)
- Width: ~720px (ocupa ~2.4 colunas) com transition smooth
- Conteúdo adicional aparece após a descrição original

**Bloco "INCLUI":**
- Label "Inclui" (Satoshi 500, 11px, uppercase, tracking 0.3em, off-white/55)
- Lista de bullets simples (`•`), Satoshi 400, 13-14px

**Bloco "INDICADO PRA":**
- Label "Indicado pra" (mesmo estilo)
- Texto Satoshi 400, 13-14px, off-white/70

**CTA expandido:**
- Botão estilo similar ao "Ver projeto" do card da Paisagem
- Border + padding `px-5 py-3`, hover bg
- Texto: "Conversar sobre este serviço"
- Link: `mailto:contato.codedbym@gmail.com?subject=Interesse em ${tipo}` (dynamic)
- Triângulo rotativo no hover

---

## Three.js — mini-scenes por card

### Configuração comum

Cada card monta seu próprio `<Canvas>`:
- Width/height fixos
- `dpr={[1, 1.5]}` (perf)
- `frameloop="demand"` quando card está colapsado e fora de viewport (IntersectionObserver)
- `frameloop="always"` quando card está em viewport
- Background: `transparent` (deixa o `#0E1810` do container aparecer)
- Câmera fixa, FOV 40

### Card 01 — Landing Pages

**Conceito:** silhueta tall vertical, eco do preview tall do ProjectCard da Paisagem.

**Geometria:**
- 3 colunas verticais (linhas), espaçadas em X (-1.5, 0, +1.5)
- Cada coluna tem 5 nós verticais (Y: -2 a +2)
- Triângulos conectando nós adjacentes entre colunas (formam zigzag)
- Total: 15 nós + ~24 arestas

**Material:**
- Lines: `LineBasicMaterial` color `#F5F2ED` opacity 0.7
- Nós: `MeshBasicMaterial` icosaedron pequeno (0.04)

**Animação:**
- **Idle:** scroll vertical lento — Y das colunas oscila num pattern (sin) com período 8s, amplitude 0.3. Lê como "página alta sendo construída e respirando"
- **Hover/expand:** scroll acelera (período 3s), apex (nó central topo) muda pra vermelho `#FB3640`

**Câmera:** position [0, 0, 5], target [0, 0, 0]

### Card 02 — Sites Institucionais

**Conceito:** estrutura horizontal em 4 camadas empilhadas — "site de várias seções".

**Geometria:**
- 4 planos horizontais, espaçados em Y (-1.5, -0.5, 0.5, 1.5)
- Cada plano: quadrado 2×2 com 4 nós nos cantos + 1 nó central
- Triangulado em 4 triângulos por plano
- Total: 20 nós + 16 arestas internas + 4 conexões verticais entre planos

**Material:**
- Lines: off-white opacity 0.6
- Cada camada tem leve variação de opacity (0.6, 0.55, 0.5, 0.45) — eco de profundidade atmosférica

**Animação:**
- **Idle:** cada camada respira em fase deslocada — Y oscila ±0.08 com período 5s, fase offset 1.25s entre camadas
- **Hover/expand:** linhas verticais entre camadas (4) aparecem com opacity 0.8 (eram 0). Estrutura "se conecta"

**Câmera:** position [3, 1, 5], target [0, 0, 0] — ligeiro ângulo lateral pra mostrar a profundidade

### Card 03 — Experiências Web

**Conceito:** torre triangular complexa + órbita de pontos ao redor.

**Geometria:**
- Torre central: similar à torre da Paisagem (3 níveis: base 3 nós + mid 3 nós + apex), escala 0.8
- **Órbita externa:** 8 pontos pequenos circulando em 3 planos orbitais diferentes (alturas Y 0, 0.5, -0.5)

**Material:**
- Torre: lines off-white opacity 0.7, apex `#FB3640`
- Pontos orbitais: meshes pequenos `#F5F2ED` opacity 0.4

**Animação:**
- **Idle:** torre rotaciona Y suave (yawPeriod 16s). Pontos orbitam em planos diferentes (períodos 12s, 18s, 24s)
- **Hover/expand:** velocidade aumenta 1.5×, pontos têm leve glow ao passar perto da torre

**Câmera:** position [3, 2, 5], target [0, 0, 0]

---

## Border-draw animation

Cada card tem uma **borda SVG sobreposta** que se desenha no scroll-in.

**Implementação:**
- SVG `viewBox="0 0 100 100" preserveAspectRatio="none"` sobreposto via `position: absolute inset: 0` no card
- Path: `M 0,0 L 100,0 L 100,100 L 0,100 Z`
- Stroke `#F5F2ED` opacity 0.6, strokeWidth 0.5, fill none, `vectorEffect="non-scaling-stroke"`
- `pathLength="1"` + `strokeDasharray="1 1"` + `strokeDashoffset="1"` inicial
- IntersectionObserver detecta entrada no viewport
- GSAP anima `strokeDashoffset` de 1 → 0 em 0.9s ease-build
- Stagger 150ms entre cards (card 1 começa em 0s, card 2 em 0.15s, card 3 em 0.30s)
- Após draw completar, o stroke fade-out (opacity 0.6 → 0.2) revelando a border CSS normal

---

## Componentes a criar

### 1. `ServicesSection.tsx` (orquestrador)
- Estado: `expandedSlug: string | null`
- Click no card chama `handleExpand(slug)` que toggle
- Layout grid responsivo
- Headline + sub no topo
- 3 `<ServiceCard>` filhos

### 2. `ServiceCard.tsx`
- Props: `service: ServiceConfig`, `expanded: boolean`, `onExpand: () => void`
- Renderiza estado colapsado ou expandido condicionalmente
- Anima transition entre estados via GSAP (height: auto + opacity dos elementos internos)
- IntersectionObserver pro border-draw inicial

### 3. `ServiceMiniScene.tsx`
- Props: `variant: "landing" | "institutional" | "experience"`, `active: boolean`
- Renderiza `<Canvas>` próprio
- Switch interno renderiza a geometria + animação correta por variant

### 4. `services.ts` (data)
- Array `SERVICES: ServiceConfig[]` com slug, title, descrição, includes, indicatedFor, mailSubject

### 5. `useBorderDraw.ts` (hook)
- Toma `ref` do path SVG e `delay` em segundos
- Configura IntersectionObserver
- Quando entra: anima strokeDashoffset 1 → 0

---

## Transição entrada/saída

### Entrada (de Paisagem)
- Paisagem termina → fade out UIs
- Headline de Serviços fade-in via GSAP (0.6s + word stagger 80ms — eco da Philosophy)
- Cards aparecem com border-draw animation (descrita acima)

### Saída (pra Laboratório)
- Quando user scrolla pra fora, cards fade out com opacity transition
- Mini-canvases pausam `frameloop="never"` quando completamente fora do viewport (perf)

---

## Mobile (<768px)

- Cards empilhados vertical (`flex flex-col gap-4`)
- Mini canvas 200×120px
- Quando expande: card cresce em altura, conteúdo adicional aparece abaixo (sem mudança de grid)
- "Saber mais" e "Conversar sobre" são botões full-width
- Sem hover-driven animation (touch)

---

## Acessibilidade

- Cards são `<button>` com `aria-expanded={expanded}` + `aria-controls="card-${slug}-details"`
- Conteúdo expandido tem `id="card-${slug}-details"` + `role="region"`
- Headline da seção é `<h2>`
- Títulos dos cards são `<h3>`
- IntersectionObserver respeita `prefers-reduced-motion` (sem border-draw)
- Foco visível em cards e CTAs (focus-visible:outline)

---

## Performance

- 3 canvases pequenos em paralelo = 3 contextos WebGL adicionais
- `frameloop="demand"` quando card colapsado E fora do viewport
- `frameloop="always"` quando card colapsado E em viewport
- `frameloop="always"` quando expandido (animation precisa rodar)
- Geometrias estáticas (computadas uma vez via `useMemo`)
- `dpr={[1, 1.5]}` no DPR cap

**Estimativa de impacto:** ~3 contextos WebGL extra. Desktop tranquilo, mobile pode sentir. Se cair perf em mobile, fallback é renderizar imagens estáticas (snapshots PNG) em vez de canvases vivos.

---

## Verification

Antes de fechar:
- [ ] Type check passa
- [ ] Build passa
- [ ] Manualmente em browser:
  - [ ] Cards aparecem com border draw stagger
  - [ ] Click em card 1 expande, click em card 2 fecha 1 e abre 2
  - [ ] Mini canvases animam (idle motion visível em cada um diferente)
  - [ ] Mobile: cards empilhados, expande sem quebrar layout
  - [ ] Reduced motion: sem border draw, sem oscilações
  - [ ] Teclado: Tab navega cards, Enter/Space expande
- [ ] Build produção tem 3 sections geradas (existem só placeholders por enquanto pra serviços)

## Out of scope (esta iteração)

- Pages dedicadas `/servicos/[slug]` (pode ser próxima sessão)
- Transição animada entre Serviços e Laboratório (vai ser polida na sessão de integração)
- Cases dos serviços (não temos cases reais ainda — só Machado)
