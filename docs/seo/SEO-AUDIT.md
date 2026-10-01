# SEO / AEO / GEO Audit — codedbym.com

Data: 2026-09-30 · Escopo: repositório `cbm-port` (Next.js 14) + produção `https://www.codedbym.com`
Método: leitura do código, build local, inspeção do HTML servido em produção (`curl`) e do build local (`next start`).
Sem acesso a Search Console, GA4 ou ferramentas de volume de busca — nenhum número de tráfego, volume ou posição aparece aqui.

---

## Executive Summary

A base técnica é boa: o site é estático (SSG) na Vercel, o conteúdo principal chega no HTML do servidor,
o robots está aberto, existe sitemap, as páginas internas e de campanha estão em `noindex` de propósito,
e há canonical nas rotas públicas. Nada bloqueava a indexação.

Os problemas estavam em três camadas:

1. **Higiene de indexação:** 4 URLs de case "em breve" respondiam **200 com página vazia** (`/cases/rota-clinica` etc.); o `lastmod` do sitemap era o horário do build.
2. **Entidade e compartilhamento:** **zero dados estruturados**; os cases herdavam o Open Graph da home (título e descrição errados ao compartilhar) e a imagem social era um print de página inteira de 1600×7729.
3. **Arquitetura e conteúdo:** a vitrine `/projetos` só era linkada pela experiência WebGL; a home concentra todas as intenções comerciais numa página só; o H1 da home não diz o que o estúdio faz; não há conteúdo que responda perguntas (preço, prazo, processo detalhado).

As camadas 1 e 2 foram corrigidas nesta passada. A camada 3 depende de decisões de negócio e de conteúdo (ver *Issues* e `SEO-CONTENT-STRATEGY.md`).

---

## Site Architecture

| Rota | Tipo | Renderização | Indexável | No sitemap |
|---|---|---|---|---|
| `/` | Home estática (conversão) | SSG | sim | sim |
| `/projetos` | Vitrine (grade filtrável) | SSG | sim | sim |
| `/cases/[slug]` ×6 publicados | Case | SSG | sim | sim |
| `/cases/[slug]` ×4 "em breve" | — | **agora 404** (antes 200 vazio) | não | não |
| `/experiencia` | Experiência WebGL (9 capítulos) | SSG + client canvas | sim | sim (prioridade baixa) |
| `/lp/[segmento]` (`arquitetura`) | Landing de tráfego pago | SSG | **noindex, nofollow** (decisão de negócio) | não |
| `/lab`, `/ui-lab`, `/posts/*` | Ferramentas internas | — | noindex | não |
| 404 | `app/not-found.tsx` (novo) | — | noindex (automático) | — |

Hospedagem: Vercel. `codedbym.com` e `http://` → 308 para `https://www.codedbym.com`. Barra final → 308 para a versão sem barra. HSTS ativo.

**Ponto estrutural:** o site é, na prática, *uma home + cases*. Serviços, processo e sobre são âncoras da home (`#servicos`, `#processo`, `#sobre`), não páginas. Isso limita o número de intenções de busca que o site consegue atender (ver *Content Gaps*).

---

## Technical SEO

| Item | Estado |
|---|---|
| Framework | Next.js 14.2 App Router, React 18, metadata API nativa |
| Conteúdo no HTML do servidor | Sim em `/`, `/projetos`, cases. `/experiencia` serve quase só o shell (canvas client-side) |
| Links | `<a>` reais (`next/link`) |
| Metadata no cliente | Não — tudo via `metadata` / `generateMetadata` |
| Analytics | GA4 (`G-Q83X8CQL3X`) + Meta Pixel **após consentimento**; Coded Insights (first-party) carregado sempre |
| Build / typecheck / lint | Passam (lint só com avisos `no-img-element` em componentes da experiência) |

---

## Indexability

| Verificação | Resultado |
|---|---|
| `robots.txt` | `User-Agent: * / Allow: /` + sitemap. Nenhum bloqueio |
| `noindex` acidental | Nenhum. `noindex` só onde é intencional (`/lp`, `/lab`, `/ui-lab`, `/posts`) |
| X-Robots-Tag | Ausente (ok) |
| Canonical | Presente em `/`, `/projetos`, `/experiencia`, `/cases/*`; absoluto, host `www` |
| www / http / barra final | Consistente, 308 para o canônico |
| Páginas vazias indexáveis | **Encontradas:** 4 cases "em breve" com 200 → **corrigido (404)** |
| Staging indexável | `SITE_URL` vem de env; previews da Vercel recebem `x-robots-tag: noindex` da própria Vercel |
| 404 | Status correto. Antes era a 404 padrão do Next → **página própria criada** |
| Redirect chains | Nenhuma encontrada (1 salto) |

