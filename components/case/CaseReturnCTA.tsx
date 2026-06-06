import Link from "next/link";
import { Reveal } from "@/components/case/Reveal";
import { CaseLiveButton } from "@/components/case/CaseLiveButton";

export function CaseReturnCTA({ siteUrl }: { siteUrl?: string }) {
  return (
    <section
      className="flex flex-col items-center justify-center gap-6 px-8 py-32 text-center"
      style={{
        background: "#000F08",
        borderTop: "1px solid rgba(245,242,237,0.06)",
      }}
    >
      <Reveal className="flex flex-col items-center gap-6">
        <p className="font-display text-[9px] font-semibold uppercase tracking-[0.4em] text-cbm-red/60">
          {siteUrl ? "Veja ao vivo" : "Continuar Explorando"}
        </p>

        <h2
          className="font-display font-black text-cbm-white"
          style={{
            fontSize: "clamp(28px,3.5vw,44px)",
            letterSpacing: "-0.025em",
            lineHeight: 1.05,
          }}
        >
          {siteUrl ? (
            <>
              Nada substitui
              <br />
              ver funcionando
            </>
          ) : (
            <>
              Voltar à
              <br />
              Paisagem Digital
            </>
          )}
        </h2>

        <p className="max-w-[340px] font-body text-[14px] font-light leading-[1.75] text-cbm-gray-400">
          {siteUrl
            ? "Abra o projeto no ar e navegue pelo resultado final."
            : "Mais projetos aguardam na travessia. Cada fragmento é um trabalho construído."}
        </p>

        {siteUrl && (
          <div className="mt-2">
            <CaseLiveButton url={siteUrl} />
          </div>
        )}

        <Link
          href="/#projetos"
          className="mt-2 font-display text-[11px] font-semibold uppercase tracking-[0.15em] text-cbm-gray-400 transition-colors duration-200 hover:text-cbm-white focus-visible:outline focus-visible:outline-[1.5px] focus-visible:outline-white/20 focus-visible:outline-offset-[5px]"
        >
          ← Voltar à Paisagem
        </Link>
      </Reveal>
    </section>
  );
}
