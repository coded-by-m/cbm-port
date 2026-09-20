"use client";

import { useEffect, useRef, useState } from "react";
import { SKILLS, SKILL_SCALE } from "@/data/about";
import { SECTIONS } from "@/data/home";
import { PANCHANG, SATOSHI, SECTION } from "./shared";
import { Reveal } from "@/components/ui/Reveal";

/**
 * As capacidades do estúdio numa escala de losangos.
 *
 * Dez degraus em vez de uma barra de porcentagem: 87% sugere medição de algo,
 * e não há o que medir — são dez passos contáveis e uma opinião assumida.
 *
 * Os losangos cheios acendem em cascata quando a lista entra na tela, linha
 * por linha e da esquerda pra direita. Os vazios já estão lá: são o trilho,
 * e é o contraste com eles que diz onde a linha parou.
 *
 * Só `transform` e `opacity` — as duas propriedades que o compositor resolve
 * sozinho, sem passar por layout.
 */
export function CapabilitiesSection() {
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
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="capacidades" style={SECTION}>
      {/* Cabeçalho com o marcador da escala ancorado na mesma base do título */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "clamp(16px,3vw,60px)",
          marginBottom: "clamp(40px,6vh,76px)",
        }}
      >
        <Reveal variant="wipe">
          <h2
            style={{
              margin: 0,
              maxWidth: "20ch",
              fontFamily: PANCHANG,
              fontWeight: 700,
              fontSize: "clamp(30px,4vw,52px)",
              letterSpacing: "-0.012em",
              lineHeight: 1.04,
              color: "#F5F2ED",
              textWrap: "balance",
            }}
          >
            {SECTIONS.capacidades.heading}
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <span
            style={{
              display: "block",
              fontFamily: SATOSHI,
              fontWeight: 500,
              fontSize: 10,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#CFCBC5",
              whiteSpace: "nowrap",
            }}
          >
            {SECTIONS.capacidades.aside}
          </span>
        </Reveal>
      </div>

      <ul ref={ref} style={{ margin: 0, padding: 0, listStyle: "none" }}>
        {SKILLS.map((s, row) => (
          <li
            key={s.label}
            className="site-scale-row"
            style={{
              borderTop: "1px solid rgba(245,242,237,0.16)",
              borderBottom:
                row === SKILLS.length - 1
                  ? "1px solid rgba(245,242,237,0.16)"
                  : undefined,
              padding: "clamp(18px,2.4vh,26px) 0",
            }}
          >
            <span
              style={{
                fontFamily: PANCHANG,
                fontWeight: 600,
                fontSize: "clamp(15px,1.6vw,17px)",
                letterSpacing: "-0.004em",
                color: "#F5F2ED",
              }}
            >
              {s.label}
            </span>

            <div
              className="site-scale-marks"
              aria-hidden
              style={{ display: "flex", alignItems: "center", gap: "clamp(8px,1.2vw,14px)" }}
            >
              {Array.from({ length: SKILL_SCALE }, (_, i) => {
                const cheio = i < s.level;
                return (
                  <span
                    key={i}
                    style={{
                      display: "block",
                      boxSizing: "border-box",
                      width: 9,
                      height: 9,
                      flex: "none",
                      background: cheio ? "#FB3640" : "transparent",
                      border: cheio ? undefined : "1px solid rgba(245,242,237,0.3)",
                      transform: `rotate(45deg) scale(${!cheio || shown ? 1 : 0.35})`,
                      opacity: !cheio || shown ? 1 : 0,
                      transition: cheio
                        ? `transform 420ms cubic-bezier(0.22,1,0.36,1) ${row * 110 + i * 38}ms, opacity 300ms ease-out ${row * 110 + i * 38}ms`
                        : undefined,
                    }}
                  />
                );
              })}
            </div>

            {/* O número repete a escala em algarismo: quem não conta losango, lê. */}
            <span
              style={{
                textAlign: "right",
                fontFamily: PANCHANG,
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: "0.14em",
                color: "#F5F2ED",
                opacity: shown ? 1 : 0,
                transition: `opacity 500ms ease-out ${row * 110 + SKILL_SCALE * 38}ms`,
              }}
            >
              {String(s.level).padStart(2, "0")}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
