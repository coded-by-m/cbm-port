import Image from "next/image";
import Link from "next/link";
import type { CaseProject } from "@/types/case";
import { PROJECT_TYPE_COLOR } from "@/lib/projectTypes";
import { PANCHANG, SATOSHI } from "@/components/site/shared";
import { cbm } from "@/lib/palette";
import { TriArrow } from "@/components/ui/TriArrow";

/**
 * Célula de projeto — capa de ponta a ponta com o numeral, texto embaixo.
 *
 * Usada na grade de `/projetos` E na seção Projetos da home: uma só definição
 * pros dois lugares, senão eles divergem na primeira mexida.
 *
 * Todas as células têm o mesmo peso. É catálogo, não vitrine com destaque —
 * quem decide o que importa é quem lê.
 *
 * A capa usa `preview.card` (760×874): `preview.desktop` chega a 2880×24972,
 * e decodificar a página inteira do cliente pra uma capa é o que travava
 * celular.
 */
export function ProjetoGridCard({
  project,
  index,
  priority = false,
}: {
  project: CaseProject;
  index: number;
  /** Primeira dobra da vitrine: a miniatura é o LCP, não pode esperar o lazy. */
  priority?: boolean;
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
        flexDirection: "column",
        width: "100%",
        minWidth: 0,
        border: "1px solid rgba(245,242,237,0.1)",
        background: cbm("sunken"),
      }}
    >
      {/* Clique da célula inteira leva ao case. */}
      <Link
        href={`/cases/${project.slug}`}
        aria-label={`Ver o case ${project.title}`}
        data-cm-role="secondary-cta"
        data-cm-id={`case-${project.slug}`}
        style={{ position: "absolute", inset: 0, zIndex: 1 }}
      />

      {/* Capa — de ponta a ponta, na mesma proporção em todas as células.
          É uma JANELA sobre um recorte mais alto que ela: em repouso mostra o
          topo do site, no hover desliza e revela a continuação da página.

          Por isso a imagem não usa `fill`: com ela o elemento teria a altura
          exata da janela, sem sobra nenhuma pra revelar — e o deslize levava a
          capa inteira pra fora, deixando o card preto. */}
      <div
        style={{
          position: "relative",
          flex: "none",
          width: "100%",
          aspectRatio: "16 / 10",
          overflow: "hidden",
          borderBottom: "1px solid rgba(245,242,237,0.1)",
        }}
      >
        {thumb && (
          <Image
            src={thumb}
            alt={`Topo da página inicial do site ${project.title}`}
            width={760}
            height={874}
            sizes="(max-width: 960px) 92vw, 562px"
            priority={priority}
            className="site-shot-window"
            style={{ display: "block", width: "100%", height: "auto" }}
          />
        )}
        {/* Escurece só a base da capa, pra o numeral ler sobre qualquer site. */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: "50% 0 0",
            background: "linear-gradient(transparent, rgba(5,5,5,0.8))",
          }}
        />
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: "clamp(12px,1.4vw,18px)",
            bottom: "clamp(10px,1.2vw,16px)",
            fontFamily: PANCHANG,
            fontWeight: 700,
            fontSize: "clamp(22px,2.4vw,34px)",
            lineHeight: 0.9,
            letterSpacing: "-0.04em",
            color: "#F5F2ED",
          }}
        >
          {num}
        </span>
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

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          minWidth: 0,
          flex: 1,
          padding: "clamp(16px,1.8vw,24px)",
        }}
      >
        {/* Quebra em vez de vazar: o rótulo não encolhe, e ao lado de um
            título longo não cabe na coluna de texto. */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: "4px 12px",
          }}
        >
          {/* h3: o catálogo tem H2 de grupo (clientes / conceituais). */}
          <h3
            style={{
              margin: 0,
              fontFamily: PANCHANG,
              fontWeight: 700,
              fontSize: "clamp(15px,1.5vw,19px)",
              letterSpacing: "-0.005em",
              color: "#F5F2ED",
              // Rede de segurança: uma palavra longa em Panchang ("Plataformas")
              // quebra em vez de vazar do card.
              hyphens: "auto",
              overflowWrap: "anywhere",
            }}
          >
            {project.title}
          </h3>
          <span
            style={{
              display: "inline-flex",
              flexWrap: "wrap",
              alignItems: "baseline",
              gap: "6px 8px",
              flex: "none",
              maxWidth: "100%",
            }}
          >
            {project.concept && (
              /* Mesma borda e o mesmo texto do chip inativo do filtro,
                 em corpo de legenda. Rótulo, não controle — sem raio. */
              <span
                style={{
                  border: "1px solid rgba(245,242,237,0.15)",
                  padding: "4px 8px",
                  fontFamily: SATOSHI,
                  fontWeight: 500,
                  fontSize: "0.7rem",
                  letterSpacing: "0.22em",
                  lineHeight: 1.4,
                  textTransform: "uppercase",
                  color: "rgba(245,242,237,0.55)",
                }}
              >
                conceitual
              </span>
            )}
            <span
              style={{
                fontFamily: SATOSHI,
                fontWeight: 400,
                fontSize: 10,
                letterSpacing: "0.18em",
                color: cbm("gray-400"),
              }}
            >
              {project.meta.ano}
            </span>
          </span>
        </div>

        <p
          style={{
            margin: 0,
            fontFamily: SATOSHI,
            fontWeight: 400,
            fontSize: 12.5,
            lineHeight: 1.6,
            color: cbm("gray-300"),
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
                  color: cbm("gray-400"),
                }}
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {/* `auto` empurra os botões pro pé: na mesma linha da grade, cards com
            e sem stack terminam alinhados. */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: "auto", paddingTop: 6 }}>
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
            Case <span style={{ color: typeColor }}><TriArrow dir="up-right" /></span>
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
              No ar <span style={{ color: "#FB3640" }}><TriArrow dir="up-right" /></span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
