"use client";

import type { ComponentType } from "react";
import { Hero } from "@/components/site/Hero";
import { ProjectsSection } from "@/components/site/ProjectsSection";
import { ServicesSection } from "@/components/site/ServicesSection";
import { ProcessSection } from "@/components/site/ProcessSection";
import { AboutSection } from "@/components/site/AboutSection";
import { CapabilitiesSection } from "@/components/site/CapabilitiesSection";
import { ExperienceBridge } from "@/components/site/ExperienceBridge";
import { ContactSection } from "@/components/site/ContactSection";
import { SiteFooter } from "@/components/site/SiteFooter";
import { LpHeader } from "@/components/lp/LpHeader";
import { LpProcess } from "@/components/lp/LpBlocks";
import { GalleryHeader } from "@/components/projetos/GalleryHeader";
import { GalleryFooter } from "@/components/projetos/GalleryFooter";
import { SURFACE } from "@/components/site/shared";
import { LANDINGS } from "@/data/landings";
import { cbm } from "@/lib/palette";
import { Item } from "../Item";

/**
 * Seções inteiras do site, sem preview autorado no design-sync — não recebem
 * props, então entram como estão. O wrapper `.site-home` reproduz a base e as
 * regras de hover que a home aplica.
 */
const SECTIONS: [string, ComponentType][] = [
  ["Hero", Hero],
  ["ProjectsSection", ProjectsSection],
  ["ServicesSection", ServicesSection],
  ["ProcessSection", ProcessSection],
  ["AboutSection", AboutSection],
  ["CapabilitiesSection", CapabilitiesSection],
  ["ExperienceBridge", ExperienceBridge],
  ["ContactSection", ContactSection],
  ["SiteFooter", SiteFooter],
  ["LpHeader", () => <LpHeader message="Oi Matheus, vim pela landing" />],
  ["LpProcess", () => <LpProcess lp={LANDINGS[0]} />],
  ["GalleryHeader", () => <GalleryHeader />],
  ["GalleryFooter", () => <GalleryFooter />],
];

export function SiteSections() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      {SECTIONS.map(([name, Render], i) => {
        const id = `H-${String(i + 1).padStart(2, "0")}`;
        return (
          <Item key={id} id={id} name={name} wide>
            <div className="site-home" style={{ background: SURFACE.base, color: cbm("white") }}>
              <Render />
            </div>
          </Item>
        );
      })}
    </div>
  );
}
