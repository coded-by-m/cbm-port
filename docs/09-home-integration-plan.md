# 09 — Home Integration Plan

# Coded by M — Plano de Integração da Home

## 1. Objetivo do Documento

Definir como os experimentos validados no Experience Lab se transformam em uma
experiência única e contínua: a Home completa da Coded by M, do primeiro segundo
até o CTA final.

Este documento responde: como tudo funciona junto.

Ele é a ponte entre o que foi validado tecnicamente (Lab) e o que precisa ser
construído como experiência (Home). Quem lê este documento deve conseguir
visualizar claramente cada segundo da jornada — sem precisar abrir o código.

---

## 2. Princípio de Integração

O Lab validou tecnologias isoladas. A Home é a composição dessas tecnologias
em uma narrativa contínua.

O princípio central é o mesmo que orienta cada experimento:

**Nada surge pronto. Tudo é construído.**

Este princípio não se aplica apenas às animações — ele descreve a estrutura da
experiência inteira. A Home começa com um triângulo solitário e termina com o
símbolo completo da marca. O que acontece no meio é o percurso de construção.

A integração é guiada por três regras:

**Continuidade.** Nenhuma transição deve parecer uma mudança de página. A Home
é um único ambiente dividido em zonas — o usuário atravessa, não navega.

**Hierarquia de presença.** O 3D existe para reforçar o momento narrativo de
cada seção. Nas seções comerciais (Serviços, Processo, Sobre), o 3D recua. Na
Paisagem Digital e no CTA Final, avança.

**Clareza comercial acima da experiência.** Cada efeito existe para servir à
mensagem. Se um efeito competir com a mensagem, o efeito perde.

---

## 3. Fluxo Completo da Home

```
[LOADING]        100vh  — Triangle Loader
        ↓ transição: dissolve + câmera avança
[INTRO]          200vh  — Triangle Lines + scroll narrativo
        ↓ transição: malha estabiliza, HTML entra
[HERO]           100vh  — fundo vivo + conteúdo principal
        ↓ transição: câmera fixa, HTML troca
[PROBLEMA]        80vh  — copy HTML, fundo residual
        ↓ transição: copy sai, estrutura "organiza"
[SERVIÇOS]       100vh  — cards HTML com build de borda
        ↓ transição: câmera mergulha, cena muda
[PAISAGEM]       400vh  — Terrain + Fragments + Scroll Camera
        ↓ transição: câmera recua, terreno dissolve
[LABORATÓRIO]    100vh  — HTML principal, 3D residual
        ↓ transição: 3D fade-out
[PROCESSO]       100vh  — HTML + SVG linha, sem canvas ativo
        ↓ transição: linha chega ao fim, canvas reativa
[SOBRE]          120vh  — HTML puro, 3D off
        ↓ transição: fragmentos começam a surgir no fundo
[CTA FINAL]      150vh  — CTAFormation + copy + botão
```

**Altura total aproximada:** 1.350vh

---

## 4. Como o Loading Entrega para a Intro

### O que acontece no Loading

A tela começa em preto total (`#000F08`).

Um ponto aparece no centro. Depois o segundo. Depois o terceiro.

Linhas conectam os pontos, um aresta de cada vez.

O triângulo wireframe se forma.

Ele gira lentamente. A estrutura respira.

Esse é o primeiro capítulo da narrativa: nada surge pronto.

### A transição

Quando a animação de construção termina (o triângulo já gira), o Loading não
desaparece abruptamente. A câmera começa a avançar lentamente em direção ao
triângulo.

Enquanto a câmera avança, dois processos acontecem em paralelo:
1. O triângulo começa a se expandir — novos pontos surgem ao redor dele, as
   linhas se multiplicam (os nós do Triangle Lines começam a emergir)
2. A tela do Loading faz um dissolve suave (`opacity: 1 → 0` em ~400ms)

O resultado percebido: a câmera entrou no triângulo e emergiu dentro da malha.
Não há corte. Há uma continuidade.

### Tecnicamente

O Loading usa um canvas separado posicionado sobre o canvas principal da Home.
O canvas da Home está carregando o Triangle Lines enquanto o Loading toca.
No momento da transição, o canvas do Loading faz `opacity: 0` (CSS) enquanto
o canvas da Home faz `opacity: 0 → 1`.

