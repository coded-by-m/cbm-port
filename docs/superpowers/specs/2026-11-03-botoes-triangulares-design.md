# Botões triangulares: MeshButton (malha que acorda) + FillButton

**Data:** 2026-11-03
**Origem:** protótipos X-A e X-F do `/lab/revisao`, escolhidos pelo Matheus.

## Objetivo

1. Reescrever o `MeshButton` sobre o X-A (malha que acorda).
2. Criar o `FillButton` sobre o X-F no modo "sólido que se inverte", substituindo o `.site-cta`.
3. Garantir a leitura do texto: nenhuma linha de malha cruza as letras, e um teste automático prova o contraste em todos os estados.

## MeshButton (X-A)

- A malha é gerada no tamanho real do botão (`ResizeObserver`), com células de ~30px no `lg` e ~22px no `sm`. As bordas são retas e o miolo tem jitter determinístico.
- **Em repouso:** filetes off-white a 0,08 e nenhuma animação.
- **Hover:** uma segunda camada de filetes a 0,85, visível só num círculo de 90px em volta do cursor (`mask-image`). A borda passa para off-white cheio e a seta avança 4px. A seta não gira mais.
- **Placa de leitura:** uma faixa `page` a 0,92 atrás do rótulo, com borda esfumada de 18px na horizontal e 8px na vertical, cobre as duas camadas de filetes.
- **Foco (`:focus-visible`):** contorno vermelho de 2px com 3px de afastamento. A malha acende centralizada.
- **`prefers-reduced-motion`:** as transições ficam instantâneas.
- **Props:** `label`, `showArrow = true`, `size: "lg" | "sm" = "lg"` e `href?`. Com `href`, renderiza `<a>`, e os atributos de link passam adiante. Os atributos nativos continuam passando, assim como o `forwardRef` e a classe `word`.
- **Desabilitado:** opacidade 0,4, sem acender e sem cursor de clique.
- **Usos:**
  - `CaseLiveButton` e `CTASection` passam a usar `href` (link externo de verdade, no lugar de `window.open`).
  - `LabSection` e `PhilosophySection` continuam com `onClick`.

## FillButton (X-F, sólido que se inverte)

- **Em repouso:** fundo vermelho sólido, texto `page` em Panchang 700 caixa-alta, a mesma tipografia do `.site-cta` de hoje.
- **Hover:** cada triângulo da malha pinta de off-white com atraso proporcional à distância do ponto de entrada do cursor. A onda dura 1000ms e cada célula 380ms. Na saída, a malha recolhe para o ponto de saída em 60% do tempo.
- **Filetes:** `page` a 0,25, visíveis só enquanto o botão está ativo, com um furo de borda suave no lugar do rótulo.
- **Texto:** fica `page` o tempo todo.
- **Foco por teclado:** a onda parte da borda esquerda.
- **Seta opcional:** `showArrow = false`. A seta é `page` sobre o vermelho e muda para vermelho depois que a onda passa.
- **Props:** `href` (obrigatório, sempre link), `children`, `size: "lg" | "md" | "sm" = "md"` e `full?`. `full` ocupa a largura toda, como no Hero. `style` e `className` se mesclam por cima, então cada lugar pode manter o próprio padding e a própria fonte. Os atributos nativos de `<a>` passam adiante, incluindo `data-cm-*`.
- **Substitui o `.site-cta`** no Hero, no `ContactSection` e no `LpCta`. A regra `.site-cta:hover` do `globals.css` sai.

## Código compartilhado

| Arquivo | Conteúdo |
|---|---|
| `components/ui/triMesh.ts` | Puro: `mulberry32`, `meshTris(w, h, cell)`, `triD`, `centroid` |
| `components/ui/useBoxSize.ts` | Hook de medição da caixa de borda |
| `components/ui/buttonSpec.ts` | Puro: as opacidades e tempos dos dois botões, lidos pelos componentes **e** pelo teste |

## Teste de contraste (`scripts/buttons.test.mts`)

Roda contra **as quatro paletas**, compondo as cores com alpha sobre o fundo real:

- **MeshButton, rótulo off-white:**
  - em repouso, sobre `page` com o fundo do botão (`page` a 0,6) composto;
  - no pior pixel com hover, sobre linha acesa (0,85) atenuada pela placa (0,92).
  - **Mínimo: 7:1 (AAA).**
- **MeshButton, seta vermelha e contorno de foco sobre `page`:** mínimo 3:1.
- **FillButton, texto `page`:** sobre todas as misturas vermelho → off-white com alpha 0..1, em passos de 0,05. **Mínimo: 4,5:1 (AA).**
- **FillButton, seta:** `page` sobre o vermelho e vermelho sobre o off-white. Mínimo 3:1.
- **`meshTris`:**
  - é determinística;
  - tem `2·cols·rows` triângulos;
  - a soma das áreas é igual a `w·h`, ou seja, cobre a caixa sem buracos.

## Lab e design-sync

- **Previews:** o preview do MeshButton é atualizado (variantes `Pequeno` e `ComoLink`) e o FillButton ganha o seu. O `entry.tsx` exporta o FillButton, e o registro do lab o inclui em Botões.
- **Protótipos:** a seção X do lab e os arquivos de protótipo saem.
- **Fica para a etapa de envio:** `config.json` (`componentSrcMap`, `dtsPropsFor` do MeshButton e do FillButton, `overrides` de viewport).

## Fora do escopo

WhatsAppFab, CaseBackButton e os botões de header e menu.

## Verificação

- `node --test scripts/buttons.test.mts` e `scripts/palette.test.mts` passam.
- `npm run typecheck`, `npm run build` e `node scripts/check-green.mjs` passam.
- No navegador:
  - o hover e o Tab funcionam nos dois botões;
  - o Hero, o Contato e uma landing mostram o FillButton;
  - "Ver o site no ar" é um `<a>` com `href`.
