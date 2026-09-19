# Prompt — Site novo + motor de landings (Coded by M)

> Cole o bloco abaixo inteiro no Claude Design. Ele é autossuficiente: carrega o design
> system real da CbM (extraído do código em produção), o conteúdo real e a especificação
> de cada seção. Não precisa de anexo.

---

Você vai desenhar o **novo site principal da Coded by M** — um estúdio brasileiro de
webdesign e websoftware, em Florianópolis. O site atual é uma experiência WebGL de 9
capítulos: linda, mas pesada e imprópria para tráfego pago. Ela não vai embora — vai
virar uma rota showpiece (`/experiencia`). O que você desenha é o que passa a ocupar a
`/`: **estático, rápido, e construído para converter**, sem abrir mão do caráter da marca.

Duas entregas:
1. **A home (`/`)** — 7 seções, página única com âncoras.
2. **A landing de campanha (`/lp/[segmento]`)** — 7 seções, sem navegação, um CTA só.

**Regra inegociável:** o visual já existe e está validado. Você não está criando uma
identidade — está aplicando uma. Siga o design system abaixo ao pé da letra.

---

# PARTE 1 — DESIGN SYSTEM

## 1.1 O núcleo em uma frase

**Fundo profundo + estrutura quente + um único sinal que corta.**

| Papel | Cor | Regra |
|---|---|---|
| **Base** | `#000F08` | Nunca preto puro — tem verde imperceptível. É a temperatura que separa "premium" de "template". |
| **Estrutura** | `#F5F2ED` | Off-white quente. Nunca `#fff`. |
| **Sinal** | `#FB3640` | Vermelho de ação. **Máximo 2–3 por viewport.** A raridade é o que cria o impacto. |

Quatro princípios que governam toda decisão:

1. **Construção, não decoração.** Cada linha, ponto e borda é parte de uma estrutura. Ornamento sem função é ruído.
2. **Temperatura, não neutro.** Trocar por `#000`/`#fff` mata a identidade.
3. **Raridade cria impacto.** O vermelho só funciona porque aparece pouco.
4. **Angular, não arredondado.** `border-radius: 0` em botões, cards e overlays.

## 1.2 Paleta completa

```
base            #000F08   fundo de página
forest          #070B08   fundo de card, overlay (mais escuro que a base)
white           #F5F2ED   texto e estrutura primária
red             #FB3640   sinal / ação
red-dark        #C42030   hover do sinal
border          #111511   borda padrão (verde, quase invisível)
border-active   #1A2418   borda em hover/ativo
gray-100        #E8E4DE   texto sobre fundo claro
gray-200        #C8C4BE   corpo importante
gray-400        #8A8780   texto secundário, labels
gray-600        #4A4844   terciário, captions, numeração
gray-800        #1E1E1A   separadores leves
```

**Mapeamento semântico:**

```
Fundo de página          base            Fundo de card/overlay    forest
Título                   white           Corpo                    gray-200
Texto secundário         gray-400        Caption                  gray-600
Separador                gray-800 | border
Ação primária            bg signal · texto base
Ação secundária          texto white · borda border-active
Label/tag                signal @ 0.7 opacity
Foco                     signal
```

Glow do sinal tem **teto rígido**: `rgba(251, 54, 64, 0.08)`. Nunca mais que isso.

## 1.3 Tipografia

Dois typefaces, exclusivamente:

- **Panchang** — display e hierarquia. Serifa angular. **Nunca** para corpo longo. Sem italic.
- **Satoshi** — corpo e interface. Pesos 300, 400, 500, 700.

| Token | Família | Peso | Tamanho | Tracking | LH | Uso |
|---|---|---|---|---|---|---|
| `display` | Panchang | 800 | clamp(56px, 8vw, 80px) | -0.03em | 0.92 | H1 do hero |
| `h1` | Panchang | 700 | clamp(40px, 5vw, 56px) | -0.02em | 1.05 | Título de seção |
| `h2` | Panchang | 600 | clamp(28px, 3.5vw, 36px) | -0.01em | 1.15 | Subtítulo |
| `h3` | Panchang | 500 | clamp(18px, 2vw, 22px) | 0 | 1.25 | Título de card |
| `body-lg` | Satoshi | 300 | clamp(14px, 1.5vw, 17px) | 0 | 1.75 | Sub do hero, intro |
| `body` | Satoshi | 400 | 15px | 0 | 1.7 | Corpo padrão |
| `body-sm` | Satoshi | 300 | 13px | 0 | 1.7 | Descrição de card |
| `label` | Satoshi | 500 | 9px | 0.35em | 1.4 | Tags, categorias |
| `caption` | Satoshi | 300 | 10px | 0.3em | 1.5 | Metadados |
| `ui` | Panchang | 600 | 11px | 0.15em | 1 | Botões, nav |

