/**
 * As paradas da cidade. A primeira é o hero; as outras são os capítulos, na
 * ordem em que o scroll passa por elas. `h` é a altura da placa no mundo (a
 * largura sai da proporção do HTML) e `side` é pra que lado a rota de quem
 * CLICA na placa de rua faz a curva: cada destino tem o seu caminho.
 *
 * Fica fora da cena de propósito: a bancada importa daqui sem puxar o three.
 */
export const STOPS = [
  { id: "top", x: 0, z: 6, ry: 0, h: 8, lift: 0, side: 0 },
  { id: "projetos", x: -5, z: -14, ry: 0.25, h: 5.5, lift: 0.6, side: -1 },
  { id: "servicos", x: 13, z: -8, ry: -0.8, h: 5.5, lift: 0.9, side: 1 },
  { id: "metodo", x: -14, z: -4, ry: 0.95, h: 5.5, lift: 0.3, side: -1 },
  { id: "sobre", x: 11, z: -22, ry: -0.45, h: 5.5, lift: 1.1, side: 1 },
  { id: "contato", x: -2, z: -31, ry: 0, h: 5.5, lift: 1.4, side: -0.4 },
] as const;
export const LAST = STOPS.length - 1;

/**
 * Roteiro do scroll, em fração (0 a 1) da altura do palco: até TRAVEL a câmera
 * visita as paradas em ordem; de DIVE_FROM em diante mergulha na última.
 */
export const TRAVEL = 0.9;
export const DIVE_FROM = 0.93;

/** Fração do scroll em que a câmera está parada na parada `i`. */
export const stopProgress = (i: number) => (i / LAST) * TRAVEL;

/**
 * O poste de placas: fica na frente do outdoor do hero, logo acima dos
 * telhados. `y` é o centro da pilha de placas.
 */
export const POST = { x: 0, y: 5.6, z: 13.5 };
/** Tamanho de cada placa do poste, no mundo. */
export const SIGN_W = 1.8;
export const SIGN_H = 0.4;
/** Ponta em triângulo, como fração da largura (a mesma do CSS). */
export const SIGN_TIP = 0.14;
/**
 * Os andares do poste, de cima pra baixo. `stop` é a parada pra onde a placa
 * leva, `dir` o lado pra que a ponta aponta e `yaw` o quanto ela vira.
 */
export const SIGNS = [
  { stop: 1, dir: -1, yaw: 0.3, level: 0.9 },
  { stop: 2, dir: 1, yaw: -0.32, level: 0.45 },
  { stop: 3, dir: -1, yaw: 0.14, level: 0 },
  { stop: 4, dir: 1, yaw: -0.2, level: -0.45 },
  { stop: 5, dir: 1, yaw: -0.06, level: -0.9 },
] as const;
/** Pedidos especiais em `go`: ir pro poste, e sair dele. */
export const GO_POST = -1;
export const GO_BACK = -2;
