## Como construir com este sistema

Design system da **Coded by M**, extraído do site em produção. Três cores e duas
fontes carregam a identidade inteira: **fundo profundo + estrutura quente + um
único sinal que corta**.

### Sem provider, mas com uma premissa

Nenhum componente precisa de wrapper, provider ou tema — monte-os direto. A
premissa que não pode ser quebrada é o **fundo escuro**: quase nenhum componente
pinta o próprio fundo, todos escrevem em creme. O `styles.css` já aplica
`html body { background: #000F08; color: #F5F2ED }`. Se você trocar o fundo da
página por claro, o texto some.

### O idioma: constantes em `style`, não tokens CSS

**Este sistema não tem custom properties.** Não procure `var(--cor-x)` — não
existe. O que existe são três camadas, nesta ordem de uso:

1. **Constantes exportadas** — a fonte da verdade, disponíveis em
   `window.CodedByM` junto dos componentes. Use-as em `style={{ ... }}`, que é
   o idioma dominante do código:
   - `SURFACE` — `base` `#040806` (página), `sunken` `#020504` (cards, recuam),
     `raised` `#070C09` (destaca como objeto), `drawer`, `frame`, `frameBar`.
     A hierarquia importa mais que os valores: achatar tudo num tom só faz a
     página perder camada.
   - `INK` — o bloco claro invertido: `base` `#F5F2ED`, `ink` `#040806`
     (títulos), `body` `#4A4844`, `muted` `#6E6B66`, `border`, `card`,
     `signal` `#C42030`.
   - `PANCHANG` (display) e `SATOSHI` (corpo) — passe em `fontFamily`.
   - `SECTION` — padding e largura padrão de seção; espalhe em qualquer bloco
     de página para herdar o ritmo vertical.
   - `BASE_RGB` / `SUNKEN_RGB` para gradientes com alpha.
2. **Utilitárias Tailwind — só as que já estão compiladas.** O CSS entregue é
   estático: não há Tailwind em tempo de execução, então uma classe que você
   inventar simplesmente não existe e o elemento sai sem estilo. Existem
   exatamente estas, e mais nenhuma da família `cbm-*`:
   `bg-cbm-black` `bg-cbm-forest` `bg-cbm-red` `bg-cbm-red-dark`
   `text-cbm-white` `text-cbm-black` `text-cbm-red`
   `text-cbm-gray-{100,200,400,600,800}`
   `border-cbm-border` `border-cbm-red` `border-l-cbm-red`
   `border-cbm-gray-{600,800}` `ring-cbm-red`
   `font-display` (Panchang) e `font-body` (Satoshi).
   Precisou de outra cor ou de qualquer outro valor? Use `style={{ ... }}` com
   as constantes do item 1 — é o caminho seguro e é o que o próprio código faz.
3. **Classes `site-*` escritas à mão**, para o que estilo inline não expressa —
   sobretudo hover: `site-cta`, `site-header-cta`, `site-ghost`, `site-card`,
   `site-cell`, `site-link-underline`, `site-service-card`,
   `site-service-card-light`, `site-social`, `site-burger`, `site-drawer-link`.
   Elas existem no CSS entregue; some-as ao seu próprio `style` em vez de
   recriar o hover na mão.

### Regras duras

- **`border-radius: 0`.** Sem exceção. Cantos retos são identidade, não estilo.
- **Nunca preto puro nem branco puro.** Tudo tem temperatura: `#000F08`, não
  `#000`; `#F5F2ED`, não `#fff`. É o que separa esta marca de dark theme
  genérico.
- **O vermelho é raro** — no máximo 2 ou 3 ocorrências por tela. Ele marca ação
  e passagem, não decora.
- **Vermelho sobre claro é `#C42030`** (`INK.signal`), nunca `#FB3640`: o da
  marca dá 3.15:1 sobre `#F5F2ED` e reprova AA. Sobre o escuro, `#FB3640` vale
  (5.5:1). Losangos e filetes seguem no `#FB3640` — não são texto.

### Onde está a verdade

Leia antes de estilizar: o `styles.css` deste sistema e o que ele importa (é o
CSS real do site compilado), e `guidelines/DESIGN-LANGUAGE.md`, que é a
gramática visual destilada — hierarquia de superfícies, temperatura, raridade
do sinal, motion. Os demais arquivos em `guidelines/` trazem a fundação de
marca e a direção visual. Cada componente tem seu `.prompt.md` com as props.

### Exemplo idiomático

```jsx
const { SECTION, SURFACE, INK, PANCHANG, SectionHead, MeshButton } = window.CodedByM;

<section style={{ ...SECTION, background: SURFACE.base }}>
  <SectionHead heading="Do site de uma página ao sistema inteiro" sub="Três frentes, o mesmo padrão de execução." />

  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,280px),1fr))", gap: 20, marginTop: 48 }}>
    {servicos.map((s) => (
      <article key={s.titulo} className="site-card" style={{ background: SURFACE.sunken, border: "1px solid #111511", padding: 28 }}>
        <h3 style={{ fontFamily: PANCHANG, fontWeight: 700, color: "#F5F2ED", margin: 0 }}>{s.titulo}</h3>
        <p style={{ color: "#8A8780", marginTop: 12 }}>{s.texto}</p>
      </article>
    ))}
  </div>

  <MeshButton label="Falar sobre o meu projeto" />
</section>
```

Note o que o exemplo faz: componente da biblioteca para o controle
(`SectionHead`, `MeshButton`), constantes do sistema para a cola de layout, e
nenhum canto arredondado.
