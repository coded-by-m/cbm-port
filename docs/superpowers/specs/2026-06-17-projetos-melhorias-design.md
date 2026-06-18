# Melhorias na seção de Projetos — Design

**Data:** 2026-06-17
**Status:** Aprovado no design; aguardando review do spec → plano

## Contexto

A Home é composta por 9 capítulos (Logo → Manifesto → Problema → Serviços →
Projetos → Processo → Laboratório → Sobre → Convite). O capítulo 4 (Projetos) é
a vitrine orbital (`components/zones/ProjectLandscape`): 6 fragmentos triangulados
distribuídos num anel, câmera orbita por drag/auto-rotate, card HTML ancorado ao
fragmento ativo. Hoje há 1 case publicado (Machado Plataformas) + 5 placeholders
"Em breve".

Esta rodada cobre 4 frentes, todas confirmadas com o usuário no brainstorming.

## Objetivos (4 frentes)

1. **Cues de navegação mais ricos** — cada seção mostra todos os gestos
   disponíveis, não só um verbo.
2. **Atalho "Ver projetos"** — para o visitante impaciente, em dois lugares:
   na intro do Logo e persistente em qualquer seção.
3. **+3 projetos reais, −1 placeholder** — vitrine vai de 6 → **8** fragmentos
   (aposenta o placeholder redundante `estudio-mendes`; adiciona 3 reais). Os 3
   novos são projetos reais hospedados na Vercel, com página de case completa +
   botão "ver ao vivo".
4. **Cor sutil por tipo de projeto** — 4 tipos, paleta dessaturada tingindo o
   apex do fragmento.

---

## Frente #1 — Cues de navegação mais ricos

**Arquivos:** `lib/homeChapters.ts`, `components/home/InteractionCue.tsx`,
`components/zones/ProjectLandscape/LandscapeHint.tsx` (alinhamento).

- `HomeChapter` ganha `gestures?: string[]` além do `cue` (verbo primário) atual.
- `InteractionCue` renderiza o verbo primário em destaque + uma linha secundária
  dim com os gestos, separados por `·`. Mantém o comportamento atual (aparece ao
  entrar, some ao rolar, reaparece no idle, esconde no footer/mobile-card).
- Conteúdo por capítulo (proposta inicial, refinável):
  - **Manifesto:** "Role para avançar" · `↑ volta ao logo` · `→ pula`
  - **Problema:** "Role para revelar" · `cada rolada constrói um beat`
  - **Serviços:** "Clique para explorar" · `role nos cards` · `↑↓ troca seção`
  - **Projetos:** "Arraste para girar" · `clique abre o case` · `← → navega` · `espaço pausa`
  - **Processo:** "Role para percorrer" · `cada etapa é um beat`
  - **Laboratório:** "Entre no laboratório" · `role para sair`
  - **Convite:** "Role — o convite se forma" (sem secundários)
- `LandscapeHint` ("Arraste pra explorar") é alinhado/encurtado para não repetir
  o cue rico de Projetos — vira um reforço gestual curto ou é absorvido pelo cue.

## Frente #2 — Atalho "Ver projetos"

**Arquivos:** `components/home/LogoIntro.tsx`,
`components/home/HomeExperience.tsx`, novo `components/home/ProjectsShortcut.tsx`.

- **Na intro (cap. 0):** link discreto "Ver projetos →" ao lado de "Role para
  continuar" no `LogoIntro`. `HomeExperience` passa um callback `onSkipToProjects`
  que: destrava a intro (`setIntroDone(true)`) + salta pro cap. 4 (reusa a
  mecânica `scrollIntoView[data-chapter-index="4"]` já existente para `#projetos`).
- **Persistente:** novo componente `ProjectsShortcut` — pill flutuante discreto
  (canto inferior-esquerdo), visível após a intro, **escondido quando
  `activeChapter === 4`**. Cobre desktop **e** mobile (a `ChapterRail` é só
  desktop). Clique → `jumpTo(4)` com o wipe. Estilo alinhado à marca
  (off-white/vidro, triângulo vermelho).

