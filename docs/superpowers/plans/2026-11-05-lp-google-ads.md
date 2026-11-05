# Landing de Google Ads: plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** publicar `/lp/site-para-empresa`, uma landing com uma oferta e um CTA para quem busca "criação de sites", e medir o clique no WhatsApp como conversão do Google Ads.

**Architecture:** o motor `/lp/[segmento]` passa a ler de `data/landings.ts` a lista ordenada de blocos e os títulos. A nova landing é um objeto de dados, mais dois blocos e um rodapé. A conversão sai no ramo de `whatsapp_click` de `trackEvent`, já protegido pelo consentimento, e `/privacidade` entra antes das telas que apontam para ela.

**Tech Stack:** Next.js 14 (App Router), React 18, TypeScript, `node --test` com type stripping (Node 24) para a lógica pura. Spec: `docs/superpowers/specs/2026-11-05-lp-google-ads-design.md`.

## Global Constraints

- Branch: `feat/lp-google-ads`. Sem push e sem deploy neste plano.
- Toda mensagem de commit termina com a linha `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- `border-radius: 0`, tokens da paleta via `cbm()` e `SURFACE`, foco visível em `#FB3640`.
- Contraste mínimo AA; `gray-400` é o piso de texto.
- Nenhum import de `three` ou `@react-three/*` nas rotas `/lp/*`.
- Preços vêm de `PUBLIC_PRICE`, nunca digitados à mão.
- Copy visível sem travessão.
- Só afirmações já publicadas no site; nenhum número de desempenho sem medição.
- Testes com `node --test` importam com extensão `.ts` e não resolvem o alias `@/`. Só módulos sem esse alias são testáveis assim (`lib/campaign.ts`, `lib/analytics.ts`).
- Antes de cada commit: `npm run typecheck` e `npm run lint` passam.

## Estrutura de arquivos

| Arquivo | Responsabilidade |
|---|---|
| `lib/campaign.ts` (alterar) | Origem legível na mensagem do WhatsApp |
| `scripts/campaign.test.mts` (novo) | Testes da origem |
| `lib/analytics.ts` (alterar) | IDs do Ads e evento `conversion` |
| `components/analytics/Analytics.tsx` (alterar) | `gtag('config', AW-...)` |
| `scripts/analytics.test.mts` (novo) | Testes da conversão |
| `data/privacidade.ts` (novo) | Copy da política |
| `app/privacidade/page.tsx` (novo) | Página da política |
| `components/analytics/ConsentChoice.tsx` (novo) | Mudar a escolha de cookies depois de decidir |
| `components/analytics/CookieConsent.tsx` (alterar) | Link da política e fecha quando a escolha muda |
| `components/site/SiteFooter.tsx`, `components/projetos/GalleryFooter.tsx`, `app/sitemap.ts`, `app/globals.css` (alterar) | Link da política, sitemap e foco visível |
| `data/landings.ts` (alterar) | Configuração das landings |
| `data/servicePages.ts` (alterar) | Exporta `ATENDE_BRASIL` e `INSTITUCIONAL_PRECO` |
| `app/lp/[segmento]/page.tsx` (alterar) | Renderiza os blocos na ordem da configuração |
| `components/lp/LpBlocks.tsx` (alterar) | Blocos da landing, incluindo os dois novos |
| `components/lp/LpCta.tsx` (alterar) | Link de WhatsApp em texto, com a origem da campanha |
| `components/lp/LpFooter.tsx` (novo) | Rodapé das landings |
| `.design-sync/previews/_fixtures.tsx`, `app/lab/revisao/sections/SiteSections.tsx` (alterar) | Acompanham a nova forma da configuração |

---

### Task 1: origem legível na mensagem do WhatsApp

**Files:**
- Modify: `lib/campaign.ts`
- Test: `scripts/campaign.test.mts`

**Interfaces:**
- Produces: `readCampaign(search: string): string | null` passa a ignorar `gclid` e `fbclid`. `messageWithCampaign` não muda.

- [ ] **Step 1: escrever o teste**

```ts
// scripts/campaign.test.mts
// Testes de lib/campaign.ts. Roda com: node --test scripts/campaign.test.mts
import { test } from "node:test";
import assert from "node:assert/strict";
import { messageWithCampaign, readCampaign } from "../lib/campaign.ts";

test("UTM legível vira a origem", () => {
  assert.equal(readCampaign("?utm_campaign=site-empresa"), "site-empresa");
});

test("utm_content tem preferência sobre utm_campaign", () => {
  assert.equal(readCampaign("?utm_campaign=site-empresa&utm_content=anuncio-2"), "anuncio-2");
});

test("gclid sozinho não vira origem", () => {
  assert.equal(readCampaign("?gclid=abc123"), null);
});

test("fbclid sozinho não vira origem", () => {
  assert.equal(readCampaign("?fbclid=abc123"), null);
});

test("gclid junto de UTM não atrapalha", () => {
  assert.equal(readCampaign("?gclid=abc123&utm_campaign=site-empresa"), "site-empresa");
});

test("sem campanha, a mensagem fica limpa", () => {
  assert.equal(messageWithCampaign("Olá", null), "Olá");
});

test("com campanha, a origem entra no fim da mensagem", () => {
  assert.equal(messageWithCampaign("Olá", "site-empresa"), "Olá (origem: site-empresa)");
});
```

- [ ] **Step 2: ver falhar**

Run: `node --test scripts/campaign.test.mts`
Expected: FAIL em "gclid sozinho não vira origem" e "fbclid sozinho não vira origem" (retornam `abc123`).

- [ ] **Step 3: implementar**

Em `lib/campaign.ts`, trocar as linhas 13 e 14 por:

```ts
/**
 * Parâmetros lidos da URL, na ordem de preferência para o rótulo.
 *
 * `gclid` e `fbclid` ficam de fora: são códigos de atribuição das plataformas,
 * sem sentido para quem lê a conversa. A plataforma os lê direto da URL.
 */
const KEYS = ["utm_content", "utm_campaign", "utm_source"];
```

- [ ] **Step 4: ver passar**

Run: `node --test scripts/campaign.test.mts`
Expected: PASS em 7 testes.

- [ ] **Step 5: commit**

```bash
git add lib/campaign.ts scripts/campaign.test.mts
git commit -m "fix(campanha): gclid e fbclid não entram na mensagem do WhatsApp

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: conversão do Google Ads

**Files:**
- Modify: `lib/analytics.ts`, `components/analytics/Analytics.tsx`
- Test: `scripts/analytics.test.mts`

**Interfaces:**
- Produces: `GOOGLE_ADS_ID: string | undefined` e `GOOGLE_ADS_WA_LABEL: string | undefined`, exportados de `lib/analytics.ts`, lidos de `NEXT_PUBLIC_GOOGLE_ADS_ID` e `NEXT_PUBLIC_GOOGLE_ADS_WA_LABEL`.

- [ ] **Step 1: escrever o teste**

```ts
// scripts/analytics.test.mts
// Testes da conversão do Google Ads. Roda com: node --test scripts/analytics.test.mts
// A query no import cria uma instância do módulo para cada estado do ambiente.
import { test } from "node:test";
import assert from "node:assert/strict";

