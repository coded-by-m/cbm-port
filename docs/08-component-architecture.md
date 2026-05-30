# 08 — Component Architecture

# Coded by M — Arquitetura de Componentes da Home

## 1. Objetivo do Documento

Transformar os experimentos validados no Experience Lab em uma arquitetura real de
componentes para a Home da Coded by M.

Este documento é a ponte entre a fase de pesquisa técnica (Lab) e a fase de
implementação do site principal. Ele define o que construir, de onde vem cada
peça, como as camadas se relacionam e em que ordem executar.

Não é um documento de design visual. É a planta baixa do código.

---

## 2. Princípio Geral da Arquitetura

A Home é construída sobre quatro camadas independentes que operam em paralelo:

```
┌─────────────────────────────────────┐
│  OVERLAY LAYER  — Cards, CTAs       │  ← HTML acessível sobre o 3D
├─────────────────────────────────────┤
│  HTML LAYER     — Conteúdo, SEO     │  ← Texto, seções, botões
├─────────────────────────────────────┤
│  MOTION LAYER   — Scroll, Timelines │  ← GSAP + Lenis orquestram tudo
├─────────────────────────────────────┤
│  3D LAYER       — Ambiente visual   │  ← R3F + Three.js, um único Canvas
└─────────────────────────────────────┘
```

Regra central: nenhum texto de conteúdo vive dentro do Canvas. SEO, acessibilidade
e conversão são responsabilidade do HTML. O Canvas é o ambiente imersivo, nunca o
veículo da mensagem.

---

## 3. As Quatro Camadas

### 3.1 HTML Layer

Responsabilidade: conteúdo, SEO, conversão.

- Títulos, subtítulos, parágrafos, listas
- Botões de CTA e links de navegação
- Seções estruturais (Problema, Serviços, Processo, Sobre)
- Metadados, headings semânticos, alt text

Tecnologia: Next.js · TypeScript · Tailwind CSS

Regra: qualquer texto que o cliente precise ler ou o Google precise indexar fica
aqui.

---

### 3.2 Motion Layer

Responsabilidade: narrativa de scroll, transições, sincronização.

- Controla quando cada seção HTML entra e sai de cena
- Sincroniza o progresso do scroll com os keyframes da câmera 3D
- Pina seções durante transições
- Orquestra timelines entre texto e estrutura visual

Tecnologia: GSAP · ScrollTrigger · Lenis

Regra: a Motion Layer não renderiza nada. Ela instrui as outras camadas.

---

### 3.3 3D Layer

Responsabilidade: ambiente, imersão, linguagem visual da marca.

- Um único Canvas por rota (nunca múltiplos `<Canvas>` na Home)
- Gerencia cenas distintas por seção: Loading, Intro/Hero, Paisagem Digital, CTA
- Transições internas entre cenas dentro do mesmo Canvas
- Câmera controlada por progresso de scroll (exposto pela Motion Layer)

Tecnologia: React Three Fiber · Three.js · Drei

Regra: o Canvas é `position: fixed` ou `absolute inset-0` e nunca compete com o
conteúdo HTML em z-index.

---

### 3.4 Overlay Layer

Responsabilidade: conteúdo acessível ancorado ao 3D.

- Cards de projeto projetados sobre fragmentos 3D
- Conectores visuais (linha técnica + ponto âncora)
- Modais e painéis compactos no mobile
- CTAs sobre cenas 3D (CTA Final)

Tecnologia: HTML + Tailwind · GSAP (entrada/saída) · projeção 3D→2D via R3F

Regra: a Overlay Layer nunca entra no Canvas. A projeção é feita no loop de frame
(`useFrame`) e escrita imperativamente no elemento DOM, sem re-render a 60fps.

---

## 4. Mapeamento dos Experimentos do Lab para a Home

