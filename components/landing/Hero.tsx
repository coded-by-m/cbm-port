import { TriangleMark } from "@/components/site/shared";
import { TriArrow } from "@/components/ui/TriArrow";
import { CLIENT_PLATES, CTA_LABEL, HERO, HERO_WALL, WA_MESSAGE } from "@/data/criacaoDeSites";
import { WaCta } from "./Cta";
import { HeroWall } from "./HeroWall";

/**
 * Abertura. A primeira tela responde quatro coisas: o que é vendido (a régua
 * de cima), para quem (título e apoio), por que considerar (a parede de projetos
 * do estúdio e o resultado medido da Machado) e como avançar (o botão e a
 * frase que diz o que acontece ao tocar).
 *
 * Desktop: o título ocupa a largura inteira no corpo de display da marca, e a
 * parede à deriva da home corre de fundo, à direita, com o escuro da página
 * vindo da esquerda e de cima para o texto ler limpo. Celular: a parede vira
 * uma faixa entre o botão e o resultado.
 *
 * Nada aqui usa `Reveal` nem anima o título: ele esconderia o conteúdo até o
 * JavaScript rodar e atrasaria o LCP.
 */
export function Hero() {
  const plate = CLIENT_PLATES.find((p) => p.slug === HERO.figureSlug) ?? CLIENT_PLATES[0];

  return (
    <section className="cs-hero" data-cm-section="hero">
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

          <HeroWall tiles={HERO_WALL} />
          <div className="cs-hero-shade" aria-hidden />

          {plate.metric && (
            <div className="cs-hero-proof">
              <p className="cs-stat">
                <span className="cs-stat-n">{plate.metric.value}</span>
                <span className="cs-stat-label">
                  {plate.metric.label} {plate.metric.period}.
                </span>
              </p>
              <p className="cs-cap-name">
                {plate.title}: {plate.business.toLowerCase()}, {plate.place}.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
