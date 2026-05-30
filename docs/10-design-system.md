# 10 — Design System

# Coded by M — Sistema de Design

## 1. Objetivo do Design System

Este documento é a fonte única da verdade visual da Coded by M.

Ele traduz a identidade da marca — validada no Brand Guide, aplicada no Experience
Lab — em tokens, regras e padrões utilizáveis diretamente na implementação da Home.

Quem consulta este documento deve conseguir responder, sem ambiguidade:

- Qual cor usar neste contexto
- Qual tamanho de fonte e qual peso
- Qual espaçamento entre elementos
- Qual duração e easing para esta animação
- Quais valores 3D para esta cena
- O que é permitido e o que é proibido visualmente

Este não é um design system genérico. Ele existe para a Home cinematográfica
da Coded by M — premium, técnica, estrutural — e para nenhum outro projeto.

---

## 2. Princípios Visuais

Toda decisão visual deve respeitar os seguintes princípios, em ordem de prioridade:

**Clareza comercial acima de tudo.**
Se uma escolha visual dificultar a leitura da mensagem comercial, ela está errada.
A experiência existe para valorizar o trabalho, não para competir com ele.

**Três elementos, não mais.**
A gramática visual é: fundo profundo + estrutura quente + sinal vermelho.
Nenhum outro elemento entra no sistema sem propósito narrativo claro.

**Construção, não decoração.**
Cada elemento visual — linha, ponto, borda, animação — deve existir como parte
de uma estrutura em construção. Ornamento sem função é ruído.

**Temperatura, não contraste neutro.**
As cores da marca têm temperatura (verde no preto, quente no branco). Trocar por
equivalentes neutros (`#000000`, `#ffffff`) quebra a identidade.

**Raridade cria impacto.**
O vermelho só funciona porque aparece poucas vezes. A regra de raridade se aplica
a todos os elementos de destaque: quanto menos frequente, maior o impacto.

---

## 3. Sistema de Cores

### Cores Primárias

```
Deep Black     #000F08   Fundo base de toda a experiência
Signal Red     #FB3640   Ação, sinal, corte, destaque máximo
Off White      #F5F2ED   Texto principal, geometria 3D, elementos de alta hierarquia
Forest Dark    #0E1810   Fundos secundários, cards, overlays, separadores
```

### Escala de Neutros Quentes

```
Gray 100       #E8E4DE   Texto sobre fundos claros
Gray 200       #C8C4BE   Geometria 3D de camada intermediária
Gray 400       #8A8780   Texto secundário, labels, geometria distante
Gray 600       #4A4844   Texto terciário, datas, categorias, captions
Gray 800       #1E1E1A   Separadores leves, bordas muito discretas
```

### Cores de Suporte

```
Red Dark       #C42030   Hover do vermelho, sombra de elemento ativo
Border         #1a2a1e   Borda padrão (temperatura verde, discreta)
Border Active  #2a4a32   Borda em hover/estado ativo
Glow           rgba(251,54,64,0.06)   Ambient vermelho máximo permitido
```

### Regra de Temperatura

Os fundos da Coded by M não são neutros. `#000F08` tem um traço de verde
que o diferencia de `#000000`. `#F5F2ED` tem um traço de bege que o diferencia
de `#ffffff`. `#0E1810` é perceptivelmente verde-escuro.

Esta temperatura é a impressão digital da marca. Nunca substituir por equivalentes
neutros — a identidade se perde.

---

## 4. Tokens de Cor

Tokens para Tailwind (`tailwind.config.ts`) e CSS Custom Properties.

### Tailwind — extensão de cores

```js
// tailwind.config.ts
colors: {
  cbm: {
    black:          '#000F08',
    forest:         '#0E1810',
    white:          '#F5F2ED',
    red:            '#FB3640',
    'red-dark':     '#C42030',
    border:         '#1a2a1e',
    'border-active':'#2a4a32',
    gray: {
      100: '#E8E4DE',
      200: '#C8C4BE',
      400: '#8A8780',
      600: '#4A4844',
      800: '#1E1E1A',
    },
  },
}
```

### CSS Custom Properties

```css
:root {
  /* Primárias */
  --cbm-black:          #000F08;
  --cbm-forest:         #0E1810;
  --cbm-white:          #F5F2ED;
  --cbm-red:            #FB3640;
  --cbm-red-dark:       #C42030;

  /* Neutros */
  --cbm-gray-100:       #E8E4DE;
  --cbm-gray-200:       #C8C4BE;
  --cbm-gray-400:       #8A8780;
  --cbm-gray-600:       #4A4844;
  --cbm-gray-800:       #1E1E1A;

  /* Bordas */
  --cbm-border:         #1a2a1e;
  --cbm-border-active:  #2a4a32;

  /* Glow */
  --cbm-glow:           rgba(251, 54, 64, 0.06);
  --cbm-glow-strong:    rgba(251, 54, 64, 0.08);
}
```

### Mapeamento semântico

```
Fundo de página:          cbm-black
Fundo de card:            cbm-forest
Fundo de painel mobile:   cbm-black

Texto título:             cbm-white
Texto corpo:              cbm-gray-200
Texto secundário:         cbm-gray-400
Texto terciário:          cbm-gray-600
Texto label/caption:      cbm-gray-600

Ação primária (bg):       cbm-red
Ação primária (text):     cbm-black
Ação secundária (text):   cbm-white
Ação secundária (border): cbm-border-active

Borda padrão:             cbm-border
Borda ativa/hover:        cbm-border-active
Separador:                cbm-gray-800

Tag/label colorida:       cbm-red (opacity 0.7)
Destaque inline:          cbm-red
Underline de CTA:         cbm-red
Focus ring:               cbm-red
```

---

## 5. Sistema Tipográfico

A Coded by M usa dois typefaces exclusivamente.

**Panchang** — display e hierarquia. Carregada via Fontshare. Pesos 200–800.
**Satoshi** — corpo e interface. Carregada via Fontshare. Pesos 300–700.

