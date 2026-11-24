import Link from "next/link";
import { waLink } from "@/lib/contact";
import { TriArrow } from "@/components/ui/TriArrow";
import { PORTFOLIO_WA_MESSAGE } from "@/data/projetos";

const LINK =
  "inline-flex min-h-[44px] items-center gap-1.5 text-[0.62rem] uppercase tracking-[0.24em] text-[#F5F2ED]/60 transition-colors hover:text-[#F5F2ED] focus-visible:text-[#F5F2ED] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F5F2ED]/60";

/**
 * Topo fino e sticky da vitrine e dos artigos. `label` diz onde a pessoa
 * está; no celular ele sai, pra o topo ficar só com a marca e o atalho.
 *
 * O atalho da direita é a experiência imersiva, ou o WhatsApp (`cta`) na
 * `/projetos`, onde chega quem escaneia o cartão: lá contato vale mais que
 * uma cena pesada em WebGL.
 */
export function GalleryHeader({
  label = "Projetos",
  cta = "experiencia",
}: {
  label?: string;
  cta?: "experiencia" | "whatsapp";
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#F5F2ED]/10 bg-cbm-base/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <Link
          href="/"
          className="text-sm tracking-[0.2em] text-[#F5F2ED]"
          style={{ fontFamily: '"Panchang", sans-serif', fontWeight: 600 }}
        >
          ·CbM
        </Link>
        <span className="hidden text-[0.65rem] uppercase tracking-[0.4em] text-cbm-gray-400 sm:inline">
          {label}
        </span>
        {cta === "whatsapp" ? (
          <a
            href={waLink(PORTFOLIO_WA_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className={LINK}
            data-cm-role="whatsapp"
            data-cm-id="projetos-header-whatsapp"
          >
            WhatsApp <span aria-hidden style={{ color: "#FB3640" }}><TriArrow dir="up-right" /></span>
          </a>
        ) : (
          <Link href="/experiencia" className={LINK}>
            experiência <span aria-hidden style={{ color: "#FB3640" }}><TriArrow dir="up-right" /></span>
          </Link>
        )}
      </div>
    </header>
  );
}
