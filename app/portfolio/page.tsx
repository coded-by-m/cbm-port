import type { Metadata } from "next";
import { getFeaturedCase } from "@/lib/portfolio";
import { PortfolioHeader } from "@/components/portfolio/PortfolioHeader";
import { PortfolioHero } from "@/components/portfolio/PortfolioHero";
import { ProjectGrid } from "@/components/portfolio/ProjectGrid";

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

export default function PortfolioPage() {
  return (
    <div className="min-h-dvh bg-cbm-black text-cbm-white">
      <PortfolioHeader />
      <main className="pt-16">
        <PortfolioHero project={getFeaturedCase()} />
        <ProjectGrid />
      </main>
    </div>
  );
}
