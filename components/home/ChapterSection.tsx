"use client";

import { useEffect, useRef, useState } from "react";
import type { ChapterContent } from "@/lib/homeContent";

const SIGNAL = "#FB3640";

/**
 * Conteúdo HTML de um capítulo, sobreposto ao HomeCanvas. Entry-animado ao
 * entrar no viewport. `data-chapter-index` alimenta `useActiveChapter` (trilha
 * + cue). Cada seção é 100vh e fica em fluxo de scroll por cima do canvas fixo.
 */
export function ChapterSection({
  content,
  index,
}: {
  content: ChapterContent;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => setShown(e.isIntersecting),
      { threshold: 0.35 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const reveal = (delay: number) => ({
    opacity: shown ? 1 : 0,
    transform: shown ? "translateY(0)" : "translateY(14px)",
    transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
    transitionDelay: `${delay}ms`,
  });

  const centered = content.align !== "left";

  return (
    <section
      data-chapter-index={index}
      className="relative z-[1] flex h-screen w-full flex-col justify-center px-8 sm:px-16"
    >
      <div
        ref={ref}
        className={`flex w-full max-w-[1100px] flex-col gap-6 ${
          centered ? "mx-auto items-center text-center" : "items-start text-left"
        }`}
      >
        {/* Eyebrow */}
        <div className="flex items-center gap-4" style={reveal(0)}>
          <span className="h-px w-10" style={{ background: `${SIGNAL}b3` }} />
          <span
            className="text-[0.6rem] uppercase tracking-[0.4em] text-[#F5F2ED]/55"
            style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 500 }}
          >
            {content.eyebrow}
          </span>
        </div>

        {content.headline && (
          <h2
            className="max-w-4xl text-[clamp(2rem,5vw,4rem)] leading-[1.04] text-[#F5F2ED]"
            style={{
              fontFamily: '"Panchang", sans-serif',
              fontWeight: 700,
              letterSpacing: "-0.025em",
              ...reveal(120),
            }}
          >
            {content.headline}
          </h2>
        )}

        {content.body && (
          <p
            className="max-w-xl text-[clamp(1rem,1.4vw,1.2rem)] leading-relaxed text-[#F5F2ED]/65"
            style={{
              fontFamily: '"Satoshi", sans-serif',
              fontWeight: 300,
              ...reveal(220),
            }}
          >
            {content.body}
          </p>
        )}

        {content.items && content.items.length > 0 && (
          <div
            className={`mt-2 flex flex-wrap gap-x-6 gap-y-2 ${
              centered ? "justify-center" : ""
            }`}
            style={reveal(320)}
          >
            {content.items.map((item, i) => (
              <span
                key={item}
                className="flex items-center gap-2 text-[0.8rem] uppercase tracking-[0.2em] text-[#F5F2ED]/80"
                style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 500 }}
              >
                <span
                  className="inline-block h-1.5 w-1.5 rotate-45"
                  style={{ background: SIGNAL }}
                  aria-hidden
                />
                {item}
              </span>
            ))}
          </div>
        )}

        {content.cta && (
          <a
            href={content.cta.href}
            {...(content.cta.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            data-cursor="triangle"
            className="mt-4 inline-flex w-fit items-center gap-3 border border-[#F5F2ED]/40 px-6 py-3 text-[0.65rem] uppercase tracking-[0.3em] text-[#F5F2ED]/95 transition-colors hover:border-[#F5F2ED] hover:bg-[#F5F2ED]/5"
            style={{ fontFamily: '"Satoshi", sans-serif', fontWeight: 500, ...reveal(420) }}
          >
            {content.cta.label}
            <span aria-hidden style={{ color: SIGNAL }}>
              →
            </span>
          </a>
        )}
      </div>
    </section>
  );
}