O usuário não pode scrollar durante o Loading. O scroll é liberado apenas após
a transição para a Intro.

**O que foi validado:** TriangleLoader completo, incluindo build animation e
organic motion. A transição de saída ainda precisa ser implementada.

---

## 5. Como a Intro Entrega para a Hero

### O que acontece na Intro

A Intro ocupa 200vh. O conteúdo HTML é mínimo — uma linha de copy:

> *Toda grande presença digital começa por uma ideia.*

O verdadeiro conteúdo da Intro é a malha 3D que cresce enquanto o usuário scrolla.

A câmera está posicionada de forma que a malha parece se construir à sua volta.
Cada unidade de scroll faz mais nós surgirem, mais arestas conectarem.
A estrutura ganha profundidade à medida que as camadas de background ganham
presença.

O copy HTML aparece com fade suave quando o build está em ~60%.

### A transição para a Hero

Quando o scroll chega ao ponto de transição Intro→Hero, a malha para de crescer
e estabiliza em seu estado final.

A câmera faz um micro-recuo (pull back discreto, 1–2 unidades de mundo).

O HTML da Hero entra:
- Navbar aparece com fade (de cima, `y: -20px → 0`)
- Título principal entra com fade + leve ascensão (`y: 20px → 0`)
- Subtítulo entra logo após
- CTAs entram por último

Durante esse processo, a malha 3D continua viva (respirando, micro-yaw ativo)
mas recua para o background — ela não compete com o título.

**O que foi validado:** TriangleLines com build por camada (useBuildAnimation) e
living motion (useLivingMotion). O controle do build por scroll e a transição
para o estado "estabilizado" ainda precisam ser implementados.

---

## 6. Como a Hero Entrega para o Problema

### O que acontece na Hero

A Hero é a seção mais clara da Home. Nada deve competir com a mensagem:

> *CODED BY M*
> *Web Design Premium para empresas que querem transmitir mais valor,*
> *confiança e profissionalismo.*

Dois CTAs: Ver Projetos · Iniciar Projeto.

A malha 3D continua viva ao fundo, mas em baixa intensidade. O foco é o texto.

### A transição para o Problema

Quando o usuário começa a scrollar para fora da Hero, o conteúdo da Hero faz
`opacity: 1 → 0` com `transform: translateY(0 → -30px)` — o texto sobe e some.

A malha 3D permanece viva como background — não há transição 3D aqui, só HTML.

O copy do Problema entra de baixo: `translateY(40px → 0)` com fade.

A transição é deliberadamente simples porque as seções Problema e Serviços são
comerciais — não precisam de complexidade técnica para convencer.

---

## 7. Como o Problema Entrega para os Serviços

### O que acontece no Problema

A seção Problema tem 80vh. O conteúdo é puro HTML com GSAP controlando a entrada
linha a linha conforme o scroll.

> *A maioria dos sites parece igual.*
> *Pouca personalidade. Pouca diferenciação. Pouco impacto.*

A malha 3D ao fundo pode recuar levemente em opacidade — sugerindo a "ausência"
que o copy descreve.

### A transição para Serviços

Quando o Problema termina, a malha 3D ao fundo aumenta ligeiramente de opacidade
— voltando à vida. Metaforicamente: de uma estrutura genérica para uma estrutura
organizada.

Os cards de Serviços entram com a animação de build de borda: cada card tem sua
borda desenhada por GSAP (`stroke-dashoffset`) antes do texto aparecer. O mesmo
princípio de construção, aplicado ao HTML.

---

## 8. Como os Serviços Entregam para a Paisagem Digital

Esta é a maior transição da Home.

### O que acontece nos Serviços

A seção Serviços tem 100vh. Três serviços principais:
- Landing Pages
- Sites Institucionais
- Experiências Web

Cada um entra em sequência conforme o scroll. Visual premium, sem tabela genérica.

### A transição para a Paisagem Digital

A transição Serviços → Paisagem Digital é o momento de maior impacto técnico
da Home.

**O que o usuário percebe:**

O conteúdo HTML dos Serviços faz `opacity: 0`.

