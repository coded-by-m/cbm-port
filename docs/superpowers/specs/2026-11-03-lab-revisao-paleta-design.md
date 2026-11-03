# Lab de revisão: paleta sem verde e revisão dos assets

**Data:** 2026-11-03
**Status:** aprovado em conversa e aguardando revisão da spec

## Objetivo

1. Tirar o verde da base escura (fundo, cards, bordas) e trocar por um preto. A escolha entre as candidatas é feita **vendo**, no lab.
2. Refazer a escala de cinzas e criar cores de apoio.
3. Revisar os assets (componentes, botões, cena 3D, posts) num lab, e melhorar o que o Matheus apontar durante a revisão.
4. No fim, enviar ao Claude Design o que mudou. O prazo é **antes de 14/12/2026**, quando o Claude Design separado fecha.

**O que não muda:** o vermelho `#FB3640` e o hover `#C42030`, o off-white `#F5F2ED`, as fontes Panchang e Satoshi, o `border-radius: 0` e a regra de raridade do sinal.

**Fora do escopo:** a pasta `marca/` (PNGs, banners, assinatura de e-mail). Pode virar uma etapa extra depois.

## Situação atual

- Tokens em `tailwind.config.ts` (`cbm.black #000F08`, `forest #070B08`, `border #111511`, `border-active #1A2418`, `gray.100–800`).
- Há cores escritas direto no código em ~64 arquivos, ~97 ocorrências, em três formas: `#000F08`/`#070B08` em CSS e TSX, `rgba(0,15,8,…)` nas seções de `components/zones`, e strings de cor nos `config.ts` da cena 3D (`TerrainMesh`, `TriangleLoader`, `ProjectLandscape`).
- `app/ui-lab` (1.945 linhas) é a vitrine antiga e fica como está, servindo de "antes".
- `app/lab` já tem layout `noindex`.

## Desenho

### 1. Fonte única da paleta: `lib/palette.ts`

Exporta as paletas como objetos tipados (`PaletteId`, `Palette`) e a constante `ACTIVE_PALETTE`, que é a paleta usada em produção. Cada paleta define:

| Token | Papel |
|---|---|
| `base` | fundo de página, canvas 3D, fog |
| `surface` | cards, overlays, fundos secundários (substitui `forest`) |
| `border` / `border-active` | bordas padrão e de hover/ativo |
| `gray-50 … gray-900` | escala nova de cinzas, com degraus suficientes para texto terciário legível sobre `base` |
| `success` / `warning` / `info` | cores de estado |
| `accent-2` | segunda cor de acento, para posts e gráficos; nunca em ação |

`white`, `red` e `red-dark` ficam fixos e iguais em todas as paletas.

**Candidatas iniciais.** São pontos de partida, e a escolha final é registrada nesta spec:

| | `base` | `surface` | `border` | `border-active` |
|---|---|---|---|---|
| **Neutro** | `#0A0A0A` | `#111111` | `#1C1C1C` | `#2A2A2A` |
| **Quente** | `#0C0B0A` | `#13110F` | `#1F1C19` | `#2E2A26` |
| **Puro** | `#000000` | `#0B0B0B` | `#1A1A1A` | `#262626` |

Para a escala de cinzas, a matiz de cada candidata acompanha a do seu preto: cinzas neutros no Neutro e no Puro, quentes no Quente.

### 2. Tokens via variáveis CSS

- `app/globals.css` declara `--cbm-*` em `:root` com os valores da `ACTIVE_PALETTE`, como canais RGB para manter `/<alpha>` no Tailwind.
- `tailwind.config.ts` passa a mapear `cbm.*` para `rgb(var(--cbm-…) / <alpha-value>)`. O nome `forest` vira `surface` (são só 2 usos).
- Trocar de paleta é só reescrever as variáveis, sem rebuild. Em produção nada muda até a gente escolher a nova `ACTIVE_PALETTE`.

### 3. Cores escritas direto no código

Cada ocorrência vira token, numa destas formas:
- **CSS/TSX:** classe `cbm-*` ou `var(--cbm-*)` (`rgba(0,15,8,a)` → `rgb(var(--cbm-base) / a)`).
- **Cena 3D:** o three.js não lê variáveis CSS. Os `config.ts` importam de `lib/palette.ts`, e um hook `usePaletteColor(token)` lê a variável CSS em tempo de execução e responde à troca de paleta. É assim que o lab troca a cor do terreno ao vivo.

No fim, uma busca por `000F08`, `070B08`, `111511`, `1A2418` e `0,15,8` em `app`, `components`, `lib` e `.design-sync` tem que voltar vazia. Exceção: `app/ui-lab`, que é o "antes".

### 4. Rota `/lab/revisao`

- Fica embaixo de `app/lab/` e herda o `noindex`.
- **Barra fixa** no topo para trocar a paleta (Atual com verde / Neutro / Quente / Puro). Ela reescreve as variáveis no `<html>` e guarda a escolha em `localStorage` (é só conveniência, com try/catch).
- **Seções, todas com os componentes reais, em ordem:**
  1. **Cores**: amostras, a escala de cinzas com contraste calculado contra `base` e `surface` (selo AA/AAA) e as cores de apoio.
  2. **Botões**: MeshButton, `.site-cta`, LpCta, CaseLiveButton, CaseBackButton e WhatsAppFab lado a lado, nos estados normal, hover, foco e desabilitado (forçados por classe).
  3. **Componentes**: seções do site, blocos das LPs, cards e galeria de projetos, FilterChips, FAQ, frames de case. Os dados vêm de `data/`, como no site.
  4. **Cena 3D**: o terreno e o fundo, carregados sob demanda com `ssr: false`.
  5. **Posts**: as miniaturas de `app/posts/*` em escala reduzida.
- Cada item mostra um **identificador visível** (`B-03 LpCta`, `C-07 FilterChips`), para servir de referência na revisão.
- Os itens que se apoiam em cor escrita direto não mudam ao trocar a paleta. Isso é proposital: o lab vira o detector do que falta corrigir.

### 5. Ciclo de revisão

1. Montar o lab com as paletas candidatas, e o Matheus escolhe o preto e ajusta os cinzas e as cores de apoio.
2. Gravar a escolha em `ACTIVE_PALETTE` e eliminar as cores escritas direto (seção 3).
3. Revisar seção por seção: o Matheus aponta pelos identificadores, eu corrijo e ele confere no lab. Mudanças grandes, como unificar os botões num sistema de variantes, ganham uma spec curta antes.
4. Atualizar `DESIGN-LANGUAGE.md` e `docs/10-design-system.md`, porque o princípio "temperatura verde no escuro" deixa de valer.

### 6. Envio ao Claude Design

- Atualizar `.design-sync`: `build-css.mjs` (a base escura com `html body`), os shims e `_fixtures.tsx` (os SVGs sintéticos usam a paleta antiga) e os contratos de `dtsPropsFor` dos componentes que mudarem.
- Rodar o build e a validação descritos em `.design-sync/NOTES.md`. Os três `[RENDER_THIN]` conhecidos são esperados.
- Enviar com `/design-sync`, incrementalmente, só os arquivos que mudaram, para o projeto `f6fe752d-59a7-4b4e-97b4-42c22fb8e7cb`.

## Verificação

- `npm run build` sem erro novo.
- A busca da seção 3 volta vazia.
- No lab, trocar a paleta muda **todos** os itens, inclusive a cena 3D.
- Contraste: texto de corpo e secundário no mínimo AA sobre `base` e `surface` na paleta escolhida.
- A validação do design-sync passa só com os avisos conhecidos.