| Experimento         | Status  | Mapeamento na Home                                      |
|---------------------|---------|---------------------------------------------------------|
| Triangle Loader     | ready   | Loading screen + padrão de construção no CTA Final      |
| Triangle Lines      | ready   | Intro (estrutura nasce) + Hero background (malha viva)  |
| Terrain Mesh        | ready   | Base do terreno na Paisagem Digital                     |
| Project Fragments   | ready   | Hotspots de projetos na Paisagem Digital                |
| HTML Overlay        | ready   | Cards de projeto na Paisagem Digital (produção)         |
| Scroll Camera       | ready   | Narrativa de câmera na Paisagem Digital (400 vh)        |
| CTA Formation       | planned | CTA Final — fragmentos convergem para o símbolo         |

Todos os seis experimentos prontos têm equivalente direto na Home. O CTA Formation
é o único que ainda precisa ser implementado do zero.

---

## 5. Arquitetura da Home por Seção

### 5.1 Loading — 100 vh

**Objetivo:** mascarar o carregamento, iniciar a narrativa, apresentar o princípio
"nada surge pronto, tudo é construído".

**Camadas ativas:**
- 3D Layer: cena do Triangle Loader (pontos → linhas → triângulo wireframe → rotação lenta)
- Motion Layer: GSAP timeline de entrada, dispara a transição para Intro quando completa

**O que vem do Lab:**
- `TriangleLoader` integralmente
- `useTriangleAnimation` — sequência construção → rotação
- `useOrganicMotion` — respiração + micro-inclinação em loop
- `useResponsiveFit` (TriangleLoader) — enquadramento automático

**Adaptações para produção:**
- Conectar a saída da timeline à transição para a Intro (não remonta o componente)
- Expor um callback `onComplete` para que o orquestrador da Home libere o scroll
- Desacoplar o fundo: o `background` do Canvas deve ser coordenado com o `<body>`
  para evitar flash durante a transição

**Regras:**
- Sem texto durante o Loading — silêncio visual é sofisticação
- A cena de Loading deve fazer parte do mesmo Canvas da Home (não montado à parte)
  ou, se montado à parte, a transição deve parecer contínua

---

### 5.2 Intro — 200 vh

**Objetivo:** capturar atenção, construir a atmosfera, introduzir a linguagem
visual antes de qualquer mensagem comercial.

**Camadas ativas:**
- 3D Layer: malha triangulada crescendo (Triangle Lines adaptada)
- Motion Layer: ScrollTrigger pina a seção, o scroll controla `reveal` (0→1)
- HTML Layer: copy discreta — "Toda grande presença digital começa por uma ideia."

**O que vem do Lab:**
- `TriangleLines` — geometria procedural de nós e arestas em profundidade
- `useBuildAnimation` — construção escalonada camada a camada
- `useLivingMotion` — malha permanece viva em loop
- `useResponsiveFit` (TriangleLines)

**Adaptações para produção:**
- O `reveal` da construção passa a ser controlado pelo scroll (ScrollTrigger),
  não apenas por tempo como no Lab
- A câmera avança lentamente enquanto a malha cresce (micro-drift já existe em
  `useCinematicCamera`, adaptar para o contexto do scroll)
- Copy HTML aparece com entrada discreta via GSAP quando `reveal > 0.5`

---

### 5.3 Hero — 100 vh

**Objetivo:** responder imediatamente "o que a Coded by M faz".

**Camadas ativas:**
- 3D Layer: Triangle Lines em loop contínuo como background (malha viva, câmera estática)
- Motion Layer: entrada do texto (GSAP) sincronizada com a transição da Intro
- HTML Layer: título principal, subtítulo, dois CTAs ("Ver Projetos" / "Iniciar Projeto")

**O que vem do Lab:**
- Triangle Lines como background ambiente (já funciona em `frameloop="always"`)
- Padrão de câmera estática com micro-drift de `useCinematicCamera`

**Adaptações para produção:**
- A malha do Hero é a mesma da Intro — a câmera simplesmente estabiliza
- Texto e botões são HTML absoluto sobre o Canvas: `pointer-events: none` no Canvas,
  `pointer-events: auto` nos elementos clicáveis
- Navbar aparece na transição Intro→Hero

**Estrutura HTML do Hero:**
```
<section> Hero 100vh
  ├── <HomeNav> — aparece na entrada do Hero
  ├── <h1>  CODED BY M
  ├── <p>   Web Design Premium para empresas...
  └── <div> CTAs
        ├── <a> Ver Projetos
        └── <a> Iniciar Projeto
```