A câmera 3D começa a se mover — não lateralmente, mas **para dentro da cena**.
A malha do Triangle Lines, que era o background de todas as seções anteriores,
começa a se dissolver. Os nós diminuem de opacidade. As arestas somem.

Ao mesmo tempo, o terreno da Paisagem Digital começa a emergir de baixo — as
camadas do TerrainMesh surgem do nada com `useTerrainBuild`, de trás para frente.

**A cena muda.** O usuário passou de um universo de linhas para um universo de
terreno. É o momento em que a escala da experiência aumenta.

**Metaforicamente:** as estruturas abstratas (linhas) tomam forma concreta
(a paisagem onde os projetos existem).

**Tecnicamente:** esta transição usa o canvas único. A câmera empurra para
baixo/frente enquanto o Triangle Lines faz opacity fade-out e o TerrainMesh
faz opacity fade-in. A transição dura ~0.8s de clock time ou é controlada por
um range de scroll dedicado (~30vh de transição).

---

## 9. Como a Paisagem Digital Funciona Dentro da Home

A Paisagem Digital é a seção mais longa: 400vh.

É o coração do projeto.

### O que o usuário experimenta

Ao entrar na Paisagem Digital, o usuário vê um terreno triangulado se estendendo
ao horizonte. A névoa funde as camadas distantes no escuro. Tudo respira.

Uma dica discreta: *Scroll*.

Conforme scrolla:

**0% – 10%:** visão ampla inicial. A câmera está alta, observando o terreno.
Nenhum projeto visível. Apenas o terreno vivo.

**10% – 24%:** a câmera começa a avançar. Um ponto vermelho surge à esquerda
na paisagem — discreto, pulsando levemente. O primeiro projeto está próximo.

**24% – 46%:** Projeto A. A câmera gira suavemente para a esquerda. O fragmento
triangulado emerge do terreno — escala de 0 para 1, sincronizado com a câmera.
Um card HTML aparece ancorado ao fragmento por uma linha vermelha técnica.

O card tem: categoria, título do projeto, breve descrição, link "Ver estudo de caso".

**46% – 52%:** o card fecha. O fragmento A diminui de presença. A câmera começa
a cruzar para a direita.

**52% – 72%:** Projeto B. Mesmo processo — câmera gira direita, fragmento emerge,
card aparece. Projeto A está invisível. B tem toda a atenção.

**72% – 78%:** B some. Câmera empurra fundo.

**78% – 92%:** Projeto C. A câmera está no ponto mais profundo do percurso.
C surge do nada — está parcialmente emergindo da névoa, o que o faz parecer
mais distante e misterioso. Quando o card aparecer, o usuário está "dentro" da
paisagem.

**92% – 100%:** a câmera sobe e recua. O terreno volta à visão ampla. O percurso
foi completado.

### O filtro opcional

Um controle HTML sobre a cena: *Todos · Projetos · Conceitos · Experimentos*.

Discreto, canto superior direito. Ao filtrar, fragmentos que não correspondem
fazem `opacity: 0`. Os filtrados ficam.

### Mobile

No mobile (pointer coarse), a descoberta é por toque. Ao tocar, o fragmento
se destaca e um painel inferior desliza de baixo para cima com o conteúdo do
projeto — em vez do card lateral flutuante. O trajeto da câmera é mais curto
(380vh → 440vh compacto).

**O que foi validado:** TerrainMesh, ProjectFragments, HtmlOverlay, ScrollCamera
(com o novo modelo de câmera em profundidade implementado). A integração dessas
partes dentro do canvas único da Home ainda precisa ser construída.

---

## 10. Como a Paisagem Entrega para o Laboratório

Quando o scroll deixa a zona da Paisagem Digital, a câmera faz um último recuo
amplo — quase o mesmo ponto de partida da seção. O terreno continua vivo mas
começa a perder presença (`opacity` da cena 3D decresce com ScrollTrigger).

O conteúdo HTML do Laboratório entra de baixo:

> *Explorações visuais, estudos de interface e experimentos que expandem*
> *a linguagem da Coded by M.*

Abaixo: uma grade de 2–3 thumbnails dos experimentos do Lab com efeito de
hover discreto. CTA: *Explorar Laboratório →*.

O terreno é o background desta seção mas em opacidade ~30% — presente, mas
silencioso. O foco é o texto e os thumbnails.

