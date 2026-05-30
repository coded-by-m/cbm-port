"use client";

import { useCallback, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Equilateral triangular mesh — 3 families of parallel lines
// Family 1: horizontal  (y = n × triHeight)
// Family 2: slope +√3   (down-right diagonals, 60° from horizontal)
// Family 3: slope -√3   (down-left diagonals, 120° from horizontal)
// Together they create a mathematically correct equilateral triangle grid.
// ---------------------------------------------------------------------------
function generateEquiMesh(w: number, h: number, s: number): string {
  const th = s * Math.sqrt(3) / 2; // triangle height
  const dxH = h / Math.sqrt(3);   // horizontal travel of diagonals over full h
  const parts: string[] = [];

  // Family 1 — horizontal lines at every triangle height
  for (let n = -1; n * th <= h + th; n++) {
    const y = (n * th).toFixed(2);
    parts.push(`M${(-s).toFixed(2)} ${y}H${(w + s).toFixed(2)}`);
  }

  // Family 2 — slope +√3: line from (x0, 0) to (x0 + dxH, h)
  for (let m = -3; m * s <= w + dxH + s; m++) {
    const x0 = m * s;
    parts.push(`M${x0.toFixed(2)} 0L${(x0 + dxH).toFixed(2)} ${h.toFixed(2)}`);
  }

  // Family 3 — slope -√3: line from (x0, 0) to (x0 - dxH, h)
  for (let m = -3; m * s <= w + dxH + s; m++) {
    const x0 = m * s;
    parts.push(`M${x0.toFixed(2)} 0L${(x0 - dxH).toFixed(2)} ${h.toFixed(2)}`);
  }

  return parts.join(" ");
}

// Pre-computed — avoids runtime allocation on every render
const PATH_DEFAULT = generateEquiMesh(240, 72, 16);
const PATH_COMPACT = generateEquiMesh(190, 56, 12);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface Props {
  compact?: boolean;
  state?: "default" | "hover" | "pressed";
  label?: string;
}

export function CinematicMeshCSS({
  compact = false,
  state,
  label = "Iniciar Projeto",
}: Props) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [live, setLive] = useState<"default" | "hover" | "pressed">("default");
  const [pivot, setPivot] = useState({ x: 50, y: 100 }); // % for transform-origin

  const displayState = state ?? live;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = btnRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setPivot({ x, y });
    },
    [],
  );

  const isHover   = displayState === "hover";
  const isPressed = displayState === "pressed";
  const active    = isHover || isPressed;

  const meshOpacity  = isPressed ? 0.68 : isHover ? 0.52 : 0.22;
  const rotX         = isPressed ? 10   : isHover ? 6    : 0;
  const translateY   = isPressed ? 5    : isHover ? 2.5  : 0;
  const bgColor      = isPressed ? "#C42030" : isHover ? "#e82d37" : "#FB3640";
  const meshPath     = compact ? PATH_COMPACT : PATH_DEFAULT;

  const padH  = compact ? "pl-4"   : "pl-6";
  const padV  = compact ? "py-[10px]" : "py-[14px]";
  const fSize = compact ? "text-[10px]" : "text-[11px]";
  const sepPl = compact ? "pl-3"   : "pl-3.5";
  const arwSz = compact ? "text-[9px]" : "text-[10px]";

  return (
    <button
      ref={btnRef}
      type="button"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => state === undefined && setLive("hover")}
      onMouseLeave={() => state === undefined && setLive("default")}
      onMouseDown={() => state === undefined && setLive("pressed")}
      onMouseUp={() =>
        state === undefined &&
        setLive(btnRef.current?.matches(":hover") ? "hover" : "default")
      }
      className={`relative inline-flex items-center overflow-hidden font-display font-semibold uppercase tracking-[0.15em] text-cbm-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-cbm-red focus-visible:outline-offset-[3px] ${padH} ${padV} ${fSize}`}
      style={{
        backgroundColor: bgColor,
        transition: "background-color 180ms ease",
      }}
    >
      {/* Triangular mesh SVG layer */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: meshOpacity,
          transform: `perspective(280px) rotateX(${rotX}deg) translateY(${translateY}px)`,
          transformOrigin: `${pivot.x}% 100%`,
          transition: active
            ? "opacity 180ms ease, transform 220ms cubic-bezier(0.33,1,0.68,1)"
            : "opacity 300ms ease, transform 350ms cubic-bezier(0.33,1,0.68,1)",
          willChange: "transform, opacity",
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={compact ? "0 0 190 56" : "0 0 240 72"}
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d={meshPath}
            fill="none"
            stroke="#F5F2ED"
            strokeWidth={compact ? "0.65" : "0.75"}
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Depression vignette — center darkens to simulate bowl depth */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 70% 80% at ${pivot.x}% ${pivot.y}%, rgba(0,0,0,0.28) 0%, transparent 100%)`,
          opacity: active ? 1 : 0,
          transition: "opacity 220ms ease",
        }}
      />

      {/* Label */}
      <span className="relative z-10">{label}</span>

      {/* Structural separator + arrow */}
      <span
        className={`relative z-10 ml-4 flex items-center self-stretch ${sepPl}`}
        style={{ borderLeft: "1px solid rgba(0,0,0,0.24)" }}
      >
        <span className={`${arwSz} leading-none`} aria-hidden="true">▸</span>
      </span>
    </button>
  );
}