Nenhuma outra fonte é permitida. System fonts (`font-family: system-ui`) só são
aceitáveis como fallback durante o carregamento, nunca como fonte final renderizada.

```css
:root {
  --font-display: 'Panchang', sans-serif;
  --font-body:    'Satoshi', sans-serif;
}
```

### Carregamento das fontes

```html
<!-- Preload para evitar FOUT no Hero -->
<link rel="preconnect" href="https://api.fontshare.com" />
<link
  rel="stylesheet"
  href="https://api.fontshare.com/v2/css?f[]=panchang@200,300,400,500,600,700,800&f[]=satoshi@300,400,500,700&display=swap"
/>
```

---

## 6. Escala de Tamanhos de Fonte

| Token | Família | Peso | Tamanho | Tracking | Line Height | Uso |
|---|---|---|---|---|---|---|
| `text-display` | Panchang | 800 | clamp(56px, 8vw, 80px) | -0.03em | 0.92 | Hero H1, CTA principal |
| `text-h1` | Panchang | 700 | clamp(40px, 5vw, 56px) | -0.02em | 1.05 | Títulos de seção |
| `text-h2` | Panchang | 600 | clamp(28px, 3.5vw, 36px) | -0.01em | 1.15 | Subtítulos, cards grandes |
| `text-h3` | Panchang | 500 | clamp(18px, 2vw, 22px) | 0 | 1.25 | Títulos de cards, etapas |
| `text-body-lg` | Satoshi | 300 | clamp(14px, 1.5vw, 17px) | 0 | 1.75 | Subtítulo Hero, intro copy |
| `text-body` | Satoshi | 400 | 15px | 0 | 1.7 | Copy de seção padrão |
| `text-body-sm` | Satoshi | 300 | 13px | 0 | 1.7 | Descrição de card, texto secundário |
| `text-label` | Satoshi | 500 | 9px | 0.35em | 1.4 | Tags de seção, categorias |
| `text-caption` | Satoshi | 300 | 10px | 0.3em | 1.5 | Legendas, metadados |
| `text-ui` | Panchang | 600 | 11px | 0.15em | 1 | Botões, links de navegação, CTAs |
| `text-micro` | Satoshi | 400 | 8–9px | 0.25em | 1.4 | Informação de apoio, datas |

Todos os tokens `text-label`, `text-caption`, `text-ui` e `text-micro` são
`text-transform: uppercase`.

### Aplicação de clamp

O clamp garante que os títulos escalam com o viewport sem quebrar. A variável
do meio (ex: `5vw`) controla a inclinação da curva. Nunca usar `vw` sem clamp
— fontes que crescem infinitamente são ilegíveis em viewports muito largos.

---

## 7. Regras de Uso da Panchang

**Onde usar:**
- Todos os títulos H1, H2, H3 e Display
- Wordmark da marca ("Coded by M")
- Texto de todos os botões e CTAs
- Números decorativos de seção (01, 02, 03)
- Títulos de projetos no ProjectCard
- Etapas do Processo

**Como usar:**
- Sempre `letter-spacing: -0.02em` a `-0.03em` em tamanhos display/H1
- Sempre `text-transform: uppercase` em CTAs e botões
- "by" no wordmark recebe `color: cbm-red` — única exceção de cor em meio a texto
- Números decorativos de seção (01, 02, 03): Panchang 800, `color: #1a2e1e`,
  tamanho 40–64px — quase invisíveis, criam profundidade sem ruído

**O que não fazer:**
- Não usar Panchang em texto de corpo longo (mais de 3 linhas)
- Não usar pesos abaixo de 500 em títulos de interface
- Não usar italic (a fonte não tem família italic projetada para a marca)
- Não usar tracking positivo em tamanhos display (exceto em UI pequenos)

---

## 8. Regras de Uso da Satoshi

**Onde usar:**
- Todo texto de corpo, parágrafos, descrições
- Labels, categorias, tags, captions
- Texto do ProjectCard (categoria, descrição)
- Links de navegação
- Texto de apoio, metadados, datas

**Como usar:**
- Corpo principal: 400, linha 1.7
- Texto secundário: 300, cor `cbm-gray-400`
- Labels em uppercase: 500, tracking 0.35em, 9px
- Captions em uppercase: 300, tracking 0.3em, 10px
- Nunca usar Satoshi Bold (700) em mais de uma palavra de destaque

**O que não fazer:**
- Não usar Satoshi em títulos de seção (domínio da Panchang)
- Não usar tracking muito apertado em corpo (tracking: 0 é o mínimo para Satoshi)
- Não usar Satoshi 700 como "quase Panchang" — se precisa de peso visual alto,
  usar Panchang

---

## 9. Grid e Layout

### Container principal

```
max-width:   1440px
padding-x:   clamp(24px, 5vw, 80px)
margin:      0 auto
```

### Container de conteúdo (texto/copy)

```
max-width:   900px
```

### Container estreito (cards de projeto, sobre)

```
max-width:   680px
```

### Breakpoints

```
mobile:   < 640px   (--screen-sm)
tablet:   640–1024px (--screen-md)
desktop:  > 1024px  (--screen-lg)
wide:     > 1440px  (--screen-xl)
```

### Grid de seção (para layouts de 2 colunas)

```
grid-template-columns: 1fr 1fr   (desktop)
grid-template-columns: 1fr       (mobile)
gap: clamp(24px, 4vw, 48px)
```

---

## 10. Espaçamentos

### Escala base (múltiplos de 4)

```
--space-1:   4px
--space-2:   8px
--space-3:   12px
--space-4:   16px
--space-6:   24px
--space-8:   32px
--space-10:  40px
--space-12:  48px
--space-16:  64px
--space-20:  80px
--space-24:  96px
--space-28:  100px
--space-32:  128px
```

### Espaçamento de seção

```
Padding vertical mínimo de seção:    60px  (mobile)
Padding vertical padrão de seção:    100px (desktop)
Padding vertical de seção grande:    120px (Hero, CTA Final)
```

### Espaçamento interno de card

```
Padding de card compacto:    12px–16px
Padding de card médio:       24px–28px
Padding de card grande:      36px–48px
```