process.env.NEXT_PUBLIC_GOOGLE_ADS_ID = "AW-123";
process.env.NEXT_PUBLIC_GOOGLE_ADS_WA_LABEL = "abc";
const withAds = await import("../lib/analytics.ts?ads=on");

delete process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
delete process.env.NEXT_PUBLIC_GOOGLE_ADS_WA_LABEL;
const withoutAds = await import("../lib/analytics.ts?ads=off");

function stubWindow(consent) {
  const calls = [];
  globalThis.window = {
    localStorage: { getItem: () => consent },
    gtag: (...args) => calls.push(args),
    fbq: () => {},
    __codedInsightsInternals: { emit: () => {} },
  };
  return calls;
}

const conversions = (calls) => calls.filter((c) => c[0] === "event" && c[1] === "conversion");

test("com consentimento e IDs, o clique no WhatsApp envia uma conversão", () => {
  const calls = stubWindow("granted");
  withAds.trackEvent("whatsapp_click", { location: "lp-hero" });
  assert.deepEqual(conversions(calls), [
    ["event", "conversion", { send_to: "AW-123/abc", transport_type: "beacon" }],
  ]);
});

test("com a recusa, nenhuma conversão sai", () => {
  const calls = stubWindow("denied");
  withAds.trackEvent("whatsapp_click", { location: "lp-hero" });
  assert.equal(conversions(calls).length, 0);
});

test("sem decisão sobre cookies, nenhuma conversão sai", () => {
  const calls = stubWindow(null);
  withAds.trackEvent("whatsapp_click", { location: "lp-hero" });
  assert.equal(conversions(calls).length, 0);
});

test("sem as variáveis, nenhuma conversão sai e o GA4 continua", () => {
  const calls = stubWindow("granted");
  withoutAds.trackEvent("whatsapp_click", { location: "lp-hero" });
  assert.equal(conversions(calls).length, 0);
  assert.ok(calls.some((c) => c[1] === "generate_lead"));
});

test("outro evento não vira conversão", () => {
  const calls = stubWindow("granted");
  withAds.trackEvent("email_click", { location: "footer" });
  assert.equal(conversions(calls).length, 0);
});
```

- [ ] **Step 2: ver falhar**

Run: `node --test scripts/analytics.test.mts`
Expected: FAIL em "com consentimento e IDs" (a lista de conversões vem vazia).

- [ ] **Step 3: implementar em `lib/analytics.ts`**

Trocar o título do comentário da linha 2 por `Configuração de métricas: GA4, Meta Pixel e Google Ads.` e, logo depois de `META_PIXEL_ID`, acrescentar:

```ts
/**
 * Google Ads. Sem valor padrão: enquanto a conta não fornecer o ID e o rótulo
 * da conversão, nada é enviado e o site funciona igual.
 */
