import { Reveal } from "@/components/ui/Reveal";
import { SERVICES } from "@/data/services";

/**
 * Os 3 serviços como cards de texto: índice, título, descrição e os 5
 * `includes`. Sem as mini-cenas 3D da Home — aqui a leitura é rápida.
 */
export function ServicesList() {
  return (
    <section
      id="servicos"
      data-cursor="default"
      aria-labelledby="portfolio-servicos-headline"
      className="border-y border-cbm-white/10 bg-cbm-forest/40"
    >
      <div className="mx-auto max-w-6xl scroll-mt-16 px-5 py-20 sm:px-8 lg:py-28">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="h-px w-10 bg-cbm-red/70" aria-hidden />
            <p className="font-body text-[0.6rem] font-medium uppercase tracking-[0.4em] text-cbm-white/55">
              Serviços
            </p>
          </div>
          <h2
            id="portfolio-servicos-headline"
            className="mt-6 max-w-2xl font-display text-[clamp(1.5rem,3.4vw,2.6rem)] font-bold leading-[1.1] tracking-[-0.025em] text-cbm-white"
          >
            Do site de uma página ao sistema inteiro.
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden border border-cbm-white/10 bg-cbm-white/10 lg:grid-cols-3">
          {SERVICES.map((service, i) => (
            <Reveal key={service.slug} delay={i * 90} className="bg-cbm-black">
              <article className="group h-full p-8 transition-colors duration-300 hover:bg-cbm-forest">
                <span
                  aria-hidden
                  className="mb-6 block h-2.5 w-2.5 border-r border-t border-cbm-red opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
                <p className="font-display text-[0.62rem] font-semibold tabular-nums tracking-[0.3em] text-cbm-red/75">
                  {service.index}
                </p>
                <h3 className="mt-3 font-display text-[clamp(1.2rem,1.9vw,1.55rem)] font-semibold tracking-[-0.01em] text-cbm-white">
                  {service.title}
                </h3>
                <p className="mt-3 font-body text-[0.92rem] font-light leading-relaxed text-cbm-white/60">
                  {service.description}
                </p>

                <ul className="mt-7 space-y-2.5">
                  {service.includes.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 font-body text-[0.82rem] font-light text-cbm-white/55"
                    >
                      <span
                        aria-hidden
                        className="mt-[7px] block h-[5px] w-[5px] flex-shrink-0 rotate-45 bg-cbm-red/70"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