---

### 5.4 Problema — 80 vh

**Objetivo:** gerar identificação, mostrar que a maioria dos sites parece igual.

**Camadas ativas:**
- HTML Layer: copy do problema em destaque
- Motion Layer: entrada escalonada dos parágrafos (GSAP ScrollTrigger)
- 3D Layer: background do Hero continua vivo — sem nova cena 3D dedicada

**O que vem do Lab:** nenhum componente 3D novo. Background residual da malha.

**Adaptações para produção:**
- Pure HTML + GSAP
- Possível: fragmentos 3D repetidos em background com baixa opacidade para reforçar
  visualmente o conceito de "sites iguais" — avaliar em implementação

---

### 5.5 Serviços — 100 vh

**Objetivo:** deixar claro o que pode ser contratado.

**Camadas ativas:**
- HTML Layer: título, três serviços (Landing Pages · Sites Institucionais · Experiências Web)
- Motion Layer: cada serviço entra com microinteração via GSAP (linhas que constroem
  o contorno do card, depois texto surge)

**O que vem do Lab:** padrão de build animation (opacidade progressiva via GSAP).

**Adaptações para produção:**
- Cards em HTML puro — não usar canvas para serviços
- Hover state: border anima de 0 para 100% com CSS ou GSAP
- Mobile: animações simplificadas (entrada em fade + translate)

---

### 5.6 Paisagem Digital — 400 vh

**Objetivo:** principal assinatura visual da marca. Fazer o visitante pensar
"eu quero algo assim".

**Camadas ativas:**
- 3D Layer: TerrainMesh (base) + ProjectFragments (hotspots) integrados em uma cena
- Motion Layer: ScrollCamera (câmera percorre keyframes conforme scroll)
- Overlay Layer: ProjectCard + Connector (HTML sobre fragmento ativo)
- HTML Layer: label de seção, filtro opcional

**O que vem do Lab — reutilizado integralmente:**
- `TerrainMesh` — geometria, fog, camadas de profundidade
- `useTerrainBuild` — revelação do terreno
- `useCinematicCamera` — base da micro-deriva
- `ProjectFragments` — fragmentos triangulados com raycasting
- `useDiscovery` — hover/toque unificado
- `useFragmentBuild` — revelação escalonada
- `useOverlayStore` — bridge Canvas↔HTML (sem re-render a 60fps)
- `ProjectCard` — estrutura base do card (refinar conteúdo e estilo)
- `Connector` — linha técnica + ponto âncora
- `useScrollCamera` — câmera por keyframes com smoothstep
- `useScrollNarrative` — scroll → fragmento ativo
- `useScrollDriver` — Lenis + ScrollTrigger no container
- `useResponsiveFit` (TerrainMesh)

**Adaptações para produção:**
- Unificar TerrainMesh + ProjectFragments em uma única cena (`PaisagemScene`)
  — no Lab são experimentos separados; na Home são uma única composição
- `useScrollDriver` re-escopado para o scroll global da página (não container)
- `ProjectCard` recebe dados reais dos projetos (`/data/projects.ts`)
- Links do card apontam para `/cases/[slug]`
- Filtro opcional (Todos / Projetos / Conceitos) como HTML overlay sobre a cena
- Compact mode (mobile): painel inferior em vez de card lateral — já validado no Lab

**Estrutura técnica:**
```
<PaisagemSection>  400vh wrapper
  ├── sticky 100svh
  │     ├── <Canvas>  (3D Layer)
  │     │     └── <PaisagemScene>
  │     │           ├── <TerrainLayer × 3>
  │     │           └── <FragmentCluster>  (hotspots)
  │     ├── <Connector />         (Overlay Layer)
  │     ├── <ProjectCard />       (Overlay Layer)
  │     └── <FragmentFilter />    (HTML Layer — filtro)
```

---

### 5.7 Laboratório — 100 vh

**Objetivo:** mostrar evolução contínua, capacidade experimental.

