# Landing comercial `/criacao-de-sites`

**Versão:** 2026-11-17 · **Branch:** `feat/lp-criacao-de-sites-v2` · **Status:** pronta para revisão, não publicada.

Substitui a landing anterior (crítica de 27/40 no celular). Publicar e ligar campanha dependem da
aprovação do Matheus.

## Fontes usadas

- Documento de persona (`Persona-Coded-by-M.docx`, com a análise de mercado).
- Crítica da versão anterior (`.impeccable/critique/2026-11-17…`).
- Spec da landing de Google Ads (`docs/superpowers/specs/2026-11-05-lp-google-ads-design.md`).
- Dados já publicados no site: `data/servicePages.ts`, `data/cases.ts`, `data/clientProof.ts`.

**Não encontrado:** o documento de pesquisa citado no briefing (referências visuais e critérios
técnicos). Sem ele, os critérios técnicos usados foram os limites públicos de Core Web Vitals
(LCP até 2,5 s, INP até 200 ms, CLS até 0,1, no percentil 75 de usuários reais) e WCAG 2.2 AA. A
direção visual saiu da identidade da marca (`DESIGN-LANGUAGE.md`), não de referências externas.

## Estratégia

1. **Público:** dono ou sócio de PME de serviço técnico ou indústria, 35 a 50 anos, Grande
   Florianópolis e SC primeiro. Compara fornecedores no celular à noite e no computador de dia.
2. **Problema:** a empresa é boa e o site parece de empresa menor. Já teve fornecedor que atrasou ou
   sumiu com os acessos.
3. **Promessa:** um site à altura da empresa, feito por uma pessoa só, com valor e prazo fechados
   antes de começar e tudo no nome do cliente.
4. **Razões para acreditar:** três sites de clientes no ar; 181 cliques no WhatsApp medidos na
   Machado; contrato e nota fiscal; layout aprovado antes do código; domínio, código e acessos do
   cliente; painel de visitas.
5. **Objeções:** "é só bonito?", preço contra site de modelo pronto, estúdio de uma pessoa, poucos
   clientes reais, custo total e pós-entrega, contratar à distância.
6. **Ação:** pedir orçamento no WhatsApp, com mensagem pronta que diz o tipo de projeto.

| Seção | Dúvida que responde | Argumento | Prova | Ação |
|---|---|---|---|---|
| Abertura | É para mim? O que vendem? | A empresa já entrega qualidade, o site precisa mostrar | Site da Machado em computador e celular, com o resultado medido | Pedir orçamento; atalhos para projetos e investimento |
| Projetos | Tem cliente de verdade? É só bonito? | Cada decisão de tela serve a quem compra | 3 sites com cotas numeradas, endereço no ar, página inteira; conceitos rotulados | Abrir o site; pedir orçamento |
| Situações | Resolve o meu caso? | Cinco situações do dono e o que muda | Remete aos sites acima e ao que é entregue | sem CTA |
| O que entra | O que recebo? E o que não? | Sete itens em linguagem comum, mais o que fica de fora | Itens já publicados nas páginas de serviço | sem CTA |
| Processo | Quanto do meu tempo? Onde aprovo? | Quatro etapas com a parte do cliente | Contrato antes de começar, layout aprovado antes do código | sem CTA |
| Quem faz | Quem é? E se sumir? | Fala com quem faz; nada fica preso | Perfil no Google, Instagram, três garantias | Conferir perfis |
| Investimento | Quanto custa no total? | Pisos, o que muda o valor, custos depois | Valores e prazos de `PUBLIC_PRICE` | Pedir orçamento |
| Dúvidas | Objeções que sobraram | Respostas diretas, inclusive os "não" | Fatos publicados | sem CTA |
| Contato | O que acontece quando eu clicar? | Três passos e escolha do tipo de projeto | Identificação do estúdio no rodapé | WhatsApp |

## Decisões

- **Título mantido:** "Sua empresa já entrega qualidade. Seu site precisa mostrar isso." Começa
  reconhecendo o que o dono fez e só depois aponta a lacuna. A linha acima do título diz o que é
  vendido e onde, porque o título sozinho não diz "criação de sites".
