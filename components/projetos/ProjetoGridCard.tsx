import Image from "next/image";
import Link from "next/link";
import type { CaseProject } from "@/types/case";
import { PROJECT_TYPE_COLOR } from "@/lib/projectTypes";
import { PANCHANG, SATOSHI } from "@/components/site/shared";

/**
 * Célula de projeto — numeral, thumbnail e texto lado a lado.
 *
 * Usada na grade de `/projetos` E na seção Projetos da home: uma só definição
 * pros dois lugares, senão eles divergem na primeira mexida.
 *
 * Todas as células têm o mesmo peso. É catálogo, não vitrine com destaque —
 * quem decide o que importa é quem lê.
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
        alignItems: "flex-start",
        gap: "clamp(12px,1.4vw,20px)",
        minWidth: 0,
        border: "1px solid rgba(245,242,237,0.1)",
        background: "#020504",
        padding: "clamp(16px,1.8vw,24px)",
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
          fontSize: "clamp(22px,2.4vw,38px)",
          lineHeight: 0.9,
          letterSpacing: "-0.04em",
          color: "rgba(245,242,237,0.2)",
        }}
      >
        {num}
      </span>

      {/* Thumbnail — largura fixa, pra as células ficarem alinhadas entre si.
          É uma JANELA sobre um recorte mais alto que ela: em repouso mostra o
          topo do site, no hover desliza e revela a continuação da página.

          Por isso a imagem não usa `fill`: com ela o elemento teria a altura
          exata da janela, sem sobra nenhuma pra revelar — e o deslize levava a
          miniatura inteira pra fora, deixando o card preto. */}
      <div
        style={{
          position: "relative",
          flex: "none",
          width: "clamp(96px,13vw,178px)",
          aspectRatio: "16 / 11",
          overflow: "hidden",
          border: "1px solid rgba(245,242,237,0.12)",
        }}
      >
        {thumb && (
          <Image
            src={thumb}
            alt={`${project.title} — preview`}
            width={760}
            height={874}
            sizes="(max-width: 700px) 30vw, 178px"
            className="site-shot-window"
            style={{ display: "block", width: "100%", height: "auto" }}
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

      {/* Texto */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 0, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
          <h3
            style={{
              margin: 0,
              fontFamily: PANCHANG,
              fontWeight: 700,
              fontSize: "clamp(15px,1.5vw,19px)",
              letterSpacing: "-0.005em",
              color: "#F5F2ED",
            }}
          >
            {project.title}
          </h3>
          <span
            style={{
              flex: "none",
              fontFamily: SATOSHI,
              fontWeight: 400,
              fontSize: 10,
              letterSpacing: "0.18em",
              color: "#6E6B66",
            }}
          >
            {project.meta.ano}
          </span>
        </div>

        <p
          style={{
            margin: 0,
            fontFamily: SATOSHI,
            fontWeight: 400,
            fontSize: 12.5,
            lineHeight: 1.6,
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
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 10px" }}>
            {project.stack.slice(0, 3).map((t) => (
              <span
                key={t}
                style={{
                  fontFamily: SATOSHI,
                  fontWeight: 400,
                  fontSize: 9,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#6E6B66",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              border: "1px solid rgba(245,242,237,0.2)",
              padding: "7px 12px",
              fontFamily: PANCHANG,
              fontWeight: 600,
              fontSize: 9.5,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#F5F2ED",
            }}
          >
            Case <span style={{ color: typeColor }}>↗</span>
          </span>

          {project.siteUrl && (
            /* Acima do stretched link e com clique próprio: abrir o site do
               cliente é outra ação, não pode ser engolida pelo link do case. */
            <a
              href={`https://${project.siteUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                position: "relative",
                zIndex: 2,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                border: "1px solid rgba(245,242,237,0.2)",
                padding: "7px 12px",
                fontFamily: PANCHANG,
                fontWeight: 600,
                fontSize: 9.5,
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
