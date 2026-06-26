import type { Metadata } from "next";
import { getPublishedBands } from "@/lib/galleryData";
import { GalleryHeader } from "@/components/projetos/GalleryHeader";
import { GalleryFooter } from "@/components/projetos/GalleryFooter";
import { ProjetosGallery } from "@/components/projetos/ProjetosGallery";

export const metadata: Metadata = {
  title: "Projetos · Coded by M",
  description:
    "Seleção de projetos da Coded by M — landing pages e sites institucionais premium, do conceito ao site no ar.",
  openGraph: {
    title: "Projetos · Coded by M",
    description:
      "Seleção de projetos da Coded by M — landing pages e sites institucionais premium.",
    type: "website",
    images: ["/cases/machado/desktop-tall.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projetos · Coded by M",
    description:
      "Seleção de projetos da Coded by M — landing pages e sites institucionais premium.",
    images: ["/cases/machado/desktop-tall.webp"],
  },
};

export default function ProjetosPage() {
  const bands = getPublishedBands();
  return (
    <div className="min-h-dvh bg-[#000F08] text-[#F5F2ED]">
      <GalleryHeader />
      <ProjetosGallery bands={bands} />
      <GalleryFooter />
    </div>
  );
}
