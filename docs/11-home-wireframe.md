# 11 — Home Wireframe

# Coded by M — Wireframe Completo da Home

## Como Ler Este Documento

Este documento descreve a Home completa seção por seção, permitindo visualizá-la
sem abrir Figma ou código.

**Notação dos wireframes:**

```
╔══════╗  Borda de container principal
║      ║  Área de conteúdo
╚══════╝

[3D]       Cena Three.js / React Three Fiber
[SVG]      Elemento vetorial animado
[IMG]      Imagem ou thumbnail
[BTN-P]    Botão primário (vermelho)
[BTN-S]    Botão secundário (borda verde)
[LINK]     Link inline

▓▓▓        Elemento de alta densidade visual
░░░        Elemento de baixa densidade / background
···        Espaço vazio intencional
───        Separador / linha técnica
~~~        Borda animada (build animation)
```

---

## Fluxo Emocional da Home

```
Emoção  10│                        ●
          │                     ●     ●
        8 │         ●
          │      ●     ●
        6 │   ●              ●
          │         ●  ●  ●      ●
        4 │               ●         ●  ●
          │●                              ●
        2 │
          └─────────────────────────────────→
           Load  Intro Hero Prob Serv Paisag Lab  Proc Sobre CTA

●  Loading    3 → mistério, expectativa
●  Intro      8 → descoberta, maravilha
●  Hero       7 → clareza, confiança, impacto
●  Problema   4 → reconhecimento, identificação do problema
●  Serviços   5 → profissionalismo, clareza comercial
●  Paisagem  10 → admiração, desejo, exploração (PICO)
●  Lab        6 → curiosidade, inovação
●  Processo   5 → segurança, método
●  Sobre      4 → proximidade, humanização
●  CTA        9 → conclusão, desejo de agir (SEGUNDO PICO)
```

---

## Mapa de Atenção do Usuário

```
Onde o olho vai em cada seção:

Loading:         Centro absoluto — triângulo em construção
Intro:           Centro e profundidade — malha crescendo em z
Hero:            Canto superior esq. → título → subtítulo → CTAs
Problema:        Centro-alto → linhas de copy em sequência
Serviços:        Centro → cards da esquerda para direita
Paisagem:        Todo o campo visual → movimenta com a câmera
                 Foco pontual: fragmento ativo + card
Laboratório:     Título → thumbnails → CTA
Processo:        Sequência esq → dir: etapas + linha
Sobre:           Bloco de texto centralizado
CTA Final:       Centro → símbolo convergindo → copy → botão
```

---

## Momentos de Respiro e Impacto

```
IMPACTO MÁXIMO:
  ★ Loading → Intro  (transição — o usuário "entra" no universo)
  ★ Paisagem Digital (pico visual — admiração + desejo)
  ★ CTA Final        (convergência — todo o percurso se fecha)

RESPIRO INTENCIONAL:
  ◇ Problema         (sem 3D ativo, copy limpa, ritmo lento)
  ◇ Sobre            (mais humano, menos técnico, 3D off)

MOMENTOS DE CURIOSIDADE:
  ○ Intro            (o usuário quer ver o que está se formando)
  ○ Paisagem (30%)   (primeiro ponto vermelho — "o que é isso?")
  ○ Laboratório      (mostra que há mais para explorar)
```

---

## Distribuição da Densidade Visual

```
Alta    ████████  Loading       (construção do triângulo)
        ██████    Intro         (malha crescendo)
        █████     Hero          (texto + 3D fundo)
        ██        Problema      (só texto)
        ███       Serviços      (cards + bordas animadas)
Máxima  ██████████Paisagem      (terreno + câmera + cards)
        ████      Laboratório   (thumbnails + texto)
        ██        Processo      (SVG + texto)
Baixa   █         Sobre         (texto puro)
Alta    ████████  CTA Final     (símbolo + copy + botão)
        ██        Footer        (links e informações)
```

---

---

# SEÇÃO 01 — LOADING

---

## Objetivo

Mascarar o carregamento inicial. Introduzir a identidade da marca. Criar mistério
e expectativa. Estabelecer o princípio visual central: nada surge pronto.

## Pergunta que Responde ao Usuário

*"Onde estou? O que é isso?"* — uma pergunta sem resposta ainda. Intencionalmente.

## Altura

`100vh` — fullscreen, sem scroll.

## Hierarquia Visual

```
╔═══════════════════════════════════════════╗  100vh
║                                           ║
║                                           ║
║                                           ║
║                                           ║
║                 ▓▓▓▓▓                    ║
║               ▓       ▓                  ║
║             ▓           ▓                ║
║           ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓               ║
║                                           ║
║                                           ║
║                                           ║
╚═══════════════════════════════════════════╝
fundo: #000F08 sólido — sem qualquer outro elemento
```

## Conteúdo Principal

**Nenhum texto.** Silêncio visual total exceto a construção geométrica.

Sequência de eventos (4–6 segundos):
1. Tela escura.
2. Ponto 1 surge no vértice superior.
3. Ponto 2 surge no vértice inferior esquerdo.
4. Ponto 3 surge no vértice inferior direito.
5. Aresta 1 se desenha: cima → baixo-esq.
6. Aresta 2 se desenha: baixo-esq → baixo-dir.
7. Aresta 3 se desenha: baixo-dir → cima.
8. Triângulo formado. Gira lentamente.
9. Estrutura respira (escala sutil, micro-inclinação).

## Papel do 3D

Canvas isolado (`frameloop="demand"`). Toda a cena — `TriangleLoader` completo.
Pontos: `#F5F2ED`. Arestas: `#F5F2ED`, opacity 0.74. Fundo: `#000F08`.
Partículas de profundidade discretas (`#4A4844` a `#8A8780`).

## Papel do Motion

Timeline GSAP autônoma (não controlada por scroll).
`power2.out` nos pontos. `power1.inOut` nas arestas. Rotação em `ease: none`.
Organic motion (respiração + micro-inclinação) em loop ao final.

## Papel do HTML

Nenhum durante o Loading.
(Versão futura opcional: microtexto em `Satoshi 9px cbm-gray-600 tracking-wide uppercase`
flutuando discreto no canto inferior direito — "Construindo estrutura...")

## CTA da Seção

Nenhum. O carregamento termina automaticamente.

## Transição para a Intro

Quando o triângulo completa a construção e atinge estado de rotação estável:

1. A câmera começa a avançar lentamente em direção ao triângulo.
2. Novos pontos começam a surgir ao redor — o triângulo se multiplica.
3. O canvas do Loading faz `opacity: 1 → 0` em 400ms `ease`.
4. O canvas da Home (Triangle Lines) faz `opacity: 0 → 1` em 400ms.
5. O scroll é liberado.

**Sensação:** o usuário "entrou" no triângulo e emergiu dentro da malha.

---

---

# SEÇÃO 02 — INTRO

---

## Objetivo

Capturar atenção. Construir a atmosfera. Criar desejo de continuar scrollando.
Não explicar ainda — apenas criar expectativa máxima.

## Pergunta que Responde ao Usuário

*"O que está acontecendo aqui?"* — o visitante fica fascinado e quer descobrir.

## Altura

`200vh` — pinada pelo ScrollTrigger durante ~200vh de scroll.

## Hierarquia Visual

```
╔═══════════════════════════════════════════╗  100svh (pinada)
║                                           ║
║  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓     ║
║  ▓▓  [3D LATTICE — CRESCENDO]  ▓▓▓▓     ║  background
║  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓     ║  controlado
║                                           ║  por scroll
║                                           ║
║                                           ║
║  ── Web Design Premium ────────────────  ║  tag cbm-red 0.7
║  Toda grande presença digital             ║  H body-lg
║  começa por uma ideia.                    ║  cbm-gray-200
║                                           ║  (aparece quando
║                                           ║  build > 60%)
╚═══════════════════════════════════════════╝
```

## Conteúdo Principal

**Tag de seção:**
```
── Web Design Premium ─────────────────────
```
`Satoshi 500 · 9px · tracking 0.35em · uppercase · #FB3640 opacity 0.7`
Linha vermelha de 24px antes do texto.

**Copy:**
```
Toda grande presença digital
começa por uma ideia.
```
`Satoshi 300 · clamp(15px, 2vw, 18px) · #C8C4BE · line-height 1.8`
Posição: inferior-esquerdo, padding 40–80px das bordas.
Entra com `opacity: 0→1 + translateY(20px→0)` quando build > 60%.

## Papel do 3D

Triangle Lines: 3 camadas de profundidade crescendo controladas pelo scroll.
A malha está em 0% quando a Intro começa e em 100% quando chega na Hero.
Câmera avança lentamente enquanto o scroll progride (o usuário sente que
está entrando na estrutura).

```
Scroll 0%:    apenas alguns pontos no centro
Scroll 30%:   camada de background quase formada
Scroll 60%:   midground crescendo, profundidade aparece
Scroll 80%:   foreground surgindo, a estrutura tem volume
Scroll 100%:  malha completa, câmera estabiliza
```

## Papel do Motion

ScrollTrigger controla `reveal` (0→1) do build animation.
Copy entra via GSAP quando `reveal > 0.6`.
Câmera tem micro-drift orgânico sempre ativo.

## Papel do HTML

Mínimo. Tag + copy. Posicionado no rodapé da seção (canto inferior esquerdo).
`pointer-events: none` (o 3D é o conteúdo principal).

## CTA da Seção

Nenhum. A seção é puramente de atração — ainda não é hora de vender.

## Transição para a Hero

Quando scroll atinge 100% da Intro:
- Malha para de crescer e estabiliza.
- Câmera faz micro-recuo suave (1–2 unidades, 600ms).
- HTML da Intro faz `opacity: 1→0` (300ms).
- Navbar entra de cima: `translateY(-60px→0) + opacity: 0→1` (600ms).
- Hero content entra: `opacity: 0→1 + translateY(30px→0)` em stagger.

---

---

# SEÇÃO 03 — HERO

---

## Objetivo

Responder imediatamente o que a Coded by M faz. A partir daqui, nenhum visitante
pode ter dúvida sobre a categoria da marca: **Web Design Premium**.

## Pergunta que Responde ao Usuário

*"O que esse cara faz?"* — respondida em 3 segundos.

## Altura

`100vh` — fullscreen.

## Hierarquia Visual

```
╔═══════════════════════════════════════════╗  100vh
║  [LOGO] Coded by M         Proj Lab [BTN]║  Navbar 60px
╠═══════════════════════════════════════════╣
║                                           ║
║  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░     ║  3D background
║  ░░  [Triangle Lines — loop vivo]  ░░     ║  opacity ~60%
║  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░     ║
║                                           ║
║  ── Web Design Premium ──────────────    ║  tag
║                                           ║
║  CODED BY M                              ║  display H1
║                                           ║
║  Web Design Premium para empresas         ║  subtitle
║  que querem transmitir mais valor,        ║  body-lg
║  confiança e profissionalismo.            ║  cbm-gray-400
║                                           ║
║  [BTN-P Iniciar Projeto]  [BTN-S Ver →]  ║  CTAs
║                                           ║
╚═══════════════════════════════════════════╝
```

## Conteúdo Principal

**Navbar:**
```
[LOGO 28×32]  Coded by M    Projetos  Lab  Sobre    [Iniciar Projeto]
              Panchang 16px cbm-white            cbm-red btn pequeno
              "by" em cbm-red
```

**Tag:**
`── Web Design Premium ──────────────────`
`Satoshi 500 · 9px · tracking 0.35em · uppercase · #FB3640 0.7`

**Título principal:**
`CODED BY M`
`Panchang 800 · clamp(56px, 8vw, 80px) · tracking -0.03em · #F5F2ED`
"by" em `#FB3640`.

**Subtítulo:**
`Web Design Premium para empresas que querem transmitir mais valor,`
`confiança e profissionalismo.`
`Satoshi 300 · clamp(14px, 1.5vw, 17px) · #8A8780 · line-height 1.75 · max-width 540px`

**CTAs:**
```
[BTN-P  Iniciar Projeto  ]    [BTN-S  Ver Projetos  ]
 Panchang 600 11px cbm-red     Panchang 600 11px cbm-white
 padding 14px 28px             border cbm-border-active
```

**Stagger de entrada:** tag (0ms) → título (120ms) → subtítulo (240ms) → CTAs (360ms).
Cada elemento: `opacity: 0→1 + translateY(20px→0)`, `600ms power2.out`.

## Papel do 3D

Triangle Lines em estado completo, câmera estabilizada com micro-drift.
Opacidade reduzida (~60%) para não competir com o texto.
O 3D é o ambiente, não a mensagem.

## Papel do Motion

Entrada do conteúdo em stagger (GSAP, uma única vez ao entrar na viewport).
Organic motion contínuo no 3D (invisível mas presente).
Navbar: `backdrop-blur` e `border-bottom` ativam conforme o scroll progride.