export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || undefined;
export const GOOGLE_ADS_WA_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_WA_LABEL || undefined;
```

Em `trackEvent`, trocar o bloco `if (name === "whatsapp_click" && getConsent() === "granted")` por:

```ts
    if (name === "whatsapp_click" && getConsent() === "granted") {
      window.gtag?.("event", "generate_lead", {
        event_category: "contato",
        event_label: location,
        transport_type: "beacon",
      });
      window.fbq?.("track", "Lead", { content_name: location });
      if (GOOGLE_ADS_ID && GOOGLE_ADS_WA_LABEL) {
        window.gtag?.("event", "conversion", {
          send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_WA_LABEL}`,
          transport_type: "beacon",
        });
      }
    }
```

- [ ] **Step 4: implementar em `components/analytics/Analytics.tsx`**

Adicionar `GOOGLE_ADS_ID` ao import de `@/lib/analytics`, trocar a primeira linha do comentário do componente por `Carrega GA4, Google Ads e Meta Pixel APENAS após consentimento (LGPD).` e trocar o `<Script id="ga-init">` por:

```tsx
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
          ${GOOGLE_ADS_ID ? `gtag('config', '${GOOGLE_ADS_ID}');` : ""}
        `}
      </Script>
```

- [ ] **Step 5: ver passar**

Run: `node --test scripts/analytics.test.mts && npm run typecheck && npm run lint`
Expected: PASS em 5 testes; typecheck e lint sem erro.

- [ ] **Step 6: commit**

```bash
git add lib/analytics.ts components/analytics/Analytics.tsx scripts/analytics.test.mts
git commit -m "feat(analytics): conversão do Google Ads no clique do WhatsApp

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: política de privacidade

**Files:**
- Create: `data/privacidade.ts`, `app/privacidade/page.tsx`, `components/analytics/ConsentChoice.tsx`
- Modify: `components/analytics/CookieConsent.tsx`, `components/site/SiteFooter.tsx`, `components/projetos/GalleryFooter.tsx`, `app/sitemap.ts`, `app/globals.css`

**Interfaces:**
- Consumes: `getConsent`, `setConsent`, `CONSENT_EVENT`, `ConsentValue` de `lib/analytics.ts`.
- Produces: `PRIVACY_PATH = "/privacidade"`, exportado de `data/privacidade.ts`.

O site guarda a escolha de cookies, mas hoje não oferece como mudá-la. A spec pede que a página explique como mudar de ideia, então `ConsentChoice` entra para isso ser verdade.

- [ ] **Step 1: criar `data/privacidade.ts`**

```ts
/**
 * Copy de /privacidade. RASCUNHO: descreve o que o código faz hoje, precisa da
 * revisão do Matheus e não substitui revisão jurídica.
 *
 * Fica sem imports de propósito: o banner de cookies, que é client, importa
 * PRIVACY_PATH daqui.
 */

export const PRIVACY_PATH = "/privacidade";

export const PRIVACY_TITLE = "Política de privacidade";

export const PRIVACY_DESCRIPTION =
  "Quais dados o site da Coded by M coleta, para quê, com quem são compartilhados e como exercer seus direitos pela LGPD.";

export const PRIVACY_UPDATED = "5 de novembro de 2026";

export const PRIVACY_LEAD =
  "Esta página explica quais dados o site da Coded by M coleta, para quê, e o que você pode decidir sobre eles.";

/** `{whatsapp}` é trocado pelo número na página. */
export const PRIVACY_SECTIONS: { heading: string; paragraphs: string[] }[] = [
  {
    heading: "Quem é o responsável",
    paragraphs: [
      "A Coded by M é o estúdio de web design de Matheus Mendes, em Florianópolis (SC). Para falar sobre seus dados, use o WhatsApp {whatsapp}.",
    ],
  },
  {
    heading: "O que é coletado com o seu consentimento",
    paragraphs: [
      "Se você aceitar os cookies, o site carrega o Google Analytics, o Google Ads e o Meta Pixel. Essas ferramentas registram as páginas visitadas, de qual anúncio você veio e os cliques no WhatsApp. Com isso, meço quais páginas e anúncios funcionam e ajusto as campanhas.",
      "Se você recusar ou não decidir, nenhuma dessas ferramentas é carregada.",
    ],
  },
  {
    heading: "O que é coletado sem cookies",
    paragraphs: [
      "O site usa o Coded Insights, uma ferramenta própria de métricas, para contar visitas e cliques com base no legítimo interesse de entender como o site é usado. Ela não usa cookies e não recebe seu telefone ou e-mail.",
    ],
  },
  {
    heading: "Quando você fala comigo pelo WhatsApp",
    paragraphs: [
      "Os botões abrem o WhatsApp com uma mensagem pronta, que pode indicar de qual campanha você veio. O que você enviar na conversa, como nome, telefone e dados do projeto, é usado para responder, preparar o orçamento e atender o projeto.",
    ],
  },
  {
    heading: "Com quem os dados são compartilhados",
    paragraphs: [
      "Google e Meta, que também controla o WhatsApp, recebem os dados das ferramentas descritas acima e podem tratá-los fora do Brasil, conforme as regras de cada empresa. Seus dados não são vendidos.",
    ],
  },
  {
    heading: "Por quanto tempo os dados ficam guardados",
    paragraphs: [
      "Pelo tempo necessário para as finalidades acima ou para cumprir obrigações legais. Nas ferramentas de terceiros, valem também as regras de cada uma.",
    ],
  },
  {
    heading: "Seus direitos",
    paragraphs: [
      "Pela LGPD, você pode pedir a confirmação de que seus dados são tratados, acesso, correção, anonimização ou eliminação de dados desnecessários, portabilidade, informações sobre o compartilhamento e a revogação do consentimento. Faça o pedido pelo WhatsApp {whatsapp}. Você também pode reclamar à Autoridade Nacional de Proteção de Dados (ANPD).",
    ],
  },
];

export const PRIVACY_CHOICE_HEADING = "Sua escolha sobre cookies";

export const PRIVACY_CHOICE_TEXT =
  "Você pode mudar sua escolha aqui. A recusa vale daqui em diante. Cookies já gravados podem ser apagados nas configurações do navegador.";
```

- [ ] **Step 2: criar `components/analytics/ConsentChoice.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { getConsent, setConsent, type ConsentValue } from "@/lib/analytics";
import { PANCHANG, SATOSHI } from "@/components/site/shared";
import { cbm } from "@/lib/palette";

const STATUS: Record<ConsentValue | "none", string> = {
  granted: "Sua escolha atual: cookies aceitos.",
  denied: "Sua escolha atual: cookies recusados.",
  none: "Você ainda não escolheu.",
};

const BUTTON: React.CSSProperties = {
  minHeight: 44,
  padding: "0 18px",
  background: "transparent",
  color: "#F5F2ED",
  border: "1px solid rgba(245,242,237,0.38)",
  borderRadius: 0,
  fontFamily: PANCHANG,
  fontWeight: 700,
  fontSize: 11,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  cursor: "pointer",
};

/**
 * Muda a escolha de cookies depois de decidida. A recusa recarrega a página:
 * scripts já carregados só saem assim.
 */
export function ConsentChoice() {
  const [consent, setState] = useState<ConsentValue | null>(null);

  useEffect(() => setState(getConsent()), []);

  const decide = (value: ConsentValue) => {
    setConsent(value);
    setState(value);
    if (value === "denied") window.location.reload();
  };

  return (
    <div style={{ marginTop: 18 }}>
      <p
        aria-live="polite"
        style={{ margin: 0, fontFamily: SATOSHI, fontSize: 15, color: cbm("gray-200") }}
      >
        {STATUS[consent ?? "none"]}
      </p>
      <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 10 }}>
        <button type="button" onClick={() => decide("granted")} style={BUTTON}>
          Aceitar cookies
        </button>
        <button type="button" onClick={() => decide("denied")} style={BUTTON}>
          Recusar cookies
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: criar `app/privacidade/page.tsx`**

```tsx
import type { Metadata } from "next";
import { ConsentChoice } from "@/components/analytics/ConsentChoice";
import { ProseShell, PROSE_H1, PROSE_H2, PROSE_P } from "@/components/prose/Prose";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  PRIVACY_CHOICE_HEADING,
  PRIVACY_CHOICE_TEXT,
  PRIVACY_DESCRIPTION,
  PRIVACY_LEAD,
  PRIVACY_PATH,
  PRIVACY_SECTIONS,
  PRIVACY_TITLE,
  PRIVACY_UPDATED,
} from "@/data/privacidade";
import { WHATSAPP_DISPLAY } from "@/lib/contact";
import { cbm } from "@/lib/palette";
import { breadcrumbSchema, graph, webPageSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: PRIVACY_TITLE,
  description: PRIVACY_DESCRIPTION,
  alternates: { canonical: PRIVACY_PATH },
};

export default function PrivacidadePage() {
  return (
    <ProseShell label="Privacidade" current={PRIVACY_PATH}>
      <JsonLd
        data={graph(
          webPageSchema({ path: PRIVACY_PATH, name: PRIVACY_TITLE, description: PRIVACY_DESCRIPTION }),
          breadcrumbSchema([
            { name: "Início", path: "/" },
            { name: PRIVACY_TITLE, path: PRIVACY_PATH },
          ]),
        )}
      />
      <h1 style={PROSE_H1}>{PRIVACY_TITLE}</h1>
      <p style={{ ...PROSE_P, color: cbm("gray-100") }}>{PRIVACY_LEAD}</p>

      {PRIVACY_SECTIONS.map((section) => (
        <section key={section.heading}>
          <h2 style={PROSE_H2}>{section.heading}</h2>
          {section.paragraphs.map((text) => (
            <p key={text} style={PROSE_P}>
              {text.replace("{whatsapp}", WHATSAPP_DISPLAY)}
            </p>
          ))}
        </section>
      ))}

      <section>
        <h2 style={PROSE_H2}>{PRIVACY_CHOICE_HEADING}</h2>
        <p style={PROSE_P}>{PRIVACY_CHOICE_TEXT}</p>
        <ConsentChoice />
      </section>

      <p style={{ ...PROSE_P, marginTop: 48, color: cbm("gray-400") }}>
        Última atualização: {PRIVACY_UPDATED}.
      </p>
    </ProseShell>
  );
}
```

- [ ] **Step 4: alterar `components/analytics/CookieConsent.tsx`**

Trocar os imports do topo por:

```tsx
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CONSENT_EVENT, getConsent, setConsent } from "@/lib/analytics";
import { PRIVACY_PATH } from "@/data/privacidade";
import { cbm } from "@/lib/palette";
```

Trocar o `useEffect` por:

```tsx
  useEffect(() => {
    if (getConsent() === null) setVisible(true);
    // A escolha também pode ser feita em /privacidade.
    const hide = () => setVisible(false);
    window.addEventListener(CONSENT_EVENT, hide);
    return () => window.removeEventListener(CONSENT_EVENT, hide);
  }, []);
```

Trocar o texto do parágrafo por:

```tsx
        Usamos cookies para medir o desempenho do site e entender como ele é
        usado. Você decide.{" "}
        <Link
          href={PRIVACY_PATH}
          style={{
            color: "#F5F2ED",
            textDecoration: "underline",
            textDecorationColor: "#FB3640",
            textUnderlineOffset: 3,
          }}
        >
          Política de privacidade
        </Link>
