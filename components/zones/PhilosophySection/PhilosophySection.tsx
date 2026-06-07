"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { MeshButton } from "@/components/ui/MeshButton";

const TerrainBackground = dynamic(
  () => import("./TerrainBackground"),
  { ssr: false },
);

type Statement = {
  number: string;
  /** Frases multi-linha — cada item vira um bloco. Vazio se isCta. */
  lines?: string[];
  /** Apenas pra CTA. */
  text?: string;
  isCta?: boolean;
};

const STATEMENTS: Statement[] = [
  {
    number: "01",
    lines: ["Cada pixel", "é uma decisão."],
  },
  {
    number: "02",
    lines: ["Design e código.", "Mesmo autor."],
  },
  {
    number: "03",
    lines: ["A primeira impressão", "não se repete."],
  },
  {
    number: "04",
    text: "Explorar",
    isCta: true,
  },
];

const DWELL = 8;
const TRANSITION = 0.7;
/** Cooldown entre advances por scroll — força um beat em cada frase (anti-skip). */
const SCROLL_COOLDOWN = 1300;
/** Delta total que o usuário precisa acumular pra avançar (filtra micro-scrolls
    e flings — avanço deliberado, uma frase por gesto). */
const SCROLL_THRESHOLD = 150;
const CLICK_COOLDOWN = 600;

type PhilosophySectionProps = {
  onComplete?: () => void;
  /** Chamado quando o usuário rola pra cima já na 1ª frase (voltar pro Logo). */
  onBack?: () => void;
  /** Capítulo ativo (na tela). Dispara a entrada da 1ª frase sincronizada. */
  live?: boolean;
};

