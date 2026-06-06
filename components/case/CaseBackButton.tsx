import Link from "next/link";

/**
 * Botão fixo de voltar à Paisagem — disponível em qualquer ponto do case
 * (flutua sobre as seções), pra o usuário não precisar rolar até o fim.
 */
export function CaseBackButton() {
  return (
    <Link
      href="/"
      aria-label="Voltar à Paisagem Digital"
      className="fixed left-5 top-5 z-50 inline-flex items-center gap-2 border border-[#F5F2ED]/15 bg-[#000F08]/70 px-3.5 py-2 font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-cbm-gray-200 backdrop-blur-md transition-colors duration-200 hover:border-[#FB3640]/60 hover:text-cbm-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#F5F2ED]"
    >
      <span aria-hidden className="text-[#FB3640]">
        ←
      </span>
      Paisagem
    </Link>
  );
}