---

## 11. Como o Laboratório Entrega para o Processo

O Laboratório é a última seção com 3D ativo.

Na transição para Processo, o canvas 3D faz `opacity: 1 → 0` com um dissolve
suave (600ms). A opacidade do fundo vai para `#000F08` sólido.

A seção Processo opera sobre o fundo escuro puro, sem canvas.

Este "silêncio" 3D é intencional: o Processo é sobre método, confiança, clareza.
Não precisa de ambiente. Precisa de hierarquia.

---

## 12. Como o Processo Entrega para o Sobre

### O que acontece no Processo

Quatro etapas em sequência visual:

**Estratégia → Design → Código → Resultado**

Uma linha SVG conecta as etapas. Conforme o scroll avança, a linha "desenha"
com `stroke-dashoffset` animado — conectando de uma etapa à próxima, como um
diagrama sendo construído.

Cada etapa tem um título (Panchang) e uma linha de descrição curta (Satoshi).

### A transição para Sobre

A linha do processo chega ao "Resultado". Após uma pausa breve, o conteúdo do
Processo faz fade-out.

A seção Sobre começa com um tom diferente. Menos construção. Mais presença
humana. O espaçamento aumenta. O ritmo desacelera.

---

## 13. Como o Sobre Entrega para o CTA Final

### O que acontece no Sobre

A seção Sobre é a mais limpa da Home. Fundo escuro, tipografia em destaque.

> *A Coded by M une design, tecnologia e pensamento estrutural para criar*
> *experiências digitais que fortalecem marcas.*

Texto sobre a visão, filosofia, quem está por trás. Humanização sem exagero.
A estrutura visual descansa. Sem animação pesada — apenas fade suave no texto.

### A transição para o CTA Final

Esta é a segunda grande transição técnica da Home.

O canvas 3D reativa. Não com o terreno — com algo novo.

Fragmentos triangulados começam a aparecer no escuro, ao redor do centro da
tela. São os mesmos fragmentos da Paisagem Digital, mas agora fora do terreno,
flutuando no espaço.

Enquanto o usuário scrolla para dentro do CTA Final, os fragmentos convergem
lentamente em direção ao centro. Cada fragmento segue uma trajetória curva,
como se fosse chamado.

No ponto máximo da convergência, o símbolo da Coded by M se forma:
dois caminhos estruturais em `#F5F2ED` + a diagonal vermelha `#FB3640`.

O símbolo gira levemente, respira. É a conclusão visual de tudo que foi
construído ao longo da Home.

---

## 14. Papel do 3D em Cada Seção

| Seção | Intensidade 3D | Descrição |
|---|---|---|
| Loading | **Alta** | Canvas isolado, frameloop demand. Triangle Loader completo. |
| Intro | **Alta** | Triangle Lines, build controlado por scroll. Câmera avança. |
| Hero | **Média** | Triangle Lines como background vivo. Câmera estabilizada. |
| Problema | **Baixa** | Malha residual ao fundo, opacidade reduzida. |
| Serviços | **Baixa** | Malha residual ao fundo, leve reativação na entrada. |
| Paisagem Digital | **Máxima** | Terrain + Fragments + ScrollCamera + Overlay. Seção central. |
| Laboratório | **Média-baixa** | Terreno em fade (~30% opacidade). Background residual. |
| Processo | **Off** | Canvas em opacity 0. Fundo sólido `#000F08`. |
| Sobre | **Off** | Canvas desativado. Puramente HTML. |
| CTA Final | **Alta** | CTAFormation. Fragmentos convergem → símbolo. |

---

## 15. Papel do HTML em Cada Seção

| Seção | Papel do HTML | Elementos |
|---|---|---|
| Loading | Nenhum durante o loading | (Opcional: microtexto "Construindo...") |
| Intro | Copy narrativo | "Toda grande presença digital começa por uma ideia." |
| Hero | Principal | Navbar, título H1, subtítulo, 2 CTAs |
| Problema | Principal | Título + 3–4 linhas de copy. Entrada escalonada |
| Serviços | Principal | 3 cards com borda animada, título, descrição, detalhe |
| Paisagem Digital | Overlay | Filtro, ProjectCard, Connector SVG, hint de scroll |
| Laboratório | Principal | Título seção, texto, grade de thumbnails, CTA |
| Processo | Principal | 4 etapas + linha SVG animada |
| Sobre | Principal | Texto longo, humanização, visão |
| CTA Final | Overlay crítico | Copy principal, copy secundária, botão "Iniciar Projeto" |

