"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import type { CaseProject } from "@/types/case";
import { PROJECT_TYPE_COLOR } from "@/lib/projectTypes";

const MarScene = dynamic(() => import("./MarScene"), { ssr: false });

/** Quanto o canvas demora pra sumir depois que os cacos entram. */
const CANVAS_OUT_MS = 700;
/** Duração da abertura de um caco até a tela cheia. */
const OPEN_MS = 520;

interface Opening {
  slug: string;
  src?: string;
  up: boolean;
  rect: { top: number; left: number; width: number; height: number };
}

/**
 * Quantos cacos por fileira: 2 em pé (5 fileiras), 5 deitado (2 fileiras).
 * Numa fileira de `n`, cada caco tem base 2/(n+1) da largura e anda meio
 * passo: é o que faz ponta-pra-cima e ponta-pra-baixo se encaixarem.
 */
const perRow = (portrait: boolean) => (portrait ? 2 : 5);

/**
 * 5 · O mar.
 *
 * Cenas 1 a 3 em WebGL (`MarScene`): mar de triângulos, o triângulo da marca
 * surfando a crista, o tombo que congela o mar em terreno. Na cena 4 o canvas
 * sai e entram os projetos em HTML, cada um recortado em triângulo com
 * `clip-path` — links reais pros cases. Tocar num caco o abre até a tela
 * cheia antes de navegar.
 *
 * Diferente das outras aberturas, esta termina num estado próprio (o mosaico)
 * em vez de devolver a página: por isso tem os próprios botões de repetir e
 * de ir pro índice.
 */
export function AberturaMar({
  projects,
  accent,
  onDone,
  onReplay,
}: {
  projects: CaseProject[];
  accent: string;
  onDone: () => void;
  onReplay: () => void;
}) {
  const router = useRouter();
  const skip = useRef(false);
  const [stage, setStage] = useState<"scene" | "handoff" | "mosaic">("scene");
  const [portrait, setPortrait] = useState(true);
  const [opening, setOpening] = useState<Opening | null>(null);
  const [full, setFull] = useState(false);
  const [flash, setFlash] = useState(false);
  // `?t=1.2` congela a cena nesse instante: serve pra afinar um quadro.
  const [freeze, setFreeze] = useState<number | undefined>(undefined);

  useEffect(() => {
    const read = () => setPortrait(window.innerWidth < window.innerHeight);
    read();
    const t = Number(new URLSearchParams(window.location.search).get("t"));
    if (Number.isFinite(t) && t > 0) setFreeze(t);
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);

  const onImpact = useCallback(() => {
    setFlash(true);
    try {
      navigator.vibrate?.(28);
    } catch {
      // Sem suporte ou sem gesto prévio: o tombo acontece igual.
    }
  }, []);

  const onProjects = useCallback(() => setStage("handoff"), []);

  // O canvas só desmonta depois de sumir: o terreno e os cacos se cruzam.
  useEffect(() => {
    if (stage !== "handoff") return;
    const t = window.setTimeout(() => setStage("mosaic"), CANVAS_OUT_MS);
    return () => window.clearTimeout(t);
  }, [stage]);

  const open = (e: MouseEvent<HTMLAnchorElement>, p: CaseProject, up: boolean) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    const r = e.currentTarget.getBoundingClientRect();
    setOpening({
      slug: p.slug,
      src: p.preview?.card,
      up,
      rect: { top: r.top, left: r.left, width: r.width, height: r.height },
    });
    requestAnimationFrame(() => requestAnimationFrame(() => setFull(true)));
    window.setTimeout(() => router.push(`/cases/${p.slug}`), OPEN_MS);
  };

  const n = perRow(portrait);
  const rows = Math.ceil(projects.length / n);
  const base = 200 / (n + 1);

  return (
    <div className="ab-layer ab-mar">
      {stage !== "mosaic" && (
        <div className={stage === "handoff" ? "ab-mar-canvas is-out" : "ab-mar-canvas"}>
          <MarScene accent={accent} skip={skip} freeze={freeze} onImpact={onImpact} onProjects={onProjects} />
          {flash && <span className="ab-mar-flash" style={{ background: accent }} />}
        </div>
      )}

      {stage === "scene" && (
        <button
          type="button"
          className="ab-mar-skip"
          onClick={() => {
            skip.current = true;
          }}
        >
          Pular
        </button>
      )}

      {stage !== "scene" && (
        <div className="ab-shards">
          <div className="ab-shards-bar">
            <button type="button" onClick={onReplay}>
              Repetir
            </button>
            <button type="button" onClick={onDone}>
              Ir para o índice
            </button>
          </div>
          <ol className="ab-shards-grid" style={{ "--rows": rows } as CSSProperties}>
            {projects.map((p, i) => {
              const row = Math.floor(i / n);
              const col = i % n;
              const up = (row + col) % 2 === 0;
              const src = p.preview?.card;
              // Os cacos nascem do ponto do impacto (centro da tela) pra fora:
              // o atraso de cada um é a distância dele até lá.
              const dx = ((col * base) / 2 + base / 2 - 50) / 50;
              const dy = (((row + 0.5) * 100) / rows - 50) / 50;
              const delay = Math.round(Math.hypot(dx, dy) * 260);
              return (
                <li
                  key={p.slug}
                  className={up ? "ab-shard is-up" : "ab-shard is-down"}
                  style={
                    {
                      "--d": `${delay}ms`,
                      "--ox": `${50 - dx * 60}%`,
                      "--oy": `${50 - dy * 60}%`,
                      "--pi-color": PROJECT_TYPE_COLOR[p.type ?? "institucional"],
                      left: `${(col * base) / 2}%`,
                      width: `${base}%`,
                      top: `${(row * 100) / rows}%`,
                      height: `${100 / rows}%`,
                    } as CSSProperties
                  }
                >
                  <a href={`/cases/${p.slug}`} onClick={(e) => open(e, p, up)}>
                    {src && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={src} alt="" />
                    )}
                    <span className="ab-shard-label">
                      <span aria-hidden>{String(i + 1).padStart(2, "0")}</span>
                      {p.title}
                    </span>
                  </a>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {opening && (
        <div
          aria-hidden
          className={`ab-shard-open ${opening.up ? "is-up" : "is-down"} ${full ? "is-full" : ""}`}
          style={full ? undefined : opening.rect}
        >
          {opening.src && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={opening.src} alt="" />
          )}
        </div>
      )}
    </div>
  );
}
