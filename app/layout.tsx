import type { Metadata } from "next";
import "./globals.css";
import { CursorTriangle } from "@/components/cursor/CursorTriangle";
import { Analytics } from "@/components/analytics/Analytics";
import { CookieConsent } from "@/components/analytics/CookieConsent";
import { WhatsAppFab } from "@/components/ui/WhatsAppFab";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { AgentationDev } from "@/components/dev/AgentationDev";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  HOME_DESCRIPTION,
  HOME_TITLE,
  OG,
  OG_SIZE,
  founderSchema,
  graph,
  organizationSchema,
  websiteSchema,
} from "@/lib/seo";

const TITLE = HOME_TITLE;
const DESCRIPTION = HOME_DESCRIPTION;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · Coded by M",
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Matheus Mendes" }],
  creator: SITE_NAME,
  /* Sem isto o iOS transforma o número do WhatsApp em link de chamada. */
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: SITE_NAME,
    // Sem `url` aqui: herdado, ele marcaria /lab e a 404 como a home. Cada
    // página indexável declara o seu.
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: OG.home, ...OG_SIZE, alt: "Coded by M — estúdio de web design" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG.home],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Só os 3 pesos da primeira dobra. Precarregar os 8 desperdiçaria
            banda justamente no momento crítico. O crossOrigin é obrigatório
            mesmo sendo mesma origem: sem ele o preload não casa com a
            requisição da fonte e o arquivo é baixado duas vezes. */}
        <link
          rel="preload"
          href="/fonts/Satoshi-400.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Panchang-700.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Panchang-800.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* Coded Insights — analytics first-party. */}
        <script defer src="https://insights.codedbym.com/tracker/v1.js" data-site="ci_pub_111f7f9b15d8d1c4bb6c77b2988079f5"></script>
        {/* Sem JavaScript o `Reveal` nunca dispara e o conteúdo ficaria em
            opacidade zero. Aqui ele aparece direto, sem a entrada. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important;filter:none!important;clip-path:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-screen bg-[#000F08] text-[#e0e0e0]">
        {/* Quem é o estúdio — o mesmo grafo em toda página, que as páginas
            referenciam por @id. */}
        <JsonLd data={graph(organizationSchema(), founderSchema(), websiteSchema())} />
        {children}
        <CursorTriangle />
        <WhatsAppFab />
        <CookieConsent />
        <Analytics />
        <AgentationDev />
      </body>
    </html>
  );
}
