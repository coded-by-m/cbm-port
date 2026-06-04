# Roadmap Master — Próximas Seções da Home

**Data:** 2026-06-05
**Escopo:** plano completo de todas as seções restantes da Home, do estado atual até fechamento.
**Contexto:** Opening Sequence (Logo + Philosophy + Paisagem orbital) está implementado e validado. Faltam 6 zonas + transições + footer.

---

## Estado atual (referência)

### Concluído
- **TriangleLoader** (autoplay, 100vh equivalente)
- **PhilosophySection** (3 statements + CTA MeshButton, terreno residual de fundo, ~100vh)
- **Triangle Flip 3D** (transição Philosophy → Paisagem, axis 60°)
- **ProjectLandscape** (orbital, 6 fragmentos, faísca tetraedro, sonar, base ring, glow, floor, network removida)
  - Controles: drag, auto-rotate 90s/volta, snap 2s, arrows ← ▶❚❚ →, progress bar, hint, pause toggle, hover-card-pauses
  - Card fixo bottom-right (counter, status badge, CTA triangle rotating, EOT banner, coming-soon mailto)
  - Keyboard nav, ARIA, camera breathing
  - Modo dev câmera livre (sem atalho, mas componentes disponíveis)

### Doc reference
- Hierarquia/seções: [03-site-map.md](../../03-site-map.md), [07-experience-architecture.md](../../07-experience-architecture.md)
- Visual/motion: [04-motion-experience-system.md](../../04-motion-experience-system.md), [08.5-visual-direction.md](../../08.5-visual-direction.md), [10-design-system.md](../../10-design-system.md)
- Copy/wireframes: [05-experience-storyboard.md](../../05-experience-storyboard.md), [11-home-wireframe.md](../../11-home-wireframe.md)
- Integração: [09-home-integration-plan.md](../../09-home-integration-plan.md)

---

## Ordem completa da Home (final)

Conforme [07-experience-architecture.md](../../07-experience-architecture.md):

| # | Zona | vh | Status | Intensidade 3D |
|---|------|----|--------|----------------|
| 1 | LOADING | 100 | ✅ TriangleLoader | Alta |
| 2 | INTRO | (absorvido) | ✅ no logo build | — |
| 3 | HERO | (absorvido) | ✅ na Philosophy | — |
| 4 | **PROBLEMA** | 80 | 🟢 a fazer | Baixa-Média |
| 5 | **SERVIÇOS** | 100 | 🟢 a fazer | Baixa |
| 6 | PAISAGEM | (auto) | ✅ orbital implementado | Máxima |
| 7 | **LABORATÓRIO** | 100 | 🟢 a fazer | Média-Baixa |
| 8 | **PROCESSO** | 100 | 🟢 a fazer | Off (SVG) |
| 9 | **SOBRE** | 120 | 🟢 a fazer | Off |
| 10 | **CTA FINAL** | 150 | 🟢 a fazer | Alta |
| 11 | **FOOTER** | — | 🟢 a fazer | Off |

**Total restante:** 6 seções + footer + 5 transições entre elas.

---

## Princípios transversais (NÃO violar)

1. **Clareza comercial > impacto visual.** Se conflitar, copy/clareza ganham.
2. **Performance:** DPR `[1, 1.5]` em produção (não [1,2]); `frameloop="demand"` em cenas estáticas; sem post-processing.
3. **Canvas único na Home.** Não montar múltiplos `<Canvas>` na home — usar `<HomeCanvas>` com troca de cena por zona.
4. **Texto NUNCA dentro do canvas.** HTML puro com overlay.
5. **Respeitar `prefers-reduced-motion`** em todos os hooks de animação.
6. **Paleta:** `#000F08` bg, `#F5F2ED` off-white, `#FB3640` signal red. Nunca `#000000`, nunca `#ffffff`, nunca azul/roxo/cyan.
7. **Tipografia:** Panchang display / Satoshi body. Nenhuma outra fonte.
8. **Sem border-radius em elementos estruturais** (cards, botões).
9. **Máximo 2-3 elementos vermelhos visíveis simultaneamente.**
10. **Stagger padrão:** texto 100ms · cards 150ms · fragmentos 220ms · layer 550ms.

### Tokens motion canônicos (já no 10-design-system.md)
- Durations: instant 150ms · quick 300ms · normal 600ms · slow 900ms · xslow 1200ms · narrative 2600ms
- Easings: build = `power2.out` · draw = `power1.inOut` · camera smoothstep · exit `power1.in`
- Lenis lerp: `0.08`

