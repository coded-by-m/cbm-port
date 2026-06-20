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

/** Tipo de entrega do projeto — dirige a cor sutil do fragmento na vitrine. */
export type ProjectType = "institucional" | "landing" | "webapp" | "ecommerce";

/** Mockups 3D/renderizados do projeto (gerados pelo Coded Atlas). */
export interface CaseMockups {
  /** Render 3D do desktop — peça central do showcase. */
  desktop3d?: string;
  /** Render 3D do mobile — sobreposto ao desktop no showcase. */
  mobile3d?: string;
  /** Mockup em moldura de navegador (flat). */
  browser?: string;
  /** Mockup em moldura de celular (flat). */
  phone?: string;
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
  /**
   * Tipo de entrega — dirige a cor do apex do fragmento na Paisagem.
   * Omitido → tratado como "institucional" (cor vermelha da marca).
   */
  type?: ProjectType;
  /** Stack técnica exibida na página de case (ex.: ["Next.js", "React"]). */
  stack?: string[];
  /**
   * Recortes de seção do site, exibidos na grade "As Telas" junto de
   * heroImages e gallery. Omitido → grade usa só hero/gallery.
   */
  sections?: string[];
  /**
   * Mockups 3D/renderizados. Quando presente, a página de case renderiza a
   * seção CaseShowcase entre a Visão Geral e As Telas.
   */
  mockups?: CaseMockups;
  /** Cores da marca do site capturado — tingem o gradiente do CaseShowcase. */
  palette?: string[];
}
