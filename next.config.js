/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * Uma landing só, em `/criacao-de-sites`: os antigos `/lp/*` caem nela.
   *
   * As três páginas de serviço saíram em 2026-11-22. Vão para a `/`, que é
   * indexável, e não para a landing, que é noindex e não herdaria nada.
   */
  async redirects() {
    return [
      { source: "/lp/:path*", destination: "/criacao-de-sites", permanent: true },
      { source: "/landing-page", destination: "/", permanent: true },
      { source: "/site-institucional", destination: "/", permanent: true },
      { source: "/sites-para-arquitetura", destination: "/", permanent: true },
    ];
  },
};

module.exports = nextConfig;
