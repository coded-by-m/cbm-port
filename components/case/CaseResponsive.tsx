import type { CaseProject } from "@/types/case";
import { Reveal } from "@/components/case/Reveal";
import { PhoneFrame } from "@/components/case/PhoneFrame";
import { LiveScreenshot } from "@/components/case/LiveScreenshot";
import { LogoMark } from "@/components/ui/LogoMark";

/** Seção que mostra a versão mobile no PhoneFrame (mobile-tall rolando). */
export function CaseResponsive({ project }: { project: CaseProject }) {
  const mobile = project.preview?.mobile;
  if (!mobile) return null;

  return (
    <section
      className="border-b px-6 py-16 sm:px-12 sm:py-20 xl:px-16 xl:py-24"
      style={{ background: "#000F08", borderColor: "rgba(245,242,237,0.06)" }}
    >
      <div className="mx-auto flex max-w-[1100px] flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-center lg:gap-24">
        <Reveal className="max-w-[360px] text-center lg:text-left">
          <div className="mb-6 flex items-center justify-center gap-3 lg:justify-start">
            <span
              className="block h-px w-5 flex-shrink-0"
              style={{ background: "rgba(251,54,64,0.4)" }}
            />
            <p className="font-display text-[9px] font-semibold uppercase tracking-[0.4em] text-cbm-red/70">
              Responsivo
            </p>
          </div>
          <h2
            className="font-display font-bold tracking-[-0.02em] text-cbm-white"
            style={{ fontSize: "clamp(22px,2.6vw,32px)", lineHeight: 1.1 }}
          >
            Pensado pra qualquer tela.
          </h2>
          <p className="mt-4 font-body text-[14px] font-light leading-[1.78] text-cbm-gray-400">
            A mesma precisão no mobile — layout, hierarquia e performance
            adaptados, sem perder a identidade.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div className="w-[230px] sm:w-[260px]">
            <PhoneFrame>
              <div className="aspect-[9/16] w-full">
                <LiveScreenshot
                  src={mobile}
                  alt={`${project.title} — site mobile`}
                  durationSec={28}
                  fallback={
                    <div className="flex h-full w-full items-center justify-center bg-[#070B08] opacity-20">
                      <LogoMark size={32} />
                    </div>
                  }
                />
              </div>
            </PhoneFrame>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