## Frente #3 — +3 projetos reais, −1 placeholder (6 → 8 fragmentos)

**Arquivos:** `components/zones/ProjectLandscape/config.ts`, `data/cases.ts`,
`types/case.ts`, assets em `public/cases/`.

### Composição final (8 fragmentos)
Aposentar o placeholder `estudio-mendes` (Arquitetura, "Em breve") — redundante
com os 3 cases reais de arquitetura/interiores. Resultado: **4 publicados**
(machado, maison-etoile, forma-viva, estudio-monteiro) + **4 em breve**
(rota-clinica, industrial-tba, ecommerce-tba, education-tba).

### Geometria do anel
- `ringSlot` hoje divide o ângulo por `6` fixo. Refatorar para distribuir por
  `count` (8 → 45° por slot) e ajustar o raio do anel (`r`, hoje `5.5`) se 8
  fragmentos pedirem mais respiro. Toda UI derivada (barra de progresso, setas,
  dots do card) já itera `FRAGMENT_SLOTS` → escala automaticamente. Validar o
  enquadramento mobile (`ORBIT_MOBILE.ringScale`) com 8.

### Dados dos 3 projetos novos (reais, coletados em 2026-06-17)

Todos `status: "published"`, página de case dinâmica em `/cases/[slug]` (rota já
existe), com `siteUrl` para o botão "ver ao vivo" (`CaseLiveButton`).

#### 1. Maison Étoile Interiors — `maison-etoile`
- **Tipo (cor):** `landing` · **Setor:** Design de Interiores · **Ano:** 2025
- **URL:** `lp-interiores.vercel.app`
- **Stack:** Next.js (App Router) · React · Tailwind · Google Tag Manager ·
  fontes Marcellus (serifada display) + Hanken Grotesk · deploy Vercel
- **O que é:** Landing page premium de página única para um estúdio boutique de
  interiores de luxo em São Paulo (fundado por Isabela Monteiro). Estrutura de
  conversão: hero cinematográfico, manifesto, sobre, 5 diferenciais, portfólio
  (5 projetos em carrossel), método de 6 etapas, serviços, FAQ e contato.
- **Descrição (card):** "Landing page de alta conversão para um estúdio boutique
  de interiores de luxo em São Paulo — manifesto, portfólio e proposta numa única
  página cinematográfica."
- **Challenge:** "Transformar um estúdio boutique de interiores em uma presença
  digital de página única que comunica exclusividade e conduz à solicitação de
  proposta sem dispersar o visitante."

#### 2. Atelier Forma Viva — `forma-viva`
- **Tipo (cor):** `institucional` · **Setor:** Arquitetura · **Ano:** 2026
- **URL:** `forma-viva.vercel.app`
- **Stack:** Next.js (App Router, multi-rota) · React · Tailwind · fontes Raleway
  + Inter · deploy Vercel
- **O que é:** Site institucional multi-página para um atelier de arquitetura
  residencial e interiores em Santa Catarina (Florianópolis / Balneário Camboriú).
  Rotas: home, `/projetos` (+ páginas individuais), `/atelier`, `/processo`,
  `/contato`. Linguagem editorial, foco em luz, proporção e matéria.
- **Descrição (card):** "Site institucional multi-página para um atelier de
  arquitetura residencial em Santa Catarina — projetos, atelier e processo com
  navegação editorial e foco em luz e matéria."
- **Challenge:** "Estruturar o portfólio de um atelier de arquitetura em um site
  institucional navegável, com páginas de projeto individuais, sem perder a
  atmosfera autoral."

#### 3. Estúdio Monteiro — `estudio-monteiro`
- **Tipo (cor):** `institucional` · **Setor:** Arquitetura · **Ano:** 2025
- **URL:** `monteiro-nine.vercel.app`
- **Stack:** Next.js (App Router + Turbopack) · React · Tailwind · fontes Fraunces
  (serifada) + Hanken Grotesk · deploy Vercel
