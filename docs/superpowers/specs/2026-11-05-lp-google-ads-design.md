# Landing de Google Ads: `/lp/site-para-empresa`

**Data:** 2026-11-05
**Status:** desenho aprovado em conversa; aguardando revisão desta spec

> Parte do motor de landings definido em `2026-09-19-site-novo-e-landings-design.md`. Esta spec
> muda duas premissas daquele documento: a ordem dos blocos deixa de ser fixa e o bloco de dor deixa
> de ser obrigatório. O motivo: o motor nasceu para visitante frio, e quem vem do Google já está
> procurando um site.

## Problema

O estúdio vai anunciar no Google para vender sites, e nenhuma página atual serve para isso:

- `/site-institucional` tem preço, prazo e FAQ, mas é página de SEO. Navegação e links tiram a
  pessoa do caminho até o WhatsApp.
- `/lp/arquitetura` tem o foco certo, mas só fala com arquitetos, não mostra preço e abre pela dor.
- `components/lp/LpBlocks.tsx` tem títulos fixos do nicho ("Sites de arquitetura e interiores", "o
  seu escritório"), que apareceriam em qualquer landing nova.
- `LpFaq` não filtra rascunhos: `/lp/arquitetura` mostra hoje "PREENCHER: ..." em produção
  (confirmado em 2026-11-05).
- Não existe tag nem conversão do Google Ads, nem página de política de privacidade.
- Sem UTM na URL, a mensagem do WhatsApp recebe um `gclid` truncado, sem sentido para o lead.

## Objetivo

Publicar `/lp/site-para-empresa`, uma página com uma oferta e um CTA, para quem busca "criação de
sites" e "site profissional para empresa". Medir o clique no WhatsApp como conversão do Google Ads.

**Não-objetivos:** criar a campanha (palavras-chave, anúncios, orçamento); publicar em produção;
adotar o Consent Mode; criar formulário ou backend; oferecer vários serviços na mesma página;
reescrever a copy de `/lp/arquitetura`.

## Decisões

| Decisão | Escolha | Por quê |
|---|---|---|
| Busca-alvo | Site para empresa | Maior demanda e alinhada a "vender sites" |
| Oferta | Só site institucional, com preço; landing em uma linha | Decisão simples, e o preço afasta quem não tem verba antes do contato |
| Conversão | Clique no WhatsApp, sem formulário | Mantém a decisão do projeto: sem backend e sem atrito |
| Prova | 3 clientes reais primeiro, depois 2 conceitos rotulados | Mostra variedade sem sugerir que conceitos foram clientes |
| Rota | Novo segmento em `/lp/[segmento]` | Reaproveita visual e blocos |
| Indexação | `noindex` | Continua a regra das landings; não impede anúncios |
| Links para sites de clientes | Nenhum nesta versão | Mantém a pessoa na página; reavaliar se a conversão pedir mais confiança |
| Dados após a entrega | Só "métricas configuradas" nos diferenciais | O que o cliente recebe além disso não foi definido, então não será prometido |
| Pagamento e CNPJ | Fora da página | Dependem de informação ainda não fornecida; entram depois sem mudar a estrutura |
| Consentimento | Tag só depois do aceite | Mantém a regra atual do site; ver "Limitação aceita" |

## Estrutura da página

| # | Bloco | Conteúdo |
|---|---|---|
| 1 | Cabeçalho | `LpHeader` atual: logo e "Falar agora" |
| 2 | Hero | Título, preço, prazo, CTA; imagem do site da Machado Plataformas a partir de 900 px |
| 3 | Portfólio | Clientes reais; depois, grupo "Projeto conceitual" |
| 4 | Problema | 3 frases curtas |
| 5 | Diferenciais | A resposta ao problema |
| 6 | Oferta | O que está incluso, preço, prazo, linha da landing |
| 7 | Processo | As 4 etapas de `PROCESS_STEPS` |
| 8 | FAQ | 6 perguntas |
| 9 | CTA final | Fechamento único |
| 10 | Rodapé | Dados da empresa e privacidade |

**Casos, nesta ordem:** `machado-plataformas`, `mj-engenharia`, `valdete-costuras`, `stige`,
`estudio-lentz`. Os dois últimos têm `concept: true`.

## Copy (rascunho para revisão humana)

Tudo vem de afirmações já publicadas no site. Preços saem de `PUBLIC_PRICE`, nunca digitados à mão.
Nos diferenciais, nenhum número de desempenho sem medição.

**Hero**
- Título: "Site profissional para a sua empresa, feito do zero."
- Apoio: "A partir de R$ 1.500, com hospedagem e domínio inclusos. Prazo a partir de 15 dias úteis.
  Estúdio em Florianópolis, atendimento em todo o Brasil."
- CTA: "Pedir orçamento no WhatsApp"

**Portfólio**
- Título: "Empresas que já estão no ar com um site nosso."
- Título do grupo conceitual: "Projetos conceituais, para mostrar o alcance do trabalho."

**Problema**
- "Seu site parece com o do concorrente, porque saiu do mesmo template."
- "A página demora a abrir no celular, e a pessoa volta para o Google."
- "Quem procura o seu serviço na sua cidade não encontra a sua empresa."

**Diferenciais**
- Título: "O que muda quando o site é feito do zero."
- Código próprio: "Design exclusivo, sem template e sem o peso de um construtor de sites."
- Velocidade: "Pensado primeiro para o celular e para carregar rápido."
- Google: "SEO técnico e dados estruturados desde o primeiro dia."
- Domínio: "Registrado no nome da sua empresa. Se você quiser sair, ele continua seu."
- Métricas: "WhatsApp integrado e métricas configuradas na entrega."

**Oferta**
- Título: "Site institucional sob medida."
- Inclusos: a lista `includes` de `site-institucional` em `data/servicePages.ts`, sem cópia.
- Preço e prazo: "A partir de R$ 1.500", "A partir de 15 dias úteis". "O valor final depende do
  projeto e é fechado no WhatsApp, antes de começar."
- Linha da landing: "Precisa só de uma página? Landing page a partir de R$ 600, em 5 dias úteis."

**FAQ**
- "Quanto custa um site?": a constante `INSTITUCIONAL_PRECO` de `servicePages.ts`, exportada.
- "Em quanto tempo fica pronto?": "A partir de 15 dias úteis. O prazo final depende do número de
  páginas e do conteúdo e é fechado no orçamento no WhatsApp, antes de começar."
- "Hospedagem e domínio estão inclusos?": "Sim. A hospedagem fica por minha conta e está incluída
  no valor do projeto. O domínio é registrado no nome da sua empresa, e o custo também está
  incluído."
- "Tem mensalidade?": "Existe um plano mensal opcional de suporte e atualizações, com valor que
  depende do serviço."
- "Posso editar o conteúdo depois?": "Sim. A entrega inclui handover, e se o conteúdo muda com
  frequência o site sai com um CMS leve para você editar sem depender de mim."
- "Vocês atendem fora de Santa Catarina?": a constante `ATENDE_BRASIL`, exportada.

**CTA final**
- Título: "Vamos conversar sobre o site da sua empresa."
- Apoio: "Você conta o projeto e eu respondo no mesmo dia com valor e prazo. O orçamento é gratuito
  e sem compromisso."

**Mensagem do WhatsApp:** "Olá! Vim pela página de sites para empresas da Coded by M e quero um
orçamento."

**Metadados:** título "Criação de site profissional para empresas", descrição com preço e prazo,
imagem `OG.home`.

## Mudanças no motor

### `data/landings.ts`

```ts
export type LandingBlock =
  | "hero" | "pains" | "promise" | "proof"
  | "differentials" | "offer" | "process" | "faq" | "final";

export interface LandingConfig {
  // ...campos atuais de hero, FAQ, mensagem e metadados
  /** Blocos da página, na ordem em que aparecem. */
  blocks: LandingBlock[];
  /** Case cuja captura aparece no hero. Sem isto, o hero fica só com texto. */
  heroCaseSlug?: string;
  /** Obrigatórios apenas para quem lista o bloco correspondente. */
  pains?: string[];
  promise?: string;
  proofHeading: string;
  conceptHeading?: string;
  differentials?: { heading: string; items: { title: string; text: string }[] };
  offer?: {
    heading: string;
    includes: string[];
    price: string;
    deadline: string;
    note: string;
    alternative?: string;
  };
  processHeading: string;
  final: { heading: string; text: string };
}
```

`/lp/arquitetura` declara `blocks: ["hero", "pains", "promise", "proof", "process", "faq", "final"]`
e leva para a configuração os títulos hoje fixos, com o mesmo texto. Não muda nada além do FAQ, do
rodapé e do rótulo dos conceitos.

### `app/lp/[segmento]/page.tsx`

Percorre `lp.blocks` e renderiza o componente de cada chave. `LpHeader` e `LpFooter` ficam fora da
lista e aparecem em toda landing.

### `components/lp/`

| Peça | Mudança |
|---|---|
| `LpHero` | Imagem opcional (`preview.top` do case de `heroCaseSlug`), só a partir de 900 px e sem `priority`; texto do hero sem `Reveal` (ver "Decisão de performance") |
| `LpProof` | Título por configuração e sem `Reveal`; separa os grupos pelo campo `concept`; rótulo "Projeto conceitual"; sem conceitos ou sem reais, renderiza só o grupo que existe |
| `LpProcess`, `LpFinal` | Títulos e textos por configuração |
| `LpFaq` | Filtra com `isFilled` de `data/servicePages.ts` |
| `LpDifferentials` | Novo |
| `LpOffer` | Novo |
| `LpFooter` | Novo: "Coded by M · Florianópolis, SC", WhatsApp e link para `/privacidade` |

Em `/lp/arquitetura`, "Quanto custa?" e "Quanto tempo leva?" deixam de aparecer até ganharem
resposta. O hero e os títulos dessa página continuam iguais.

### Decisão de performance (medida na implementação)

O `Reveal` deixa o conteúdo invisível até o JavaScript rodar. No hero isso adiava o que a pessoa veio
ver. E, no celular, a imagem do hero repetia o primeiro card do portfólio e virava o LCP.

Lighthouse mobile na build de produção local (localhost, sem CDN):

| Versão de `/lp/site-para-empresa` | LCP simulado | LCP com throttling real |
|---|---|---|
| Imagem no celular, texto no `Reveal` | 3,1 s | 2,0 a 2,3 s |
| Sem imagem no celular, título do portfólio no `Reveal` | 0,9 s | 5,0 s |
| **Sem imagem no celular, sem `Reveal` no hero e no título do portfólio** | **0,9 s** | **2,0 a 2,1 s** |

Trade-off aceito: o celular não vê imagem na primeira dobra. Ela aparece logo abaixo, no primeiro
card. O texto do hero também perde a animação de entrada, inclusive em `/lp/arquitetura`, cujo LCP
foi de 3,2 s para 0,8 s na simulação e de 4,7 s para 2,0 s com throttling real.

## Privacidade

Nova página `/privacidade`, indexável e no `sitemap.ts`, em linguagem simples:

- Quem é o responsável: Coded by M, Matheus Mendes, Florianópolis/SC, contato pelo WhatsApp.
- O que é coletado e para quê: GA4, Meta Pixel e Google Ads, só após consentimento; Coded Insights,
  first-party e sem cookie; dados que a pessoa envia na conversa do WhatsApp.
- Como o consentimento funciona e como mudar de ideia. Hoje o site não oferece como mudar a escolha
  já feita, então a página ganha botões de aceitar e recusar (`ConsentChoice`).
- Direitos da pessoa na LGPD e como exercê-los.
- Data da última atualização.

O texto é um rascunho do que o código faz hoje. Precisa da revisão do Matheus e não substitui
revisão jurídica. Nenhum prazo de retenção será inventado: o que não estiver definido fica como
pendência da revisão.

Links para a página: `LpFooter`, `Footer` (`components/zones/CTASection`, o rodapé da home e da
experiência), `GalleryFooter` e `CookieConsent`.

## Medição

### Conversão

Em `lib/analytics.ts`:

```ts
export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
export const GOOGLE_ADS_WA_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_WA_LABEL;
```

- `Analytics.tsx` chama `gtag('config', GOOGLE_ADS_ID)` junto do GA4, se o ID existir.
- `trackEvent`, no ramo `whatsapp_click` já protegido pelo consentimento, envia
  `gtag('event', 'conversion', { send_to: 'ID/RÓTULO', transport_type: 'beacon' })`, se os dois
  existirem.
- Sem as variáveis, nada é enviado e o site funciona igual. Os valores são públicos e não têm valor
  padrão no código, porque a conta ainda não forneceu o ID.
- Vale para qualquer WhatsApp do site: quem chega pelo anúncio e clica no logo continua contando.

### Origem do lead

`lib/campaign.ts` deixa de ler `gclid` e `fbclid`. Sem UTM, a mensagem fica limpa. A URL final dos
anúncios deve levar `utm_campaign=site-empresa`, que chega como `(origem: site-empresa)`.

### Configuração na conta do Google Ads (fora do código)

- Ação de conversão "Clique no WhatsApp", contagem "uma por clique no anúncio".
- Definir `NEXT_PUBLIC_GOOGLE_ADS_ID` e `NEXT_PUBLIC_GOOGLE_ADS_WA_LABEL` em produção.
- Validar com o Tag Assistant.

### Limitação aceita

A tag só carrega depois do aceite dos cookies. Quem recusa ou ignora o banner não é contado no Ads,
que verá menos conversões do que as reais e terá menos dados para otimizar. O Coded Insights conta
todos os cliques, por `data-cm-id` (`lp-hero`, `lp-final`, `lp-header`), o que permite medir a
diferença. Se ela for grande, o Consent Mode será reavaliado em outra spec.

Um clique no WhatsApp também não prova que a mensagem foi enviada. A qualidade dos leads precisa ser
conferida nas conversas.

## Critérios de sucesso

- `/lp/site-para-empresa` responde 200, com `noindex`, fora do `sitemap.xml`.
- Os blocos aparecem na ordem da spec, e a copy da landing vem de `data/` (o rodapé compartilhado é a exceção, com o WhatsApp vindo de `lib/contact.ts`).
- Preço e prazo aparecem na primeira dobra em 390 px.
- Stige e Estúdio Lentz exibem "Projeto conceitual"; os 3 clientes reais, não.
- Nenhum "PREENCHER" aparece em `/lp/site-para-empresa` nem em `/lp/arquitetura`.
- `/lp/arquitetura` mantém ordem e títulos; muda só o esperado (FAQ, rodapé, rótulo, hero sem animação).
- Com `?utm_campaign=site-empresa`, a mensagem do WhatsApp termina em `(origem: site-empresa)`.
- Com `?gclid=abc`, a mensagem não traz origem nenhuma.
- `/privacidade` responde 200, está no sitemap e é alcançável pelos quatro pontos de link.
- Sem aceite, nenhuma requisição ao Google sai e `conversion` não é enviada.
- Com aceite e ID de teste, `conversion` sai uma vez por clique, com o `send_to` certo.
- Sem as variáveis de ambiente, nenhuma conversão sai e não há erro no console.
- Com o banner aberto em 390 px, nenhum CTA fica encoberto de forma que não possa ser usado.
- Bundle da rota sem `three` nem `@react-three/*`.
- Lighthouse mobile na build de produção: LCP < 2,5 s.
- Texto com contraste AA, foco visível e, com `prefers-reduced-motion: reduce`, tudo aparece no
  estado final.
- `npm run typecheck`, `npm run lint` e `npm run build` passam.

## Como verificar

O projeto não tem testes automatizados. A verificação usa os comandos acima, a build de produção no
navegador em 390 px e 1440 px e um ID de teste nas variáveis de ambiente. A validação real da
conversão depende da conta do Google Ads.
