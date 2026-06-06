/**
 * HTML Overlay — configuração e dados.
 *
 * Ponte entre o 3D (fragmento na paisagem) e o HTML acessível
 * (card com conteúdo do projeto).
 */

import { FRAGMENTS } from "@/components/zones/ProjectFragments/config";

export interface ProjectCard {
  id: string;
  x: number;
  z: number;
  seed: number;
  title: string;
  type: string;
  description: string;
  href: string;
}

const SOURCE = new Map(FRAGMENTS.map((fragment) => [fragment.id, fragment]));

export const PROJECT_CARDS: ProjectCard[] = [
  {
    id: "a",
    title: "Machado Plataformas",
    type: "Web Design Premium",
    description: "Site institucional premium para empresa de implementos rodoviários.",
    href: "/cases/machado-plataformas",
    x: SOURCE.get("a")!.x,
    z: SOURCE.get("a")!.z,
    seed: SOURCE.get("a")!.seed,
  },
  {
    id: "b",
    title: "Vértice Arquitetura",
    type: "Site Institucional",
    description: "Presença digital para escritório de arquitetura contemporânea.",
    href: "/cases/vertice-arquitetura",
    x: SOURCE.get("b")!.x,
    z: SOURCE.get("b")!.z,
    seed: SOURCE.get("b")!.seed,
  },
  {
    id: "c",
    title: "Nexo Consultoria",
    type: "Landing Page",
    description: "Página de conversão para consultoria empresarial.",
    href: "/cases/nexo-consultoria",
    x: SOURCE.get("c")!.x,
    z: SOURCE.get("c")!.z,
    seed: SOURCE.get("c")!.seed,
  },
  {
    id: "d",
    title: "Onda Digital",
    type: "E-commerce",
    description: "Loja virtual com experiência de navegação premium.",
    href: "/cases/onda-digital",
    x: SOURCE.get("d")!.x,
    z: SOURCE.get("d")!.z,
    seed: SOURCE.get("d")!.seed,
  },
  {
    id: "e",
    title: "Cimento Base",
    type: "Site Institucional",
    description: "Plataforma digital para indústria de materiais.",
    href: "/cases/cimento-base",
    x: SOURCE.get("e")!.x,
    z: SOURCE.get("e")!.z,
    seed: SOURCE.get("e")!.seed,
  },
  {
    id: "f",
    title: "Pulso Saúde",
    type: "Web App",
    description: "Interface para plataforma de saúde digital.",
    href: "/cases/pulso-saude",
    x: SOURCE.get("f")!.x,
    z: SOURCE.get("f")!.z,
    seed: SOURCE.get("f")!.seed,
  },
  {
    id: "g",
    title: "Terra Incorporadora",
    type: "Landing Page",
    description: "Lançamento imobiliário com narrativa visual envolvente.",
    href: "/cases/terra-incorporadora",
    x: SOURCE.get("g")!.x,
    z: SOURCE.get("g")!.z,
    seed: SOURCE.get("g")!.seed,
  },
  {
    id: "h",
    title: "Forja Studio",
    type: "Portfolio",
    description: "Portfólio digital para estúdio de design de produto.",
    href: "/cases/forja-studio",
    x: SOURCE.get("h")!.x,
    z: SOURCE.get("h")!.z,
    seed: SOURCE.get("h")!.seed,
  },
  {
    id: "i",
    title: "Rota Logística",
    type: "Dashboard",
    description: "Painel de controle para operação logística integrada.",
    href: "/cases/rota-logistica",
    x: SOURCE.get("i")!.x,
    z: SOURCE.get("i")!.z,
    seed: SOURCE.get("i")!.seed,
  },
];

export const OVERLAY = {
  offsetX: 14,
  offsetY: 10,
  margin: 14,
  compactQuery: "(max-width: 640px), (pointer: coarse)",
} as const;

export const ACTIVE = {
  edgeOpacity: 0.7,
  nodeOpacity: 1,
  scale: 1.12,
  lift: 0.12,
  apexEmphasis: 0.36,
} as const;
