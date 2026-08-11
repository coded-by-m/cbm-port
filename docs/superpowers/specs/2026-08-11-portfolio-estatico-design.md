# Portfólio estático — `/portfolio`

**Data:** 2026-08-11
**Status:** aprovado, pronto pra planejar

## Problema

A Home (`/`) é uma experiência WebGL scroll-driven de 9 capítulos. Ela é o argumento
de venda do estúdio, mas exige tempo, atenção e uma máquina decente. Falta uma versão
que se abra num link e responda "esse é o meu portfólio" em menos de um minuto —
pra mandar pra um cliente, um recrutador ou alguém no meio de uma conversa.

## Objetivo

Uma landing page estática, legível em ~60 segundos, que reusa integralmente o design
system existente e não duplica nenhum dado. Movimento presente mas contido: a página
tem que abrir pronta, não se construir na frente da pessoa.

Não-objetivos: substituir a Home, criar conteúdo novo, ter formulário de contato.

## Decisões

| Decisão | Escolha |
|---|---|
| Onde vive | Rota `/portfolio` no repo atual. A Home WebGL fica intocada. |
| Renderização | Server Components por padrão; client só onde há interação. |
| Primeira dobra | Statement à esquerda + projeto em destaque à direita (visível sem rolar). |
| Projetos | Grade de `BrowserFrame`, clique abre `/cases/[slug]`. |
| Barra do card | Domínio real quando existe; nome do projeto quando a URL é `.vercel.app`. |
| Movimento | GSAP só no hero. Resto usa o `Reveal` existente e CSS. |
| Contato | WhatsApp de `lib/contact.ts`. Sem formulário. |

## Arquitetura

### Rota

```
app/portfolio/page.tsx      Server Component. Lê data/, compõe os 6 blocos, exporta metadata.
```

A página não importa nada que puxe `three` ou `@react-three/*`. O code splitting do
App Router garante que o bundle de `/portfolio` não carregue a stack WebGL — isso é
um requisito, não um efeito colateral, e deve ser verificado no build.

`metadata` própria: title, description e OG image (`/cases/machado/desktop-tall.webp`,
a mesma já usada em `/projetos`). A página existe pra ser mandada por link, então o
preview em WhatsApp e LinkedIn faz parte do produto.

### Blocos

Na ordem da página:

1. **Hero** — eyebrow, statement, linha de apoio, CTA. À direita, um projeto em
   destaque dentro de `BrowserFrame`. O projeto em destaque é uma constante no topo
   do componente (`FEATURED_SLUG`), trocável em uma linha. Default: `mj-engenharia`.
2. **Projetos** — os 6 cases com `status: "published"` de `data/cases.ts`, em grade
   de `BrowserFrame`. Dois por linha no desktop, um no mobile. Cada card leva a
   `/cases/[slug]`. Os `coming-soon` não aparecem.
3. **Serviços** — os 3 de `data/services.ts` como cards de texto: índice, título,
   descrição e os 5 `includes`. Sem as mini-cenas 3D da Home.
4. **Processo** — as 4 etapas (Estratégia, Design, Código, Resultado) em linha
   horizontal numerada. Vertical no mobile.
5. **Sobre** — o statement da marca, o bloco-assinatura do fundador e a localização.
6. **Contato** — fechamento com WhatsApp e Instagram, ambos de `lib/contact.ts`.

**Header fixo** minimalista: `LogoMark` à esquerda; âncoras (Projetos · Serviços ·
Sobre) e botão de WhatsApp à direita. No mobile, só logo e botão.

### Componentes

Novos, em `components/portfolio/` — um arquivo por bloco:

| Arquivo | Tipo | Responsabilidade |
|---|---|---|
| `PortfolioHeader.tsx` | client | Header fixo, âncoras com scroll suave |
| `PortfolioHero.tsx` | client | Primeira dobra + timeline GSAP de entrada |
| `ProjectGrid.tsx` | server | Grade dos publicados |
| `ProjectCard.tsx` | server | Um card: `BrowserFrame` + preview + meta + link |
| `ServicesList.tsx` | server | Os 3 serviços |
| `ProcessSteps.tsx` | server | As 4 etapas |
| `AboutBlock.tsx` | server | Statement + assinatura |
| `ContactBlock.tsx` | server | Fechamento |

Cada bloco server é envolvido por `Reveal` na página. `ProjectCard` recebe um
`CaseProject` e não sabe de onde ele veio.

### Reuso

Direto, sem alteração: `BrowserFrame`, `LogoMark`, `CursorTriangle`, `lib/contact.ts`,
`data/cases.ts`, `data/services.ts`, os tokens `cbm` do Tailwind, as fontes Panchang
e Satoshi já carregadas no layout root.

### Mudanças no código existente

Três, todas pequenas e justificadas pelo trabalho:

1. **`Reveal` sai de `components/case/` pra `components/ui/`.** Ele nunca foi
   específico de case, e agora tem dois consumidores. Os imports em `components/case/`
   são atualizados. Comportamento inalterado.

2. **`data/process.ts` e `data/about.ts` passam a existir.** O copy das 4 etapas está
   hardcoded em `ProcessSection.tsx` e o do Sobre em `AboutSection.tsx`. Extrair pra
   `data/` segue o padrão já estabelecido por `cases.ts` e `services.ts`, e evita que
   a Home e o `/portfolio` divirjam. As duas zonas da Home passam a ler de lá — sem
   mudança visual.

3. **`WhatsAppFab` não renderiza em `/portfolio`.** Ele é global no layout root; o
   header dessa página já tem o botão. Um `usePathname()` no componente (que já é
   client) resolve.

## Movimento

Contido por decisão de projeto — a página precisa estar legível imediatamente.

- **Hero:** uma timeline GSAP de entrada, ~1s, rodando uma vez: eyebrow → statement →
  linha de apoio → CTA → o frame do projeto subindo com leve scale. Envolvida em
  `gsap.matchMedia()` com o branch de `prefers-reduced-motion`.
- **Seções:** `Reveal` (IntersectionObserver, fade + slide + blur). Sem GSAP, sem
  ScrollTrigger.
- **Cards:** hover em CSS — o card levanta, a borda vai pro vermelho da marca, e o
  screenshot `desktop-tall` desliza revelando o resto da página.
- **Processo:** a linha que liga as etapas se desenha com `scaleX` na entrada. CSS
  puro dentro do `Reveal`.

GSAP é importado só pelo `PortfolioHero`, então o resto da página não espera por ele.
Todo movimento respeita `prefers-reduced-motion`.

## Responsivo

Mobile-first. Hero empilha (texto acima, frame abaixo). Grade de projetos vira uma
coluna. Processo vira vertical. Header reduz pra logo + botão.

## Critérios de sucesso

- `/portfolio` abre e é legível sem esperar por JavaScript pesado.
- O bundle da rota não contém `three` nem `@react-three/*` — verificado no build.
- Os 6 projetos publicados aparecem; nenhum `coming-soon` aparece.
- Nenhuma barra de card exibe `.vercel.app`.
- Todo texto vem de `data/` — nada de copy duplicado entre a Home e essa rota.
- Com `prefers-reduced-motion: reduce`, tudo aparece sem animação.
- `npm run typecheck` e `npm run lint` passam.
- A Home (`/`), `/projetos` e `/cases/[slug]` continuam funcionando igual.
