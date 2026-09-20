"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { gsap } from "gsap";
import { ASCENT, STROKE_LINE_HEIGHT } from "./strokeMetrics";

/**
 * Palavra que se desenha: o contorno de cada letra entra traço a traço e, na
 * sequência, a cor inunda por dentro.
 *
 * Adaptado do StrokeText do React Bits. O que mudou em relação ao original, e
 * por quê:
 *
 * 1. Uma `<text>` só, no lugar de duas sobrepostas. O original pinta o
 *    contorno numa e o preenchimento noutra, então cada letra entra DUAS vezes
 *    no DOM — num `<h1>` o texto extraído vira "CodedCoded". Aqui o
 *    preenchimento é um gradiente de parada dura usado como tinta, e a
 *    varredura acontece movendo as paradas. Mesmo efeito, metade dos nós, e o
 *    texto aparece uma vez só.
 * 2. Métrica vertical fixa (`ASCENT`/`DESCENT`) no lugar da altura medida.
 *    O original tira o viewBox inteiro do bbox, então "Coded" (sem descida) e
 *    "by M" (com o rabo do y) ganham caixas de alturas diferentes —
 *    empilhadas, as duas linhas sairiam em corpos diferentes. Com a caixa
 *    presa ao em, as duas compartilham a mesma escala.
 * 3. Largura em `em` derivada da razão medida, em vez de `width: 100%`.
 *    O bloco passa a ter a largura do desenho e ancora à esquerda, como
 *    qualquer texto — `100%` centralizaria a linha curta na coluna.
 * 4. `IntersectionObserver` no lugar do ScrollTrigger. O plugin só existe nas
 *    rotas da experiência; a home não paga por ele pra saber que um elemento
 *    entrou na tela.
 * 5. `delay` e `replayOnHover`, que o original não tem: o primeiro encadeia as
 *    linhas, o segundo devolve o gesto quando o cursor passa.
 * 6. Fica invisível até medir, e só mede quando a fonte pedida responde. Medir
 *    antes daria a métrica da fonte de sistema; a correção depois mudaria a
 *    caixa, reconstruiria a linha do tempo e o desenho rodaria DUAS vezes.
 *    Com a mesma intenção, `playedRef` garante um gesto por montagem: uma
 *    remedida tardia leva ao estado final, não a uma repetição.
 * 7. `fadeStrokeOut`, pra o contorno sumir quando a cor fecha a palavra — o
 *    vermelho é a passagem, não uma moldura permanente.
 */

export type StrokeTextTrigger = "mount" | "hover" | "scroll" | "loop";
export type StrokeTextFill = "fade" | "wipe" | "none";

export type StrokeTextProps = {
  text: string;
  /** Cor do contorno que desenha. */
  strokeColor?: string;
  /** Cor que inunda a letra depois do contorno. */
  fillColor?: string;
  strokeWidth?: number;
  /** Segundos que cada contorno leva pra se desenhar. */
  drawDuration?: number;
  /** Espera entre o fim do contorno e o começo do preenchimento. */
  fillDelay?: number;
  /** Atraso do bloco inteiro — é com ele que se encadeiam duas linhas. */
  delay?: number;
  /** Intervalo entre uma letra e a seguinte. */
  stagger?: number;
  ease?: string;
  trigger?: StrokeTextTrigger;
  fillMode?: StrokeTextFill;
  /** Redesenha quando o cursor entra. Ignorado em `trigger="hover"`, que já
   *  nasce assim. */
  replayOnHover?: boolean;
  /** Apaga o contorno depois que a cor termina de entrar, deixando a letra
   *  limpa. Só vale com preenchimento: sem ele, apagar o traço apagaria a
   *  palavra inteira. */
  fadeStrokeOut?: boolean;
  fontFamily?: string;
  /** Corpo em unidades do SVG. Não é o tamanho na tela: quem manda nisso é o
   *  `font-size` herdado, porque a caixa é medida em `em`. */
  fontSize?: number;
  fontWeight?: number | string;
  letterSpacing?: number;
  reverse?: boolean;
  className?: string;
  style?: CSSProperties;
};