**Camadas ativas:**
- HTML Layer: título, descrição curta, grid de prévia de experimentos, CTA "Explorar Laboratório"
- Motion Layer: entrada da seção com GSAP ScrollTrigger

**O que vem do Lab:** nenhum componente pesado. Possível: renderizar um experimento
leve (ex.: Triangle Lines) em loop numa área visual limitada (não full-screen).

**Adaptações para produção:**
- Grid de thumbnails (screenshot ou canvas pequeno em `frameloop="demand"`)
- Foco em clareza — mostrar que o Lab existe e tem conteúdo, não reproduzir o Lab inteiro

---

### 5.8 Processo — 100 vh

**Objetivo:** mostrar método, reduzir insegurança do cliente.

**Camadas ativas:**
- HTML Layer: quatro etapas (Estratégia → Design → Código → Resultado)
- Motion Layer: linhas SVG ou CSS que constroem o conector entre etapas conforme o scroll

**O que vem do Lab:** padrão de build animation (opacidade + surgimento sequencial).

**Adaptações para produção:**
- Sem canvas dedicado
- A linha conectora pode ser `<svg>` com `stroke-dasharray` animado via GSAP
- Cada etapa entra quando a linha a alcança

---

### 5.9 Sobre — 120 vh

**Objetivo:** humanizar a marca.

**Camadas ativas:**
- HTML Layer: texto sobre a Coded by M, filosofia, visão
- Motion Layer: entrada suave — sem construção de estruturas

**Regra:** menos animação, mais conteúdo. A cena 3D descansa. O background é
escuro neutro, sem canvas ativo — ou canvas com opacidade mínima herdado da seção
anterior em fade-out.

---

### 5.10 CTA Final — 150 vh

**Objetivo:** converter. Encerrar a narrativa com força.

**Camadas ativas:**
- 3D Layer: CTAFormation — fragmentos convergem para o símbolo da Coded by M
- HTML Layer: copy principal, copy secundária, botão "Iniciar Projeto"
- Overlay Layer: CTA sobre a cena 3D
- Motion Layer: scroll controla a convergência (progresso 0→1)

**O que vem do Lab:**
- Geometria de fragmentos (`ProjectFragments/geometry.ts`) como base dos fragmentos
  que convergem
- Padrão de GSAP timeline para construção (princípio aplicado inversamente: convergência)

**Adaptações para produção:**
- CTAFormation não está implementado — é o único componente novo significativo
- Precisa ser construído do zero: fragmentos espalhados → animação de convergência
  → símbolo estático
- Pode usar `useScrollCamera` como referência para o controle por scroll
- Símbolo final deve ser o triângulo da marca (derivado do TriangleLoader)

---

## 6. Componentes Principais Sugeridos

### 6.1 3D Layer

| Componente         | Origem                          | Descrição                                          |
|--------------------|---------------------------------|----------------------------------------------------|
| `<HomeCanvas>`     | novo                            | Canvas único para toda a Home; gerencia cenas      |
| `<LoadingScene>`   | TriangleLoader (adaptado)       | Construção + rotação; expõe `onComplete`           |
| `<IntroScene>`     | TriangleLines (adaptado)        | Malha crescendo controlada por `reveal` (scroll)   |
| `<HeroBackground>` | TriangleLines (adaptado)        | Malha viva em loop, câmera estabilizada            |
| `<PaisagemScene>`  | TerrainMesh + ProjectFragments  | Terreno + hotspots em uma cena unificada           |
| `<CTAScene>`       | novo (CTAFormation)             | Convergência de fragmentos → símbolo               |

### 6.2 HTML Layer

| Componente             | Descrição                                              |
|------------------------|--------------------------------------------------------|
| `<HomeNav>`            | Navbar fixa premium; reduz no scroll                   |
| `<HeroContent>`        | Título, subtítulo, dois CTAs                           |
| `<ProblemaSection>`    | Copy do problema; entrada GSAP por scroll              |
| `<ServicosSection>`    | Três serviços com microinteração de borda              |
| `<LaboratorioSection>` | Prévia do Lab; CTA para `/lab`                         |
| `<ProcessoSection>`    | Quatro etapas com linha conectora SVG animada          |
| `<SobreSection>`       | Conteúdo da marca; mínima animação                     |
| `<CTAFinalContent>`    | Copy + botão sobre a cena de convergência              |

