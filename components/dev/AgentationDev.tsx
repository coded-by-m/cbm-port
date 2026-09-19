"use client";

import dynamic from "next/dynamic";

/**
 * Barra de anotação do Agentation — só em desenvolvimento.
 *
 * Dá pra clicar num elemento da página e deixar uma anotação; o agente lê
 * pelo MCP (`agentation_get_pending`) com o contexto do elemento, em vez de
 * depender da descrição em texto. O servidor sobe junto com o MCP, na 4747.
 *
 * O ternário fica no ESCOPO DO MÓDULO de propósito. O webpack substitui
 * `process.env.NODE_ENV` por `"production"` em build, a condição vira
 * constante e o ramo com o `import()` é eliminado antes de virar chunk —
 * checar o NODE_ENV dentro do componente não basta, porque aí o `dynamic()`
 * já registrou o chunk e o pacote ia junto pra produção. Verificado no
 * build: nenhuma referência a "agentation" em `.next/static`.
 */
const Agentation =
  process.env.NODE_ENV === "development"
    ? dynamic(() => import("agentation").then((m) => m.Agentation), {
        ssr: false,
      })
    : () => null;

export function AgentationDev() {
  return <Agentation endpoint="http://localhost:4747" />;
}
