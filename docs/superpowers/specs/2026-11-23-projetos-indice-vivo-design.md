# /projetos — Índice vivo

Data: 2026-11-23
Status: design aprovado em conversa, aguardando revisão da spec

## Objetivo

Refazer a `/projetos` como peça cinematográfica (nível awwwards) que funcione
bem no celular, mantendo os mesmos 10 projetos publicados de `data/cases.ts`.

A página é o destino do QR do cartão de visita
(`/projetos?utm_source=cartao&utm_medium=print`), então a maior parte das
visitas chega por celular. O celular é a experiência principal, não a
adaptação.

## O que não muda

- URL `/projetos` (impressa no cartão).
- `metadata`, canonical, Open Graph e JSON-LD (`CollectionPage` + `ItemList` +
  breadcrumb) de `app/projetos/page.tsx`.
- Copy: `PROJETOS_TITLE`, `PROJETOS_H1`, `PROJETOS_INTRO` (`data/projetos.ts`).
- Fonte de dados: `getPublishedProjects()` + `portfolioGroups()`
  (`lib/galleryData.ts`). `data/cases.ts` não é editado.
- Ordem: clientes no ar (Machado, MJ, Valdete) e depois os conceituais.
- Atributos do tracker: `data-cm-section="projects"`,
  `data-cm-role="secondary-cta"` + `data-cm-id="case-<slug>"` nos links de
  case, `data-cm-role="whatsapp"` + `data-cm-id="gallery-footer-whatsapp"` no
  CTA final.
- `GalleryHeader` e `GalleryFooter` continuam existindo (os artigos usam). A
  `/projetos` segue usando o `GalleryHeader`; o rodapé dela passa a ser o
  fecho próprio (seção 1.3).
- Paleta, Panchang/Satoshi, cantos retos e o resto de `DESIGN-LANGUAGE.md`.

## 1. Estrutura da página

### 1.1 Abertura

Bloco de cerca de 70svh, não um hero de tela cheia: quem chega tem que ver o
começo da lista sem rolar muito.

- H1 (`PROJETOS_H1`) em Panchang 800, grande, quebrando em linhas.
- Contador com o total de projetos publicados, ex.: `(10)`.
- Intro (`PROJETOS_INTRO`) em Satoshi.
- Entrada: cada linha do H1 sobe de dentro de uma máscara, com stagger; intro
  e contador entram em seguida. A cena (seção 2) já está visível atrás com a
  capa do primeiro projeto.

### 1.2 Índice

Dois capítulos, cada um com um H2 pequeno em estilo de rótulo:

1. "Clientes no ar"
2. "Projetos conceituais"

Cada projeto é uma linha, e a linha inteira é um link para `/cases/<slug>`:

- numeral de dois dígitos (01 a 10, contínuo entre os capítulos);
- nome do projeto em Panchang 700 gigante (ordem de grandeza: 11vw no
  celular, até ~110px no desktop), em `<h3>`, podendo quebrar em duas linhas;
- linha de meta em Satoshi caixa alta: tipo · setor · ano;
- etiqueta "conceitual" quando `concept: true`;
- filete horizontal separando as linhas.

A linha ativa fica em opacidade total; as demais caem para cerca de 35%. A
transição de opacidade é curta (200–300 ms).

Os chips de filtro por tipo deixam de existir: com 10 projetos, os capítulos
organizam e o tipo aparece em cada linha.

### 1.3 Fecho

Bloco final próprio da página, substituindo o `GalleryFooter` nesta rota:

- pergunta "Tem um projeto em mente?" em Panchang grande;
- botão de WhatsApp com a mesma mensagem e os mesmos `data-cm-*` do
  `GalleryFooter`;
- os mesmos links de navegação do `GalleryFooter` (Sobre, Contato, Blog se
  houver, Privacidade).

Para não duplicar a lista de links, ela é extraída do `GalleryFooter` para um
export compartilhado.

## 2. A cena

Uma única camada visual fixa atrás do índice mostra a capa
(`preview.card`, com fallback para `preview.desktop`) do projeto ativo.

### 2.1 Qual é o projeto ativo

- **Ponteiro grosso (celular/tablet):** a linha cujo centro está mais próximo
  do centro vertical da viewport. Calculado no scroll, com `requestAnimationFrame`.
- **Ponteiro fino (desktop):** a linha sob o ponteiro ou com foco de teclado.
  Sem ponteiro sobre a lista, vale a mesma regra do centro da viewport.
- Durante a abertura, o ativo é o primeiro projeto.

A regra mora num hook (`useActiveRow`) que recebe as refs das linhas e devolve
o índice ativo. A parte pura (dadas as posições das linhas e a altura da
viewport, qual índice vence) é uma função separada e testável.

### 2.2 Aparência

- **Celular:** a capa cobre a viewport inteira atrás da lista, com um véu
  escuro suficiente para todo texto passar AA (contraste medido sobre a capa
  mais clara do conjunto).
- **Desktop:** a capa é uma janela flutuante (largura em torno de 34–38vw,
  proporção 16/10) que segue o ponteiro com atraso e se deforma levemente com
  a velocidade do movimento. Um canto da janela leva a cor do tipo de projeto
  (`PROJECT_TYPE_COLOR`).

### 2.3 Troca de capa (WebGL)

