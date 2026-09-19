/**
 * As 4 etapas do processo da Coded by M.
 *
 * Fonte única: consumido pela zona Processo da experiência (/experiencia),
 * pelo bloco Processo da home e pelo "Como funciona" das landings de campanha.
 * Não duplique este copy em componente.
 */

export interface ProcessStep {
  /** Numeração visível. Ex: "01". */
  num: string;
  title: string;
  desc: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    num: "01",
    title: "Estratégia",
    desc: "Antes de desenhar, entender. Diagnóstico, escopo e posicionamento.",
  },
  {
    num: "02",
    title: "Design",
    desc: "Forma com intenção. Arquitetura, identidade e protótipo.",
  },
  {
    num: "03",
    title: "Código",
    desc: "Construído pra durar. Implementação, performance e qualidade.",
  },
  {
    num: "04",
    title: "Resultado",
    desc: "Não acaba no deploy. Mensuração, ajustes e evolução.",
  },
];
