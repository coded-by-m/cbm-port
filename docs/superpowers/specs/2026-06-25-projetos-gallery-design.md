# Vitrine de Projetos `/projetos` — Design

**Data:** 2026-06-25
**Status:** Aprovação pendente do spec
**Tipo:** Nova rota, aditiva (não toca na Paisagem imersiva)

## Problema

Hoje o portfólio só existe na Paisagem imersiva (3D/WebGL) — linda, mas "fechada":
exige exploração, é pesada e não serve quando alguém pergunta *"tem portfólio?"* e a
resposta ideal seria mandar **um link** que carrega rápido e mostra os projetos
organizados. Falta uma **segunda leitura** dos mesmos dados: prática, escaneável,
compartilhável.

## Objetivo

Uma rota `/projetos`: vitrine escura on-brand, projetos agrupados em **faixas por tipo**
com **filtro por chips**. Serve a dois usos que convergem na mesma tela:

1. **Compartilhar** — link de venda; o cliente entra e vê os projetos limpos.
2. **Controle (visualização)** — visão geral organizada por categoria, com status visível.

Sem backend, sem edição pela página. Lê a **mesma fonte**: [`data/cases.ts`](../../../data/cases.ts).

## Não-objetivos (YAGNI)

- **Não** mexer na Paisagem imersiva — ela continua a experiência "wow" da home.
- **Não** editar/adicionar projetos pela interface (dados seguem no arquivo TS).
- **Não** criar dados novos — reusa `CaseProject[]` existente.
- **Não** mostrar projetos `coming-soon` — só `status: "published"`.

## Princípios de design (das skills aplicadas)

Registro = **brand** (num portfólio, o design *é* o produto).

- **Tema escuro = decisão, não default.** Cena: um possível cliente abre o link no
  celular, à noite, e precisa sentir em 2s que lida com um estúdio premium e sério.
  Floresta-preto força isso.
- **Estratégia de cor = Committed:** a superfície escura carrega a identidade; o
  vermelho-sinal é acento cirúrgico (≤10% da tela).
- **Reuso total do design system** existente (paleta, fontes, motivos). Nada de tokens
  novos.
- **Bans respeitados:** sem `border-left` colorido de acento; sem texto em gradiente;
  sem glassmorphism decorativo (blur só com função); sem grade infinita de cards
  idênticos.
- **Anti-monotonia:** numeral-fantasma Panchang gigante por faixa + 1º card "destaque"
  maior abrindo cada faixa.
- **Voz da casa preservada:** o tom editorial atual (incluindo travessões) é mantido por
  ser parte da marca — sobrepõe a preferência genérica das skills.

## Design system reusado (verdade extraída do código)

**Cores** (`tailwind.config.ts`, namespace `cbm`):
`black #000F08` (bg) · `forest #070B08` · `white #F5F2ED` · `red #FB3640` ·
`red-dark #C42030` · `border #111511` · `border-active #1A2418` · `gray.100–800`.

**Fontes** (carregadas via Fontshare em `app/layout.tsx`):
`Panchang` (display, 200–800) + `Satoshi` (body, 300/400/500/700).

**Cor por tipo** (`components/zones/ProjectLandscape/config.ts` → `PROJECT_TYPE_COLOR`):
`institucional #FB3640` · `landing #D9A15B` · `webapp #5FB0A3` · `ecommerce #A98BC9`.
**Será extraída** desse config (ver "Refactor mínimo") para evitar duplicação.

**Vocabulário do card** (herdado de `ProjectLandscape/ProjectCard.tsx`):
brackets HUD nos cantos (vermelho no topo-esquerdo), pill de status pulsante, hairline
de cor por tipo, glifo-triângulo `polygon points="3,2 14,8 3,14"`, preview com fallback
(`ImageWithFallback` + `CardMeshPlaceholder`), número-fantasma Panchang.

## Arquitetura

Rota nova em App Router, **Server Component** por padrão (estática, rápida, SEO-friendly).
Uma única ilha client para o filtro.

```
app/projetos/
  page.tsx              # Server Component. Lê cases, filtra published, agrupa por tipo,
                        # monta metadata/OG. Renderiza o shell + a grade.
components/projetos/
  ProjetosGallery.tsx   # "use client". Estado do filtro (chip ativo). Recebe os grupos
                        # já montados; alterna visibilidade das faixas (CSS), sem refetch.
  ProjetoCard.tsx       # Card de um projeto. Reusa vocabulário visual da Paisagem.
  TypeBand.tsx          # Uma faixa: rótulo + numeral-fantasma + contagem + grade de cards.
  GalleryHeader.tsx     # Topo fino sticky (logo + título + link "experiência ↗").
  GalleryFooter.tsx     # Rodapé CTA (WhatsApp).
  chips/FilterChips.tsx # Chips de filtro (Todos + tipos com projeto).
```