## Papel do HTML

Principal. Todo o conteúdo comercial crítico está aqui.
Navbar, título, subtítulo, CTAs — todos semânticos, indexáveis.

## CTA da Seção

**Primário:** Iniciar Projeto → ancora para o CTA Final ou abre modal de contato.
**Secundário:** Ver Projetos → ancora para a Paisagem Digital.

## Transição para Problema

Ao scrollar para fora da Hero:
- Hero content: `opacity: 1→0 + translateY(0→-30px)` (300ms ease).
- 3D background permanece — não há transição 3D aqui.
- Problema content entra de baixo: `translateY(40px→0) + opacity: 0→1`.

---

---

# SEÇÃO 04 — PROBLEMA

---

## Objetivo

Criar identificação. Fazer o visitante pensar: *"O meu site talvez também pareça
comum."* Estabelecer o problema que a Coded by M resolve.

## Pergunta que Responde ao Usuário

*"Por que eu precisaria de algo diferente?"*

## Altura

`80vh`

## Hierarquia Visual

```
╔═══════════════════════════════════════════╗  80vh
║                                           ║
║  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░     ║  3D residual
║  ░░  [Triangle Lines 30% opacidade]  ░   ║  discreto
║                                           ║
║            ── O Problema ────────────    ║  tag cbm-red
║                                           ║
║            A maioria dos sites            ║  H1
║            parece igual.                  ║  cbm-gray-400
║                                           ║
║            Pouca personalidade.           ║  body
║            Pouca diferenciação.           ║  cbm-gray-600
║            Pouco impacto.                 ║  entrada
║                                           ║  escalonada
║                                           ║
╚═══════════════════════════════════════════╝
```

## Conteúdo Principal

**Tag:** `── O Problema ─────────────────────`

**Copy linha 1:**
`A maioria dos sites parece igual.`
`Panchang 700 · clamp(28px, 3.5vw, 36px) · #C8C4BE`

**Copy linha 2–4:**
```
Pouca personalidade.
Pouca diferenciação.
Pouco impacto.
```
`Satoshi 300 · 15px · #4A4844 · line-height 1.7`

**Entrada escalonada** conforme scroll:
- Linha 1 (título): entra primeiro, `translateY(20px→0)`.
- Linhas 2–4: entram em stagger de 120ms cada.

**Centralizado ou alinhado à esquerda?**
Centralizado em desktop. Alinhado à esquerda em mobile.

## Papel do 3D

Background residual. Triangle Lines a ~30% de opacidade. Câmera fixa.
Não há nova construção — o 3D "desaparece" gradualmente nesta seção
para dar espaço ao silêncio do problema.

## Papel do Motion

Copy entra linha a linha com ScrollTrigger (`start: "top 80%"`).
`power2.out · 500ms · stagger 120ms`.
Sem animações de fundo pesadas — esta seção é sobre respiro.

## Papel do HTML

Principal. Toda a seção é HTML puro sobre fundo semi-vazio.
A leveza intencional amplifica a mensagem: o problema é monotonia.
A seção precisa ter um visual quase monótono para funcionar.

## CTA da Seção

Nenhum. A seção levanta o problema — ainda não oferece solução.
A solução começa na próxima seção.

## Transição para Serviços

- 3D background recupera presença gradualmente (opacity ~30% → ~50%).
- Um leve brilho nos nós do Triangle Lines — a estrutura "se organiza".
- Copy do Problema faz `opacity: 1→0` (200ms).
- Cards de Serviços entram com bordas se desenhando de baixo para cima.

---

---

# SEÇÃO 05 — SERVIÇOS

---

## Objetivo

Mostrar o que pode ser contratado com clareza máxima. Eliminar dúvidas.
Transformar o problema identificado em solução concreta.

## Pergunta que Responde ao Usuário

*"O que exatamente a Coded by M faz para mim?"*

## Altura

`100vh`

## Hierarquia Visual

```
╔═══════════════════════════════════════════╗  100vh
║                                           ║
║  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░     ║  3D 50% op
║  ── O Que Construímos ───────────────    ║  tag
║                                           ║
║  Construímos presença digital.            ║  H1
║  Para empresas que levam a sério.         ║
║                                           ║
║  ┌~~~~~~~~~~~┐ ┌~~~~~~~~~~~┐ ┌~~~~~~~~~┐ ║
║  ~ 01        ~ ~ 02        ~ ~ 03      ~ ║
║  ~           ~ ~           ~ ~         ~ ║  cards
║  ~ Landing   ~ ~ Sites     ~ ~ Exp.    ~ ║  borda
║  ~ Pages     ~ ~ Instit.   ~ ~ Web     ~ ║  animada
║  ~           ~ ~           ~ ~         ~ ║
║  ~ descrição ~ ~ descrição ~ ~ descr.  ~ ║
║  ~           ~ ~           ~ ~         ~ ║
║  └~~~~~~~~~~~┘ └~~~~~~~~~~~┘ └~~~~~~~~~┘ ║
║                                           ║
╚═══════════════════════════════════════════╝
```

## Conteúdo Principal

**Tag:** `── O Que Construímos ──────────────`

**Título:**
`Construímos presença digital.`
`Panchang 700 · clamp(32px, 4vw, 48px) · #F5F2ED`
`Para empresas que levam a sério.`
`Panchang 500 · mesma escala · #8A8780`

**3 Cards de Serviço:**

```
Número decorativo: Panchang 800, 40px, #1a2e1e (quase invisível)
Título: Panchang 600, 18–22px, #F5F2ED
Descrição: Satoshi 300, 14px, #8A8780, line-height 1.7
Borda: 1px solid #1a2a1e, animada na entrada
```

Card 1 — Landing Pages:
> Sites de conversão. Alta clareza, impacto imediato, foco no resultado.

Card 2 — Sites Institucionais:
> Presença digital completa. Estrutura, hierarquia e identidade para a empresa.

Card 3 — Experiências Web:
> Interfaces que surpreendem. Quando o site precisa ser memorável.

**Animação de entrada dos cards:**
A borda de cada card se desenha (stroke-dashoffset), então o conteúdo interno
faz fade-in. Stagger de 150ms entre cards.

## Papel do 3D

Background. Triangle Lines a ~50% de opacidade. Estável, sem construção nova.
Reforça a sensação de estrutura — mas não compete com os cards.

## Papel do Motion

