import type { Metadata } from "next";
import { HomeExperience } from "@/components/home/HomeExperience";

export const metadata: Metadata = {
  title: "A Experiência",
  description:
    "A experiência WebGL da Coded by M — nove capítulos navegáveis, do símbolo ao convite. Design, tecnologia e pensamento estrutural em movimento.",
};

export default function ExperienciaPage() {
  return <HomeExperience />;
}
