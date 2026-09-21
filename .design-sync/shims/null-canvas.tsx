// Fundo WebGL neutralizado.
//
// FooterLandscape e TerrainBackground sao camadas decorativas de canvas vindas
// de components/zones — a cena three.js dirigida por scroll, que ficou fora do
// escopo deste design system. Elas entram aqui por um import() dentro de Hero e
// CaseHero; sem este substituto o esbuild arrastaria three + @react-three/fiber
// + drei (~2,4 MB) para dentro do bundle que TODO design gerado carrega, para
// renderizar algo que os proprios componentes so montam depois do idle e em
// ponteiro fino — ou seja, nunca dentro de um card.
//
// Os componentes que dependem disso continuam renderizando a composicao real:
// o que falta e so a textura de fundo. Ver .design-sync/NOTES.md.

export default function NullCanvas() {
  return null;
}
