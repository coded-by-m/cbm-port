"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { DriftWall, type DriftTile } from "./DriftWall";
import { Diamond, PANCHANG, SATOSHI } from "./shared";

export interface StageProject {
  slug: string;
  title: string;
  /** "Conceito · 2026" ou só o ano. */
  meta: string;
  color: string;
}

/**
 * Palco da seção Projetos: o muro à deriva de fundo e o índice por cima.
 *
 * Os dois conversam pelo slug — apontar um nome no índice acende os recortes
 * daquele projeto no muro; parar o cursor num recorte acende o nome. O índice
 * carrega os links de verdade (os tiles são `aria-hidden`), então é ele que
 * teclado, leitor de tela e buscador enxergam.
 */
export function ProjectsStage({
  head,
  projects,
  tiles,
}: {
  head: ReactNode;
  projects: StageProject[];
  tiles: DriftTile[];
}) {
  const [indexSlug, setIndexSlug] = useState<string | null>(null);
  const [wallSlug, setWallSlug] = useState<string | null>(null);
  const lit = indexSlug ?? wallSlug;

  return (
    <div className="pj-stage">
      <div className="pj-wall">
        <DriftWall
          tiles={tiles}
          highlight={indexSlug}
          onActiveChange={setWallSlug}
        />
      </div>
      <div className="pj-shade" aria-hidden />

      <div className="pj-content">
        <div className="pj-head">{head}</div>

        <div className="pj-list">
          <ol
            className="pj-index"
            onMouseLeave={() => setIndexSlug(null)}
            style={{ listStyle: "none", margin: 0, padding: 0 }}
          >
            {projects.map((p, i) => (
              <li key={p.slug}>
                <Link
                  href={`/cases/${p.slug}`}
                  className={`pj-row${lit === p.slug ? " is-lit" : ""}`}
                  data-cm-role="secondary-cta"
                  data-cm-id={`case-${p.slug}`}
                  onMouseEnter={() => setIndexSlug(p.slug)}
                  onFocus={() => setIndexSlug(p.slug)}
                  onBlur={() => setIndexSlug(null)}
                  style={{ "--pj-color": p.color } as React.CSSProperties}
                >
                  <span
                    aria-hidden
                    style={{
                      fontFamily: PANCHANG,
                      fontWeight: 700,
                      fontSize: 11,
                      letterSpacing: "0.04em",
                      color: "rgba(245,242,237,0.32)",
                      width: "3ch",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="pj-title"
                    style={{
                      fontFamily: PANCHANG,
                      fontWeight: 700,
                      fontSize: "clamp(14px,1.25vw,17px)",
                      letterSpacing: "-0.005em",
                    }}
                  >
                    {p.title}
                  </span>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontFamily: SATOSHI,
                      fontSize: 10,
                      letterSpacing: "0.18em",
                      color: "#6E6B66",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {p.meta}
                  </span>
                  <span aria-hidden className="pj-arrow">
                    ↗
                  </span>
                </Link>
              </li>
            ))}
          </ol>

          <Link
            href="/projetos"
            className="pj-all site-link-underline"
            data-cm-role="secondary-cta"
            data-cm-id="projects-all"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              marginTop: "clamp(22px,3vh,32px)",
              fontFamily: PANCHANG,
              fontWeight: 600,
              fontSize: 10.5,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#F5F2ED",
              textDecoration: "none",
            }}
          >
            <Diamond />
            Ver todos os projetos
            <span aria-hidden style={{ color: "#FB3640" }}>
              →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
