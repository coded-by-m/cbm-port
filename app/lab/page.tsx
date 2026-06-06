"use client";

import { useState, type ComponentType } from "react";
import dynamic from "next/dynamic";
import { EXPERIMENTS, STAGE_LABEL, STAGE_ORDER } from "@/lib/experiments";

/**
 * Experimentos ativos usam WebGL e só devem montar no cliente.
 * `ssr: false` evita renderizar o Canvas no servidor.
 */
const EXPERIMENT_COMPONENTS: Record<string, ComponentType> = {
  "opening-sequence": dynamic(
    () =>
      import("@/components/zones/OpeningSequence").then(
        (m) => m.OpeningSequence,
      ),
    { ssr: false },
  ),
  pyramid: dynamic(
    () =>
      import("@/components/zones/Pyramid").then((m) => m.Pyramid),
    { ssr: false },
  ),
  "triangle-loader": dynamic(
    () => import("@/components/zones/TriangleLoader").then((m) => m.TriangleLoader),
    { ssr: false },
  ),
  "triangle-lines": dynamic(
    () => import("@/components/zones/TriangleLines").then((m) => m.TriangleLines),
    { ssr: false },
  ),
  "terrain-mesh": dynamic(
    () => import("@/components/zones/TerrainMesh").then((m) => m.TerrainMesh),
    { ssr: false },
  ),
  "project-fragments": dynamic(
    () =>
      import("@/components/zones/ProjectFragments").then(
        (m) => m.ProjectFragments,
      ),
    { ssr: false },
  ),
  "html-overlay": dynamic(
    () => import("@/components/zones/HtmlOverlay").then((m) => m.HtmlOverlay),
    { ssr: false },
  ),
  "scroll-camera": dynamic(
    () => import("@/components/zones/ScrollCamera").then((m) => m.ScrollCamera),
    { ssr: false },
  ),
  "problem-section": dynamic(
    () =>
      import("@/components/zones/ProblemSection").then((m) => m.ProblemSection),
    { ssr: false },
  ),
  "services-section": dynamic(
    () =>
      import("@/components/zones/ServicesSection").then((m) => m.ServicesSection),
    { ssr: false },
  ),
  "process-section": dynamic(
    () =>
      import("@/components/zones/ProcessSection").then((m) => m.ProcessSection),
    { ssr: false },
  ),
  "lab-section": dynamic(
    () => import("@/components/zones/LabSection").then((m) => m.LabSection),
    { ssr: false },
  ),
  "about-section": dynamic(
    () => import("@/components/zones/AboutSection").then((m) => m.AboutSection),
    { ssr: false },
  ),
  "cta-section": dynamic(
    () => import("@/components/zones/CTASection").then((m) => m.CTASection),
    { ssr: false },
  ),
};

/**
 * /lab — Experience Lab.
 *
 * Central de experimentos da Coded by M. Valida riscos técnicos antes do
 * site principal. Mostra o experimento ativo como camada 3D ao fundo, permite
 * alternar entre os experimentos prontos e lista os próximos como overlay.
 */
export default function LabPage() {
  const ready = EXPERIMENTS.filter((experiment) => experiment.status === "ready");
  const planned = EXPERIMENTS.filter(
    (experiment) => experiment.status === "planned",
  );

  const [activeSlug, setActiveSlug] = useState(ready[0]?.slug ?? "");
  const active = ready.find((experiment) => experiment.slug === activeSlug);
  const ActiveExperiment = EXPERIMENT_COMPONENTS[activeSlug];

  // Agrupa por estágio mantendo a ordem canônica da jornada.
  const readyByStage = STAGE_ORDER.map((stage) => ({
    stage,
    items: ready.filter((experiment) => experiment.stage === stage),
  })).filter((group) => group.items.length > 0);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#000F08] text-neutral-200">
      {/* Camada 3D — experimento ativo (remonta ao trocar de experimento) */}
      {ActiveExperiment && <ActiveExperiment key={activeSlug} />}

      {/* Camada de conteúdo — HTML overlay */}
      <div className="pointer-events-none relative z-10 flex min-h-screen flex-col justify-between p-6 sm:p-10">
        <header className="flex items-start justify-between gap-6">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.4em] text-neutral-500">
              Coded by M
            </p>
            <h1 className="mt-2 text-sm font-light uppercase tracking-[0.3em] text-neutral-300">
              Experience Lab
            </h1>
          </div>
          <p className="max-w-[15rem] text-right text-[0.65rem] leading-relaxed text-neutral-600">
            Validação de riscos técnicos antes do site principal.
          </p>
        </header>

        <footer className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          {active && (
            <div className="max-w-sm">
              <p className="text-[0.6rem] uppercase tracking-[0.35em] text-neutral-500">
                Experimento ativo
              </p>
              <p className="mt-2 text-base font-light tracking-wide text-neutral-100">
                {active.title}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-neutral-500">
                {active.description}
              </p>

              {/* Experimentos agrupados pela ordem da jornada da home. */}
              <div className="pointer-events-auto mt-5 flex flex-col gap-3">
                {readyByStage.map((group) => (
                  <div key={group.stage} className="flex flex-col gap-1.5">
                    <p className="text-[0.55rem] uppercase tracking-[0.35em] text-neutral-600">
                      {STAGE_LABEL[group.stage]}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((experiment) => {
                        const isActive = experiment.slug === activeSlug;
                        return (
                          <button
                            key={experiment.slug}
                            type="button"
                            onClick={() => setActiveSlug(experiment.slug)}
                            aria-pressed={isActive}
                            className={`rounded-sm border px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.25em] transition-colors ${
                              isActive
                                ? "border-neutral-400 text-neutral-100"
                                : "border-neutral-800 text-neutral-500 hover:border-neutral-600 hover:text-neutral-300"
                            }`}
                          >
                            {experiment.title}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {planned.length > 0 && (
            <ul className="flex flex-col gap-1.5 sm:text-right">
              <li className="mb-1 text-[0.6rem] uppercase tracking-[0.35em] text-neutral-600">
                Próximos experimentos
              </li>
              {planned.map((experiment) => (
                <li
                  key={experiment.slug}
                  className="text-xs tracking-wide text-neutral-600"
                >
                  {experiment.title}
                </li>
              ))}
            </ul>
          )}
        </footer>
      </div>
    </main>
  );
}
