import type { Metadata } from "next";
import { SURFACE } from "@/components/site/shared";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { Hero } from "@/components/site/Hero";
import { ProjectsSection } from "@/components/site/ProjectsSection";
import { ServicesSection } from "@/components/site/ServicesSection";
import { ProcessSection } from "@/components/site/ProcessSection";
import { AboutSection } from "@/components/site/AboutSection";
import { CapabilitiesSection } from "@/components/site/CapabilitiesSection";
import { ContactSection } from "@/components/site/ContactSection";
import Footer from "@/components/zones/CTASection/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { HOME_DESCRIPTION, HOME_TITLE, OG, OG_SIZE, graph, webPageSchema } from "@/lib/seo";

/**
 * Home estática — a porta de entrada do site.
 *
 * Sem WebGL: nada aqui importa `three` ou `@react-three/*`, pra que o bundle
 * desta rota não carregue a stack 3D. A experiência de 9 capítulos vive em
 * `/experiencia` e é linkada de lá.
 */
/**
 * Título e descrição vêm do layout raiz. O `openGraph` é redeclarado inteiro
 * porque o Next não mescla objetos aninhados: declarar só a `url` apagaria o
 * resto do herdado.
 */
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Coded by M",
    url: "/",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [{ url: OG.home, ...OG_SIZE, alt: "Coded by M — estúdio de web design" }],
  },
};

const PAGE_SCHEMA = graph(
  webPageSchema({
    path: "/",
    name: HOME_TITLE,
    description: HOME_DESCRIPTION,
    image: OG.home,
  }),
);

export default function HomePage() {
  return (
    <div className="site-home" style={{ background: SURFACE.base, color: "#F5F2ED", overflowX: "hidden" }}>
      <JsonLd data={PAGE_SCHEMA} />
      <SmoothScroll />
      <SiteHeader />
      <main>
        <Hero />
        <ProjectsSection />
        <ServicesSection />
        <ProcessSection />
        <AboutSection />
        <CapabilitiesSection />
        <ContactSection />
      </main>
      <Footer background={SURFACE.base} />
    </div>
  );
}
