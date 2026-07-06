import { waLink } from "@/lib/contact";

/** Rodapé CTA da vitrine. WhatsApp como único canal de contato. */
export function GalleryFooter() {
  const waHref = waLink(
    "Olá! Vi o portfólio da Coded by M e gostaria de conversar sobre um projeto.",
  );
  return (
    <footer className="mt-20 border-t border-[#F5F2ED]/10">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-5 py-14 md:flex-row md:items-center md:justify-between">
        <p
          className="text-2xl leading-tight text-[#F5F2ED]"
          style={{ fontFamily: '"Panchang", sans-serif', fontWeight: 500 }}
        >
          Tem um projeto em mente?
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 border border-[#FB3640]/60 bg-[#FB3640]/10 px-6 text-[0.7rem] font-medium uppercase tracking-[0.28em] text-[#F5F2ED] transition-colors duration-300 hover:border-[#FB3640] hover:bg-[#FB3640] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FB3640]"
          >
            Falar no WhatsApp
            <span aria-hidden>↗</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
