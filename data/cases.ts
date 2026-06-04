import type { CaseProject } from "@/types/case";

export const cases: CaseProject[] = [
  {
    slug: "machado-plataformas",
    eyebrow: "Web Design Premium / Case Study",
    title: "Machado Plataformas",
    description:
      "Site institucional premium para uma empresa técnica de implementos rodoviários, com foco em percepção de valor, clareza comercial e presença digital mais profissional.",
    meta: {
      cliente: "Machado Plataformas",
      setor: "Implementos Rodoviários",
      tipo: "Site Institucional",
      ano: "2025",
    },
    heroImages: ["", "", "", "", ""],
    overview: {
      heading: "O que foi construído e por quê",
      body: [
        "A Machado Plataformas é uma empresa técnica de alto valor real, mas com uma presença digital que não refletia sua capacidade. O site anterior comunicava commodity, não expertise.",
        "O projeto partiu de um diagnóstico claro: o problema não era o produto, era a percepção. A solução foi construir uma presença digital que transmitisse a seriedade e a precisão que a empresa já tinha internamente.",
        "Cada decisão de design — da hierarquia tipográfica ao sistema de cores — foi orientada por um único critério: o visitante precisa sentir confiança antes de ler a primeira linha.",
      ],
      challenge:
        "Empresa técnica de alto valor percebido como commodity. Presença digital genérica não refletia a capacidade real do negócio.",
    },
    gallery: ["", "", "", "", ""],
    status: "published",
  },
  {
    slug: "estudio-mendes",
    eyebrow: "Em breve",
    title: "Estúdio Mendes",
    description:
      "Identidade digital e site para um estúdio de arquitetura focado em obras residenciais de alto padrão.",
    meta: {
      cliente: "Estúdio Mendes",
      setor: "Arquitetura",
      tipo: "Site Institucional",
      ano: "2026",
    },
    heroImages: [],
    overview: {
      heading: "",
      body: [],
      challenge: "",
    },
    gallery: [],
    status: "coming-soon",
  },
  {
    slug: "rota-clinica",
    eyebrow: "Em breve",
    title: "Rota Clínica",
    description:
      "Plataforma de agendamento e presença digital para uma rede de clínicas especializadas em fisioterapia.",
    meta: {
      cliente: "Rota Clínica",
      setor: "Saúde",
      tipo: "Plataforma + Site",
      ano: "2026",
    },
    heroImages: [],
    overview: {
      heading: "",
      body: [],
      challenge: "",
    },
    gallery: [],
    status: "coming-soon",
  },
];

export function getCaseBySlug(slug: string): CaseProject | undefined {
  return cases.find((c) => c.slug === slug);
}