`label`, `caption` e `ui` são **sempre uppercase**.

**As duas regras que criam a textura da marca:**

- Títulos com **tracking apertado** (-0.02 a -0.03em). Tenso, intencional.
- Micro-labels com **tracking largo** (0.15 a 0.4em) + uppercase + Satoshi pequeno. Essa
  combinação de uppercase minúsculo ultra-espaçado **é a assinatura tipográfica**.

## 1.4 Espaçamento, layout, forma

```
Escala base           múltiplos de 4: 4 8 12 16 24 32 40 48 64 80 96 128
Container             max-width 1440px · padding-x clamp(24px, 5vw, 80px)
Coluna de conteúdo    max-width 900px       Coluna estreita   max-width 680px
Grid 2-col            1fr 1fr desktop / 1fr mobile · gap clamp(24px, 4vw, 48px)
Padding de seção      60px mobile · 100px desktop · 120px hero/CTA
Breakpoints           mobile <640 · tablet 640–1024 · desktop >1024 · wide >1440
border-radius         0  (curvas só em círculos com propósito)
```

**Sombras:**

```
Card       0 2px 12px rgba(0,0,0,0.28)
Moldura    0 24px 60px -12px rgba(0,0,0,0.85)
Glass      backdrop-blur 12px · bg linear-gradient(270deg, rgba(0,15,8,0.95), rgba(0,15,8,0.72))
           border 1px rgba(245,242,237,0.1)
```

## 1.5 Motion

```
instant  150ms   hover, micro-interação
quick    300ms   card hover, focus
normal   600ms   entrada de seção
slow     900ms   transição maior

Easings   enter: cubic-bezier(0.33, 1, 0.68, 1)   |   expo: cubic-bezier(0.22, 1, 0.36, 1)
Stagger   texto 100ms · cards 150ms
```

Princípios:

- **"Porsche, não videogame."** Suave e controlado. Zero bounce ou overshoot em hover.
- **Hover revela, não só destaca.** Mostra algo que não estava visível — não é troca de cor.
- Anime **só `transform` e `opacity`**. Nunca width/height/padding/margin.
- `prefers-reduced-motion` é first-class: tudo aparece no estado final, sem animação.

**Entrada padrão de seção** (o componente `Reveal` que já existe): fade + `translateY(24px)→0`
+ `blur(6px)→0`, 0.7s, disparado por IntersectionObserver a 20% de visibilidade.

## 1.6 Elementos-assinatura (reproduza estes)

**Foco angular vermelho** — identidade e acessibilidade na mesma linha:

```css
:focus-visible { outline: 2px solid #FB3640; outline-offset: 3px; border-radius: 0; }
```

**Label de seção (pré-título)** — aparece antes de todo título de seção:

```
traço horizontal 24x1px signal @ 0.5  +  Satoshi 500 · 9px · tracking 0.35em · uppercase · signal @ 0.7
```

**Card:**

```
bg forest · border 1px border · border-left 2px signal · radius 0
shadow 0 2px 12px rgba(0,0,0,0.28)
  categoria   Satoshi 500 · 9px · tracking 0.32em · uppercase · signal @ 0.7
  título      Panchang 700 · 14–16px · white
  descrição   Satoshi 300 · 12–13px · gray-400 · LH 1.7
  CTA inline  Panchang 600 · 11px · tracking 0.15em · uppercase · white
              border-bottom 1px signal · hover white → signal
hover: border → border-active, 200ms
```

**BrowserFrame** — a moldura em que todo screenshot de projeto aparece:

```
border 1px rgba(245,242,237,0.15) · bg #0E1810 · radius 0
shadow 0 24px 60px -12px rgba(0,0,0,0.85)
barra superior: 3 dots de 10px (o primeiro #FB3640, os outros white @ 0.25)
                + pill de URL: bg white @ 0.06 · Satoshi 10px · tracking wide · white @ 0.5
                + ícone de cadeado
corpo: overflow hidden
```

**Botão primário:**

```
bg signal · texto base · px-7 py-3.5 · Panchang 600 · 11px · tracking 0.15em · uppercase · radius 0
hover: bg red-dark · 150ms
```

**Botão secundário / fantasma:**

```
bg transparente · border 1px white @ 0.55 · texto white · mesma tipografia
hover: border white @ 1 + wash diagonal linear-gradient(120deg, transparent, rgba(251,54,64,0.08), transparent)
```

