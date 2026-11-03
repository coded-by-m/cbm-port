"use client";

import type { ReactNode } from "react";
import { SLIDE_W, SLIDE_H } from "@/app/posts/_shared/chrome";
import * as apresentacao from "@/app/posts/apresentacao/slides";
import * as importancia from "@/app/posts/importancia/slides";
import * as projeto from "@/app/posts/projeto/slides";
import * as machado from "@/app/posts/machado/slides";
import { cbm } from "@/lib/palette";
import { Item } from "../Item";

const SCALE = 0.25;

const CARROSSEIS: [string, ReactNode[]][] = [
  ["apresentacao", apresentacao.SLIDES],
  ["importancia", importancia.SLIDES],
  ["projeto", projeto.SLIDES],
  ["machado", machado.SLIDES],
];

/** Seção P: os carrosséis em miniatura, um item por carrossel. */
export function Posts() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      {CARROSSEIS.map(([nome, slides]) => (
        <Item key={nome} id={`P-${nome}`} name={`/posts/${nome} · ${slides.length} slides`} wide>
          <div style={{ display: "flex", gap: 12, padding: 16, overflowX: "auto" }}>
            {slides.map((slide, i) => (
              <div key={i} style={{ flex: "none" }}>
                <div
                  style={{
                    width: SLIDE_W * SCALE,
                    height: SLIDE_H * SCALE,
                    overflow: "hidden",
                    outline: `1px solid ${cbm("line")}`,
                  }}
                >
                  <div
                    style={{
                      width: SLIDE_W,
                      height: SLIDE_H,
                      transform: `scale(${SCALE})`,
                      transformOrigin: "top left",
                      background: cbm("page"),
                    }}
                  >
                    {slide}
                  </div>
                </div>
                <div style={{ marginTop: 6, fontFamily: "ui-monospace, monospace", fontSize: 11, color: cbm("gray-400") }}>
                  {i + 1}
                </div>
              </div>
            ))}
          </div>
        </Item>
      ))}
    </div>
  );
}
