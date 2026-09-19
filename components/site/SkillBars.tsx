"use client";

import { useEffect, useRef, useState } from "react";
import { SKILLS } from "@/data/about";
import { PANCHANG, SATOSHI } from "./shared";

/**
 * As capacidades do estúdio em trilhos.
 *
 * Preenchem quando entram na tela, em cascata — o mesmo gesto das outras
 * seções. `scaleX` em vez de `width` porque só transform e opacity rodam no
 * compositor; animar largura força layout a cada frame.
 *
 * Sob `prefers-reduced-motion` os trilhos já nascem cheios.
 */
export function SkillBars() {
  const ref = useRef<HTMLUListElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            obs.disconnect();
          }
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <ul
      ref={ref}
      style={{
        margin: 0,
        padding: 0,
        listStyle: "none",
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      {SKILLS.map((s, i) => (
        <li key={s.label} style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <span
              style={{
                fontFamily: SATOSHI,
                fontWeight: 500,
                fontSize: 11,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#C8C4BE",
              }}
            >
              {s.label}
            </span>
            <span
              style={{
                fontFamily: PANCHANG,
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: "0.02em",
                color: "#F5F2ED",
                flex: "none",
                opacity: shown ? 1 : 0,
                transition: `opacity 500ms ease-out ${i * 110 + 260}ms`,
              }}
            >
              {s.level}
              <span style={{ color: "#FB3640" }}>%</span>
            </span>
          </div>

          <span
            aria-hidden
            style={{
              position: "relative",
              display: "block",
              height: 2,
              background: "rgba(245,242,237,0.1)",
            }}
          >
            <span
              style={{
                position: "absolute",
                inset: 0,
                transformOrigin: "left center",
                background: "#FB3640",
                transform: `scaleX(${shown ? s.level / 100 : 0})`,
                transition: `transform 900ms cubic-bezier(0.22,1,0.36,1) ${i * 110}ms`,
              }}
            />
          </span>
        </li>
      ))}
    </ul>
  );
}
