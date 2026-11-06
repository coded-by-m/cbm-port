# Cartão de visita Coded by M — design

Data: 2026-10-30
Atualizado: 2026-11-06 (frente com símbolo pequeno e relevo sutil, sem frase nem nome; verso revisado)
Status: versão **I** escolhida no brainstorm e adaptada ao pedido feito na Printi (Linha Especial: Couché Fosco 300g, 4x4, laminação fosca, verniz UV local). Arte final gerada.
Mockup de referência: `.superpowers/brainstorm/1696-1793370010/content/ij-refino-5.html` (linha "I · Preto + prata")
Escala do mockup: 1 mm = 5 px (cartão 450 × 240 px). Todas as medidas abaixo já estão em mm.

## Objetivo

Cartão impresso para entregar a donos de pequenos negócios (público leigo). Em meio segundo ele precisa dizer o que o Matheus faz, parecer premium e levar a pessoa ao portfólio ou ao WhatsApp.

## Gráfica e formato (gabarito Printi)

| Item | Valor |
|---|---|
| Corte (formato final) | 90 × 48 mm, paisagem |
| Arquivo com sangria | 96 × 54 mm (3 mm por lado) |
| Área de segurança | 3 mm para dentro do corte, pelo texto da Printi. A linha azul do arquivo de gabarito está a 5 mm: a arte respeita as duas medidas |
| Papel | Couché Fosco 300g (branco). O off-white do verso é impresso. |
| Acabamento | Laminação fosca + verniz UV local só no símbolo da frente |
| Entrega | PDF/X-1a CMYK, sem senha, sem páginas de instrução |
| Ordem das páginas | 1. máscara do verniz UV (frente) · 2. arte frente · 3. arte verso |

Máscara de verniz UV local: página separada, só o símbolo da frente, em **100% K** (Printi: `#231F20`), na mesma posição e geometria da arte. Regras Printi para acabamento especial: ≥ 3 mm do corte, sem texto vazado, traço ≥ 0,5 mm, localizado.

## Grid

Verso com margem de 6 mm nos quatro lados (3 mm além da área segura). Os quatro blocos ficam presos aos cantos dessa margem. Na frente, o símbolo fica centralizado nos dois eixos. Espaçamentos internos em múltiplos de 1,2 mm.

## Frente

- Fundo preto rico, sangrando.
- **Símbolo pequeno** (mesmo path do `LogoMark`, viewBox 142×161), 10 × 10,7 mm, centralizado nos dois eixos. Sem frase e sem o nome da marca: o nome aparece no verso, em `codedbym.com` e `@codedbym.co`.
  - Os dois traços: impressos em **cinza claro frio** (C8 M4 Y4 K22), fazendo o papel do prata. Espessura ≈ 0,69 mm; o símbolo fica a mais de 18 mm do corte (mínimo Printi: 3 mm).
  - O símbolo inteiro (traços + diagonal) leva **verniz UV local**: brilha sobre a laminação fosca.
  - Diagonal: **impressa em vermelho**, 0,98 mm de folga dos traços.
- **Relevo sutil** na faixa de baixo, sangrando: o terrain mesh do site (`components/zones/TerrainMesh`), com o mesmo noise, semente e câmera, e malha de 30 × 21 segmentos.
  - Linhas de 0,18 mm. C40 M30 Y30 iguais ao fundo, e o K sobe de 60% na base até 100% no horizonte: a linha existe só na chapa preta, então o desalinhamento das outras chapas não abre franja colorida.
  - O tom de cada trecho de 0,5 mm vem da posição dele. As linhas se dissolvem no preto, sem corte brusco. Não há oclusão entre as arestas, porque ela criaria cortes.
  - Sem verniz: o traço mínimo de 0,5 mm deixava a malha pesada.
  - Risco: o contraste real só aparece no papel. Se a Printi oferecer prova, vale pedir antes da tiragem. A reserva sem relevo está em `reserva-sem-relevo/`.

## Verso

- Fundo off-white impresso até a sangria (C3 M4 Y8 K0). Texto, QR e ícones em sobreposição (overprint) sobre ele, para não abrir filete branco se o registro variar.
- Canto superior esquerdo: nome "Matheus Mendes" em uma linha, Panchang 800, com espaço explícito entre as palavras (o espaço da fonte é estreito demais); abaixo, "CRIAÇÃO DE SITES", Satoshi 700, caixa alta, entreletra 0,18 em, cinza escuro.
- Canto superior direito: símbolo pequeno (≈ 5,9 × 6,4 mm), traços pretos e diagonal vermelha. Topo no topo do nome, base na base da função, borda direita na margem.
- Canto inferior esquerdo: contatos, Satoshi 500, preto, um por linha:
  - "(48) 99991-6638" + ícone do WhatsApp em vermelho **depois** do número (assim todas as linhas começam alinhadas)
  - "contato.codedbym@gmail.com"
  - "@codedbym.co"
  - "codedbym.com" em Satoshi 700