---

# Spec de cada seção

---

## 4. PROBLEMA — "A maioria dos sites parece igual"

**Propósito narrativo:** diagnosticar o problema. Visitante deve se reconhecer ("sim, meu site é genérico").

**Altura:** 80vh

**Copy oficial** ([11-home-wireframe.md](../../11-home-wireframe.md)):
- **Headline:** "A maioria dos sites parece igual."
- **Sub:** "Pouca personalidade. Pouca diferenciação. Pouco impacto."
- Sem CTA — seção de diagnóstico, não de ação.

### Layout

```
┌─────────────────────────────────────────┐
│                                         │
│   [3D layer]  field de cubos genéricos  │
│                idênticos, em grid        │
│                                         │
│   ◯  Headline grande à esquerda         │
│   (Panchang 700, 56-72px)               │
│   "A maioria dos sites parece igual."   │
│                                         │
│   Sub Satoshi 300, 15-17px, off-white/60│
│   "Pouca personalidade. Pouca           │
│    diferenciação. Pouco impacto."       │
│                                         │
└─────────────────────────────────────────┘
```

**Hierarquia:**
- Headline ocupa coluna esquerda
- Cubos genéricos preenchem o resto, são o "argumento visual"

### Three.js animation

**Componente:** `<GenericGrid>` — campo de cubos wireframe idênticos.

**Geometria:**
- Grid 6×6×3 = 108 cubos
- Cada cubo: `BoxGeometry(0.6, 0.6, 0.6)` em wireframe
- Material: `LineBasicMaterial` color `#F5F2ED` opacity 0.18
- Posições: grid regular (sem jitter — propósito é "todos iguais")
- Distância entre cubos: 1.5 unidades
- Câmera: fixa, levemente acima (Y=4), olhando ligeiramente pra baixo

**Animação:**
- **Build (entrada na seção):** cubos entram em waves diagonais (0 → 1.2s), opacity 0 → 0.18, stagger 25ms por cubo. Total ~3s.
- **Idle:** todos os cubos têm rotação Y muito sutil (0.05 rad/s) — TODOS no mesmo timing. Reforça "iguais, sincronizados, sem alma".
- **Highlight progressivo:** conforme scroll percorre a seção, UM ÚNICO cubo (centro) muda de comportamento:
  - Wireframe começa a perder opacidade (.18 → 0.05)
  - Em seu lugar, EM SUA SILHUETA, uma **torre triangulada** (similar ao fragmento da Paisagem) começa a se formar
  - Eco visual de "esse é o que será CbM" — preview do que vem
  - Esse "cubo transformado" tem apex vermelho `#FB3640`
- **Saída:** todos os cubos fazem fade out simultâneo durante a transição pra Serviços (0.6s)

**Implementação técnica:**
- Mesh único com `InstancedBufferGeometry` pros 108 cubos (perf)
- Cubo transformado é uma `Mesh` separada substituindo a posição central
- Scroll progress (0..1) → derivação da opacidade do cubo central + reveal da torre

### Interação
- 100% scroll-driven. Sem hover. Sem click.
- Cursor: default (não triangle aqui — usuário só passa).

### Transição **entrada** (de Paisagem)
- Paisagem termina com fade-out das UIs + fragmentos recolhem
- 0-30vh do scroll da PROBLEMA: cubos fade-in
- Câmera desce levemente como se "saindo do plano dos fragmentos pra ver o problema dos outros"

### Transição **saída** (pra Serviços)
- Cubo central completa transformação em torre
- Outros cubos fazem fade-out (escalonado da borda pro centro, ~0.8s)
- Torre central fica brevemente isolada no escuro
- Serviços começa a montar (próxima seção)

### Mobile
- Grid reduzido: 4×4×2 = 32 cubos
- Câmera mais próxima
- Sem rotação idle (perf)

---

## 5. SERVIÇOS — "Construímos presença digital"

**Propósito:** apresentar os 3 produtos. Categoria comercial clara.

**Altura:** 100vh

**Copy oficial:**
- **Headline:** "Construímos presença digital."
- **Sub:** "Para empresas que levam a sério."
- **3 serviços** (cards):

| Card | Título | Descrição |
|------|--------|-----------|
| 01 | Landing Pages | Sites de conversão. Foco em uma única ação. Performance e clareza. |
| 02 | Sites Institucionais | Presença digital completa. Estrutura, autoridade, profundidade. |
| 03 | Experiências Web | Interfaces que surpreendem. Para quem quer se diferenciar. |

