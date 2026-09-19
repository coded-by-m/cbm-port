# Site novo (`/`) + motor de landings (`/lp/[segmento]`)

**Data:** 2026-09-19
**Status:** parcial — arquitetura e engenharia aprovadas; direção visual aguardando retorno do Claude Design

> Esta spec substitui, em escopo, a de `2026-08-11-portfolio-estatico-design.md` (`/portfolio`).
> Aquela propunha uma página estática generalista ao lado da Home WebGL. Esta vai além: o site
> estático **assume a `/`**. A `/portfolio` deixa de fazer sentido como rota separada — o que ela
> entregaria passa a ser a home. As decisões técnicas daquela spec que continuam válidas (reuso do
> design system, ausência de `three` no bundle, `Reveal` compartilhado) foram absorvidas aqui.

## Problema

A `/` é hoje uma experiência WebGL scroll-driven de 9 capítulos. É o ativo mais diferenciado do
estúdio e funciona muito bem para quem já chegou interessado — mas exige tempo, atenção e uma
máquina decente.

Isso inviabiliza duas coisas que o estúdio precisa agora:

1. **Tráfego pago.** Visitante de anúncio é 100% frio, chega no celular, no 4G, com intenção de
   sair. WebGL custa LCP e bateria — e LCP ruim não só derruba conversão, encarece o clique
   (relevância no Meta, Índice de Qualidade no Google).
2. **Orgânico.** Uma experiência de 9 capítulos não dá superfície de indexação nem velocidade.

## Objetivo

Um site estático, rápido e orientado a conversão ocupando a `/`, mais um motor de landings de
campanha parametrizado — ambos reusando integralmente o design system existente, sem duplicar
nenhum dado.

**Não-objetivos:** aposentar a experiência WebGL (ela ganha rota própria e continua sendo linkada
como argumento de venda); criar identidade visual nova; construir formulário de contato ou backend.

## Decisões

| Decisão | Escolha | Por quê |
|---|---|---|
| Quem ocupa a `/` | O site estático novo | Velocidade e SEO na porta de entrada |
| Onde vai a experiência WebGL | `/experiencia`, movida intacta | `app/page.tsx` são 4 linhas; nada é reescrito |
| Formato do site novo | Página única com âncoras | O conteúdo não sustenta rotas próprias de serviços/sobre |
| Ordem dos blocos | Projetos **antes** de Serviços | Ninguém contrata estúdio de design pela descrição do serviço |
| Nicho na home | Implícito pela prova, não declarado | A `/` recebe orgânico de qualquer setor; o nicho explícito fica na landing |
| Conversão | WhatsApp direto, sem formulário | Zero atrito, zero backend; decisão do cliente |
| Landings | `/lp/[segmento]` parametrizado por `data/landings.ts` | Abrir um ângulo novo vira acrescentar um objeto |
| Indexação das landings | `noindex` | Evita canibalizar a `/` e entregar página sem navegação a quem vem de busca |
| Segmentos no lançamento | Um só: `arquitetura` | O segundo ângulo se escreve sabendo o que o primeiro ensinou |

### Sobre o nicho

Os 6 cases publicados, por setor: Arquitetura (3), Design de Interiores (1), Engenharia (1),
Implementos Rodoviários (1). **Cinco dos seis são o ambiente construído** — um posicionamento que
já aconteceu na prática.

A home **não declara** esse nicho: ela recebe indicação e orgânico de qualquer setor, e os serviços
incluem Aplicações Web, que não pertence a esse mundo. O nicho comunica-se sozinho pela prova. A
declaração explícita — headline dirigida, dor específica — vive em `/lp/arquitetura`, que é onde
precisa ser gritada.

## Arquitetura de rotas

| Rota | Hoje | Depois | Indexação |
|---|---|---|---|
| `/` | Experiência WebGL | Site novo, estático | index |
| `/experiencia` | — | A `HomeExperience` atual, movida | index |
| `/projetos` | Galeria | Inalterada | index |
| `/cases/[slug]` | Página de case | Inalterada | index |
| `/lp/[segmento]` | — | Motor de landings | **noindex** |
| `/lab`, `/ui-lab` | index (sem controle) | Labs internos | **noindex** |
| `/posts/*` | index (sem controle) | Renderizadores de carrossel | **noindex** |

Hoje não existem `robots.ts`, `sitemap.ts` nem `metadataBase`, e nenhuma rota declara `noindex` —
ou seja, os carrosséis de Instagram renderizados como página são indexáveis. Corrigir isso é
pré-requisito, não extra.

## Estrutura da `/`

Página única, âncoras no header, sete blocos:

| # | Bloco | Conteúdo | Origem dos dados |
|---|---|---|---|
| 1 | Hero | Promessa, CTA, projeto em destaque em `BrowserFrame` | `data/cases.ts` (slug constante, trocável em uma linha) |
| 2 | Projetos | Os 6 publicados em grade 2×3 | `data/cases.ts` via `getPublishedBands`/seletor equivalente |
| 3 | Serviços | Os 3 como cards de texto, sem mini-cenas 3D | `data/services.ts` |
| 4 | Processo | As 4 etapas, linha numerada | `data/process.ts` (novo) |
| 5 | A Experiência | Convite para `/experiencia` com still | constante local |
| 6 | Sobre | Manifesto, assinatura do fundador, 3 valores | `data/about.ts` (novo) |
| 7 | Contato | Fechamento WhatsApp + Instagram | `lib/contact.ts` |

