"use client";

import { useEffect, useRef, useState } from "react";
import { QR_ROWS } from "@/data/cartao";

/**
 * Chegada pelo cartão: o QR é lido e a câmera entra nele.
 *
 * O QR do verso do cartão aparece no papel. A mira vem das bordas e trava;
 * o laser desce uma vez, pintando os módulos de vermelho; a mira pisca e o
 * carimbo diz "QR lido". Então a câmera mergulha num módulo preto perto do
 * centro: quando ele toma a tela, é o fundo da página, e a página está lá.
 * ~2,6s; tocar, clicar ou qualquer tecla pula. Sem three.js.
 *
 * Toca só com `utm_source=cartao` na URL, uma vez por sessão e nunca sob
 * "reduzir movimento". Quem decide é `QR_DIVE_BOOT`, inline, antes do
 * primeiro quadro: põe `bb-qr` no <html> e o véu (papel do cartão) cobre a
 * página desde o início, sem piscar o conteúdo.
 */

const KEY = "cbm:qr-dive";
const MARGIN = 3;
const N = QR_ROWS.length;
const SIZE = N + MARGIN * 2;

/** Linha do tempo, em ms. É aqui que se ajusta o ritmo. */
const T_READ = 1500; // mira travada + laser
const T_ZOOM = 1750; // começa o mergulho
const T_END = 2600; // tela toda preta: entra a página

/** Roda inline, antes da página pintar. Mantém em sincronia com KEY. */
export const QR_DIVE_BOOT = `try{var q=new URLSearchParams(location.search);if(q.get("utm_source")==="cartao"&&!sessionStorage.getItem("${KEY}")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.classList.add("bb-qr")}}catch(e){}`;

/** Um caminho só com todos os módulos escuros. */
const PATH = QR_ROWS.flatMap((row, y) =>
  row
    .split("")
    .flatMap((c, x) =>
      c === "1" ? [`M${x + MARGIN} ${y + MARGIN}h1v1h-1z`] : [],
    ),
).join("");

/**
 * Onde a câmera entra: o módulo preto mais perto do centro que tem mais
 * vizinhos pretos (o mergulho fica sólido até o fim, sem piscar papel).
 */
const TARGET = (() => {
  const dark = (x: number, y: number) => QR_ROWS[y]?.[x] === "1";
  let best = { x: N / 2, y: N / 2, score: -Infinity };
  for (let y = 1; y < N - 1; y++) {
    for (let x = 1; x < N - 1; x++) {
      if (!dark(x, y)) continue;
      let n = 0;
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) if (dark(x + dx, y + dy)) n++;
      const score = n * 4 - Math.hypot(x - N / 2, y - N / 2);
      if (score > best.score) best = { x, y, score };
    }
  }
  return { x: best.x + MARGIN + 0.5, y: best.y + MARGIN + 0.5 };
})();

export function QrDive() {
  const [on, setOn] = useState(false);
  const [read, setRead] = useState(false);
  const zoomEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!document.documentElement.classList.contains("bb-qr")) return;
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
      // sem armazenamento: toca, e só não lembra na próxima
    }
    window.scrollTo(0, 0);
    setOn(true);
  }, []);

  useEffect(() => {
    if (!on) return;
    const root = document.documentElement;
    const el = zoomEl.current;
    if (!el) return;

    let ended = false;
    let zoom: Animation | null = null;
    const timers: number[] = [];
    const end = () => {
      if (ended) return;
      ended = true;
      timers.forEach((t) => window.clearTimeout(t));
      zoom?.cancel();
      root.classList.remove("bb-qr");
      root.classList.add("bb-arrived");
      setOn(false);
      window.setTimeout(() => root.classList.remove("bb-arrived"), 1400);
    };

    timers.push(window.setTimeout(() => setRead(true), T_READ));
    timers.push(
      window.setTimeout(() => {
        // Quanto ampliar pra um módulo cobrir a tela inteira, com folga.
        const mod = el.getBoundingClientRect().width / SIZE;
        const scale =
          (Math.hypot(window.innerWidth, window.innerHeight) / mod) * 1.4;
        el.style.transformOrigin = `${(TARGET.x / SIZE) * 100}% ${(TARGET.y / SIZE) * 100}%`;
        zoom = el.animate(
          [{ transform: "scale(1)" }, { transform: `scale(${scale})` }],
          {
            duration: T_END - T_ZOOM,
            easing: "cubic-bezier(0.7, 0, 0.84, 0)",
            fill: "forwards",
          },
        );
        zoom.finished.then(end, () => {});
      }, T_ZOOM),
    );

    const skip = () => end();
    window.addEventListener("pointerdown", skip, { once: true });
    window.addEventListener("keydown", skip, { once: true });
    return () => {
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
      if (!ended) {
        timers.forEach((t) => window.clearTimeout(t));
        zoom?.cancel();
        root.classList.remove("bb-qr");
      }
    };
  }, [on]);

  return (
    <div className={`bb-qr-veil${read ? " is-read" : ""}`} aria-hidden>
      {on && (
        <>
          <p className="bb-qr-stamp">
            <i />
            Coded by M<b>{read ? "QR lido" : "Lendo"}</b>
          </p>
          <div className="bb-qr-box">
            <div ref={zoomEl} className="bb-qr-code">
              <svg viewBox={`0 0 ${SIZE} ${SIZE}`} shapeRendering="crispEdges">
                <path d={PATH} fill="#0b0b0b" />
              </svg>
            </div>
            <span className="bb-qr-aim" />
            <span className="bb-qr-scanwin">
              <i className="bb-qr-laser" />
            </span>
          </div>
        </>
      )}
    </div>
  );
}
