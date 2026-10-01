# SEO Changelog — 2026-09-30

## app/layout.tsx
- Title padrão: "Coded by M — Criação de sites e landing pages sob medida"; description nova (strings em `lib/seo.ts`).
- Open Graph/Twitter com imagem 1200×630 (`/og/home.jpg`); `og:url` removido do layout para não vazar para `/lab` e 404.
- `applicationName`, `authors`, `creator`, `formatDetection.telephone=false`.
- JSON-LD global: `ProfessionalService` + `Person` + `WebSite`.
- `<noscript>` que mostra blocos `[data-reveal]` sem JavaScript.

Reason: entidade explícita para buscadores e IA; preview social correto; conteúdo legível sem JS.
Expected impact: CTR e compreensão da entidade; nenhum efeito visual com JS ligado.

## app/page.tsx
- `openGraph` completo com `url: "/"`.
- JSON-LD `WebPage`.

## app/projetos/page.tsx
- Title "Projetos de sites e landing pages", description com setores atendidos, OG próprio.
- JSON-LD `CollectionPage` + `ItemList` dos cases + `BreadcrumbList`.

## app/experiencia/page.tsx
- OG/Twitter próprios (`/og/experiencia.jpg`).

## app/cases/[slug]/page.tsx
- Só cases publicados viram rota (`generateStaticParams` filtrado, `dynamicParams = false`, `notFound()` para não publicados).
- Title "Case {Cliente} — {Tipo}"; OG `article` com imagem própria e `og:url`.
- JSON-LD `WebPage` + `CreativeWork` + `BreadcrumbList`.

Reason: 4 URLs vazias respondiam 200; o compartilhamento de um case mostrava a home.

## app/sitemap.ts
- Removido `lastModified` (era a hora do build). `/experiencia` com prioridade 0.4.

## app/not-found.tsx (novo)
- 404 com links para Início, Projetos e WhatsApp.

## lib/seo.ts (novo)
- Builders de schema (organização, fundador, site, página, breadcrumb, case), IDs `@id`, mapa de imagens OG, título/descrição da home.

## components/seo/JsonLd.tsx (novo)
- Emite `<script type="application/ld+json">` no servidor, com `<` escapado.

## components/zones/CTASection/Footer.tsx
- Item "Projetos" → `/projetos` no menu do rodapé.

## components/case/CaseReturnCTA.tsx
- "← Voltar à Paisagem" (`/#projetos`) → "← Todos os projetos" (`/projetos`); fallback sem `siteUrl` sem a metáfora da Paisagem.

## components/case/CaseBackButton.tsx
- Rótulo "Paisagem" → "Projetos"; `aria-label` "Voltar aos projetos".

## components/projetos/GalleryHeader.tsx
- Link "experiência ↗" apontava para `/`; agora `/experiencia`.

## components/projetos/ProjetoGridCard.tsx
- Alt "— preview" → "Topo da página inicial do site {Cliente}".

## components/case/CaseScreens.tsx
- Telas do site deixam de ser `alt=""`/`aria-hidden`; alt "{Cliente} — tela N do site".

## components/case/CaseHero.tsx · components/ui/Reveal.tsx
- Atributo `data-reveal` (alvo do fallback `<noscript>`).

## components/site/Hero.tsx
- Espaços entre os blocos do H1 → `textContent` "Coded by M Web Design". Sem mudança visual.

## data/landings.ts
- `ogImage` da `/lp/arquitetura` → `/og/lp/arquitetura.jpg`.

## scripts/build-og-images.py (novo) · public/og/** (novo)
- Gera 10 imagens 1200×630: home, projetos, experiência, LP arquitetura e uma por case publicado.

## docs/seo/*.md (novo)
- `SEO-AUDIT.md`, `SEO-IMPLEMENTATION.md`, `SEO-CONTENT-STRATEGY.md`, este changelog.

## Não alterado (de propósito)
- `app/robots.ts`: já permite tudo, inclusive `OAI-SearchBot`; nenhuma regra de `GPTBot` existia e nenhuma foi criada.
- Noindex de `/lp/*`, `/lab`, `/ui-lab`, `/posts/*`.
- URLs existentes (nenhuma rota indexada mudou de endereço).
- Copy visual do hero, serviços, processo e sobre.

---

# Passada 2 — 2026-09-30

## components/case/CaseHero.tsx
- Breadcrumb visível (Início / Projetos / Cliente); pôster passado ao `CaseFrameScroll`.

## components/case/CaseReturnCTA.tsx · app/cases/[slug]/page.tsx
- "Próximo: {Cliente} →" no fim do case, na ordem da vitrine.

## components/case/CaseFrameScroll.tsx · components/case/LiveScreenshot.tsx
- Prop `poster`: primeiro quadro leve, `fetchpriority="high"`, atrás do print.

## data/cases.ts · types/case.ts
- `preview.top` em todos os cases publicados; Maison aponta para o `.webp` reduzido.

## scripts/build-case-posters.py (novo) · public/cases/*/desktop-top.webp (novo)
- Gera os pôsteres. Maison `desktop-tall.jpeg` (3 MB) → `desktop-tall.webp` (426 KB).

## components/home/LogoIntro.tsx
- Selo "Coded by M" da `/experiencia` vira `<h1>` (mesmo visual).

## components/zones/CTASection/Footer.tsx
- Ano do © dinâmico.

Reason: navegação e contexto entre cases; LCP do hero do case; título na experiência.
