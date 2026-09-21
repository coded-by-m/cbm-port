// Entrada do design system para o claude.ai/design.
//
// O cbm-port e um app Next.js, nao uma biblioteca publicada: nao existe dist/
// nem barrel de biblioteca. Este arquivo e esse barrel — ele define exatamente
// quais componentes entram no bundle que o agente de design importa.
//
// Escopo deliberado (ver .design-sync/NOTES.md): as pecas de marca reutilizaveis
// de components/{ui,site,lp,projetos,case}. Ficam de fora components/zones e
// components/three (cena WebGL dirigida por scroll, nao compoem interface) e os
// wrappers de comportamento sem render proprio.

// -- Primitivos ------------------------------------------------------------
export { LogoMark } from "../components/ui/LogoMark";
export { MeshButton } from "../components/ui/MeshButton";
export { Reveal } from "../components/ui/Reveal";
export { StrokeText } from "../components/ui/StrokeText";
export { WhatsAppFab } from "../components/ui/WhatsAppFab";
export { Diamond, TriangleMark, SectionHead, LogoMarkSvg } from "../components/site/shared";

// Os tokens do sistema. Nao viram card (o conversor filtra nomes em caixa
// alta), mas ficam em window.CodedByM — e sao a fonte unica das superficies,
// das duas familias tipograficas e do ritmo vertical das secoes. Sem eles o
// agente de design teria de adivinhar os valores a partir dos componentes.
export {
  SATOSHI,
  PANCHANG,
  SURFACE,
  INK,
  BASE_RGB,
  SUNKEN_RGB,
  SECTION,
} from "../components/site/shared";

// -- Site ------------------------------------------------------------------
export { SiteHeader } from "../components/site/SiteHeader";
export { SiteFooter } from "../components/site/SiteFooter";
export { Hero } from "../components/site/Hero";
export { AboutSection } from "../components/site/AboutSection";
export { CapabilitiesSection } from "../components/site/CapabilitiesSection";
export { ContactSection } from "../components/site/ContactSection";
export { ExperienceBridge } from "../components/site/ExperienceBridge";
export { ProcessSection } from "../components/site/ProcessSection";
export { ProjectsSection } from "../components/site/ProjectsSection";
export { ServicesSection } from "../components/site/ServicesSection";

// -- Landing pages ---------------------------------------------------------
export { LpHeader } from "../components/lp/LpHeader";
export { LpCta } from "../components/lp/LpCta";
export {
  LpHero,
  LpPains,
  LpPromise,
  LpProof,
  LpProcess,
  LpFaq,
  LpFinal,
} from "../components/lp/LpBlocks";

// -- Vitrine de projetos ---------------------------------------------------
export { FilterChips } from "../components/projetos/FilterChips";
export { GalleryHeader } from "../components/projetos/GalleryHeader";
export { GalleryFooter } from "../components/projetos/GalleryFooter";
export { ProjetoGridCard } from "../components/projetos/ProjetoGridCard";
export { ProjetosGallery } from "../components/projetos/ProjetosGallery";

// -- Paginas de case -------------------------------------------------------
export { CaseHero } from "../components/case/CaseHero";
export { CaseOverview } from "../components/case/CaseOverview";
export { CaseShowcase } from "../components/case/CaseShowcase";
export { CaseScreens } from "../components/case/CaseScreens";
export { CaseResponsive } from "../components/case/CaseResponsive";
export { CaseReturnCTA } from "../components/case/CaseReturnCTA";
export { CaseBackButton } from "../components/case/CaseBackButton";
export { CaseLiveButton } from "../components/case/CaseLiveButton";
export { CaseFrameScroll } from "../components/case/CaseFrameScroll";
export { BrowserFrame } from "../components/case/BrowserFrame";
export { PhoneFrame } from "../components/case/PhoneFrame";
export { LiveScreenshot } from "../components/case/LiveScreenshot";
export { ProjectFacts } from "../components/case/ProjectFacts";
