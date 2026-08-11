import { Reveal } from "@/components/ui/Reveal";
import { PROCESS_STEPS } from "@/data/process";

/**
 * As 4 etapas do método em linha horizontal numerada. Vertical no mobile.
 *
 * A linha que liga as etapas é estática; a progressão é lida pela entrada
 * escalonada das etapas (`Reveal` com delay crescente). CSS sozinho não sabe
 * quando o bloco entrou no viewport, e o spec reserva o GSAP pro hero.
 */
export function ProcessSteps() {
  return (
    <section
      id="processo"
      data-cursor="default"
      aria-labelledby="portfolio-processo-headline"
      className="mx-auto max-w-6xl scroll-mt-16 px-5 py-20 sm:px-8 lg:py-28"
    >
      <Reveal>
        <div className="flex items-center gap-4">
          <span className="h-px w-10 bg-cbm-red/70" aria-hidden />
          <p className="font-body text-[0.6rem] font-medium uppercase tracking-[0.4em] text-cbm-white/55">
            Método
          </p>
        </div>
        <h2
          id="portfolio-processo-headline"
          className="mt-6 max-w-2xl font-display text-[clamp(1.5rem,3.4vw,2.6rem)] font-bold leading-[1.1] tracking-[-0.025em] text-cbm-white"
        >
          Todo projeto percorre o mesmo caminho.
        </h2>
      </Reveal>

      <div className="relative mt-16">
        {/* Linha condutora: horizontal no desktop, vertical no mobile. */}
        <span
          aria-hidden
          className="absolute left-[5px] top-2 h-[calc(100%-1rem)] w-px bg-cbm-white/12 md:left-0 md:top-[5px] md:h-px md:w-full"
        />

        <ol className="grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-8">
          {PROCESS_STEPS.map((step, i) => (
            <li key={step.num} className="relative pl-8 md:pl-0 md:pt-8">
              <span
                aria-hidden
                className="absolute left-0 top-[3px] block h-2.5 w-2.5 rotate-45 bg-cbm-red md:top-0"
              />
              <Reveal delay={i * 80}>
                <p className="font-display text-[0.62rem] font-semibold tabular-nums tracking-[0.3em] text-cbm-red/75">
                  {step.num}
                </p>
                <h3 className="mt-2.5 font-display text-[clamp(1.15rem,1.8vw,1.45rem)] font-semibold tracking-[-0.01em] text-cbm-white">
                  {step.title}
                </h3>
                <p className="mt-2.5 font-body text-[0.88rem] font-light leading-relaxed text-cbm-white/60">
                  {step.desc}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