**CTA em exatamente três pontos:** hero, abaixo da grade de projetos, e no fechamento. O
`WhatsAppFab` já é uma quarta presença permanente; mais que isso vira ruído.

## Motor de landings `/lp/[segmento]`

Uma landing de campanha não é a home com outra headline. A home é navegável e convida a explorar;
a landing é um corredor com uma porta no fim.

| # | Bloco | Papel |
|---|---|---|
| 1 | Hero | Headline dirigida ao segmento + CTA. Sem âncoras. |
| 2 | **Dor** | 3–4 pontos que a pessoa reconhece como dela. É o bloco que a home não tem, e o que faz a campanha funcionar. |
| 3 | Promessa | O que muda depois. Uma frase. |
| 4 | Prova | Só os cases daquele segmento. |
| 5 | Como funciona | As 4 etapas, reusadas. Tira o medo de "quanto tempo isso toma de mim". |
| 6 | Objeções | 4–5 perguntas reais em acordeão. |
| 7 | CTA final | Fechamento único. |

**Header mínimo:** wordmark (linkando `/`) e botão de WhatsApp. Sem âncoras. A prática comum em
tráfego pago é remover toda saída, mas estúdio de design vende confiança e um logo que não clica em
lugar nenhum cheira a página descartável — um lead curioso que vai ver o site principal não é um
lead perdido.

### `data/landings.ts`

```ts
export interface LandingConfig {
  /** Vira a rota: /lp/<slug> */
  slug: string;
  /** Hero */
  eyebrow: string;
  headline: string;
  sub: string;
  ctaLabel: string;
  /** Pontos de dor — 3 ou 4, frases curtas */
  pains: string[];
  /** Uma frase. Não é parágrafo. */
  promise: string;
  /** Slugs de data/cases.ts, na ordem em que provam */
  caseSlugs: string[];
  /** Objeções — 4 ou 5 */
  faq: { q: string; a: string }[];
  /** Mensagem pré-preenchida do WhatsApp; recebe o UTM concatenado em runtime */
  waMessage: string;
  /** Metadata própria (a rota é noindex, mas o preview em link ainda importa) */
  meta: { title: string; description: string; ogImage: string };
}
```

`generateStaticParams` pré-renderiza todos os segmentos. Acrescentar `/lp/interiores` é acrescentar
um objeto — nenhuma linha de componente muda.

## Componentes

| Diretório | Conteúdo | Regra |
|---|---|---|
| `components/site/` | Blocos compartilhados entre `/` e as landings: grade de projetos, card de projeto, processo, faixa de CTA | **Recebem todo conteúdo por prop.** Nada de copy hardcoded. |
| `components/lp/` | Exclusivos de campanha: hero da landing, bloco de dor, acordeão de objeções | — |
| `components/ui/` | `Reveal` (movido), `LogoMark`, `MeshButton`, `WhatsAppFab` | — |

A regra do "tudo por prop" é o que garante que a home e as landings não divirjam quando uma delas
for mexida — e é o que torna barato, mais tarde, parametrizar também a home.

## Mudanças no código existente

Seis, todas pequenas e justificadas pelo trabalho:

1. **`app/page.tsx` → `app/experiencia/page.tsx`.** São 4 linhas chamando `<HomeExperience />`.
   Todo o trabalho de capítulos, wipe, `ChapterRail` e congelamento de canvas continua idêntico.
2. **`Reveal` sai de `components/case/` para `components/ui/`.** Nunca foi específico de case e
   passa a ter três consumidores. Imports em `components/case/` atualizados; comportamento inalterado.
3. **`data/process.ts` e `data/about.ts` passam a existir**, com o copy hoje hardcoded em
   `ProcessSection.tsx` e `AboutSection.tsx`. As duas zonas da experiência passam a ler de lá —
   sem mudança visual. É o que impede a `/` e a `/experiencia` de divergirem.
4. **`WhatsAppFab` não renderiza em `/experiencia`.** Hoje é global no layout root; um botão verde
   flutuante por cima de uma experiência imersiva estraga justamente a peça que deveria impressionar.
   `usePathname()` no componente (que já é client) resolve.
5. **`app/layout.tsx` ganha metadata de produção**: título real no lugar de
   `"Coded by M — Experience Lab"`, `metadataBase`, OG default.
6. **`app/robots.ts` e `app/sitemap.ts` nascem**, com `noindex` em `/lab`, `/ui-lab`, `/posts/*`
   e `/lp/*`.

## Performance

### Fontes — a correção de maior impacto

Hoje o `layout.tsx` carrega Panchang e Satoshi por um `<link rel="stylesheet">` apontando para
`api.fontshare.com`, com **sete pesos de Panchang e quatro de Satoshi**. É um stylesheet de
terceiro que bloqueia a renderização: antes do primeiro pixel, o navegador resolve DNS, negocia
TLS, baixa o CSS e só então descobre quais arquivos buscar.