Borda dos cards: `stroke-dashoffset → 0`, `600ms power1.inOut`.
Conteúdo dos cards: `opacity: 0→1 + translateY(15px→0)` após borda completar.
Stagger por card: 150ms.

## Papel do HTML

Principal. Cards semânticos. Conteúdo indexável.
Cada card é um `<article>` ou `<div role="article">` com heading interno.

## CTA da Seção

Link discreto no final:
`Iniciar seu projeto → ` — Link CTA estilo (Panchang 600, underline cbm-red).
Aponta para o CTA Final (ancora ao final da página).

## Transição para a Paisagem Digital

Esta é a **maior transição da Home**.

1. Cards de Serviços fazem `opacity: 1→0`.
2. Triangle Lines começa a perder presença (opacity 50% → 0, 800ms).
3. Câmera empurra para dentro da cena (z avança, sensação de mergulho).
4. TerrainMesh emerge das camadas de trás para frente (`useTerrainBuild`).
5. Névoa (`#000F08`) suaviza as bordas do terreno que aparece.
6. Câmera chega à visão ampla da Paisagem Digital.

**Duração total da transição:** ~1.2s de clock time ou ~50vh de scroll.

---

---

# SEÇÃO 06 — PAISAGEM DIGITAL

---

## Objetivo

Criar o grande momento do site. Mostrar os projetos de forma memorável. Gerar
desejo: *"Eu quero algo assim para minha empresa."* Esta é a principal assinatura
visual da marca.

## Pergunta que Responde ao Usuário

*"Que tipo de trabalho essa pessoa faz?"*

## Altura

`400vh` — a maior seção da Home.

## Hierarquia Visual — Visão Ampla Inicial

```
╔═══════════════════════════════════════════╗  100svh (pinada)
║  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ║
║  ░░ [TERRAIN MESH — 3 CAMADAS] ░░░░░░░░  ║  3D máximo
║  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ║
║  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ║
║  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ║
║  ░░░░░ névoa funde no #000F08 ░░░░░░░░░  ║
║                                           ║
║                                           ║  Todos / Proj.
║                                           ║  [filtro dir.]
║                                           ║
║                                           ║
║               ↓ Scroll                   ║  hint
╚═══════════════════════════════════════════╝
```

## Hierarquia Visual — Foco em Projeto A

```
╔═══════════════════════════════════════════╗
║  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ║
║  ░░ [TERRAIN]  ▓▓              ░░░░░░░░  ║
║  ░░░░░░░░░░░ ▓ A ▓             ░░░░░░░░  ║  Fragmento A
║  ░░░░░░░░░░░ ▓▓▓▓▓             ░░░░░░░░  ║  ativo
║  ░░░░░░░░░░░░░░│░░░░░░░░░░░░░░░░░░░░░░░  ║
║  ░░░░░░░░░░░░░░│ · · · · · · · · · · ·  ║  conector
║  ░░░░░░░░░░░░░░│ ╔══════════════════╗   ║  vermelho
║  ░░░░░░░░░░░░░░└─║ LANDING PAGE    ║   ║
║                  ║ Project A        ║   ║  ProjectCard
║                  ║ Estudo visual... ║   ║
║                  ║ Ver estudo ─────>║   ║
║                  ╚══════════════════╝   ║
╚═══════════════════════════════════════════╝

Fragmento A:
  - Wireframe triangulado, escala 1.12
  - Vértice ápice: •  cor #FB3640
  - Arestas: #F5F2ED opacity 0.70

Conector:
  - Linha: rgba(251,54,64,0.5)
  - Ponto âncora: #FB3640

ProjectCard:
  - bg #0E1810, border #1a2a1e
  - border-left: 2px #FB3640
```

## Conteúdo Principal

**Filtro HTML (canto superior direito):**
```
Todos · Projetos · Conceitos · Experimentos
Satoshi 400 · 10px · tracking 0.2em · uppercase
Ativo: #F5F2ED + border-bottom cbm-red
Inativo: #4A4844
```

**Hint de scroll (canto inferior centro):**
```
Scroll
  ↓
Satoshi 300 · 10px · tracking 0.4em · uppercase · #4A4844
Some ao primeiro avanço de scroll.
```

**Percurso da câmera (narrado pelo scroll):**

```
0%   → Vista ampla. Terreno vivo. Nenhum projeto.
12%  → Ponto vermelho surge à esquerda (hotspot de A).
24%  → Câmera gira esquerda. A emerge do terreno.
24%–46% → Card de A visível. Câmera observa.
52%  → A some. Câmera cruza à direita. B emerge.
52%–72% → Card de B visível.
78%  → B some. Câmera mergulha fundo. C emerge da névoa.
78%–92% → Card de C visível. Ponto mais profundo do percurso.
94%–100% → Câmera sobe e recua. Vista panorâmica. Percurso concluído.
```

## Papel do 3D

**Máximo da Home.** TerrainMesh (3 camadas) + 3 ProjectFragments + ScrollCamera.
Câmera percorre o terreno com poses explícitas, smooth-interpolated por scroll.
Fragmentos surgem e desaparecem com envelope de visibilidade.
Apex vermelho em cada fragmento quando ativo.

## Papel do Motion

`useScrollCamera`: câmera interpola entre poses com smoothstep por frame.
`useScrollNarrative`: progresso → fragmento ativo → card HTML aparece.
`computePresence`: cada fragmento tem envelope de visibilidade (fade in/out suave).
`useScrollDriver`: Lenis + ScrollTrigger no container do scroll.

## Papel do HTML

Overlay. `ProjectCard`, `Connector`, filtro, hint de scroll.
`pointer-events: none` na maioria, `pointer-events: auto` nos elementos clicáveis.
Conteúdo real dos projetos: título, tipo, descrição, link.

## CTA da Seção

Cada ProjectCard tem: **Ver estudo de caso →**
`Panchang 600 · 11px · uppercase · tracking 0.15em · cbm-white`
`border-bottom: 1px solid cbm-red`
`hover: cbm-red`

Aponta para `/cases/[slug]` — cada projeto tem página própria.

## Transição para o Laboratório

- ScrollCamera retorna à visão ampla (última pose).
- TerrainMesh começa a perder opacidade: `1→0.3` em ~50vh de scroll.
- HTML da Paisagem (filtro, hint) faz `opacity: 0`.
- Conteúdo HTML do Laboratório entra de baixo.

---

---

# SEÇÃO 07 — LABORATÓRIO

---

## Objetivo