---

## 11. Container

### Estrutura de página

```
<body>                          bg: cbm-black, font: Satoshi
  <HomeCanvas>                  position: fixed, inset: 0, z-index: 0
  <main>                        position: relative, z-index: 1
    <HomeNav>                   position: fixed, top: 0, z-index: 50
    <section>Loading</section>
    <section>Intro</section>
    ... demais seções
```

O canvas 3D é fixo e fica atrás de todo o conteúdo HTML. O scroll acontece
no `<main>`. O canvas reage ao scroll via `progress` refs — sem re-render.

### Z-index scale

```
Canvas 3D:           0
HTML de seção:       1–9
Overlay de 3D:       10–19  (Connector, filter badge)
ProjectCard:         20
Navbar:              50
Loading overlay:     100
```

---

## 12. Sistema de Botões

### Botão Primário (CTA principal)

```
Família:      Panchang
Peso:         600
Tamanho:      11px
Tracking:     0.15em
Case:         uppercase
Background:   cbm-red   (#FB3640)
Cor texto:    cbm-black (#000F08)
Padding:      14px 28px
Border:       none
Border-radius: 0  ← angular, faz parte da linguagem
Cursor:       pointer

Hover:
  Background: cbm-red-dark (#C42030)
  Transition: background 150ms ease

Focus:
  Outline: 2px solid #FB3640
  Outline-offset: 3px
```

Exemplo de classes Tailwind:
```
bg-cbm-red text-cbm-black px-7 py-3.5
font-display font-semibold text-[11px] tracking-[0.15em] uppercase
hover:bg-cbm-red-dark transition-colors duration-150
focus-visible:outline focus-visible:outline-2 focus-visible:outline-cbm-red
focus-visible:outline-offset-[3px]
```

### Botão Secundário

```
Background:   transparent
Cor texto:    cbm-white
Padding:      14px 28px (mesmo que primário)
Border:       1px solid cbm-border-active (#2a4a32)
Border-radius: 0

Hover:
  Border-color: cbm-white (#F5F2ED)
  Transition: border-color 150ms ease
```

### Link CTA (inline, sem box)

```
Família:      Panchang
Peso:         600
Tamanho:      11px
Tracking:     0.15em
Case:         uppercase
Cor:          cbm-white
Border-bottom: 1px solid cbm-red
Padding-bottom: 2px

Hover:
  Cor: cbm-red
  Transition: color 200ms ease
```

Usado em: CTA inline do ProjectCard ("Ver estudo de caso →").

---

## 13. Sistema de Cards

### ProjectCard (HTML Overlay)

```
Background:   cbm-forest (#0E1810)
Border:       1px solid cbm-border (#1a2a1e)
Border-left:  2px solid cbm-red (#FB3640)   ← acento de identificação
Border-radius: 0
Width (desktop): 208px (w-52)
Padding:      12px (compacto) / 16px (expandido)
Shadow:       0 2px 12px rgba(0,0,0,0.28)

Categoria/tipo:
  Família: Satoshi 500
  Tamanho: 9px
  Tracking: 0.32em
  Case:    uppercase
  Cor:     cbm-red, opacity 0.7

Título do projeto:
  Família: Panchang 700
  Tamanho: 14–16px
  Cor:     cbm-white

Descrição:
  Família: Satoshi 300
  Tamanho: 12–13px
  Cor:     cbm-gray-400
  Line-height: 1.7

Link "Ver estudo de caso":
  Família: Panchang 600, 11px, tracking 0.15em, uppercase
  Cor:     cbm-white
  Border-bottom: 1px solid cbm-red
  Hover:   cbm-red

Botão fechar (mobile):
  Cor: cbm-gray-400
  Hover: cbm-white
  Focus: ring cbm-red
```

### Cards de Serviço

```
Background:   transparent (sem fill)
Border:       1px solid cbm-border (#1a2a1e)
Border-radius: 0
Padding:      32px–40px

Borda animada (entrada):
  stroke-dasharray: total-length
  stroke-dashoffset: total-length → 0
  Duration: 600ms, ease power1.inOut

Título do serviço:
  Família: Panchang 600
  Tamanho: 18–22px
  Cor:     cbm-white

Descrição:
  Família: Satoshi 300
  Tamanho: 14px
  Cor:     cbm-gray-400

Hover:
  Border-color: cbm-border-active (#2a4a32)
  Transition: border-color 200ms ease
```

---

## 14. Sistema de Overlays

### Camada de overlay sobre 3D

Todos os overlays HTML sobre o canvas seguem o mesmo padrão:

```
Position:   absolute, inset-0
Z-index:    10–20
Pointer-events: none por padrão
             pointer-events: auto apenas em elementos interativos
```

### Connector (linha técnica)

```
Elemento:   SVG, position absolute, inset-0, full size
Linha:      stroke rgba(251,54,64,0.5), strokeWidth 1, shapeRendering crispEdges
Ponto:      fill #FB3640, r 2.4
Visível apenas: desktop (pointer: fine)
Transição:  opacity 200ms ease
```

### FragmentFilter (filtro da Paisagem Digital)

```
Position:   absolute, top-4 right-4 (ou equivalente)
Background: cbm-black, opacity 0.8
Border:     1px solid cbm-border
Padding:    8px 12px
Gap entre itens: 4px

Item inativo:
  Família: Satoshi 400, 10px, tracking 0.2em, uppercase
  Cor:     cbm-gray-600

Item ativo:
  Cor:     cbm-white
  Border-bottom: 1px solid cbm-red
```

### Painel compacto mobile (ProjectCard)

```
Position:   fixed, inset-x-3 bottom-3
Background: cbm-black
Border-top: 1px solid cbm-border
Border-left: 2px solid cbm-red
Max-width:  sm (440px)
Padding:    16px
Border-radius: 0

Desliza de baixo: transform translateY(100%) → translateY(0)
Duration: 300ms, ease power2.out
```

---

## 15. Sistema de Navegação

### HomeNav

