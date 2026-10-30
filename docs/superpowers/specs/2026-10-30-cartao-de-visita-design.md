# Cartão de visita Coded by M — design

Data: 2026-10-30
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
| Área de segurança | 84 × 42 mm (3 mm para dentro do corte) |
| Papel | Couché Fosco 300g (branco). O off-white do verso é impresso. |
| Acabamento | Laminação fosca + verniz UV local só no símbolo da frente |
| Entrega | PDF/X-1a CMYK, sem senha, sem páginas de instrução |
| Ordem das páginas | 1. máscara do verniz UV (frente) · 2. arte frente · 3. arte verso |

Máscara de verniz UV local: página separada, só o símbolo da frente, em **100% K** (Printi: `#231F20`), na mesma posição e geometria da arte. Regras Printi para acabamento especial: ≥ 3 mm do corte, sem texto vazado, traço ≥ 0,5 mm, localizado.

## Grid

Margem de 4,8 mm nos quatro lados das duas faces (1,8 mm além da área segura). Espaçamentos internos em múltiplos de 1,2 mm.

## Frente

- Fundo preto rico, sangrando.
- **Símbolo** (mesmo path do `LogoMark`, viewBox 142×161), ≈ 20,8 × 22,3 mm, centralizado na horizontal e na altura da área entre a margem de cima (4,8 mm) e a faixa da frase (8,4 mm do corte de baixo).
  - Os dois traços: impressos em **cinza claro frio** (C8 M4 Y4 K22), fazendo o papel do prata. Espessura ≈ 1,44 mm; o símbolo fica a mais de 10 mm do corte (mínimo Printi: 3 mm).
  - O símbolo inteiro (traços + diagonal) leva **verniz UV local**: brilha sobre a laminação fosca.
  - Diagonal: **impressa em vermelho**, 2 mm de folga dos traços.
- Frase centralizada a 4,8 mm do corte de baixo: "SITES QUE **VENDEM** POR VOCÊ", Satoshi 500, caixa alta, entreletra 0,24 em, cinza claro. "VENDEM" em Satoshi 700 **impresso em vermelho** (não metálico).

## Verso

- Fundo off-white impresso até a sangria (C3 M4 Y8 K0). Texto, QR e ícones em sobreposição (overprint) sobre ele, para não abrir filete branco se o registro variar.
- Canto superior esquerdo: nome "Matheus Mendes" em uma linha, Panchang 800; abaixo, "CRIAÇÃO DE SITES", Satoshi 700, caixa alta, entreletra 0,22 em, cinza escuro.
- Canto superior direito: símbolo pequeno (≈ 5,2 × 5,6 mm), traços pretos e diagonal vermelha, topo alinhado ao topo do nome, no mesmo eixo vertical do QR.
- Canto inferior esquerdo: contatos, Satoshi 500, preto, um por linha:
  - "(48) 99991-6638" + ícone do WhatsApp em vermelho **depois** do número (assim todas as linhas começam alinhadas)
  - "contato.codedbym@gmail.com"
  - "@codedbym.co"
  - "codedbym.com" em Satoshi 700
- Canto inferior direito: **QR real** de 18 × 18 mm impresso em preto direto no papel (a zona de silêncio é o próprio papel), base na margem de baixo. Rótulo "VEJA OS PROJETOS" centralizado em cima dele.
  - URL: `https://codedbym.com/projetos?utm_source=cartao&utm_medium=print` (versão 5, correção de erro M, 37 módulos ≈ 0,49 mm cada).
  - A base dos contatos fica na mesma linha da base do QR.

## Valores da arte final

O mockup foi desenhado na tela; na escala real alguns textos ficavam abaixo do mínimo de leitura. A arte final (`marca/impressos/cartao-de-visita/cartao-printi.pdf`) usa:

| Elemento | No mockup | Na arte final |
|---|---|---|
| Nome | ≈ 10 pt | 10 pt |
| Contatos | ≈ 6 pt | 7 pt, entrelinha 3,75 mm |
| Frase da frente | ≈ 5 pt | 6,5 pt (46 mm de largura) |
| Função, rótulo do QR | ≈ 4,5 a 5,4 pt | 6 pt |
| Distância do rótulo ao QR | 1,6 mm | 2,5 mm (zona de silêncio de 4 módulos = 1,95 mm) |
| Distância traço ↔ diagonal | — | 2,04 mm |

Com o rótulo em 6 pt, ele fica mais largo que o QR (24,9 mm × 18 mm). Para o rótulo centralizado não passar de 3,6 mm do corte, o QR saiu da margem e fica a 7 mm do corte direito. O símbolo pequeno segue o mesmo eixo: símbolo, rótulo e QR formam uma coluna centralizada à direita.

## Cores (CMYK de destino)

| Uso | RGB (tela) | CMYK alvo |
|---|---|---|
| Fundo preto rico (frente) | `#0B0B0B` | C40 M30 Y30 K100 (TAC 200%) |
| Texto e QR pretos (verso) | `#0B0B0B` | K100 puro (sem registro em letra fina) |
| Vermelho (diagonal, "VENDEM", ícone, mini símbolo) | `#FB3640` | C0 M88 Y70 K0 |
| Cinza escuro (função, rótulo) | `#4A4743` | K75 |
| Cinza claro (frase da frente, sobre o preto) | `#B5B1AB` | K30 |
| Fundo do verso | `#F3EEE6` | C3 M4 Y8 K0 |
| Traços do símbolo (frente) | `#C8CCD0` | C8 M4 Y4 K22 |
| Verniz UV local | — | só máscara 100% K |

## Como produzir

A arte foi gerada direto em CMYK com ReportLab (não pela rota Next + conversão do Ghostscript), para ter os valores exatos de tinta sem depender de conversão RGB→CMYK:

1. `gerar_pdf.py`: 3 páginas de 96 × 54 mm (máscara de hot stamping · frente · verso), TrimBox 90 × 48 mm, BleedBox com 3 mm, tudo vetorial, Panchang e Satoshi embutidas (subconjunto). O QR é desenhado módulo a módulo a partir do `segno`.
2. `finalizar_pdf.py`: marca como PDF/X-1a:2001 (versão 1.3, OutputIntent FOGRA39, Trapped=False) e confere que não há operador de cor fora de CMYK.
3. Conferência feita com Ghostscript 10.02.1:
   - separações (`tiffsep`): preto rico = C40 M30 Y30 K100; máscara só K100; fundo do verso C3 M4 Y8 e o preto do texto/QR sobreposto (C3 M4 Y8 K100);
   - leitura do QR no render em 300 dpi (`zxing-cpp`): abre a URL certa.
4. Falta: validar o QR com 2 celulares numa impressão em tamanho real, e passar o PDF no preflight da Printi ao subir o pedido.
5. Entrega em `marca/impressos/cartao-de-visita/`: `cartao-printi.pdf`, `previa-frente-verso.png` (simulação com o brilho do verniz) e `revisao-com-guias.png` (sangria vermelha, corte preto, segurança azul).

## Pendências

- O site aponta o Instagram para `instagram.com/codedbymstudio` (`components/site/shared.tsx`, `INSTAGRAM_URL`). O perfil certo é **@codedbym.co**: atualizar o site em uma mudança separada.

## Fora do escopo

Versão digital (vCard/página `/cartao`), hot stamping e papel texturizado (o arquivo da versão com hot stamping ficou em `gerar_pdf_hotstamping.py`). Podem vir depois.