Mostrar que a Coded by M está em constante evolução. Diferenciar de agências
que apenas executam. Criar curiosidade para explorar mais.

## Pergunta que Responde ao Usuário

*"Existe mais por trás desse trabalho? Como eles se desenvolvem?"*

## Altura

`100vh`

## Hierarquia Visual

```
╔═══════════════════════════════════════════╗  100vh
║                                           ║
║  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ║  terreno 30%
║                                           ║
║  ── Laboratório ─────────────────────    ║  tag
║                                           ║
║  Explorações visuais e experimentos       ║  body-lg
║  que expandem a linguagem da marca.       ║  cbm-gray-400
║                                           ║
║  ┌──────────┐ ┌──────────┐ ┌──────────┐ ║
║  │  [IMG]   │ │  [IMG]   │ │  [IMG]   │ ║  thumbnails
║  │          │ │          │ │          │ ║
║  │ Triangle │ │  Terrain │ │ Scroll   │ ║  cap.
║  │ Loader   │ │  Mesh    │ │ Camera   │ ║  micro
║  └──────────┘ └──────────┘ └──────────┘ ║
║                                           ║
║             [LINK] Explorar Laboratório → ║  CTA link
║                                           ║
╚═══════════════════════════════════════════╝
```

## Conteúdo Principal

**Tag:** `── Laboratório ────────────────────`

**Copy:**
`Explorações visuais, estudos de interface e experimentos`
`que expandem a linguagem da Coded by M.`
`Satoshi 300 · 15px · #8A8780 · line-height 1.7 · max-width 520px`

**Thumbnails (2–3):**
```
[ Screenshot ou canvas pequeno do experimento ]
Legenda: Satoshi micro, 9px, tracking 0.25em, uppercase, #4A4844
         "Triangle Loader" / "Terrain Mesh" / "Scroll Camera"
border: 1px solid #1a2a1e
hover: border-color #2a4a32 + leve scale (1.0→1.02, 200ms ease)
```

**CTA:**
`[LINK] Explorar Laboratório →`
`Panchang 600 · 11px · uppercase · tracking 0.15em · cbm-white`
`border-bottom: 1px solid cbm-red`
Link para `/lab`.

## Papel do 3D

Terreno a ~30% de opacidade. Background residual. Não há novas cenas 3D.
O lab já foi a Paisagem Digital — esta seção é o HTML sobre o resíduo.

## Papel do Motion

Thumbnails entram com `stagger 100ms + opacity/translateY` ao scrollar.
Transição de fundo: terreno continua fazendo fade-out.

## Papel do HTML

Principal nesta seção. Tag, copy, thumbnails, CTA.
Os thumbnails podem ser screenshots estáticos (lazy-loaded em WebP).

## CTA da Seção

**Explorar Laboratório →** — leva para `/lab`.

## Transição para Processo

- Terreno continua dissolve: opacity `0.3 → 0` em ~30vh.
- Canvas faz `opacity: 1 → 0` ao sair da seção Lab (600ms ease).
- A partir daqui: fundo `#000F08` puro. Sem canvas.
- Processo entra com título e etapas — clean, silencioso.

---

---

# SEÇÃO 08 — PROCESSO

---

## Objetivo

Mostrar método. Reduzir a sensação de risco do cliente. Provar que existe
estrutura por trás da estética.

## Pergunta que Responde ao Usuário

*"Como funciona trabalhar com a Coded by M? Tenho segurança de que existe método?"*

## Altura

`100vh`

## Hierarquia Visual

```
╔═══════════════════════════════════════════╗  100vh
║                                           ║
║  fundo: #000F08 sólido, sem canvas        ║
║                                           ║
║  ── Como Trabalhamos ────────────────    ║  tag
║                                           ║
║  01              02              03  04  ║
║  Estratégia      Design          Código Res.
║  │               │               │    │  ║
║  └───────────────┴───────────────┴────┘  ║  linha SVG
║                                           ║
║  Estratégia      Design          Código  ║  títulos etapas
║                                           ║  Panchang H3
║  Entendemos o    Interface que   Código  ║
║  negócio antes   comunica antes  limpo,  ║  descrições
║  de criar.       de impressionar.rápido. ║  Satoshi sm
║                                           ║
╚═══════════════════════════════════════════╝
```

## Conteúdo Principal

**Tag:** `── Como Trabalhamos ───────────────`

**Título da seção:**
`Processo. Não processo genérico.`
`Panchang 700 · clamp(28px, 3.5vw, 36px) · #F5F2ED`

**4 Etapas + linha SVG:**

```
Números decorativos: Panchang 800, 40px, #1a2e1e (quase invisíveis)

Etapa 01 — Estratégia
  Título:    Panchang 500, 18px, #F5F2ED
  Descrição: Satoshi 300, 13px, #8A8780
  "Entendemos o negócio, o cliente e o objetivo antes de criar qualquer tela."

Etapa 02 — Design
  "Interface que comunica com precisão antes de impressionar."

Etapa 03 — Código
  "Código limpo, performático e estruturado. Sem template."

Etapa 04 — Resultado
  "Uma entrega que fortalece a percepção da empresa."
```

**Linha SVG conectora:**
```
[ 01 ]────────────[ 02 ]────────────[ 03 ]────────[ 04 ]
stroke: #FB3640 opacity 0.5, strokeWidth 1
stroke-dashoffset: length → 0 conforme scroll (ScrollTrigger)
A linha "chega" em cada etapa → o conteúdo da etapa revela
```

**Desktop:** etapas lado a lado.
**Mobile:** etapas empilhadas com linha vertical.

## Papel do 3D

**Nenhum.** Canvas em `opacity: 0`. Fundo `#000F08` sólido.
O silêncio 3D amplifica a clareza comercial desta seção.

## Papel do Motion

Linha SVG: `stroke-dashoffset` animado por ScrollTrigger.
Cada etapa revela quando a linha a "alcança": `opacity: 0→1 + translateY(15px→0)`.
`500ms power2.out`.

## Papel do HTML

**Principal.** Todo conteúdo em HTML semântico.
`<ol>` com `<li>` para as etapas — semântica de processo/lista ordenada.

## CTA da Seção

Nenhum CTA direto. A seção prepara para o CTA Final.
Opcional: ao final, linha de copy discreta em `#4A4844`:
`"Pronto para começar? →"` — link para o CTA Final.

## Transição para Sobre

- Linha SVG chega à etapa 04.
- Conteúdo do Processo faz `opacity: 1→0` suave.
- Sobre entra com fade limpo — sem transform, apenas opacity.
- Ritmo desacelera visivelmente.