Na experiência WebGL isso se perde no meio do carregamento do 3D. Numa landing de anúncio, **é o
carregamento inteiro**.

Correção: `next/font/local` com os `.woff2` auto-hospedados no repo — CSS inline, preload gerado,
`font-display: swap`, zero origem de terceiro. O leque também encolhe: o código usa de 300 a 800,
e `font-black` (900) aparece duas vezes sem existir em nenhuma das duas famílias (está sendo
sintetizado pelo navegador). Três pesos de cada família cobrem o site inteiro.

### Imagens

Existem **13 `<img>` crus e nenhum `next/image`** no projeto — o `desktop-tall.webp` de ~360 KB vai
inteiro para o celular, no mesmo tamanho que vai para um monitor. Na `/` e nas `/lp/*`:
`next/image` com `srcset` responsivo, `priority` na imagem da dobra, lazy no resto.

**Fora de escopo:** as rotas de case existentes. Funcionam e não são o caminho crítico.

### Bundle

A `/` e as `/lp/*` não podem importar nada que puxe `three` ou `@react-three/*`. O code splitting do
App Router garante isso desde que nenhum import atravesse — e é requisito verificável no build,
não efeito colateral esperado.

## Medição

GA4 e Meta Pixel já existem (`lib/analytics.ts`, `components/analytics/`), carregando só após
consentimento. O que falta:

1. **Evento no clique do CTA** — `Lead` (Meta) e `generate_lead` (GA4) disparados antes de abrir o
   `wa.me`. Não prova que a pessoa mandou mensagem, mas é um evento real e otimizável, muito melhor
   que deixar o Meta otimizar por "clique em link de saída".
2. **UTM dentro da mensagem do WhatsApp.** Um client component lê os parâmetros da URL e monta a
   mensagem via `waLink()` — *"Olá! Vim pelo anúncio (arq-carrossel-02) e queria falar sobre o site
   do meu escritório."* Sem backend, e a campanha passa a ser visível dentro da conversa. Sem isso,
   todo lead chega anônimo.

**Trade-off aceito:** quem recusa cookies não dispara pixel, e essa conversão não é medida. O Meta
vai reportar menos leads do que chegam no WhatsApp. É o preço da LGPD e está sendo pago
conscientemente.

## Acessibilidade

- Contraste mínimo AA. `gray-400` sobre a base dá 4.7:1 — é o piso.
- Foco visível em `#FB3640`, `outline-offset: 3px`, sem radius, em tudo que é focável.
- `prefers-reduced-motion: reduce` respeitado em cada animação: tudo aparece no estado final.
- **Colisão de rodapé no mobile:** `WhatsAppFab`, banner de consentimento LGPD e o CTA da seção
  disputam o mesmo espaço. O Fab recolhe enquanto o banner está aberto, e nenhum CTA nasce atrás
  de qualquer um dos dois. É um bug que não aparece em teste de desktop e come campanha em silêncio.

## Direção visual

> **Pendente.** O prompt completo — design system extraído do código, conteúdo real e
> especificação de cada seção — está em `docs/prompts/2026-09-19-claude-design-site-novo.md`.
> Quando o retorno do Claude Design for aprovado, esta seção passa a registrar: o layout aprovado
> por bloco, os estados de hover, e qualquer divergência aceita em relação ao design system de
> `DESIGN-LANGUAGE.md`.

O que já está fechado e não depende desse retorno:

- Design system inalterado — `DESIGN-LANGUAGE.md` e os tokens `cbm` do `tailwind.config.ts`.
- Movimento contido: `Reveal` nas seções, hover em CSS, uma timeline de entrada no hero rodando
  uma vez. **Zero scroll-driven, zero parallax, zero pin.**
- Mobile-first, 390px antes de 1440px.
- O copy de conversão (headline do hero, pontos de dor, promessa, objeções) não existe em nenhum
  lugar do repo hoje e será escrito nessa rodada — **exige revisão humana atenta**, porque é o
  texto que carrega a campanha.

## Critérios de sucesso

- `/` abre e é legível sem esperar por JavaScript pesado.
- O bundle de `/` e `/lp/arquitetura` **não contém `three` nem `@react-three/*`** — conferido no
  output do build.
- Lighthouse mobile em `/lp/arquitetura`: LCP < 2,5s.
- Os 6 projetos publicados aparecem na `/`; nenhum `coming-soon` aparece.
- Nenhuma barra de `BrowserFrame` exibe `.vercel.app`.
- Todo texto vem de `data/` — nada de copy duplicado entre a `/` e a `/experiencia`.
- Com `prefers-reduced-motion: reduce`, tudo aparece sem animação.
- No mobile, com o banner de consentimento aberto, nenhum CTA fica encoberto.
- `/lab`, `/ui-lab`, `/posts/*` e `/lp/*` retornam `noindex`; `sitemap.xml` lista só as quatro
  rotas públicas.
- `npm run typecheck` e `npm run lint` passam.
- `/experiencia`, `/projetos` e `/cases/[slug]` continuam idênticas ao que são hoje.