```
Position:     fixed, top-0, full width
Height:       60px desktop / 56px mobile
Z-index:      50
Background:   transparent → cbm-black/90 com backdrop-blur
              (transição ao scrollar ~100px)
Border-bottom: none → 1px solid cbm-border (ao scrollar)

Logo (símbolo SVG):
  width: 28px height: 32px
  Cores: estrutura cbm-white, diagonal cbm-red

Wordmark:
  Família: Panchang 700
  Tamanho: 16px
  Cor:     cbm-white
  "by" em cor cbm-red

Links de navegação:
  Família: Satoshi 400, 11px, tracking 0.15em, uppercase
  Cor:     cbm-gray-400
  Hover:   cbm-white, transition 200ms

CTA "Iniciar Projeto":
  Botão primário tamanho reduzido (padding 10px 20px, font 10px)

Regra: sempre acessível. Nunca esconder a navbar em nenhum estado do scroll.
       O site pode ser cinematográfico mas não pode ser difícil de navegar.
```

---

## 16. Sistema de Seções da Home

Cada seção tem altura definida, tipo de fundo e comportamento do canvas.

| Seção | Altura | Fundo | Canvas 3D | Pino |
|---|---|---|---|---|
| Loading | 100vh | cbm-black | Isolado, ativo | — |
| Intro | 200vh | cbm-black | Ativo (build) | ScrollTrigger pin |
| Hero | 100vh | cbm-black | Ativo (loop) | Sem pino |
| Problema | 80vh | cbm-black | Residual | Sem pino |
| Serviços | 100vh | cbm-black | Residual | Sem pino |
| Paisagem Digital | 400vh | cbm-black | Máximo (Terrain) | Container scroll |
| Laboratório | 100vh | cbm-black | Residual (fade) | Sem pino |
| Processo | 100vh | cbm-black | Off (opacity 0) | Sem pino |
| Sobre | 120vh | cbm-black | Off | Sem pino |
| CTA Final | 150vh | cbm-black | Ativo (CTAFormation) | ScrollTrigger pin |

### Estrutura interna de cada seção

```html
<section data-section="hero" class="relative min-h-screen">
  <!-- HTML Layer: conteúdo semântico e indexável -->
  <div class="relative z-10 ...">
    <h1>...</h1>
    <p>...</p>
    <div>CTA</div>
  </div>
  <!-- 3D interage com o canvas fixo via scroll progress -->
</section>
```

---

## 17. Sistema de Estados

### Estado padrão (repouso)

Texto em `cbm-white`. Bordas em `cbm-border`. Background em `cbm-black`.
Nenhum elemento vermelho ativo. 3D vivo mas discreto.

### Estado hover

```
Links:        cor cbm-white → cbm-red (se o link for secundário)
              cor cbm-red-dark (se o elemento já era vermelho)
Cards:        border cbm-border → cbm-border-active
Botão 1°:     bg cbm-red → cbm-red-dark
Botão 2°:     border cbm-border-active → cbm-white
Fragmento 3D: scale ×1.07, edge opacity +0.32, apex cbm-red ativo
```

### Estado ativo (fragmento selecionado)

```
Fragmento:    scale ×1.12, edge opacity 0.70, apex scale ×1.36
Apex:         cbm-red (#FB3640)
Connector:    visível (stroke cbm-red opacity 0.5, dot cbm-red)
Card HTML:    aparece (opacity 0 → 1, 200ms ease)
```

### Estado foco (teclado)

```
Outline:        2px solid cbm-red (#FB3640)
Outline-offset: 3px
Border-radius:  0 (consistente com a linguagem angular)
```

Nunca usar `outline: none` sem substituto. O foco vermelho é parte da
identidade e da acessibilidade ao mesmo tempo.

### Estado dormant (fragmento fora da janela de scroll)

```
Opacity edge:   0
Opacity nodes:  0
Scale:          0
```

O fragmento é fisicamente presente mas completamente invisível. `computePresence`
controla a transição suave de 0 para presença.

---

## 18. Sistema de Hover

O hover na Coded by M **revela**, não apenas destaca.

### Princípio

Hover de um elemento deve mostrar algo que antes não estava visível ou não estava
em foco. Não é um simples brilho ou troca de cor — é uma descoberta.

### Regras

**Transição de entrada:** sempre `ease power2.out` (ou `cubic-bezier(0.33,1,0.68,1)`).
**Transição de saída:** sempre mais rápida que a entrada (80% da duração de entrada).
**Duração de hover:** 150ms–200ms. Nunca acima de 300ms em hover.
**Sem bounce:** `ease` nunca com overshoot em micro-interações de hover.

### Comportamentos por elemento

```
Link de navegação:
  entrada: color cbm-gray-400 → cbm-white, 200ms ease
  saída:   150ms ease

Botão primário:
  entrada: bg cbm-red → cbm-red-dark, 150ms ease
  saída:   100ms ease

Card de serviço:
  entrada: border cbm-border → cbm-border-active, 200ms ease
  saída:   150ms ease

ProjectCard (CTA inline):
  entrada: color cbm-white → cbm-red, 200ms ease
  saída:   150ms ease

Fragmento 3D:
  entrada: lerp 0→1 com FRAGMENT.highlightLerp = 6 (por frame, ~100ms)
  saída:   mesmo lerp, lerp de volta para 0
  efeito:  scale, edge opacity, apex vermelho — tudo junto

Thumbnail do Lab:
  entrada: border cbm-border → cbm-border-active + leve escala (1.0 → 1.02)
  saída:   150ms ease
```

---

## 19. Sistema de Foco e Acessibilidade

### Regra de ouro

Todo elemento interativo deve ter estado de foco visível e distinto do estado
padrão. O foco vermelho é a implementação padrão da marca — não é opcional.

### Implementação

```css
:focus-visible {
  outline: 2px solid #FB3640;
  outline-offset: 3px;
  border-radius: 0;
}
```

Em Tailwind: `focus-visible:outline focus-visible:outline-2 focus-visible:outline-cbm-red focus-visible:outline-offset-[3px]`

