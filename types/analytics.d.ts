/** Tipos globais das libs de métricas injetadas via <Script> (GA4, Meta Pixel e Coded Insights). */
interface Window {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  fbq?: ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void };
  _fbq?: unknown;
  /** Coded Insights (tracker first-party, carregado no layout raiz). */
  codedInsights?: {
    track: (name: string, props?: Record<string, string>) => void;
  };
}