export function StrokeText({
  text,
  strokeColor = "#FB3640",
  fillColor = "#F5F2ED",
  strokeWidth = 1.6,
  drawDuration = 1.1,
  fillDelay = 0.12,
  delay = 0,
  stagger = 0.055,
  ease = "power2.out",
  trigger = "mount",
  fillMode = "wipe",
  replayOnHover = false,
  fadeStrokeOut = false,
  fontFamily,
  fontSize = 128,
  fontWeight = 800,
  letterSpacing = 0,
  reverse = false,
  className = "",
  style = {},
}: StrokeTextProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  /** As duas paradas do gradiente: juntas, formam a borda da varredura. */
  const stopsRef = useRef<[SVGStopElement | null, SVGStopElement | null]>([null, null]);
  /** O desenho é de uma vez só. Se a caixa for remedida depois (fonte que
   *  chega tarde, reflow), o elemento vai pro estado final em vez de repetir
   *  o gesto. */
  const playedRef = useRef(false);

  /** Só a horizontal é medida; a vertical é a métrica fixa do módulo. */
  const [box, setBox] = useState<{ x: number; width: number } | null>(null);

  const rawId = useId();
  const gradientId = `stroke-fill-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const characters = useMemo(() => Array.from(String(text ?? "")), [text]);

  /** Tracejado maior que qualquer contorno de letra, pra o dash cobrir o
   *  glifo inteiro antes de recuar. */
  const dash = Math.max(fontSize * 7, 200);

  const height = STROKE_LINE_HEIGHT * fontSize;
  const useWipe = fillMode === "wipe";

  const fontCss: CSSProperties = useMemo(
    () => ({
      fontFamily,
      fontSize: `${fontSize}px`,
      fontWeight,
      letterSpacing: `${letterSpacing}px`,
    }),
    [fontFamily, fontSize, fontWeight, letterSpacing],
  );

  useLayoutEffect(() => {
    let cancelled = false;

    const measure = () => {
      const node = textRef.current;
      if (cancelled || !node) return;
      let bbox: DOMRect | undefined;
      try {
        bbox = node.getBBox();
      } catch {
        return;
      }
      if (!bbox?.width) return;

      /* Folga lateral pra metade do traço, que pinta pra fora do glifo. */
      const pad = Math.max(strokeWidth, fontSize * 0.02);
      const next = { x: bbox.x - pad, width: bbox.width + pad * 2 };
      setBox((prev) =>
        prev &&
        Math.abs(prev.x - next.x) < 0.5 &&
        Math.abs(prev.width - next.width) < 0.5
          ? prev
          : next,
      );
    };

    /* Medir antes da fonte chegar dá a métrica da fonte de sistema, e a
       correção depois mudaria a caixa — o que reconstrói a linha do tempo e
       roda o desenho uma segunda vez. Então só mede quando a fonte pedida já
       responde; `check` cobre o caso do cache, em que medir na hora é certo. */
    const family = (fontFamily ?? "sans-serif")
      .split(",")[0]
      .trim()
      .replace(/^["']|["']$/g, "");
    const spec = `${fontWeight} ${fontSize}px "${family}"`;

    if (!document.fonts || document.fonts.check(spec)) {
      measure();
    } else {
      document.fonts
        .load(spec)
        .then(measure)
        .catch(() => {
          document.fonts.ready.then(measure).catch(() => {});
        });
    }

    return () => {
      cancelled = true;
    };
  }, [characters, fontFamily, fontSize, fontWeight, letterSpacing, strokeWidth]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !box) return;

    const chars = Array.from(root.querySelectorAll("[data-stroke-char]"));
    if (!chars.length) return;

    const [stopA, stopB] = stopsRef.current;
    const fillEnabled = fillMode !== "none";
    const fillDuration = Math.max(0.4, drawDuration * 0.5);
    const staggerConfig = reverse
      ? ({ each: stagger, from: "end" } as const)
      : stagger;

    /** Posição da borda da varredura, de 0 (nada preenchido) a 1 (tudo). */
    const sweep = { p: 0 };
    const applySweep = () => {
      /* As paradas andam juntas, com uma fresta entre elas: parada dura o
         bastante pra ler como uma borda, macia o bastante pra não serrilhar. */
      stopA?.setAttribute("offset", String(Math.min(1, Math.max(0, sweep.p))));
      stopB?.setAttribute("offset", String(Math.min(1, Math.max(0, sweep.p + 0.03))));
    };

    const targets: object[] = [...chars, sweep];

    /* O traço só some quando há cor pra ficar no lugar dele. */
    const fadesStroke = fadeStrokeOut && fillEnabled;

    const setStart = () => {
      gsap.killTweensOf(targets);
      gsap.set(chars, {
        strokeDasharray: dash,
        strokeDashoffset: dash,
        strokeOpacity: 1,
      });
      if (useWipe) {
        sweep.p = 0;
        applySweep();
      } else {
        gsap.set(chars, { fillOpacity: 0 });
      }
    };

    const setEnd = () => {
      gsap.killTweensOf(targets);
      gsap.set(chars, {
        strokeDasharray: dash,
        strokeDashoffset: 0,
        strokeOpacity: fadesStroke ? 0 : 1,
      });
      if (useWipe) {
        sweep.p = fillEnabled ? 1 : 0;
        applySweep();
      } else {
        gsap.set(chars, { fillOpacity: fillEnabled ? 1 : 0 });
      }
    };

    /* Quem pediu menos movimento recebe o estado final, não a animação. */
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setEnd();
      return () => gsap.killTweensOf(targets);
    }

    const build = () => {
      setStart();
      const tl = gsap.timeline({
        paused: true,
        repeat: trigger === "loop" ? -1 : 0,
        repeatDelay: trigger === "loop" ? 0.9 : 0,
        defaults: { overwrite: "auto" },
      });

      tl.to(
        chars,
        { strokeDashoffset: 0, duration: drawDuration, ease, stagger: staggerConfig },
        0,
      );

      if (fillEnabled && useWipe) {
        tl.to(
          sweep,
          {
            p: 1,
            duration: fillDuration,
            ease: "power2.inOut",
            onUpdate: applySweep,
          },
          drawDuration + fillDelay,
        );
      } else if (fillEnabled) {
        tl.to(
          chars,
          {
            fillOpacity: 1,
            duration: fillDuration,
            ease: "power2.out",
            stagger: staggerConfig,
          },
          drawDuration + fillDelay,
        );
      }

      if (fadesStroke) {
        /* Só depois que a cor fechou a última letra: apagar o contorno antes
           disso deixaria o pedaço ainda não preenchido invisível. */
        tl.to(
          chars,
          { strokeOpacity: 0, duration: 0.45, ease: "power1.out" },
          drawDuration + fillDelay + fillDuration,
        );
      }

      return tl;
    };

    let timeline: gsap.core.Timeline | null = null;
    let observer: IntersectionObserver | null = null;
    let removeHover: (() => void) | null = null;

    const replay = () => {
      timeline?.kill();
      timeline = build();
      timeline.play(0);
    };

    if (trigger === "hover") {
      setEnd();
      root.addEventListener("pointerenter", replay);
      removeHover = () => root.removeEventListener("pointerenter", replay);
    } else if (playedRef.current && trigger !== "loop") {
      /* Já desenhou nesta montagem: o que trouxe o efeito de volta foi uma
         remedida, não um pedido de repetir. */
      setEnd();
    } else {
      timeline = build();
      playedRef.current = true;

      if (trigger === "scroll") {
        observer = new IntersectionObserver(
          (entries) => {
            for (const e of entries) {
              if (e.isIntersecting) {
                timeline?.play(0);
                observer?.disconnect();
              }
            }
          },
          { threshold: 0.2 },
        );
        observer.observe(root);
      } else {
        timeline.delay(delay).play(0);
      }

      if (replayOnHover) {
        root.addEventListener("pointerenter", replay);
        removeHover = () => root.removeEventListener("pointerenter", replay);
      }
    }

    return () => {
      removeHover?.();
      observer?.disconnect();
      timeline?.kill();
      gsap.killTweensOf(targets);
    };
  }, [
    box,
    dash,
    delay,
    drawDuration,
    ease,
    fadeStrokeOut,
    fillDelay,
    fillMode,
    replayOnHover,
    reverse,
    stagger,
    trigger,
    useWipe,
  ]);

  const viewBox = box
    ? `${box.x} ${-ASCENT * fontSize} ${box.width} ${height}`
    : `0 ${-ASCENT * fontSize} ${fontSize * 4} ${height}`;

  /* Largura em `em` do corpo herdado: o bloco ocupa exatamente o desenho. */
  const ratio = box ? box.width / height : 4;

  const paint =
    fillMode === "none" ? "none" : useWipe ? `url(#${gradientId})` : fillColor;

  return (
    <span
      ref={rootRef}
      className={`stroke-text ${className}`.trim()}
      style={{
        ...style,
        /* Escondido até a medida, que depende da fonte ter carregado. */
        visibility: box ? "visible" : "hidden",
      }}
    >
      <svg
        className="stroke-text__svg"
        viewBox={viewBox}
        preserveAspectRatio="xMinYMid meet"
        style={{
          width: `${(ratio * STROKE_LINE_HEIGHT).toFixed(4)}em`,
          height: `${STROKE_LINE_HEIGHT}em`,
        }}
        role="img"
        aria-label={String(text ?? "")}
      >
        {useWipe && box && (
          <defs>
            {/* A tinta do preenchimento. Mover as paradas varre a cor da
                esquerda pra direita sem precisar de uma segunda camada. */}
            <linearGradient
              id={gradientId}
              gradientUnits="userSpaceOnUse"
              x1={box.x}
              y1={0}
              x2={box.x + box.width}
              y2={0}
            >
              <stop
                ref={(el) => {
                  stopsRef.current[0] = el;
                }}
                offset="0"
                stopColor={fillColor}
              />
              <stop
                ref={(el) => {
                  stopsRef.current[1] = el;
                }}
                offset="0"
                stopColor={fillColor}
                stopOpacity="0"
              />
            </linearGradient>
          </defs>
        )}

        {/* `paint-order: stroke` põe o preenchimento por cima do traço, então
            no fim sobra só a metade externa do contorno — um fio, não uma
            moldura. */}
        <text
          ref={textRef}
          x="0"
          y="0"
          fill={paint}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
          paintOrder="stroke"
          style={fontCss}
        >
          {characters.map((char, index) => (
            <tspan data-stroke-char key={index}>
              {char}
            </tspan>
          ))}
        </text>
      </svg>
    </span>
  );
}
