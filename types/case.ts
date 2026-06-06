export interface CaseMeta {
  cliente: string;
  setor: string;
  tipo: string;
  ano: string;
}

export interface CaseOverviewData {
  heading: string;
  body: string[];
  challenge: string;
}

export interface CaseProject {
  slug: string;
  eyebrow: string;
  title: string;
  /** Resumo curto (1-2 frases) usado no card de hover na Paisagem. */
  description: string;
  meta: CaseMeta;
  heroImages: string[];
  overview: CaseOverviewData;
  gallery: string[];
  /**
   * Estado do case na vitrine.
   *  - "published" (default): clickable, vai para /cases/[slug]
   *  - "coming-soon": fragmento renderiza mas card mostra "Em breve" e click é no-op
   */
  status?: "published" | "coming-soon";
  /** Domínio exibido na barra do BrowserFrame (ex.: "machadoplataformas.com.br"). */
  siteUrl?: string;
  /**
   * Imagens de preview mostradas no card de hover da Paisagem.
   * - desktop: screenshot da home/landing (aspect ~16:10)
   * - mobile: screenshot do mobile (aspect ~9:16)
   * Quando omitido (ou em coming-soon), um placeholder triangulado é renderizado.
   */
  preview?: {
    desktop: string;
    mobile: string;
  };
}