### Layout

```
┌─────────────────────────────────────────┐
│  HEADLINE centralizado                  │
│  Construímos presença digital.          │
│  Para empresas que levam a sério.       │
│                                         │
│  ┌───┐    ┌───┐    ┌───┐                │
│  │ 01│    │ 02│    │ 03│                │
│  │ LP│    │ SI│    │ EW│                │
│  │   │    │   │    │   │                │
│  │mini│   │mini│   │mini│               │
│  │ 3D │   │ 3D │   │ 3D │               │
│  └───┘    └───┘    └───┘                │
│                                         │
└─────────────────────────────────────────┘
```

### Visual de cada card

**Box:**
- 320×420px desktop, full-width mobile
- `bg-[#0E1810]` Forest Dark
- `border-[1px] border-[#1a2a1e]`
- Sem border-radius
- Hover: `border-[#F5F2ED]` + leve elevação (translateY -4px)
- Border ativa (foco): `border-[#2a4a32]` com 2px

**Conteúdo:**
- Numeração "01" / "02" / "03" no topo esquerdo (Panchang 600, 11px, tracking 0.15em, off-white/45)
- Mini canvas 3D (240×160px) no centro
- Título (Panchang 700, 24-28px)
- Descrição (Satoshi 400, 14-15px, off-white/65)
- Link "Saber mais →" (Satoshi 500, 11px, uppercase, tracking 0.3em, triângulo vermelho rotacionando no hover)

### Three.js animation por card

Cada card tem um **mini-canvas dedicado** (não compartilhado com o Home Canvas, pois são scenes independentes e pequenas). Trade-off aceito: 3 canvases extras de 38KB cada, mas cada um tem geometria minúscula.

**Card 01 — Landing Pages:**
- Visual: **silhueta tall vertical** triangulada (eco do preview tall do ProjectCard da Paisagem)
- 3 colunas verticais com 5 segmentos cada, conectadas por triângulos
- Como uma "página alta sendo construída"
- Animação idle: scroll vertical lento (translateY oscilando -2 a +2, período 8s)
- Hover: aceleração + apex vermelho aparece no topo

**Card 02 — Sites Institucionais:**
- Visual: **estrutura horizontal em camadas** — 4 níveis empilhados de wireframes
- Eco de "site de várias seções"
- Animação idle: cada camada respira em fase deslocada
- Hover: linhas verticais conectando os níveis aparecem (estrutura "construída")

**Card 03 — Experiências Web:**
- Visual: **torre triangular complexa** (mais nós que a torre da Paisagem) com órbita de pontos ao redor
- Eco de "interface viva"
- Animação idle: torre rotaciona Y suave, pontos orbitam em planos diferentes
- Hover: pontos colidem com a torre acendendo apex vermelho

**Implementação:**
- Componente comum: `<ServiceMiniScene type="landing"|"institutional"|"experience" hovered={...} />`
- Câmera fixa por scene, sem scroll-driven
- Material padrão: linhas off-white opacity 0.7
- `frameloop="demand"` se possível, ou "always" se animação idle precisa rodar

### Cards build-in animation

Inspirado no [next-steps.md item 2.1](2026-06-04-next-steps.md):
- **Stroke-dashoffset border draw:** cada card tem uma borda SVG sobreposta que se "desenha" no scroll
- Quando card entra no viewport (IntersectionObserver), border draw começa
- Duração: 0.9s ease-build
- Stagger entre cards: 150ms

### Interação
- Hover: card destaca, mini-3D acelera
- Click: navega pra (futura) page `/servicos/[slug]` OU expande inline OU abre modal — **DEFINIR**. Recomendação: navegar pra page dedicada (clareza > experiência inline).

### Transição **entrada** (de Problema)
- Cubo transformado em torre da Problema "explode" em fragmentos
- Fragmentos voam pra fora (escala 1.5x, fade)
- Headline de Serviços fade in (0.8s, ease-build)
- Cards aparecem com stroke-draw stagger

### Transição **saída** (pra Laboratório)
- Cards fade out simultâneo
- Background gradient sutil: o terreno residual começa a aparecer
- Laboratório toma over

### Mobile
- Cards stack vertical
- Mini 3D mantido mas tamanho reduzido
- Sem hover (touch)

---

## 7. LABORATÓRIO — Resumido / Teaser