**Losango de 7px rotacionado 45° em signal** — marcador recorrente (localização, itens de lista, bullets).

## 1.7 Anti-padrões — o que mata a identidade

```
✗ #000000 de fundo ou #ffffff de texto        ✗ azul, roxo, cyan, verde-lima em qualquer elemento
✗ gradiente linear como fundo de seção        ✗ mais de 2–3 elementos vermelhos por viewport
✗ border-radius > 0 em botões e cards         ✗ Panchang em corpo com mais de 3 linhas
✗ Satoshi 700 fingindo ser título             ✗ bounce/overshoot em hover
✗ sombra colorida acima de 0.08 de opacidade  ✗ separador em cor quente visível
✗ Inter ou system-ui visível                  ✗ qualquer animação que ignore reduced-motion
```

---

# PARTE 2 — CONTEÚDO REAL

Use este conteúdo. Não invente placeholder, não escreva lorem ipsum.

## 2.1 Marca

- **Nome:** Coded by M · **Fundador:** Matheus Mendes · **Local:** Florianópolis, Brasil
- **Manifesto:** "A Coded by M une design, tecnologia e pensamento estrutural pra construir uma presença digital à altura da empresa por trás dela."
- **Bio do fundador:** "Formado em Análise e Desenvolvimento de Sistemas, encontrei no web design o ponto onde técnica e estética se encontram. A Coded by M é onde levo isso a sério — cada projeto, uma busca por uma presença digital tão boa quanto a empresa por trás dela."
- **Valores:** Precisão ("Cada pixel tem razão de existir.") · Elegância ("Sofisticação que não precisa gritar.") · Detalhismo ("O acabamento é o produto.")
- **Sinais de disponibilidade:** "Aceitando projetos" · "Agenda 2026 limitada"
- **Contato:** WhatsApp `+55 48 99991-6638` · Instagram `@codedbymstudio`

## 2.2 Serviços (3)

| # | Título | Descrição | Inclui | Indicado para |
|---|---|---|---|---|
| 01 | **Landing Pages** | Sites de conversão. Foco em uma única ação. Performance e clareza. | Estratégia de conversão · Copywriting persuasivo · Design responsivo · Setup de analytics · Deploy e handover | Empresas com produto único ou campanha específica. |
| 02 | **Sites Institucionais** | Presença completa. Estrutura, autoridade, profundidade. | Arquitetura de informação · Design system aplicado · 5–12 páginas · SEO técnico e performance · CMS leve e handover | Empresas que querem presença sólida, comunicando autoridade e cultura. |
| 03 | **Aplicações Web** | Dashboards e sistemas. Software com interface refinada. | Arquitetura de informação · Design system próprio · Componentes interativos · Integração de APIs · Performance e handover | Empresas com processos digitais, times que precisam de ferramentas, SaaS em formação. |

## 2.3 Projetos publicados (6)

| Slug | Título | Eyebrow | Setor | Tipo |
|---|---|---|---|---|
| `mj-engenharia` | MJ Engenharia | Landing Page Premium | Engenharia / Prevenção contra Incêndio | landing |
| `estudio-lentz` | Estúdio Lentz | Site Institucional Imersivo | Arquitetura | institucional |
| `machado-plataformas` | Machado Plataformas | Web Design Premium | Implementos Rodoviários | institucional |
| `maison-etoile` | Maison Étoile Interiors | Landing Page Premium | Design de Interiores | landing |
| `forma-viva` | Atelier Forma Viva | Site Institucional | Arquitetura | institucional |
| `estudio-monteiro` | Estúdio Monteiro | Site Institucional | Arquitetura | institucional |

Cada projeto tem screenshot `desktop-tall.webp` (página inteira, formato alto) e `mobile-tall.webp`.

> **Note o padrão:** 5 dos 6 são do ambiente construído — arquitetura, interiores, engenharia.
> Isso é um posicionamento, e o design deve deixá-lo evidente pela prova, sem declará-lo em texto.

## 2.4 Processo (4 etapas)

| # | Etapa | Descrição |
|---|---|---|
| 01 | **Estratégia** | Antes de desenhar, entender. Diagnóstico, escopo e posicionamento. |
| 02 | **Design** | Forma com intenção. Arquitetura, identidade e protótipo. |
| 03 | **Código** | Construído pra durar. Implementação, performance e qualidade. |
| 04 | **Resultado** | Não acaba no deploy. Mensuração, ajustes e evolução. |

---

