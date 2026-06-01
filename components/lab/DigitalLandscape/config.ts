import type { ProjectCard } from "@/components/lab/HtmlOverlay/config";
import { FRAGMENTS } from "@/components/lab/ProjectFragments/config";
import {
  SCROLL_POSITIONS,
  VISIBILITY_ENVELOPES,
  ACTIVE_RANGES,
} from "@/components/lab/ScrollCamera/config";

const SOURCE = new Map(FRAGMENTS.map((f) => [f.id, f]));

export const LANDSCAPE_CARDS: ProjectCard[] = FRAGMENTS.map((frag, i) => ({
  id: frag.id,
  title: frag.label.replace("PROJECT ", "Project "),
  type: "Web Design",
  description: "Placeholder — projeto em desenvolvimento.",
  href: "#",
  x: SCROLL_POSITIONS[i]?.x ?? frag.x,
  z: SCROLL_POSITIONS[i]?.z ?? frag.z,
  seed: frag.seed,
}));

// Override first 3 with real content
const REAL_CONTENT: Partial<ProjectCard>[] = [
  {
    title: "Machado Plataformas",
    type: "Web Design Premium",
    description: "Site institucional premium para empresa de implementos rodoviários.",
    href: "/cases/machado-plataformas",
  },
  {
    title: "Vértice Arquitetura",
    type: "Site Institucional",
    description: "Presença digital para escritório de arquitetura contemporânea.",
    href: "/cases/vertice-arquitetura",
  },
  {
    title: "Nexo Consultoria",
    type: "Landing Page",
    description: "Página de conversão para consultoria empresarial.",
    href: "/cases/nexo-consultoria",
  },
  {
    title: "Onda Digital",
    type: "E-commerce",
    description: "Loja virtual com experiência de navegação premium.",
    href: "/cases/onda-digital",
  },
  {
    title: "Cimento Base",
    type: "Site Institucional",
    description: "Plataforma digital para indústria de materiais.",
    href: "/cases/cimento-base",
  },
  {
    title: "Pulso Saúde",
    type: "Web App",
    description: "Interface para plataforma de saúde digital.",
    href: "/cases/pulso-saude",
  },
  {
    title: "Terra Incorporadora",
    type: "Landing Page",
    description: "Lançamento imobiliário com narrativa visual envolvente.",
    href: "/cases/terra-incorporadora",
  },
  {
    title: "Forja Studio",
    type: "Portfolio",
    description: "Portfólio digital para estúdio de design de produto.",
    href: "/cases/forja-studio",
  },
  {
    title: "Rota Logística",
    type: "Dashboard",
    description: "Painel de controle para operação logística integrada.",
    href: "/cases/rota-logistica",
  },
];

REAL_CONTENT.forEach((content, i) => {
  if (LANDSCAPE_CARDS[i]) {
    Object.assign(LANDSCAPE_CARDS[i], content);
  }
});

export { VISIBILITY_ENVELOPES, ACTIVE_RANGES };
