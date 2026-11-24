"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { CaseProject } from "@/types/case";
import { SURFACE } from "@/components/site/shared";
import { PROJECT_TYPE_COLOR } from "@/lib/projectTypes";
import { GalleryHeader } from "@/components/projetos/GalleryHeader";
import { IndexOpening } from "@/components/projetos/IndexOpening";
import { ProjetosIndex } from "@/components/projetos/ProjetosIndex";
import { AberturaCartao } from "./AberturaCartao";
import { AberturaCena } from "./AberturaCena";
import { AberturaCodigo } from "./AberturaCodigo";
import { AberturaCorte } from "./AberturaCorte";
import { AberturaMar } from "./AberturaMar";
import { AberturaQr } from "./AberturaQr";

type Variant = "cartao" | "qr" | "corte" | "codigo" | "mar" | "poeira" | "cidade" | "tipo";

const VARIANTS: { id: Variant; label: string }[] = [
  { id: "cartao", label: "Cartão" },
  { id: "qr", label: "QR" },
  { id: "corte", label: "Corte" },
  { id: "codigo", label: "Código" },
  { id: "mar", label: "Mar" },
  { id: "poeira", label: "Poeira" },
  { id: "cidade", label: "Cidade" },
  { id: "tipo", label: "Tipo" },
];

/**
 * Cor da crista por campanha: `?c=ambar` no QR de um evento pinta a onda e
 * já identifica de onde a visita veio. Também aceita hex sem "#" (`?c=5fb0a3`).
 */
const TINTS: Record<string, string> = {
  ambar: "#D9A15B",
  verde: "#5FB0A3",
  lilas: "#A98BC9",
};
const DEFAULT_TINT = "#FB3640";

function tintFrom(param: string | null) {
  if (!param) return DEFAULT_TINT;
  if (TINTS[param]) return TINTS[param];
  return /^[0-9a-f]{6}$/i.test(param) ? `#${param}` : DEFAULT_TINT;
}

/** Headline em teste na abertura do cartão. */
const CARD_HEADLINE = "Você acabou de escanear isso. Agora veja o que eu construo.";

/** Nome curto pro quadro de cinema: "Machado Plataformas" → "Machado". */
const shortName = (title: string) => title.split(" ")[0];

/**
 * Bancada das aberturas da `/projetos`.
 *
 * Monta a página real (abertura + índice vivo) e toca uma das oito
 * aberturas por cima. A barra troca de variante e repete; `?v=qr` na URL
 * abre direto numa delas, pra testar como quem chega pelo QR.
 *
 * Sob "reduzir movimento" nenhuma abertura toca: é o comportamento que a
 * versão de produção teria.
 */
export function AberturasLab({
  live,
  conceptual,
}: {
  live: CaseProject[];
  conceptual: CaseProject[];
}) {
  const projects = useMemo(() => [...live, ...conceptual], [live, conceptual]);
  const [variant, setVariant] = useState<Variant>("cartao");
  const [run, setRun] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [tint, setTint] = useState(DEFAULT_TINT);

  const play = useCallback((v: Variant) => {
    setVariant(v);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    window.scrollTo(0, 0);
    setRun((r) => r + 1);
    setPlaying(true);
  }, []);

  const done = useCallback(() => setPlaying(false), []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const v = params.get("v");
    setTint(tintFrom(params.get("c")));
    play(VARIANTS.find((x) => x.id === v)?.id ?? "cartao");
  }, [play]);

  // Enquanto a abertura cobre a tela, a página atrás não rola.
  useEffect(() => {
    if (!playing) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prev;
    };
  }, [playing]);

  const covers = useMemo(
    () => projects.map((p) => p.preview?.card).filter((s): s is string => Boolean(s)),
    [projects],
  );
  const cutNames = useMemo(() => live.slice(0, 3).map((p) => shortName(p.title)), [live]);
  // As cenas em WebGL (6 a 8) mostram os três primeiros projetos reais.
  const featured = useMemo(() => {
    const list = live.slice(0, 3).filter((p) => p.preview?.card);
    return {
      covers: list.map((p) => p.preview!.card as string),
      names: list.map((p) => p.title),
      colors: list.map((p) => PROJECT_TYPE_COLOR[p.type ?? "institucional"]),
    };
  }, [live]);
  const codeProjects = useMemo(
    () =>
      live.slice(0, 3).map((p) => ({
        title: p.title,
        type: p.type ?? "institucional",
        cover: p.preview?.card,
      })),
    [live],
  );

  return (
    <div className="site-home pi-root min-h-dvh text-[#F5F2ED]" style={{ background: SURFACE.base }}>
      <GalleryHeader label="Lab · aberturas" />
      <main>
        {/* A chave remonta a abertura da página quando a cena termina: é o que
            faz o H1 subir logo depois do corte, e não escondido atrás dele. */}
        <IndexOpening
          key={`${run}-${playing}`}
          total={projects.length}
          title={variant === "cartao" ? CARD_HEADLINE : undefined}
        />
        <ProjetosIndex live={live} conceptual={conceptual} />
      </main>

      {playing && variant === "cartao" && <AberturaCartao key={run} onDone={done} />}
      {playing && variant === "qr" && <AberturaQr key={run} covers={covers} onDone={done} />}
      {playing && variant === "corte" && <AberturaCorte key={run} names={cutNames} onDone={done} />}
      {playing && variant === "codigo" && (
        <AberturaCodigo key={run} projects={codeProjects} onDone={done} />
      )}

      {playing && variant === "mar" && (
        <AberturaMar
          key={run}
          projects={projects}
          accent={tint}
          onDone={done}
          onReplay={() => play("mar")}
        />
      )}

      {playing && (variant === "poeira" || variant === "cidade" || variant === "tipo") && (
        <AberturaCena
          key={run}
          scene={variant}
          covers={featured.covers}
          names={featured.names}
          colors={featured.colors}
          accent={tint}
          onDone={done}
        />
      )}

      <nav aria-label="Aberturas em teste" className={playing ? "ab-bar is-hidden" : "ab-bar"}>
        {VARIANTS.map((v, i) => (
          <button
            key={v.id}
            type="button"
            aria-pressed={v.id === variant}
            onClick={() => play(v.id)}
            tabIndex={playing ? -1 : 0}
          >
            {i + 1} {v.label}
          </button>
        ))}
        <button type="button" onClick={() => play(variant)} tabIndex={playing ? -1 : 0}>
          Repetir
        </button>
      </nav>
    </div>
  );
}