# PARTE 3 — A HOME (`/`)

Página única com âncoras. **Projetos vem antes de Serviços** — e isso é deliberado: ninguém
contrata um estúdio de design pela descrição do serviço. A pessoa rola procurando o trabalho.
Três cards de texto entre ela e a prova é pedir que desista.

**CTA em exatamente três pontos:** hero, logo abaixo da grade de projetos (pico de
convencimento) e no fechamento. Mais que isso vira ruído.

### Header (fixo)

Altura 60px desktop / 56px mobile. Transparente no topo; ao rolar ~100px ganha `bg base/90`,
`backdrop-blur` e `border-bottom 1px border`. Wordmark Panchang 700 16px à esquerda (o "by"
em signal). Âncoras à direita: Projetos · Serviços · Processo · Sobre — Satoshi 400, 11px,
tracking 0.15em, uppercase, `gray-400 → white` em 200ms. Botão de WhatsApp na ponta. No
mobile: só wordmark + botão.

### 1. Hero

Duas colunas no desktop, empilhado no mobile. **Tudo visível sem rolar.**

- **Esquerda:** label de seção → H1 `display` (Panchang 800, clamp 56–80px, tracking -0.03em,
  LH 0.92) → linha de apoio em `body-lg` (max 680px) → botão primário "Começar meu projeto" +
  link secundário "Ver projetos". Abaixo, os dois selos de disponibilidade em `caption`.
- **Direita:** um projeto em destaque dentro de um `BrowserFrame`, com o `desktop-tall` visível
  a partir do topo. Levemente inclinado ou deslocado para fora da margem — sugerindo profundidade
  sem 3D.
- **Movimento:** uma entrada em stagger de ~1s, rodando **uma vez**: label → H1 → apoio → CTA →
  a moldura subindo com leve scale. Nada de scroll-driven.

### 2. Projetos

Label "Trabalho selecionado" + H1 de seção. Grade de 6 cards: **2 colunas no desktop, 1 no mobile**.
Cada card é um `BrowserFrame` com o `desktop-tall` recortado no topo, e abaixo: eyebrow em `label`
colorido por tipo, título em Panchang 700, setor em `caption` cinza.

- **Hover:** o card levanta 4px, a borda vai para signal, e **o screenshot desliza para cima
  revelando o resto da página** — esse é o momento "hover revela", e é o que faz a seção.
- Entrada em stagger de 150ms por card.
- Abaixo da grade: CTA #2, e um link discreto "Ver todos os projetos →" para `/projetos`.

### 3. Serviços

Três cards de texto lado a lado (empilhados no mobile). **Sem as mini-cenas 3D da experiência.**
Cada card: numeração `01/02/03` em Panchang 800 gigante em `white @ 0.05` como marca-d'água ao
fundo, título em `h3`, descrição em `body-sm`, e os 5 itens de "inclui" como lista com losango
vermelho de 7px. A linha "indicado para" fecha o card em `caption`.

### 4. Processo

As 4 etapas em linha horizontal numerada no desktop, vertical no mobile. Uma linha fina
`border` conecta as etapas e **se desenha com `scaleX` na entrada** (CSS puro, dentro do `Reveal`).
Cada etapa: numeral em `caption` signal, título em `h3`, descrição em `body-sm` gray-400.

### 5. A Experiência

O bloco que convida para `/experiencia`. Largura total, fundo `forest`, tratado como um objeto
mais escuro e mais raro que o resto da página. À esquerda, copy curta reconhecendo o que é:
uma experiência 3D navegável de 9 capítulos. À direita, um still da experiência dentro de um
`BrowserFrame`, com um overlay de "play" angular em signal. Botão secundário "Entrar na experiência".
É o único ponto da home onde o vermelho pode aparecer com um pouco mais de presença — é um convite.

### 6. Sobre

Duas colunas. **Esquerda:** o símbolo CbM em wireframe, grande, `white @ 0.9`. **Direita:**
label "Sobre" → manifesto em Panchang 600 (clamp 1.2–2.1rem, LH 1.32) → bloco-assinatura do
fundador com `border-left 2px signal @ 0.45` e `padding-left 24px`, contendo nome (Panchang 600),
cargo em `caption`, bio em `body`, e a localização com o losango vermelho. Abaixo, os 3 valores
numa grade de 3 colunas separada por linhas de 1px (`gap-px` sobre fundo `white @ 0.1`).

### 7. Contato

Fechamento de largura total, padding vertical 120px. H1 em `display`, uma linha de apoio, e o
CTA #3 em botão primário grande. Abaixo: WhatsApp e Instagram como links em `ui`. Footer
minimalista com wordmark, "Florianópolis · BR", e os selos de disponibilidade.

