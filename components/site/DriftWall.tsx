"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { driftColumnCount } from "@/lib/driftColumns";

/**
 * Muro de recortes à deriva — colunas de imagens num plano 3D inclinado,
 * vizinhas andando em sentidos opostos. Port do Drift Wall do React Bits,
 * reescrito no idioma da casa: CSS em `globals.css` (`.dw-*`), cantos retos,
 * e o loop só roda com a seção na tela.
 *
 * É AMBIENTE, não navegação: o muro inteiro é `aria-hidden` e os tiles ficam
 * fora do tab. Os tiles se repetem pra fechar o loop, então um leitor de tela
 * ouviria o mesmo projeto dez vezes. Quem navega é o índice ao lado.
 */
export interface DriftTile {
  src: string;
  slug: string;
  title: string;
  /** Cor do tipo de projeto — o cantinho que aparece no tile ativo. */
  color: string;
}

/** Espalha as colunas sem parecer aleatório nem regular (razão áurea). */
const columnFactor = (index: number, variance: number) => {
  const pseudo = ((index * 0.6180339887 + 0.35) % 1) * 2 - 1;
  return 1 + variance * pseudo;
};

/** Abaixo disso o muro vira bloco empilhado: menos colunas, sem parallax. */
const COMPACT_MQ = "(max-width: 700px)";

