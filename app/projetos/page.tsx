import type { Metadata } from "next";
import { getPublishedProjects } from "@/lib/galleryData";
import { SURFACE } from "@/components/site/shared";
import { GalleryHeader } from "@/components/projetos/GalleryHeader";
import { GalleryFooter } from "@/components/projetos/GalleryFooter";
import { ProjetosGallery } from "@/components/projetos/ProjetosGallery";

export const metadata: Metadata = {
  title: "Projetos",
  description:
    "Seleção de projetos da Coded by M — landing pages e sites institucionais premium, do conceito ao site no ar.",
  openGraph: {
    title: "Projetos",
    description:
      "Seleção de projetos da Coded by M — landing pages e sites institucionais premium.",
    type: "website",
    images: ["/cases/machado/desktop-tall.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projetos",
    description:
      "Seleção de projetos da Coded by M — landing pages e sites institucionais premium.",
    images: ["/cases/machado/desktop-tall.webp"],
  },
};

export default function ProjetosPage() {
  const projects = getPublishedProjects();
  return (
    <div className="site-home min-h-dvh text-[#F5F2ED]" style={{ background: SURFACE.base }}>
      <GalleryHeader />
      <ProjetosGallery projects={projects} />
      <GalleryFooter />
    </div>
  );
}
