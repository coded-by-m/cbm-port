# Implementation

Passada de 2026-09-30. IDs batem com a tabela de *Issues* de `SEO-AUDIT.md`.
Validação comum: `npm run typecheck && npm run lint && npm run build`, depois `npx next start` e inspeção do HTML.

## Implemented

### SEO-001 — Cases "em breve" deixam de existir como página
Problema: `generateStaticParams` gerava rota para os 10 cases, inclusive os 4 `coming-soon` sem conteúdo. `/cases/rota-clinica` respondia 200 com título e mais nada.
Solução: só `status === "published"` gera rota; `dynamicParams = false`; `notFound()` para qualquer case não publicado. Os "em breve" continuam em `data/cases.ts` para a Paisagem desenhar o fragmento.
Arquivos alterados: `app/cases/[slug]/page.tsx`
Impacto esperado: nenhuma página fina indexável; orçamento de rastreio só em páginas reais.
Como validar: `curl -I https://www.codedbym.com/cases/rota-clinica` → 404.

### SEO-002 / SEO-009 — Open Graph próprio por página + imagens 1200×630
Problema: cases herdavam `og:title`/`og:description` da home; imagem social era `desktop-tall.webp` (1600×7729), que WhatsApp/LinkedIn recortam mal ou rejeitam. Mesmo problema na `/lp/arquitetura`.
Solução: `scripts/build-og-images.py` gera JPGs 1200×630 na identidade (fundo `#000F08`, Panchang/Satoshi convertidas de woff2, print do hero do site à direita) em `public/og/`. Cada rota indexável declara `openGraph` completo com `url`. O layout raiz deixou de declarar `og:url` (herdado, ele marcava `/lab` e a 404 como home).
Arquivos alterados: `scripts/build-og-images.py` (novo), `public/og/**` (novo), `app/layout.tsx`, `app/page.tsx`, `app/projetos/page.tsx`, `app/experiencia/page.tsx`, `app/cases/[slug]/page.tsx`, `data/landings.ts`, `lib/seo.ts`
Impacto esperado: preview correto ao compartilhar case/landing (WhatsApp é o canal de conversão).
Como validar: colar a URL no [Sharing Debugger da Meta](https://developers.facebook.com/tools/debug/) e no [Post Inspector do LinkedIn](https://www.linkedin.com/post-inspector/).
Manutenção: case novo → `python scripts/build-og-images.py` (requer `pillow fonttools brotli`).

### SEO-003 — Dados estruturados (JSON-LD)
Problema: nenhum schema; mecanismos precisavam inferir quem é o estúdio, onde atua e o que fez.
Solução: `lib/seo.ts` monta um grafo ligado por `@id`: `ProfessionalService` + `Person` (fundador) + `WebSite` em todas as páginas (layout); `WebPage` na home; `CollectionPage` + `ItemList` + `BreadcrumbList` na vitrine; `WebPage` + `CreativeWork` + `BreadcrumbList` nos cases. Componente `components/seo/JsonLd.tsx` (server, escapa `<`).
Arquivos alterados: `lib/seo.ts` (novo), `components/seo/JsonLd.tsx` (novo), `app/layout.tsx`, `app/page.tsx`, `app/projetos/page.tsx`, `app/cases/[slug]/page.tsx`
Impacto esperado: entidade clara para Google, Bing e mecanismos generativos; breadcrumbs elegíveis no resultado.
Como validar: [Rich Results Test](https://search.google.com/test/rich-results) e [Schema Markup Validator](https://validator.schema.org/) em `/`, `/projetos` e um case.

### SEO-004 / SEO-008 — Links internos para a vitrine
Problema: `/projetos` não era alcançável da home nem dos cases; o link "experiência" da vitrine ia para `/`.
Solução: item **Projetos** no rodapé; fim do case → "← Todos os projetos" (`/projetos`); botão fixo do case renomeado de "Paisagem" para "Projetos"; link da vitrine corrigido para `/experiencia`.
Arquivos alterados: `components/zones/CTASection/Footer.tsx`, `components/case/CaseReturnCTA.tsx`, `components/case/CaseBackButton.tsx`, `components/projetos/GalleryHeader.tsx`
Impacto esperado: vitrine rastreada e com autoridade interna; rota de navegação entre cases.
Como validar: home → rodapé → Projetos; case → fim da página → Todos os projetos.

### SEO-005 — Titles e descriptions
Problema: title da home usava "websoftware"; case tinha só o nome do cliente no título.
Solução: home "Coded by M — Criação de sites e landing pages sob medida"; vitrine "Projetos de sites e landing pages"; case "Case {Cliente} — {Tipo}". Strings da home centralizadas em `lib/seo.ts` (`HOME_TITLE`, `HOME_DESCRIPTION`).
Arquivos alterados: `app/layout.tsx`, `app/page.tsx`, `app/projetos/page.tsx`, `app/cases/[slug]/page.tsx`, `lib/seo.ts`
Impacto esperado: título que casa com a busca e diz o que a página entrega → CTR.
Como validar: ver `<title>` no HTML; acompanhar CTR por página no Search Console.

### SEO-006 — Sitemap honesto
Problema: `lastModified: new Date()` → toda URL "mudava" a cada deploy.
Solução: `lastModified` removido; ordem por importância; `/experiencia` com prioridade baixa (quase só canvas).
Arquivos alterados: `app/sitemap.ts`
Como validar: `/sitemap.xml` lista 9 URLs, todas 200 e canônicas.

### SEO-007 — Página 404
Solução: `app/not-found.tsx` com links para Início, Projetos e WhatsApp, nos tokens do site. Status 404 e `noindex` vêm do Next.
Como validar: `curl -I /qualquer-coisa` → 404; página com saída útil.

### SEO-010 — Alt text
Solução: telas do case agora descritas ("{Cliente} — tela N do site") em vez de `alt=""` + `aria-hidden`; miniatura da grade "Topo da página inicial do site {Cliente}".
Arquivos alterados: `components/case/CaseScreens.tsx`, `components/projetos/ProjetoGridCard.tsx`

### SEO-011 — Conteúdo visível sem JavaScript
Solução: `data-reveal` no wrapper animado do `Reveal` e no H1/descrição do hero do case; `<noscript><style>` no layout força o estado final.
Arquivos alterados: `components/ui/Reveal.tsx`, `components/case/CaseHero.tsx`, `app/layout.tsx`
Impacto: zero com JS ligado; sem JS, o conteúdo aparece em vez de ficar em opacidade zero.

### SEO-012 — Texto do H1 da home
Solução: espaço entre os blocos do H1 (não gera caixa entre elementos de bloco → sem mudança visual). `textContent` passa de "Codedby MWeb Design" a "Coded by M Web Design".
Arquivos alterados: `components/site/Hero.tsx`

### SEO-018 — Navegação entre cases (passada 2)
Solução: breadcrumb visível no topo do hero (Início / Projetos / Cliente), espelhando o `BreadcrumbList`; link "Próximo: {Cliente} →" no fim do case, na ordem da vitrine (o último volta ao primeiro).
Arquivos alterados: `components/case/CaseHero.tsx`, `components/case/CaseReturnCTA.tsx`, `app/cases/[slug]/page.tsx`

### SEO-019 — H1 na `/experiencia` (passada 2)
Solução: o selo "Coded by M" da tela de entrada virou `<h1>` com as mesmas classes (o preflight zera tamanho/peso do h1, então nada muda na tela).
Arquivos alterados: `components/home/LogoIntro.tsx`

### SEO-020 — LCP do hero do case (passada 2)
Problema: o quadro do hero mostra só o topo, mas nada aparecia até baixar o print inteiro (5–25 mil px de altura); o do Maison Étoile tinha 2880×24972 e 3 MB.
Solução: `scripts/build-case-posters.py` gera `desktop-top.webp` (primeiro quadro 16:10, 20–175 KB) por case; `preview.top` em `data/cases.ts`; `CaseFrameScroll` e `LiveScreenshot` pintam o pôster atrás do print com `fetchpriority="high"` — mesmos pixels no topo, sem salto. Print do Maison reduzido para 1440×12486 webp (426 KB); o jpeg antigo saiu do repo.
Arquivos alterados: `scripts/build-case-posters.py` (novo), `public/cases/*/desktop-top.webp` (novo), `public/cases/maison-etoile/desktop-tall.webp` (novo, substitui o `.jpeg`), `data/cases.ts`, `types/case.ts`, `components/case/CaseFrameScroll.tsx`, `components/case/LiveScreenshot.tsx`, `components/case/CaseHero.tsx`
Como validar: PageSpeed Insights num case, antes × depois (LCP mobile).
Manutenção: case novo → `python scripts/build-case-posters.py` e preencher `preview.top`.

### SEO-023 — Ano do rodapé (passada 2)
`© {ano atual}` com `suppressHydrationWarning` (o HTML estático leva o ano do build).
Arquivos alterados: `components/zones/CTASection/Footer.tsx`

### Extras de metadata
`applicationName`, `authors`, `creator` e `formatDetection.telephone=false` no layout raiz.

---

## Recommended but not implemented

### SEO-013 — H1 da home (requer aprovação de copy)
Hoje: "Coded by M / Web Design". A marca como enunciado é decisão de design (vários commits de hero). Opções que mantêm o desenho:
- trocar `HERO.lead` de "Web Design" por **"Sites e landing pages"** ou **"Web design e desenvolvimento"** (`data/home.ts`, 1 linha);
- ou manter e aceitar que o title/description carregam a intenção.
Não usar texto escondido para compensar.

### SEO-014 — Páginas de serviço
`/servicos/landing-pages`, `/servicos/sites-institucionais`, `/servicos/aplicacoes-web`. Cada uma com: para quem é, o que está incluso (já existe em `data/services.ts`), como funciona, prazo/faixa, cases do tipo (já tipados em `data/cases.ts` → `type`), perguntas frequentes reais, CTA WhatsApp com mensagem própria. Schema `Service` por página. Ver `SEO-CONTENT-STRATEGY.md`.

### SEO-015 — Preço, prazo, escopo
Precisa de números do negócio. Mesmo uma faixa ("a partir de", "entre X e Y semanas") já responde. Os `PREENCHER` de `data/landings.ts` são as mesmas perguntas.

### SEO-016 — Redes sociais
LinkedIn (`linkedin.com/company/codedbym`) retorna 404 e aparece no menu da home. Confirmar a URL certa ou remover; confirmar se `github.com/coded-by-m` é da Coded by M. Só então entram no `sameAs` (`lib/seo.ts`).

### SEO-017 — Natureza dos cases
MJ Engenharia, Maison Étoile, Forma Viva e Monteiro estão em domínios `*.vercel.app`. Se algum for projeto conceitual/de estudo e não cliente, isso precisa estar escrito no case (a home diz "Projetos entregues, no ar"). Afirmações sobre o cliente ("mais de 40 obras desde 2009") precisam ser do cliente. Confiança vale mais que volume de portfólio.

### SEO-022 — Search Console e Bing
Ação externa (ver `SEO-CONTENT-STRATEGY.md` → medição).

### SEO-025 — `llms.txt` (OPCIONAL / EXPERIMENTAL)
Não é fator de ranking nem é lido de forma consistente pelos mecanismos. Só faria sentido como índice curto (quem é, serviços, links dos cases) se surgir um uso concreto. Não substitui sitemap, robots, HTML ou schema. Não criado.

### SEO-026 — IndexNow (opcional)
Acelera a descoberta no Bing/Yandex. Com 9 URLs e deploys esporádicos, enviar o sitemap no Bing Webmaster Tools resolve.
