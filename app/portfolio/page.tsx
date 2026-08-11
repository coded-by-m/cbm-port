import type { Metadata } from "next";
import { getFeaturedCase } from "@/lib/portfolio";
import { PortfolioHeader } from "@/components/portfolio/PortfolioHeader";
import { PortfolioHero } from "@/components/portfolio/PortfolioHero";
import { ProjectGrid } from "@/components/portfolio/ProjectGrid";
import { ServicesList } from "@/components/portfolio/ServicesList";
import { ProcessSteps } from "@/components/portfolio/ProcessSteps";
import { AboutBlock } from "@/components/portfolio/AboutBlock";
import { ContactBlock } from "@/components/portfolio/ContactBlock";

const TITLE = "Portfólio · Coded by M";
const DESCRIPTION =
  "Estúdio de web design e desenvolvimento em Florianópolis. Landing pages, sites institucionais e aplicações web — do conceito ao site no ar.";
const OG_IMAGE = "/cases/machado/desktop-tall.webp";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

/**
 * Portfólio estático — a versão de leitura rápida da Home WebGL.
 *
 * Server Component. Nenhum import daqui puxa `three` ou `@react-three/*`;
 * o code splitting do App Router mantém a stack WebGL fora dessa rota.
 * Só `PortfolioHeader` e `PortfolioHero` são client.
 */
export default function PortfolioPage() {
  return (
    <div className="min-h-dvh bg-cbm-black text-cbm-white">
      <PortfolioHeader />
      <main className="pt-16">
        <PortfolioHero project={getFeaturedCase()} />
        <ProjectGrid />
        <ServicesList />
        <ProcessSteps />
        <AboutBlock />
        <ContactBlock />
      </main>
    </div>
  );
}
