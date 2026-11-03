"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { SKILLS } from "@/data/about";
import { SECTIONS } from "@/data/home";
import { PANCHANG, SATOSHI, SECTION } from "./shared";
import { Reveal } from "@/components/ui/Reveal";
import { cbm } from "@/lib/palette";

/** Intervalo entre uma linha e a seguinte. */
const ATRASO_LINHA = 110;

/**
 * O que entra em cada projeto: um fato por linha.
 *
 * Antes era uma escala de losangos de 1 a 10 — autoavaliação, que não diz
 * nada a quem contrata ("9 em quê, comparado com quem?"). Agora cada linha
 * diz o que é entregue.
 *
 * A entrada continua uma sequência: a régua de cada linha se desenha da
 * esquerda, e rótulo e descrição entram atrás dela. Só `transform` e
 * `opacity`.
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
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const ultima = SKILLS.length - 1;

  return (
    <section id="capacidades" data-cm-section="capabilities" style={SECTION}>
      <Reveal variant="wipe">
        <h2
          style={{
            margin: "0 0 clamp(40px,6vh,76px)",
            maxWidth: "20ch",
            fontFamily: PANCHANG,
            fontWeight: 700,
            fontSize: "clamp(30px,4vw,52px)",
            letterSpacing: "-0.012em",
            lineHeight: 1.04,
            color: cbm("white"),
            textWrap: "balance",
          }}
        >
          {SECTIONS.capacidades.heading}
        </h2>
      </Reveal>

      <ul ref={ref} className={["site-scale", shown && "is-shown"].filter(Boolean).join(" ")}>
        {SKILLS.map((s, linha) => (
          <li
            key={s.label}
            className="site-scale-row"
            style={{ "--row-d": `${linha * ATRASO_LINHA}ms` } as CSSProperties}
          >
            <span aria-hidden className="site-scale-rule" />
            {linha === ultima && <span aria-hidden className="site-scale-rule site-scale-rule-end" />}

            <span
              className="site-scale-label"
              style={{
                fontFamily: PANCHANG,
                fontWeight: 600,
                fontSize: "clamp(15px,1.6vw,17px)",
                letterSpacing: "-0.004em",
                color: cbm("white"),
              }}
            >
              {s.label}
            </span>
            <span
              className="site-scale-desc"
              style={{
                maxWidth: "58ch",
                fontFamily: SATOSHI,
                fontWeight: 400,
                fontSize: 15,
                lineHeight: 1.6,
                color: cbm("gray-200"),
              }}
            >
              {s.desc}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