- Canto inferior direito: **QR real** de 20 × 20 mm impresso em preto sobre o fundo off-white, base e borda direita na margem. Rótulo "VEJA OS PROJETOS" em cima dele, com exatamente a largura do QR.
  - URL: `https://codedbym.com/projetos?utm_source=cartao&utm_medium=print` (versão 5, correção de erro M, 37 módulos ≈ 0,54 mm cada).
  - A base dos contatos fica na mesma linha da base do QR.

## Valores da arte final

O mockup foi desenhado na tela; na escala real alguns textos ficavam abaixo do mínimo de leitura. A arte final (`marca/impressos/cartao-de-visita/cartao-printi.pdf`) usa:

| Elemento | No mockup | Na arte final |
|---|---|---|
| Nome | ≈ 10 pt | 10 pt |
| Contatos | ≈ 6 pt | 7 pt, entrelinha 3,6 mm |
| Função | ≈ 4,5 a 5,4 pt | 6 pt |
| Rótulo do QR | ≈ 4,5 a 5,4 pt | 5,6 pt, preto 100% |
| Distância do rótulo ao QR | 1,6 mm | 2,4 mm (zona de silêncio de 4 módulos = 2,16 mm) |
| Distância traço ↔ diagonal | — | 0,98 mm |

O QR foi de 18 para 20 mm e o rótulo, de 6 para 5,6 pt, para os dois terem a mesma largura e a coluna da direita respeitar a margem. O rótulo fica em preto 100% porque, nesse tamanho, a retícula do cinza poderia borrar.

## Cores (CMYK de destino)

| Uso | RGB (tela) | CMYK alvo |
|---|---|---|
| Fundo preto rico (frente) | `#0B0B0B` | C40 M30 Y30 K100 (TAC 200%) |
| Texto e QR pretos (verso) | `#0B0B0B` | K100 puro (sem registro em letra fina) |
| Vermelho (diagonal, ícone, mini símbolo) | `#FB3640` | C0 M88 Y70 K0 |
| Cinza escuro (função) | `#4A4743` | K75 |
| Fundo do verso | `#F3EEE6` | C3 M4 Y8 K0 |
| Traços do símbolo (frente) | `#C8CCD0` | C8 M4 Y4 K22 |
| Linhas do relevo (frente) | — | C40 M30 Y30, K de 60% a 100% |
| Verniz UV local | — | só máscara 100% K |

## Como produzir

A arte foi gerada direto em CMYK com ReportLab (não pela rota Next + conversão do Ghostscript), para ter os valores exatos de tinta sem depender de conversão RGB→CMYK:

Os scripts estão em `scripts/cartao/`, e o comando de cada etapa está no topo de `gerar_cartao.py`.

1. `gerar_cartao.py`: 3 páginas de 96 × 54 mm (máscara do verniz UV · frente · verso), TrimBox 90 × 48 mm, BleedBox com 3 mm, tudo vetorial, Panchang e Satoshi embutidas (subconjunto). As fontes vêm de `public/fonts`. O QR é desenhado módulo a módulo a partir do `segno`. O relevo vem de `malha.py`, e `--sem-relevo` gera a reserva.
2. `finalizar_pdf.py`: marca como PDF/X-1a:2001 (versão 1.3, OutputIntent FOGRA39, Trapped=False) e procura operadores de cor fora de CMYK. O único `gs` que ele acusa é o da sobreposição do verso.
3. `conferir.py`, com Ghostscript 10.02.1:
   - separações (`tiffsep`): preto rico = C40 M30 Y30 K100; máscara só K100; fundo do verso C3 M4 Y8 e o preto do texto/QR sobreposto (C3 M4 Y8 K100);
   - máscara do verniz × símbolo da frente: 0 pixel de diferença em 600 dpi;
   - leitura do QR no render em 300 e 150 dpi (`zxing-cpp`): abre a URL certa.
4. Falta: validar o QR com 2 celulares numa impressão em tamanho real, e passar o PDF no preflight da Printi ao subir o pedido.
5. Entrega em `marca/impressos/cartao-de-visita/`: `cartao-printi.pdf`, além de `previa-frente-verso.png` (simulação com o brilho do verniz) e `revisao-com-guias.png` (sangria vermelha, corte cinza, segurança azul), ambas de `previa.py`. Na revisão, a guia azul marca os 3 mm do texto da Printi, não os 5 mm da linha do gabarito.

## Pendências

- O site aponta o Instagram para `instagram.com/codedbymstudio` (`components/site/shared.tsx`, `INSTAGRAM_URL`). O perfil certo é **@codedbym.co**: atualizar o site em uma mudança separada.

## Fora do escopo

Versão digital (vCard/página `/cartao`), hot stamping e papel texturizado. Podem vir depois.