### prefers-reduced-motion

Todo hook de animação deve verificar `prefers-reduced-motion`:

```ts
const prefersReduced =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Se reduced: pular animação, mostrar estado final
if (prefersReduced) {
  reveal.current = 1; // skip build
  return;
}
```

Quando `prefers-reduced-motion: reduce`:
- Build animations (TriangleLoader, TrianglLines, Terrain): mostram estado final
  imediatamente
- Scroll camera: câmera pula para a pose ativa sem interpolação
- Transições de página: `opacity: 0 → 1` em 200ms, sem transform
- Loop animations (organic motion, living lattice): pausadas

### Acessibilidade semântica

```
Canvas:     <canvas aria-hidden="true"> — sempre
Conteúdo:   Nunca dentro do canvas — sempre em HTML
Imagens:    alt text obrigatório
ProjectCard: role="dialog" quando painel compacto aberto
              aria-label com nome do projeto
              foco movido para o card ao abrir
              Escape fecha o card
              foco retorna ao elemento que o abriu
```

### Contraste mínimo

```
Texto principal (cbm-white sobre cbm-black): 15.7:1 — AAA
Texto secundário (cbm-gray-400 sobre cbm-black): 4.7:1 — AA
Texto do card (cbm-gray-400 sobre cbm-forest): 4.2:1 — AA
Botão primário (cbm-black sobre cbm-red): 5.9:1 — AA
```

---

## 20. Motion Tokens

### Durações

```
--dur-instant:    150ms   micro-interações, hover in/out
--dur-quick:      300ms   hover de card, focus ring, toggle de estado
--dur-normal:     600ms   entrada de seção, card aparece, dissolve suave
--dur-slow:       900ms   transições de cena, câmera major
--dur-xslow:      1200ms  cenas cinematográficas (Loading enter, etc.)
--dur-narrative:  2600ms  build animations do Lab (terrain, lattice)
--dur-rotation:   28s     rotação loop do triângulo (não é transição)
```

### Easings

```
ease-build:      power2.out           → GSAP "power2.out"
                 CSS: cubic-bezier(0.33, 1, 0.68, 1)
                 Uso: elementos surgindo, pontos aparecendo

ease-draw:       power1.inOut         → GSAP "power1.inOut"
                 CSS: cubic-bezier(0.45, 0, 0.55, 1)
                 Uso: linhas se desenhando, bordas de card

ease-fade:       ease                 → CSS "ease"
                 Uso: opacidade, transitions simples

ease-camera:     smoothstep           → t² × (3 - 2t)
                 Uso: câmera entre keyframes (useScrollCamera)

ease-enter:      power2.out           → mesmo que ease-build
                 Uso: texto de seção entrando no scroll

ease-exit:       power1.in            → GSAP "power1.in"
                 Uso: elementos saindo
```

### Delays de stagger

```
stagger-text:    100ms   linhas de copy entrando em sequência
stagger-card:    150ms   cards de serviço entrando em sequência
stagger-layer:   550ms   camadas do Terrain Mesh construindo (de trás pra frente)
stagger-fragment:220ms   fragmentos surgindo um por um
```

### Scroll

```
Lenis lerp:      0.08   suavidade do scroll (0=instantâneo, 1=sem movimento)
ScrollTrigger:   start "top top", end "bottom bottom" (seções pinadas)
```

---

## 21. Tokens para 3D

Valores para materiais, câmera e geometria nos componentes React Three Fiber.

### Canvas

```
background:  #000F08    (mesmo que a página — sem borda visual)
antialias:   true
alpha:       false      (fundo opaco — mais performático)
dpr:         [1, 1.5]   (máximo 1.5 em produção — performance mobile)
frameloop:   "always"   (Intro, Hero, Paisagem)
             "demand"   (Loading, CTA quando estático)
```

### Câmera padrão

```
fov:         42
near:        0.1
far:         100
position:    [0, 3.4, 7.6]  (em unidades normalizadas, × fit)
```

### Materiais

```
Tipo padrão para tudo: MeshBasicMaterial
                       (sem iluminação — performance e look flat premium)

Line2 para arestas:    linewidth em px lógicos
Points para partículas: sizeAttenuation: true
```

---

## 22. Tokens para Terrain Mesh

```ts
// COLORS
background: '#000F08'

// FOG
color: '#000F08',  near: 6,  far: 17

// LAYERS — edgeColor por profundidade
foreground.edgeColor:   '#F5F2ED'   edgeOpacity: 0.35
midground.edgeColor:    '#C8C4BE'   edgeOpacity: 0.18
background.edgeColor:   '#8A8780'   edgeOpacity: 0.08

// LAYERS — fillColor (temperatura verde-escura)
foreground.fillLow:     '#0a0f0b'   fillHigh: '#1e2a20'   fillOpacity: 0.60
midground.fillLow:      '#080d09'   fillHigh: '#162018'   fillOpacity: 0.52
background.fillLow:     '#060a07'   fillHigh: '#0e1810'   fillOpacity: 0.36

// CAMERA
position:   [0, 3.4, 7.6]
fov:        42
target:     [0, -0.1, -0.6]
driftX:     0.7   driftY: 0.28   driftZ: 0.35
speedX:     0.045 speedY: 0.06   speedZ: 0.035

// TIMING
startDelay:     0.4s
buildDuration:  2.6s
layerStagger:   0, 0.35, 0.70 (back → front)
```

---

## 23. Tokens para Project Fragments

```ts
// FRAGMENT_COLORS
edge:                 '#F5F2ED'
edgeNormalOpacity:    0.24
edgeHighlightOpacity: 0.56
node:                 '#F5F2ED'
nodeNormalOpacity:    0.42
nodeHighlightOpacity: 0.85
apex:                 '#FB3640'   ← sinal vermelho — obrigatório
label:                '#4A4844'

// FRAGMENT geometry
baseRadius:           0.34
apexHeight:           0.50
surfaceLift:          0.06
highlightLift:        0.08
scaleHighlight:       1.07
nodeRadius:           0.032
highlightLerp:        6    (lerp por frame — ~100ms visual)

// LABEL (Billboard 3D)
fontSize:             0.085
letterSpacing:        0.26
fillOpacity:          0.7
showThreshold:        0.5   (só aparece quando h > 0.5)

// TIMING
startDelay:           1.8s
stagger:              0.22s
duration:             0.9s

// FRAGMENT_MOTION
bobAmplitude:         0.02
bobPeriod:            6.5s
yawPeriod:            34s
```

