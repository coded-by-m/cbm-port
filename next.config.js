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
};

module.exports = nextConfig;
