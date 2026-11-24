"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import type { CenaProps } from "./cena";

const SCENES = {
  poeira: dynamic(() => import("./PoeiraScene"), { ssr: false }),
  cidade: dynamic(() => import("./CidadeScene"), { ssr: false }),
  tipo: dynamic(() => import("./TipoScene"), { ssr: false }),
};

export type CenaId = keyof typeof SCENES;

/** O que o carimbo do HUD diz em cada fase. */
const HUD_LABEL: Record<string, string> = {
  scan: "QR lido",
  rise: "Construindo",
  fly: "Projetos",
  dive: "Projetos",
};

/** Quanto a cena demora pra sumir e devolver a página. */
const LEAVE_MS = 520;

/**
 * Moldura das aberturas em WebGL (6 Poeira, 7 Cidade, 8 Tipo).
 *
 * Cuida do que é igual nas três: o botão de pular, o `?t=` que congela um
 * quadro, a legenda do projeto em foco e a saída em fade até a página.
 */
export function AberturaCena({
  scene,
  covers,
  names,
  colors,
  accent,
  onDone,
}: {
  scene: CenaId;
  covers: string[];
  names: string[];
  colors: string[];
  accent: string;
  onDone: () => void;
}) {
  const Scene = SCENES[scene];
  const skip = useRef(false);
  const [leaving, setLeaving] = useState(false);
  const [cue, setCue] = useState(-1);
  const [phase, setPhase] = useState("");
  const [freeze, setFreeze] = useState<number | undefined>(undefined);

  useEffect(() => {
    const t = Number(new URLSearchParams(window.location.search).get("t"));
    if (Number.isFinite(t) && t > 0) setFreeze(t);
  }, []);

  const onEnd = useCallback(() => setLeaving(true), []);

  useEffect(() => {
    if (!leaving) return;
    const t = window.setTimeout(onDone, LEAVE_MS);
    return () => window.clearTimeout(t);
  }, [leaving, onDone]);

  const props: CenaProps = {
    covers,
    names,
    colors,
    accent,
    skip,
    freeze,
    onCue: setCue,
    onPhase: setPhase,
    onEnd,
  };

  return (
    <div className={leaving ? "ab-layer ab-cena is-leaving" : "ab-layer ab-cena"}>
      <Scene {...props} />
      {phase && (
        <div
          aria-hidden
          className={`ab-hud is-${phase}`}
          style={{ "--ab-accent": accent } as CSSProperties}
        >
          <span className="ab-hud-bar" />
          <p className="ab-hud-stamp">
            <i />
            Coded by M<b>{HUD_LABEL[phase] ?? ""}</b>
          </p>
          <div className="ab-hud-scan">
            <i />
          </div>
        </div>
      )}
      {cue >= 0 && names[cue] && (
        <p key={cue} className="ab-cena-cue">
          <span aria-hidden>{String(cue + 1).padStart(2, "0")}</span>
          {names[cue]}
        </p>
      )}
      {!leaving && (
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
    </div>
  );
}