---

## 24. Tokens para HTML Overlay

```ts
// ProjectCard visual
cardBackground:       '#0E1810'
cardBorder:           '#1a2a1e'
cardBorderLeft:       '#FB3640'   (2px, acento de identidade)
cardBorderRadius:     0
cardShadow:           '0 2px 12px rgba(0,0,0,0.28)'

cardWidth:            208px  (desktop, w-52)
cardPaddingDesktop:   12px
cardPaddingCompact:   16px

// Tipografia do card
typeCategory:         Satoshi 500, 9px, tracking 0.32em, uppercase, cbm-red 0.7
typeTitle:            Panchang 700, 14–16px, cbm-white
typeDescription:      Satoshi 300, 12–13px, cbm-gray-400, line-height 1.7
typeCTA:              Panchang 600, 11px, tracking 0.15em, uppercase, cbm-white
typeCTAHover:         cbm-red
typeCTAUnderline:     border-bottom 1px solid cbm-red

// Connector
connectorStroke:      'rgba(251,54,64,0.5)'
connectorStrokeWidth: 1
connectorDotFill:     '#FB3640'
connectorDotRadius:   2.4

// Focus
focusRing:            '2px solid #FB3640'
focusRingOffset:      '3px'

// Overlay positioning
offsetX:              14px   (card deslocado do ponto 3D projetado)
offsetY:              10px
margin:               14px   (margem mínima das bordas da tela)
compactQuery:         '(max-width: 640px), (pointer: coarse)'
```

---

## 25. Tokens para Scroll Camera

```ts
// Scroll
scrollLengthDesktop:  580vh
scrollLengthCompact:  440vh
lenisLerp:            0.08

// Poses de câmera (normalizadas, × fit em world)
poses: [
  { p: 0.00, pos: [0, 3.4, 7.6],    tgt: [0, -0.1, 0.0] },  // ampla
  { p: 0.10, pos: [0, 3.0, 6.2],    tgt: [0, -0.3, 0.5] },
  { p: 0.24, pos: [-1.0, 2.6, 4.0], tgt: [-1.5, -0.4, 1.3] }, // A
  { p: 0.38, pos: [-0.8, 2.4, 3.4], tgt: [-1.5, -0.4, 1.3] },
  { p: 0.52, pos: [0.8, 2.8, 1.8],  tgt: [2.0, -0.4, -1.3] }, // B
  { p: 0.64, pos: [1.2, 2.5, 0.8],  tgt: [2.0, -0.4, -1.3] },
  { p: 0.76, pos: [0.2, 3.0, -1.0], tgt: [-0.6, -0.3, -4.0] },// C
  { p: 0.86, pos: [-0.2, 2.6, -2.2],tgt: [-0.6, -0.4, -4.0] },
  { p: 0.94, pos: [0.5, 3.6, 1.5],  tgt: [0, -0.2, -1.5] },
  { p: 1.00, pos: [0, 3.4, 7.6],    tgt: [0, -0.1, 0.0] },   // retorno
]

// Posições dos fragmentos (local HOST_LAYER)
fragmentA:    { x: -1.5, z: 1.8 }   // próximo, esquerda
fragmentB:    { x: 2.0,  z: -0.8 }  // médio, direita
fragmentC:    { x: -0.6, z: -3.5 }  // fundo, levemente esquerda

// Envelopes de visibilidade
envelopeA: { fadeInStart: 0.12, activeFrom: 0.24, activeTo: 0.46, fadeOutEnd: 0.52, dormant: 0 }
envelopeB: { fadeInStart: 0.48, activeFrom: 0.52, activeTo: 0.72, fadeOutEnd: 0.78, dormant: 0 }
envelopeC: { fadeInStart: 0.74, activeFrom: 0.78, activeTo: 0.92, fadeOutEnd: 0.97, dormant: 0 }

// Câmera idle (micro-deriva)
amplitude:    0.04
speedX:       0.18
speedY:       0.24
```

---

## 26. Regras Mobile

### Breakpoint de compacto

```
pointer: coarse  OU  max-width: 640px
```

Qualquer dispositivo sem mouse preciso usa o modo compacto.

### Adaptações obrigatórias em compacto

**Canvas 3D:**
- `dpr: [1, 1.5]` (igual ao desktop — sem alteração)
- TerrainMesh: `segX` e `segZ` reduzidos ~40% (tokens separados por breakpoint)
- Câmera: micro-deriva desabilitada (camera fixa entre keyframes, sem noise)
- ScrollCamera: `SCROLL_LENGTH.compact = 440vh`

**ProjectCard:**
- Painel inferior deslizante em vez de card flutuante
- Connector SVG: oculto (`visible: false`)

**Hero:**
- Título: `clamp(40px, 9vw, 56px)` em vez de `clamp(56px, 8vw, 80px)`
- Subtítulo: tamanho reduzido, `max-width: 320px`
- CTAs: empilhados verticalmente

**Navbar:**
- Links de navegação: ocultos, substituídos por menu hamburguer
- CTA "Iniciar Projeto": mantido visível sempre

### O que nunca funciona diferente no mobile

- Cores: idênticas ao desktop
- Tipografia: mesmos pares e pesos, só tamanhos escalam
- Comportamento dos botões: idêntico
- Foco: idêntico
- Semântica HTML: idêntica

---

## 27. Regras de Performance Visual

### Canvas

```
DPR máximo:      1.5  (evitar 2.0 em mobile — dobra o workload de render)
frameloop:       "demand" quando cena está parada
                 "always" quando há movimento contínuo
Post-processing: nenhum na v1 (bloom, DoF apenas após validar 60fps)
```

