/** Tipos globais das libs de métricas injetadas via <Script> (GA4 e Meta Pixel). */
interface Window {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  fbq?: ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void };
  _fbq?: unknown;
}