### 6.3 Overlay Layer

| Componente          | Origem                     | Descrição                                        |
|---------------------|----------------------------|--------------------------------------------------|
| `<ProjectCard>`     | HtmlOverlay (refinado)     | Card com dados reais + link para case            |
| `<Connector>`       | HtmlOverlay (produção)     | Linha técnica âncora fragmento → card            |
| `<FragmentFilter>`  | novo                       | Filtro Todos / Projetos / Conceitos              |

---

## 7. Hooks Principais Sugeridos

| Hook                    | Origem                        | Responsabilidade                                      |
|-------------------------|-------------------------------|-------------------------------------------------------|
| `useScrollOrchestrator` | novo                          | Master timeline: Lenis + ScrollTrigger para toda Home |
| `useLoadingTransition`  | novo                          | Gerencia saída do Loading e entrada da Intro          |
| `useScrollProgress`     | ScrollCamera/useScrollDriver  | Progresso global 0..1 exposto por ref                 |
| `useScrollCamera`       | ScrollCamera (adaptado)       | Câmera por keyframes na Paisagem Digital              |
| `useScrollNarrative`    | ScrollCamera (igual)          | Progresso → fragmento ativo                           |
| `useOverlayStore`       | HtmlOverlay (igual)           | Bridge Canvas↔HTML sem re-render                     |
| `useDiscovery`          | ProjectFragments (igual)      | Hover/toque unificado em fragmentos                   |
| `useBreakpoint`         | novo (centralizado)           | Viewport responsivo; substitui instâncias dispersas   |
| `usePerformanceTier`    | novo                          | Detecta GPU fraco; dispara fallback                   |
| `useTerrainBuild`       | TerrainMesh (igual)           | Revelação do terreno (delay por camada)               |
| `useBuildAnimation`     | TriangleLines (igual)         | Construção escalonada de nós + arestas                |
| `useTriangleAnimation`  | TriangleLoader (adaptado)     | Construção do triângulo no Loading e no CTA           |
| `useOrganicMotion`      | TriangleLoader (igual)        | Respiração + micro-inclinação                         |
| `useCinematicCamera`    | TerrainMesh (adaptado)        | Micro-deriva contínua em seções sem scroll-camera     |

---

## 8. O Que Deve Ser Reutilizado do Lab

Os itens abaixo estão validados e podem ser trazidos para produção sem reescrita
substancial. Apenas configuração e integração precisam de ajuste.

**Geometria procedural** — toda a lógica de geração de vértices, arestas e nós:
- `TerrainMesh/geometry.ts` — geração de camadas, `sampleHeight`
- `TriangleLines/geometry.ts` — nós e arestas por camada
- `TriangleLoader/` — três vértices, três arestas, escalonamento
- `ProjectFragments/geometry.ts` — fragmento triangulado sobre o terreno

**Padrão de build animation** (GSAP timeline: pontos surgem → linhas conectam):
- `useTriangleAnimation`, `useBuildAnimation`, `useTerrainBuild`

**Padrão de estruturas vivas** (loop orgânico em `useFrame`):
- `useOrganicMotion`, `useLivingMotion`, `useCinematicCamera`

**Bridge Canvas↔HTML** (estado mutado imperativamente, sem re-render):
- `useOverlayStore` + `ProjectCard` + `Connector`

**Narrativa por scroll**:
- `useScrollCamera`, `useScrollNarrative`, `useScrollDriver`

**Interação com fragmentos**:
- `useDiscovery` (hover/toque unificado)
- `useFragmentBuild`

**Responsividade de câmera**:
- `useResponsiveFit` (existe nos três experimentos; centralizar em um único hook)

---

## 9. O Que Deve Ser Refeito para Produção

Os itens abaixo precisam de implementação nova ou refatoração significativa.

