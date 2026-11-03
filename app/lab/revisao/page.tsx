"use client";

import { cbm } from "@/lib/palette";
import { PaletteBar, usePalette } from "./PaletteBar";
import { LabSection } from "./Item";
import { PREVIEW_GROUPS } from "./registry";
import { Colors } from "./sections/Colors";
import { Previews } from "./sections/Previews";
import { SiteSections } from "./sections/SiteSections";
import { Scene } from "./sections/Scene";
import { Posts } from "./sections/Posts";
import { MeshButtonLab } from "./sections/MeshButtonLab";

const NOTES: Record<string, string> = {
  botoes:
    "Todos os botões do sistema, como vão ao Claude Design. Passe o mouse e use o Tab para ver hover e foco reais.",
  marca: "Primitivos de marca: logo, triângulo, losango, títulos com contorno.",
  componentes: "Componentes do site, das landings, da vitrine e dos cases, com os dados de exemplo do design-sync.",
};

/**
 * Lab de revisão: troca a paleta ao vivo sobre as peças reais.
 *
 * O que NÃO muda ao trocar de paleta está com cor escrita direto no código —
 * o lab é também o detector do que falta corrigir.
 */
export default function RevisaoPage() {
  const [palette, setPalette] = usePalette();

  return (
    <div style={{ minHeight: "100vh", background: cbm("page"), color: cbm("white") }}>
      <PaletteBar id={palette} onChange={setPalette} />
      <main>
        <LabSection
          id="prototipos"
          title="Protótipos: MeshButton"
          note="Quatro direções para o botão principal, ao lado do atual (X-00). Malha na proporção real, nada anima em repouso, foco visível. Itens X-."
        >
          <MeshButtonLab />
        </LabSection>
        <LabSection
          id="cores"
          title="Cores"
          note="Paleta em revisão. Contraste calculado contra base e surface (WCAG). Itens K-."
        >
          <Colors palette={palette} />
        </LabSection>
        {PREVIEW_GROUPS.map((g) => (
          <LabSection key={g.prefix} id={g.anchor} title={g.title} note={`${NOTES[g.anchor] ?? ""} Itens ${g.prefix}-.`}>
            <Previews group={g} />
          </LabSection>
        ))}
        <LabSection
          id="secoes"
          title="Seções do site"
          note="Seções inteiras da home, das landings e da vitrine. Itens H-."
        >
          <SiteSections />
        </LabSection>
        <LabSection id="cena" title="Cena 3D" note="Terreno e rodapé em WebGL; remontam a cada troca de paleta. Itens S-.">
          <Scene palette={palette} />
        </LabSection>
        <LabSection id="posts" title="Posts" note="Carrosséis em 25%. Itens P-.">
          <Posts />
        </LabSection>
      </main>
    </div>
  );
}