**Propósito:** mostrar que existe um Lab (validação técnica), criar curiosidade pra `/lab`.

**Altura:** 100vh

**Copy:**
- **Eyebrow:** "Bastidor"
- **Headline:** "Onde validamos antes de construir."
- **Sub:** "8 experimentos técnicos pra reduzir risco e garantir entrega."
- **CTA:** "Visitar Laboratório →"

### Layout

```
┌─────────────────────────────────────────┐
│                                         │
│   [3D layer: ProjectFragments]          │
│   campo de fragments pequenos           │
│   espalhados, baixa intensidade         │
│                                         │
│   ┌─────────────────────────┐           │
│   │ Eyebrow                  │           │
│   │ Headline                 │           │
│   │ Sub                      │           │
│   │ [Botão Secundário]       │           │
│   └─────────────────────────┘           │
│                                         │
│   ┌─ Lab Metrics ────────────┐          │
│   │ 8 experiments · 12k loc │          │
│   │ React Three Fiber · GSAP│          │
│   └──────────────────────────┘          │
│                                         │
└─────────────────────────────────────────┘
```

### Three.js animation

**Componente:** `<LabResidualField>` — reuso do ProjectFragments mas com configuração diferente.

**Diferenças do ProjectLandscape:**
- 9 fragmentos pequenos (não 6 com torres altas)
- Escala 0.6 (não 1.8 ou 2.4)
- Edge opacity 0.25 (mais discreto)
- Sem hover, sem click (apenas decorativo)
- Animação ambiente sutil: yawPeriod 60s (muito lento)
- Sem auto-rotate de câmera (estática)

**Câmera:**
- Position [4, 3, 14], target [0, 0, 0]
- FOV 35° (mais teleobjetiva, distanciada)

### Componente secundário: "Lab Metrics"

Pequeno bloco no rodapé com números/tags. Sem 3D, HTML puro:

```
EXPERIMENTOS    LINHAS DE CÓDIGO    STACK
8               ~12.000             R3F · GSAP · TypeScript
```

Each metric em Panchang 800 (números grandes), label em Satoshi 500.

### Interação
- Botão "Visitar Laboratório" → `/lab` (já existe)
- Cursor triangle no canvas area
- Sem outras interações

### Transição **entrada** (de Serviços)
- Card de Serviços faz fade out (0.5s)
- Fragments aparecem na área 3D (stagger 0.22s entre fragments, total ~2s)
- Headline + CTA fade in (delay 0.4s do start dos fragments)

### Transição **saída** (pra Processo)
- Fragments perdem opacidade total (~0.5s)
- Background fica limpo
- Processo monta SVG vertical/horizontal

### Mobile
- Fragments reduzidos pra 5
- Headline maior peso, CTA full-width
- Metrics em 1 coluna

---

## 8. PROCESSO — Linha SVG narrativa

**Propósito:** mostrar como o trabalho acontece. Reforçar estrutura e método.

**Altura:** 100vh

**Copy:**
- **Eyebrow:** "Método"
- **Headline:** "Cada projeto passa por 4 etapas."
- **Sub:** "Estrutura clara. Sem improvisos."

**4 etapas:**

| # | Etapa | Descrição curta |
|---|-------|-----------------|
| 01 | Estratégia | Diagnóstico, escopo, posicionamento |
| 02 | Design | Arquitetura, identidade, protótipo |
| 03 | Código | Implementação, performance, qualidade |
| 04 | Resultado | Mensuração, ajustes, evolução |

### Layout

Desktop: **horizontal** com SVG line conectando 4 nodes.
Mobile: **vertical** com line connecting top→bottom.

```
DESKTOP:
┌─────────────────────────────────────────┐
│  Eyebrow + Headline                      │
│                                         │
│  ●─────────●─────────●─────────●        │
│  01        02        03        04       │
│  Estratégia Design   Código   Resultado │
│  desc       desc     desc     desc      │
│                                         │
└─────────────────────────────────────────┘
```

### Visual

**Nodes:**
- Pequeno triângulo SVG (eco da Paisagem) ou círculo wireframe
- Cor: off-white normal, vermelho quando ativo (scroll passou)
- Tamanho: 24px diameter

**Line conectora:**
- SVG path stroke 1px, color `#FB3640`, opacity 0.5
- **stroke-dasharray + stroke-dashoffset animation:** desenha conforme scroll progride
- Quando atinge o próximo node, ele "acende" (color flip + scale 1.2 brief pulse)

