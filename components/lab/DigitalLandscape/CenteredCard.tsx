"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { ProjectCard } from "@/components/lab/HtmlOverlay/config";

export default function CenteredCard({
  activeIndex,
  cards,
}: {
  activeIndex: number;
  cards: ProjectCard[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevIndex = useRef(-1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (prevIndex.current === -1) {
      gsap.fromTo(el, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
    } else {
      gsap.timeline()
        .to(el, { opacity: 0, y: -15, duration: 0.2, ease: "power2.in" })
        .set(el, { y: 15 })
        .to(el, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" });
    }
    prevIndex.current = activeIndex;
  }, [activeIndex]);

  const card = cards[activeIndex];
  if (!card) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
      <div
        ref={containerRef}
        className="pointer-events-auto translate-y-[10vh]"
        style={{ opacity: 0 }}
      >
        <article
          className="border border-white/10 bg-[#0a0a0a]/95 rounded-md border-l-2 border-l-white/30 shadow-[0_2px_12px_rgba(0,0,0,0.28)] w-60 p-4"
        >
          <p className="text-[0.55rem] uppercase tracking-[0.32em] text-neutral-500">
            {card.type}
          </p>
          <h3 className="mt-1.5 text-sm font-light tracking-wide text-neutral-100">
            {card.title}
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-neutral-400">
            {card.description}
          </p>
          <a
            href={card.href}
            className="group mt-3 inline-flex items-center gap-1.5 text-[0.7rem] uppercase tracking-[0.2em] text-neutral-300 transition-colors hover:text-neutral-50"
          >
            Ver estudo de caso
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">
              →
            </span>
          </a>
        </article>
      </div>
    </div>
  );
}
