// Peças do lab que vêm dos previews do design-sync — os mesmos que vão ao
// Claude Design. Revisar aqui é revisar o que será enviado.
//
// Cada export em função de um preview é uma variante. A ordem é a do registro
// e, dentro de cada preview, alfabética com a canônica primeiro — estável entre
// recarregamentos, para o ID (B-03, C-12…) continuar apontando para a mesma peça.
import type { ComponentType } from "react";
import * as MeshButton from "@/.design-sync/previews/MeshButton";
import * as FillButton from "@/.design-sync/previews/FillButton";
import * as LpCta from "@/.design-sync/previews/LpCta";
import * as CaseLiveButton from "@/.design-sync/previews/CaseLiveButton";
import * as CaseBackButton from "@/.design-sync/previews/CaseBackButton";
import * as WhatsAppFab from "@/.design-sync/previews/WhatsAppFab";
import * as LogoMark from "@/.design-sync/previews/LogoMark";
import * as LogoMarkSvg from "@/.design-sync/previews/LogoMarkSvg";
import * as TriangleMark from "@/.design-sync/previews/TriangleMark";
import * as Diamond from "@/.design-sync/previews/Diamond";
import * as TriText from "@/.design-sync/previews/TriText";
import * as SectionHead from "@/.design-sync/previews/SectionHead";
import * as Reveal from "@/.design-sync/previews/Reveal";
import * as SiteHeader from "@/.design-sync/previews/SiteHeader";
import * as FilterChips from "@/.design-sync/previews/FilterChips";
import * as ProjetoGridCard from "@/.design-sync/previews/ProjetoGridCard";
import * as ProjetosGallery from "@/.design-sync/previews/ProjetosGallery";
import * as BrowserFrame from "@/.design-sync/previews/BrowserFrame";
import * as PhoneFrame from "@/.design-sync/previews/PhoneFrame";
import * as LiveScreenshot from "@/.design-sync/previews/LiveScreenshot";
import * as ProjectFacts from "@/.design-sync/previews/ProjectFacts";
import * as CaseHero from "@/.design-sync/previews/CaseHero";
import * as CaseOverview from "@/.design-sync/previews/CaseOverview";
import * as CaseShowcase from "@/.design-sync/previews/CaseShowcase";
import * as CaseScreens from "@/.design-sync/previews/CaseScreens";
import * as CaseResponsive from "@/.design-sync/previews/CaseResponsive";
import * as CaseFrameScroll from "@/.design-sync/previews/CaseFrameScroll";
import * as LpHero from "@/.design-sync/previews/LpHero";
import * as LpPains from "@/.design-sync/previews/LpPains";
import * as LpPromise from "@/.design-sync/previews/LpPromise";
import * as LpProof from "@/.design-sync/previews/LpProof";
import * as LpFaq from "@/.design-sync/previews/LpFaq";
import * as LpFinal from "@/.design-sync/previews/LpFinal";

export interface PreviewEntry {
  name: string;
  mod: Record<string, unknown>;
  wide?: boolean;
}

export interface PreviewGroup {
  prefix: string;
  anchor: string;
  title: string;
  entries: PreviewEntry[];
}

export const PREVIEW_GROUPS: PreviewGroup[] = [
  {
    prefix: "B",
    anchor: "botoes",
    title: "Botões",
    entries: [
      { name: "MeshButton", mod: MeshButton },
      { name: "FillButton", mod: FillButton },
      { name: "LpCta", mod: LpCta },
      { name: "CaseLiveButton", mod: CaseLiveButton },
      { name: "CaseBackButton", mod: CaseBackButton },
      { name: "WhatsAppFab", mod: WhatsAppFab },
    ],
  },
  {
    prefix: "M",
    anchor: "marca",
    title: "Marca",
    entries: [
      { name: "LogoMark", mod: LogoMark },
      { name: "LogoMarkSvg", mod: LogoMarkSvg },
      { name: "TriangleMark", mod: TriangleMark },
      { name: "Diamond", mod: Diamond },
      { name: "TriText", mod: TriText },
      { name: "SectionHead", mod: SectionHead },
      { name: "Reveal", mod: Reveal },
    ],
  },
  {
    prefix: "C",
    anchor: "componentes",
    title: "Componentes",
    entries: [
      { name: "SiteHeader", mod: SiteHeader, wide: true },
      { name: "FilterChips", mod: FilterChips },
      { name: "ProjetoGridCard", mod: ProjetoGridCard },
      { name: "ProjetosGallery", mod: ProjetosGallery, wide: true },
      { name: "BrowserFrame", mod: BrowserFrame },
      { name: "PhoneFrame", mod: PhoneFrame },
      { name: "LiveScreenshot", mod: LiveScreenshot },
      { name: "ProjectFacts", mod: ProjectFacts },
      { name: "CaseHero", mod: CaseHero, wide: true },
      { name: "CaseOverview", mod: CaseOverview, wide: true },
      { name: "CaseShowcase", mod: CaseShowcase, wide: true },
      { name: "CaseScreens", mod: CaseScreens, wide: true },
      { name: "CaseResponsive", mod: CaseResponsive, wide: true },
      { name: "CaseFrameScroll", mod: CaseFrameScroll, wide: true },
      { name: "LpHero", mod: LpHero, wide: true },
      { name: "LpPains", mod: LpPains, wide: true },
      { name: "LpPromise", mod: LpPromise, wide: true },
      { name: "LpProof", mod: LpProof, wide: true },
      { name: "LpFaq", mod: LpFaq, wide: true },
      { name: "LpFinal", mod: LpFinal, wide: true },
    ],
  }
];

const FIRST = ["Canonico", "Padrao"];

export interface PreviewItem {
  id: string;
  name: string;
  wide: boolean;
  Render: ComponentType;
}

/** Variantes do grupo, numeradas: B-01, B-02… */
export function itemsOf(group: PreviewGroup): PreviewItem[] {
  const out: PreviewItem[] = [];
  for (const e of group.entries) {
    const variants = Object.keys(e.mod)
      .filter((k) => typeof e.mod[k] === "function" && /^[A-Z]/.test(k))
      .sort((a, b) => Number(FIRST.includes(b)) - Number(FIRST.includes(a)) || a.localeCompare(b));
    for (const v of variants)
      out.push({
        id: `${group.prefix}-${String(out.length + 1).padStart(2, "0")}`,
        name: `${e.name} · ${v}`,
        wide: e.wide ?? false,
        Render: e.mod[v] as ComponentType,
      });
  }
  return out;
}