---

## Metadata

Antes → depois:

| Página | Title antes | Title depois |
|---|---|---|
| `/` | Coded by M — Webdesign e websoftware sob medida | Coded by M — Criação de sites e landing pages sob medida |
| `/projetos` | Projetos · Coded by M | Projetos de sites e landing pages · Coded by M |
| case | Estúdio Lentz · Coded by M | Case Estúdio Lentz — Site Institucional Imersivo · Coded by M |
| `/experiencia` | A Experiência · Coded by M | (mantido) |
| 404 | (padrão) | Página não encontrada · Coded by M |

- "Websoftware" não é termo que alguém digita; "criação de sites" e "landing page" são (HIPÓTESE DE KEYWORD).
- Descriptions únicas por página; a dos cases já vinha do `description` de cada case (bom, específico).
- **Open Graph:** cases, `/experiencia` e a home agora declaram `og:url`, título, descrição e imagem 1200×630 próprios. Antes os cases compartilhavam como se fossem a home.
- Twitter card `summary_large_image` em todas as indexáveis.
- `lang="pt-BR"`, viewport padrão do Next, favicon `app/icon.svg`.

---

## Content

Ver revisão completa em `SEO-CONTENT-STRATEGY.md`. Resumo:

- **Forte:** os textos dos cases são específicos (setor, cidade, problema, decisão tipográfica, stack). O case MJ Engenharia é o melhor exemplo: problema regulatório real (CBMSC/PPCI), estrutura, público.
- **Fraco / genérico:** o case Machado Plataformas ("O que foi construído e por quê", "O problema não era o produto, era a percepção") lê como fórmula; não diz o que mudou no site. Os passos do processo ("Forma com intenção", "Construído pra durar") são slogans, não descrições.
- **Ausente:** preço, prazo, o que está incluso por tipo de projeto, como funciona manutenção, o que o cliente precisa entregar. São exatamente as perguntas que um contratante faz — e as que um mecanismo de resposta tentaria extrair.
- O WhatsApp promete "eu digo o que faria, quanto custa e em quanto tempo entrego" — o site não responde nenhuma das três antes do contato.

---

## Internal Linking

Antes:

```
/ ──► /cases/* (grade)       /experiencia ──► /projetos ──► /cases/*
/ ──► /experiencia (rodapé)  /cases/* ──► /#projetos (botão "Paisagem")
/projetos ──► / (logo) e "experiência" que apontava para / (bug)
```

`/projetos` não era alcançável a partir da home nem dos cases.

Depois:

- Rodapé (home e experiência) ganhou **Projetos → /projetos**.
- Fim do case: **"← Todos os projetos" → /projetos** (antes "Voltar à Paisagem" → `/#projetos`).
- Botão fixo do case: rótulo "Paisagem" → "Projetos" (o nome "Paisagem" era da home WebGL antiga).
- Cabeçalho da vitrine: "experiência ↗" agora aponta para `/experiencia`.

Passada 2: breadcrumb visível e "Próximo: {Cliente} →" no fim de cada case. Ainda falta: case → página do serviço correspondente (depende das páginas de serviço).

---

## Structured Data

Antes: nenhum. Depois (JSON-LD, gerado no servidor, `lib/seo.ts`):