### Fluxo de dados

1. `page.tsx` importa `cases`, filtra `status === "published"`, agrupa por `type`.
2. Ordem das faixas: fixa e intencional — `landing` → `institucional` → `webapp` →
   `ecommerce`. Faixas sem projeto publicado **não renderizam** (sem categorias vazias).
3. Os grupos vão como props pra `<ProjetosGallery>` (client). O filtro só troca quais
   faixas ficam visíveis — todas continuam no HTML inicial (bom pra SEO e link sem JS).

### Refactor mínimo (servir ao objetivo, sem escopo extra)

`PROJECT_TYPE_COLOR` e o mapa de rótulos hoje vivem dentro do config 3D
(`ProjectLandscape/config.ts`). Para a vitrine reusar sem importar o módulo 3D inteiro,
extrair um módulo leve e neutro:

```
lib/projectTypes.ts
  export const PROJECT_TYPE_COLOR    # movido de ProjectLandscape/config.ts (re-exportado lá)
  export const PROJECT_TYPE_LABEL    # novo: rótulos comerciais das faixas
  export const PROJECT_TYPE_ORDER    # novo: ordem das faixas
```

`ProjectLandscape/config.ts` passa a re-exportar de `lib/projectTypes.ts` (zero mudança
visual na Paisagem). É o tipo de melhoria pontual no código que se toca — não refactor à toa.

**Rótulos das faixas** (`PROJECT_TYPE_LABEL`, estilo comercial/claro):
`landing` → "Landing Pages" · `institucional` → "Sites Institucionais" ·
`webapp` → "Aplicações Web" · `ecommerce` → "Lojas (E-commerce)".

## Layout

```
┌──────────────────────────────────────────────┐
│  ·CbM            projetos        experiência ↗ │  topo fino, sticky, blur sutil
├──────────────────────────────────────────────┤
│  PROJETOS                                       │  título Panchang
│  Seleção de trabalhos por tipo de entrega.      │  intro 1 linha (Satoshi)
│  [ Todos ]  Landing Pages  Sites Instituc...    │  chips (só tipos com projeto)
├──────────────────────────────────────────────┤
│  ⌜01⌟  LANDING PAGES                    (2)      │  rótulo + numeral Panchang fraco
│  ┌─────────────┐ ┌──────┐ ┌──────┐              │
│  │  destaque   │ │ card │ │ card │              │  1º maior, demais em grade
│  └─────────────┘ └──────┘ └──────┘              │
│                                                  │
│  ⌜02⌟  SITES INSTITUCIONAIS             (3)      │
│  ┌──────┐ ┌──────┐ ┌──────┐                     │
│  └──────┘ └──────┘ └──────┘                     │
├──────────────────────────────────────────────┤
│  Tem um projeto em mente?   [ Falar no WhatsApp ]│  rodapé CTA
└──────────────────────────────────────────────┘
```

### Header (sticky, fino)

Logo `·CbM` à esquerda, "projetos" centro/discreto, link "ver experiência completa ↗"
à direita → `/` (Paisagem). Fundo `cbm-black/85` com blur sutil (função: separar do
conteúdo ao rolar). Altura ~56–64px.

### Intro + chips

Título "Projetos" em Panchang; subtítulo 1 linha em Satoshi. Abaixo, chips de filtro:
`Todos` + um chip por tipo **com projeto publicado**. Chip ativo: borda/realce com a cor
do tipo (vermelho no "Todos"). No mobile, chips rolam na horizontal (`overflow-x` com
scroll-snap), alvo de toque ≥44px.

### Faixa (TypeBand)

- Rótulo da faixa (Panchang/Satoshi caps, tracking largo) + contagem `(n)`.
- **Numeral-fantasma** `01`, `02`… em Panchang, opacidade ~0.06, atrás do rótulo
  (motivo já usado no card da Paisagem).
- Grade responsiva: 1º item "destaque" ocupa mais espaço; demais em colunas iguais.
  - Desktop (≥1024px): destaque ~2 colunas, demais 1 coluna (grade de 3).
  - Tablet (≥768px): 2 colunas.
  - Mobile: 1 coluna; destaque vira o primeiro card normal.

### Card (ProjetoCard)

