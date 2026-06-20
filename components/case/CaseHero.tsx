"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { CaseProject } from "@/types/case";
import { ProjectFacts } from "@/components/case/ProjectFacts";
import { BrowserFrame } from "@/components/case/BrowserFrame";
import { CaseFrameMedia } from "@/components/case/CaseFrameMedia";
import { LogoMark } from "@/components/ui/LogoMark";
import { CaseLiveButton } from "@/components/case/CaseLiveButton";

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

      {/* Text side. `pt-20` no mobile dá folga pro CaseBackButton fixo
          (top-5, ~54px de altura) não sobrepor o eyebrow. */}
      <div className="relative z-10 flex flex-col justify-between px-6 pb-12 pt-20 sm:px-12 sm:py-16 lg:border-r lg:border-[#F5F2ED]/[0.06] xl:px-16 xl:py-20">
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
              // vw maior → encolhe no mobile (cabe "PLATAFORMAS" em 1 linha)
              // sem mexer no teto desktop (continua clampando em 60px).
              fontSize: "clamp(28px,7vw,60px)",
              letterSpacing: "-0.03em",
              lineHeight: 0.95,
              overflowWrap: "break-word",
              ...step(1),
            }}
          >
            {project.title}
          </h1>

          <p
            className="mt-7 max-w-[460px] font-body text-[15px] font-light leading-[1.7] text-cbm-gray-200 sm:text-[17px]"
            style={step(2)}
          >
            {project.description}
          </p>

          <div style={step(3)}>
            <ProjectFacts meta={project.meta} stack={project.stack} />
          </div>
        </div>

        {project.siteUrl && (
          <div className="mt-10" style={step(4)}>
            <CaseLiveButton url={project.siteUrl} />
          </div>
        )}
      </div>

      {/* Visual side — browser frame com o desktop rolando */}
      <div className="relative z-10 flex min-h-[380px] items-center justify-center p-6 sm:p-8 lg:min-h-0">
        <div
          className="w-full max-w-[860px]"
          style={reduce ? {} : {
            opacity: entered ? 1 : 0,
            transform: entered ? "scale(1)" : "scale(0.97)",
            transition:
              "opacity 0.8s ease-out 0.25s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.25s",
          }}
        >
          <BrowserFrame url={project.siteUrl}>
            <div className="aspect-[16/10] w-full">
              <CaseFrameMedia
                videoSrc={project.video?.desktop}
                poster={project.preview?.desktop}
                screenshotSrc={project.preview?.desktop}
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
