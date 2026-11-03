"use client";

import {
  FIXED_TOKENS,
  GRAY_TOKENS,
  PALETTES,
  SUPPORT_TOKENS,
  SURFACE_TOKENS,
  cbm,
  contrastRatio,
  type PaletteId,
  type Token,
} from "@/lib/palette";
import { Item } from "../Item";

const MONO = 'ui-monospace, "SFMono-Regular", Menlo, monospace';

function grade(ratio: number) {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA grande";
  return "—";
}

function Swatch({ token, hex, contrast }: { token: Token; hex: string; contrast?: [number, number] }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ height: 56, background: cbm(token), outline: `1px solid ${cbm("border-active")}` }} />
      <div style={{ marginTop: 6, fontFamily: MONO, fontSize: 11, lineHeight: 1.5, color: cbm("gray-400") }}>
        <div style={{ color: cbm("gray-100") }}>{token}</div>
        <div>{hex}</div>
        {contrast && (
          <div title="contraste sobre base / sobre surface">
            {contrast[0].toFixed(1)} {grade(contrast[0])} · {contrast[1].toFixed(1)} {grade(contrast[1])}
          </div>
        )}
      </div>
    </div>
  );
}

const grid = (min: number) => ({
  display: "grid",
  gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))`,
  gap: 16,
  padding: 16,
});

/** Seção K: amostras da paleta ativa e a comparação das quatro. */
export function Colors({ palette }: { palette: PaletteId }) {
  const c = PALETTES[palette].colors;
  let n = 0;
  const id = () => `K-${String(++n).padStart(2, "0")}`;

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Item id={id()} name="Superfícies (escada do recuado ao destacado)">
        <div style={grid(110)}>
          {SURFACE_TOKENS.map((t) => (
            <Swatch key={t} token={t} hex={c[t]} />
          ))}
        </div>
      </Item>
      <Item id={id()} name="Cinzas · contraste sobre base / surface">
        <div style={grid(110)}>
          {GRAY_TOKENS.map((t) => (
            <Swatch
              key={t}
              token={t}
              hex={c[t]}
              contrast={[contrastRatio(c[t], c.base), contrastRatio(c[t], c.surface)]}
            />
          ))}
        </div>
      </Item>
      <Item id={id()} name="Apoio e marca">
        <div style={grid(110)}>
          {[...SUPPORT_TOKENS, ...FIXED_TOKENS].map((t) => (
            <Swatch key={t} token={t} hex={c[t]} contrast={[contrastRatio(c[t], c.base), contrastRatio(c[t], c.surface)]} />
          ))}
        </div>
      </Item>
      <Item id={id()} name="Texto sobre as superfícies">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
          {(["base", "sunken", "surface", "raised", "card"] as const).map((s) => (
            <div key={s} style={{ background: cbm(s), padding: 20, borderRight: `1px solid ${cbm("border")}` }}>
              <div style={{ fontFamily: MONO, fontSize: 11, color: cbm("gray-500") }}>{s}</div>
              <div style={{ marginTop: 10, fontFamily: '"Panchang", sans-serif', fontWeight: 700, fontSize: 18, color: cbm("white") }}>
                Título
              </div>
              <p style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.6, color: cbm("gray-200") }}>
                Corpo de texto em gray-200.
              </p>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: cbm("gray-400") }}>Secundário em gray-400.</p>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: cbm("gray-600") }}>Terciário em gray-600.</p>
              <span
                style={{
                  display: "inline-block",
                  marginTop: 12,
                  padding: "8px 14px",
                  background: cbm("red"),
                  color: cbm("page"),
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                Ação
              </span>
            </div>
          ))}
        </div>
      </Item>
      <Item id={id()} name="As quatro paletas lado a lado (superfícies)" wide>
        <div style={{ overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", width: "100%", fontFamily: MONO, fontSize: 11 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: 8, color: cbm("gray-400") }}>token</th>
                {Object.values(PALETTES).map((p) => (
                  <th key={p.id} style={{ textAlign: "left", padding: 8, color: p.id === palette ? cbm("red") : cbm("gray-200") }}>
                    {p.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SURFACE_TOKENS.map((t) => (
                <tr key={t}>
                  <td style={{ padding: "4px 8px", color: cbm("gray-200") }}>{t}</td>
                  {Object.values(PALETTES).map((p) => (
                    <td key={p.id} style={{ padding: "4px 8px" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 8, color: cbm("gray-400") }}>
                        <span style={{ width: 40, height: 20, background: p.colors[t], outline: `1px solid ${p.colors["border-active"]}` }} />
                        {p.colors[t]}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Item>
    </div>
  );
}