---

## 16. Papel do Motion em Cada Seção

**Motion Layer** = GSAP + ScrollTrigger + Lenis

| Seção | O que o Motion controla |
|---|---|
| Loading | Timeline de construção do triângulo (GSAP timeline autônoma) |
| Intro | `reveal` do build 3D sincronizado com scroll progress (ScrollTrigger) |
| Intro→Hero | Entrada da Navbar, título, subtítulo, CTAs (GSAP stagger) |
| Problema | Entrada escalonada do copy linha a linha (ScrollTrigger) |
| Serviços | Build de borda dos cards (stroke-dashoffset) + entrada de texto |
| Serviços→Paisagem | Dissolve do Triangle Lines, emerge do TerrainMesh, câmera |
| Paisagem Digital | Progresso 0..1 do ScrollCamera (Lenis + ScrollTrigger) |
| Paisagem→Lab | Fade-out do terreno, entrada HTML do Lab |
| Lab→Processo | Fade-out do canvas 3D |
| Processo | Desenho da linha SVG (stroke-dashoffset + ScrollTrigger) |
| Sobre | Fade suave do texto (ScrollTrigger, sem pino) |
| Sobre→CTA | Reativação do canvas, emerge dos fragmentos |
| CTA Final | Progresso de convergência + entrada do copy + botão |

**Lenis** controla o scroll suave de toda a página. É o único ponto de entrada
de scroll — tanto ScrollTrigger quanto os componentes 3D leem o progresso a
partir do Lenis.

---

## 17. O Que Reutiliza Diretamente do Lab

Estes componentes e hooks podem entrar na Home com ajustes mínimos de
configuração. A lógica está validada.

**Triangle Loader → Loading**
- `useTriangleAnimation` — build + rotação completos
- `useOrganicMotion` — respiração + tilt
- `useResponsiveFit` (TriangleLoader) — enquadramento responsivo
- `TIMING`, `COLORS`, `MOTION` (com atualização de cores para identidade)

**Triangle Lines → Intro e Hero background**
- `LatticeLayer` com `useBuildAnimation` + `useLayerDrift`
- Geometria procedural de `geometry.ts`
- `useResponsiveFit` (TriangleLines)
- `LAYERS` (com atualização de cores e controle por scroll em vez de tempo)

**TerrainMesh → Paisagem Digital (base)**
- `TerrainLayer` completo — geometria, animação, fog
- `useTerrainBuild` — revelação por camada
- `useCinematicCamera` — micro-deriva de câmera
- `useResponsiveFit` (TerrainMesh)

**ProjectFragments → Paisagem Digital (hotspots)**
- `buildFragment` — geometria procedural do fragmento
- `useDiscovery` — hover/toque unificado (para seção não-scroll)
- `useFragmentBuild` — revelação escalonada

**HtmlOverlay → Paisagem Digital (cards)**
- `useOverlayStore` — bridge Canvas↔HTML sem re-render
- `ProjectCard` — estrutura base do card (precisa de dados reais + identidade)
- `Connector` — linha técnica + ponto âncora vermelho

**ScrollCamera → Paisagem Digital (câmera narrativa)**
- `useScrollCamera` — câmera por poses explícitas com fit consistente
- `useScrollNarrative` — scroll progress → fragmento ativo
- `useScrollDriver` — Lenis + ScrollTrigger no container de scroll
- `ScrollFragment` — fragmento com envelope de visibilidade
- `computePresence` — função de envelope (0..1 por fragmento)
- `SCROLL_POSES`, `VISIBILITY_ENVELOPES`, `SCROLL_POSITIONS`

---

## 18. O Que Precisa Ser Refeito para Produção

**Canvas único com gerenciamento de cenas**

No Lab, cada experimento tem seu próprio `<Canvas>`. Na Home, um único canvas
percorre todas as cenas com transições internas. Isso exige um `HomeCanvas`
que gerencia quais objetos 3D estão ativos e suas opacidades de cena.

