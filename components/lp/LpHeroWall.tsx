"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { DriftTile } from "@/components/site/DriftWall";
import { PANCHANG, SATOSHI } from "@/components/site/shared";
import { cbm } from "@/lib/palette";
import { LpCta } from "./LpCta";

/**
 * Só no cliente e depois da hidratação: título, preço e CTA do hero chegam no
 * HTML e continuam sendo o LCP. A parede é a segunda coisa a aparecer, nunca
 * a primeira. O espaço dela já existe no layout, então nada pula quando chega.
 */
const DriftWall = dynamic(
  () => import("@/components/site/DriftWall").then((m) => m.DriftWall),
  { ssr: false },
);

/** O que o cartão diz de um cliente. Montado no servidor, a partir de `cases` e `CLIENT_PROOF`. */
export interface HeroWallProject {
  slug: string;
  title: string;
  /** "Implementos rodoviários · 2025". */
  meta: string;
  fact?: string;
  quote?: string;
  author?: string;
  siteUrl?: string;
}

/**
 * 5 e 4 são coprimos com 3 clientes: cada coluna passa pelos três. Com as 3
 * colunas que `driftColumnCount` daria, cada coluna seria um cliente só.
 */
const COLUMNS = { wide: 5, compact: 4 };

/**
 * Parede de sites de clientes no hero da landing, com o cartão de prova.
 *
 * É prova, não navegação: os tiles não levam ao case (a landing não tem
 * saída lateral). Passar o mouse ou tocar numa tela escolhe o cliente, e o
 * cartão mostra quem é, o resultado medido e o endereço no ar. A escolha fica
 * até outra tela ser escolhida: tirar o mouse da parede não apaga o cartão,
 * senão ele sumiria no caminho até o botão.
 */
export function LpHeroWall({
  tiles,
  projects,
  waMessage,
}: {
  tiles: DriftTile[];
  projects: HeroWallProject[];
  waMessage: string;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const project = projects.find((p) => p.slug === selected);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  return (
    <>
      <div className="lp-wall">
        <DriftWall
          tiles={tiles}
          columns={COLUMNS}
          linkTiles={false}
          highlight={selected}
          onActiveChange={(slug) => slug && setSelected(slug)}
          speed={26}
        />
      </div>

      <div className="lp-proof" aria-live="polite">
        {project ? (
          <ProofCard
            key={project.slug}
            project={project}
            waMessage={waMessage}
            onClose={() => setSelected(null)}
          />
        ) : (
          <p className="lp-proof-hint" style={HINT}>
            <span aria-hidden className="lp-proof-dot" />
            <span className="lp-hint-hover">
              Sites de clientes, no ar. Passe o mouse numa tela.
            </span>
            <span className="lp-hint-touch">
              Sites de clientes, no ar. Toque numa tela.
            </span>
          </p>
        )}
      </div>
    </>
  );
}

const HINT: React.CSSProperties = {
  margin: 0,
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  fontFamily: SATOSHI,
  fontWeight: 500,
  fontSize: 14,
  lineHeight: 1.4,
  color: cbm("gray-200"),
};

function ProofCard({
  project,
  waMessage,
  onClose,
}: {
  project: HeroWallProject;
  waMessage: string;
  onClose: () => void;
}) {
  // "…da Coded by M e quero um orçamento." vira "…da Coded by M. Vi o site
  // da X e quero um orçamento.": o lead já chega dizendo o que viu.
  const base = waMessage.replace(/\s*e quero um orçamento\.?$/, "").replace(/\.?$/, ".");
  const message = `${base} Vi o site da ${project.title} e quero um orçamento.`;

  return (
    <div className="lp-proof-card">
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar"
        className="lp-proof-close"
      >
        <span aria-hidden>×</span>
      </button>

      <p
        style={{
          margin: 0,
          paddingRight: 36,
          fontFamily: PANCHANG,
          fontWeight: 700,
          fontSize: 18,
          lineHeight: 1.2,
          color: "#F5F2ED",
        }}
      >
        {project.title}
      </p>
      <p
        style={{
          margin: "6px 0 0",
          fontFamily: SATOSHI,
          fontSize: 14,
          lineHeight: 1.5,
          color: cbm("gray-300"),
        }}
      >
        {project.meta}
      </p>

      {project.fact && (
        <p
          style={{
            margin: "14px 0 0",
            fontFamily: SATOSHI,
            fontWeight: 500,
            fontSize: 15,
            lineHeight: 1.55,
            color: "#F5F2ED",
          }}
        >
          {project.fact}
        </p>
      )}
      {project.quote && (
        <p
          style={{
            margin: "14px 0 0",
            fontFamily: SATOSHI,
            fontSize: 15,
            lineHeight: 1.55,
            color: "#F5F2ED",
          }}
        >
          “{project.quote}”{project.author ? ` ${project.author}` : ""}
        </p>
      )}

      {project.siteUrl && (
        <a
          href={`https://${project.siteUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="lp-proof-site"
          data-cm-id="lp-hero-wall-site"
        >
          No ar em {project.siteUrl} ↗
        </a>
      )}

      <div style={{ marginTop: 18 }}>
        <LpCta
          label="Quero um site assim"
          message={message}
          size="sm"
          source="lp-hero-wall"
        />
      </div>
    </div>
  );
}