- **Preço fora da primeira tela.** A análise de mercado avisa que o piso sozinho pode parecer amador.
  O piso aparece na seção Investimento, sempre com tamanho, prazo e o que muda o valor. A abertura
  tem um atalho "Ver investimento". Isto é uma hipótese a validar (ver abaixo).
- **Links para os sites dos clientes.** A versão anterior não tinha, e a crítica apontou "prova sem
  verificação". Abrem em nova aba e são medidos (`project_open`).
- **Ideia visual: prancha de conferência.** Página escura como mesa de luz, sites dos clientes como
  objetos claros, cotas numeradas que ligam um detalhe da tela a um argumento. Vermelho só no CTA,
  na cota ativa e no foco. Investimento em superfície off-white, como proposta impressa.
- **Passe "mais ousada" (2026-11-18).** A página deixava de fora os recursos mais fortes da marca
  que a home usa. Entraram: título no corpo de display (até 76px; antes 36px, menor que os H2),
  régua de micro-labels no topo e em cada seção (`SECTION_RULES`, com contagens tiradas dos
  dados), terreno triangulado em SVG estático na abertura e no contato (`Terrain.tsx`, sem WebGL,
  uma face vermelha), numerais vazados nas pranchas e nas etapas, o "181" em display na abertura
  e na prancha da Machado, e os preços em display. Copy e estrutura não mudaram. O CTA continua
  na primeira tela de 320×640 a 1920×1080.
- **Sem formulário.** O canal de venda é a conversa. Um formulário sem backend seria retorno falso.
- **Sem WebGL nesta rota.** O 3D do estúdio aparece nos projetos conceituais, que a pessoa pode abrir.
- **`noindex` mantido.** A página recebe clique pago e competiria com `/` e `/site-institucional`.
- **Voz:** primeira pessoa do singular na página inteira (a crítica apontou mistura de "vocês" e "eu").
- **Sem jargão:** "handover", "CMS", "deploy", "design system" e "dados estruturados" saíram.

## Arquivos

| Arquivo | Papel |
|---|---|
| `app/criacao-de-sites/page.tsx` | Rota, metadados e ordem das seções |
| `app/criacao-de-sites/landing.css` | Estilos da rota (prefixo `cs-`), só carregados aqui |
| `data/criacaoDeSites.ts` | Toda a copy e a estrutura; preços vêm de `PUBLIC_PRICE` |
| `components/landing/*` | Cabeçalho, abertura, projetos, seções, contato e rodapé |
| `scripts/build-lp-shots.py` | Gera `mobile-top.webp` dos três clientes |
| `lib/analytics.ts`, `components/analytics/Analytics.tsx` | Eventos `cta_click` e `project_open` |
| `lib/site.ts` (`LEGAL`) | Razão social e CNPJ do rodapé, quando informados |

`components/lp/LpBlocks.tsx`, `LpHeroWall.tsx` e `data/landings.ts` (`LANDING`) ficaram como estavam:
ainda são usados pelo `/lab/revisao` e pelo design-sync. Podem sair depois do envio ao Claude Design.

## Medição

O funil tem seis etapas. O site mede as duas primeiras. As outras quatro acontecem na conversa e
precisam de registro comercial.

| Etapa | O que é | Onde é medida | Estado |
|---|---|---|---|
| Clique no CTA | Clique em qualquer botão de ação | GA4 `cta_click` (`cta_id`, `cta_dest`); Insights `cta.click` | Implementado |
| Clique no WhatsApp | Clique em link que abre o WhatsApp | GA4 `whatsapp_click` (`location`); Insights `whatsapp_click`; Meta `Contact`; Google Ads (conversão de clique) | Implementado |
| Contato confirmado | Mensagem recebida de fato | Conversa no WhatsApp | Registro manual |
| Lead qualificado | Empresa com projeto no escopo e verba compatível | Critério do Matheus | Registro manual |
| Proposta | Proposta enviada com valor e prazo | Registro comercial | Registro manual |
| Contrato | Contrato assinado; valor e margem | Registro comercial | Registro manual |

