import "./_still";
import { LpCta } from "cbm-port";

function Cell({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: 32 }}>{children}</div>;
}

/** Canônico — `lg`, o tamanho usado no hero e no fechamento da landing. */
export function Canonico() {
  return (
    <Cell>
      <LpCta
        label="Falar sobre o meu escritório"
        message="Oi Matheus, vim pela página de arquitetura"
        size="lg"
        source="lp-hero"
      />
    </Cell>
  );
}

export function Medio() {
  return (
    <Cell>
      <LpCta
        label="Falar sobre o meu projeto"
        message="Oi Matheus, vim pela landing"
        size="md"
        source="lp-proof"
      />
    </Cell>
  );
}

export function Pequeno() {
  return (
    <Cell>
      <LpCta
        label="Falar no WhatsApp"
        message="Oi Matheus, vim pela landing"
        size="sm"
        source="lp-faq"
      />
    </Cell>
  );
}
