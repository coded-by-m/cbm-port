import { paletteHex } from "@/lib/palette";
import { terrainSvg } from "@/lib/terrain";

/**
 * O terreno do contato da landing, como arquivo. Gerado no build (rota
 * estática) e carregado com `loading="lazy"`: a malha densa não pesa no HTML
 * de quem chega pelo anúncio no 4G, só baixa perto do fim da página.
 */
export const dynamic = "force-static";

export function GET() {
  const svg = terrainSvg({
    cols: 46,
    rows: 18,
    stroke: paletteHex("white"),
    strokeOpacity: 0.24,
    signal: paletteHex("red"),
  });
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
