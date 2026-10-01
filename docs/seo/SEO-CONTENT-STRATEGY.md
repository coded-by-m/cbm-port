# Organic Content Strategy — Coded by M

Nenhum volume, CPC ou dificuldade aqui: não houve acesso a fonte de dados de busca.
Toda consulta listada é **HIPÓTESE DE KEYWORD**, para validar no Search Console depois de 2–3 meses de dados.

---

## Business Entity

```text
ENTIDADE PRINCIPAL: Coded by M — estúdio independente de web design e desenvolvimento
SERVIÇOS: Landing pages · Sites institucionais (5–12 páginas) · Aplicações web (dashboards, sistemas)
PÚBLICO: empresas que precisam de presença digital à altura do negócio. Na prova, 5 de 6 cases
         são do ambiente construído (arquitetura, interiores, engenharia) + 1 indústria
LOCALIZAÇÃO: Florianópolis, SC (declarado no hero e no rodapé; sem endereço público)
ÁREA DE ATUAÇÃO: NECESSITA INFORMAÇÃO DO NEGÓCIO (cases em SC e SP sugerem Brasil, remoto)
DIFERENCIAIS: código próprio, sem template; design system; motion/WebGL; performance/SEO técnico;
              estratégia → design → código → resultado com o mesmo responsável
PROVAS: 6 sites no ar e linkados (MJ Engenharia, Estúdio Lentz, Machado Plataformas,
        Maison Étoile, Atelier Forma Viva, Estúdio Monteiro); a própria /experiencia
CONVERSÃO PRINCIPAL: clique no WhatsApp (evento generate_lead / Lead)
CONVERSÕES SECUNDÁRIAS: clique em "ver site no ar" do case, Instagram, entrada na /experiencia
FUNDADOR: Matheus Mendes — Análise e Desenvolvimento de Sistemas
PREÇO / PRAZO / DEPOIMENTOS / RESULTADOS MENSURADOS: NECESSITA INFORMAÇÃO DO NEGÓCIO
```

---

## Search Intent Map

| Keyword/consulta | Intenção | Página ideal | Conteúdo atual? | Prioridade | Observação |
|---|---|---|---|---|---|
| coded by m / codedbym | marca | `/` | sim | P1 | Garantida pelo title + schema. Acompanhar no GSC |
| criação de sites florianópolis | comercial local | `/` (depois `/servicos/sites-institucionais`) | parcial | P1 | HIPÓTESE DE KEYWORD. "Florianópolis" só no eyebrow e rodapé |
| web designer florianópolis | comercial local | `/` + página Sobre | parcial | P1 | HIPÓTESE. Pede o rosto do fundador |
| landing page profissional | comercial | `/servicos/landing-pages` | não (só card na home) | P1 | HIPÓTESE |
| site institucional para empresa | comercial | `/servicos/sites-institucionais` | não | P1 | HIPÓTESE |
| site para escritório de arquitetura | comercial de nicho | página de serviço com recorte de nicho, indexável | só `/lp/arquitetura` (noindex) | P1 | HIPÓTESE. Ver nota sobre a LP abaixo |
| site para engenharia / empresa de engenharia | comercial de nicho | idem | case MJ | P2 | HIPÓTESE |
| quanto custa um site profissional | informacional → comercial | página de serviço (seção de preço) | não | P1 | HIPÓTESE. Exige número real |
| quanto tempo leva para fazer um site | informacional | página de serviço / processo | não | P2 | HIPÓTESE. Exige prazo real |
| landing page ou site institucional | informacional (comparação) | guia próprio ligando aos 2 serviços | não | P2 | HIPÓTESE. Ótimo formato de tabela |
| site sem template / site feito do zero | comercial | serviço institucional | parcial (LP) | P3 | HIPÓTESE |
| desenvolvimento de dashboard / sistema web sob medida | comercial | `/servicos/aplicacoes-web` | não | P3 | HIPÓTESE. Sem case publicado de webapp ainda — esperar a Rota Clínica |
| site com animação 3d / webgl | comercial de nicho | `/experiencia` + case Lentz | sim | P3 | HIPÓTESE. Público pequeno, mas diferencial forte |
| {nome do cliente} site | navegacional de terceiros | case | sim | P3 | Tráfego de quem procura o cliente; reforça autoridade |

