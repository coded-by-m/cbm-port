import "./_still";
import { useEffect } from "react";
import { SiteHeader } from "cbm-port";

// Não recebe props. É `position: fixed` de largura inteira — a história
// canônica é o componente sozinho num wrapper com altura suficiente pra ele
// aparecer dentro do card em vez de escapar.

export function Padrao() {
  return (
    <div style={{ position: "relative", minHeight: 220, background: "#000F08" }}>
      <SiteHeader />
    </div>
  );
}

/**
 * Menu aberto: o drawer não tem prop — abrimos como um usuário abriria,
 * clicando no próprio hambúrguer do componente montado.
 */
function AbreOMenu() {
  useEffect(() => {
    const btn = document.querySelector<HTMLButtonElement>(
      'button[aria-label="Abrir menu"]',
    );
    btn?.click();
  }, []);
  return <SiteHeader />;
}

export function MenuAberto() {
  return (
    <div style={{ position: "relative", minHeight: 520, background: "#000F08" }}>
      <AbreOMenu />
    </div>
  );
}
