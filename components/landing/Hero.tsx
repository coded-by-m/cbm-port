import Image from "next/image";
import { BrowserFrame } from "@/components/case/BrowserFrame";
import { TriangleMark } from "@/components/site/shared";
import { TriArrow } from "@/components/ui/TriArrow";
import { CLIENT_PLATES, CTA_LABEL, HERO, WA_MESSAGE } from "@/data/criacaoDeSites";
import { WaCta } from "./Cta";
import { Terrain } from "./Terrain";

/**
 * Abertura. A primeira tela responde quatro coisas: o que é vendido (a régua
 * de cima), para quem (título e apoio), por que considerar (o site de um
 * cliente, no computador e no celular, com o resultado medido em destaque) e
 * como avançar (o botão e a frase que diz o que acontece ao tocar).
 *
 * O título ocupa a largura inteira no corpo de display da marca, sobre o
 * terreno triangulado da home (aqui em SVG estático, sem WebGL).
 *
 * Nada aqui usa `Reveal` nem anima o título: ele esconde o conteúdo até o
 * JavaScript rodar e atrasa o LCP. Só o terreno entra em movimento, em CSS.
 * A captura do computador é `priority` porque no desktop ela disputa o LCP.
 */
export function Hero() {
  const plate = CLIENT_PLATES.find((p) => p.slug === HERO.figureSlug) ?? CLIENT_PLATES[0];

  return (
    <section className="cs-hero" data-cm-section="hero">
      <Terrain define className="cs-hero-terrain" />

      <div className="cs-wrap">
        <p className="cs-meta">
          <strong>{HERO.kicker}</strong>
          <span>{HERO.place}</span>
        </p>

        <h1 className="cs-h1">
          {HERO.headline.map((line, i) => (
            <span key={line}>
              {line}
              {i === HERO.headline.length - 1 && <TriangleMark className="cs-h1-tri" strokeWidth={6} drawDelay={0.5} />}{" "}
            </span>
          ))}
        </h1>

        <div className="cs-hero-grid">
          <div className="cs-hero-text">
            <p className="cs-lead">{HERO.sub}</p>

            <div className="cs-hero-cta">
              <WaCta id="lp-hero" message={WA_MESSAGE} label={CTA_LABEL} />
              <p className="cs-small">{HERO.ctaNote}</p>
            </div>

            <ul className="cs-hero-links">
              {HERO.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="cs-link" data-cm-cta={`lp-hero-${link.href.slice(1)}`}>
                    {link.label}
                    <TriArrow />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <figure className="cs-hero-fig">
            <div className="cs-hero-stage">
              <BrowserFrame url={plate.siteUrl}>
                <div className="cs-shot">
                  <Image
                    src={plate.shots.desktop}
                    alt={`Primeira tela do site da ${plate.title} no computador`}
                    width={1440}
                    height={900}
                    priority
                    sizes="(max-width: 999px) 88vw, 680px"
                  />
                </div>
              </BrowserFrame>
              <div className="cs-phone cs-hero-phone">
                <Image
                  src={plate.shots.mobile}
                  alt={`O mesmo site da ${plate.title} no celular`}
                  width={plate.shots.mobileSize.width}
                  height={plate.shots.mobileSize.height}
                  sizes="(max-width: 999px) 24vw, 170px"
                />
              </div>
            </div>
            <figcaption className="cs-hero-cap">
              {plate.metric && (
                <p className="cs-stat">
                  <span className="cs-stat-n">{plate.metric.value}</span>
                  <span className="cs-stat-label">
                    {plate.metric.label} {plate.metric.period}.
                  </span>
                </p>
              )}
              <p className="cs-cap-name">
                {plate.title}: {plate.business.toLowerCase()}, {plate.place}.
              </p>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