export default function PhilosophySection({
  onComplete,
  onBack,
  live,
}: PhilosophySectionProps) {
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;
  const [active, setActive] = useState(-1);
  const activeRef = useRef(-1);
  const statementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const lineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollCooldown = useRef(false);
  const transitioning = useRef(false);
  // Tween da barra de progresso QUE TAMBÉM dispara o auto-avanço (onComplete).
  // Unificado pra poder pausar no hover (pausa a barra E o avanço juntos).
  const autoTweenRef = useRef<gsap.core.Tween | null>(null);
  const hoveringRef = useRef(false);

  const goTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, STATEMENTS.length - 1));
    if (clamped === activeRef.current) return;

    statementsRef.current.forEach((el) => {
      if (el) gsap.killTweensOf(el.querySelectorAll(".word, .ghost-number"));
      if (el) gsap.killTweensOf(el);
    });
    if (lineRef.current) gsap.killTweensOf(lineRef.current);

    transitioning.current = true;

    const currentEl = activeRef.current >= 0 ? statementsRef.current[activeRef.current] : null;
    const nextEl = statementsRef.current[clamped];

    // Esconde os outros statements imediatamente.
    statementsRef.current.forEach((el, i) => {
      if (!el || i === activeRef.current || i === clamped) return;
      gsap.set(el, { opacity: 0 });
    });

    const tl = gsap.timeline({
      onComplete: () => {
        transitioning.current = false;
      },
    });

    // Saída: fade suave do statement atual inteiro.
    if (currentEl) {
      tl.to(currentEl, {
        opacity: 0,
        duration: 0.6,
        ease: "power2.inOut",
      });
    }

    // Entrada: ghost number cresce e desfoca; palavras entram em stagger
    // (blur → nítido), com um respiro depois da frase anterior sair.
    if (nextEl) {
      const ghost = nextEl.querySelector(".ghost-number");
      const words = nextEl.querySelectorAll(".word");

      gsap.set(nextEl, { opacity: 1 });
      if (ghost) {
        gsap.set(ghost, { opacity: 0, scale: 0.92, filter: "blur(14px)" });
      }
      gsap.set(words, { opacity: 0, y: 24, filter: "blur(8px)" });

      if (ghost) {
        tl.to(
          ghost,
          {
            opacity: 0.06,
            scale: 1,
            filter: "blur(0px)",
            duration: 1.5,
            ease: "power3.out",
          },
          currentEl ? "-=0.1" : 0,
        );
      }

      tl.to(
        words,
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.1,
          stagger: 0.1,
          ease: "power3.out",
        },
        "<+=0.3",
      );
    }

    // Barra contínua: cresce em direção ao fim do segmento atual ao longo
    // do DWELL. Se o usuário avança antes, tweenkill + retoma da posição atual.
    if (lineRef.current) {
      const isLast = clamped >= STATEMENTS.length - 1;
      const targetPct = isLast ? 100 : ((clamped + 1) / STATEMENTS.length) * 100;
      autoTweenRef.current = gsap.to(lineRef.current, {
        width: `${targetPct}%`,
        duration: isLast ? 0.7 : DWELL,
        ease: isLast ? "power2.out" : "none",
        onComplete: () => {
          // Auto-avanço quando a barra completa (a última frase não avança).
          if (!isLast) goTo(clamped + 1);
        },
      });
      // Se o usuário já está com o mouse sobre a seção, nasce pausado.
      if (hoveringRef.current && !isLast) autoTweenRef.current.pause();
    }

    activeRef.current = clamped;
    setActive(clamped);
  }, []);

  const next = useCallback(() => {
    setActive((prev) => {
      const n = prev < STATEMENTS.length - 1 ? prev + 1 : prev;
      goTo(n);
      return n;
    });
  }, [goTo]);

  const prev = useCallback(() => {
    setActive((prev) => {
      const n = prev > 0 ? prev - 1 : 0;
      goTo(n);
      return n;
    });
  }, [goTo]);

  // Inicialização: todos os containers + ghosts começam invisíveis.
  // useLayoutEffect (não useEffect) — roda antes do primeiro paint, evitando
  // que o usuário veja qualquer fragmento no estado default por um frame.
  useLayoutEffect(() => {
    statementsRef.current.forEach((el) => {
      if (!el) return;
      gsap.set(el, { opacity: 0 });
      const innerWords = el.querySelectorAll(".word");
      const innerGhost = el.querySelector(".ghost-number");
      if (innerWords.length) {
        gsap.set(innerWords, { opacity: 0, y: 24, filter: "blur(8px)" });
      }
      if (innerGhost) {
        gsap.set(innerGhost, { opacity: 0, scale: 0.92, filter: "blur(14px)" });
      }
    });
  }, []);

  // Entrada sincronizada: começa a 1ª frase quando a seção fica ativa (logo
  // após o wipe revelar), não num timer fixo de mount. O auto-avanço seguinte
  // é dirigido pelo tween da barra de progresso (ver goTo → onComplete).
  useEffect(() => {
    if (!live) return;
    const t = setTimeout(() => goTo(0), 450);
    return () => clearTimeout(t);
  }, [live, goTo]);

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        if (activeRef.current <= 0) onBackRef.current?.();
        else prev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // Scroll/wheel para avançar — acumula delta antes de disparar, evitando
  // que micro-scrolls (trackpad) ou rajadas de wheel pulem várias frases.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let accum = 0;
    let resetTimer: ReturnType<typeof setTimeout> | null = null;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (scrollCooldown.current || transitioning.current) return;

      // Reset do acúmulo se o usuário parou de scrollar por um momento.
      if (resetTimer) clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        accum = 0;
      }, 250);

      accum += e.deltaY;

      if (Math.abs(accum) < SCROLL_THRESHOLD) return;

      const direction = accum > 0 ? 1 : -1;
      accum = 0;

      scrollCooldown.current = true;
      setTimeout(() => {
        scrollCooldown.current = false;
      }, SCROLL_COOLDOWN);

      if (direction > 0) {
        if (activeRef.current >= STATEMENTS.length - 1) {
          onCompleteRef.current?.();
        } else {
          next();
        }
      } else if (activeRef.current <= 0) {
        onBackRef.current?.(); // já na 1ª frase → volta pro Logo
      } else {
        prev();
      }
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", onWheel);
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, [next, prev]);

  // Click anywhere (exceto botões — dots e CTA têm seus próprios handlers)
  // avança a frase. Cooldown menor que o do scroll porque clique é intencional.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const clickCooldown = { current: false };

    const onPointerDown = (e: PointerEvent) => {
      const targetEl = e.target as HTMLElement | null;
      if (targetEl?.closest("button")) return;
      if (clickCooldown.current || transitioning.current) return;

      clickCooldown.current = true;
      setTimeout(() => {
        clickCooldown.current = false;
      }, CLICK_COOLDOWN);

      if (activeRef.current >= STATEMENTS.length - 1) {
        onCompleteRef.current?.();
      } else {
        next();
      }
    };

    container.addEventListener("pointerdown", onPointerDown);
    return () => container.removeEventListener("pointerdown", onPointerDown);
  }, [next]);

  return (
    <div
      ref={containerRef}
      data-cursor="triangle"
      className="relative h-full w-full overflow-clip"
      onMouseEnter={() => {
        hoveringRef.current = true;
        autoTweenRef.current?.pause(); // pausa leitura no hover
      }}
      onMouseLeave={() => {
        hoveringRef.current = false;
        autoTweenRef.current?.resume();
      }}
    >
      {/* Background: Terrain with camera adjusted to fill the viewport */}
      <div className="absolute inset-0 opacity-[0.75]">
        <TerrainBackground active={live} />
      </div>

      {/* Vignette overlay for depth */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, #000F08 90%)",
        }}
      />

      {/* Statements */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center">
        <div className="relative h-48 w-full max-w-3xl px-8">
          {STATEMENTS.map((stmt, i) => (
            <div
              key={stmt.number}
              ref={(el) => {
                statementsRef.current[i] = el;
              }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
            >
              {/* Ghost number — atrás da frase, marca editorial.
                  Opacity inicial via useEffect/GSAP (não inline) pra evitar
                  conflito com GSAP em re-renders. */}
              <span
                className="ghost-number pointer-events-none absolute left-1/2 top-1/2 select-none"
                style={{
                  fontFamily: '"Satoshi", sans-serif',
                  fontWeight: 300,
                  fontSize: "13rem",
                  lineHeight: 1,
                  color: "rgba(245, 242, 237, 0.06)",
                  letterSpacing: "-0.05em",
                  transform: "translate(-50%, -50%)",
                }}
              >
                {stmt.number}
              </span>

              {/* Conteúdo da frase. */}
              <p
                className="relative z-10 text-3xl leading-tight tracking-tight text-[#F5F2ED]/90 sm:text-4xl md:text-5xl"
                style={{
                  fontFamily: '"Satoshi", sans-serif',
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                }}
              >
                {stmt.isCta && stmt.text ? (
                  <span
                    className="inline-block"
                    style={{
                      opacity: active === i ? 1 : 0,
                      transform:
                        active === i
                          ? "translateY(0) scale(1)"
                          : "translateY(12px) scale(0.94)",
                      transition:
                        "opacity 0.6s ease-out 0.2s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s",
                    }}
                  >
                    <MeshButton
                      label={stmt.text}
                      onClick={() => onCompleteRef.current?.()}
                    />
                  </span>
                ) : stmt.lines ? (
                  stmt.lines.map((line, lineIdx) => {
                    const words = line.split(" ");
                    return (
                      <span
                        key={lineIdx}
                        className="block leading-tight"
                        style={{ whiteSpace: "pre-wrap" }}
                      >
                        {words.map((word, j) => (
                          <Fragment key={j}>
                            <span className="word inline-block">{word}</span>
                            {j < words.length - 1 ? " " : ""}
                          </Fragment>
                        ))}
                      </span>
                    );
                  })
                ) : null}
              </p>
            </div>
          ))}
        </div>

        {/* Progress line + dots */}
        <div className="absolute bottom-12 flex flex-col items-center gap-4">
          {/* Barra cresce continuamente ao longo do DWELL. */}
          <div className="h-px w-32 overflow-hidden bg-[#F5F2ED]/12">
            <div
              ref={lineRef}
              className="h-full bg-[#F5F2ED]/55"
              style={{ width: "0%" }}
            />
          </div>

          {/* Dots — ativo/passados em signal-red (mesma linguagem da trilha),
              futuros em cinza discreto. */}
          <div className="flex gap-3">
            {STATEMENTS.map((stmt, i) => {
              const isActive = active === i;
              const isPast = i < active;
              return (
                <button
                  key={stmt.number}
                  type="button"
                  aria-label={`Statement ${stmt.number}`}
                  onClick={() => goTo(i)}
                  data-cursor="triangle"
                  className="h-1.5 w-1.5 rounded-full transition-all duration-300 ease-out"
                  style={{
                    backgroundColor: isActive || isPast ? "#FB3640" : "#97938b",
                    opacity: isActive ? 1 : isPast ? 0.5 : 0.25,
                    transform: isActive ? "scale(1.5)" : "scale(1)",
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
