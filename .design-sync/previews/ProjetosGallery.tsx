import "./_still";
import { ProjetosGallery } from "cbm-port";
import { CASE, CASE_B, CASE_SOON } from "./_fixtures";

// Largura inteira (a própria página tem maxWidth: 1240) — sem wrapper extra,
// é a página `/projetos` de verdade.

/** Uso canônico: catálogo com os três tipos reais, incluindo "em breve". */
export function Canonico() {
  return <ProjetosGallery projects={[CASE, CASE_B, CASE_SOON]} />;
}

/** Vitrine jovem: um único projeto publicado. */
export function UmProjeto() {
  return <ProjetosGallery projects={[CASE]} />;
}

/** Estado vazio real — antes do primeiro case entrar no catálogo. */
export function SemProjetos() {
  return <ProjetosGallery projects={[]} />;
}
