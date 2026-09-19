import { SiteHeader } from "@/components/site/SiteHeader";
import { Hero } from "@/components/site/Hero";
import { ProjectsSection } from "@/components/site/ProjectsSection";
import { ServicesSection } from "@/components/site/ServicesSection";
import { ProcessSection } from "@/components/site/ProcessSection";
import { AboutSection } from "@/components/site/AboutSection";
import { ContactSection } from "@/components/site/ContactSection";
import { SiteFooter } from "@/components/site/SiteFooter";

/**
 * Home estática — a porta de entrada do site.
 *
 * Sem WebGL: nada aqui importa `three` ou `@react-three/*`, pra que o bundle
 * desta rota não carregue a stack 3D. A experiência de 9 capítulos vive em
 * `/experiencia` e é linkada de lá.
 */
export default function HomePage() {
  return (
    <div style={{ background: "#000F08", color: "#F5F2ED", overflowX: "hidden" }}>
      <SiteHeader />
      <main>
        <Hero />
        <ProjectsSection />
        <ServicesSection />
        <ProcessSection />
        <AboutSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  );
}