```

- [ ] **Step 5: acrescentar os links, o sitemap e o foco**

Em `components/site/SiteFooter.tsx`, importar `import { PRIVACY_PATH } from "@/data/privacidade";` e acrescentar ao fim de `LINKS`:

```ts
  { label: "Privacidade", href: PRIVACY_PATH, external: false },
```

Em `components/projetos/GalleryFooter.tsx`, importar `import { PRIVACY_PATH } from "@/data/privacidade";` e acrescentar ao fim de `LINKS`, depois do spread do blog:

```ts
  { href: PRIVACY_PATH, label: "Privacidade" },
```

Em `app/sitemap.ts`, importar `import { PRIVACY_PATH } from "@/data/privacidade";` e acrescentar, logo depois da linha de `/contato`:

```ts
    { url: `${SITE_URL}${PRIVACY_PATH}`, changeFrequency: "yearly", priority: 0.2 },
```

Em `app/globals.css`, logo depois da regra `.site-footer-link:hover { color: #f5f2ed; }`, acrescentar:

```css
.site-footer-link:focus-visible { outline: 2px solid #fb3640; outline-offset: 3px; }
```

- [ ] **Step 6: verificar**

Run: `npm run typecheck && npm run lint`
Expected: sem erro.

Run em segundo plano: `npm run dev`. No navegador, com as requisições para `insights.codedbym.com`, `googletagmanager.com`, `google-analytics.com` e `connect.facebook.net` bloqueadas, para não contaminar as métricas de produção:
- `/privacidade` abre em 390 px sem rolagem horizontal, e o título, o WhatsApp e a data aparecem.
- Com o banner aberto, clicar em "Recusar cookies" na página fecha o banner, recarrega e mostra "cookies recusados".
- O link do banner, o do `SiteFooter` em `/` e o do `GalleryFooter` em `/sobre` levam a `/privacidade`.
- Em `/privacidade`, o link "Privacidade" do `GalleryFooter` não aparece, porque é a página atual.
- `curl -s localhost:3000/sitemap.xml | grep privacidade` retorna a URL.

- [ ] **Step 7: commit**

```bash
git add data/privacidade.ts app/privacidade components/analytics/ConsentChoice.tsx components/analytics/CookieConsent.tsx components/site/SiteFooter.tsx components/projetos/GalleryFooter.tsx app/sitemap.ts app/globals.css
git commit -m "feat(privacidade): política de privacidade e mudança da escolha de cookies

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: motor de landings configurável

Esta task não cria a landing nova. Em `/lp/arquitetura`, mudam só o FAQ, o rodapé e o rótulo "Projeto conceitual".

**Files:**
- Create: `components/lp/LpFooter.tsx`
- Modify: `data/landings.ts`, `app/lp/[segmento]/page.tsx`, `components/lp/LpBlocks.tsx`, `components/lp/LpCta.tsx`, `.design-sync/previews/_fixtures.tsx`, `app/lab/revisao/sections/SiteSections.tsx`

**Interfaces:**
- Consumes: `PRIVACY_PATH` de `data/privacidade.ts`; `isFilled` de `data/servicePages.ts`.
- Produces: tipos `LandingBlock` e `LandingConfig` abaixo; `LpProcess({ lp })` passa a exigir `lp`; `LpWaLink({ message, source, children })`; `LpFooter({ message })`.

- [ ] **Step 1: alterar `data/landings.ts`**

Trocar o comentário do topo, `LandingFaq` e `LandingConfig` por:

```ts
/**
 * Landings de campanha: o motor de `/lp/[segmento]`.
 *
 * Abrir um ângulo novo é acrescentar um objeto aqui. Cada rota nasce `noindex`
 * de propósito: ela existe pra receber clique pago, e se o Google indexasse,
 * competiria com a `/` pelas mesmas buscas e entregaria a quem vem da busca uma
 * página sem navegação.
 *
 * ATENÇÃO: o copy daqui é rascunho e precisa de revisão. Respostas marcadas com
 * PREENCHER dependem de números que só o Matheus tem e NÃO aparecem na página
 * enquanto tiverem o marcador (ver `isFilled`).
 */

export interface LandingFaq {
  q: string;
  a: string;
}

/** Blocos disponíveis. A ordem da página é a ordem de `LandingConfig.blocks`. */
export type LandingBlock =
  | "hero"
  | "pains"
  | "promise"
  | "proof"
  | "differentials"
  | "offer"
  | "process"
  | "faq"
  | "final";

export interface LandingConfig {
  /** Vira a rota: `/lp/<slug>`. */
  slug: string;
  /** Blocos da página, na ordem em que aparecem. */
  blocks: LandingBlock[];
  /** Hero. */
  headline: string;
  sub: string;
  ctaLabel: string;
  /** Slug de `data/cases.ts` cuja captura aparece no hero. Sem isto, só texto. */
  heroCaseSlug?: string;
  /** 3 ou 4 pontos de dor, se a página listar o bloco `pains`. */
  pains?: string[];
  /** Uma frase, se a página listar o bloco `promise`. */
  promise?: string;
  /** Título da prova. */
  proofHeading: string;
  /** Título do grupo de conceitos, quando também há clientes reais. */
  conceptHeading?: string;
  /** Slugs de `data/cases.ts`, na ordem em que provam. */
  caseSlugs: string[];
  differentials?: { heading: string; items: { title: string; text: string }[] };
  offer?: {
    heading: string;
    includes: string[];
    price: string;
    deadline: string;
    note: string;
    /** Uma linha com a opção menor. */
    alternative?: string;
  };
  processHeading: string;
  /** 4 a 6 objeções reais. */
  faq: LandingFaq[];
  final: { heading: string; text: string };
  /** Base da mensagem do WhatsApp; a origem da campanha é anexada em runtime. */
  waMessage: string;
  /** A rota é noindex, mas o preview do link em WhatsApp e LinkedIn importa. */
  meta: { title: string; description: string; ogImage: string };
}
```

No objeto `arquitetura`, apagar a linha `eyebrow` e acrescentar, logo depois de `slug: "arquitetura",`:

```ts
    blocks: ["hero", "pains", "promise", "proof", "process", "faq", "final"],
    proofHeading: "Sites de arquitetura e interiores, no ar pra conferir.",
    processHeading: "Quatro etapas, e você sabe onde está em cada uma.",
    final: {
      heading: "Vamos conversar sobre o seu escritório.",
      text: "Você conta o contexto, eu digo o que faria e em quanto tempo entrego. Sem formulário e sem proposta automática.",
    },
```

- [ ] **Step 2: acrescentar `LpWaLink` em `components/lp/LpCta.tsx`**

Trocar o arquivo inteiro por:

```tsx
"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { waLink } from "@/lib/contact";
import { messageWithCampaign, readCampaign } from "@/lib/campaign";
import { FillButton } from "@/components/ui/FillButton";

/**
 * Link do WhatsApp com a origem da campanha na mensagem. Sem isso o lead chega
 * anônimo e não dá pra saber qual anúncio pagou por ele.
 *
 * A leitura da URL acontece em `useEffect` de propósito: no servidor não há
 * `location`, e ler durante a renderização quebraria a hidratação.
 */
function useCampaignHref(message: string) {
  const [href, setHref] = useState(() => waLink(message));

  useEffect(() => {
    const campaign = readCampaign(window.location.search);
    setHref(waLink(messageWithCampaign(message, campaign)));
  }, [message]);

  return href;
}

/**
 * O CTA da landing, em três tamanhos. O evento de conversão sai pelo listener
 * global do `Analytics`, com `source` como `location`.
 */
export function LpCta({
  label,
  message,
  size = "md",
  source,
}: {
  label: string;
  message: string;
  size?: "sm" | "md" | "lg";
  source: string;
}) {
  const href = useCampaignHref(message);

  return (
    <FillButton
      href={href}
      target="_blank"
      size={size}
      data-cm-role="whatsapp"
      data-cm-id={source}
    >
      {label}
    </FillButton>
  );
}

/** O mesmo destino do CTA, como link de texto. */
export function LpWaLink({
  message,
  source,
  style,
  children,
}: {
  message: string;
  source: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const href = useCampaignHref(message);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-cm-role="whatsapp"
      data-cm-id={source}
      className="site-footer-link"
      style={style}
    >
      {children}
    </a>
  );
}
```

- [ ] **Step 3: criar `components/lp/LpFooter.tsx`**

```tsx
import Link from "next/link";
import { LpWaLink } from "./LpCta";
import { SATOSHI } from "@/components/site/shared";
import { PRIVACY_PATH } from "@/data/privacidade";
import { WHATSAPP_DISPLAY } from "@/lib/contact";
import { cbm } from "@/lib/palette";

const TEXT: React.CSSProperties = {
  fontFamily: SATOSHI,
  fontWeight: 400,
  fontSize: 13,
  color: cbm("gray-300"),
  textDecoration: "none",
};

/** Quem está por trás da página: quem chega por anúncio ainda não conhece o estúdio. */
export function LpFooter({ message }: { message: string }) {
  return (
    <footer style={{ borderTop: `1px solid ${cbm("border")}` }}>
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "28px clamp(20px,4vw,48px)",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "14px 28px",
        }}
      >
        <span style={TEXT}>Coded by M · Florianópolis, SC</span>
        <LpWaLink message={message} source="lp-footer" style={TEXT}>
          WhatsApp {WHATSAPP_DISPLAY}
        </LpWaLink>
        <Link href={PRIVACY_PATH} className="site-footer-link" style={TEXT}>
          Política de privacidade
        </Link>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: alterar `components/lp/LpBlocks.tsx`**

Trocar os imports do topo por:

```tsx
import Image from "next/image";
import { cases } from "@/data/cases";
import { PROCESS_STEPS } from "@/data/process";
import type { LandingConfig } from "@/data/landings";
import { isFilled } from "@/data/servicePages";
import type { CaseProject } from "@/types/case";
import { Reveal } from "@/components/ui/Reveal";
import {
  Diamond,
  PANCHANG,
  SATOSHI,
  SURFACE,
} from "@/components/site/shared";
import { LpCta } from "./LpCta";
import { cbm } from "@/lib/palette";
```

Em `LpPains`, acrescentar como primeira linha do corpo da função `if (!lp.pains?.length) return null;`. Em `LpPromise`, acrescentar como primeira linha `if (!lp.promise) return null;`.

Trocar `LpProof` inteiro por:

```tsx
/** Grade de cards de case. */
function ProofGrid({ list }: { list: CaseProject[] }) {
  return (
    <div
      style={{
        marginTop: "clamp(34px,5vh,52px)",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,280px),1fr))",
        gap: "clamp(18px,2.4vw,28px)",
      }}
    >
      {list.map((c, i) => (
        <Reveal key={c.slug} delay={i * 100} variant="scale" className="site-cell">
          <article
            className="site-card"
            style={{
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
              border: "1px solid rgba(245,242,237,0.12)",
              background: SURFACE.sunken,
            }}
          >
            <div
              style={{
                position: "relative",
                height: "clamp(180px,22vh,230px)",
                overflow: "hidden",
                borderBottom: "1px solid rgba(245,242,237,0.1)",
              }}
            >
              <Image
                src={c.preview?.card ?? ""}
                alt={`${c.title}: ${c.meta.tipo}`}
                width={760}
                height={874}
                sizes="(max-width: 640px) 92vw, (max-width: 1100px) 46vw, 30vw"
                className="site-shot"
                style={{ display: "block", width: "100%", height: "auto" }}
              />
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: "auto 0 0 0",
                  height: 80,
                  background: `linear-gradient(to bottom,${cbm("sunken", 0)},${cbm("sunken", 0.95)})`,
                }}
              />
            </div>
            <div style={{ padding: "18px 20px 22px", display: "flex", flexDirection: "column", gap: 8 }}>
              <h3
                style={{
                  margin: 0,
                  fontFamily: PANCHANG,
                  fontWeight: 700,
                  fontSize: 19,
                  color: "#F5F2ED",
                }}
              >
                {c.title}
              </h3>
              <span
                style={{
                  fontFamily: SATOSHI,
                  fontWeight: 400,
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: cbm("gray-400"),
                }}
              >
                {c.meta.setor} · {c.concept ? "Projeto conceitual · " : ""}{c.meta.ano}
              </span>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

/**
 * Prova: clientes reais primeiro e conceitos em grupo próprio, com rótulo
 * visível, para não sugerir que conceito foi cliente. Sem link pra fora: a
 * prova acontece aqui.
 */
export function LpProof({ lp }: { lp: LandingConfig }) {
  const list = lp.caseSlugs
    .map((s) => cases.find((c) => c.slug === s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));
  const real = list.filter((c) => !c.concept);
  const concept = list.filter((c) => c.concept);

  return (
    <section data-cm-section="social-proof" style={{ borderTop: `1px solid ${cbm("border")}` }}>
      <div style={WRAP}>
        <Reveal variant="wipe">
          <h2 style={{ ...H2, marginTop: 22, maxWidth: "18ch" }}>{lp.proofHeading}</h2>
        </Reveal>

        {real.length > 0 && <ProofGrid list={real} />}

        {real.length > 0 && concept.length > 0 && lp.conceptHeading && (
          <Reveal variant="wipe">
            <p
              style={{
                margin: "clamp(48px,7vh,72px) 0 0",
                maxWidth: "34ch",
                fontFamily: PANCHANG,
                fontWeight: 600,
                fontSize: "clamp(18px,2vw,24px)",
                lineHeight: 1.25,
                color: cbm("gray-100"),
                textWrap: "balance",
              }}
            >
              {lp.conceptHeading}
            </p>
          </Reveal>
        )}

        {concept.length > 0 && <ProofGrid list={concept} />}
      </div>
    </section>
  );
}
```

Trocar a assinatura de `LpProcess` e o conteúdo do `h2` dele por:

```tsx
export function LpProcess({ lp }: { lp: LandingConfig }) {
```

```tsx
          <h2 style={{ ...H2, marginTop: 22, maxWidth: "18ch" }}>{lp.processHeading}</h2>
```

Em `LpFaq`, trocar `{lp.faq.map((f, i) => (` por:

```tsx
          {lp.faq.filter(isFilled).map((f, i) => (
```

Em `LpFinal`, trocar o conteúdo do `h2` por `{lp.final.heading}` e o conteúdo do `p` por `{lp.final.text}`.

- [ ] **Step 5: trocar o corpo de `app/lp/[segmento]/page.tsx`**

Trocar os imports do topo por:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LANDINGS, getLanding, type LandingBlock, type LandingConfig } from "@/data/landings";
import { SURFACE } from "@/components/site/shared";
import { LpFooter } from "@/components/lp/LpFooter";
import { LpHeader } from "@/components/lp/LpHeader";
import {
  LpFaq,
  LpFinal,
  LpHero,
  LpPains,
  LpProcess,
  LpPromise,
  LpProof,
} from "@/components/lp/LpBlocks";