export function DriftWall({
  tiles,
  highlight = null,
  onActiveChange,
  speed = 34,
  variance = 0.45,
  parallax = 0.6,
  tilt = 16,
  turn = -14,
  depth = 120,
  lift = 64,
}: {
  tiles: DriftTile[];
  /** Slug que o índice está apontando — acende os tiles dele, apaga o resto. */
  highlight?: string | null;
  /** Avisa o índice qual projeto está sob o cursor no muro. */
  onActiveChange?: (slug: string | null) => void;
  speed?: number;
  variance?: number;
  parallax?: number;
  tilt?: number;
  turn?: number;
  depth?: number;
  lift?: number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);

  const offsetsRef = useRef<number[]>([]);
  const velocitiesRef = useRef<number[]>([]);
  const hoveredColRef = useRef(-1);
  const pointerRef = useRef({ x: 0, y: 0 });
  const dampedRef = useRef({ x: 0, y: 0 });
  const activeIdRef = useRef<string | null>(null);

  const [size, setSize] = useState({ w: 1200, h: 800 });
  const [compact, setCompact] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [visible, setVisible] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const cm = window.matchMedia(COMPACT_MQ);
    const sync = () => {
      setReduced(rm.matches);
      setCompact(cm.matches);
    };
    sync();
    rm.addEventListener("change", sync);
    cm.addEventListener("change", sync);
    return () => {
      rm.removeEventListener("change", sync);
      cm.removeEventListener("change", sync);
    };
  }, []);

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: width || 1200, h: height || 800 });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Fora da tela o loop para — mesmo princípio do congelamento dos canvases.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      {
        rootMargin: "120px 0px",
      },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const projectCount = useMemo(
    () => new Set(tiles.map((t) => t.slug)).size,
    [tiles],
  );
  const columns = driftColumnCount(compact, projectCount);
  // O tile acompanha a largura do muro: fixo em px, 5 colunas de 200px
  // sobram num monitor largo e estouram num notebook.
  const tileW = Math.round(
    Math.min(300, Math.max(132, (size.w / columns) * (compact ? 0.82 : 0.62))),
  );
  const tileH = Math.round(tileW * 0.64);
  const gap = compact ? 12 : 18;
  const parallaxOn = !compact && !reduced && parallax > 0;

  const columnItems = useMemo(() => {
    const cols: DriftTile[][] = Array.from({ length: columns }, () => []);
    tiles.forEach((t, i) => cols[i % columns].push(t));
    return cols.map((col) => (col.length ? col : tiles.slice(0, 1)));
  }, [tiles, columns]);

  const columnMeta = useMemo(() => {
    const unit = tileH + gap;
    return columnItems.map((col) => {
      const copyHeight = Math.max(unit, col.length * unit);
      const copies = Math.max(2, Math.ceil((size.h * 1.6) / copyHeight) + 1);
      return { copyHeight, copies };
    });
  }, [columnItems, tileH, gap, size.h]);

  const baseVelocities = useMemo(
    () =>
      columnItems.map((_, c) => {
        const alt = c % 2 === 0 ? 1 : -1;
        return (
          (compact ? speed * 0.6 : speed) * columnFactor(c, variance) * alt
        );
      }),
    [columnItems, speed, variance, compact],
  );

  useEffect(() => {
    offsetsRef.current = columnMeta.map(
      (m, c) => m.copyHeight * ((c * 0.37) % 1),
    );
    velocitiesRef.current = columnItems.map(() => 0);
  }, [columnMeta, columnItems]);

  useEffect(() => {
    const place = (px: number, py: number) => {
      const plane = planeRef.current;
      if (!plane) return;
      plane.style.transform =
        `translate(-50%, -50%) scale(1.18) ` +
        `rotateX(${tilt + py}deg) rotateY(${turn + px}deg) translateZ(${-depth}px)`;
    };
    const placeTracks = () => {
      for (let c = 0; c < trackRefs.current.length; c++) {
        const el = trackRefs.current[c];
        if (el)
          el.style.transform = `translate3d(0, ${-(offsetsRef.current[c] ?? 0)}px, 0)`;
      }
    };

    // Parado: pinta uma vez na pose de repouso e não agenda nada.
    if (reduced || !visible) {
      place(dampedRef.current.x, dampedRef.current.y);
      placeTracks();
      return;
    }

    let raf = 0;
    let last: number | null = null;
    const tick = (ts: number) => {
      if (last === null) last = ts;
      const dt = Math.min(0.05, Math.max(0, ts - last) / 1000);
      last = ts;

      const max = parallaxOn ? parallax * 8 : 0;
      const damp = 1 - Math.exp(-dt / 0.12);
      dampedRef.current.x +=
        (pointerRef.current.x * max - dampedRef.current.x) * damp;
      dampedRef.current.y +=
        (-pointerRef.current.y * max - dampedRef.current.y) * damp;
      place(dampedRef.current.x, dampedRef.current.y);

      for (let c = 0; c < trackRefs.current.length; c++) {
        const meta = columnMeta[c];
        if (!meta) continue;
        // A coluna do tile sob o cursor freia — dá pra mirar e clicar.
        const target = hoveredColRef.current === c ? 0 : baseVelocities[c];
        const ease = 1 - Math.exp(-dt / (target === 0 ? 0.16 : 0.28));
        velocitiesRef.current[c] += (target - velocitiesRef.current[c]) * ease;
        let next = (offsetsRef.current[c] ?? 0) + velocitiesRef.current[c] * dt;
        next = ((next % meta.copyHeight) + meta.copyHeight) % meta.copyHeight;
        offsetsRef.current[c] = next;
      }
      placeTracks();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [
    baseVelocities,
    columnMeta,
    parallax,
    parallaxOn,
    reduced,
    visible,
    tilt,
    turn,
    depth,
  ]);

  const setActive = useCallback(
    (id: string | null, col: number, slug: string | null) => {
      if (id === activeIdRef.current) return;
      activeIdRef.current = id;
      hoveredColRef.current = col;
      setActiveId(id);
      onActiveChange?.(slug);
    },
    [onActiveChange],
  );

  // O plano está em 3D e os tiles giram com ele: o hit-test do próprio
  // navegador é o único que acerta qual tile está sob o cursor.
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;
    if (parallaxOn) {
      pointerRef.current = {
        x: (e.clientX - rect.left) / rect.width - 0.5,
        y: (e.clientY - rect.top) / rect.height - 0.5,
      };
    }
    if (e.pointerType !== "mouse") return;
    const hit = document.elementFromPoint(e.clientX, e.clientY);
    const tile = hit?.closest<HTMLElement>("[data-tile-id]");
    if (!tile) return setActive(null, -1, null);
    setActive(
      tile.dataset.tileId ?? null,
      Number(tile.dataset.col),
      tile.dataset.slug ?? null,
    );
  };

  const onPointerLeave = () => {
    pointerRef.current = { x: 0, y: 0 };
    setActive(null, -1, null);
  };

  const vars = {
    "--dw-tile-w": `${tileW}px`,
    "--dw-tile-h": `${tileH}px`,
    "--dw-gap": `${gap}px`,
    "--dw-lift": `${lift}px`,
  } as CSSProperties;

  return (
    <div
      ref={rootRef}
      className="dw"
      data-focus={highlight ? "" : undefined}
      style={vars}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      aria-hidden
    >
      <div ref={planeRef} className="dw-plane">
        {columnItems.map((col, c) => (
          <div className="dw-col" key={c}>
            <div
              className="dw-track"
              ref={(el) => void (trackRefs.current[c] = el)}
            >
              {Array.from({ length: columnMeta[c].copies }).flatMap((_, copy) =>
                col.map((t, i) => {
                  const id = `${c}-${copy}-${i}`;
                  const cls = [
                    "dw-tile",
                    activeId === id && "is-active",
                    highlight === t.slug && "is-match",
                  ]
                    .filter(Boolean)
                    .join(" ");
                  return (
                    <Link
                      key={id}
                      href={`/cases/${t.slug}`}
                      tabIndex={-1}
                      className={cls}
                      data-tile-id={id}
                      data-col={c}
                      data-slug={t.slug}
                      draggable={false}
                    >
                      <span className="dw-inner">
                        <Image
                          src={t.src}
                          alt=""
                          width={600}
                          height={384}
                          sizes={`${tileW}px`}
                          draggable={false}
                          className="dw-img"
                        />
                        <span className="dw-veil" />
                        <span
                          className="dw-corner"
                          style={{ borderColor: t.color }}
                        />
                      </span>
                    </Link>
                  );
                }),
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