| Página | Grafo |
|---|---|
| Todas | `ProfessionalService` (#organization) + `Person` (#founder) + `WebSite` (#website) |
| `/` | `WebPage` |
| `/projetos` | `CollectionPage` com `ItemList` dos cases + `BreadcrumbList` |
| `/cases/*` | `WebPage` + `CreativeWork` (criador = organização, `about` = cliente pelo nome, `url` = site no ar, `dateCreated` = ano exibido) + `BreadcrumbList` |

Regras seguidas: só dados visíveis no site. **Sem** rua, avaliações, preço, horário ou redes não confirmadas.
`sameAs` contém só o Instagram — o LinkedIn do menu retornou **404** em 2026-09-30 e o GitHub não teve a titularidade confirmada.
`FAQPage` **não** foi usado: não existe FAQ publicado e indexável (o da `/lp` é rascunho e a rota é noindex).

---

## Performance

| Rota | First Load JS |
|---|---|
| `/` | 141 kB |
| `/projetos` | 106 kB |
| `/cases/*` | 103 kB |
| `/experiencia` | 123 kB (+ chunks 3D sob demanda) |

- Home não importa `three` (o rodapé carrega a paisagem por `dynamic(ssr:false)` e congela fora de vista).
- Fontes auto-hospedadas, 3 pesos com `preload`.
- **Risco de LCP no case:** o hero do case rola o `preview.desktop` (prints de página inteira, ex. 1600×7729 webp; pasta `maison-etoile` tem 6,3 MB). Não foi alterado — mexe na peça visual principal do case. Recomendado: versão recortada para o primeiro quadro + carga progressiva.
- CLS: imagens da grade com `width/height`; telas do case com `aspect-ratio` fixo.
- Nada foi removido ou simplificado por métrica.

---

## Accessibility

- Hierarquia de headings correta na home (1 H1 → H2 por seção → H3 por item), na vitrine e nos cases.
- O H1 da home é desenhado em SVG com `role="img"` + `aria-label` por palavra; o `textContent` saía colado ("Codedby MWeb Design") → **espaços adicionados entre os blocos** (sem efeito visual).
- Telas do case estavam como `alt=""` + `aria-hidden` embora sejam o conteúdo da página → agora descritas.
- `Reveal` deixava conteúdo em `opacity:0` sem JavaScript → fallback `<noscript>` adicionado.
- `/experiencia` não tem H1 no HTML do servidor.

---

## SEO

Fundamentos ok depois desta passada. O teto agora é **arquitetura e conteúdo**: uma home tentando ranquear para "landing page", "site institucional" e "aplicação web" ao mesmo tempo, sem uma página dedicada para nenhuma.

## AEO

Nenhuma pergunta do contratante é respondida em formato extraível (pergunta → resposta direta). As candidatas óbvias (quanto custa, quanto tempo, o que inclui, landing page ou institucional, manutenção) **dependem de dados que só o negócio tem** — NECESSITA INFORMAÇÃO DO NEGÓCIO.

## GEO

| Critério | Avaliação |
|---|---|
| Extractability | Média. Cases têm parágrafos autocontidos; home tem frases de efeito curtas |
| Attribution | Boa agora: organização, fundador e autoria dos cases ligados por `@id` |
| Entity clarity | Boa: nome, cidade, serviços e contato consistentes entre HTML, metadata e schema |
| Evidence | Média: 6 sites no ar e linkados é prova forte; faltam resultados/depoimentos reais |
| Freshness | Baixa: sem datas além do ano do case; "Agenda 2026" e "© 2026" fixos no código |
| Information gain | Baixa fora dos cases: não há conteúdo próprio (método detalhado, decisões, comparações) |

## ChatGPT Search Readiness

| Checklist | Estado |
|---|---|
| Site público, sem login | ✅ |
| `OAI-SearchBot` permitido | ✅ (coberto por `User-Agent: *` / `Allow: /`) |
| `GPTBot` | Nenhuma regra — **preservado como está**, sem decisão tomada aqui |
| CDN/firewall bloqueando bots | Nenhuma configuração no repo (Vercel padrão). Verificar *Firewall / Bot Protection* no painel da Vercel |
| Conteúdo textual no HTML sem JS | ✅ home, vitrine, cases (crawlers de IA geralmente não executam JS) |
| Canonical / metadata | ✅ |
| Entidade e atribuição | ✅ JSON-LD |
| Informação verificável | ✅ sites dos cases no ar e linkados |

---

## Content Gaps

| Situação | Item |
|---|---|
| EXISTE E ESTÁ BOM | Cases MJ Engenharia, Estúdio Lentz, Maison Étoile; vitrine `/projetos` |
| EXISTE E PRECISA MELHORAR | H1 da home; case Machado (genérico); descrição do processo; seção Sobre (sem foto, sem trajetória concreta) |
| NÃO EXISTE E SERIA IMPORTANTE | Páginas de serviço (landing page, site institucional, aplicação web); respostas de preço/prazo/escopo; página Sobre/fundador |
| NÃO VALE CRIAR | Páginas por cidade; blog em volume; `llms.txt` agora; FAQ genérico sem dados reais |

## Keyword Opportunities

Ver tabela em `SEO-CONTENT-STRATEGY.md` → *Search Intent Map*. Todas marcadas como **HIPÓTESE DE KEYWORD** — sem fonte de volume.

---

## Issues

| ID | Issue | Priority | Impact | Effort | Risk | Status |
|---|---|---|---|---|---|---|
| SEO-001 | 4 cases "em breve" respondiam 200 com página vazia e indexável | P1 | alto | baixo | baixo | ✅ corrigido |
| SEO-002 | Cases herdavam OG da home; imagem social 1600×7729 | P1 | médio | baixo | baixo | ✅ corrigido |
| SEO-003 | Nenhum dado estruturado | P1 | médio | baixo | baixo | ✅ implementado |
| SEO-004 | `/projetos` quase órfã (só linkada pela experiência) | P1 | médio | baixo | baixo | ✅ corrigido |
| SEO-005 | Title genérico ("websoftware"); case sem tipo no título | P2 | médio | baixo | baixo | ✅ corrigido |
| SEO-006 | `lastmod` do sitemap = horário do build | P2 | baixo | baixo | baixo | ✅ corrigido |
| SEO-007 | Sem página 404 própria | P2 | baixo | baixo | baixo | ✅ implementado |
| SEO-008 | Link "experiência" da vitrine apontava para `/` | P2 | baixo | baixo | baixo | ✅ corrigido |
| SEO-009 | OG da `/lp/arquitetura` era print de página inteira | P2 | médio (campanha) | baixo | baixo | ✅ corrigido |
| SEO-010 | Telas do case sem alt; alt "— preview" pouco descritivo | P3 | baixo | baixo | baixo | ✅ corrigido |
| SEO-011 | Conteúdo invisível sem JS (`Reveal`) | P3 | baixo | baixo | baixo | ✅ corrigido |
| SEO-012 | `textContent` do H1 colado ("Codedby M") | P3 | baixo | baixo | baixo | ✅ corrigido |
| SEO-013 | H1 da home não diz o que o estúdio faz | P1 | alto | baixo | médio (copy da marca) | ✅ categoria do H1: "Sites e landing pages" (passada 3) |
| SEO-014 | Sem páginas de serviço | P1 | alto | alto | médio | ⏸ requer aprovação + conteúdo |
| SEO-015 | Sem respostas para preço/prazo/escopo | P1 | alto | médio | baixo | ⏸ sem preço público (decisão: "preço justo"); prazo ainda em aberto |
| SEO-016 | LinkedIn do menu retorna 404; GitHub não confirmado | P1 | médio (confiança) | baixo | baixo | ✅ LinkedIn removido (não existe); GitHub no `sameAs` |
| SEO-017 | Cases em `*.vercel.app` apresentados como entregas | P1 | alto (confiança) | baixo | alto se errado | ✅ 4 marcados como conceituais em todo o site (passada 3) |
| SEO-018 | Case sem "próximo projeto" e sem breadcrumb visível | P2 | médio | médio | baixo | ✅ implementado (passada 2) |
| SEO-019 | `/experiencia` sem H1 e quase sem texto no HTML do servidor | P2 | baixo | baixo | baixo | ✅ H1 implementado; texto segue curto |
| SEO-020 | Hero do case carrega print de página inteira (LCP) | P2 | médio | médio | médio (visual) | ✅ pôster leve + Maison 3 MB → 426 KB |
| SEO-021 | Sobre sem foto e sem página própria (E-E-A-T) | P2 | médio | médio | baixo | ⏸ requer material |
| SEO-022 | Search Console / Bing Webmaster sem evidência de configuração | P2 | alto (medição) | baixo | baixo | ⏸ ação externa |
| SEO-023 | Textos com data fixa ("Agenda 2026 limitada", "© 2026") | P3 | baixo | baixo | baixo | ✅ © dinâmico; "Agenda 2026" é afirmação comercial, fica com você |
| SEO-024 | Coded Insights carrega antes do consentimento (LGPD, não SEO) | P3 | — | baixo | baixo | 📋 registrar |
| SEO-025 | `llms.txt` ausente | P3 | baixo | baixo | baixo | OPCIONAL / EXPERIMENTAL — não criado |
| SEO-026 | IndexNow | P3 | baixo | baixo | baixo | opcional — não implementado |