**`<HomeCanvas>` — Canvas único com gerenciamento de cenas**
No Lab, cada experimento tem seu próprio `<Canvas>`. Na Home, um único Canvas
percorre todas as cenas. Isso exige um sistema de transição interna entre cenas
(fade, dissolve) sem remontar o Canvas — padrão a ser definido na implementação.

**`<CTAScene>` — CTAFormation**
Não existe ainda. Precisa ser construído do zero. É o risco técnico mais alto
restante. Ver seção 14.

**`<ProjectCard>` — dados reais**
O card do Lab usa dados de mock. A versão de produção precisa de:
- tipagem do modelo de projeto (`/types/project.ts`)
- fonte de dados (`/data/projects.ts` ou CMS)
- link real para `/cases/[slug]`
- categorias para o filtro

**`useScrollDriver` re-escopado**
No Lab o scroll é de um container `overflow-y-auto` isolado. Na Home o scroll é
global (`window`). O `useScrollDriver` precisa suportar ambos os modos ou ser
reescrito para o scroll global.

**`useScrollOrchestrator` — orquestrador master**
Não existe no Lab. Precisa coordenar: saída do Loading, entrada da Intro, transição
de cenas dentro do Canvas, pinagem das seções, timelines de texto.

**`usePerformanceTier` — fallback de GPU**
Não existe no Lab. Em dispositivos fracos, o terreno deve ter resolução reduzida
(menos vértices) e animações de build simplificadas. Detectar via
`renderer.capabilities` após montagem do Canvas.

**`useBreakpoint` centralizado**
Cada componente do Lab tem sua própria instância de `useResponsiveFit`. Na Home,
centralizar em um único hook reutilizável para evitar múltiplos listeners de
`ResizeObserver`.

**Configurações de cena afinadas para produção**
Os configs do Lab (câmera, terreno, fragmentos, timing) são otimizados para
visualização isolada. Na Home, precisam ser revistos para coexistência: tamanho
do terreno, posição de câmera, densidade de fragmentos, fog.

---

## 10. Regras de Performance

**Canvas único por rota.**
Múltiplos `<Canvas>` na mesma página multiplicam o custo de WebGL. A Home usa
um único Canvas com transições internas de cena.

**`frameloop="demand"` em cenas estáticas.**
Loading e CTA Final podem usar `frameloop="demand"` (R3F só renderiza quando
invalidado). Intro, Hero, Paisagem Digital e CTAScene usam `"always"` por
necessidade de loop contínuo.

**DPR limitado.**
`dpr={[1, 1.5]}` no Canvas da Home (o Lab usa `[1, 2]`). Em mobile, DPR alto
é o maior causador de queda de FPS em cenas com terreno.

**Fog gerencia visibilidade.**
A névoa (`<fog>`) esconde a geometria distante sem culling manual. Manter
`FOG.near` e `FOG.far` ajustados para que os vértices além da névoa não sejam
processados visualmente.

**Geometria procedural, sem assets externos.**
Nenhum modelo importado (`.glb`, `.gltf`) na Home. Toda geometria é gerada em
código — sem tempo de download, sem parser de asset na thread principal.

**Sem post-processing na v1.**
Bloom, depth-of-field e outros passes de pós-processamento ficam fora da primeira
versão. Adicionar somente após validar que o FPS alvo (60fps desktop, 30fps mobile)
é atingido sem eles.

**Animações GSAP apenas em transformações.**
Animar `position`, `rotation`, `scale`, `opacity` — nunca `width`, `height` ou
propriedades que forçam layout reflow no HTML.

**Lazy load dos componentes 3D.**
Continuar o padrão do Lab (`dynamic(..., { ssr: false })`). O servidor não
renderiza WebGL. O bundle Three.js só é carregado no cliente.

**Budget alvo:**
- Desktop: < 60ms LCP · 60fps durante scroll na Paisagem Digital
- Mobile: < 90ms LCP · 30fps estável · fallback gracioso se GPU insuficiente

---

## 11. Regras de Responsividade

**`useBreakpoint` centralizado.**
Um único hook expõe `isCompact` (mobile/tablet com pointer grosso) para toda a Home.
Eliminar as instâncias isoladas de `useResponsiveFit` por componente.