---

---

# SEÇÃO 09 — SOBRE

---

## Objetivo

Humanizar a marca. Mostrar que há uma pessoa e uma visão por trás da Coded by M.
Criar conexão antes do CTA.

## Pergunta que Responde ao Usuário

*"Com quem vou estar trabalhando? Posso confiar?"*

## Altura

`120vh`

## Hierarquia Visual

```
╔═══════════════════════════════════════════╗  120vh
║                                           ║
║  fundo: #000F08 sólido                    ║
║                                           ║
║  ── Sobre ────────────────────────────   ║  tag
║                                           ║
║  A Coded by M une design, tecnologia      ║  H1 menor
║  e pensamento estrutural para criar       ║  cbm-white
║  experiências digitais que fortalecem     ║  Panchang 700
║  marcas.                                  ║  36–44px
║                                           ║
║  ─── ─── ─── ─── ─── ─── ───             ║  separador 240px
║                       cbm-border 0.5px   ║
║                                           ║
║  Acredito que um bom site é construído    ║  body
║  com a mesma seriedade de uma boa         ║  Satoshi 300
║  estrutura: base clara, hierarquia,       ║  cbm-gray-400
║  proporção, intenção e acabamento.        ║  line-height 1.8
║                                           ║
║  Florianópolis, Brasil.                   ║  detail
║  Desde 2024.                              ║  caption
║                                           ║
╚═══════════════════════════════════════════╝
```

## Conteúdo Principal

**Tag:** `── Sobre ──────────────────────────`

**Texto principal:**
`A Coded by M une design, tecnologia e pensamento estrutural`
`para criar experiências digitais que fortalecem marcas.`
`Panchang 700 · clamp(28px, 3.5vw, 40px) · #F5F2ED · max-width 680px`

**Separador:**
`── ── ── ── ── ── ──`
`0.5px solid #1a2a1e · max-width 240px`

**Texto de filosofia:**
`Acredito que um bom site é construído com a mesma seriedade de uma`
`boa estrutura: base clara, hierarquia, proporção, intenção e acabamento.`
`Satoshi 300 · 15px · #8A8780 · line-height 1.8 · max-width 560px`

**Detalhe:**
`Florianópolis, Brasil. · Desde 2024.`
`Satoshi 300 · 11px · tracking 0.2em · uppercase · #4A4844`

**Entrada:** `opacity: 0→1` apenas. Sem transform. Fade puro e lento (800ms).
O ritmo mais lento da Home — propositalmente humano.

## Papel do 3D

**Nenhum.** Canvas off. Fundo sólido `#000F08`.
Esta seção é sobre presença humana — o 3D pausar é parte da mensagem.

## Papel do Motion

Mínimo. Apenas fade de entrada. `opacity: 0→1, 800ms ease`.
Sem animações de scroll para elementos individuais.
O ritmo lento contrasta com a intensidade da Paisagem Digital.

## Papel do HTML

**Total.** Texto semântico, legível, indexável.
Esta seção é importante para SEO — conteúdo de marca.

## CTA da Seção

Nenhum CTA diretamente. A seção é de humanização — a venda já foi feita
nas seções anteriores. O CTA Final vem a seguir.

## Transição para o CTA Final

Esta é a **segunda grande transição técnica da Home**.

1. Sobre faz `opacity: 1→0` ao scrollar para fora.
2. Canvas reativa: `opacity: 0→1` (600ms).
3. Fragmentos surgem dispersos no espaço (sem terreno).
4. A câmera os observa de longe — cada fragmento flutuando.
5. Conforme o scroll avança, os fragmentos começam a se mover.
6. A convergência começa.

---

---

# SEÇÃO 10 — CTA FINAL

---

## Objetivo

Converter. Encerrar a narrativa com força. O percurso inteiro da Home converge
aqui — literalmente: os fragmentos convergem para o símbolo.

## Pergunta que Responde ao Usuário

*"Como começo?"*

## Altura

`150vh`

## Hierarquia Visual — Convergência

```
╔═══════════════════════════════════════════╗  100svh (pinada)
║                                           ║
║  ▓    ▓         ▓           ▓    ▓        ║
║     ▓     ▓  ▓     ▓  ▓         ▓        ║  fragmentos
║  ▓        ▓           ▓                  ║  dispersos
║     ▓                    ▓    ▓     ▓    ║  → convergindo
║                                           ║
║              ▓▓▓▓▓▓                      ║  símbolo
║            ▓       ▓─────────────▓       ║  formando
║           ▓         (diagonal cbm-red)   ║
║            ▓       ▓                     ║
║              ▓▓▓▓▓▓                      ║
║                                           ║
║  Boas empresas constroem produtos.        ║  copy 1
║  Grandes empresas constroem percepção.    ║  "percepção" cbm-red
║                                           ║
║  Vamos construir a sua presença digital.  ║  copy 2
║                                           ║
║         [ BTN-P  Iniciar Projeto  ]       ║  CTA primário
║                                           ║
╚═══════════════════════════════════════════╝
```

## Conteúdo Principal

**Construção do símbolo** (controlada por scroll):
```
0%–40%:   fragmentos convergem lentamente
40%–70%:  símbolo começa a se formar
           - path esquerdo: Line2 #F5F2ED opacity 0→0.85
           - path direito: Line2 #F5F2ED opacity 0→0.85
70%–85%:  diagonal vermelha corta: Line2 #FB3640 opacity 0→1 (mais rápida)
85%–100%: símbolo completo, respira (organic motion), copy entra
```

**Copy principal:**
`Boas empresas constroem produtos.`
`Panchang 700 · clamp(24px, 3vw, 36px) · #F5F2ED`

`Grandes empresas constroem` **percepção.**
`mesma fonte · "percepção" em #FB3640`

**Espaço**

**Copy secundária:**
`Vamos construir a sua presença digital.`
`Satoshi 300 · 15px · #8A8780`

**CTA:**
`[ Iniciar Projeto ]`
`BTN-P grande · padding 18px 40px · font 13px · Panchang 600`

**Posicionamento:** copy e CTA no rodapé da seção, sobre o símbolo 3D.
O símbolo ocupa a parte superior/central do viewport.

## Papel do 3D

