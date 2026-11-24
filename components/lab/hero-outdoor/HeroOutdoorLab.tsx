"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { HERO, HOME_FAQ, HOME_WA_MESSAGE, SECTIONS } from "@/data/home";
import { ABOUT } from "@/data/about";
import { PROCESS_STEPS } from "@/data/process";
import { SERVICES } from "@/data/services";
import { PUBLIC_PRICE } from "@/data/servicePages";
import { waLink } from "@/lib/contact";
import { FillButton } from "@/components/ui/FillButton";
import { TriangleMark } from "@/components/site/shared";
import { GO_BACK, GO_POST, SIGNS, SIGN_H, SIGN_W, stopProgress } from "./stops";
import type { BoardPx } from "./HeroOutdoorScene";

const HeroOutdoorScene = dynamic(() => import("./HeroOutdoorScene"), { ssr: false });

const WA = waLink("Olá! Quero iniciar um projeto com a Coded by M.");
const WA_QUOTE = waLink(HOME_WA_MESSAGE);

/** Preço público por serviço; o que não tem preço fechado fica sem. */
const PRICE: Record<string, string> = {
  "landing-pages": `a partir de ${PUBLIC_PRICE.landing.display}`,
  "sites-institucionais": `a partir de ${PUBLIC_PRICE.institucional.display}`,
};

/** Quantas capas giram na placa do hero, e de quanto em quanto tempo. */
const SLIDES = 4;
const SLIDE_MS = 3400;

export interface OutdoorProject {
  slug: string;
  title: string;
  cover: string;
  color: string;
}

interface Layout {
  hero: BoardPx;
  chapter: BoardPx;
  /** Uma placa do poste, no close. */
  sign: BoardPx;
}

/**
 * Tamanho das duas placas em pixels. É o tamanho em que o HTML é desenhado E
 * o tamanho que a placa ocupa na tela com a câmera parada: por isso o texto
 * não borra.
 */
function measure(): Layout {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (vw < vh) {
    const w = Math.round(vw * 0.88);
    const cw = Math.round(vw * 0.86);
    const sw = Math.round(vw * 0.74);
    return {
      hero: { w, h: Math.round(Math.min(w * 1.5, vh * 0.66)) },
      chapter: { w: cw, h: Math.round(Math.min(cw * 1.45, vh * 0.64)) },
      sign: { w: sw, h: Math.round((sw * SIGN_H) / SIGN_W) },
    };
  }
  const h = Math.round(vh * 0.62);
  const ch = Math.round(vh * 0.56);
  const sw = Math.round(Math.min(vh * 0.52, vw * 0.4));
  return {
    hero: { h, w: Math.round(Math.min(h * 1.85, vw * 0.8)) },
    chapter: { h: ch, w: Math.round(Math.min(ch * 1.6, vw * 0.7)) },
    sign: { w: sw, h: Math.round((sw * SIGN_H) / SIGN_W) },
  };
}

const num = (i: number) => String(i + 1).padStart(2, "0");

/**
 * Os capítulos: cada um é uma placa de rua na navegação e um outdoor na
 * cidade. A ordem tem que bater com `STOPS` (a parada 0 é o hero).
 */
const CHAPTERS = [
  { id: "projetos", label: SECTIONS.projetos.label },
  { id: "servicos", label: SECTIONS.servicos.label },
  { id: "metodo", label: SECTIONS.processo.label },
  { id: "sobre", label: SECTIONS.sobre.label },
  { id: "contato", label: "Contato" },
] as const;

/**
 * Bancada do "hero como outdoor", versão mínima: imagem primeiro, quase
 * nenhum texto.
 *
 * A placa do hero é um painel digital: as capas dos projetos se revezam nela,
 * e por cima fica só a marca, o H1 em corpo pequeno e um botão. O palco tem
 * 320vh e uma janela fixa de 100dvh: o scroll dentro dele leva a câmera até a
 * placa "Projetos", e a página pousa numa galeria só de imagens.
 *
 * Tudo que está nas placas é HTML comum, renderizado no servidor; a cena só o
 * reposiciona. Sem WebGL as placas ficam onde o CSS as põe, no meio da tela.
 */
