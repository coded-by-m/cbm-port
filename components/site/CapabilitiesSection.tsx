"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { SKILLS, SKILL_SCALE } from "@/data/about";
import { SECTIONS } from "@/data/home";
import { PANCHANG, SATOSHI, SECTION } from "./shared";
import { Reveal } from "@/components/ui/Reveal";

/** Intervalo entre uma linha e a seguinte. */
const ATRASO_LINHA = 110;
/** Intervalo entre um losango e o seguinte, dentro da linha. */
const ATRASO_LOSANGO = 38;
/** Sobra pro último losango terminar de crescer antes de assentar. */
const REPOUSO = 460;

const FIM =
  (SKILLS.length - 1) * ATRASO_LINHA + SKILL_SCALE * ATRASO_LOSANGO + REPOUSO;

type Fase = "parado" | "tocando" | "assentado";

/**
 * As capacidades do estúdio numa escala de losangos.
 *
 * Dez degraus em vez de uma barra de porcentagem: 87% sugere medição de algo,
 * e não há o que medir — são dez passos contáveis e uma opinião assumida.
 *
 * A entrada é uma sequência, não um efeito:
 *
 * 1. a régua de cada linha se desenha da esquerda, como as outras réguas do
 *    site;
 * 2. o rótulo entra atrás dela, no mesmo gesto lateral;
 * 3. os losangos cheios acendem um a um — os vazios já estão lá, porque é o
 *    contraste com eles que diz onde a linha parou;
 * 4. o número CONTA junto, subindo a cada losango que acende. Ele não é um
 *    rótulo do valor, é a contagem do que está aceso — por isso os dois
 *    andam no mesmo relógio em vez de aparecerem separados.
 *
 * Depois que tudo assenta, a fase vira `assentado` e os atrasos zeram: sem
 * isso o hover herdaria o atraso da entrada e a linha só responderia ao
 * cursor meio segundo depois.
 *
 * Só `transform` e `opacity` — as duas que o compositor resolve sozinho.
 */
export function CapabilitiesSection() {
  const ref = useRef<HTMLUListElement>(null);
  const [fase, setFase] = useState<Fase>("parado");
  const [contagem, setContagem] = useState<number[]>(() => SKILLS.map(() => 0));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setContagem(SKILLS.map((s) => s.level));
      setFase("assentado");
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setFase("tocando");
            obs.disconnect();
          }
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /**
   * O contador do número, no mesmo relógio da cascata dos losangos.
   *
   * Deriva a contagem do tempo em vez de guardar um timer por linha: um
   * relógio só, e qualquer quadro perdido se corrige no seguinte. Só escreve
   * no estado quando algum número muda de verdade — senão seriam ~150
   * renders pra 50 mudanças.
   */
  useEffect(() => {
    if (fase !== "tocando") return;
    const t0 = performance.now();
    let raf = 0;
    let anterior = SKILLS.map(() => 0);

    const passo = () => {
      const t = performance.now() - t0;
      const agora = SKILLS.map((s, linha) =>
        Math.max(
          0,
          Math.min(
            s.level,
            Math.floor((t - linha * ATRASO_LINHA) / ATRASO_LOSANGO) + 1,
          ),
        ),
      );
      if (agora.some((n, i) => n !== anterior[i])) {
        anterior = agora;
        setContagem(agora);
      }
      if (t < FIM) raf = requestAnimationFrame(passo);
      else setFase("assentado");
    };

    raf = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(raf);
  }, [fase]);

  const ultima = SKILLS.length - 1;

  return (
    <section id="capacidades" data-cm-section="capabilities" style={SECTION}>
      {/* Cabeçalho com o marcador da escala na mesma base do título */}
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

      <ul
        ref={ref}
        className={[
          "site-scale",
          fase !== "parado" && "is-shown",
          fase === "assentado" && "is-settled",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {SKILLS.map((s, linha) => (
          <li
            key={s.label}
            className="site-scale-row"
            style={{ "--row-d": `${linha * ATRASO_LINHA}ms` } as CSSProperties}
          >
            <span aria-hidden className="site-scale-rule" />
            {linha === ultima && (
              <span aria-hidden className="site-scale-rule site-scale-rule-end" />
            )}

            <span
              className="site-scale-label"
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

            <div className="site-scale-marks" aria-hidden>
              {Array.from({ length: SKILL_SCALE }, (_, i) => (
                <span
                  key={i}
                  className="site-scale-mark"
                  data-on={i < s.level}
                  style={
                    {
                      "--d": `${linha * ATRASO_LINHA + i * ATRASO_LOSANGO}ms`,
                      "--i": i,
                    } as CSSProperties
                  }
                >
                  {/* Camada de dentro só pro hover: a de fora já carrega o
                      giro e a escala da entrada, e as duas brigariam pelo
                      mesmo transform. */}
                  <span className="site-scale-mark-in" />
                </span>
              ))}
            </div>

            {/* O número repete a escala em algarismo: quem não conta losango,
                lê. Tabular pra ele não dançar enquanto sobe. */}
            <span
              className="site-scale-value"
              style={{
                fontFamily: PANCHANG,
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: "0.14em",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {String(contagem[linha] ?? 0).padStart(2, "0")}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