- **Imagem** `preview.desktop` em wrapper `aspect-[16/10]` (reserva espaço → sem CLS),
  `object-cover object-top`, `loading="lazy"`. Fallback gracioso quando o asset falha
  (mesma estratégia do `ImageWithFallback` da Paisagem; placeholder triangulado).
- **Brackets HUD** nos cantos (vermelho no topo-esquerdo) — assinatura da marca.
- **Hairline de cor por tipo** + setor · ano em caps pequeno.
- **Título** do projeto (Satoshi 500) + descrição curta (1–2 linhas, `line-clamp`).
- **CTA "Ver projeto"** com glifo-triângulo; o **card inteiro** é o link → `/cases/[slug]`.
- **"Ver no ar ↗"**: link secundário, separado, → `siteUrl` em nova aba
  (`target="_blank" rel="noopener noreferrer"`). **Só renderiza quando o projeto tem
  `siteUrl`** (todos os publicados têm hoje; é uma salvaguarda). Como link aninhado dentro de card-link
  é inválido, o card NÃO é um `<a>` envolvendo tudo: o clique no card é um `<Link>` que
  cobre a área (overlay com `absolute inset-0`), e o "ver no ar" fica acima dele
  (`relative z-10`) — assim os dois destinos coexistem sem aninhar âncoras.
- **Hover** (desktop): leve zoom da imagem (`scale` via `transform`) + realce de borda +
  brilho sutil. Só `transform`/`opacity`. **Foco** visível para teclado (anel on-brand).

### Footer (CTA)

Linha "Tem um projeto em mente?" + botão **"Falar no WhatsApp"** → `https://wa.me/<NUMERO>`
(ver Pendência de input). Botão no estilo CTA vermelho da casa. Opcional: e-mail como
link textual secundário (`matheusmendes077@gmail.com`).

## Responsivo

- Mobile-first; breakpoints alinhados ao projeto (768 / 1024).
- Chips com scroll horizontal + snap no mobile; alvos ≥44px.
- Grade colapsa 3→2→1 coluna. Sem scroll horizontal no conteúdo.
- `min-h-dvh` no shell. Imagens com `aspect-ratio` reservando espaço.

## Acessibilidade & performance (checklist UI/UX aplicado)

- Contraste texto ≥4.5:1 (off-white sobre floresta-preto já passa).
- Cor por tipo nunca é o único sinal — sempre acompanha rótulo de texto.
- `prefers-reduced-motion`: desliga zoom/stagger; conteúdo legível imediatamente.
- Foco visível em chips, cards e CTAs; ordem de tab = ordem visual.
- Imagens `lazy` abaixo da dobra + `aspect-ratio` (CLS ~0).
- Entrada orquestrada: stagger de 30–50ms por card no primeiro paint (desktop), atrás
  de `prefers-reduced-motion`.

## SEO / compartilhamento

`page.tsx` exporta `metadata` próprio da rota:

- `title`: ex. "Projetos · Coded by M"
- `description`: 1 frase de posicionamento.
- `openGraph` / `twitter`: título, descrição e **imagem OG** (1200×630) — pra o card no
  WhatsApp/Insta ficar bonito quando o link é colado. (Hoje o `layout.tsx` raiz ainda é
  placeholder "Experience Lab"; esta rota ganha metadados próprios. Tratar a OG raiz fica
  fora do escopo desta tarefa.)

## Pendências de input (do usuário, antes de construir)

- **Número do WhatsApp** para o link `wa.me`. *(marcador no código até ser fornecido)*
- (Opcional) Imagem OG dedicada da vitrine; senão reaproveitar um preview existente.

## Critérios de aceite

1. `/projetos` carrega como página estática, escura, on-brand, sem tocar na Paisagem.
2. Só projetos `published` aparecem, agrupados nas faixas `landing` → `institucional`
   (as únicas com projeto hoje), com rótulos comerciais e contagem.
3. Chips filtram as faixas visíveis; "Todos" mostra todas; chips só existem para tipos
   com projeto.
4. Card → `/cases/[slug]`; "ver no ar ↗" → `siteUrl` em nova aba; ambos funcionam sem
   aninhar âncoras.
5. Rodapé com CTA de WhatsApp.
6. Responsivo (375 / 768 / 1024), sem scroll horizontal, alvos ≥44px.
7. `prefers-reduced-motion` respeitado; foco de teclado visível; contraste AA.
8. Metadata/OG próprios da rota.
9. `PROJECT_TYPE_COLOR` extraído para `lib/projectTypes.ts` sem regressão visual na
   Paisagem.
```
