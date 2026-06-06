/**
 * Conteúdo HTML por capítulo da Home (sobre o HomeCanvas compartilhado).
 *
 * O canvas (terreno + fragmentos morphando + câmera) é o fundo 3D unificado;
 * este é o conteúdo legível que dá sentido a cada capítulo. Index casa com
 * HOME_CHAPTERS / chapterIndex.
 */
export interface ChapterContent {
  eyebrow: string;
  headline: string;
  body?: string;
  /** Itens curtos (ex.: serviços, valores) listados abaixo do corpo. */
  items?: string[];
  /** CTA opcional. `href` externo abre em nova aba; interno navega. */
  cta?: { label: string; href: string; external?: boolean };
  /** Alinhamento do bloco (ritmo: alterna pra não ficar monótono). */
  align?: "left" | "center";
}

export const HOME_CONTENT: ChapterContent[] = [
  {
    // 0 Logo — a marca 3D é o herói; HTML mínimo.
    eyebrow: "Coded by M",
    headline: "",
    align: "center",
  },
  {
    // 1 Manifesto
    eyebrow: "Manifesto",
    headline: "Cada pixel é uma decisão.",
    body: "Design e código, mesmo autor. A primeira impressão não se repete.",
    align: "center",
  },
  {
    // 2 Problema
    eyebrow: "01 · O problema",
    headline: "A maioria dos sites parece igual.",
    body: "Genéricos, esquecíveis, montados a partir do mesmo template. O problema raramente é o produto. É a percepção.",
    align: "left",
  },
  {
    // 3 Serviços
    eyebrow: "Serviços",
    headline: "Construímos presença digital.",
    body: "Para empresas que levam a sério.",
    items: ["Landing Pages", "Sites Institucionais", "Aplicações Web"],
    align: "left",
  },
  {
    // 4 Projetos
    eyebrow: "Projetos",
    headline: "O que já construímos.",
    body: "Cada projeto, uma decisão deliberada. Não há dois iguais.",
    align: "center",
  },
  {
    // 5 Processo
    eyebrow: "Método",
    headline: "Todo projeto percorre o mesmo caminho.",
    body: "Estrutura clara, sem improvisos.",
    items: ["Estratégia", "Design", "Código", "Resultado"],
    align: "left",
  },
  {
    // 6 Laboratório
    eyebrow: "Laboratório",
    headline: "Onde validamos antes de construir.",
    body: "Cada técnica do site nasce de um experimento isolado. Rigor técnico, provado.",
    cta: { label: "Visitar o laboratório", href: "/lab" },
    align: "left",
  },
  {
    // 7 Sobre
    eyebrow: "Sobre",
    headline: "Design, tecnologia e pensamento estrutural.",
    body: "Matheus Mendes — Florianópolis.",
    items: ["Precisão", "Elegância", "Detalhismo"],
    align: "center",
  },
  {
    // 8 Convite
    eyebrow: "Convite",
    headline: "Seu site atual está ótimo. Para 2014.",
    body: "O mercado evoluiu. Sua presença digital também deveria.",
    cta: {
      label: "Iniciar projeto",
      href:
        "https://wa.me/5548988354350?text=" +
        encodeURIComponent("Olá! Quero iniciar um projeto com a Coded by M."),
      external: true,
    },
    align: "center",
  },
];
