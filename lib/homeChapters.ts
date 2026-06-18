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
  /** Gestos secundários daquela seção (todos os controles disponíveis). */
  gestures?: string[];
}

export const HOME_CHAPTERS: HomeChapter[] = [
  { id: "logo", label: "Logo", cue: null }, // intro travada; o LogoIntro mostra o próprio "role para continuar"
  { id: "manifesto", label: "Manifesto", cue: "Role para avançar", gestures: ["↑ volta ao logo", "→ pula"] },
  { id: "problema", label: "Problema", cue: "Role para revelar", gestures: ["cada rolada constrói um beat"] },
  { id: "servicos", label: "Serviços", cue: "Clique para explorar", gestures: ["role nos cards", "↑↓ troca seção"] },
  { id: "projetos", label: "Projetos", cue: "Arraste para girar", gestures: ["clique abre o case", "← → navega", "espaço pausa"] },
  { id: "processo", label: "Processo", cue: "Role para percorrer", gestures: ["cada etapa é um beat"] },
  { id: "laboratorio", label: "Laboratório", cue: "Entre no laboratório", gestures: ["role para sair"] },
  { id: "sobre", label: "Sobre", cue: null },
  { id: "convite", label: "Convite", cue: "Role — o convite se forma" },
];
