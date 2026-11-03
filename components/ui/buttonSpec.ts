/**
 * Números dos botões triangulares, num lugar só: os componentes leem daqui e
 * o teste de contraste (scripts/buttons.test.mts) também. Mexer num alpha
 * sem rodar o teste é o caminho para o texto voltar a ficar ilegível.
 */

/** MeshButton — malha que acorda. */
export const MESH = {
  /** Fundo do botão: `page` com este alpha (backdrop-blur por trás). */
  bgAlpha: 0.6,
  /** Filetes em repouso. */
  restLines: 0.08,
  /** Filetes acesos sob o cursor. */
  litLines: 0.85,
  /** Raio do círculo aceso, px. */
  litRadius: 90,
  /**
   * Placa `page` atrás do rótulo. Sem ela a linha acesa cruzando uma letra
   * derruba o contraste para ~1.2:1; com ela, o pior pixel fica acima de 7:1.
   */
  plate: 0.92,
  /** Esfumado da placa: horizontal, vertical (px). */
  plateFade: [18, 8] as const,
  /** Célula da malha por tamanho, px. */
  cell: { lg: 30, sm: 22 },
} as const;

/** FillButton — preenchimento a partir do cursor. */
export const FILL = {
  /** Janela total da onda, ms. */
  span: 1000,
  /** Duração de cada triângulo, ms. */
  step: 380,
  /** A saída leva esta fração da entrada. */
  exit: 0.6,
  /** Filetes `page` durante o preenchimento. */
  lines: 0.25,
  /** Furo dos filetes em volta do rótulo, px de esfumado. */
  holeFade: 10,
  /** Célula da malha por tamanho, px. */
  cell: { lg: 30, md: 26, sm: 20 },
} as const;