### Materiais

```
Tipo:         MeshBasicMaterial apenas (sem iluminação = sem cálculo de luz)
Textures:     nenhuma na Home v1 (apenas procedural e vertex colors)
Geometrias:   procedurais, geradas em código (sem assets .glb/.gltf)
```

### CSS

```
Animar apenas: transform, opacity  (não animar width, height, padding, margin)
will-change:   usar em elementos que animam frequentemente (ProjectCard em motion)
               remover após a animação terminar
backdrop-blur: usar com moderação — é custoso em mobile
```

### Fontes

```
display=swap:  sempre (evita FOUT bloqueante)
Preload:       apenas Panchang e Satoshi (sem preload de pesos não-usados)
Subsets:       usar unicode-range para pt-BR se possível
```

### Imagens (thumbnails do Lab e casos)

```
Formato:      WebP com fallback JPG
Tamanhos:     srcset com 2 densidades (1× e 2×)
Lazy loading: todos os thumbnails fora do viewport inicial
```

---

## 28. O Que Evitar

Esta seção lista os anti-padrões mais comuns que destroem a identidade.

**Cores**
```
✗  #000000 como fundo (preto puro sem temperatura)
✗  #ffffff como texto (branco puro frio)
✗  qualquer azul, roxo, cyan ou verde-lima
✗  gradientes lineares como background de seção
✗  sombras coloridas exceto cbm-red com opacity máximo 0.08
✗  mais de 3 elementos vermelhos visíveis ao mesmo tempo
```

**Tipografia**
```
✗  system-ui ou Inter visível ao usuário final
✗  Panchang em texto de corpo longo (> 3 linhas)
✗  Satoshi como substituto de Panchang em títulos
✗  tracking positivo alto em display (> 0.05em)
✗  border-radius em botões ou cards (linguagem é angular)
```

**Layout**
```
✗  cards com border-radius > 4px
✗  separadores em cor quente visível (usar cbm-gray-800 ou cbm-border)
✗  múltiplos Canvas na mesma página
✗  textos ou CTAs dentro do canvas (só no HTML)
✗  glassmorphism (backdrop-blur em cards sobre 3D)
```

**Motion**
```
✗  bounce (overshoot) em micro-interações e hover
✗  velocidade de hover acima de 300ms
✗  animações que não cessam durante prefers-reduced-motion
✗  transition em width, height, padding ou margin
✗  animações de 60fps em propriedades não-compositor
```

**3D**
```
✗  emissive material
✗  bloom ou qualquer post-processing na v1
✗  textures e modelos externos (.glb, .gltf)
✗  neon, glow acima de rgba(251,54,64,0.08)
✗  cores frias (azul, ciano) em qualquer geometria
✗  DPR acima de 1.5 em mobile
```

---

## 29. Exemplos de Aplicação por Seção

### Loading

```
Canvas:     isolado, frameloop="demand", dpr=[1,2]
Background: #000F08
3D:         TriangleLoader
  - pontos: #F5F2ED, radius 0.033, icosahedron
  - arestas: #F5F2ED, lineWidth 1.5, opacity 0→0.74
  - partículas: #4A4844 a #8A8780, opacidade 0.08–0.16
HTML:       nenhum durante o loading
Transição:  canvas opacity 1→0 em 400ms ease quando build completa
```

### Intro

```
Canvas:     home canvas, frameloop="always"
Background: #000F08 (via canvas + body)
3D:         TriangleLines, build controlado por scroll progress
  - foreground nós: #F5F2ED, op 0.85
  - midground nós:  #C8C4BE, op 0.45
  - background nós: #8A8780, op 0.20
  - foreground arestas: #F5F2ED, op 0.40
  - midground arestas:  #C8C4BE, op 0.20
  - background arestas: #8A8780, op 0.10
HTML:
  - tag:  Satoshi 500, 9px, tracking 0.35em, cbm-red 0.7
          "Web Design Premium"
  - copy: Satoshi 300, clamp(15px, 2vw, 18px), cbm-gray-200, line-height 1.8
          "Toda grande presença digital começa por uma ideia."
  - Entra: fade + translateY(20px→0), 600ms ease, quando build >60%
```

### Hero

```
Canvas:     home canvas (mesmo da Intro), câmera estabilizada
3D:         TriangleLines em loop, discreto ao fundo
  - opacidade geral reduzida para ~60% vs Intro
HTML:
  - tag de seção: Satoshi 500, 9px, tracking 0.35em, cbm-red 0.7
                  "::before { width: 24px; height: 1px; bg: cbm-red 0.5 }"
  - H1: Panchang 800, display size, cbm-white, "CODED BY M"
        "by" → cbm-red
  - Subtítulo: Satoshi 300, body-lg, cbm-gray-400
  - CTAs: botão primário "Iniciar Projeto" + botão secundário "Ver Projetos"
  - Navbar: aparece nesta seção (fade + translateY(-20px→0))
```

### Problema

```
Canvas:     home canvas, TriangleLines a ~30% de opacidade
3D:         background residual, sem nova construção
HTML (copy entra linha a linha com ScrollTrigger):
  - Linha 1: Panchang 500, h2, cbm-gray-400
             "A maioria dos sites parece igual."
  - Linha 2: Satoshi 300, body, cbm-gray-600
             "Pouca personalidade. Pouca diferenciação. Pouco impacto."
  - Stagger: 150ms entre linhas, translateY(20px→0) + fade
```

### Serviços

```
Canvas:     home canvas, TriangleLines recupera ~50% de opacidade
3D:         background, slight increase ao entrar nesta seção
HTML:
  - Tag: "O Que Fazemos" — Satoshi label
  - Título: Panchang H1 "Construímos presença digital."
  - 3 cards lado a lado (desktop) / empilhados (mobile)
    Card: border animada 1px cbm-border
    Título serviço: Panchang H3, cbm-white
    Descrição: Satoshi body-sm, cbm-gray-400
    Borda build: stroke-dashoffset animation, 600ms ease-draw, stagger 150ms
```

