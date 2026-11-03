"use client";

import dynamic from "next/dynamic";
import type { PaletteId } from "@/lib/palette";
import { SURFACE } from "@/components/site/shared";
import { Item } from "../Item";

const TerrainMesh = dynamic(
  () => import("@/components/zones/TerrainMesh").then((m) => m.TerrainMesh),
  { ssr: false },
);
const Footer = dynamic(() => import("@/components/zones/CTASection/Footer"), { ssr: false });

/**
 * Seção S: a cena WebGL. O three.js lê as cores uma vez, na montagem
 * (`paletteHex`), então cada troca de paleta remonta a cena pela `key`.
 */
export function Scene({ palette }: { palette: PaletteId }) {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Item id="S-01" name="TerrainMesh (experimento do Experience Lab)" wide>
        <div key={palette} style={{ position: "relative", height: 480 }}>
          <TerrainMesh />
        </div>
      </Item>
      <Item id="S-02" name="Footer da home com FooterLandscape" wide>
        <div key={palette} className="site-home">
          <Footer background={SURFACE.base} />
        </div>
      </Item>
    </div>
  );
}