Não existe hoje. É a peça de infraestrutura mais crítica.

**CTAFormation**

O único experimento ainda não implementado. Fragmentos triangulados convergindo
para formar o símbolo SVG da Coded by M em 3D (três paths: dois estruturais em
`#F5F2ED` + a diagonal em `#FB3640`).

A animação de construção segue o mesmo princípio do TriangleLoader: estruturas
primeiro, diagonal vermelha por último e mais rápida.

Risco alto. Deve ser implementado como último passo.

**useScrollOrchestrator**

O orquestrador master da Home. Registra Lenis + ScrollTrigger globalmente,
define o proxy de scroll, cria as pins das seções, expõe o progresso global.

Não existe. Precisa ser criado antes de qualquer seção da Home.

**useLoadingTransition**

Gerencia a saída do Loading canvas e a entrada do canvas principal. Inclui o
dissolve entre os dois canvases, a liberação do scroll e a ativação da Intro.

**Transição Triangle Lines → TerrainMesh**

A transição visual mais complexa da Home. As duas cenas precisam coexistir
durante ~30vh de scroll enquanto uma dissolve e a outra emerge. Requer controle
de opacidade por cena dentro do canvas único.

**Dados reais nos ProjectCards**

Os cards do Lab usam placeholders (Project A, B, C). A produção precisa de:
- Modelo de dado `/types/project.ts`
- Fonte de dados `/data/projects.ts`
- Imagens ou thumbnails por projeto
- Links reais para `/cases/[slug]`

**Tipografia da marca no ProjectCard**

Panchang + Satoshi com as cores oficiais (ver `08.5-visual-direction.md`).
O card atual usa tipografia genérica do Tailwind.

**Atualização de cores em todos os configs do Lab**

A migração visual (prioridades 5–9 do Relatório de Aderência) ainda está
pendente: warm whites, edge colors com temperatura, fill colors do TerrainMesh.

**`useBreakpoint` centralizado**

Três implementações isoladas de `useResponsiveFit` nos experimentos. Na Home,
centralizar em um único hook compartilhado.

**`usePerformanceTier`**

Detecta GPU fraco e ajusta automaticamente: DPR, densidade do terreno, câmera
estática no mobile. Precisa ser construído.

---

## 19. Estratégia Mobile

### Paisagem Digital (principal desafio)

A Paisagem Digital é a seção com maior risco de performance no mobile.

**Compacto mode (pointer: coarse):**
- Card lateral → painel inferior (já validado no Lab)
- Connector SVG → desabilitado
- Câmera com micro-deriva → desabilitada (câmera fixa + transições suaves)
- TerrainMesh → resolução reduzida (segX/segZ reduzidos ~40%)
- Scroll length → 440vh (vs 580vh desktop)

**DPR:** `[1, 1.5]` máximo no canvas da Home (o Lab usa `[1, 2]`).

### Seções HTML

Todas as seções HTML-only (Problema, Serviços, Processo, Sobre) são totalmente
responsivas com Tailwind. Sem 3D dependente de viewport.

### 3D com fallback

Se `usePerformanceTier` detectar GPU insuficiente:
- Intro: exibir fundo estático `#000F08` com fade-in simples
- Hero: fundo sólido sem canvas
- Paisagem: versão simplificada com terreno de baixa densidade e sem câmera dinâmica

O conteúdo principal (Hero, Serviços, CTA) deve funcionar completamente mesmo
sem 3D. O 3D é camada de sofisticação, não camada de comunicação.

### Orientação

Landscape no mobile ativa o compact mode. A câmera usa o menor lado como
referência de fit para manter proporções.

---

## 20. Estratégia de Performance

**Canvas único.** A Home usa um único `<Canvas>`. Sem múltiplos contextos WebGL.

**Lazy load de seções 3D pesadas.**
O TerrainMesh e o CTAFormation são carregados sob demanda — não durante o loading
inicial. `React.lazy` + `dynamic` do Next.js com `ssr: false`.

**`frameloop="demand"` onde possível.**
Loading (GSAP invalida frames sob demanda) e CTA Final (quando estiver imóvel)
usam demand. Intro, Hero e Paisagem usam `"always"`.

