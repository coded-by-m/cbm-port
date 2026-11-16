"use client";

import { useEffect } from "react";
import { deferUntilPaint } from "@/lib/deferUntilPaint";

const SRC = "https://insights.codedbym.com/tracker/v1.js";
const SITE = "ci_pub_111f7f9b15d8d1c4bb6c77b2988079f5";

/**
 * Coded Insights, métrica própria.
 *
 * Não usa cookie e não recebe telefone nem e-mail (ver /privacidade). Por
 * isso não depende do banner: recusar cookies não desliga este script.
 * O carregamento espera o título pintar, para não entrar na disputa do LCP.
 * Os eventos de clique ficam na fila de `lib/analytics.ts` até o tracker
 * existir.
 */
export function CodedInsights() {
  useEffect(() => {
    return deferUntilPaint(() => {
      if (document.querySelector(`script[src="${SRC}"]`)) return;
      const script = document.createElement("script");
      script.src = SRC;
      script.defer = true;
      script.dataset.site = SITE;
      document.body.appendChild(script);
    });
  }, []);

  return null;
}