**Compact mode na Paisagem Digital.**
Já validado no Lab (`useOverlayStore` detecta `pointer: coarse`). Em modo compacto:
- Card HTML vira painel deslizante na base da tela (não overlay lateral)
- Connector (linha técnica) não aparece
- Fragmento ativo é revelado pelo scroll, não por hover

**Terreno com resolução reduzida em mobile.**
O config do TerrainMesh deve ter variantes de densidade: `LAYERS_DESKTOP` (alta
densidade) e `LAYERS_MOBILE` (densidade ~50%). Aplicar com base em `isCompact`.

**Câmera sem micro-deriva em mobile.**
`useCinematicCamera` desabilitado em dispositivos compactos — câmera fixa economiza
cálculo por frame e a micro-deriva não é perceptível em telas menores.

**Seções HTML puras (Problema, Serviços, Processo, Sobre) não têm canvas.**
Responsividade é 100% CSS/Tailwind — nenhuma consideração de viewport 3D necessária.

**Loading e Hero funcionam em qualquer viewport.**
`useResponsiveFit` do TriangleLoader e TriangleLines já garante enquadramento
automático. Manter o comportamento na versão de produção.

**Testar breakpoints críticos:** 375px, 430px, 768px, 1024px, 1440px.

---

## 12. Regras de Acessibilidade

**Todo texto é HTML.**
Nenhuma string de conteúdo (título, copy, CTA, label de serviço) é renderizada
dentro do Canvas. Textos em `<Canvas>` são invisíveis para leitores de tela.

**Canvas com `aria-hidden="true"`.**
O elemento `<canvas>` não tem valor semântico para tecnologias assistivas. Marcar
explicitamente.

**Cards do projeto são HTML navegável.**
`<ProjectCard>` deve ter:
- `role="dialog"` quando aberto como painel
- `aria-label` com o nome do projeto
- foco movido para o card ao abrir
- foco retornado ao elemento que o abriu ao fechar
- `Escape` fecha o card

**CTAs com texto explícito.**
Botões "Ver Projetos" e "Iniciar Projeto" nunca são apenas ícones. Texto sempre
presente, mesmo que visualmente menor em mobile.

**`prefers-reduced-motion` obrigatório.**
Quando `window.matchMedia('(prefers-reduced-motion: reduce)').matches`:
- Pular animações de build (mostrar estado final direto)
- `useTerrainBuild` retorna `reveal = 1` imediatamente
- `useTriangleAnimation` pula para rotação estática
- Transições de página em fade curto (200ms) em vez de zoom cinematográfico
- `useLivingMotion` e `useOrganicMotion` param (`useFrame` retorna cedo)

**Contraste de texto sobre 3D.**
Cards e textos HTML sobre o canvas precisam de contraste mínimo WCAG AA (4.5:1).
Usar fundo semi-opaco nos cards quando o fundo 3D for imprevisível.

**Foco visível na navegação.**
`HomeNav` e todos os links/botões devem ter `focus-visible` estilizado — nunca
`outline: none` sem substituto.

---

## 13. Ordem Recomendada de Implementação

A ordem prioriza: validar fundações técnicas primeiro, construir conteúdo sobre
elas, escalar para as cenas mais complexas.