- **O que é:** Site institucional para um escritório de arquitetura autoral em São
  Paulo (residencial de alto padrão + corporativo, 40+ obras desde 2009). Design
  editorial escuro com acento terracota, obras selecionadas, páginas de projeto.
  Rodapé assinado "Site por Coded by M".
- **Descrição (card):** "Site institucional para um escritório de arquitetura
  autoral em São Paulo — design editorial escuro, tipografia serifada e obras
  selecionadas com páginas de projeto dedicadas."
- **Challenge:** "Dar a um escritório com 40+ obras uma presença digital que
  transmita permanência e autoria, organizando obras residenciais e corporativas
  num só sistema editorial."

### Assets capturados (`public/cases/<slug>/`)
Cada pasta tem: `desktop-tall.jpeg`, `mobile-tall.jpeg`, `hero-1.jpeg`,
`hero-2.jpeg` (mobile hero). `forma-viva` e `estudio-monteiro` também têm
`gallery-1.jpeg` (página de projeto interno). Formato `.jpeg` (PNG/JPEG aceito;
referenciar a extensão correta em `data/cases.ts`). `preview.desktop`/
`preview.mobile` apontam para os `*-tall`. Otimização para WebP fica como
follow-up opcional (pesos atuais 100–484KB, aceitáveis).

## Frente #4 — Cor sutil por tipo de projeto

**Arquivos:** `types/case.ts`, `data/cases.ts`,
`components/zones/ProjectLandscape/config.ts`,
`components/zones/ProjectLandscape/ProjectFragment.tsx` (+ componentes de cor do
fragmento), `LandscapeProgressBar.tsx`, `ProjectCard.tsx`.

- Novo campo em `CaseProject`: `type?: "institucional" | "landing" | "webapp" | "ecommerce"`.
- Mapa tipo → cor do apex (dessaturado, coeso com a marca):
  | Tipo | Cor apex |
  |------|----------|
  | `institucional` | `#FB3640` (vermelho da marca — âncora) |
  | `landing` | `#D9A15B` (âmbar suave) |
  | `webapp` | `#5FB0A3` (teal frio) |
  | `ecommerce` | `#A98BC9` (violeta suave) |
- Arestas e nós continuam off-white `#F5F2ED` — só o **apex** carrega a cor →
  legível e coeso.
- **Coming-soon continua off-white** independente do tipo (mantém o "ainda não
  pronto" legível; a cor é sinal de "case vivo").
- Reforço leve: tingir o ponto ativo da `LandscapeProgressBar` e um fio/eyebrow
  no `ProjectCard` com a cor do tipo do fragmento ativo.

### Atribuição de `type` aos 8 projetos
- `machado-plataformas` → institucional · `maison-etoile` → landing ·
  `forma-viva` → institucional · `estudio-monteiro` → institucional ·
  `rota-clinica` → webapp · `industrial-tba` → institucional ·
  `ecommerce-tba` → ecommerce · `education-tba` → webapp
  (`estudio-mendes` removido.)

## Stack nas páginas de case (extra do pedido "pegar stacks")

- Adicionar `stack?: string[]` em `CaseProject` e renderizar como um bloco
  "Stack / Tecnologia" no `ProjectFacts` (ou abaixo dele) na página de case.
  Preenchido para os 3 novos com a stack detectada acima. Opcional para o
  Machado (preencher se houver dado).

## Fora de escopo / follow-ups

- Conversão dos `.jpeg` para `.webp` otimizado (peso) — opcional, depois.
- Galerias mais ricas (mais screenshots por case) — começa com o que foi
  capturado; usuário enriquece depois.
- Conteúdo `overview.body` longo de cada case — começa com 2–3 parágrafos
  derivados do conteúdo real coletado; refinável.

## Decisões do review

- **Aposentar `estudio-mendes`** (redundante) → vitrine final com 8 fragmentos.
- **Commit direto na `main`** (preferência do usuário; sem branch).