**Fog gerencia cull visual.**
A névoa em `#000F08` elimina a necessidade de geometria culling manual. Vértices
além de `FOG.far` são visualmente fundidos ao fundo.

**Sem post-processing na v1.**
Nenhum bloom, DoF ou outros passes. Adicionar após validar que 60fps desktop /
30fps mobile é atingido.

**GSAP anima apenas transform/opacity.**
Nenhuma animação de layout properties (width, height, padding). Apenas
`transform`, `opacity` e valores 3D.

**Web Vitals alvo:**
- LCP: < 2.5s (o Loading não bloqueia LCP — o conteúdo HTML está no DOM)
- CLS: 0 (nenhum elemento muda de tamanho após o carregamento)
- FID/INP: < 100ms (interações devem responder antes do próximo frame)

---

## 21. Estratégia de SEO

**Todo conteúdo indexável é HTML.**

Títulos, subtítulos, copy de serviços, descrições de projetos, textos do Sobre
e do CTA estão em HTML semântico — fora do canvas, visíveis para crawlers.

**Estrutura de headings:**
```
<h1>  CODED BY M (Hero)
<h2>  Seção Problema / Serviços / Paisagem / Laboratório / Processo / Sobre
<h3>  Títulos dos projetos nos cards / Etapas do processo / Serviços individuais
```

**Metadados da Home:**
- `<title>` — "Coded by M — Web Design Premium"
- `<meta description>` — "Sites premium para empresas que querem transmitir mais valor..."
- Open Graph com imagem de thumbnail da Paisagem Digital

**Cases como páginas indexáveis.**
Os projetos da Paisagem Digital têm cards que linkam para `/cases/[slug]`. Essas
páginas devem ter conteúdo textual rico — histórias, processo, resultado — para
criar autoridade de domínio em torno de "web design premium".

**Canvas com `aria-hidden="true"`.**
Nenhum canvas é lido por crawlers ou tecnologias assistivas. Todo conteúdo
semântico está no HTML.

**Próximas páginas que precisam de SEO:**
- `/` (Home) — indexar conteúdo do Hero e Serviços
- `/cases/[slug]` — cada case com conteúdo rico
- `/lab` — indexar como laboratório de web design
- `/sobre` — autoridade de marca

---

## 22. Ordem Recomendada de Implementação da Home

### Fase 0 — Infraestrutura (sem ela, nada mais funciona)

```
1.  HomeCanvas         — canvas único, posição fixa, z-index base
2.  useScrollOrchestrator  — Lenis global + ScrollTrigger proxy
3.  useBreakpoint       — hook centralizado de viewport
```

### Fase 1 — Loading e entrada

```
4.  LoadingScene        — TriangleLoader adaptado com callback onComplete
5.  useLoadingTransition — dissolve entre Loading canvas e Home canvas
```

### Fase 2 — Intro e Hero

```
6.  IntroScene          — TriangleLines com reveal por scroll
7.  HeroContent         — HTML: título, subtítulo, CTAs
8.  HomeNav             — navbar fixa, aparece na Hero
9.  Transição Loading→Intro→Hero
```

### Fase 3 — Seções HTML puras

```
10. ProblemaSection     — copy + GSAP scroll entrance
11. ServicosSection     — 3 cards com build de borda
```

### Fase 4 — Transição para a Paisagem

```
12. Transição Serviços→Paisagem  — dissolve TriangleLines, emerge TerrainMesh
```

### Fase 5 — Paisagem Digital

```
13. PaisagemScene       — TerrainMesh + ProjectFragments unificados
14. ScrollCamera        — useScrollCamera + useScrollNarrative globais
15. ProjectCard         — dados reais + identidade visual completa
16. Connector           — vermelho, produção
17. FragmentFilter      — HTML overlay
```

### Fase 6 — Seções pós-Paisagem

```
18. LaboratorioSection  — HTML + thumbnails + CTA
19. ProcessoSection     — 4 etapas + SVG linha
20. SobreSection        — conteúdo de marca
```

### Fase 7 — CTA Final

```
21. CTAFormation        — implementação nova (maior risco)
22. CTAFinalContent     — HTML: copy + botão
23. Transição Sobre→CTA — reativação do canvas + emerge dos fragmentos
```

### Fase 8 — Qualidade

