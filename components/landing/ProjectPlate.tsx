"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { BrowserFrame } from "@/components/case/BrowserFrame";
import { TriArrow } from "@/components/ui/TriArrow";
import type { ClientPlate } from "@/data/criacaoDeSites";

/**
 * A prancha de um cliente: o site em duas vistas (computador e celular), as
 * cotas numeradas e a legenda que diz o que cada ponto faz por quem compra.
 *
 * As cotas respondem "é só bonito?" na própria tela: cada número aponta uma
 * decisão de desenho e a legenda ao lado diz para que ela serve. Passar o
 * mouse numa linha da legenda acende o ponto, e o contrário. Nada depende do
 * mouse para ser lido: a legenda está sempre visível.
 *
 * "Ver a página inteira" troca a primeira tela pelo print completo, rolável
 * dentro da moldura. O print tem de 300 a 540 KB e só é baixado nesse
 * pedido. No celular entra o print de celular, que é legível em 390px.
 */
export function ProjectPlate({ plate, index, flip }: { plate: ClientPlate; index: number; flip: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const titleId = useId();
  const [active, setActive] = useState<number | null>(null);
  const [full, setFull] = useState(false);
  /** `armed`: JavaScript ativo e prancha ainda fora da tela. `seen`: já entrou. */
  const [armed, setArmed] = useState(false);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setArmed(true);
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          obs.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const classes = [
    "cs-plate",
    flip ? "cs-plate--flip" : "",
    full ? "is-full" : "",
    seen ? "is-in" : armed ? "is-armed" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article ref={ref} className={classes} aria-labelledby={titleId}>
      <header className="cs-plate-head">
        <span className="cs-numeral cs-plate-n" aria-hidden>
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 id={titleId} className="cs-h3">
          {plate.title}
        </h3>
        <p className="cs-plate-meta">
          {plate.business} · {plate.place} · {plate.format} · {plate.year}
        </p>
        <p className="cs-p">{plate.summary}</p>
      </header>

      <div className="cs-plate-views">
        {full ? (
          <div className="cs-view cs-view--full">
            <BrowserFrame url={plate.siteUrl}>
              <div
                className="cs-scroll"
                tabIndex={0}
                role="region"
                aria-label={`Página inteira do site da ${plate.title}. Role para ver.`}
              >
                <picture>
                  <source media="(max-width: 699px)" srcSet={plate.shots.mobileFull} />
                  {/* eslint-disable-next-line @next/next/no-img-element -- print de página inteira: o otimizador não ganha nada aqui e o `picture` escolhe a versão por largura */}
                  <img
                    src={plate.shots.desktopFull}
                    alt={`Página inteira do site da ${plate.title}`}
                    decoding="async"
                  />
                </picture>
              </div>
            </BrowserFrame>
            <span className="cs-view-label">Página inteira. Role dentro da moldura.</span>
          </div>
        ) : (
          <>
            <div className="cs-view cs-view--desktop">
              <BrowserFrame url={plate.siteUrl}>
                <div className="cs-shot">
                  <Image
                    src={plate.shots.desktop}
                    alt={`Primeira tela do site da ${plate.title} no computador`}
                    width={1440}
                    height={900}
                    sizes="(max-width: 999px) 92vw, 560px"
                  />
                  <ol className="cs-marks" aria-hidden>
                    {plate.notes.map((note, i) => (
                      <li
                        key={note.text}
                        className={active === i ? "cs-mark is-active" : "cs-mark"}
                        style={{ left: `${note.x}%`, top: `${note.y}%`, ["--i" as string]: i }}
                        onMouseEnter={() => setActive(i)}
                        onMouseLeave={() => setActive(null)}
                      >
                        <span>{i + 1}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </BrowserFrame>
              <span className="cs-view-label">Computador</span>
            </div>
            <div className="cs-view cs-view--mobile">
              <div className="cs-phone">
                <Image
                  src={plate.shots.mobile}
                  alt={`Primeira tela do site da ${plate.title} no celular`}
                  width={plate.shots.mobileSize.width}
                  height={plate.shots.mobileSize.height}
                  sizes="(max-width: 699px) 32vw, 150px"
                />
              </div>
              <span className="cs-view-label">Celular</span>
            </div>
          </>
        )}
      </div>

      <div className="cs-plate-body">
        <ol className="cs-notes" aria-label={`O que cada ponto do site da ${plate.title} faz`}>
          {plate.notes.map((note, i) => (
            <li
              key={note.text}
              className={active === i ? "is-active" : undefined}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              <span className="cs-note-n" aria-hidden>
                <span>{i + 1}</span>
              </span>
              {note.text}
            </li>
          ))}
        </ol>

        {plate.metric && (
          <p className="cs-stat cs-metric">
            <span className="cs-stat-n">{plate.metric.value}</span>
            <span className="cs-stat-label">
              <strong>{plate.metric.label}</strong> {plate.metric.period}.
            </span>
            <span className="cs-metric-src">{plate.metric.source}</span>
          </p>
        )}

      </div>

      <div className="cs-plate-actions">
          <a
            href={`https://${plate.siteUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="cs-link cs-open"
            data-cm-project={plate.slug}
            data-cm-id={`lp-projeto-${plate.slug}`}
          >
            Abrir {plate.siteUrl}
            <TriArrow dir="up-right" />
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
          <button
            type="button"
            className="cs-toggle"
            aria-pressed={full}
            data-cm-id={`lp-projeto-${plate.slug}-pagina`}
            onClick={() => setFull((v) => !v)}
          >
            {full ? "Voltar para a primeira tela" : "Ver a página inteira"}
          </button>
      </div>
    </article>
  );
}
