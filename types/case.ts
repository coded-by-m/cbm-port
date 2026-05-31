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
  description: string;
  meta: CaseMeta;
  heroImages: string[];
  overview: CaseOverviewData;
  gallery: string[];
}
