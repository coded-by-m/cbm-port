import Image from "next/image";
import Link from "next/link";
import type { CaseProject } from "@/types/case";
import { PROJECT_TYPE_COLOR } from "@/lib/projectTypes";
import { PANCHANG, SATOSHI } from "@/components/site/shared";

/**
 * Célula da grade de projetos.
 *
 * Numeral, thumbnail, título, resumo, stack e as duas ações. Todas as células
 * são idênticas em peso — é catálogo, não vitrine com destaque.
 *
 * A thumbnail usa `preview.card` (760×874): `preview.desktop` chega a
 * 2880×24972, e decodificar a página inteira do cliente pra mostrar 200px é
 * o que travava celular.
 */
export function ProjetoGridCard({
  project,
  index,
}: {
  project: CaseProject;
  index: number;
}) {
  const typeColor = project.type ? PROJECT_TYPE_COLOR[project.type] : "#FB3640";
  const num = String(index + 1).padStart(2, "0");
  const thumb = project.preview?.card ?? project.preview?.desktop;

  return (
    <article
      className="site-card"
      style={{
        position: "relative",
        display: "flex",
        gap: "clamp(14px,1.6vw,22px)",
        minWidth: 0,
        border: "1px solid rgba(245,242,237,0.1)",
        background: "#020504",
        padding: "clamp(18px,2vw,26px)",
      }}
    >
      {/* Clique da célula inteira leva ao case. */}
      <Link
        href={`/cases/${project.slug}`}
        aria-label={`Ver o case ${project.title}`}
        style={{ position: "absolute", inset: 0, zIndex: 1 }}
      />

      <span
        aria-hidden
        style={{
          flex: "none",
          fontFamily: PANCHANG,
          fontWeight: 700,
          fontSize: "clamp(26px,3vw,44px)",
          lineHeight: 1,
          letterSpacing: "-0.03em",
          color: "rgba(245,242,237,0.22)",
        }}
      >
        {num}
      </span>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 0, flex: 1 }}>
        <div
          style={{
            position: "relative",
            aspectRatio: "16 / 10",
            overflow: "hidden",
            border: "1px solid rgba(245,242,237,0.12)",
          }}
        >
          {thumb && (
            <Image
              src={thumb}
              alt={`${project.title} — preview`}
              fill
              sizes="(max-width: 700px) 86vw, (max-width: 1100px) 42vw, 30vw"
              className="site-shot"
              style={{ objectFit: "cover", objectPosition: "top" }}
            />
          )}
          <span
            aria-hidden
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 10,
              height: 10,
              borderLeft: `2px solid ${typeColor}`,
              borderTop: `2px solid ${typeColor}`,
            }}
          />
        </div>

        <h3
          style={{
            margin: 0,
            fontFamily: PANCHANG,
            fontWeight: 700,
            fontSize: "clamp(17px,1.7vw,21px)",
            letterSpacing: "-0.005em",
            color: "#F5F2ED",
          }}
        >
          {project.title}
        </h3>

        <p
          style={{
            margin: 0,
            fontFamily: SATOSHI,
            fontWeight: 400,
            fontSize: 13,
            lineHeight: 1.62,
            color: "#B4B0AA",
            textWrap: "pretty",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {project.description}
        </p>

        {project.stack && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 12px" }}>
            {project.stack.slice(0, 4).map((t) => (
              <span
                key={t}
                style={{
                  fontFamily: SATOSHI,
                  fontWeight: 400,
                  fontSize: 9,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#6E6B66",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            marginTop: "auto",
            paddingTop: 6,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              border: "1px solid rgba(245,242,237,0.2)",
              padding: "9px 14px",
              fontFamily: PANCHANG,
              fontWeight: 600,
              fontSize: 10,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#F5F2ED",
            }}
          >
            Ver o case <span style={{ color: typeColor }}>↗</span>
          </span>

          {project.siteUrl && (
            /* Acima do stretched link e com o clique próprio: abrir o site do
               cliente é outra ação, não pode ser engolida pelo link do case. */
            <a
              href={`https://${project.siteUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="site-link-underline"
              style={{
                position: "relative",
                zIndex: 2,
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                border: "1px solid rgba(245,242,237,0.2)",
                padding: "9px 14px",
                fontFamily: PANCHANG,
                fontWeight: 600,
                fontSize: 10,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#F5F2ED",
                textDecoration: "none",
              }}
            >
              No ar <span style={{ color: "#FB3640" }}>↗</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
