import Link from "next/link";

/** Topo fino e sticky da vitrine. Link de volta pra Paisagem imersiva. */
export function GalleryHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#F5F2ED]/10 bg-[#000F08]/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <Link
          href="/"
          className="text-sm tracking-[0.2em] text-[#F5F2ED]"
          style={{ fontFamily: '"Panchang", sans-serif', fontWeight: 600 }}
        >
          ·CbM
        </Link>
        <span className="text-[0.65rem] uppercase tracking-[0.4em] text-[#F5F2ED]/45">
          Projetos
        </span>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[0.62rem] uppercase tracking-[0.24em] text-[#F5F2ED]/60 transition-colors hover:text-[#F5F2ED] focus-visible:text-[#F5F2ED] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F5F2ED]/60"
        >
          experiência <span aria-hidden style={{ color: "#FB3640" }}>↗</span>
        </Link>
      </div>
    </header>
  );
}