```
24. usePerformanceTier  — fallbacks de GPU
25. prefers-reduced-motion — em todos os hooks de animação
26. Acessibilidade       — aria, foco, contraste
27. SEO                  — metadados, estrutura de headings
28. Auditoria            — Web Vitals, FPS mobile
```

---

## 23. Riscos Restantes

**CTAFormation (risco alto)**

Não existe. É o único experimento do Lab ainda não implementado. A convergência
de fragmentos para o símbolo envolve animação de posição de geometria 3D
controlada por scroll — território não testado neste projeto.

Mitigação: implementar como Fase 7 (depois da Home estar funcional). Ter um
fallback em HTML puro enquanto não está pronto — o CTA Final funciona mesmo
sem a animação 3D.

**Canvas único com transições de cena (risco alto)**

No Lab, cada experimento é um canvas isolado. Unificar em um canvas com troca
interna de cena (Triangle Lines → TerrainMesh → CTA) sem frame drops é a maior
incógnita arquitetural da Home.

Mitigação: construir prova de conceito do `HomeCanvas` antes da Fase 2.
Validar que a transição Triangle Lines → TerrainMesh é possível dentro do mesmo
canvas com controles de opacidade por cena.

**Transição Triangle Lines → TerrainMesh (risco médio)**

Duas geometrias muito diferentes precisam coexistir durante ~0.8s de transição.
Opacidade por grupo dentro do canvas é tecnicamente simples, mas a sincronia
visual (um desaparecendo enquanto o outro emerge) precisa de refinamento.

**Performance da Paisagem Digital no mobile (risco médio)**

Scroll longo (440vh) com câmera em movimento, raycasting implícito (via
useDiscovery) e render de geometria 3D. Dispositivos mid-range podem não atingir
30fps estável. `usePerformanceTier` é a mitigação — mas precisa ser implementado.

**Sincronização GSAP + R3F + Lenis em escala de página (risco médio)**

No Lab, o Lenis é escopado a um container. Na Home, é global. A interação entre
os três sistemas em escala de página tem particularidades — especialmente o
ScrollTrigger que precisa de um proxy de scroll explícito para funcionar com
Lenis. Testar cedo (Fase 0).

**useScrollCamera com fit global (risco baixo)**

O novo modelo de câmera multiplica todas as poses por `fit` (viewport-relative).
Isso é correto mas foi testado apenas no Lab. Na Home, o fit pode ter um valor
diferente dependendo do tamanho do canvas — que agora é a janela inteira, não
um container. Verificar que as poses ainda enquadram bem em fullscreen.

---

## 24. Decisões Finais

**A Home usa um único canvas.**
Múltiplos canvas na mesma página é inaceitável por performance e por
inconsistência visual. O único canvas percorre todos os estados 3D.

**O Loading usa um canvas separado, temporário.**
O Loading canvas é montado sobre o canvas principal, toca a animação de
construção e é desmontado após a transição. Isso permite que o canvas principal
prepare a cena da Intro enquanto o Loading toca — sem penalidade de LCP.

**O scroll global é controlado por Lenis.**
Lenis é o único ponto de entrada de scroll da Home. ScrollTrigger usa proxy
de Lenis. Os componentes 3D leem o progresso via ref (não re-render).

**Seções Processo e Sobre não têm canvas ativo.**
A decisão de desativar o canvas nessas seções é de respeito narrativo —
o usuário descansou o olho e o próximo momento 3D (CTA) terá mais impacto.
Tecnicamente: `canvas opacity: 0` + `frameloop: "demand"` + o canvas continua
montado (evita remount custoso).

**CTAFormation é o último a ser implementado.**
É o maior risco técnico. A Home funciona sem ele — o CTA Final tem um fallback
em HTML. Implementar CTAFormation apenas quando toda a experiência anterior
estiver estável.

**Clareza comercial sempre vence.**
Se em qualquer seção houver conflito entre um efeito visual e a clareza da
mensagem, o efeito é simplificado ou removido. O visitante deve sair pensando
"esse cara faz sites absurdamente bem feitos" — não "esse site tem animações
legais".

---

*Documento criado em 2026-05-30. Referências: docs/03 a docs/08.5,
components/lab/\*\*.\*\*, lib/experiments.ts.*
