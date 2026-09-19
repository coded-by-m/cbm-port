import type { Metadata } from "next";
import "./globals.css";
import { CursorTriangle } from "@/components/cursor/CursorTriangle";
import { Analytics } from "@/components/analytics/Analytics";
import { CookieConsent } from "@/components/analytics/CookieConsent";
import { WhatsAppFab } from "@/components/ui/WhatsAppFab";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { AgentationDev } from "@/components/dev/AgentationDev";

const TITLE = "Coded by M — Webdesign e websoftware sob medida";
const DESCRIPTION =
  "Estúdio de webdesign e websoftware em Florianópolis. Landing pages, sites institucionais e aplicações web construídos sob medida — do conceito ao site no ar.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · Coded by M",
  },
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    images: ["/cases/machado/desktop-tall.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/cases/machado/desktop-tall.webp"],
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
      </head>
      <body className="min-h-screen bg-[#000F08] text-[#e0e0e0]">
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
