/**
 * Registro central dos experimentos do Experience Lab.
 *
 * O Experience Lab valida riscos técnicos antes do site principal
 * (ver docs/06-technical-feasibility.md). Cada novo experimento deve ser
 * adicionado aqui e implementado em `components/lab/<Nome>`.
 *
 * Ordem: pela jornada da home — cada item aparece na sequência em que sua
 * técnica entra em cena no site real (loading → intro → hero → paisagem).
 */

export type ExperimentStatus = "ready" | "planned";

export interface Experiment {
  /** Identificador estável e amigável para URL. */
  slug: string;
  /** Nome exibido na central de experimentos. */
  title: string;
  /** Em que momento da home esta técnica entra. */
  stage: "loading" | "intro" | "hero" | "problema" | "paisagem" | "servicos";
  /** O que o experimento valida. */
  description: string;
  /** "ready" = implementado e ativo; "planned" = placeholder preparado. */
  status: ExperimentStatus;
}

export const EXPERIMENTS: Experiment[] = [
  {
    slug: "triangle-loader",
    title: "Triangle Loader",
    stage: "loading",
    description:
      "Pontos surgem, linhas conectam e o triângulo wireframe se forma e gira lentamente. Nada surge pronto: tudo é construído.",
    status: "ready",
  },
  {
    slug: "triangle-lines",
    title: "Triangle Lines",
    stage: "intro",
    description:
      "Nós surgem, linhas conectam e os triângulos emergem como consequência. Uma malha triangulada cresce em profundidade e permanece viva — um sistema sendo construído.",
    status: "ready",
  },
  {
    slug: "pyramid",
    title: "Pyramid",
    stage: "hero",
    description:
      "Pirâmide wireframe com faces trianguladas e 4 pontos de conteúdo revelados por scroll. Seção de posicionamento da marca.",
    status: "ready",
  },
  {
    slug: "opening-sequence",
    title: "Opening Sequence",
    stage: "hero",
    description:
      "Logo CbM se constrói, marca se revela e dissolve na pirâmide triangulada com pontos de conteúdo — abertura cinematográfica do site. Composição de loading + intro + hero.",
    status: "ready",
  },
  {
    slug: "terrain-mesh",
    title: "Terrain Mesh",
    stage: "paisagem",
    description:
      "Malha triangulada procedural com profundidade real, respiração sutil e câmera de observação. Base da Paisagem Digital — apenas o terreno.",
    status: "ready",
  },
  {
    slug: "project-fragments",
    title: "Project Fragments",
    stage: "paisagem",
    description:
      "Projetos como fragmentos triangulados descobertos sobre o terreno. Hover/toque destaca o fragmento e revela um marcador simples — sem cards, sem grade.",
    status: "ready",
  },
  {
    slug: "html-overlay",
    title: "HTML Overlay",
    stage: "paisagem",
    description:
      "Card HTML acessível ancorado à posição 3D do fragmento. A ponte entre Three.js e HTML: o fragmento continua 3D, o conteúdo do projeto é HTML navegável fora do canvas.",
    status: "ready",
  },
  {
    slug: "scroll-camera",
    title: "Scroll Camera",
    stage: "paisagem",
    description:
      "A câmera percorre a paisagem conforme o scroll (GSAP ScrollTrigger + Lenis): visão ampla → foco em cada fragmento → retorno. Valida ritmo, legibilidade e narrativa comercial.",
    status: "ready",
  },
  {
    slug: "problem-section",
    title: "Problem Section",
    stage: "problema",
    description:
      "Field de cubos genéricos idênticos — argumento visual do diagnóstico. Conforme o scroll avança, o cubo central perde opacidade e uma torre triangulada com apex vermelho emerge no mesmo lugar.",
    status: "ready",
  },
  {
    slug: "services-section",
    title: "Services Section",
    stage: "servicos",
    description:
      "3 cards expandíveis (acordeon) — Landing Pages, Sites Institucionais, Aplicações Web. Cada um com mini-scene 3D específica + border-draw animation + CTA mailto.",
    status: "ready",
  },
];

/** Rótulo legível de cada estágio, para agrupamento na UI. */
export const STAGE_LABEL: Record<Experiment["stage"], string> = {
  loading: "Loading",
  intro: "Intro",
  hero: "Hero",
  problema: "Problema",
  paisagem: "Paisagem",
  servicos: "Serviços",
};

/** Ordem canônica dos estágios na jornada. */
export const STAGE_ORDER: Experiment["stage"][] = [
  "loading",
  "intro",
  "hero",
  "problema",
  "paisagem",
  "servicos",
];