**Cards de etapa:**
- Cada card: número, título, descrição
- Layout simples, sem border (a linha é o conector visual)
- Title Panchang 600, 18-20px
- Description Satoshi 400, 13-14px, off-white/65

### Three.js
**Off.** Esta seção é pura HTML + SVG. Documentado em [09-home-integration-plan.md](../../09-home-integration-plan.md) como 3D = "Off".

Background pode ter um terrain residual ULTRA SUTIL (opacity 0.05) se quiser manter coesão, mas não obrigatório.

### Animação SVG

**Hook:** `useScrollLineDrawer` (novo) — escuta scrollProgress da seção, atualiza stroke-dashoffset:

```ts
const lineLength = pathRef.current.getTotalLength();
useEffect(() => {
  const sub = onScroll((progress) => {
    pathRef.current.style.strokeDashoffset = `${lineLength * (1 - progress)}`;
  });
  return sub;
}, []);
```

**Nodes ativam:** quando scrollProgress passa do threshold (0.25, 0.5, 0.75, 1.0), o node correspondente ativa via class change + GSAP pulse.

### Interação
- Hover no node: tooltip com detalhes da etapa (HTML overlay)
- Click no node: scrolls suave até a posição daquele node (acessibilidade)

### Transição **entrada** (de Laboratório)
- Lab residual fragments dissolvem
- Background limpo
- SVG line aparece traço por traço (delay no segundo segmento, etc.)
- Cards de etapa fade in stagger 150ms

### Transição **saída** (pra Sobre)
- SVG line completa
- Todos os nodes vermelhos
- Pequena pausa (efeito "respirar")
- Fade out completo (0.8s)
- Sobre entra com texto

### Mobile
- Layout vertical
- Line vertical à esquerda das cards
- Mesmo princípio de animation

---

## 9. SOBRE — HTML puro, 3D off

**Propósito:** humanizar a marca. Quem é a pessoa por trás. Onde fica.

**Altura:** 120vh

**Copy oficial** (de [11-home-wireframe.md](../../11-home-wireframe.md)):

> "A Coded by M une design, tecnologia e pensamento estrutural pra construir presença digital que reflete a qualidade real das empresas."

**Info adicional:**
- Florianópolis, Brasil. Desde 2024.
- Fundador: M (nome a definir/preencher se quiser personal branding)
- Background: anos de design + dev, vindo de ____ (definir)

### Layout

```
┌─────────────────────────────────────────┐
│                                         │
│  ┌──────────┐  Manifesto / Bio          │
│  │          │                            │
│  │   Foto   │  "A Coded by M une..."    │
│  │  ou      │                            │
│  │   logo   │  Florianópolis · 2024     │
│  │  wireframe│                            │
│  └──────────┘                            │
│                                         │
│  ────────────                            │
│                                         │
│  Valores em 3 colunas (Precisão ·        │
│  Elegância · Detalhismo)                │
│                                         │
└─────────────────────────────────────────┘
```

### Visual

**Coluna esquerda — Foto/Logo:**
- Opção A: foto real (preto e branco, alto contraste)
- Opção B: símbolo CbM em wireframe (recomendado se prefere não-personal)
- 320×320px desktop

**Coluna direita — Texto:**
- Manifesto em Panchang 600, 28-32px, max 480px width
- Info Satoshi 400, 14px, off-white/65
- Tag de localização: pequeno marcador SVG + "Florianópolis, BR"

**3 Valores:**
- Cards/colunas com cada valor (Precisão · Elegância · Detalhismo)
- Cada um: título grande Panchang 500 + curta descrição

### Three.js
**Off completamente.** Pode ter um background sutil estático (~5% opacity terrain) só pra textura. Sem animação ativa.

### Animação

**Apenas GSAP/scroll-trigger:**
- Texto fade-in + translateY stagger
- Coluna foto fade-in com slight scale (1.02 → 1)
- Valores em stagger (150ms)
- Nenhum 3D ativo

### Interação
- Sem interação ativa
- Cursor default

### Transição **entrada** (de Processo)
- Processo line completa
- Fade out de tudo do Processo
- Sobre emerge com slight delay (~0.4s gap)
- Manifesto headline tem o stagger mais longo (palavras por palavras se quiser eco da Philosophy)

### Transição **saída** (pra CTA Final)
- Sobre fade out
- Background gradient: começa a escurecer ainda mais
- Fragments começam a aparecer dispersos pra CTA Formation

