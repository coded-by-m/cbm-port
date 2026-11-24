import { ABOUT } from "@/data/about";
import { INSTAGRAM_URL, WHATSAPP_NUMBER } from "@/lib/contact";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

/**
 * Cartão de contato (vCard 3.0) pro botão "Salvar contato" da `/projetos`.
 *
 * Quem escaneia o QR do cartão impresso cai na vitrine; daqui ele leva o
 * contato pra agenda do celular. Servido inline: o iPhone abre a ficha de
 * "Novo contato" direto, o Android baixa e importa.
 *
 * Só dados que já são públicos no site (nome, WhatsApp, Instagram, cidade).
 */
export function GET() {
  const [first, ...rest] = ABOUT.founder.name.split(" ");
  const last = rest.join(" ");
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${last};${first};;;`,
    `FN:${ABOUT.founder.name}`,
    `ORG:${SITE_NAME}`,
    "TITLE:Fundador",
    `TEL;TYPE=CELL,VOICE:+${WHATSAPP_NUMBER}`,
    `URL:${SITE_URL}`,
    `X-SOCIALPROFILE;TYPE=instagram:${INSTAGRAM_URL}`,
    "ADR;TYPE=WORK:;;;Florianópolis;SC;;Brasil",
    "NOTE:Criação de sites e landing pages sob medida",
    "END:VCARD",
  ];
  return new Response(lines.join("\r\n") + "\r\n", {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'inline; filename="matheus-mendes-coded-by-m.vcf"',
      "X-Robots-Tag": "noindex",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