const BLOCKS: Partial<Record<LandingBlock, (props: { lp: LandingConfig }) => JSX.Element | null>> = {
  hero: LpHero,
  pains: LpPains,
  promise: LpPromise,
  proof: LpProof,
  process: LpProcess,
  faq: LpFaq,
  final: LpFinal,
};
```

Trocar o conteúdo de `<main>` e fechar com o rodapé:

```tsx
      <LpHeader message={lp.waMessage} />
      <main>
        {lp.blocks.map((key) => {
          const Block = BLOCKS[key];
          return Block ? <Block key={key} lp={lp} /> : null;
        })}
      </main>
      <LpFooter message={lp.waMessage} />
```

- [ ] **Step 6: acompanhar a nova forma nos consumidores**

Em `.design-sync/previews/_fixtures.tsx`, acrescentar no topo do arquivo `import type { LandingConfig } from "../../data/landings";`, trocar `export const LANDING = {` por `export const LANDING: LandingConfig = {`, apagar a linha `eyebrow` e acrescentar logo depois de `slug: "arquitetura",`:

```ts
  blocks: ["hero", "pains", "promise", "proof", "process", "faq", "final"],
  proofHeading: "Sites de arquitetura e interiores, no ar pra conferir.",
  processHeading: "Quatro etapas, e você sabe onde está em cada uma.",
  final: {
    heading: "Vamos conversar sobre o seu escritório.",
    text: "Você conta o contexto, eu digo o que faria e em quanto tempo entrego. Sem formulário e sem proposta automática.",
  },
```

Em `app/lab/revisao/sections/SiteSections.tsx`, importar `import { LANDINGS } from "@/data/landings";` e trocar `["LpProcess", LpProcess],` por:

```tsx
  ["LpProcess", () => <LpProcess lp={LANDINGS[0]} />],
```

- [ ] **Step 7: verificar**

Run: `npm run typecheck && npm run lint`
Expected: sem erro.

Com `npm run dev` rodando:
- `curl -s localhost:3000/lp/arquitetura | grep -c PREENCHER` retorna `0`.
- `curl -s localhost:3000/lp/arquitetura | grep -o 'noindex' | head -1` retorna `noindex`.
- No navegador, `/lp/arquitetura` mantém ordem e títulos. Mudam só o FAQ sem as 2 perguntas, o rodapé novo e o rótulo "Projeto conceitual" nos cards.
- `/lab/revisao` abre sem erro no console.

- [ ] **Step 8: commit**

```bash
git add data/landings.ts "app/lp/[segmento]/page.tsx" components/lp .design-sync/previews/_fixtures.tsx app/lab/revisao/sections/SiteSections.tsx
git commit -m "feat(lp): blocos e títulos configuráveis, rodapé e FAQ sem rascunho

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: landing `/lp/site-para-empresa`

**Files:**
- Modify: `data/landings.ts`, `data/servicePages.ts`, `components/lp/LpBlocks.tsx`, `app/lp/[segmento]/page.tsx`

**Interfaces:**
- Consumes: `LandingConfig`, `LandingBlock` e `BLOCKS` da Task 4; `PUBLIC_PRICE` e `getServicePage` de `data/servicePages.ts`; `OG` de `lib/seo.ts`.
- Produces: `LpDifferentials({ lp })`, `LpOffer({ lp })`, e `LpHero` com imagem opcional; `ATENDE_BRASIL` e `INSTITUCIONAL_PRECO` exportados de `data/servicePages.ts`.

- [ ] **Step 1: exportar as constantes em `data/servicePages.ts`**

Trocar `const ATENDE_BRASIL: FaqItem = {` por `export const ATENDE_BRASIL: FaqItem = {` e ``const INSTITUCIONAL_PRECO = `` por ``export const INSTITUCIONAL_PRECO = ``.

- [ ] **Step 2: acrescentar a landing em `data/landings.ts`**

No topo do arquivo, depois do comentário:

```ts
import {
  ATENDE_BRASIL,
  INSTITUCIONAL_PRECO,
  PUBLIC_PRICE,
  getServicePage,
} from "@/data/servicePages";
import { OG } from "@/lib/seo";
```

Acrescentar ao fim do array `LANDINGS`, depois do objeto `arquitetura`:

```ts
  {
    slug: "site-para-empresa",
    /** Quem vem do Google já procura um site: preço e prova antes da dor. */
    blocks: ["hero", "proof", "pains", "differentials", "offer", "process", "faq", "final"],

    headline: "Site profissional para a sua empresa, feito do zero.",
    sub: `A partir de ${PUBLIC_PRICE.institucional.display}, com hospedagem e domínio inclusos. Prazo a partir de 15 dias úteis. Estúdio em Florianópolis, atendimento em todo o Brasil.`,
    ctaLabel: "Pedir orçamento no WhatsApp",
    heroCaseSlug: "machado-plataformas",

    proofHeading: "Empresas que já estão no ar com um site nosso.",
    conceptHeading: "Projetos conceituais, para mostrar o alcance do trabalho.",
    /** Clientes reais primeiro. Os dois últimos têm `concept: true`. */
    caseSlugs: [
      "machado-plataformas",
      "mj-engenharia",
      "valdete-costuras",
      "stige",
      "estudio-lentz",
    ],

    pains: [
      "Seu site parece com o do concorrente, porque saiu do mesmo template.",
      "A página demora a abrir no celular, e a pessoa volta para o Google.",
      "Quem procura o seu serviço na sua cidade não encontra a sua empresa.",
    ],

    differentials: {
      heading: "O que muda quando o site é feito do zero.",
      items: [
        {
          title: "Código próprio",
          text: "Design exclusivo, sem template e sem o peso de um construtor de sites.",
        },
        {
          title: "Velocidade",
          text: "Pensado primeiro para o celular e para carregar rápido.",
        },
        {
          title: "Google",
          text: "SEO técnico e dados estruturados desde o primeiro dia.",
        },
        {
          title: "Domínio",
          text: "Registrado no nome da sua empresa. Se você quiser sair, ele continua seu.",
        },
        {
          title: "Métricas",
          text: "WhatsApp integrado e métricas configuradas na entrega.",
        },
      ],
    },

    offer: {
      heading: "Site institucional sob medida.",
      includes: getServicePage("site-institucional").includes,
      price: `A partir de ${PUBLIC_PRICE.institucional.display}`,
      deadline: "A partir de 15 dias úteis",
      note: "O valor final depende do projeto e é fechado no WhatsApp, antes de começar.",
      alternative: `Precisa só de uma página? Landing page a partir de ${PUBLIC_PRICE.landing.display}, em 5 dias úteis.`,
    },

    processHeading: "Quatro etapas, e você sabe onde está em cada uma.",

    faq: [
      { q: "Quanto custa um site?", a: INSTITUCIONAL_PRECO },
      {
        q: "Em quanto tempo fica pronto?",
        a: "A partir de 15 dias úteis. O prazo final depende do número de páginas e do conteúdo e é fechado no orçamento no WhatsApp, antes de começar.",
      },
      {
        q: "Hospedagem e domínio estão inclusos?",
        a: "Sim. A hospedagem fica por minha conta e está incluída no valor do projeto. O domínio é registrado no nome da sua empresa, e o custo também está incluído.",
      },
      {
        q: "Tem mensalidade?",
        a: "Existe um plano mensal opcional de suporte e atualizações, com valor que depende do serviço.",
      },
      {
        q: "Posso editar o conteúdo depois?",
        a: "Sim. A entrega inclui handover, e se o conteúdo muda com frequência o site sai com um CMS leve para você editar sem depender de mim.",
      },
      ATENDE_BRASIL,
    ],

    final: {
      heading: "Vamos conversar sobre o site da sua empresa.",
      text: "Você conta o projeto e eu respondo no mesmo dia com valor e prazo. O orçamento é gratuito e sem compromisso.",
    },

    waMessage: "Olá! Vim pela página de sites para empresas da Coded by M e quero um orçamento.",

    meta: {
      // Sem sufixo: o `template` do layout raiz já acrescenta "· Coded by M".
      title: "Criação de site profissional para empresas",
      description: `Site profissional feito do zero, a partir de ${PUBLIC_PRICE.institucional.display}, com hospedagem e domínio inclusos. Prazo a partir de 15 dias úteis. Peça um orçamento pelo WhatsApp.`,
      ogImage: OG.home,
    },
  },
```

- [ ] **Step 3: trocar `LpHero` em `components/lp/LpBlocks.tsx`**

```tsx
/**
 * Hero: headline dirigida a quem clicou. A captura fica fora do `Reveal` para
 * não atrasar o LCP esperando JavaScript.
 */
export function LpHero({ lp }: { lp: LandingConfig }) {
  const shot = lp.heroCaseSlug ? cases.find((c) => c.slug === lp.heroCaseSlug) : undefined;
  const src = shot?.preview?.top;

  return (
    <section data-cm-section="hero" style={{ ...WRAP, paddingTop: "clamp(48px,7vh,84px)" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: src ? "repeat(auto-fit,minmax(min(100%,400px),1fr))" : "1fr",
          gap: "clamp(36px,5vw,64px)",
          alignItems: "center",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <Reveal variant="wipe">
            <h1
              style={{
                ...H2,
                marginTop: 24,
                maxWidth: "17ch",
                /* Com a captura ao lado, a coluna é menos da metade da página. */
                fontSize: src ? "clamp(30px,3.8vw,52px)" : "clamp(34px,5.4vw,66px)",
                lineHeight: 1.02,
              }}
            >
              {lp.headline}
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p
              style={{
                margin: "26px 0 0",
                maxWidth: "58ch",
                fontFamily: SATOSHI,
                fontWeight: 400,
                fontSize: "clamp(15px,1.5vw,18px)",
                lineHeight: 1.72,
                color: cbm("gray-200"),
                textWrap: "pretty",
              }}
            >
              {lp.sub}
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div style={{ marginTop: 38 }}>
              <LpCta label={lp.ctaLabel} message={lp.waMessage} size="lg" source="lp-hero" />
            </div>
          </Reveal>
        </div>

        {src && shot && (
          <Image
            src={src}
            alt={`Site da ${shot.title}`}
            width={1440}
            height={900}
            priority
            sizes="(max-width: 900px) 92vw, 46vw"
            style={{
              display: "block",
              width: "100%",
              height: "auto",
              border: "1px solid rgba(245,242,237,0.12)",
            }}
          />
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: acrescentar os blocos novos em `components/lp/LpBlocks.tsx`, antes de `LpProcess`**

```tsx
/** Diferenciais: a resposta ao problema, e o que justifica o preço. */
export function LpDifferentials({ lp }: { lp: LandingConfig }) {
  if (!lp.differentials) return null;

  return (
    <section data-cm-section="differentials" style={{ borderTop: `1px solid ${cbm("border")}` }}>
      <div style={WRAP}>
        <Reveal variant="wipe">
          <h2 style={{ ...H2, maxWidth: "18ch" }}>{lp.differentials.heading}</h2>
        </Reveal>
        <div
          style={{
            marginTop: "clamp(30px,4vh,46px)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,260px),1fr))",
            gap: "clamp(24px,3vw,36px)",
          }}
        >
          {lp.differentials.items.map((item, i) => (
            <Reveal key={item.title} delay={i * 80} variant="side">
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <h3
                  style={{
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    fontFamily: PANCHANG,
                    fontWeight: 700,
                    fontSize: 18,
                    color: "#F5F2ED",
                  }}
                >
                  <Diamond />
                  {item.title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontFamily: SATOSHI,
                    fontWeight: 400,
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: cbm("gray-300"),
                    textWrap: "pretty",
                  }}
                >
                  {item.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Oferta: o que está incluso, preço e prazo, sem ninguém precisar perguntar. */
export function LpOffer({ lp }: { lp: LandingConfig }) {
  if (!lp.offer) return null;
  const { heading, includes, price, deadline, note, alternative } = lp.offer;

  return (
    <section data-cm-section="offer" style={{ borderTop: `1px solid ${cbm("border")}` }}>
      <div
        style={{
          ...WRAP,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,360px),1fr))",
          gap: "clamp(36px,5vw,64px)",
          alignItems: "start",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <Reveal variant="wipe">
            <h2 style={{ ...H2, maxWidth: "16ch" }}>{heading}</h2>
          </Reveal>
          <ul
            style={{
              margin: "clamp(26px,4vh,38px) 0 0",
              padding: 0,
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {includes.map((item, i) => (
              <Reveal key={item} delay={i * 70} variant="side">
                <li
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 14,
                    fontFamily: SATOSHI,
                    fontWeight: 400,
                    fontSize: 16,
                    lineHeight: 1.5,
                    color: cbm("gray-100"),
                  }}
                >
                  <span style={{ marginTop: "0.4em", flex: "none" }}>
                    <Diamond />
                  </span>
                  {item}
                </li>
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal variant="scale">
          <div
            style={{
              padding: "clamp(24px,3vw,36px)",
              background: SURFACE.raised,
              border: "1px solid rgba(245,242,237,0.12)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: PANCHANG,
                fontWeight: 700,
                fontSize: "clamp(26px,3.2vw,40px)",
                lineHeight: 1.1,
                color: "#F5F2ED",
              }}
            >
              {price}
            </p>
            <p
              style={{
                margin: "12px 0 0",
                fontFamily: SATOSHI,
                fontWeight: 500,
                fontSize: 17,
                color: cbm("gray-100"),
              }}
            >
              {deadline}
            </p>
            <p
              style={{
                margin: "16px 0 0",
                fontFamily: SATOSHI,
                fontWeight: 400,
                fontSize: 15,
                lineHeight: 1.65,
                color: cbm("gray-300"),
              }}
            >
              {note}
            </p>
            <div style={{ marginTop: 26 }}>
              <LpCta label={lp.ctaLabel} message={lp.waMessage} size="lg" source="lp-offer" />
            </div>
            {alternative && (
              <p
                style={{
                  margin: "22px 0 0",
                  paddingTop: 18,
                  borderTop: "1px solid rgba(245,242,237,0.12)",
                  fontFamily: SATOSHI,
                  fontWeight: 400,
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: cbm("gray-300"),
                }}
              >
                {alternative}
              </p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: registrar os blocos em `app/lp/[segmento]/page.tsx`**

Trocar `Partial<Record<LandingBlock, ...>>` por `Record<LandingBlock, ...>`, simplificar a renderização e incluir os novos:

```tsx
import {
  LpDifferentials,
  LpFaq,
  LpFinal,
  LpHero,
  LpOffer,
  LpPains,
  LpProcess,
  LpPromise,
  LpProof,
} from "@/components/lp/LpBlocks";

const BLOCKS: Record<LandingBlock, (props: { lp: LandingConfig }) => JSX.Element | null> = {
  hero: LpHero,
  pains: LpPains,
  promise: LpPromise,
  proof: LpProof,
  differentials: LpDifferentials,
  offer: LpOffer,
  process: LpProcess,
  faq: LpFaq,
  final: LpFinal,
};
```

```tsx
        {lp.blocks.map((key) => {
          const Block = BLOCKS[key];
          return <Block key={key} lp={lp} />;
        })}
```

- [ ] **Step 6: verificar**

Run: `npm run typecheck && npm run lint`
Expected: sem erro.

Com `npm run dev` rodando e o navegador em `/lp/site-para-empresa`, nas larguras 390 px e 1440 px, sem rolagem horizontal:
- Ordem: cabeçalho, hero, portfólio, problema, diferenciais, oferta, processo, FAQ, CTA final, rodapé.
- Em 390 px, título, preço, prazo e CTA aparecem na primeira dobra, e nenhuma palavra do título passa da coluna.
- Machado, MJ e Valdete vêm primeiro, sem rótulo; Stige e Lentz aparecem depois do título do grupo, com "Projeto conceitual".
- As 6 perguntas do FAQ abrem, e os valores batem com `PUBLIC_PRICE`.

- [ ] **Step 7: commit**

```bash
git add data/landings.ts data/servicePages.ts components/lp/LpBlocks.tsx "app/lp/[segmento]/page.tsx"
git commit -m "feat(lp): landing de Google Ads para vender sites

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: verificação final na build de produção

Sem mudança de código prevista. Se algo falhar, corrigir na causa, repetir a verificação e commitar a correção com mensagem própria.

**Files:** nenhum.

⚠️ **Cuidado com métricas reais:** o GA4 e o Pixel desta build são os de produção, e o Coded Insights sempre carrega. Em todos os testes no navegador, bloquear `insights.codedbym.com`, `googletagmanager.com`, `google-analytics.com`, `connect.facebook.net`, `facebook.com` e `wa.me` com `page.route`, para nenhum clique de teste contar como dado real.

- [ ] **Step 1: testes e build sem as variáveis do Ads**

Run: `node --test scripts/campaign.test.mts scripts/analytics.test.mts scripts/palette.test.mts scripts/buttons.test.mts && npm run typecheck && npm run lint && npm run build`
Expected: tudo passa, e a saída do build lista `/lp/[segmento]` e `/privacidade`.

- [ ] **Step 2: confirmar que `three` não entra na rota**

```bash
node -e "
const fs=require('fs');
const m=JSON.parse(fs.readFileSync('.next/app-build-manifest.json','utf8')).pages['/lp/[segmento]/page'];
const hits=m.filter(f=>f.endsWith('.js')&&/WebGLRenderer|react-three/.test(fs.readFileSync('.next/'+f,'utf8')));
console.log(m.length,'chunks;','com three:',hits);
"
```

Expected: `com three: []`.

- [ ] **Step 3: conferir a rota com `npm run start` em segundo plano**

```bash
curl -s localhost:3000/lp/site-para-empresa | grep -c PREENCHER
curl -s localhost:3000/lp/arquitetura | grep -c PREENCHER
curl -s localhost:3000/lp/site-para-empresa | grep -o 'noindex' | head -1
curl -s localhost:3000/sitemap.xml | grep -c 'lp/'
curl -s localhost:3000/sitemap.xml | grep -c 'privacidade'
```

Expected: `0`, `0`, `noindex`, `0`, `1`.

- [ ] **Step 4: conferir origem e banner, sem IDs do Ads**

No navegador, com os bloqueios acima:
- `/lp/site-para-empresa?utm_campaign=site-empresa`: o `href` do CTA do hero, decodificado, termina em `(origem: site-empresa)`.
- `/lp/site-para-empresa?gclid=abc`: o `href` não traz "origem".
- Em 390 px, com o banner aberto, os CTAs do cabeçalho e do hero continuam clicáveis.
- Ao aceitar os cookies e clicar no CTA, `window.dataLayer` não traz nenhum evento `conversion`, e o console não mostra erro.
- Com `prefers-reduced-motion: reduce`, tudo aparece no estado final.
- Teclado: o foco fica visível nos links e botões da landing e do rodapé.

- [ ] **Step 5: conferir a conversão com um ID de teste**

Parar o servidor e rodar:

```bash
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-TESTE NEXT_PUBLIC_GOOGLE_ADS_WA_LABEL=rotulo npm run build
npm run start
```

No navegador, com os bloqueios acima:
- Antes de decidir sobre os cookies, clicar no CTA: `window.dataLayer` não existe ou não tem `conversion`, e nenhuma requisição para `googletagmanager.com` foi tentada.
- Depois de aceitar, clicar uma vez no CTA: `window.dataLayer` tem exatamente um `conversion`, com `send_to: "AW-TESTE/rotulo"`, e um `config` para `AW-TESTE`.

- [ ] **Step 6: medir o Lighthouse mobile**

Refazer o build sem as variáveis e rodar `npm run start`. Depois:

```bash
npx --yes lighthouse http://localhost:3000/lp/site-para-empresa --only-categories=performance --form-factor=mobile --quiet --chrome-flags="--headless" --output=json --output-path="$TEMP/lp-lighthouse.json"
node -e "const r=require(process.env.TEMP+'/lp-lighthouse.json');console.log('LCP',r.audits['largest-contentful-paint'].displayValue,'Score',r.categories.performance.score)"
```

Expected: LCP < 2,5 s. Se falhar, investigar o elemento em `largest-contentful-paint-element` antes de ajustar. Se a ferramenta não rodar neste ambiente, registrar isso e medir no preview, em vez de declarar o critério como atendido.

- [ ] **Step 7: limpar e registrar**

Parar o servidor. `git status --short` deve estar limpo, sem arquivos de teste nem variáveis commitadas.

Relatar o resultado de cada critério de sucesso da spec, incluindo o que não foi possível validar. A conversão real depende da conta do Google Ads.