---

# PARTE 4 — A LANDING DE CAMPANHA (`/lp/[segmento]`)

Esta página recebe **tráfego pago**: gente 100% fria, no celular, no 4G, que nunca ouviu falar
da marca e chegou por acidente. **Não é a home com outra headline.** A home é navegável e convida
a explorar; a landing é um corredor com uma porta no fim.

O primeiro segmento é **arquitetura** — escritórios de arquitetura, interiores e engenharia.

### Diferenças estruturais obrigatórias

- **Sem âncoras de navegação.** Header só com wordmark (linkando `/`) e botão de WhatsApp.
- **Um único tipo de CTA**, repetido: abrir WhatsApp. Nada de "ver projetos", nada de "saiba mais".
- **Sem footer com links.** O rodapé fecha, não distribui.
- Mesmo design system, mesma temperatura — a pessoa precisa sentir que chegou num estúdio sério.

### As 7 seções

**1. Hero** — Headline dirigida ao segmento, não à marca. Fala do problema dela, não de você.
Sub curta, botão primário grande, e uma prova visual imediata (um `BrowserFrame` com um projeto
do próprio segmento). Acima da dobra no celular: headline + sub + botão, sem exceção.

**2. Dor** — 3 ou 4 pontos que a pessoa reconhece como dela, cada um com o losango vermelho.
Frases curtas, primeira pessoa do plural ou segunda do singular. **Esta seção é a que faz a
campanha funcionar** — é onde o visitante frio decide se isso é sobre ele. Fundo `forest` para
separá-la visualmente.

**3. Promessa** — Uma frase grande em Panchang 700, centralizada, com bastante respiro. O que
muda depois. Não é um parágrafo — é uma afirmação.

**4. Prova** — Só os cases do segmento, em `BrowserFrame`, com o mesmo hover-revela da home.
Para arquitetura: Estúdio Lentz, Atelier Forma Viva, Estúdio Monteiro, Maison Étoile. Cada um
com uma linha do que foi feito. Sem link para `/cases` — a prova acontece aqui.

**5. Como funciona** — As 4 etapas do processo, reusadas da home. Função aqui é tirar o medo de
"quanto tempo isso vai tomar de mim".

**6. Objeções** — 4 a 5 perguntas reais em acordeão angular (sem radius, chevron em signal):
preço, prazo, "meu Instagram já não basta?", "e os meus textos e fotos?", "preciso mexer no site
depois?". Respostas em `body`, diretas, sem enrolação comercial.

**7. CTA final** — Fechamento de tela cheia, fundo `forest`, botão primário grande e centralizado.
Uma linha de reforço acima. Nada mais na tela.

### Restrição de mobile que você precisa resolver no design

Três elementos disputam o rodapé da tela no celular: o botão flutuante de WhatsApp, o banner de
consentimento de cookies (LGPD) e o CTA da seção. **Desenhe a solução:** o botão flutuante recolhe
enquanto o banner está aberto, e nenhum CTA pode nascer atrás de qualquer um dos dois. Mostre os
dois estados.

---

# PARTE 5 — REQUISITOS TÉCNICOS

- **Mobile-first.** Desenhe a versão de 390px antes da de 1440px.
- **Performance é requisito de design**, não detalhe de implementação: LCP abaixo de 2,5s no
  celular. Nada de imagem gigante na dobra, nada de fonte bloqueando a renderização.
- **Nenhum WebGL, nenhum `three.js`** em qualquer uma dessas páginas. O 3D vive só em `/experiencia`.
- **Movimento contido:** entrada de seção por `Reveal`, hover em CSS, uma timeline de entrada no
  hero. Zero scroll-driven, zero parallax, zero pin.
- **Acessibilidade:** contraste mínimo AA (o `gray-400` sobre a base dá 4.7:1 — não desça disso),
  foco visível em vermelho em tudo que é focável, ordem de tabulação coerente, `prefers-reduced-motion`
  respeitado em cada animação.

# O QUE EU QUERO DE VOLTA

1. A **home (`/`)** completa, as 7 seções, em desktop e mobile.
2. A **landing `/lp/arquitetura`** completa, as 7 seções, em desktop e mobile — incluindo os dois
   estados do rodapé mobile.
3. Os **estados de hover** dos cards de projeto e dos botões.
4. Onde você divergir do design system, **diga qual regra quebrou e por quê**.

Comece pela home. Me mostre o hero primeiro, antes de seguir para o resto.
