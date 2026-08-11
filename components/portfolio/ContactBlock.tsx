import { Reveal } from "@/components/ui/Reveal";
import { LogoMark } from "@/components/ui/LogoMark";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, waLink } from "@/lib/contact";

/** Fechamento: um convite direto, WhatsApp e Instagram. Sem formulário. */
export function ContactBlock() {
  return (
    <section
      id="contato"
      data-cursor="default"
      aria-labelledby="portfolio-contato-headline"
      className="mx-auto max-w-6xl scroll-mt-16 px-5 py-24 text-center sm:px-8 lg:py-32"
    >
      <Reveal>
        <div className="flex justify-center">
          <LogoMark size={34} />
        </div>
        <h2
          id="portfolio-contato-headline"
          className="mx-auto mt-9 max-w-2xl font-display text-[clamp(1.6rem,4vw,3rem)] font-bold leading-[1.08] tracking-[-0.025em] text-cbm-white"
        >
          Vamos construir a sua.
        </h2>
        <p className="mx-auto mt-5 max-w-md font-body text-[clamp(0.92rem,1.3vw,1.05rem)] font-light leading-relaxed text-cbm-white/60">
          Conta o que você tem em mente. Respondo com um diagnóstico honesto —
          e, se fizer sentido, com uma proposta.
        </p>
      </Reveal>

      <Reveal delay={140}>
        <div className="mt-11 flex flex-wrap items-center justify-center gap-4">
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="triangle"
            className="inline-flex items-center gap-2.5 bg-cbm-red px-8 py-4 font-display text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-cbm-white transition-colors hover:bg-cbm-red-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cbm-red"
          >
            Falar no WhatsApp
            <span aria-hidden>↗</span>
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="triangle"
            className="inline-flex items-center gap-2 border border-cbm-white/15 px-7 py-4 font-body text-[0.66rem] uppercase tracking-[0.2em] text-cbm-white/70 transition-colors hover:border-cbm-red hover:text-cbm-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cbm-red"
          >
            {INSTAGRAM_HANDLE}
          </a>
        </div>
      </Reveal>

      <p className="mt-16 font-body text-[0.6rem] uppercase tracking-[0.3em] text-cbm-white/30">
        Coded by M · Florianópolis, Brasil
      </p>
    </section>
  );
}