**Nota sobre `/lp/arquitetura`:** o `noindex` foi decisão de negócio (evitar que uma página sem navegação compita com a home). Se o nicho virar estratégia orgânica, o caminho é uma **página de serviço de nicho indexável e navegável** (não tirar o noindex da LP), com conteúdo próprio: as dores da LP, os 3 cases de arquitetura, decisões específicas (peso de foto, portfólio por obra, CMS).

---

## Main Commercial Pages

```text
QUERY CLUSTER → INTENT → PAGE TYPE → CONTENT → CTA
```

| Página | Cluster | Conteúdo mínimo | CTA |
|---|---|---|---|
| `/` | marca + "criação de sites florianópolis" | o que faz (no H1 ou logo abaixo), para quem, prova, 3 serviços com link | WhatsApp |
| `/servicos/landing-pages` (NOVA) | landing page profissional | para quem é / não é, o que inclui (5 itens já existem), processo, prazo, faixa de preço, 2 cases landing (MJ, Maison Étoile), 3–5 perguntas reais | WhatsApp com mensagem "Interesse em Landing Page" (já existe em `data/services.ts`) |
| `/servicos/sites-institucionais` (NOVA) | site institucional | idem, cases Lentz, Machado, Forma Viva, Monteiro | WhatsApp |
| `/servicos/aplicacoes-web` (NOVA, depois) | sistema web sob medida | só quando houver case publicado | WhatsApp |
| `/projetos` | portfólio | ok | WhatsApp no rodapé |
| `/cases/*` | prova | ok; aprofundar (abaixo) | site no ar + WhatsApp |

---

## Supporting Content

Só depois das páginas de serviço. Poucos, com informação própria:

1. **Landing page ou site institucional: qual escolher** — tabela de comparação (objetivo, nº de páginas, prazo, quando cada um erra), apontando para os dois serviços e para um case de cada.
2. **Quanto custa um site profissional** — o que muda o preço (nº de páginas, conteúdo, integrações, motion), com a faixa praticada. Só com números reais.
3. **Como funciona um projeto com a Coded by M** — o processo de 4 etapas com o que acontece, o que o cliente entrega e o que recebe em cada uma (hoje são slogans de uma linha).

---

## Topic Clusters

```text
PILLAR  Criação de sites sob medida (home + serviços)
├── Landing pages            → /servicos/landing-pages
│   └── landing page ou site institucional (guia)
├── Sites institucionais     → /servicos/sites-institucionais
│   ├── quanto custa um site profissional (guia)
│   └── site para escritório de arquitetura (nicho, se virar estratégia)
├── Processo                 → como funciona um projeto (guia)
└── Prova                    → /projetos → /cases/*
```

Todo guia linka para o serviço; todo serviço linka para seus cases; todo case linka para o serviço do seu tipo.

---

## Questions / AEO

Perguntas que o próprio site já levanta ("eu digo o que faria, quanto custa e em quanto tempo") ou que a `/lp` lista:

| Pergunta | Onde responder | Resposta disponível? |
|---|---|---|
| Quanto custa? | serviço | **NECESSITA INFORMAÇÃO DO NEGÓCIO** |
| Quanto tempo leva? | serviço / processo | **NECESSITA INFORMAÇÃO DO NEGÓCIO** |
| O que está incluso? | serviço | Sim — `data/services.ts` → `includes` |
| Vou conseguir editar o site depois? | serviço institucional | Rascunho em `data/landings.ts` ("handover + CMS leve") — confirmar |
| E os meus textos e fotos? | serviço | Rascunho em `data/landings.ts` — confirmar |
| Precisa de manutenção / tem mensalidade? | serviço | **NECESSITA INFORMAÇÃO DO NEGÓCIO** |
| Landing page ou site institucional? | guia | Sim, dá para escrever com o que existe |

Formato: H2/H3 com a pergunta → 1–3 frases que respondem sozinhas → detalhe → exemplo/case. `FAQPage` em JSON-LD só quando o FAQ estiver visível e com respostas reais.

---

## Case Study Opportunities

Os cases já têm a estrutura certa (contexto, desafio, decisões, stack, telas, site no ar). Para ganhar profundidade sem inventar:

- **Machado Plataformas:** reescrever a visão geral com o que mudou de fato (antes × depois do site, o que a empresa pediu, que páginas/estrutura foram criadas). Hoje lê como fórmula.
- **Todos:** adicionar "O que o cliente pediu", "Decisões" (2–3 decisões concretas com o porquê), "O que foi entregue" (páginas, CMS, integrações) e, quando existir, **resultado real informado pelo cliente** ou depoimento autorizado.
- **Rota Clínica:** primeiro case de aplicação web; publicar destrava a página de serviço de aplicações.
- **Confirmar** quais são clientes e quais são projetos próprios/conceituais (SEO-017).

---

## GEO / Citation Opportunities

Trechos que valem ser escritos de forma citável (fato específico, atribuível à Coded by M):

- o processo com etapas, entregáveis e duração;
- a escala de capacidades já existe, mas como opinião; o que pesa mais é **como** cada coisa é feita (ex.: "fotos de obra tratadas em peso e recorte antes de publicar", "um só valor de progresso dirige a cena 3D do Lentz");
- a comparação landing × institucional em tabela;
- stack e decisões técnicas por case (já existe — manter).

Evitar: "presença digital à altura", "forma com intenção", "construído pra durar" como única informação de um bloco.

---

## Internal Linking Map

```text
/  ──► /projetos (rodapé) ──► /cases/*
│  ──► /cases/* (grade)
│  ──► /experiencia (rodapé)
│  ──► [/servicos/*]  (futuro: cards da seção Serviços)
/cases/* ──► /projetos ("Todos os projetos")  ──► /#projetos (botão fixo)
         ──► [próximo case] [serviço do tipo]   (recomendado)
/projetos ──► / (logo) ──► /experiencia (cabeçalho)
/experiencia ──► /projetos (landscape) ──► / (rodapé)
404 ──► / ──► /projetos
```

Anchor text: nomes do que está do outro lado ("Todos os projetos", "Landing pages"), nunca "clique aqui".

---

## Content Priorities

### Next 30 days
1. Responder SEO-016/017: redes oficiais e natureza dos cases.
2. Decidir o H1 da home (SEO-013).
3. Definir faixa de preço e prazo típicos por serviço.
4. Verificar domínio no Google Search Console e no Bing Webmaster Tools; enviar `sitemap.xml`.
5. Foto do fundador + parágrafo de trajetória com fatos.

### 30–90 days
1. Páginas `/servicos/landing-pages` e `/servicos/sites-institucionais`, com cases ligados por tipo.
2. Aprofundar os cases (seção de decisões e entrega); reescrever o Machado.
3. "Próximo projeto" e breadcrumb visível nos cases.
4. Guia "Landing page ou site institucional".
5. Primeira leitura de queries no GSC → ajustar titles/descriptions pelo CTR real.

### Later
1. Publicar Rota Clínica → `/servicos/aplicacoes-web`.
2. Página de nicho (arquitetura) indexável, se os dados do GSC/campanhas confirmarem a demanda.
3. Guias "quanto custa" e "como funciona um projeto".

---

## Medição

- **Search Console:** verificar o domínio (registro DNS na Vercel/registrador), enviar sitemap, acompanhar *Páginas* (indexação), *Resultados da pesquisa* (queries, CTR, posição por página) e *Core Web Vitals*.
- **GA4:** `generate_lead` já dispara no clique do WhatsApp (só com consentimento). Recomendado marcar `generate_lead` como **evento-chave** e acrescentar o parâmetro `page_location`/origem (já existe `event_label`). Eventos úteis a seguir, com a mesma nomenclatura do GA4: `whatsapp_click` (todos os pontos, com `cm-id`), `project_view` (abrir case), `outbound_click` para "site no ar".
- **Tráfego de IA:** no GA4, *Aquisição de tráfego* filtrando origem `chatgpt.com`, `perplexity.ai`, `copilot.microsoft.com`, `gemini.google.com`. O ChatGPT Search acrescenta `utm_source=chatgpt.com` nos links.
- **Não prometer posição.** Indicadores: páginas válidas indexadas, impressões, queries não-marca, CTR, cliques, leads orgânicos, referências de IA.
