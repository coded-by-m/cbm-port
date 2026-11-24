/**
 * Copy da vitrine `/projetos`. Sem preço nesta URL.
 *
 * O `title` não leva o sufixo "· Coded by M": o template do layout acrescenta.
 */

export const PROJETOS_TITLE = "Portfólio de sites e landing pages";

export const PROJETOS_H1 = "Projetos de sites e landing pages";

export const PROJETOS_INTRO =
  "Sites e landing pages feitos sob medida: clientes no ar e estudos conceituais. Veja o tipo de projeto e fale comigo se quiser o mesmo caminho.";

/** Mensagem do WhatsApp de quem vem do portfólio. */
export const PORTFOLIO_WA_MESSAGE =
  "Olá! Vi o portfólio da Coded by M e gostaria de conversar sobre um projeto.";

/**
 * Quem escaneia o QR do cartão impresso (`?utm_source=cartao`) vê a abertura
 * com estas falas no lugar do selo e do texto padrão. O H1 não muda.
 */
export const CARD_KICKER = "Matheus Mendes · Coded by M";
export const CARD_INTRO =
  "Oi, aqui é o Matheus, do cartão. Esses são os sites que eu fiz. Salve meu contato ou me chame no WhatsApp quando quiser.";
export const CARD_WA_MESSAGE =
  "Olá, Matheus! Peguei seu cartão e vi o portfólio da Coded by M. Quero conversar sobre um projeto.";

/**
 * A bobina: os três sites que aparecem inteiros na `/projetos`, na ordem de
 * leitura. Curadoria por qualidade de design (decisão de 2026-11-24). `tallH`
 * é a altura do print inteiro (`preview.desktop`, sempre 1440 de largura).
 * Os demais publicados entram na lista "Ver mais sites".
 */
export const BOBINA: { slug: string; tallH: number; line: string }[] = [
  {
    slug: "nord-arch",
    tallH: 6572,
    line: "Estudo para um escritório de arquitetura de Santa Catarina: as obras em tela cheia e um arquivo de projetos, do litoral à serra.",
  },
  {
    slug: "machado-plataformas",
    tallH: 6260,
    line: "Fabricante de plataformas de auto socorro em Palhoça. Um site técnico, que passa confiança e mostra o que sai da fábrica.",
  },
  {
    slug: "stige",
    tallH: 11444,
    line: "Estudo para uma empresa de escadas planejadas em Palhoça: geometria, material e processo numa página escura e precisa.",
  },
];
