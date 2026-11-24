"use client";

import { useEffect, useRef, useState } from "react";
import { QR_ROWS } from "@/data/cartao";

/** Tempos da abertura, em ms. */
const HOLD_MS = 700;
const FLY_MS = 1350;
const SETTLE_MS = 420;
const LEAVE_MS = 360;
/** Quanto de espera extra as capas podem pedir antes de a animação seguir sem elas. */
const MAX_WAIT_MS = 1600;

/** Off-white do verso do cartão e o escuro da página. */
const PAPER = [244, 240, 230];
const DARK = [10, 10, 10];
const INK = "#0b0b0b";

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const smooth = (a: number, b: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

interface Particle {
  /** Módulo do QR de onde parte. */
  sx: number;
  sy: number;
  /** Ladrilho do mosaico onde chega. */
  ex: number;
  ey: number;
  /** Capa e recorte dela que o ladrilho mostra. */
  cover: number;
  u: number;
  v: number;
  uw: number;
  vh: number;
  /** Desvio no meio do voo e atraso de saída. */
  dx: number;
  dy: number;
  delay: number;
}

/**
 * 2 · Revelação pelo QR.
 *
 * A tela abre com o QR do cartão (os módulos reais, de `data/cartao.ts`). Os
 * módulos escuros se soltam e cada um vira um ladrilho das capas dos
 * projetos, até fechar um mosaico que cobre a tela.
 *
 * É canvas 2D: são ~700 quadrados por frame, leve o bastante pra celular e
 * sem gastar um contexto WebGL a mais (a página atrás já usa um).
 */
export function AberturaQr({ covers, onDone }: { covers: string[]; onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      onDone();
      return;
    }

    const W = window.innerWidth;
    const H = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.scale(dpr, dpr);

    // QR centrado, com os módulos escuros em ordem de leitura.
    const n = QR_ROWS.length;
    const qrSize = Math.min(W, H) * 0.76;
    const mod = qrSize / n;
    const qx = (W - qrSize) / 2;
    const qy = (H - qrSize) / 2;
    const modules: [number, number][] = [];
    QR_ROWS.forEach((row, r) => {
      for (let c = 0; c < n; c++) if (row[c] === "1") modules.push([qx + c * mod, qy + r * mod]);
    });

    // Mosaico: ladrilhos quase quadrados, em número próximo ao de módulos.
    const side = Math.sqrt((W * H) / modules.length);
    const cols = Math.ceil(W / side);
    const rows = Math.ceil(H / side);
    const tw = W / cols;
    const th = H / rows;

    // As capas ocupam uma grade 2×5 em pé ou 5×2 deitado.
    const gCols = W >= H ? 5 : 2;
    const gRows = Math.ceil(covers.length / gCols);
    const gw = W / gCols;
    const gh = H / gRows;

    let seed = 7;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };

    const total = cols * rows;
    const particles: Particle[] = [];
    for (let k = 0; k < total; k++) {
      const col = k % cols;
      const row = Math.floor(k / cols);
      const ex = col * tw;
      const ey = row * th;
      const [sx, sy] = modules[Math.floor((k * modules.length) / total)];
      const gx = Math.min(gCols - 1, Math.floor((ex + tw / 2) / gw));
      const gy = Math.min(gRows - 1, Math.floor((ey + th / 2) / gh));
      particles.push({
        sx,
        sy,
        ex,
        ey,
        cover: (gy * gCols + gx) % covers.length,
        u: (ex - gx * gw) / gw,
        v: (ey - gy * gh) / gh,
        uw: tw / gw,
        vh: th / gh,
        dx: (rnd() - 0.5) * W * 0.3,
        dy: (rnd() - 0.5) * H * 0.22,
        delay: rnd() * 0.34,
      });
    }

    const images = covers.map((src) => {
      const img = new window.Image();
      img.src = src;
      return img;
    });
    const loaded = () => images.every((img) => img.complete);

    let raf = 0;
    let flyStart = 0;
    let finished = false;
    const start = performance.now();
    const timers: number[] = [];

    const draw = (now: number) => {
      const sinceStart = now - start;
      // O voo só começa com as capas na mão, ou quando a espera estoura.
      if (!flyStart && sinceStart >= HOLD_MS && (loaded() || sinceStart >= HOLD_MS + MAX_WAIT_MS)) {
        flyStart = now;
      }
      const p = flyStart ? Math.min(1, (now - flyStart) / FLY_MS) : 0;

      const bg = smooth(0.1, 0.8, p);
      ctx.fillStyle = `rgb(${PAPER.map((c, i) => Math.round(c + (DARK[i] - c) * bg)).join(",")})`;
      ctx.fillRect(0, 0, W, H);

      const cover = gw / gh;
      for (const q of particles) {
        const t = easeInOut(Math.max(0, Math.min(1, (p - q.delay) / (1 - 0.34))));
        const arc = Math.sin(Math.PI * t);
        const x = q.sx + (q.ex - q.sx) * t + q.dx * arc;
        const y = q.sy + (q.ey - q.sy) * t + q.dy * arc;
        const w = mod + (tw - mod) * t;
        const h = mod + (th - mod) * t;

        const img = images[q.cover];
        const show = smooth(0.3, 0.8, t);
        if (show < 1 || !img.complete || !img.naturalWidth) {
          ctx.globalAlpha = 1;
          ctx.fillStyle = INK;
          ctx.fillRect(x, y, w + 0.5, h + 0.5);
        }
        if (show > 0 && img.complete && img.naturalWidth) {
          // object-fit: cover ancorado no topo, dentro da célula da capa.
          const ia = img.naturalWidth / img.naturalHeight;
          const sw = ia > cover ? img.naturalHeight * cover : img.naturalWidth;
          const sh = ia > cover ? img.naturalHeight : img.naturalWidth / cover;
          const ox = (img.naturalWidth - sw) / 2;
          ctx.globalAlpha = show;
          ctx.drawImage(img, ox + q.u * sw, q.v * sh, q.uw * sw, q.vh * sh, x, y, w + 0.5, h + 0.5);
        }
      }
      ctx.globalAlpha = 1;

      if (p >= 1 && !finished) {
        finished = true;
        timers.push(window.setTimeout(() => setLeaving(true), SETTLE_MS));
        timers.push(window.setTimeout(onDone, SETTLE_MS + LEAVE_MS));
        return;
      }
      if (!finished) raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [covers, onDone]);

  return (
    <div className={leaving ? "ab-layer ab-qr is-leaving" : "ab-layer ab-qr"}>
      <canvas ref={canvasRef} />
    </div>
  );
}
