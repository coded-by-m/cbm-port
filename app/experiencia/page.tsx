import type { Metadata } from "next";
import { HomeExperience } from "@/components/home/HomeExperience";
import { OG, OG_SIZE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "A Experiência",
  description:
    "A experiência WebGL da Coded by M — nove capítulos navegáveis, do símbolo ao convite. Design, tecnologia e pensamento estrutural em movimento.",
  alternates: { canonical: "/experiencia" },
  openGraph: {
    title: "A Experiência · Coded by M",
    description:
      "Nove capítulos em WebGL, navegáveis um a um — o site da Coded by M montado camada por camada.",
    url: "/experiencia",
    type: "website",
    images: [{ url: OG.experiencia, ...OG_SIZE, alt: "A Experiência — Coded by M" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "A Experiência · Coded by M",
    description:
      "Nove capítulos em WebGL, navegáveis um a um — o site da Coded by M montado camada por camada.",
    images: [OG.experiencia],
  },
};

export default function ExperienciaPage() {
  return <HomeExperience />;
}
