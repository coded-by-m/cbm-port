"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type MutableRefObject } from "react";
import type { CaseProject } from "@/types/case";
import { PROJECT_TYPE_COLOR } from "@/lib/projectTypes";
import type { StageBridge } from "./IndexStageGL";

const IndexStageGL = dynamic(() => import("./IndexStageGL"), { ssr: false });

/** Só no layout de duas colunas a capa vira janela que segue o ponteiro. */
const WINDOW_MQ = "(min-width: 900px) and (hover: hover) and (pointer: fine)";
const REDUCED_MQ = "(prefers-reduced-motion: reduce)";
/** Altura do header sticky e do dock, que a janela não pode cobrir. */
const TOP_GUARD = 72;
const BOTTOM_GUARD = 84;

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") ?? c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * A cena atrás do índice: a capa do projeto ativo.
 *
 * A camada base é DOM: as capas empilhadas, a ativa por crossfade. É ela que
 * aparece sem JS, sob "reduzir movimento", sem WebGL ou com contexto perdido.
 * Quando a camada WebGL desenha o primeiro frame, cobre a base — e usa as
 * MESMAS `<img>` como textura, então nenhuma capa é baixada duas vezes.
 *
 * As capas entram no DOM aos poucos: a ativa e duas vizinhas pra cada lado.
 */
export function IndexStage({
  projects,
  active,
  bridge,
}: {
  projects: CaseProject[];
  active: number;
  bridge: MutableRefObject<StageBridge>;
}) {
  const frame = useRef<HTMLDivElement>(null);
  /**
   * Fonte das texturas. Não é a `<img>` da página: nela `width`/`height` são o
   * tamanho de LAYOUT, e o three aloca a textura por eles enquanto o upload
   * manda os pixels naturais — o WebGL recusa. A cópia tem as dimensões do
   * arquivo e sai do cache, sem segundo download.
   */
  const sources = useRef<(HTMLImageElement | null)[]>([]);
  const [wanted, setWanted] = useState<ReadonlySet<number>>(() => new Set([0, 1, 2]));
  const [gl, setGl] = useState<"off" | "loading" | "on">("off");
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    setWanted((prev) => {
      const next = new Set(prev);
      for (let i = active - 2; i <= active + 2; i++) {
        if (i >= 0 && i < projects.length) next.add(i);
      }
      return next.size === prev.size ? prev : next;
    });
  }, [active, projects.length]);

  useEffect(() => {
    if (window.matchMedia(REDUCED_MQ).matches || !hasWebGL()) return;
    setCoarse(window.matchMedia("(pointer: coarse)").matches);
    setGl("loading");
  }, []);

  // Janela que segue o ponteiro, com atraso. O loop para quando ela chega.
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const windowed = window.matchMedia(WINDOW_MQ);
    const reduced = window.matchMedia(REDUCED_MQ);
    let raf = 0;
    let y = window.innerHeight / 2;
    let targetY = y;
    let lastPointerY = y;
    let lastT = performance.now();

    const clampY = (v: number) => {
      const half = el.offsetHeight / 2;
      const min = TOP_GUARD + half;
      const max = window.innerHeight - BOTTOM_GUARD - half;
      return max > min ? Math.max(min, Math.min(max, v)) : window.innerHeight / 2;
    };

    const tick = () => {
      y += (targetY - y) * 0.09;
      el.style.transform = `translate3d(0, calc(${y.toFixed(1)}px - 50%), 0)`;
      raf = Math.abs(targetY - y) > 0.3 ? requestAnimationFrame(tick) : 0;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !windowed.matches || reduced.matches) return;
      const now = performance.now();
      const dt = now - lastT;
      if (dt > 0) {
        const v = (e.clientY - lastPointerY) / dt / 2.4;
        bridge.current.vel = Math.max(-1, Math.min(1, v));
        bridge.current.kick();
      }
      lastPointerY = e.clientY;
      lastT = now;
      targetY = clampY(e.clientY);
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const reset = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      el.style.transform = "";
      y = targetY = window.innerHeight / 2;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", reset);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", reset);
    };
  }, [bridge]);

  const getImage = (i: number) => sources.current[i] ?? null;

  const adopt = (i: number, img: HTMLImageElement) => {
    if (sources.current[i] || !img.currentSrc) return;
    const copy = new window.Image();
    copy.onload = () => {
      sources.current[i] = copy;
      bridge.current.kick();
    };
    copy.src = img.currentSrc;
  };

  const color = PROJECT_TYPE_COLOR[projects[active]?.type ?? "institucional"];

  return (
    <div aria-hidden className="pi-stage">
      <div ref={frame} className="pi-frame" style={{ "--pi-color": color } as CSSProperties}>
        {projects.map((p, i) => {
          const src = p.preview?.card ?? p.preview?.desktop;
          if (!src || !wanted.has(i)) return null;
          return (
            <Image
              key={p.slug}
              src={src}
              alt=""
              width={760}
              height={874}
              sizes="(min-width: 900px) 40vw, 100vw"
              priority={i === 0}
              onLoad={(e) => adopt(i, e.currentTarget)}
              className={i === active ? "pi-shot is-on" : "pi-shot"}
            />
          );
        })}
        {gl !== "off" && (
          <div className={gl === "on" ? "pi-canvas is-on" : "pi-canvas"}>
            <IndexStageGL
              active={active}
              getImage={getImage}
              bridge={bridge}
              coarse={coarse}
              onReady={() => setGl("on")}
              onLost={() => setGl("off")}
            />
          </div>
        )}
        <span className="pi-veil" />
        <span className="pi-corner" />
      </div>
    </div>
  );
}