### Mobile
- Stack vertical: foto em cima, texto embaixo, valores em coluna única

---

## 10. CTA FINAL — CTAFormation + copy + botão

**Propósito:** converter. Último momento, máximo peso.

**Altura:** 150vh

**Copy oficial:**

> "Boas empresas constroem produtos."
> "Grandes empresas constroem **percepção**." (percepção em red `#FB3640`)
> 
> "Vamos construir a sua presença digital."
>
> CTA: **Iniciar Projeto** (MeshButton — já existe)

### Layout

```
┌─────────────────────────────────────────┐
│                                         │
│         [3D layer: CTAFormation]        │
│         fragments convergindo           │
│         pra formar símbolo CbM          │
│                                         │
│         Headline 1                       │
│         "Boas empresas constroem"       │
│         "produtos."                      │
│                                         │
│         Headline 2 (com red)             │
│         "Grandes empresas constroem"    │
│         "percepção."                     │
│                                         │
│         Body                             │
│         "Vamos construir a sua          │
│          presença digital."             │
│                                         │
│         [MeshButton: Iniciar Projeto]   │
│                                         │
└─────────────────────────────────────────┘
```

### Three.js: CTAFormation (o componente que falta no Lab — único ainda não implementado)

**Conceito:** dezenas de pequenos fragmentos triangulados aparecem dispersos pela tela, voam em direção ao centro, e quando chegam **formam o símbolo da marca** (triângulo wireframe principal do CbM).

**Fases:**

**Fase 1 — Dispersão (0-30% scroll da seção):**
- ~60 fragments triangulares pequenos (scale 0.3)
- Aparecem em posições random em uma esfera de raio 15
- Velocidade lenta de drift (drift random walk, amplitude 0.5)
- Opacidade baixa (0.4 cada)
- Cada um rotaciona em eixo aleatório (devagar)

**Fase 2 — Convergência (30-60% scroll):**
- Fragments começam a se mover em direção ao centro
- Cada um tem um destino calculado (formando o triângulo CbM em wireframe)
- Movimento: GSAP tween de position com easing `power2.inOut`
- Velocidade aumenta gradualmente

**Fase 3 — Formação (60-85% scroll):**
- Fragments chegam aos destinos
- Triângulo principal do CbM emerge (apex vermelho aparece no topo)
- Pequena pausa "respirando" (oscilação Y muito sutil)
- Headlines (HTML overlay) fade-in em stagger

**Fase 4 — Ação (85-100% scroll):**
- MeshButton aparece (build com mesh animation, já existe)
- Triângulo CbM continua respirando
- Background fade pra cinza muito escuro (eco de "estúdio de luz baixa")

### Animação técnica

```ts
// Para cada fragment (60 total)
interface FragmentParticle {
  startPos: Vector3;          // random na esfera
  finalPos: Vector3;          // posição no símbolo CbM
  delay: number;              // stagger (0..0.8s)
  rotAxis: Vector3;           // eixo de rotação random
}

// scroll progress 0..1 → fase
// fase 1: positions = startPos + driftRandom(t)
// fase 2: positions = lerp(startPos, finalPos, easeInOut((scroll - 0.3) / 0.3 - delay))
// fase 3: positions = finalPos + tinyBob(t)
```

**Geometria de cada fragmento:**
- Triangle wireframe pequeno (3 nodes + 3 edges)
- 1 apex node colorido (random pra ter diversidade)
- 70% off-white, 30% red (apenas alguns têm apex vermelho)

**Símbolo CbM final:**
- Triângulo principal vertical (~5 unidades altura)
- Subdividido em 3 sub-triângulos internos (eco do mesh)
- Apex vermelho

### Copy treatment

**Headlines:**
- "Boas empresas constroem produtos." — Panchang 800, 56-72px, off-white
- "Grandes empresas constroem **percepção**." — mesma, com "percepção" em `#FB3640`
- Stagger word-by-word (eco da Philosophy)

**Body:**
- Satoshi 300, 18-20px, off-white/85
- Fade-in simples

**MeshButton:**
- Label: "Iniciar Projeto"
- Tamanho atual já é apropriado
- Click: leva pra `/contato` ou abre `mailto:contato.codedbym@gmail.com?subject=Iniciar Projeto`

### Interação
- Drag/orbit do símbolo? NÃO. Simplicidade > exploração aqui.
- Cursor triangle na área de canvas
- Botão é o foco principal