**Um clique no WhatsApp não é uma conversa.** A pessoa pode fechar o aplicativo sem enviar. Por isso:

- O GA4 deixou de receber `generate_lead` no clique. Fica só `whatsapp_click`.
- A Meta passou a receber `Contact` no lugar de `Lead`.
- A conversão do Google Ads continua no clique, e deve se chamar "Clique no WhatsApp" na conta.

Essas duas mudanças valem para o site inteiro, não só para a landing. Se alguma campanha da Meta
estiver otimizando para `Lead`, ela deixa de receber o evento no próximo deploy: conferir antes de
publicar. Para voltar atrás, restaurar o bloco de `whatsapp_click` em `lib/analytics.ts`.

### Identificadores

`cta_id` e `location`: `lp-header`, `lp-hero`, `lp-projetos`, `lp-investimento`,
`lp-contato-institucional`, `lp-contato-landing`, `lp-contato-indefinido`, `lp-contato-numero`,
`lp-footer`. Âncoras: `lp-hero-projetos`, `lp-hero-investimento`. O tipo de projeto escolhido vai no
próprio identificador, sem parâmetro novo.

`project_open`: slug do projeto (`machado-plataformas`, `mj-engenharia`, `valdete-costuras`,
`estudio-lentz`, `nord-arch`, `stige`).

Nenhum parâmetro leva telefone, e-mail ou texto digitado. Duplo clique no mesmo link conta uma vez.
GA4, Meta e Google Ads só carregam depois do aceite de cookies. O Coded Insights conta todos, sem
cookie.

### Como ligar o clique ao contrato

1. A mensagem do WhatsApp identifica a página e o tipo de projeto, e termina com
   `(origem: <utm>)` quando a URL do anúncio tem `utm_campaign` ou `utm_content`.
2. Para cada conversa recebida, anotar: data, origem (o texto entre parênteses), tipo de projeto,
   qualificado (sim ou não, e por quê), proposta (data e valor), contrato (data, valor, margem).
   Uma planilha com essas colunas basta para começar.
3. Taxas a acompanhar: contatos confirmados por clique no WhatsApp; qualificados por contato;
   propostas por qualificado; contratos por proposta; margem por contrato.

### Depende de integração

- **Google Ads:** definir `NEXT_PUBLIC_GOOGLE_ADS_ID` e `NEXT_PUBLIC_GOOGLE_ADS_WA_LABEL` em produção
  e validar com o Tag Assistant. Sem elas, nenhuma conversão é enviada.
- **Conversão offline no Google Ads** (contrato atribuído ao clique no anúncio): exige guardar o
  `gclid` de cada lead. Hoje o `gclid` não entra na mensagem, por decisão anterior. Sem isso, o Ads
  otimiza para clique, não para contrato.
- **GA4:** registrar `cta_click`, `whatsapp_click` e `project_open` como eventos; marcar só
  `whatsapp_click` como evento-chave, sabendo que ele é clique.
- **Consentimento:** quem recusa ou ignora o banner não aparece no GA4, na Meta nem no Ads. A
  diferença para o Coded Insights mostra o tamanho dessa perda.

## Verificações (2026-11-17)

Build de produção local (`next build` e `next start`), Chromium via Playwright.

- 56 verificações automáticas passaram: eventos com e sem consentimento, duplo clique, UTM na
  mensagem, âncoras, "ver a página inteira", seletor de tipo por teclado, ordem e contorno de foco,
  rolagem horizontal em 320, 360, 390, 768, 1024, 1440 e 1920 px, CTA em uma linha e dentro da
  primeira tela, alvos de toque de 44 px, contraste AA de todo texto, movimento reduzido e página
  sem JavaScript.
- `npm run typecheck`, `npm run lint` (sem erros) e `npm run build` passam. 35 testes de `scripts/`.
- **Laboratório, celular** (390 px, CPU 4x mais lenta, rede 1,6 Mbps e 150 ms, mediana de 3):
  LCP 1,1 s, CLS 0, TBT 44 ms, pior interação medida 64 ms, 452 KB em 30 requisições.
