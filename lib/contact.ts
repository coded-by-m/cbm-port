/**
 * Contato — fonte única da verdade.
 *
 * Todo botão/link de contato do site aponta pro WhatsApp da Coded by M por aqui.
 * Nunca hardcode o número em componente: importe `WHATSAPP_NUMBER` ou `waLink()`.
 */

/** Número do WhatsApp (formato wa.me, sem símbolos). +55 48 99991-6638 */
export const WHATSAPP_NUMBER = "5548999916638";

export const INSTAGRAM_URL = "https://instagram.com/codedbymstudio";
export const INSTAGRAM_HANDLE = "@codedbymstudio";

/** GitHub da Coded by M (confirmado em 2026-09-30). Não há LinkedIn. */
export const GITHUB_URL = "https://github.com/coded-by-m";

/**
 * Perfil do estúdio no Google Maps. O cid é o NAP aprovado (2026-10-28).
 * O mesmo href aparece no HTML de /sobre, /contato e no `sameAs` do ProfessionalService.
 */
export const GOOGLE_MAPS_URL = "https://maps.google.com/?cid=1362888323480500884";

/** Número formatado pra exibição. */
export const WHATSAPP_DISPLAY = "+55 48 99991-6638";

const DEFAULT_MESSAGE =
  "Olá! Vim pelo site da Coded by M e gostaria de conversar sobre um projeto.";

/** Link wa.me com mensagem pré-preenchida (usa a padrão se nenhuma for dada). */
export function waLink(message: string = DEFAULT_MESSAGE) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
