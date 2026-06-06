"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { CaseProject } from "@/types/case";
import { ProjectFacts } from "@/components/case/ProjectFacts";
import { BrowserFrame } from "@/components/case/BrowserFrame";
import { LiveScreenshot } from "@/components/case/LiveScreenshot";
import { LogoMark } from "@/components/ui/LogoMark";

// Mesh triangulado sutil atrás do hero (toque 3D, coesão com a Home).
const TerrainBackground = dynamic(
  () =>
    import("@/components/zones/ServicesSection/TerrainBackground").then(
      (m) => m.default,
    ),
  { ssr: false },
);

export function CaseHero({ project }: { project: CaseProject }) {
  // Cascata de entrada no load.
  const [entered, setEntered] = useState(false);
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const r =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (r) {
      setReduce(true);
      setEntered(true);
      return;
    }
    const t = setTimeout(() => setEntered(true), 80);
    return () => clearTimeout(t);
  }, []);

  const step = (i: number) =>
    reduce
      ? {}
      : {
          opacity: entered ? 1 : 0,
          transform: entered ? "translateY(0)" : "translateY(14px)",
          transition: `opacity 0.7s ease-out ${i * 90}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 90}ms`,
        };

  return (
    <section
      className="relative flex flex-col lg:grid lg:min-h-screen"
      style={{
        gridTemplateColumns: "1fr 1.1fr",
        background: "#000F08",
        borderBottom: "1px solid rgba(245,242,237,0.06)",
      }}
    >
      {/* Mesh triangulado sutil de fundo */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.12]">
        <TerrainBackground />
      </div>

      {/* Text side */}
      <div
        className="relative z-10 flex flex-col justify-between px-6 py-12 sm:px-12 sm:py-16 xl:px-16 xl:py-20"
        style={{ borderRight: "1px solid rgba(245,242,237,0.06)" }}
      >
        <div>
          <div className="mb-6 flex items-center gap-3" style={step(0)}>
            <span
              className="block h-px w-5 flex-shrink-0"
              style={{ background: "rgba(251,54,64,0.4)" }}
            />
            <p className="font-display text-[9px] font-semibold uppercase tracking-[0.4em] text-cbm-red/75">
              {project.eyebrow}
            </p>
          </div>

          <h1
            className="font-display font-black uppercase text-cbm-white"
            style={{
              fontSize: "clamp(32px,4.5vw,60px)",
              letterSpacing: "-0.03em",
              lineHeight: 0.95,
              ...step(1),
            }}
          >
            {project.title}
          </h1>

          <p
            className="mt-6 max-w-[360px] font-body text-[14px] font-light leading-[1.78] text-cbm-gray-400"
            style={step(2)}
          >
            {project.description}
          </p>

          <div style={step(3)}>
            <ProjectFacts meta={project.meta} />
          </div>
        </div>

        <div className="mt-10" style={step(4)}>
          <Link
            href="#overview"
            className="group inline-flex cursor-pointer flex-col items-start gap-[3px]"
          >
            <span className="inline-flex items-center gap-[6px] font-display text-[11px] font-semibold uppercase tracking-[0.15em] text-cbm-white/90 transition-colors duration-200 group-hover:text-cbm-white">
              Ver o Case
              <span
                className="text-[10px] leading-none opacity-75 transition-[opacity,transform] duration-200 group-hover:translate-x-[2px] group-hover:opacity-100"
                aria-hidden="true"
              >
                ↓
              </span>
            </span>
            <span className="block h-px w-full origin-left scale-x-0 bg-cbm-red transition-transform duration-[350ms] ease-out group-hover:scale-x-100" />
          </Link>
        </div>
      </div>

      {/* Visual side — browser frame com o desktop rolando */}
      <div className="relative z-10 flex min-h-[320px] items-center justify-center p-6 sm:p-10 lg:min-h-0">
        <div
          className="w-full max-w-[640px]"
          style={reduce ? {} : {
            opacity: entered ? 1 : 0,
            transform: entered ? "scale(1)" : "scale(0.97)",
            transition:
              "opacity 0.8s ease-out 0.25s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.25s",
          }}
        >
          <BrowserFrame url={project.siteUrl}>
            <div className="aspect-[16/10] w-full">
              <LiveScreenshot
                src={project.preview?.desktop}
                alt={`${project.title} — site desktop`}
                fallback={
                  <div className="flex h-full w-full items-center justify-center bg-[#070B08] opacity-20">
                    <LogoMark size={40} />
                  </div>
                }
              />
            </div>
          </BrowserFrame>
        </div>
      </div>
    </section>
  );
}
