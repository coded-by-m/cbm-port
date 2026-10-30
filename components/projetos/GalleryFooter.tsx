import Link from "next/link";
import { waLink } from "@/lib/contact";
import { publishedPosts } from "@/data/blog";

/** Links internos do rodapé: serviços, vitrine, sobre e blog (se houver artigo). */
const LINKS = [
  { href: "/landing-page", label: "Criação de landing page" },
  { href: "/site-institucional", label: "Site institucional" },
  { href: "/sites-para-arquitetura", label: "Sites para arquitetura" },
  { href: "/projetos", label: "Projetos" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
  ...(publishedPosts().length ? [{ href: "/blog", label: "Blog" }] : []),
];

/**
 * Rodapé CTA da vitrine e das páginas de serviço. WhatsApp no botão,
 * /contato na navegação, e os serviços linkados. `current` omite a página
 * em que se está.
 */
export function GalleryFooter({ current }: { current?: string }) {
  const waHref = waLink(
    "Olá! Vi o portfólio da Coded by M e gostaria de conversar sobre um projeto.",
  );
  return (
    <footer data-cm-section="contact" className="mt-20 border-t border-[#F5F2ED]/10">
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
            data-cm-role="whatsapp"
            data-cm-id="gallery-footer-whatsapp"
            className="inline-flex min-h-[44px] items-center gap-2 border border-[#FB3640]/60 bg-[#FB3640]/10 px-6 text-[0.7rem] font-medium uppercase tracking-[0.28em] text-[#F5F2ED] transition-colors duration-300 hover:border-[#FB3640] hover:bg-[#FB3640] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FB3640]"
          >
            Falar no WhatsApp
            <span aria-hidden>↗</span>
          </a>
        </div>
      </div>
      <nav
        aria-label="Serviços"
        className="mx-auto flex max-w-6xl flex-col gap-3 border-t border-[#F5F2ED]/10 px-5 py-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8"
      >
        <span className="text-[0.62rem] uppercase tracking-[0.3em] text-[#F5F2ED]/40">
          Serviços
        </span>
        {LINKS.filter((l) => l.href !== current).map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="text-[0.8rem] text-[#F5F2ED]/65 transition-colors hover:text-[#F5F2ED] focus-visible:text-[#F5F2ED]"
          >
            {l.label}
          </Link>
        ))}
        <span className="text-[0.62rem] uppercase tracking-[0.2em] text-[#F5F2ED]/35 sm:ml-auto">
          Coded by M · Florianópolis - SC
        </span>
      </nav>
    </footer>
  );
}