- **Laboratório, desktop** (1440 px, rede 10 Mbps, mediana de 3): LCP 0,3 s, CLS 0.

São números de laboratório, em `localhost`, sem CDN e com terceiros bloqueados. Não são dados de
usuários reais: o LCP, o INP e o CLS de verdade só existem depois da publicação, no relatório de
Core Web Vitals do Search Console ou no CrUX, e a página `noindex` com pouco tráfego pode nem
aparecer lá. Não foram testados: Safari no iPhone, leitor de tela real e o envio da conversão ao
Google Ads (não há ID configurado).

## Pendências que dependem do Matheus

| # | Pendência | Efeito na página hoje |
|---|---|---|
| 1 | **Piso da landing page:** a persona diz R$ 600, o site diz R$ 800 | Página usa R$ 800 (`PUBLIC_PRICE`) |
| 2 | **Prazo:** a persona diz cerca de 20 dias úteis; o site diz a partir de 5 (landing) e de 15 (institucional) | Página usa 5 e 15 |
| 3 | **CNPJ e razão social** | Rodapé mostra só "Coded by M, estúdio de Matheus Mendes. Florianópolis, SC." |
| 4 | **Foto do Matheus** | Seção "Quem faz" sem imagem; entra sozinha ao preencher `ABOUT.founder.photo` |
| 5 | **Depoimentos autorizados** | Nenhum na página; `CLIENT_PROOF` aceita `quote` e `author` |
| 6 | **Parcelamento:** em quantas vezes, cartão ou Pix | Página diz só "Dá para parcelar" |
| 7 | **Hospedagem inclusa:** por quanto tempo, e quanto custa depois | Página diz "incluídos no valor do projeto", sem período |
| 8 | **Plano mensal:** valor ou faixa | Página diz "o valor depende do serviço" |
| 9 | **"Respondo no mesmo dia com valor e prazo":** vale à noite e no fim de semana? | Frase mantida como já estava publicada |
| 10 | **Videochamada:** confirmar que é oferecida | Citada em "Quem faz" e em uma dúvida, a partir da persona |
| 11 | **"Enviar os textos e as fotos que ainda faltarem"** como parte do cliente na programação | Citado no processo; confirmar |
| 12 | **MJ Engenharia em `mj-engenharia-flame.vercel.app`:** tem domínio próprio? | Página mostra o endereço atual |
| 13 | **Resultado da MJ e da Valdete** | Só a Machado tem número |
| 14 | **Evento da Meta:** alguma campanha otimiza para `Lead`? | Ver "Medição" |
| 15 | **Documento de pesquisa** | Não chegou; ver "Fontes usadas" |
| 16 | **Texto de `/privacidade`** | Ajustado para citar os novos cliques; segue sendo rascunho sem revisão jurídica |

## Hipóteses para validar com compradores

1. **Preço fora da primeira tela filtra menos, mas não espanta quem valoriza design.** Medir a taxa
   de `lp-hero-investimento` e a proporção de contatos que perguntam só o preço. Se a maioria dos
   contatos for de curioso de preço, levar o piso para a abertura.
2. **Abrir o site do cliente aumenta a confiança em vez de tirar a pessoa da página.** Comparar a
   taxa de clique no WhatsApp entre quem disparou `project_open` e quem não disparou.
3. **O título fala com quem já tem empresa estruturada.** Perguntar nas primeiras conversas o que fez
   a pessoa chamar. Alternativa a testar: "Sua empresa é maior do que o site dela mostra."
4. **Dizer que o estúdio é novo e solo gera mais confiança do que esconder.** Observar se a objeção
   "é só você?" aparece menos nas conversas vindas da página.
5. **Escolher o tipo de projeto antes do clique melhora a conversa.** Comparar a proporção de
   qualificados entre `lp-contato-*` e os outros CTAs.
6. **Três clientes reais bastam para a persona de ticket alto, se der para conferir.** Se a objeção
   "tem mais experiência?" for frequente, a prioridade passa a ser depoimento e resultado da MJ e da
   Valdete, não mais design.

O desempenho da página se mede em contatos qualificados, contratos e margem, não na entrega dela.