**CTAFormation** (a ser implementado — maior risco técnico do projeto):
- Fragmentos triangulados surgem no espaço escuro.
- Convergem em trajetórias curvas suaves para o centro.
- Formam o símbolo SVG em 3D (três paths).
- Path 1 (esq.): Line2, `#F5F2ED`, opacity 0→0.85.
- Path 2 (dir.): Line2, `#F5F2ED`, opacity 0→0.85.
- Path 3 (diagonal): Line2, `#FB3640`, opacity 0→1 — última, mais rápida.
- Símbolo gira levemente, respira.

## Papel do Motion

Progresso de scroll controla convergência dos fragmentos + build do símbolo.
Copy: entra com stagger quando símbolo está 85%+ formado.
`power2.out · 600ms`. CTA: `delay: 400ms` após a copy.

## Papel do HTML

Overlay crítico. Copy + botão são HTML sobre o canvas.
`pointer-events: none` no container. `pointer-events: auto` no botão.
`z-index: 20` para o conteúdo HTML.

## CTA da Seção

**Iniciar Projeto** — ação principal da Home inteira.
Deve levar para contato direto (WhatsApp, formulário ou e-mail).
`contato.codedbym@gmail.com` ou modal de contato rápido.

## Transição para o Footer

- Símbolo 3D faz `opacity: 1→0` suave ao scrollar além do CTA (400ms).
- Canvas desativa (`frameloop: "demand"`, sem renderização).
- Footer entra limpo sobre fundo `#000F08`.

---

---

# SEÇÃO 11 — FOOTER

---

## Objetivo

Fechar a experiência. Oferecer saídas alternativas. Reforçar a identidade
da marca. Passar credibilidade final.

## Altura

`auto` (não calculado em vh — cresce com o conteúdo)

## Hierarquia Visual

```
╔═══════════════════════════════════════════╗
║  ─────────────────────────────────────   ║  sep. 1px #1a2a1e
║                                           ║
║  [LOGO + WORDMARK]                        ║
║  Coded by M · Web Design Premium          ║
║                                           ║
║  Projetos   Laboratório   Sobre   Contato ║  nav links
║                                           ║
║  ─────────────────────────────────────   ║  sep. 0.5px
║                                           ║
║  codedbym.com                    © 2025  ║
║  Florianópolis, Brasil        @cbmstudio  ║
║                                           ║
╚═══════════════════════════════════════════╝
```

## Conteúdo Principal

**Logo + wordmark:**
SVG 32px height + `Coded by M` (Panchang 700, 16px, `"by"` em cbm-red)
`Web Design Premium` (Satoshi 400, 11px, tracking 0.3em, uppercase, cbm-gray-600)

**Navegação do footer:**
`Projetos · Laboratório · Sobre · Contato`
`Satoshi 400 · 11px · tracking 0.15em · uppercase · #4A4844`
`hover: #F5F2ED, 200ms ease`

**Informação:**
`codedbym.com · Florianópolis, Brasil`
`Satoshi 300 · 11px · #4A4844`

**Social:**
`@codedbymstudio`
`Satoshi 300 · 11px · #4A4844 · hover: cbm-white`

**Copyright:**
`© 2025 Coded by M`
`Satoshi 300 · 10px · tracking 0.2em · uppercase · #4A4844`

## Papel do 3D / Motion

Nenhum. Footer é HTML puro e estático.
Máxima leveza — o último elemento da Home deve ser o mais simples.

---

---

# FLUXO EMOCIONAL DETALHADO

```
FASE 1 — ATRAIR (Loading + Intro + Hero)
─────────────────────────────────────────

Loading:    O usuário para.
            "O que está acontecendo?" — mistério e precisão.
            Emoção: curiosidade ansiosa.

Intro:      O usuário começa a scrollar e a malha cresce.
            "Isso está respondendo ao meu scroll?" — fascínio.
            Emoção: descoberta, maravilha, desejo de continuar.

Hero:       A marca se revela.
            "Web Design Premium. OK, entendi o que é isso."
            Emoção: clareza, impacto, primeiras impressões positivas.


FASE 2 — CONVENCER (Problema + Serviços)
─────────────────────────────────────────

Problema:   O usuário reconhece o problema no próprio negócio.
            "Meu site também parece igual ao dos concorrentes."
            Emoção: identificação, leve incômodo, abertura para solução.

Serviços:   A solução fica clara e concreta.
            "Landing Pages. Sites Institucionais. Experiências Web. Certo."
            Emoção: profissionalismo percebido, confiança, clareza comercial.


FASE 3 — ENCANTAR (Paisagem Digital + Lab)
───────────────────────────────────────────

Paisagem:   O usuário experimenta o que a marca pode criar.
            "Isso é diferente do que eu já vi." → "Eu quero algo assim."
            Emoção: admiração, desejo, surpresa genuína.

Lab:        O usuário percebe que a marca está em evolução constante.
            "Eles não apenas entregam — eles pesquisam e experimentam."
            Emoção: curiosidade, respeito pela dedicação técnica.


FASE 4 — CONVERTER (Processo + Sobre + CTA)
────────────────────────────────────────────

Processo:   O usuário vê que existe método.
            "Existe estrutura por trás da estética."
            Emoção: segurança, redução do risco percebido.

Sobre:      O usuário encontra uma pessoa, não uma empresa genérica.
            "Tem alguém com visão real por trás disso."
            Emoção: conexão humana, confiança final.

CTA:        O percurso se fecha. A narrativa converge.
            "Grandes empresas constroem percepção."
            Emoção: conclusão poética, desejo de agir, urgência suave.
```

---

---

# ESTRATÉGIA MOBILE

## Princípio

A experiência mobile é uma versão focada da desktop — não uma versão reduzida.
O essencial deve estar perfeito. O secundário pode ser simplificado.

## Adaptações por Seção

**Loading:** idêntico ao desktop. Triângulo ao centro. Sem adaptação necessária.

**Intro:**
- Copy alinhada à esquerda, padding reduzido.
- Triangle Lines com menos camadas (foreground removida se GPU fraco).

**Hero:**
- Título: `clamp(40px, 9vw, 56px)` (menor que desktop).
- Subtítulo: `max-width: 320px`, fonte 14px.
- CTAs empilhados verticalmente, cada um 100% de largura.
- Navbar: links ocultos, só logo + botão "Iniciar Projeto" + hamburguer.

**Problema + Serviços:**
- Conteúdo alinhado à esquerda.
- Cards de Serviço em coluna única.

**Paisagem Digital:**
- Scroll length: 440vh.
- ProjectCard → painel inferior (mobile overlay).
- Connector SVG: oculto.
- Terreno: resolução reduzida (segX/segZ -40%).
- Câmera: micro-deriva desabilitada (câmera fixa entre poses).
- Touch: fragmento reage ao toque (já implementado com `useDiscovery`).

