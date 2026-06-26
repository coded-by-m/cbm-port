/** Rodapé CTA da vitrine. WhatsApp primário + e-mail secundário. */
const WHATSAPP_NUMBER = "5548999916638"; // +55 48 99991-6638
const EMAIL = "matheusmendes077@gmail.com";

export function GalleryFooter() {
  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Olá! Vi o portfólio da Coded by M e gostaria de conversar sobre um projeto.",
  )}`;
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
          <a
            href={`mailto:${EMAIL}?subject=${encodeURIComponent("Projeto — Coded by M")}`}
            className="text-[0.65rem] uppercase tracking-[0.24em] text-[#F5F2ED]/55 underline-offset-4 transition-colors hover:text-[#F5F2ED] hover:underline focus-visible:text-[#F5F2ED] focus-visible:outline-none"
          >
            ou e-mail
          </a>
        </div>
      </div>
    </footer>
  );
}
