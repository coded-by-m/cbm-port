/**
 * Atribuição de campanha nas landings de tráfego pago.
 *
 * A conversão é WhatsApp direto, sem formulário — decisão do projeto. O buraco
 * disso é que o lead chega anônimo: você não sabe qual anúncio pagou por ele.
 *
 * A saída é carregar a origem DENTRO da mensagem pré-preenchida. Assim a
 * campanha aparece na própria conversa, que é onde a atribuição realmente
 * importa: quando o lead fecha, você sabe de onde ele veio sem cruzar relatório
 * nenhum.
 */

/** Parâmetros lidos da URL, na ordem de preferência para o rótulo. */
const KEYS = ["utm_content", "utm_campaign", "utm_source", "gclid", "fbclid"];

/** Rótulo curto da origem, ou `null` se a pessoa não veio de campanha. */
export function readCampaign(search: string): string | null {
  if (!search) return null;
  const p = new URLSearchParams(search);
  for (const k of KEYS) {
    const v = p.get(k);
    if (v) return v.slice(0, 48);
  }
  return null;
}

/**
 * Monta a mensagem do WhatsApp com a origem anexada.
 *
 * Sem campanha na URL, devolve a mensagem limpa — quem chegou por indicação
 * não precisa ver um código sem sentido no primeiro contato.
 */
export function messageWithCampaign(base: string, campaign: string | null) {
  return campaign ? `${base} (origem: ${campaign})` : base;
}
