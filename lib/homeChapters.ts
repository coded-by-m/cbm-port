/**
 * Capítulos da jornada da Home — fonte única pra trilha global (ChapterRail)
 * e pro cue de interação (InteractionCue).
 *
 * Um capítulo = uma seção top-level (LazySection) na ordem da página. Serviços
 * não é capítulo próprio: vive como o outro do Problema (resolução da tensão).
 *
 * `cue` é o verbo de interação explícito daquela seção. `null` = seção passiva
 * (leitura), sem cue.
 */
export interface HomeChapter {
  id: string;
  label: string;
  cue: string | null;
}

export const HOME_CHAPTERS: HomeChapter[] = [
  { id: "logo", label: "Logo", cue: "A marca se constrói" },
  { id: "manifesto", label: "Manifesto", cue: "Role para avançar o manifesto" },
  { id: "problema", label: "Problema", cue: "Role para revelar" },
  { id: "servicos", label: "Serviços", cue: "Clique para abrir cada serviço" },
  { id: "projetos", label: "Projetos", cue: "Arraste para girar · role para seguir" },
  { id: "processo", label: "Processo", cue: "Role para percorrer o método" },
  { id: "laboratorio", label: "Laboratório", cue: "Entre no laboratório" },
  { id: "sobre", label: "Sobre", cue: null },
  { id: "convite", label: "Convite", cue: "Role — o convite se forma" },
];
