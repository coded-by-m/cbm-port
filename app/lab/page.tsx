"use client";

import dynamic from "next/dynamic";
import { EXPERIMENTS } from "@/lib/experiments";

/**
 * O experimento ativo usa WebGL e só deve montar no cliente.
 * `ssr: false` evita renderizar o Canvas no servidor.
 */
const TriangleLoader = dynamic(
  () => import("@/components/lab/TriangleLoader").then((m) => m.TriangleLoader),
  { ssr: false },
);

/**
 * /lab — Experience Lab.
 *
 * Central de experimentos da Coded by M. Valida riscos técnicos antes do
 * site principal. Mostra o experimento ativo (Triangle Loader) como camada
 * 3D ao fundo e os próximos experimentos como overlay HTML discreto.
 */
export default function LabPage() {
  const active = EXPERIMENTS.find((experiment) => experiment.status === "ready");
  const planned = EXPERIMENTS.filter(
    (experiment) => experiment.status === "planned",
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-neutral-200">
      {/* Camada 3D — experimento ativo */}
      <TriangleLoader />

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
            </div>
          )}

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
        </footer>
      </div>
    </main>
  );
}
