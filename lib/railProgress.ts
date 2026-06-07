/**
 * Sub-progresso do capítulo ativo (0..1), escrito pelos beat-steppers
 * (Manifesto / Problema / Processo) e lido pela ChapterRail pra preencher o
 * marcador ativo conforme os beats internos avançam — já que esses capítulos
 * são 100vh wheel-jacked e a janela não rola durante os beats.
 *
 * `active` = há um stepper reportando agora (senão a trilha cai no progresso
 * por scroll do elemento ativo).
 */
export const railSub = { value: 0, active: false };