### Paisagem Digital

```
Canvas:     home canvas, TerrainMesh + Fragments + ScrollCamera
Background: #000F08 + FOG #000F08, near 6, far 17

Terreno:
  foreground edge: #F5F2ED op 0.35
  midground edge:  #C8C4BE op 0.18
  background edge: #8A8780 op 0.08
  fog funde tudo em #000F08

Fragmentos:
  padrão:    edge #F5F2ED op 0.24, nodes #F5F2ED op 0.42
  ativo:     edge op 0.70, nodes op 0.85, apex #FB3640 scale ×1.36
  dormant:   scale 0, tudo opacity 0

Card HTML ativo:
  bg #0E1810, border #1a2a1e, border-left 2px #FB3640
  Panchang título + Satoshi descrição + link CTA com underline vermelho

Connector: rgba(251,54,64,0.5) stroke + #FB3640 dot

Hint scroll:
  Satoshi 300, 10px, tracking 0.4em, uppercase, cbm-gray-600
  Aparece ao entrar, some ao primeiro scroll
```

### Laboratório

```
Canvas:     terreno a 30% de opacidade, dissolvendo
HTML:
  - Tag: "Laboratório" — Satoshi label
  - Título: Panchang H1
  - Copy: Satoshi body, cbm-gray-400
    "Explorações visuais, estudos de interface e experimentos que
     expandem a linguagem da Coded by M."
  - Grade de thumbnails 2–3 experimentos
    Border cbm-border, hover cbm-border-active
    Legenda: Satoshi micro, cbm-gray-600
  - CTA: Link "Explorar Laboratório →" estilo link CTA
```

### Processo

```
Canvas:     off (opacity 0, canvas preservado para CTA)
Background: #000F08 sólido
HTML:
  - Tag: "Como Trabalhamos" — Satoshi label
  - Título: Panchang H1
  - 4 etapas em linha com conector SVG:
    Etapa: { número (Panchang 800, #1a2e1e), título (Panchang H3, cbm-white),
             descrição (Satoshi body-sm, cbm-gray-400) }
  - Linha SVG conectando etapas:
    stroke: cbm-red opacity 0.6, strokeWidth 1
    stroke-dashoffset: length → 0 conforme ScrollTrigger avança
  - Stagger: cada etapa revela quando a linha a alcança
```

### Sobre

```
Canvas:     off, fundo #000F08 sólido
HTML:
  - Tag: "Sobre" — Satoshi label
  - Título: Panchang H1 cbm-white
  - Copy: Satoshi body-lg, cbm-gray-200, line-height 1.8
    "A Coded by M une design, tecnologia e pensamento estrutural para
     criar experiências digitais que fortalecem marcas."
  - Texto adicional: Satoshi body, cbm-gray-400
    Filosofia, visão, origem
  - Separador: 0.5px solid cbm-border (max-width 240px)
  - Assinatura ou detalhe de marca
  Entrada: fade puro, sem transform — ritmo mais lento, mais humano
```

### CTA Final

```
Canvas:     home canvas, CTAFormation ativo
Background: #000F08
3D:
  - Fragmentos surgem no escuro: edge #F5F2ED op 0.24
  - Convergem: posições animadas para formar o símbolo
  - Símbolo formado:
    path esquerdo:  Line2, cor #F5F2ED, op 0.85
    path direito:   Line2, cor #F5F2ED, op 0.85
    diagonal:       Line2, cor #FB3640, op 1.0 — última a surgir
  - Símbolo respira levemente (organic motion)

HTML (sobre a cena):
  - Copy principal: Panchang 700, h1 size, cbm-white
    "Boas empresas constroem produtos."
  - Copy principal 2: mesma estilo
    "Grandes empresas constroem percepção."
    Palavra "percepção": cbm-red
  - Espaço e separador
  - Copy secundária: Satoshi body-lg, cbm-gray-400
    "Vamos construir a sua presença digital."
  - CTA: botão primário grande "Iniciar Projeto"
    Padding: 18px 40px, font 13px
```

---

## 30. Decisões Finais

**Temperatura é identidade.**
`#000F08` e `#F5F2ED` nunca são substituíveis por equivalentes neutros.
A temperatura verde-escura do preto e a temperatura quente do branco são
escolhas de marca, não de conveniência.

**O vermelho é raro porque importa.**
Máximo de 2–3 elementos vermelhos visíveis ao mesmo tempo em qualquer estado.
Quando tudo é vermelho, nada chama atenção.

**Sem border-radius.**
A linguagem visual da marca é angular e estrutural. `border-radius: 0` em
botões, cards e overlays. Curvas apenas em elementos circulares com propósito
(hotspot, ponto âncora, avatar).

**DPR 1.5 em produção.**
O Lab usa `[1, 2]`. A Home usa `[1, 1.5]`. A diferença de nitidez em telas
Retina é imperceptível para a maioria dos usuários. A diferença de performance
em mobile é significativa.

**Panchang para hierarquia. Satoshi para clareza.**
Nunca misturar os papéis. Panchang não é fonte de corpo — tem serifa angular
que prejudica leitura em tamanhos pequenos. Satoshi não é fonte de destaque —
perde presença em tamanhos grandes.

**Acessibilidade não é opcional.**
Focus ring vermelho, prefers-reduced-motion, aria-hidden no canvas, foco
gerenciado no ProjectCard. Não são checklist de fim de projeto — são requisitos
de início.

**A experiência existe para vender.**
Toda decisão de design que não contribui para o usuário entender o que a Coded
by M faz, ou que não contribui para ele querer contratar, deve ser questionada.
O objetivo final não é impressionar com técnica — é gerar desejo de contratação.

---

*Documento criado em 2026-05-30. Referências: marca/coded_by_m_brand_manual.html,
docs/01-brand-foundation.md, docs/02-brand-philosophy.md,
docs/04-motion-experience-system.md, docs/08-component-architecture.md,
docs/08.5-visual-direction.md, docs/09-home-integration-plan.md,
components/lab/\*\*.\*\*.*
