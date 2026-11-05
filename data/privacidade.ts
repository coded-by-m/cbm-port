/**
 * Copy de /privacidade. RASCUNHO: descreve o que o código faz hoje, precisa da
 * revisão do Matheus e não substitui revisão jurídica.
 *
 * Fica sem imports de propósito: o banner de cookies, que é client, importa
 * PRIVACY_PATH daqui.
 */

export const PRIVACY_PATH = "/privacidade";

export const PRIVACY_TITLE = "Política de privacidade";

export const PRIVACY_DESCRIPTION =
  "Quais dados o site da Coded by M coleta, para quê, com quem são compartilhados e como exercer seus direitos pela LGPD.";

export const PRIVACY_UPDATED = "5 de novembro de 2026";

export const PRIVACY_LEAD =
  "Esta página explica quais dados o site da Coded by M coleta, para quê, e o que você pode decidir sobre eles.";

/** `{whatsapp}` é trocado pelo número na página. */
export const PRIVACY_SECTIONS: { heading: string; paragraphs: string[] }[] = [
  {
    heading: "Quem é o responsável",
    paragraphs: [
      "A Coded by M é o estúdio de web design de Matheus Mendes, em Florianópolis (SC). Para falar sobre seus dados, use o WhatsApp {whatsapp}.",
    ],
  },
  {
    heading: "O que é coletado com o seu consentimento",
    paragraphs: [
      "Se você aceitar os cookies, o site carrega o Google Analytics, o Google Ads e o Meta Pixel. Essas ferramentas registram as páginas visitadas, de qual anúncio você veio e os cliques no WhatsApp. Com isso, meço quais páginas e anúncios funcionam e ajusto as campanhas.",
      "Se você recusar ou não decidir, nenhuma dessas ferramentas é carregada.",
    ],
  },
  {
    heading: "O que é coletado sem cookies",
    paragraphs: [
      "O site usa o Coded Insights, uma ferramenta própria de métricas, para contar visitas e cliques com base no legítimo interesse de entender como o site é usado. Ela não usa cookies e não recebe seu telefone ou e-mail.",
    ],
  },
  {
    heading: "Quando você fala comigo pelo WhatsApp",
    paragraphs: [
      "Os botões abrem o WhatsApp com uma mensagem pronta, que pode indicar de qual campanha você veio. O que você enviar na conversa, como nome, telefone e dados do projeto, é usado para responder, preparar o orçamento e atender o projeto.",
    ],
  },
  {
    heading: "Com quem os dados são compartilhados",
    paragraphs: [
      "Google e Meta, que também controla o WhatsApp, recebem os dados das ferramentas descritas acima e podem tratá-los fora do Brasil, conforme as regras de cada empresa. Seus dados não são vendidos.",
    ],
  },
  {
    heading: "Por quanto tempo os dados ficam guardados",
    paragraphs: [
      "Pelo tempo necessário para as finalidades acima ou para cumprir obrigações legais. Nas ferramentas de terceiros, valem também as regras de cada uma.",
    ],
  },
  {
    heading: "Seus direitos",
    paragraphs: [
      "Pela LGPD, você pode pedir a confirmação de que seus dados são tratados, acesso, correção, anonimização ou eliminação de dados desnecessários, portabilidade, informações sobre o compartilhamento e a revogação do consentimento. Faça o pedido pelo WhatsApp {whatsapp}. Você também pode reclamar à Autoridade Nacional de Proteção de Dados (ANPD).",
    ],
  },
];

export const PRIVACY_CHOICE_HEADING = "Sua escolha sobre cookies";

export const PRIVACY_CHOICE_TEXT =
  "Você pode mudar sua escolha aqui. A recusa vale daqui em diante. Cookies já gravados podem ser apagados nas configurações do navegador.";
