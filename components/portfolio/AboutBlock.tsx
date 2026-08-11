import { Reveal } from "@/components/ui/Reveal";
import { ABOUT_STATEMENT, ABOUT_VALUES, FOUNDER, LOCATION } from "@/data/about";

/** Statement da marca, bloco-assinatura do fundador, localização e valores. */
export function AboutBlock() {
  return (
    <section
      id="sobre"
      data-cursor="default"
      aria-labelledby="portfolio-sobre-headline"
      className="border-y border-cbm-white/10 bg-cbm-forest/40"
    >
      <div className="mx-auto max-w-6xl scroll-mt-16 px-5 py-20 sm:px-8 lg:py-28">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="h-px w-10 bg-cbm-red/70" aria-hidden />
            <p className="font-body text-[0.6rem] font-medium uppercase tracking-[0.4em] text-cbm-white/55">
              Sobre
            </p>
          </div>
          <h2
            id="portfolio-sobre-headline"
            className="mt-6 max-w-3xl font-display text-[clamp(1.25rem,2.6vw,2.1rem)] font-semibold leading-[1.32] tracking-[-0.015em] text-cbm-white"
          >
            {ABOUT_STATEMENT}
          </h2>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-10 max-w-lg border-l-2 border-cbm-red/45 pl-6">
            <p className="font-display text-[1.05rem] font-semibold text-cbm-white">
              {FOUNDER.name}
            </p>
            <p className="mt-1 font-body text-[0.65rem] font-medium uppercase tracking-[0.3em] text-cbm-white/45">
              {FOUNDER.role}
            </p>
            <p className="mt-4 font-body text-[0.95rem] font-light leading-relaxed text-cbm-white/65">
              {FOUNDER.bio}
            </p>
            <div className="mt-5 flex items-center gap-2.5">
              <span
                aria-hidden
                className="block h-[7px] w-[7px] rotate-45 bg-cbm-red"
              />
              <p className="font-body text-[0.7rem] font-medium uppercase tracking-[0.25em] text-cbm-white/50">
                {LOCATION}
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden border border-cbm-white/10 bg-cbm-white/10 sm:grid-cols-3">
          {ABOUT_VALUES.map((value, i) => (
            <Reveal key={value.title} delay={i * 90} className="bg-cbm-black">
              <div className="h-full p-7">
                <p className="font-display text-[0.6rem] font-semibold tabular-nums tracking-[0.3em] text-cbm-red/70">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-3 font-display text-[clamp(1.1rem,1.7vw,1.4rem)] font-medium tracking-[-0.01em] text-cbm-white">
                  {value.title}
                </p>
                <p className="mt-2 font-body text-[0.85rem] font-light leading-relaxed text-cbm-white/55">
                  {value.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