```
Fase 1 — Fundação
  1.  HomeCanvas (Canvas único, gerenciamento de cenas)
  2.  useScrollOrchestrator (Lenis + ScrollTrigger global)
  3.  useBreakpoint centralizado
  4.  LoadingScene (TriangleLoader adaptado com onComplete)

Fase 2 — Estrutura da Home
  5.  HomeNav
  6.  IntroScene (TriangleLines adaptado, scroll controla reveal)
  7.  HeroContent + HeroBackground (malha viva, câmera estabilizada)
  8.  useLoadingTransition (Loading → Intro → Hero)

Fase 3 — Seções HTML
  9.  ProblemaSection
  10. ServicosSection
  11. ProcessoSection (SVG animado)
  12. SobreSection

Fase 4 — Paisagem Digital
  13. PaisagemScene (TerrainMesh + ProjectFragments unificados)
  14. useScrollCamera + useScrollNarrative (câmera por keyframes)
  15. useScrollDriver re-escopado para scroll global
  16. ProjectCard (dados reais) + Connector
  17. FragmentFilter (HTML overlay)

Fase 5 — Complemento
  18. LaboratorioSection (prévia estática ou canvas leve)

Fase 6 — CTA Final
  19. CTAScene (CTAFormation — implementação nova)
  20. CTAFinalContent (HTML sobre a convergência)

Fase 7 — Qualidade
  21. usePerformanceTier + fallbacks de GPU
  22. prefers-reduced-motion em todos os hooks de animação
  23. Testes de acessibilidade (foco, aria, contraste)
  24. Auditoria de performance (LCP, FPS em mobile)
```

---

## 14. Riscos Técnicos Restantes

**CTAFormation — não implementado.**
É o único experimento planejado que ainda não foi validado. A convergência de
fragmentos para formar o símbolo envolve animação de posição de geometria 3D
controlada por scroll — território não testado neste projeto. Risco: alto.
Mitigação: implementar como Fase 6 (depois de toda a Home estar funcional) e ter
um fallback em HTML se a implementação atrasar.

**Canvas único com transição de cenas.**
No Lab, cada cena é um Canvas isolado. Unificar em um Canvas com troca interna
de cena (Loading → Intro → Hero → Paisagem → CTA) sem frame drops durante a
transição é a principal incógnita arquitetural da Home. Precisa de prova de
conceito antes da Fase 1.

**`useScrollDriver` no scroll global.**
O experimento usa `overflow-y-auto` num container isolado. A interação entre
Lenis (que sequestra o scroll nativo) e ScrollTrigger (que precisa de um proxy
de scroll) no contexto do `window` tem particularidades documentadas. Testar
integração cedo (Fase 1).

**Performance mobile na Paisagem Digital (400 vh).**
O scroll longo com câmera em movimento e raycasting é o cenário mais pesado.
Dispositivos mid-range (iPhone SE, Android entrada) podem não atingir 30fps estável.
Mitigação: `usePerformanceTier` com fallback para terreno de baixa resolução e
câmera estática com fragmentos revelados por scroll sem raycasting.

**Sincronização GSAP + R3F + Lenis.**
Os três sistemas têm seus próprios loops. O padrão do Lab (GSAP ticker invalidando
o R3F em `frameloop="demand"`) funciona, mas na Home com `frameloop="always"` e
Lenis ativo, a ordem de atualização precisa ser explícita para evitar jitter de
câmera.

---

## 15. Decisões Finais

**Canvas único.** A Home usa um único `<Canvas>` com gerenciamento interno de
cenas. Sem múltiplos contextos WebGL na mesma página.

**Scroll global com Lenis.** O scroll narrativo da Home usa `window` como alvo
do Lenis, não containers internos. O experimento ScrollCamera valida a lógica;
o wrapper muda.

**Textos sempre em HTML.** Sem exceções. Toda copy que o visitante precisa ler
ou o Google precisa indexar fica fora do Canvas.

**CTAFormation na Fase 6.** Não bloqueia o desenvolvimento das outras seções.
Tem fallback HTML simples enquanto não está pronto.

**`useResponsiveFit` centralizado.** Consolidar as três implementações dispersas
do Lab em um único hook compartilhado antes de iniciar a Fase 1.

**DPR máximo 1.5 em produção.** O Lab usa 2. Em produção, 1.5 é o equilíbrio
entre nitidez e performance em mobile.

**prefers-reduced-motion é requisito, não opcional.** Implementar junto com cada
hook de animação desde o início, não como ajuste posterior.

**A experiência existe para valorizar o trabalho.**
Cada decisão técnica que gera dúvida entre sofisticação visual e clareza comercial
deve ser resolvida pela frase de decisão da marca: clareza comercial vence.

---

*Documento criado em 2026-05-30. Referências: docs/06-technical-feasibility.md,
docs/07-experience-architecture.md, components/lab/\*\*.*
