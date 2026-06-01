/**
 * Registro central dos experimentos do Experience Lab.
 *
 * O Experience Lab valida riscos técnicos antes do site principal
 * (ver docs/06-technical-feasibility.md). Cada novo experimento deve ser
 * adicionado aqui e implementado em `components/lab/<Nome>`.
 */

export type ExperimentStatus = "ready" | "planned";

export interface Experiment {
  /** Identificador estável e amigável para URL. */
  slug: string;
  /** Nome exibido na central de experimentos. */
  title: string;
  /** O que o experimento valida. */
  description: string;
  /** "ready" = implementado e ativo; "planned" = placeholder preparado. */
  status: ExperimentStatus;
}

export const EXPERIMENTS: Experiment[] = [
  {
    slug: "opening-sequence",
    title: "Opening Sequence",
    description:
      "Logo CbM se constrói, marca se revela e dissolve na pirâmide triangulada com pontos de conteúdo — abertura cinematográfica do site.",
    status: "ready",
  },
  {
    slug: "pyramid",
    title: "Pyramid",
    description:
      "Pirâmide wireframe com faces trianguladas e 4 pontos de conteúdo revelados por scroll. Seção de posicionamento da marca.",
    status: "ready",
  },
  {
    slug: "triangle-loader",
    title: "Triangle Loader",
    description:
      "Pontos surgem, linhas conectam e o triângulo wireframe se forma e gira lentamente. Nada surge pronto: tudo é construído.",
    status: "ready",
  },
  {
    slug: "triangle-lines",
    title: "Triangle Lines",
    description:
      "Nós surgem, linhas conectam e os triângulos emergem como consequência. Uma malha triangulada cresce em profundidade e permanece viva — um sistema sendo construído.",
    status: "ready",
  },
  {
    slug: "terrain-mesh",
    title: "Terrain Mesh",
    description:
      "Malha triangulada procedural com profundidade real, respiração sutil e câmera de observação. Primeira versão da futura Paisagem Digital — apenas o terreno.",
    status: "ready",
  },
  {
    slug: "project-fragments",
    title: "Project Fragments",
    description:
      "Projetos como fragmentos triangulados descobertos sobre o terreno. Hover/toque destaca o fragmento e revela um marcador simples — sem cards, sem grade. Valida a descoberta dentro da futura Paisagem Digital.",
    status: "ready",
  },
  {
    slug: "html-overlay",
    title: "HTML Overlay",
    description:
      "Card HTML acessível ancorado à posição 3D do fragmento. A ponte entre Three.js e HTML: o fragmento continua 3D, o conteúdo do projeto é HTML navegável fora do canvas.",
    status: "ready",
  },
  {
    slug: "scroll-camera",
    title: "Scroll Camera",
    description:
      "A câmera percorre a paisagem conforme o scroll (GSAP ScrollTrigger + Lenis): visão ampla → foco em cada fragmento → retorno. Valida ritmo, legibilidade e narrativa comercial.",
    status: "ready",
  },
  {
    slug: "digital-landscape-v1",
    title: "Digital Landscape V1",
    description:
      "Prova de conceito da Paisagem Digital: terreno, câmera por scroll, fragmento ativo com overlay e fluxo completo até o case real (Machado Plataformas).",
    status: "ready",
  },
  {
    slug: "spatial-composition",
    title: "Spatial Composition",
    description:
      "Composição espacial pura: terreno + estrutura focal distante + câmera cinematográfica lenta + vinheta de hierarquia visual. Sem textos, sem overlay — a cena desperta curiosidade sozinha?",
    status: "ready",
  },
  {
    slug: "hero-to-landscape",
    title: "Hero → Landscape",
    description:
      "Transição B: passagem entre contemplação (hero) e exploração (scroll). Hero recua no fog, vignette dissolve, câmera troca de drift para scroll.",
    status: "ready",
  },
  {
    slug: "cta-formation",
    title: "CTA Formation",
    description:
      "Fragmentos convergindo para formar o símbolo da Coded by M — final cinematográfico.",
    status: "planned",
  },
];
