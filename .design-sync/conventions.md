## Como construir com este sistema

Design system da **Coded by M**, extraído do site em produção. A identidade
inteira cabe numa frase: **fundo preto neutro + estrutura off-white + um único
sinal vermelho que corta**, com a malha triangulada como assinatura.

### Sem provider, mas com uma premissa

Nenhum componente precisa de wrapper, provider ou tema: monte-os direto. A
premissa que não pode ser quebrada é o **fundo escuro**: quase nenhum componente
pinta o próprio fundo, todos escrevem em off-white. O `styles.css` já aplica
`html body { background: rgb(var(--cbm-page)); color: #F5F2ED }`. Se você
trocar o fundo da página por claro, o texto some.

### O idioma: variáveis `--cbm-*` e constantes em `style`

Toda cor vem de custom properties `--cbm-<token>`, definidas no topo do
`styles.css` com canais RGB soltos (`--cbm-base: 10 10 10`). Use sempre com
`rgb()`: `rgb(var(--cbm-base))` ou, com alpha, `rgb(var(--cbm-base) / 0.8)`.
Nunca escreva o hex: a paleta pode trocar e o hex não acompanha.

- **Superfícies**, do recuado ao destacado: `sunken`, `page`, `base`,
  `surface`, `raised`, `drawer`, `frame-bar`, `frame`, `card`. Bordas: `border`
  (quase invisível), `border-active`, `line` (filete visível). A hierarquia
  importa mais que os valores: achatar tudo num tom só faz a página perder
  camada.
- **Cinzas**: `gray-50` a `gray-900`. Corpo em `gray-200`, secundário em
  `gray-400` (os dois passam AA sobre o fundo). `gray-600` é decorativo, nunca
  texto que precisa ser lido.
- **Marca**: `white` (#F5F2ED), `red` (#FB3640), `red-dark` (#C42030).

As **constantes exportadas** em `window.CodedByM` já trazem esses valores
prontos para `style={{ ... }}`, o idioma dominante do código:
`SURFACE` (`base`, `sunken`, `raised`, `drawer`, `frame`, `frameBar`), `INK` (o
bloco claro invertido: `base`, `ink`, `body`, `muted`, `border`, `card`,
`signal`), `PANCHANG` (display) e `SATOSHI` (corpo) para `fontFamily`, e
`SECTION` (padding e largura de seção; espalhe em qualquer bloco de página).

**Utilitárias Tailwind: só as já compiladas.** Não há Tailwind em tempo de
execução; uma classe inventada não existe. Existem estas da família `cbm-*`:
`bg-cbm-{page,base,surface,card,frame,red,red-dark}`,
`text-cbm-{white,red,gray-100,gray-200,gray-400,gray-600,gray-800}`,
`border-cbm-{border,line,card,red,gray-600,gray-800}`, mais `font-display`
(Panchang) e `font-body` (Satoshi). Para qualquer outro valor, use `style` com
`rgb(var(--cbm-...))`.

**Classes `site-*`** para o que estilo inline não expressa (hover):
`site-card`, `site-cell`, `site-ghost`, `site-header-cta`,
`site-link-underline`, `site-service-card`, `site-social`, `site-burger`,
`site-drawer-link`. Some-as ao seu `style` em vez de recriar o hover.

### Os dois botões

- **`FillButton`**: o CTA de conversão. Vermelho sólido; no hover, a malha se
  pinta de off-white a partir do cursor. Sempre link (`href`), tamanhos
  `lg`/`md`/`sm`, `full` para largura total. Um por tela, no máximo dois.
- **`MeshButton`**: o botão da marca, vazado, com a malha que acende sob o
  cursor. `size` `lg`/`sm`; com `href` vira link. Para CTAs de seção que não
  são a conversão principal.

Não crie botões novos com `background: #FB3640` na mão: use o `FillButton`.

**Setas: `TriArrow`, nunca →, ↗ ou ←.** `dir="right"` para avançar, `"left"` para voltar,
`"up-right"` (cunha de canto) para link que abre. Herda cor e tamanho do texto ao lado e avança
no hover de um link.

### Regras duras

- **`border-radius: 0`.** Sem exceção. Cantos retos são identidade.
- **O vermelho é raro**: no máximo 2 ou 3 ocorrências por tela. Marca ação e
  passagem, não decora.
- **Vermelho sobre claro é `#C42030`** (`INK.signal`), nunca `#FB3640`: o da
  marca dá 3,3:1 sobre `#F5F2ED` e reprova AA para texto.
- **Sem barras laterais coloridas, sem notas de habilidade, sem travessões no
  texto.** O destaque vem de hierarquia tipográfica, não de enfeite.

### Onde está a verdade

Leia antes de estilizar: o `styles.css` deste sistema e o que ele importa (é o
CSS real do site compilado, com as variáveis `--cbm-*` no topo), e
`guidelines/`, com a fundação de marca e a direção visual. Cada componente tem
seu `.prompt.md` com as props.

### Exemplo idiomático

```jsx
const { SECTION, SURFACE, PANCHANG, SATOSHI, SectionHead, FillButton } = window.CodedByM;

<section style={{ ...SECTION, background: SURFACE.base }}>
  <SectionHead heading="Do site de uma página ao sistema inteiro" sub="Três frentes, o mesmo padrão de execução." />

  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,280px),1fr))", gap: 20, marginTop: 48 }}>
    {servicos.map((s) => (
      <article key={s.titulo} className="site-card" style={{ background: SURFACE.sunken, border: "1px solid rgb(var(--cbm-border))", padding: 28 }}>
        <h3 style={{ fontFamily: PANCHANG, fontWeight: 700, color: "rgb(var(--cbm-white))", margin: 0 }}>{s.titulo}</h3>
        <p style={{ fontFamily: SATOSHI, color: "rgb(var(--cbm-gray-400))", marginTop: 12 }}>{s.texto}</p>
      </article>
    ))}
  </div>

  <FillButton href="https://wa.me/5548999916638" target="_blank" style={{ marginTop: 40 }}>
    Falar sobre o meu projeto
  </FillButton>
</section>
```

Componente da biblioteca para o controle (`SectionHead`, `FillButton`),
constantes e variáveis do sistema para a cola de layout, nenhum hex escrito à
mão e nenhum canto arredondado.
