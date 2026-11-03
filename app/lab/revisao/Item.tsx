"use client";

import { Component, type ReactNode } from "react";
import { cbm } from "@/lib/palette";

const MONO = 'ui-monospace, "SFMono-Regular", Menlo, monospace';

/** Um erro de render vira mensagem no próprio item, sem derrubar o lab. */
class Boundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <pre
        style={{
          margin: 0,
          padding: 16,
          fontFamily: MONO,
          fontSize: 12,
          whiteSpace: "pre-wrap",
          color: cbm("red"),
        }}
      >
        Erro de render: {this.state.error.message}
      </pre>
    );
  }
}

/**
 * Moldura de cada peça revisada. O `id` (ex.: B-03) é o que se cita na
 * revisão — "o B-03 está apagado" — então fica sempre visível.
 *
 * `transform` cria um bloco de contenção: componentes `position: fixed`
 * (SiteHeader, WhatsAppFab) ancoram na moldura em vez de na janela.
 */
export function Item({
  id,
  name,
  wide = false,
  children,
}: {
  id: string;
  name: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <figure
      id={id}
      style={{
        margin: 0,
        gridColumn: wide ? "1 / -1" : undefined,
        border: `1px solid ${cbm("border-active")}`,
        background: cbm("page"),
        minWidth: 0,
      }}
    >
      <figcaption
        style={{
          display: "flex",
          gap: 10,
          alignItems: "baseline",
          padding: "8px 12px",
          borderBottom: `1px solid ${cbm("border-active")}`,
          fontFamily: MONO,
          fontSize: 12,
          color: cbm("gray-400"),
        }}
      >
        <a href={`#${id}`} style={{ color: cbm("red"), textDecoration: "none", fontWeight: 700 }}>
          {id}
        </a>
        <span>{name}</span>
      </figcaption>
      <div style={{ position: "relative", transform: "translateZ(0)", overflow: "hidden" }}>
        <Boundary>{children}</Boundary>
      </div>
    </figure>
  );
}

/** Cabeçalho de seção do lab. */
export function LabSection({
  id,
  title,
  note,
  children,
}: {
  id: string;
  title: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} style={{ padding: "56px clamp(16px,3vw,40px)", scrollMarginTop: 72 }}>
      <h2
        style={{
          margin: 0,
          fontFamily: '"Panchang", sans-serif',
          fontSize: 22,
          fontWeight: 700,
          color: cbm("white"),
        }}
      >
        {title}
      </h2>
      {note && (
        <p style={{ margin: "8px 0 0", maxWidth: 720, fontSize: 14, lineHeight: 1.6, color: cbm("gray-400") }}>
          {note}
        </p>
      )}
      <div style={{ marginTop: 24 }}>{children}</div>
    </section>
  );
}