### Transição **entrada** (de Sobre)
- Sobre fade-out
- Background escurece progressivamente
- Fragmentos aparecem dispersos (fade-in stagger lento, 1.5s total)
- Após dispersão completa, headlines começam a aparecer

### Transição **saída** (pra Footer)
- Símbolo CbM continua visível mas faz fade
- Background continua escuro
- Footer (HTML simples) emerge embaixo

### Mobile
- Símbolo menor (radius da formation reduzido)
- Headlines em vh maior (2 linhas → 3+ linhas)
- MeshButton full-width

---

## 11. FOOTER

**Propósito:** fecho elegante. Info técnica.

**Altura:** ~40vh (~280px desktop, mais altura mobile)

### Layout

```
┌─────────────────────────────────────────┐
│  [Logo CbM]    Projetos · Lab · Sobre   │
│                Contato                  │
│                                         │
│  ─────────────────────────────────      │
│                                         │
│  Florianópolis, BR        © 2026 CbM    │
│  @codedbymstudio          Designed +    │
│                           coded by M    │
└─────────────────────────────────────────┘
```

### Conteúdo

**Esquerda:** Logo (SVG estático, sem animation) + tag "Coded by M"

**Centro/Direita:** Nav links
- Projetos
- Laboratório
- Sobre
- Contato

**Linha divisória:** 1px solid `#1a2a1e`

**Rodapé:** 2 colunas
- Esquerda: Localização + handle social
- Direita: copyright + "Designed + coded by M"

### Three.js
**Off completamente.** HTML puro.

### Animação
**Mínima.** Apenas fade-in suave quando entra no viewport. Hover nos links: underline animation.

### Interação
- Links navegam
- Social link abre instagram em nova tab

### Mobile
- Stack vertical
- Logo + nav, depois divisória, depois info rodapé

---

# Transições entre seções (resumo)

| De → Para | Mecânica principal | Duração total |
|-----------|-------------------|---------------|
| Loading → Logo build | (já existe) | — |
| Logo → Philosophy | (já existe) | — |
| Philosophy → Paisagem | 3D flip 60° (já existe) | ~1.2s |
| **Paisagem → Problema** | Fragments dissolvem · cubes appear · Camera desce | ~1.5s |
| **Problema → Serviços** | Cubo central completa torre · outros fade · cards build | ~1.0s |
| **Serviços → Laboratório** | Cards fade · Fragments aparecem stagger | ~1.5s |
| **Laboratório → Processo** | Fragments fade · SVG line draws | ~1.0s |
| **Processo → Sobre** | Line completa · fade total · texto entra | ~0.8s |
| **Sobre → CTA Final** | Sobre fade · bg escurece · dispersão fragments | ~1.8s |
| **CTA → Footer** | Símbolo CbM permanece · footer emerge embaixo | ~0.5s |

**Total de animation entre Paisagem e Footer:** ~9 segundos de transitions distribuídas ao longo do scroll natural.

---

# Princípios de transição (do [09-home-integration-plan.md](../../09-home-integration-plan.md))

- Transições baseadas em **scroll progress** (não tempo absoluto)
- Cada transição é uma "respiração" — 2-3 frames de pausa entre fade-out e fade-in
- Camera não corta — sempre tem continuity (mesmo target ou easing entre alvos)
- HTML overlay nunca aparece simultaneamente com canvas em rebuild (fade canvas → swap → fade html)

---

# Implementação: priorização sugerida

## Sprint 1 — Polish da home base (1-2 sessões)
- Componente `<HomeCanvas>` que gerencia troca de cena (referenciado em 08-component-architecture.md mas talvez não implementado)
- `useScrollOrchestrator` mestre

## Sprint 2 — Serviços (2 sessões)
- Componente `<ServicesSection>` com 3 cards
- Mini-scenes 3D
- Border draw animation

## Sprint 3 — Problema (1 sessão)
- `<ProblemSection>` com GenericGrid
- Animação da transformação do cubo central

## Sprint 4 — Processo (1 sessão)
- `<ProcessSection>` com SVG line + 4 nodes
- Hook `useScrollLineDrawer`

## Sprint 5 — Sobre (1 sessão)
- `<AboutSection>` HTML puro
- Decisão: foto vs símbolo

## Sprint 6 — Laboratório resumido (1 sessão)
- `<LabTeaserSection>` reusando ProjectFragments

