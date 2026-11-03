"use client";

import { useEffect, useState } from "react";
import { ACTIVE_PALETTE, PALETTES, applyPalette, cbm, type PaletteId } from "@/lib/palette";

const KEY = "cbm-lab-palette";

/**
 * Paleta em revisão. Sobrescreve as variáveis no <html> e as devolve à
 * paleta ativa ao sair do lab — sem isso a navegação do cliente levaria a
 * paleta de teste para o resto do site.
 */
export function usePalette(): [PaletteId, (id: PaletteId) => void] {
  const [id, setIdState] = useState<PaletteId>(ACTIVE_PALETTE);

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(KEY);
    } catch {}
    if (saved && saved in PALETTES) setIdState(saved as PaletteId);
    return () => applyPalette(null);
  }, []);

  useEffect(() => {
    applyPalette(id);
  }, [id]);

  // Grava só na escolha do usuário: gravar num efeito de `id` sobrescreveria
  // a escolha salva com a paleta inicial antes de ela ser lida.
  const setId = (next: PaletteId) => {
    setIdState(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {}
  };

  return [id, setId];
}

const SECTIONS = [
  ["prototipos", "Protótipos"],
  ["cores", "Cores"],
  ["botoes", "Botões"],
  ["marca", "Marca"],
  ["componentes", "Componentes"],
  ["secoes", "Seções"],
  ["cena", "Cena 3D"],
  ["posts", "Posts"],
] as const;

export function PaletteBar({ id, onChange }: { id: PaletteId; onChange: (id: PaletteId) => void }) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 16,
        padding: "12px clamp(16px,3vw,40px)",
        background: cbm("page", 0.9),
        backdropFilter: "blur(10px)",
        borderBottom: `1px solid ${cbm("border-active")}`,
      }}
    >
      <strong style={{ fontFamily: '"Panchang", sans-serif', fontSize: 13, color: cbm("white") }}>
        Lab de revisão
      </strong>
      <div role="radiogroup" aria-label="Paleta" style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {Object.values(PALETTES).map((p) => {
          const on = p.id === id;
          return (
            <button
              key={p.id}
              role="radio"
              aria-checked={on}
              title={p.note}
              onClick={() => onChange(p.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 12px",
                border: `1px solid ${on ? cbm("red") : cbm("border-active")}`,
                background: on ? cbm("red", 0.1) : "transparent",
                color: on ? cbm("white") : cbm("gray-200"),
                fontSize: 13,
                cursor: "pointer",
                borderRadius: 0,
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 12,
                  height: 12,
                  background: p.colors.base,
                  outline: `1px solid ${p.colors.line}`,
                }}
              />
              {p.label}
              {p.id === ACTIVE_PALETTE && (
                <span style={{ fontSize: 11, color: cbm("gray-400") }}>· produção</span>
              )}
            </button>
          );
        })}
      </div>
      <nav style={{ display: "flex", gap: 14, flexWrap: "wrap", marginLeft: "auto", fontSize: 13 }}>
        {SECTIONS.map(([href, label]) => (
          <a key={href} href={`#${href}`} style={{ color: cbm("gray-400"), textDecoration: "none" }}>
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}