Um plano único com um fragment shader que mistura a textura atual e a próxima:

- máscara de transição guiada por ruído (a capa nova "invade" a antiga);
- deslocamento das UVs durante a transição;
- desvio RGB proporcional à velocidade do scroll (celular) ou do ponteiro
  (desktop), com teto baixo.

Duração da transição: 600–900 ms, easing da casa. Se o ativo muda no meio de
uma transição, a transição em curso é concluída rapidamente e a nova começa
do estado atual, sem salto visível.

### 2.4 Camada base (sem WebGL)

A cena existe primeiro em DOM: as capas são `<Image>` empilhadas na mesma
camada fixa, e a ativa aparece por crossfade em CSS. Essa camada é o que roda
quando:

- o JavaScript ainda não hidratou ou falhou;
- `prefers-reduced-motion: reduce`;
- o WebGL não está disponível ou o contexto foi perdido.

Quando a camada WebGL sobe e renderiza o primeiro frame, a camada DOM é
ocultada. Se o contexto for perdido, a camada DOM volta.

Só a capa do primeiro projeto tem `priority`; as demais são lazy.

## 3. Dock

Elemento fixo com os dados do projeto ativo, para que a lista nunca mude de
altura durante o scroll:

- descrição do projeto em uma linha (truncada);
- botão "No ar" abrindo `https://<siteUrl>` em nova aba, quando houver.

Posição: faixa na base da tela no celular (respeitando
`env(safe-area-inset-bottom)`); cartão no canto inferior direito no desktop.
Aparece quando o índice entra na tela e some no fecho, para não cobrir o CTA.
O conteúdo troca com um fade curto quando o ativo muda.

O dock é complemento: o link "No ar" de cada projeto também existe na página
do case, então nada depende dele para ser alcançável sem JS.

## 4. Arquitetura

`app/projetos/page.tsx` continua server component e passa `projects` para a
árvore abaixo.

```
components/projetos/
  ProjetosIndex.tsx    client; dono do estado "ativo", monta o resto
  IndexOpening.tsx     abertura (H1, contador, intro)
  IndexRow.tsx         uma linha do índice (link, numeral, nome, meta)
  IndexStage.tsx       camada base em DOM (capas empilhadas, crossfade)
  IndexStageGL.tsx     camada WebGL (R3F), import dinâmico com ssr: false
  IndexDock.tsx        dock do projeto ativo
  IndexClosing.tsx     fecho com CTA e navegação
  useActiveRow.ts      hook + função pura de escolha do ativo
```

Fluxo: `ProjetosIndex` guarda `activeIndex` (via `useActiveRow`) e o entrega
para `IndexRow` (estilo ativo), `IndexStage`/`IndexStageGL` (qual capa) e
`IndexDock` (qual texto). Velocidade de scroll e posição do ponteiro vão para
o shader por refs, sem re-render do React.

Estilos novos entram em `app/globals.css` com prefixo `.pi-*`, no padrão dos
blocos existentes (`.dw-*`, `.site-*`).

Removidos: `ProjetosGallery.tsx`, `FilterChips.tsx` e `ProjetoGridCard.tsx`
(nenhum outro arquivo de `app/`, `components/` ou `lib/` os importa), junto
com as regras de CSS que só eles usam. O comentário em
`components/site/ProjectsSection.tsx` que cita `ProjetoGridCard` é atualizado.

## 5. Desempenho

- Texturas: `card.webp` (760×874, ~40 KB). Carrega a ativa e as duas vizinhas;
  o resto sob demanda.
- DPR limitado a 1.5 em ponteiro grosso e 2 no desktop.
- `frameloop="demand"`: só há frame durante transição, scroll ou movimento do
  ponteiro.
- Nada roda com a aba oculta.
- Contexto WebGL descartado ao desmontar, no padrão já usado no projeto.
- O bundle do three só é baixado depois da hidratação, e não bloqueia o LCP:
  o LCP é o H1 ou a primeira capa em DOM.
- Lenis continua só em ponteiro fino, como hoje.

## 6. Acessibilidade

- Lista navegável por teclado; foco numa linha a torna ativa. Anel de foco no
  padrão da casa.
- Canvas e camada de capas são `aria-hidden`; as capas não repetem texto para
  leitor de tela.
- Todo texto sobre a capa passa AA.
- `prefers-reduced-motion`: sem distorção, sem janela seguindo o ponteiro, sem
  entrada por máscara; crossfade simples.
- Alvos de toque de no mínimo 44px.

## 7. Verificação

- Teste unitário da função pura de `useActiveRow`, se o projeto ganhar um
  runner; hoje não há runner configurado, então a função é verificada por
  typecheck e à mão. Não se adiciona runner só para isso.
- `npm run typecheck`, `npm run lint`, `npm run build`.
- Checagem visual manual pelo dono do projeto em celular real e desktop.
  Playwright só com permissão explícita.
- Conferir no HTML servido: H1, os 10 links de case e o JSON-LD presentes sem
  JavaScript.

## Fora do escopo

- Transição animada entre a linha do índice e a página do case.
- Mudanças em `/cases/[slug]`, na seção Projetos da home ou em `data/cases.ts`.
- Imagens novas de capa.
- `ds-bundle/` e `.design-sync/` (artefatos gerados).
