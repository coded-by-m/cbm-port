const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * A landing de anúncio era `/lp/[segmento]`, com duas páginas. Ficou uma só,
   * em `/criacao-de-sites` (2026-11-17). A de arquitetura tem página de serviço
   * indexável do mesmo nicho; o resto cai na landing.
   */
  async redirects() {
    return [
      { source: "/lp/arquitetura", destination: "/sites-para-arquitetura", permanent: true },
      { source: "/lp/:path*", destination: "/criacao-de-sites", permanent: true },
    ];
  },
  webpack(config, { webpack }) {
    // O /lab/revisao renderiza os mesmos previews que vão ao Claude Design.
    // Eles importam do barrel "cbm-port", que no app é o .design-sync/entry.tsx.
    config.resolve.alias["cbm-port"] = path.resolve(__dirname, ".design-sync/entry.tsx");
    // `_still` congela animação e adianta setTimeout para a foto do card. No
    // navegador isso atropelaria o resto da página: vira módulo vazio.
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /previews[\\/]_still(\.ts)?$/,
        path.resolve(__dirname, "app/lab/revisao/_noop.ts"),
      ),
    );
    return config;
  },
};

module.exports = nextConfig;
