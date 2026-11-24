# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Dono de pequena e média empresa** (35 a 50 anos), desconfiado, que compara portfólios e decide pelo celular. A venda é consultiva e acontece no WhatsApp.
- **Quem escaneia o QR do cartão de visita** (confirmado em 2026-11-24): na maioria, alguém que **nunca falou com o Matheus**, porque o cartão foi deixado em balcões, murais e parceiros, ou alguém que **recebeu o cartão por indicação** de um cliente. Abre no celular, frio, sem contexto, com pouca atenção.

## Product Purpose

Coded by M é um estúdio independente de Florianópolis que cria sites e landing pages sob medida, do zero, com código próprio. O site é portfólio: mostra o padrão de execução e abre a conversa.

Para a `/projetos` aberta pelo cartão, sucesso é **a pessoa ficar impressionada e lembrar do estúdio**. A conversa vem depois; a página não empurra contato na cara, mas deixa o caminho à mão.

## Positioning

Estúdio de web design premium para PME: execução acima do padrão do mercado, com uma pessoa só do começo ao fim (atendimento direto com quem projeta e programa). Não é agência genérica, freelancer barato, template adaptado nem estúdio puramente artístico desconectado de resultado.

## Operating Context

- O QR do cartão impresso aponta para `/projetos?utm_source=cartao&utm_medium=print`. **A URL não pode mudar** (cartão já impresso).
- `/` é o portfólio cinematográfico; `/criacao-de-sites` é a única landing (tráfego pago, noindex). Páginas de serviço foram removidas e não voltam.
- Contato: WhatsApp (`lib/contact.ts`), Instagram @codedbymstudio. Existe vCard em `/contato.vcf`.
- Tracker próprio lê `data-cm-section`, `data-cm-role`, `data-cm-id`.

## Capabilities and Constraints

- Next.js 14 (App Router), React 18, three.js disponível; páginas comerciais renderizadas no servidor (SEO). Metadata e JSON-LD da `/projetos` são preservados.
- Serviços: landing page (a partir de R$ 800), site institucional (a partir de R$ 1.500), aplicações web. Não faz loja virtual, logotipo nem gestão de anúncios.
- Todo projeto tem contrato e nota fiscal; layout ajustado até aprovação; todo cliente recebe o Coded Insights (painel de visitas); dá para parcelar.

## Brand Commitments

- Nome: Coded by M. Fundador: Matheus Mendes. Símbolo: triângulo vermelho em contorno.
- Voz: primeira pessoa, direta, sem jargão de agência. Português do Brasil.
- Projetos conceituais são sempre identificados como conceituais.
- Nunca escrever "sem anúncio" nem "antes/depois" sobre a Machado.

## Evidence on Hand

- Clientes reais no ar: Machado Plataformas, MJ Engenharia, Valdete Costuras.
- Conceituais: Estúdio Lentz, Stige, Nord Arch, Café Aroma, Maison Étoile, Atelier Forma Viva, Estúdio Monteiro.
- Mídias em `public/cases/<slug>/` (capas 760×874, topo 1440×900, prints inteiros, mockups em alguns).
- **Curadoria da `/projetos` pelo cartão** (decisão do usuário em 2026-11-24): só os melhores designs, **Nord Arch e Machado Plataformas** mais um terceiro escolhido por qualidade de design.
- Ausentes, não inventar: depoimentos dos clientes (pendentes), foto do fundador, números de resultado validados.

## Product Principles

1. O trabalho é a prova: imagem real dos sites, grande e nítida, antes de qualquer texto.
2. Pouco e melhor: curadoria vence volume.
3. Quem chega frio precisa entender em segundos quem é e o que faz, sem esforço.
4. Ficar na memória vale mais que um clique agora; o contato fica à mão, sem pressão.
5. Celular primeiro: é onde o QR é escaneado.

## Accessibility & Inclusion

Contraste AA, alvos de toque de 44 px, respeito a "reduzir movimento", conteúdo legível sem JS.
