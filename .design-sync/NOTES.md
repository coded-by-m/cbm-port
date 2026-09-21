# design-sync — notas do cbm-port

Projeto no claude.ai/design: `f6fe752d-59a7-4b4e-97b4-42c22fb8e7cb`
(https://claude.ai/design/p/f6fe752d-59a7-4b4e-97b4-42c22fb8e7cb)

## O que este repo é, do ponto de vista do sync

O cbm-port é um **app Next.js**, não uma biblioteca publicada: não há `dist/`,
não há Storybook, e `tsconfig.json` tem `noEmit: true`. Quase tudo que segue
existe por causa disso.

- **O barrel é `.design-sync/entry.tsx`** — escrito à mão, e é ele que define o
  que entra no bundle. Componente novo só aparece no design system se for
  exportado ali **e** listado em `componentSrcMap`.
- **Escopo deliberado:** `components/{ui,site,lp,projetos,case}`. Ficam de fora
  `components/zones` e `components/three` (cena WebGL dirigida por scroll, não
  compõe interface), além de `SmoothScroll` e `HeroLandscape`, que não têm
  render próprio para mostrar.
- **`.design-sync/ds-package/` é gerado** (gitignorado). Existe porque o
  conversor sobe a partir do `--entry` até o primeiro `package.json` com nome
  para definir `PKG_DIR` — e é esse diretório que carrega o entry de tipos e o
  CSS compilado, isolados do app. **O `--entry` do build é
  `.design-sync/ds-package/entry.tsx`, não `.design-sync/entry.tsx`.**
- Por consequência, os caminhos do `config.json` são relativos a
  `ds-package/`: daí os `../../` no `componentSrcMap` e no `srcDir`.

## Comandos

```sh
# 1. entradas geradas (tipos + CSS) — é o cfg.buildCmd
node .design-sync/build-types.mjs && node .design-sync/build-css.mjs

# 2. conversor
node .ds-sync/package-build.mjs --config .design-sync/config.json \
  --node-modules ./node_modules --entry .design-sync/ds-package/entry.tsx --out ./ds-bundle
node .ds-sync/package-validate.mjs ./ds-bundle
```

`playwright@1.62.0` é a versão certa nesta máquina: o cache em
`%LOCALAPPDATA%/ms-playwright` tem chromium até o build **1234**, que é o que a
1.62.0 fixa. A 1.63.0 pede o 1243 e falha com `Executable doesn't exist`.
Nenhum download foi necessário.

## Achados que custaram tempo

- **`process is not defined` derrubava o bundle inteiro.** `next/link`,
  `next/image`, `next/dynamic`, `next/navigation` e `@/lib/analytics` leem
  `process.env` no escopo do módulo. Resolvido com substitutos em
  `.design-sync/shims/`, ligados por `compilerOptions.paths` em
  `.design-sync/tsconfig.sync.json` — o conversor lê esse arquivo para resolver
  imports do bundle. **Efeito colateral bom:** o bundle caiu de **2813 KB para
  355 KB**, porque o runtime do Next parou de entrar junto.
- **`@/components/zones/.../FooterLandscape` e `.../TerrainBackground` também
  são substituídos** (`shims/null-canvas.tsx`). Não bastava trocar o
  `next/dynamic`: o `import()` está no arquivo do componente, então o esbuild
  empacotava three + @react-three/fiber + drei de qualquer forma. Consequência
  a declarar: os cards de `Hero` e `CaseHero` mostram a composição real **sem**
  a camada decorativa de canvas. Os próprios componentes só montam essa camada
  depois do idle e em ponteiro fino — ou seja, nunca dentro de um card.
- **Chave `"//"` em JSON de tsconfig quebra o resolvedor.** O conversor tira
  comentários com uma regex `//.*$` antes do `JSON.parse`; uma chave `"//"`
  corrompe o arquivo e o plugin de paths **desliga em silêncio**. Não comente
  `tsconfig.sync.json` desse jeito.
- **Sem árvore `.d.ts` todo componente saía com `[key: string]: unknown`** —
  isto é, sem contrato nenhum para o agente de design. `build-types.mjs` emite
  declarações reais com `tsc --emitDeclarationOnly`. O `tsc` sai com erro por
  causa de arquivos fora de escopo em `components/zones`; isso é esperado e o
  script segue, porque o que importa é a emissão.
- **A base escura é aplicada com `html body`**, em `build-css.mjs`. O template
  do card emite `body{background:#fff}` num `<style>` depois do stylesheet e
  vence por ordem; `html body` vence por especificidade. Sem isso, metade dos
  componentes renderiza texto creme sobre branco.
- **Imagens do repo (`/cases/...`) não existem no bundle.** Os previews usam
  fixtures em `.design-sync/previews/_fixtures.tsx`: screenshots sintéticos em
  data-URI SVG na paleta da marca, mais dois cases reais e uma landing real,
  com os campos de imagem trocados.

## Warns de render conhecidos

Warn que não estiver nesta lista é novo — olhe antes de ignorar.

- `LogoMark`, `LogoMarkSvg`, `TriangleMark` saem `[RENDER_THIN]` mesmo com
  preview autorado. É benigno e esperado: são marcas puramente gráficas, sem
  texto nenhum, e o check procura texto montado. As folhas de captura mostram
  os três desenhando corretamente, em escala. São os **únicos três avisos**
  que a build final emite.

> O `StrokeText` chegou a ficar registrado aqui como não-capturável. **Não é
> mais**: `_still.ts` resolveu. Ele responde `prefers-reduced-motion`, e o
> StrokeText trata esse caso pulando a linha do tempo do gsap e indo direto ao
> estado final — as três células passaram. Fica o registro porque a conclusão
> apressada (“é limitação do harness”) custou uma volta inteira antes de a
> causa real aparecer.

## Previews: o que a rodada de autoria ensinou

29 componentes ganharam preview autorado (`.design-sync/previews/<Name>.tsx`),
escritos em quatro lotes paralelos. Três causas raiz globais apareceram, e as
três estão resolvidas em config/preview — não por gambiarra componente a
componente.

1. **Animação de entrada x instante da captura.** `package-capture.mjs`
   fotografa logo depois de `document.fonts.ready`, e `settle()` só espera
   fontes e decodificação de imagem. Componentes que entram por `Reveal`
   (com `delay` escalonado), por `IntersectionObserver` ou por `gsap` saíam
   meio-apagados — determinístico, não intermitente: três lotes reproduziram
   igual. **Solução:** `.design-sync/previews/_still.ts`, importado como
   primeira linha de todo preview. Ele responde `prefers-reduced-motion: reduce`,
   que **não é** desligar a animação por fora: é um estado de primeira classe
   deste sistema, que o próprio `Reveal` trata pulando para o estado final.
   O card passa a mostrar uma apresentação que o sistema realmente entrega.
2. **Viewport da captura pequeno demais.** O default é 900×700 — mais estreito
   que o breakpoint `lg` do Tailwind (1024px), então seções de largura inteira
   caíam no layout de coluna e a metade visual ficava fora do quadro; e mais
   baixo que várias seções, cortando o rodapé. **Solução:** `cfg.overrides` com
   `viewport` por componente (22 entradas, a maioria `1280x900` ou mais alto).
3. **`/cases/...` quebrado por dentro dos componentes.** `ProjectsSection` e
   `LpProof` leem `data/cases.ts` diretamente, e os 59 caminhos de imagem de lá
   apontam para `public/`, que não existe no bundle — **nem existirá em nenhum
   design que o agente montar**. Não dava para corrigir pelo preview, porque
   esses componentes recebem slugs, não objetos. **Solução:**
   `.design-sync/shims/cases.ts`, ligado por `tsconfig.sync.json`. Mantém todo
   o texto real e troca só os caminhos de imagem por screenshots sintéticos.

### Duas armadilhas que a reavaliação revelou

- **`_still.ts` também adianta temporizadores de entrada.** Além de responder
  `prefers-reduced-motion`, ele dispara na hora qualquer `setTimeout` de até
  1500 ms. Os únicos três da superfície sincronizada são portões de entrada
  (`WhatsAppFab` 900 ms, `CaseHero` 80 ms, `HeroLandscape` 600 ms) — não há
  carrossel nem passo cronometrado que isso pudesse atropelar. Confira ao
  acrescentar componente ao escopo.
- **`usePathname()` devolve `/projetos`, não `/`.** O `WhatsAppFab` retorna
  `null` em `/`, em `/experiencia` e em `/lp/*`. Com o shim devolvendo `/`, o
  card saía vazio sem nada estar quebrado — o componente estava obedecendo a
  própria regra. Foi o achado mais escorregadio da rodada: parecia timing de
  captura e era lógica de rota.
- **O viewport de captura precisa caber a composição inteira.** `CaseScreens`
  com 7 telas cortava a quarta linha em 1100 px de altura; subiu para 1500.

## Riscos para o próximo sync

- **`dtsPropsFor` tem 16 contratos escritos à mão** em `config.json`
  (`CaseProject`, `LandingConfig`, `CaseMeta`, os tipos do `FilterChips` e o
  `MeshButton`). O extrator resolve tipos nomeados só até o primeiro nível,
  então esses ficaram inline. **Eles não acompanham `types/case.ts` nem
  `data/landings.ts` sozinhos** — se esses tipos mudarem, os contratos aqui
  ficam mentirosos. Confira ao re-sincronizar.
- **`_fixtures.tsx` carrega texto real de dois cases e de uma landing.** Se o
  copy mudar no repo, o preview continua com o antigo. É exemplo, não fonte da
  verdade — mas vale reler de vez em quando.
- **Os substitutos de `next/*` são mínimos de propósito.** Se algum componente
  em escopo passar a usar uma prop do `next/image` que o substituto ignora
  (`loader`, `placeholder="blur"`), o card não vai acusar — só vai renderizar
  diferente. Ao acrescentar componente ao escopo, confira o que ele importa.
- **`build-types.mjs` compila com `strict: false`.** Foi para não deixar erro
  de tipo pré-existente do app bloquear a emissão; se um contrato sair estranho,
  esse é o primeiro lugar para olhar.
- A versão do playwright está presa ao cache local de chromium desta máquina.
  Em outra máquina, refaça a conta descrita acima.