**Processo:**
- Etapas em coluna única.
- Linha SVG vertical.

**Sobre, Lab, Footer:** responsivos por CSS — sem adaptação especial de UX.

**CTA Final:**
- Símbolo 3D com geometria simplificada se GPU fraco.
- Botão de 100% de largura.

## O Que Nunca Muda no Mobile

- Cores: idênticas (temperatura é identidade).
- Tipografia: mesmas famílias, só tamanhos escalam.
- Foco e acessibilidade: idênticos.
- Sequência narrativa: idêntica.
- CTAs: mesmos textos, mesma hierarquia.

---

---

# ESTRATÉGIA DE CONVERSÃO

## Funil da Home

```
ATRAÇÃO           Loading + Intro
(prender atenção)

APRESENTAÇÃO      Hero
(o que fazemos)

QUALIFICAÇÃO      Problema + Serviços
(para quem é, o que resolve)

PROVA             Paisagem Digital
(o que já fizemos)

CREDIBILIDADE     Lab + Processo + Sobre
(como trabalhamos, quem somos)

CONVERSÃO         CTA Final
(uma ação clara)
```

## CTAs por Seção e Intenção

```
Hero:
  Primário "Iniciar Projeto" → cliente pronto para contato direto
  Secundário "Ver Projetos" → cliente quer ver mais provas primeiro
  (ambos sempre visíveis via Navbar)

Serviços:
  Link discreto "Iniciar seu projeto →" → cliente convencido pelos serviços

Paisagem:
  "Ver estudo de caso" em cada card → cliente quer aprofundar em projeto específico
  (converte para /cases/[slug] — não sai da narrativa de venda)

Lab:
  "Explorar Laboratório →" → cliente interessado em capacidade técnica

CTA Final:
  "Iniciar Projeto" (único, grande, centralizado) → conversão final
```

## Regras de Conversão

**Um CTA primário por vez.** Nunca dois botões vermelhos visíveis ao mesmo tempo
com a mesma hierarquia. Sempre um líder e um apoio.

**Não forçar conversão cedo.** O Hero tem CTA mas o visitante que não quer
clicar deve continuar a jornada naturalmente. A Paisagem Digital converte mais
do que o Hero para muitos perfis de clientes.

**Cases como ponte de conversão.** `/cases/[slug]` é onde a venda de prova
acontece. O link de cada card na Paisagem Digital deve ser o mais proeminente
CTA dessa seção.

**WhatsApp como conversão rápida.** O botão "Iniciar Projeto" deve abrir o
canal mais direto — WhatsApp ou modal simples (nome, empresa, mensagem).
Formulários longos matam conversão.

---

---

# MAPA VISUAL COMPLETO DA HOME

```
VIEWPORT  CONTEÚDO                          3D         EMOÇÃO
═════════════════════════════════════════════════════════════
  100vh   LOADING                           Máximo     Mistério
          ┌──── triângulo ────────────┐     Isolado
          │    · · ▲ · ·             │
          │    ·/   \·               │
          │   ·/─────\·              │
          └──────────────────────────┘

  100vh   ─────── scroll começa ────────── Crescendo  Descoberta
  200vh   INTRO                            Ativo
          ┌──── malha crescendo ──────┐
          │  ░░░░░░░░░░░░░░░░░░░░░░  │
          │  Toda grande presença...  │
          └──────────────────────────┘

  100vh   HERO                             Fundo vivo  Clareza
          ┌──── navbar + copy ────────┐
          │ [LOGO] cbm    [BTN-P]     │
          │                           │
          │  CODED BY M               │
          │  Web Design Premium...    │
          │  [BTN-P] [BTN-S]          │
          └──────────────────────────┘

   80vh   PROBLEMA                         Residual   Reconhecimento
          ┌──── copy limpa ───────────┐
          │                           │
          │  A maioria dos sites      │
          │  parece igual.            │
          └──────────────────────────┘

  100vh   SERVIÇOS                         Residual   Confiança
          ┌──── 3 cards ──────────────┐
          │ [~~card~~] [~~card~~] [~~]│
          │  Landing   Instit.  Exp.  │
          └──────────────────────────┘

  400vh   PAISAGEM DIGITAL                 Máximo     Admiração
          ┌──── terrain + câmera ─────┐    Terrain   Desejo
          │ ░░░░░░░░░░░░░░░░░░░░░░░░ │
          │ ░░░ ▲A ░░░░░░░░░░░░░░░░░ │  ←câmera navega
          │ ░░░░│░░ ▓▓░░░░░ ▲B ░░░░░ │    entre projetos
          │ ░░░░└──[card A] │░░░░░░░ │
          │ ░░░░░░░░░░░ [card B] ░░░ │
          │ ░░░░░░░░░░░░░░░░░░░ ▲C░░ │
          └──────────────────────────┘

  100vh   LABORATÓRIO                      Residual   Curiosidade
          ┌──── thumbnails + cta ─────┐    Fading
          │  Explorações visuais...   │
          │  [img] [img] [img]        │
          │  [LINK Explorar →]        │
          └──────────────────────────┘

  100vh   PROCESSO                         Off        Segurança
          ┌──── etapas + svg ─────────┐    #000F08
          │ 01──02──03──04            │    sólido
          │ Est  Des  Cod  Res        │
          └──────────────────────────┘

  120vh   SOBRE                            Off        Conexão
          ┌──── texto ────────────────┐
          │  A Coded by M une...      │
          │  ── ── ── ── ──           │
          │  Acredito que um bom...   │
          └──────────────────────────┘

  150vh   CTA FINAL                        Máximo     Conclusão
          ┌──── símbolo + copy ───────┐    CTAFormation
          │   ▓    ▓   →  ▓▓▓▓▓▓     │    Convergência
          │     ▓  → ▓ ─────────▓    │
          │  Boas empresas...         │
          │  Grandes empresas...      │
          │  percepção (vermelho)     │
          │  [BTN-P Iniciar Projeto]  │
          └──────────────────────────┘

   auto   FOOTER                           Off        Fechamento
          ┌──── links + info ─────────┐
          │  [LOGO] Coded by M        │
          │  Projetos Lab Sobre...    │
          └──────────────────────────┘
```

---

*Documento criado em 2026-05-30. Referências: docs/03 a docs/10,
components/lab/\*\*.\*\*.*