export function HeroOutdoorLab({ projects }: { projects: OutdoorProject[] }) {
  const stage = useRef<HTMLElement>(null);
  const boards = useRef<(HTMLDivElement | null)[]>([]);
  const signs = useRef<(HTMLAnchorElement | null)[]>([]);
  const go = useRef<number | null>(null);
  const fade = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<Layout | null>(null);
  const [active, setActive] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [slide, setSlide] = useState({ cur: 0, prev: -1 });
  const [stop, setStop] = useState(0);

  /**
   * Clique numa placa de rua. Com a cena na tela, ela voa até lá pela rota do
   * destino; fora da tela (ou sem cena) é só um salto de scroll.
   */
  const navigate = (index: number) => {
    const el = stage.current;
    if (!el) return;
    if (active && layout) {
      go.current = index;
      return;
    }
    if (index < 0) return;
    const total = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + stopProgress(index) * total, behavior: "instant" });
  };

  const slides = useMemo(() => projects.slice(0, SLIDES), [projects]);
  // Os painéis soltos pela cidade mostram os projetos que não estão na placa.
  const cityCovers = useMemo(() => {
    const rest = projects.slice(SLIDES);
    return (rest.length ? rest : projects).map((p) => p.cover);
  }, [projects]);

  useEffect(() => {
    const read = () => setLayout(measure());
    read();
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);

  // Fora da tela a cena para de renderizar.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // O painel troca de capa sozinho, feito outdoor digital.
  useEffect(() => {
    if (reduced || !active || slides.length < 2) return;
    const id = window.setInterval(
      () => setSlide((s) => ({ cur: (s.cur + 1) % slides.length, prev: s.cur })),
      SLIDE_MS,
    );
    return () => window.clearInterval(id);
  }, [reduced, active, slides.length]);

  const shown = slides[slide.cur];

  return (
    <div className="site-home ho-root">
      <section ref={stage} className="ho-stage" data-cm-section="hero">
        <div className="ho-sticky">
          {layout && (
            <HeroOutdoorScene
              stage={stage}
              boards={boards}
              fade={fade}
              heroPx={layout.hero}
              chapterPx={layout.chapter}
              signs={signs}
              signPx={layout.sign}
              covers={cityCovers}
              go={go}
              onStop={setStop}
              active={active}
              reduced={reduced}
            />
          )}
          <div aria-hidden className="ho-vignette" />

          <div
            ref={(el) => {
              boards.current[0] = el;
            }}
            className="ho-board ho-board--hero"
            style={layout ? { width: layout.hero.w, height: layout.hero.h } : undefined}
          >
            <div aria-hidden className="ho-shots">
              {slides.map((p, i) => (
                <Image
                  key={p.slug}
                  src={p.cover}
                  alt=""
                  fill
                  priority={i === 0}
                  sizes="(max-width: 768px) 88vw, 40vw"
                  className={i === slide.cur ? "is-on" : i === slide.prev ? "is-prev" : undefined}
                />
              ))}
            </div>
            {shown && (
              <p key={shown.slug} className="ho-tag">
                <i aria-hidden style={{ background: shown.color }} />
                <span aria-hidden>{num(slide.cur)}</span>
                {shown.title}
              </p>
            )}
            <div className="ho-copy">
              <p className="ho-brand" role="img" aria-label="Coded by M">
                {HERO.brand.map((word) => (
                  <span key={word}>{word}</span>
                ))}
              </p>
              <h1 className="ho-lead">{HERO.lead}</h1>
              <div className="ho-cta">
                <FillButton href={WA} target="_blank" full>
                  {HERO.ctaPrimary}
                </FillButton>
              </div>
            </div>
          </div>

          {CHAPTERS.map((c, i) => {
            const shot = projects[(i + 1) % Math.max(1, projects.length)];
            return (
              <div
                key={c.id}
                ref={(el) => {
                  boards.current[i + 1] = el;
                }}
                className="ho-board ho-board--chapter"
                style={layout ? { width: layout.chapter.w, height: layout.chapter.h } : undefined}
              >
                {shot && (
                  <div aria-hidden className="ho-shots">
                    <Image
                      src={shot.cover}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 80vw, 40vw"
                      className="is-on"
                    />
                  </div>
                )}
                <p className="ho-tag">
                  <i aria-hidden />
                  <span aria-hidden>{num(i + 1)}</span>
                  Capítulo
                </p>
                <p className="ho-chapter-title">
                  {c.id === "contato" ? SECTIONS.contato.heading : c.label}
                </p>
                {c.id === "projetos" && (
                  <>
                    <div className="ho-body">
                      <p>{projects.length} projetos no ar, abertos pra conferir.</p>
                    </div>
                    <Link href="/projetos" className="ho-more">
                      Ver todos
                    </Link>
                  </>
                )}
                {c.id === "servicos" && (
                  <ul className="ho-body">
                    {SERVICES.map((s) => (
                      <li key={s.slug}>
                        <b>{s.title}</b>
                        {PRICE[s.slug] && <span>{PRICE[s.slug]}</span>}
                      </li>
                    ))}
                  </ul>
                )}
                {c.id === "metodo" && (
                  <ol className="ho-body ho-body--steps">
                    {PROCESS_STEPS.map((s) => (
                      <li key={s.num}>
                        <span aria-hidden>{s.num}</span>
                        <b>{s.title}</b>
                      </li>
                    ))}
                  </ol>
                )}
                {c.id === "sobre" && (
                  <div className="ho-body">
                    <p>{ABOUT.manifesto}</p>
                    <small>
                      {ABOUT.founder.name} · {ABOUT.location}
                    </small>
                  </div>
                )}
                {c.id === "contato" && (
                  <div className="ho-cta">
                    <FillButton href={WA_QUOTE} target="_blank" full>
                      {SECTIONS.contato.cta}
                    </FillButton>
                  </div>
                )}
              </div>
            );
          })}

          <div ref={fade} aria-hidden className="ho-fade" />
          {/* Os rótulos das placas do poste. As chapas são 3D; o texto e o
              clique são HTML, presos em cima delas só no close. */}
          {SIGNS.map((sign, i) => {
            const c = CHAPTERS[sign.stop - 1];
            return (
              <a
                key={c.id}
                ref={(el) => {
                  signs.current[i] = el;
                }}
                href={`#${c.id}`}
                className={sign.dir > 0 ? "ho-plate" : "ho-plate is-left"}
                style={
                  layout
                    ? ({
                        width: layout.sign.w,
                        height: layout.sign.h,
                        "--sh": `${layout.sign.h}px`,
                      } as CSSProperties)
                    : undefined
                }
                tabIndex={stop === GO_POST ? 0 : -1}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(sign.stop);
                }}
              >
                <span aria-hidden>{num(sign.stop)}</span>
                {c.label}
              </a>
            );
          })}

          {/* A navegação fixa é mínima: o triângulo da marca volta pro início
              e uma única placa dá o zoom no poste. */}
          <nav aria-label="Navegação" className="ho-nav">
            <a
              href="#top"
              aria-label="Início"
              className="ho-nav-home"
              onClick={(e) => {
                e.preventDefault();
                navigate(0);
              }}
            >
              <TriangleMark strokeWidth={9} style={{ width: 22 }} />
            </a>
            <button
              type="button"
              className="ho-sign"
              aria-pressed={stop === GO_POST}
              onClick={() => navigate(stop === GO_POST ? GO_BACK : GO_POST)}
            >
              <svg aria-hidden viewBox="0 0 24 24">
                <path d="M9.2 22.5 11.6 1.5" />
                <path d="M10.6 3.2 18.6 2.2 21.4 5 18 7.6 10.2 7.4Z" />
                <path d="M11.4 9.4 4.6 8.6 2.2 11.2 4.4 13.6 10.9 13.4Z" />
                <path d="M9.9 15.2 16.6 14.8 18.8 16.9 16.4 19 9.6 18.8Z" />
              </svg>
              {stop === GO_POST ? "Fechar" : "Menu"}
            </button>
          </nav>
        </div>
      </section>

      <section id="depois" className="ho-gallery" data-cm-section="projects">
        <header>
          <span aria-hidden>02</span>
          <h2>Projetos</h2>
        </header>
        <ol>
          {projects.map((p, i) => (
            <li key={p.slug}>
              <Link href={`/cases/${p.slug}`}>
                <span className="ho-g-shot">
                  <Image
                    src={p.cover}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 92vw, (max-width: 1200px) 46vw, 30vw"
                  />
                </span>
                <span className="ho-g-cap" style={{ "--c": p.color } as CSSProperties}>
                  <i aria-hidden />
                  <span aria-hidden>{num(i)}</span>
                  <b>{p.title}</b>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="ho-faq" data-cm-section="faq">
        <h2>{SECTIONS.faq.heading}</h2>
        {HOME_FAQ.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </section>
    </div>
  );
}
