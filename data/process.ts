/**
 * As 4 etapas do método da Coded by M.
 *
 * Fonte única: consumido pela zona Processo da Home (jornada 3D) e pelo
 * bloco Processo da rota /portfolio. Mudar aqui muda nos dois.
 */

export interface ProcessStep {
  /** Numeração visível ("01".."04"). */
  num: string;
  title: string;
  /** Uma frase curta de método + uma de entregáveis. */
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