## Sprint 7 — CTA Final (3 sessões — mais ambicioso)
- Componente novo `<CTAFormation>`
- 60 fragments com pathing
- Símbolo CbM em wireframe
- Headlines staggered

## Sprint 8 — Footer + integração (1 sessão)
- `<HomeFooter>` HTML
- Wire de todas as seções no fluxo principal

## Sprint 9 — Polish final + transições refinadas (2 sessões)
- Refinar cada transição
- QA mobile
- Performance pass

**Total estimado:** 12-14 sessões pra fechar a Home completa.

---

# Conceitos novos por seção (recap)

| Seção | Componentes 3D novos | Componentes HTML novos | Hooks novos |
|-------|---------------------|----------------------|-------------|
| Problema | `<GenericGrid>` (InstancedMesh) | `<ProblemCopy>` | — |
| Serviços | `<ServiceMiniScene>` (3 variants) | `<ServiceCard>` (border-draw) | `useBorderDraw` |
| Laboratório | (reuso `<ProjectFragments>`) | `<LabTeaserCopy>`, `<LabMetrics>` | — |
| Processo | (off) | `<ProcessTimeline>`, `<ProcessNode>` | `useScrollLineDrawer` |
| Sobre | (off) | `<AboutHero>`, `<ValuesTriad>` | — |
| CTA Final | `<CTAFormation>` (novo!) | `<CTACopy>` | `useFormationProgress` |
| Footer | — | `<HomeFooter>` | — |

---

# Considerações técnicas globais

## Canvas Strategy

**Opção A — Canvas único na Home (preferida por 08-component-architecture.md):**
- 1 `<Canvas>` envelopando toda a home
- Cada zona renderiza/desmonta sua scene baseado em scroll progress
- Câmera persistente, transitions via tweens
- **Prós:** menos contexto WebGL, transições suaves
- **Contras:** complexidade de coordenação

**Opção B — Canvas por zona (simplicidade):**
- Cada seção tem seu próprio Canvas montado/desmontado por IntersectionObserver
- **Prós:** isolamento total, fácil de raciocinar
- **Contras:** mais contextos WebGL (cuidado mobile), transições entre canvases são "cortes"

**Recomendação:** começar com **Opção B** pra simplicidade. Migrar pra A se mobile tiver problemas de perf.

## Scroll global

- Manter Lenis no nível root (já implementado)
- Cada seção exposta no scroll global como sub-progress
- IntersectionObserver pra `frameloop="demand"` em scenes off-viewport

## Reduced motion

Em `prefers-reduced-motion: reduce`:
- Sem animações 3D ambiente (yawPeriod = infinito)
- Sem auto-rotate
- Sem stroke draws — texto e cards aparecem instantâneo
- Apenas fades simples (opacity)
- Sem stagger entre elementos

## Performance budget

Por zona (alvo):
- 3D mesh count < 200 (Paisagem é exceção)
- Draw calls < 30 (Paisagem 50)
- Shader uniforms < 20
- Cada `<Canvas>` < 60KB JS quando code-split

## Mobile

- DPR cap [1, 1.5] sempre
- Reduzir contagem de fragments/cubes em 30-50%
- Disable shadows
- `frameloop="demand"` mais agressivo

---

# Próxima sessão sugerida

**Começar por Serviços** — é a próxima zona natural após a Paisagem, tem layout claro, é cards (não puro 3D), e é o tipo de seção comercial que valida que a Home não é só "experiência" mas também produto. Bonus: forma um padrão de `<ServiceCard>` + `<ServiceMiniScene>` que serve de blueprint pros próximos.

Alternativa: começar por **Processo** (menos 3D, mais conteúdo) se quiser construir momentum com algo mais simples primeiro.

---

# Resumo executivo (1 parágrafo)

A Home tem 11 zonas, 4 implementadas (Loading + Logo + Philosophy + Paisagem). Faltam 7 zonas (Problema, Serviços, Laboratório resumido, Processo, Sobre, CTA Final, Footer) e suas transições. Cada zona tem propósito narrativo, copy oficial dos docs, e tratamento visual coerente com o vocabulário (wireframe + Satoshi + paleta deep black/off-white/red). Three.js intenso em Problema (cubos genéricos transformando), Serviços (mini-scenes por card), Laboratório (fragments residuais) e CTA Final (CTAFormation — único componente realmente novo a desenvolver). Processo + Sobre + Footer são HTML+SVG. Estimativa: 12-14 sessões. Recomendação: começar por Serviços ou Processo.
